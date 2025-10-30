const db = require('./database/db');

const sampleAds = [
  {
    id: 'sample_001',
    page_name: 'Nike',
    ad_creative_bodies: '["Just Do It. Find your greatness with our latest collection of performance wear."]',
    ad_creative_link_titles: '["New Nike Air Collection - Shop Now"]',
    ad_creative_link_descriptions: '["Discover innovative designs and superior comfort"]',
    ad_delivery_start_time: '2024-10-01T00:00:00Z',
    ad_snapshot_url: 'https://www.facebook.com/ads/library',
    impressions: '500000-1000000',
    spend: '15000-20000',
    currency: 'USD',
    publisher_platforms: '["facebook","instagram"]',
    target_locations: '["United States","Canada"]',
    target_ages: '18-45',
    ad_status: 'ACTIVE',
    performance_score: 87.5,
    engagement_rate: 8.2
  },
  {
    id: 'sample_002',
    page_name: 'Shopify',
    ad_creative_bodies: '["Start your online business today. Join over 1 million entrepreneurs worldwide."]',
    ad_creative_link_titles: '["Start Your Free Trial - No Credit Card Required"]',
    ad_creative_link_descriptions: '["Build your dream store in minutes"]',
    ad_delivery_start_time: '2024-09-15T00:00:00Z',
    ad_snapshot_url: 'https://www.facebook.com/ads/library',
    impressions: '1000000-5000000',
    spend: '25000-50000',
    currency: 'USD',
    publisher_platforms: '["facebook","instagram","audience_network"]',
    target_locations: '["United States","United Kingdom","Australia"]',
    target_ages: '25-54',
    ad_status: 'ACTIVE',
    performance_score: 92.3,
    engagement_rate: 12.5
  },
  {
    id: 'sample_003',
    page_name: 'Planet Fitness',
    ad_creative_bodies: '["$10 a month. No commitment. Judgment Free Zone. Join today!"]',
    ad_creative_link_titles: '["Join Planet Fitness - Limited Time Offer"]',
    ad_creative_link_descriptions: '["Your fitness journey starts here"]',
    ad_delivery_start_time: '2024-10-10T00:00:00Z',
    ad_snapshot_url: 'https://www.facebook.com/ads/library',
    impressions: '250000-500000',
    spend: '8000-12000',
    currency: 'USD',
    publisher_platforms: '["facebook","instagram"]',
    target_locations: '["United States"]',
    target_ages: '18-35',
    ad_status: 'ACTIVE',
    performance_score: 78.9,
    engagement_rate: 6.4
  },
  {
    id: 'sample_004',
    page_name: 'Grammarly',
    ad_creative_bodies: '["Write with confidence. Grammarly helps you communicate more effectively."]',
    ad_creative_link_titles: '["Get Grammarly Premium - 30% Off"]',
    ad_creative_link_descriptions: '["AI-powered writing assistant trusted by millions"]',
    ad_delivery_start_time: '2024-09-20T00:00:00Z',
    ad_delivery_stop_time: '2024-10-20T00:00:00Z',
    ad_snapshot_url: 'https://www.facebook.com/ads/library',
    impressions: '750000-1000000',
    spend: '18000-22000',
    currency: 'USD',
    publisher_platforms: '["facebook","instagram"]',
    target_locations: '["United States","Canada","United Kingdom"]',
    target_ages: '25-54',
    ad_status: 'INACTIVE',
    performance_score: 85.2,
    engagement_rate: 9.8
  },
  {
    id: 'sample_005',
    page_name: 'HelloFresh',
    ad_creative_bodies: '["Fresh ingredients delivered to your door. Cook delicious meals in 30 minutes or less."]',
    ad_creative_link_titles: '["Get $100 Off Your First Box"]',
    ad_creative_link_descriptions: '["America #1 Meal Kit"]',
    ad_delivery_start_time: '2024-10-05T00:00:00Z',
    ad_snapshot_url: 'https://www.facebook.com/ads/library',
    impressions: '2000000-5000000',
    spend: '35000-45000',
    currency: 'USD',
    publisher_platforms: '["facebook","instagram"]',
    target_locations: '["United States"]',
    target_ages: '25-44',
    ad_status: 'ACTIVE',
    performance_score: 89.7,
    engagement_rate: 11.2
  },
  {
    id: 'sample_006',
    page_name: 'Notion',
    ad_creative_bodies: '["One workspace. Every team. Get everyone working in a single tool designed to be flexible."]',
    ad_creative_link_titles: '["Try Notion for Free"]',
    ad_creative_link_descriptions: '["The all-in-one workspace for your notes, tasks, wikis, and databases"]',
    ad_delivery_start_time: '2024-09-25T00:00:00Z',
    ad_snapshot_url: 'https://www.facebook.com/ads/library',
    impressions: '500000-1000000',
    spend: '12000-18000',
    currency: 'USD',
    publisher_platforms: '["facebook","instagram"]',
    target_locations: '["United States","Canada","United Kingdom","Australia"]',
    target_ages: '22-45',
    ad_status: 'ACTIVE',
    performance_score: 91.4,
    engagement_rate: 13.6
  }
];

async function seedDatabase() {
  console.log('🌱 Starting to seed database with sample ads...');

  try {
    db.init();
    await new Promise(resolve => setTimeout(resolve, 1000));

    for (const ad of sampleAds) {
      const sql = 'INSERT OR REPLACE INTO ads (id, page_name, ad_creative_bodies, ad_creative_link_titles, ad_creative_link_descriptions, ad_delivery_start_time, ad_delivery_stop_time, ad_snapshot_url, impressions, spend, currency, publisher_platforms, target_locations, target_ages, ad_status, performance_score, engagement_rate, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)';
      
      await db.run(sql, [
        ad.id, ad.page_name, ad.ad_creative_bodies, ad.ad_creative_link_titles,
        ad.ad_creative_link_descriptions, ad.ad_delivery_start_time,
        ad.ad_delivery_stop_time || null, ad.ad_snapshot_url, ad.impressions,
        ad.spend, ad.currency, ad.publisher_platforms, ad.target_locations,
        ad.target_ages, ad.ad_status, ad.performance_score, ad.engagement_rate
      ]);

      console.log('✅ Added: ' + ad.page_name);
    }

    console.log('\n🎉 Successfully added ' + sampleAds.length + ' sample ads!\n');
    console.log('Try your app at: https://profitspy.netlify.app\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDatabase();
