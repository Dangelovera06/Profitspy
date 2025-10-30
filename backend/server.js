require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const db = require('./database/db');
const metaAdsService = require('./services/metaAdsService');
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

// Sync endpoint (manual trigger)
app.post('/api/sync', async (req, res) => {
  try {
    const { searchTerms, country } = req.body;
    await metaAdsService.syncAds(searchTerms, country);
    res.json({ message: 'Sync completed successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Schedule automatic sync (runs every hour by default)
const syncInterval = process.env.SYNC_INTERVAL || 60;
cron.schedule(`*/${syncInterval} * * * *`, async () => {
  console.log('Running scheduled ad sync...');
  try {
    await metaAdsService.syncAds();
    console.log('Scheduled sync completed');
  } catch (error) {
    console.error('Scheduled sync error:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Automatic sync scheduled every ${syncInterval} minutes`);
});

