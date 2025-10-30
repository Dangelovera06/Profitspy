const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all ads with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'performance_score',
      order = 'DESC',
      status,
      search,
      searchType = 'keyword',
      minScore
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let params = [];

    // Filter by status
    if (status) {
      whereConditions.push('ad_status = ?');
      params.push(status);
    }

    // Filter by minimum performance score
    if (minScore) {
      whereConditions.push('performance_score >= ?');
      params.push(parseFloat(minScore));
    }

    // Search based on type
    if (search) {
      const searchPattern = `%${search}%`;
      
      if (searchType === 'creator' || searchType === 'advertiser') {
        // Search by page name (advertiser/creator)
        whereConditions.push('page_name LIKE ?');
        params.push(searchPattern);
      } else {
        // Default keyword search - search in ad content
        whereConditions.push(`(
          page_name LIKE ? OR 
          ad_creative_bodies LIKE ? OR 
          ad_creative_link_titles LIKE ? OR
          ad_creative_link_descriptions LIKE ?
        )`);
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ['performance_score', 'ad_delivery_start_time', 'page_name', 'engagement_rate'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'performance_score';
    const validOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM ads ${whereClause}`;
    const countResult = await db.get(countQuery, params);
    const total = countResult.total;

    // Get ads
    const adsQuery = `
      SELECT * FROM ads 
      ${whereClause}
      ORDER BY ${validSortBy} ${validOrder}
      LIMIT ? OFFSET ?
    `;
    const ads = await db.query(adsQuery, [...params, parseInt(limit), offset]);

    // Parse JSON fields
    const parsedAds = ads.map(ad => ({
      ...ad,
      ad_creative_bodies: safeJsonParse(ad.ad_creative_bodies),
      ad_creative_link_captions: safeJsonParse(ad.ad_creative_link_captions),
      ad_creative_link_titles: safeJsonParse(ad.ad_creative_link_titles),
      ad_creative_link_descriptions: safeJsonParse(ad.ad_creative_link_descriptions),
      publisher_platforms: safeJsonParse(ad.publisher_platforms),
      target_locations: safeJsonParse(ad.target_locations),
      languages: safeJsonParse(ad.languages)
    }));

    res.json({
      data: parsedAds,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single ad by ID
router.get('/:id', async (req, res) => {
  try {
    const ad = await db.get('SELECT * FROM ads WHERE id = ?', [req.params.id]);
    
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    // Parse JSON fields
    const parsedAd = {
      ...ad,
      ad_creative_bodies: safeJsonParse(ad.ad_creative_bodies),
      ad_creative_link_captions: safeJsonParse(ad.ad_creative_link_captions),
      ad_creative_link_titles: safeJsonParse(ad.ad_creative_link_titles),
      ad_creative_link_descriptions: safeJsonParse(ad.ad_creative_link_descriptions),
      age_country_gender_reach_breakdown: safeJsonParse(ad.age_country_gender_reach_breakdown),
      demographic_distribution: safeJsonParse(ad.demographic_distribution),
      publisher_platforms: safeJsonParse(ad.publisher_platforms),
      target_locations: safeJsonParse(ad.target_locations),
      languages: safeJsonParse(ad.languages)
    };

    res.json(parsedAd);
  } catch (error) {
    console.error('Error fetching ad:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_ads,
        COUNT(CASE WHEN ad_status = 'ACTIVE' THEN 1 END) as active_ads,
        COUNT(CASE WHEN ad_status = 'INACTIVE' THEN 1 END) as inactive_ads,
        AVG(performance_score) as avg_performance_score,
        COUNT(DISTINCT page_name) as unique_advertisers
      FROM ads
    `);

    const topPerformers = await db.query(`
      SELECT page_name, COUNT(*) as ad_count, AVG(performance_score) as avg_score
      FROM ads
      GROUP BY page_name
      ORDER BY avg_score DESC
      LIMIT 10
    `);

    res.json({
      overview: stats[0],
      topPerformers
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to safely parse JSON
function safeJsonParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return jsonString;
  }
}

module.exports = router;


// Seed sample data endpoint (for demo purposes)
router.post('/seed-sample-data', async (req, res) => {
  try {
    const sampleAds = [
      {
        id: 'sample_001', page_name: 'Nike',
        ad_creative_bodies: '["Just Do It. Find your greatness with our latest collection of performance wear."]',
        ad_creative_link_titles: '["New Nike Air Collection - Shop Now"]',
        ad_creative_link_descriptions: '["Discover innovative designs and superior comfort"]',
        ad_delivery_start_time: '2024-10-01T00:00:00Z', ad_snapshot_url: 'https://www.facebook.com/ads/library',
        impressions: '500000-1000000', spend: '15000-20000', currency: 'USD',
        publisher_platforms: '["facebook","instagram"]', target_locations: '["United States","Canada"]',
        target_ages: '18-45', ad_status: 'ACTIVE', performance_score: 87.5, engagement_rate: 8.2
      },
      {
        id: 'sample_002', page_name: 'Shopify',
        ad_creative_bodies: '["Start your online business today. Join over 1 million entrepreneurs worldwide."]',
        ad_creative_link_titles: '["Start Your Free Trial - No Credit Card Required"]',
        ad_creative_link_descriptions: '["Build your dream store in minutes"]',
        ad_delivery_start_time: '2024-09-15T00:00:00Z', ad_snapshot_url: 'https://www.facebook.com/ads/library',
        impressions: '1000000-5000000', spend: '25000-50000', currency: 'USD',
        publisher_platforms: '["facebook","instagram","audience_network"]',
        target_locations: '["United States","United Kingdom","Australia"]',
        target_ages: '25-54', ad_status: 'ACTIVE', performance_score: 92.3, engagement_rate: 12.5
      },
      {
        id: 'sample_003', page_name: 'Planet Fitness',
        ad_creative_bodies: '["$10 a month. No commitment. Judgment Free Zone. Join today!"]',
        ad_creative_link_titles: '["Join Planet Fitness - Limited Time Offer"]',
        ad_creative_link_descriptions: '["Your fitness journey starts here"]',
        ad_delivery_start_time: '2024-10-10T00:00:00Z', ad_snapshot_url: 'https://www.facebook.com/ads/library',
        impressions: '250000-500000', spend: '8000-12000', currency: 'USD',
        publisher_platforms: '["facebook","instagram"]', target_locations: '["United States"]',
        target_ages: '18-35', ad_status: 'ACTIVE', performance_score: 78.9, engagement_rate: 6.4
      },
      {
        id: 'sample_004', page_name: 'Grammarly',
        ad_creative_bodies: '["Write with confidence. Grammarly helps you communicate more effectively."]',
        ad_creative_link_titles: '["Get Grammarly Premium - 30% Off"]',
        ad_creative_link_descriptions: '["AI-powered writing assistant trusted by millions"]',
        ad_delivery_start_time: '2024-09-20T00:00:00Z', ad_delivery_stop_time: '2024-10-20T00:00:00Z',
        ad_snapshot_url: 'https://www.facebook.com/ads/library',
        impressions: '750000-1000000', spend: '18000-22000', currency: 'USD',
        publisher_platforms: '["facebook","instagram"]',
        target_locations: '["United States","Canada","United Kingdom"]',
        target_ages: '25-54', ad_status: 'INACTIVE', performance_score: 85.2, engagement_rate: 9.8
      },
      {
        id: 'sample_005', page_name: 'HelloFresh',
        ad_creative_bodies: '["Fresh ingredients delivered to your door. Cook delicious meals in 30 minutes or less."]',
        ad_creative_link_titles: '["Get $100 Off Your First Box"]',
        ad_creative_link_descriptions: '["America Number 1 Meal Kit"]',
        ad_delivery_start_time: '2024-10-05T00:00:00Z', ad_snapshot_url: 'https://www.facebook.com/ads/library',
        impressions: '2000000-5000000', spend: '35000-45000', currency: 'USD',
        publisher_platforms: '["facebook","instagram"]', target_locations: '["United States"]',
        target_ages: '25-44', ad_status: 'ACTIVE', performance_score: 89.7, engagement_rate: 11.2
      },
      {
        id: 'sample_006', page_name: 'Notion',
        ad_creative_bodies: '["One workspace. Every team. Get everyone working in a single tool designed to be flexible."]',
        ad_creative_link_titles: '["Try Notion for Free"]',
        ad_creative_link_descriptions: '["The all-in-one workspace for your notes, tasks, wikis, and databases"]',
        ad_delivery_start_time: '2024-09-25T00:00:00Z', ad_snapshot_url: 'https://www.facebook.com/ads/library',
        impressions: '500000-1000000', spend: '12000-18000', currency: 'USD',
        publisher_platforms: '["facebook","instagram"]',
        target_locations: '["United States","Canada","United Kingdom","Australia"]',
        target_ages: '22-45', ad_status: 'ACTIVE', performance_score: 91.4, engagement_rate: 13.6
      }
    ];

    for (const ad of sampleAds) {
      await db.run(
        'INSERT OR REPLACE INTO ads (id, page_name, ad_creative_bodies, ad_creative_link_titles, ad_creative_link_descriptions, ad_delivery_start_time, ad_delivery_stop_time, ad_snapshot_url, impressions, spend, currency, publisher_platforms, target_locations, target_ages, ad_status, performance_score, engagement_rate, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
        [ad.id, ad.page_name, ad.ad_creative_bodies, ad.ad_creative_link_titles, ad.ad_creative_link_descriptions,
         ad.ad_delivery_start_time, ad.ad_delivery_stop_time || null, ad.ad_snapshot_url, ad.impressions, ad.spend,
         ad.currency, ad.publisher_platforms, ad.target_locations, ad.target_ages, ad.ad_status,
         ad.performance_score, ad.engagement_rate]
      );
    }

    res.json({ message: `Successfully added ${sampleAds.length} sample ads!`, count: sampleAds.length });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ error: error.message });
  }
});

