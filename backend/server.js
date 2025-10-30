require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const db = require('./database/db');
// Switch to Apify scraper instead of Meta's official API
const apifyAdsService = require('./services/apifyAdsService');
const adsRoutes = require('./routes/ads');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
db.init();

// Routes
app.use('/api/ads', adsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sync endpoint (manual trigger) - now using Apify scraper
app.post('/api/sync', async (req, res) => {
  try {
    const { searchTerms, country, maxAds = 100 } = req.body;
    const count = await apifyAdsService.syncAds(searchTerms, country, maxAds);
    res.json({ 
      message: `Successfully synced ${count} ads from Apify`, 
      count: count 
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Schedule automatic sync (runs every hour by default)
// Note: Apify has usage limits, adjust interval accordingly
const syncInterval = process.env.SYNC_INTERVAL || 60;
if (process.env.ENABLE_AUTO_SYNC === 'true') {
  cron.schedule(`*/${syncInterval} * * * *`, async () => {
    console.log('Running scheduled ad sync via Apify...');
    try {
      await apifyAdsService.syncAds('', 'US', 50); // Smaller batch for auto-sync
      console.log('Scheduled sync completed');
    } catch (error) {
      console.error('Scheduled sync error:', error);
    }
  });
  console.log(`Automatic sync enabled, running every ${syncInterval} minutes`);
} else {
  console.log('Automatic sync disabled. Set ENABLE_AUTO_SYNC=true in .env to enable.');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using Apify scraper for ad data`);
});

