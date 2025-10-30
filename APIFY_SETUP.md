# Apify Integration Setup Guide

ProfitSpy now uses [Apify's Meta Ads Scraper](https://apify.com/curious_coder/meta-ads-scraper) instead of Meta's official API. This provides better reliability and doesn't require Meta API access.

## Prerequisites

1. **Apify Account**: Create a free account at [https://apify.com/](https://apify.com/)
2. **Apify API Token**: Get your token from [https://console.apify.com/account/integrations](https://console.apify.com/account/integrations)

## Step 1: Get Your Apify API Token

1. Go to [https://console.apify.com/account/integrations](https://console.apify.com/account/integrations)
2. Click on "Personal API tokens" section
3. Copy your existing token or create a new one
4. Keep this token secure - you'll need it in the next step

## Step 2: Configure Backend

1. Navigate to the `backend` directory
2. Create a `.env` file (or edit the existing one)
3. Add your Apify API token:

```bash
# Apify Configuration
APIFY_API_TOKEN=your_apify_api_token_here

# Server Configuration (optional)
PORT=3001

# Automatic Sync (optional - recommended to keep disabled)
ENABLE_AUTO_SYNC=false
SYNC_INTERVAL=60
```

4. Replace `your_apify_api_token_here` with your actual token

## Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 3001
Using Apify scraper for ad data
```

## Step 4: Test the Integration

1. Go to the "Sync Ads" page in your app
2. Enter search terms (e.g., "fitness", "ecommerce")
3. Select a country
4. Click "Sync Ads"
5. Wait for the scraper to run (typically 30-120 seconds)
6. Check the Dashboard for newly synced ads

## Pricing & Limits

### Free Tier
- $5 in free credits per month
- Plenty for testing and small projects
- Approximately 50-100 ad scrapes per month

### Paid Plans
- Pay-as-you-go: $0.25 per 1,000 platform credits
- Each scrape run costs varies based on number of ads
- Monitor usage at: [https://console.apify.com/billing](https://console.apify.com/billing)

## Troubleshooting

### Error: "APIFY_API_TOKEN not configured"
- Make sure your `.env` file is in the `backend` directory
- Verify the token is correctly copied (no extra spaces)
- Restart your backend server after adding the token

### Error: "Apify scraper timeout"
- Try reducing the `maxAds` parameter
- Check Apify's status page for outages
- Verify your account has available credits

### No ads returned
- The search terms might be too specific
- Try broader keywords or leave search empty
- Check if the selected country has ads in the library

### Rate limits
- Apify has rate limits based on your plan
- Reduce scraping frequency if hitting limits
- Disable automatic sync (`ENABLE_AUTO_SYNC=false`)

## Advantages Over Meta API

✅ **No Meta Developer Account Required**  
✅ **No App Review Process**  
✅ **More Reliable Scraping**  
✅ **Better Data Quality**  
✅ **Easier Setup**  
✅ **No Complex OAuth**  

## Support

- **Apify Documentation**: [https://docs.apify.com/](https://docs.apify.com/)
- **Actor Docs**: [https://apify.com/curious_coder/meta-ads-scraper](https://apify.com/curious_coder/meta-ads-scraper)
- **Apify Support**: [https://apify.com/contact](https://apify.com/contact)

## Environment Variables Reference

```bash
# Required
APIFY_API_TOKEN=your_token_here

# Optional
PORT=3001                      # Backend server port
ENABLE_AUTO_SYNC=false         # Enable automatic background syncing
SYNC_INTERVAL=60               # Minutes between automatic syncs
```

## Notes

- The old `META_ACCESS_TOKEN` is no longer needed
- Automatic sync is disabled by default to save credits
- Manual sync via the UI is the recommended approach
- Each sync can fetch up to 100 ads (configurable)

