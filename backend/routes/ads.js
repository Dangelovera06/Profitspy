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

    // Search in ad content and page name
    if (search) {
      whereConditions.push(`(
        page_name LIKE ? OR 
        ad_creative_bodies LIKE ? OR 
        ad_creative_link_titles LIKE ?
      )`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
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

