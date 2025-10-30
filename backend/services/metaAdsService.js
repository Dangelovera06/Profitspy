const axios = require('axios');
const db = require('../database/db');

const META_API_BASE = 'https://graph.facebook.com';
const API_VERSION = process.env.META_API_VERSION || 'v19.0';
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

class MetaAdsService {
  /**
   * Search for ads using the Meta Ads Library API
   * @param {string} searchTerms - Keywords to search for
   * @param {string} adReachedCountries - Country code (e.g., 'US', 'GB')
   * @param {number} limit - Number of ads to fetch
   */
  async searchAds(searchTerms = '', adReachedCountries = 'US', limit = 100) {
    if (!ACCESS_TOKEN) {
      throw new Error('META_ACCESS_TOKEN not configured in .env file');
    }

    try {
      const params = {
        access_token: ACCESS_TOKEN,
        ad_reached_countries: adReachedCountries,
        ad_active_status: 'ALL',
        limit: limit,
        fields: [
          'id',
          'ad_creative_bodies',
          'ad_creative_link_captions',
          'ad_creative_link_titles',
          'ad_creative_link_descriptions',
          'ad_delivery_start_time',
          'ad_delivery_stop_time',
          'ad_snapshot_url',
          'age_country_gender_reach_breakdown',
          'bylines',
          'currency',
          'demographic_distribution',
          'estimated_audience_size',
          'impressions',
          'languages',
          'page_id',
          'page_name',
          'publisher_platforms',
          'spend',
          'target_ages',
          'target_gender',
          'target_locations'
        ].join(',')
      };

      if (searchTerms) {
        params.search_terms = searchTerms;
      }

      const response = await axios.get(
        `${META_API_BASE}/${API_VERSION}/ads_archive`,
        { params }
      );

      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching ads from Meta API:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Calculate a performance score based on available metrics
   */
  calculatePerformanceScore(ad) {
    let score = 0;
    
    // Factors that contribute to performance score:
    
    // 1. Impressions (higher is better)
    if (ad.impressions) {
      const impressionValue = this.parseMetricValue(ad.impressions);
      score += Math.min(impressionValue / 100000, 50); // Max 50 points
    }

    // 2. Spend efficiency (spend vs impressions ratio)
    if (ad.spend && ad.impressions) {
      const spendValue = this.parseMetricValue(ad.spend);
      const impressionValue = this.parseMetricValue(ad.impressions);
      if (spendValue > 0) {
        const efficiency = impressionValue / spendValue;
        score += Math.min(efficiency / 100, 30); // Max 30 points
      }
    }

    // 3. Ad longevity (still running ads are likely performing well)
    if (ad.ad_delivery_start_time && !ad.ad_delivery_stop_time) {
      score += 10;
    }

    // 4. Geographic reach
    if (ad.age_country_gender_reach_breakdown) {
      try {
        const breakdown = JSON.parse(ad.age_country_gender_reach_breakdown);
        score += Math.min(breakdown.length * 2, 10); // Max 10 points
      } catch (e) {}
    }

    return Math.min(score, 100); // Cap at 100
  }

  /**
   * Parse metric values that come as ranges (e.g., "1000-5000")
   */
  parseMetricValue(value) {
    if (!value) return 0;
    
    if (typeof value === 'number') return value;
    
    if (typeof value === 'string') {
      // Handle ranges like "1000-5000"
      if (value.includes('-')) {
        const parts = value.split('-');
        const min = parseInt(parts[0]) || 0;
        const max = parseInt(parts[1]) || 0;
        return (min + max) / 2; // Return average
      }
      return parseInt(value.replace(/[^0-9]/g, '')) || 0;
    }
    
    return 0;
  }

  /**
   * Save ads to database
   */
  async saveAds(ads) {
    for (const ad of ads) {
      try {
        const performanceScore = this.calculatePerformanceScore(ad);
        const impressions = this.parseMetricValue(ad.impressions);
        const spend = this.parseMetricValue(ad.spend);
        const engagementRate = spend > 0 ? (impressions / spend) : 0;

        const adStatus = ad.ad_delivery_stop_time ? 'INACTIVE' : 'ACTIVE';

        await db.run(`
          INSERT OR REPLACE INTO ads (
            id,
            ad_creative_bodies,
            ad_creative_link_captions,
            ad_creative_link_titles,
            ad_creative_link_descriptions,
            ad_delivery_start_time,
            ad_delivery_stop_time,
            ad_snapshot_url,
            age_country_gender_reach_breakdown,
            bylines,
            currency,
            demographic_distribution,
            estimated_audience_size,
            impressions,
            languages,
            page_id,
            page_name,
            publisher_platforms,
            spend,
            target_ages,
            target_gender,
            target_locations,
            ad_status,
            performance_score,
            engagement_rate,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [
          ad.id,
          JSON.stringify(ad.ad_creative_bodies || []),
          JSON.stringify(ad.ad_creative_link_captions || []),
          JSON.stringify(ad.ad_creative_link_titles || []),
          JSON.stringify(ad.ad_creative_link_descriptions || []),
          ad.ad_delivery_start_time,
          ad.ad_delivery_stop_time,
          ad.ad_snapshot_url,
          JSON.stringify(ad.age_country_gender_reach_breakdown || []),
          ad.bylines,
          ad.currency,
          JSON.stringify(ad.demographic_distribution || []),
          ad.estimated_audience_size,
          typeof ad.impressions === 'object' ? JSON.stringify(ad.impressions) : ad.impressions,
          JSON.stringify(ad.languages || []),
          ad.page_id,
          ad.page_name,
          JSON.stringify(ad.publisher_platforms || []),
          typeof ad.spend === 'object' ? JSON.stringify(ad.spend) : ad.spend,
          ad.target_ages,
          ad.target_gender,
          JSON.stringify(ad.target_locations || []),
          adStatus,
          performanceScore,
          engagementRate
        ]);
      } catch (error) {
        console.error(`Error saving ad ${ad.id}:`, error.message);
      }
    }
  }

  /**
   * Sync ads from Meta API to database
   */
  async syncAds(searchTerms = '', country = 'US') {
    console.log(`Syncing ads with search terms: "${searchTerms}", country: ${country}`);
    
    try {
      const ads = await this.searchAds(searchTerms, country);
      console.log(`Fetched ${ads.length} ads from Meta API`);
      
      await this.saveAds(ads);
      console.log(`Saved ${ads.length} ads to database`);
      
      return ads.length;
    } catch (error) {
      console.error('Sync error:', error.message);
      throw error;
    }
  }
}

module.exports = new MetaAdsService();

