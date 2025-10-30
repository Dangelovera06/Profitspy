const axios = require('axios');
const db = require('../database/db');

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_ACTOR_ID = 'CfCwPWpfjpxQhOboS'; // Meta Ads Scraper actor ID
const APIFY_API_BASE = 'https://api.apify.com/v2';

class ApifyAdsService {
  /**
   * Search for ads using Apify Meta Ads Scraper
   * @param {string} searchTerms - Keywords to search for
   * @param {string} country - Country code (e.g., 'US', 'GB')
   * @param {number} maxAds - Maximum number of ads to scrape
   */
  async searchAds(searchTerms = '', country = 'US', maxAds = 100) {
    if (!APIFY_API_TOKEN) {
      throw new Error('APIFY_API_TOKEN not configured in .env file. Get yours at https://console.apify.com/account/integrations');
    }

    try {
      console.log(`Starting Apify scraper with search: "${searchTerms}", country: ${country}, maxAds: ${maxAds}`);
      
      // Prepare input for the Apify actor
      const actorInput = {
        searchTerm: searchTerms || '',
        country: country,
        maxAds: maxAds,
        // Additional parameters you can customize:
        activeStatus: 'ALL', // 'ALL', 'ACTIVE', or 'INACTIVE'
        mediaType: 'ALL', // 'ALL', 'IMAGE', 'VIDEO', 'MEME'
        language: 'ALL',
        // startDate: '2024-01-01', // Optional: Filter by date range
        // endDate: '2024-12-31',
      };

      // Run the actor and wait for results
      const runResponse = await axios.post(
        `${APIFY_API_BASE}/acts/${APIFY_ACTOR_ID}/runs?token=${APIFY_API_TOKEN}&waitForFinish=300`,
        actorInput,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 310000 // 5 minutes + buffer
        }
      );

      const runId = runResponse.data.data.id;
      const defaultDatasetId = runResponse.data.data.defaultDatasetId;

      console.log(`Apify run completed. Run ID: ${runId}, Dataset ID: ${defaultDatasetId}`);

      // Fetch the results from the dataset
      const datasetResponse = await axios.get(
        `${APIFY_API_BASE}/datasets/${defaultDatasetId}/items?token=${APIFY_API_TOKEN}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      const ads = datasetResponse.data;
      console.log(`Fetched ${ads.length} ads from Apify dataset`);
      
      // Log sample of first ad to debug data structure
      if (ads.length > 0) {
        console.log('Sample ad structure:', JSON.stringify(ads[0], null, 2).substring(0, 500));
      }

      // Transform Apify results to match our database schema
      const transformedAds = this.transformApifyAds(ads);
      console.log(`Transformed ${transformedAds.length} ads successfully`);
      
      return transformedAds;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Apify scraper timeout. Try reducing maxAds or try again later.');
      }
      console.error('Error fetching ads from Apify:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch ads from Apify');
    }
  }

  /**
   * Transform Apify ad data to match Meta API format
   */
  transformApifyAds(apifyAds) {
    return apifyAds.map((ad, index) => {
      try {
        // Apify scraper returns similar structure to Meta API
        // but we need to ensure all fields are properly mapped
        
        // Extract images and videos from various possible fields
        const images = ad.images || ad.ad_creative_link_image_hashes || ad.adImages || ad.imageUrls || 
                       ad.cards?.[0]?.thumbnail || ad.snapshot?.images || [];
        const videos = ad.videos || ad.videoUrls || ad.ad_creative_videos || 
                       ad.cards?.[0]?.video || ad.snapshot?.videos || [];
        
        // Determine media type
        let mediaType = 'text';
        if (videos && videos.length > 0) {
          mediaType = 'video';
        } else if (images && images.length > 0) {
          mediaType = 'image';
        }
        
        // Extract landing page URL
        const landingPageUrl = ad.landingPageUrl || ad.linkUrl || ad.ad_creative_link_url || 
                               ad.link || ad.cards?.[0]?.link || null;
      
        return {
          id: ad.id || ad.adid || ad.adArchiveID || `apify_${Date.now()}_${index}`,
          ad_creative_bodies: ad.ad_creative_bodies || ad.adCreativeBodies || ad.body || 
                             ad.adCreativeBody || ad.cards?.[0]?.body || [],
          ad_creative_link_captions: ad.ad_creative_link_captions || ad.linkCaption || 
                                    ad.cards?.[0]?.caption || [],
          ad_creative_link_titles: ad.ad_creative_link_titles || ad.linkTitle || 
                                  ad.cards?.[0]?.title || [],
          ad_creative_link_descriptions: ad.ad_creative_link_descriptions || ad.linkDescription || 
                                        ad.cards?.[0]?.description || [],
          ad_delivery_start_time: ad.ad_delivery_start_time || ad.startDate || ad.deliveryStartTime || 
                                 ad.startedRunningAt,
          ad_delivery_stop_time: ad.ad_delivery_stop_time || ad.endDate || ad.deliveryStopTime || 
                                ad.stoppedRunningAt || null,
          ad_snapshot_url: ad.ad_snapshot_url || ad.snapshotUrl || ad.adArchiveID || ad.adSnapshotURL,
          age_country_gender_reach_breakdown: ad.age_country_gender_reach_breakdown || ad.reachBreakdown || [],
          bylines: ad.bylines || ad.pageName || ad.advertiserName || '',
          currency: ad.currency || 'USD',
          demographic_distribution: ad.demographic_distribution || ad.demographics || [],
          estimated_audience_size: ad.estimated_audience_size || ad.estimatedAudienceSize || 
                                  ad.potentialReach || null,
          impressions: ad.impressions || ad.impressionsLower || ad.spend?.lower_bound || '0',
          languages: ad.languages || ad.targetLanguages || [],
          page_id: ad.page_id || ad.pageId || ad.page?.id || '',
          page_name: ad.page_name || ad.pageName || ad.advertiserName || ad.page?.name || 'Unknown',
          publisher_platforms: ad.publisher_platforms || ad.platforms || ad.publisherPlatforms || [],
          spend: ad.spend || ad.spendLower || ad.spend?.lower_bound || '0',
          target_ages: ad.target_ages || ad.targetAges || ad.ageRange || '',
          target_gender: ad.target_gender || ad.targetGender || 'ALL',
          target_locations: ad.target_locations || ad.targetLocations || ad.geoTargeting || [],
          media_type: mediaType,
          images: Array.isArray(images) ? images : (images ? [images] : []),
          videos: Array.isArray(videos) ? videos : (videos ? [videos] : []),
          landing_page_url: landingPageUrl
        };
      } catch (error) {
        console.error(`Error transforming ad at index ${index}:`, error.message);
        // Return a basic ad structure to avoid losing all data
        return {
          id: `apify_error_${Date.now()}_${index}`,
          ad_creative_bodies: [ad.body || 'No content available'],
          ad_creative_link_captions: [],
          ad_creative_link_titles: [],
          ad_creative_link_descriptions: [],
          ad_delivery_start_time: new Date().toISOString(),
          ad_delivery_stop_time: null,
          ad_snapshot_url: '',
          age_country_gender_reach_breakdown: [],
          bylines: '',
          currency: 'USD',
          demographic_distribution: [],
          estimated_audience_size: null,
          impressions: '0',
          languages: [],
          page_id: '',
          page_name: ad.pageName || ad.advertiserName || 'Unknown',
          publisher_platforms: [],
          spend: '0',
          target_ages: '',
          target_gender: 'ALL',
          target_locations: [],
          media_type: 'text',
          images: [],
          videos: [],
          landing_page_url: null
        };
      }
    });
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
        const breakdown = Array.isArray(ad.age_country_gender_reach_breakdown) 
          ? ad.age_country_gender_reach_breakdown 
          : JSON.parse(ad.age_country_gender_reach_breakdown);
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
    let savedCount = 0;
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
            media_type,
            images,
            videos,
            landing_page_url,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
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
          engagementRate,
          ad.media_type,
          JSON.stringify(ad.images || []),
          JSON.stringify(ad.videos || []),
          ad.landing_page_url
        ]);
        savedCount++;
      } catch (error) {
        console.error(`Error saving ad ${ad.id}:`, error.message);
      }
    }
    return savedCount;
  }

  /**
   * Sync ads from Apify to database
   */
  async syncAds(searchTerms = '', country = 'US', maxAds = 100) {
    console.log(`Syncing ads via Apify with search terms: "${searchTerms}", country: ${country}, maxAds: ${maxAds}`);
    
    try {
      const ads = await this.searchAds(searchTerms, country, maxAds);
      console.log(`Fetched ${ads.length} ads from Apify`);
      
      const savedCount = await this.saveAds(ads);
      console.log(`Saved ${savedCount} ads to database`);
      
      return savedCount;
    } catch (error) {
      console.error('Sync error:', error.message);
      throw error;
    }
  }
}

module.exports = new ApifyAdsService();

