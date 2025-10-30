const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname);
const dbPath = process.env.DB_PATH || path.join(dbDir, 'ads.db');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

const init = () => {
  db.serialize(() => {
    // Ads table
    db.run(`
      CREATE TABLE IF NOT EXISTS ads (
        id TEXT PRIMARY KEY,
        ad_creative_bodies TEXT,
        ad_creative_link_captions TEXT,
        ad_creative_link_titles TEXT,
        ad_creative_link_descriptions TEXT,
        ad_delivery_start_time TEXT,
        ad_delivery_stop_time TEXT,
        ad_snapshot_url TEXT,
        age_country_gender_reach_breakdown TEXT,
        bylines TEXT,
        currency TEXT,
        demographic_distribution TEXT,
        estimated_audience_size TEXT,
        impressions TEXT,
        languages TEXT,
        page_id TEXT,
        page_name TEXT,
        publisher_platforms TEXT,
        spend TEXT,
        target_ages TEXT,
        target_gender TEXT,
        target_locations TEXT,
        ad_status TEXT,
        performance_score REAL DEFAULT 0,
        engagement_rate REAL DEFAULT 0,
        media_type TEXT,
        images TEXT,
        videos TEXT,
        landing_page_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better query performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_page_name ON ads(page_name)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_ad_status ON ads(ad_status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_performance_score ON ads(performance_score DESC)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_delivery_start ON ads(ad_delivery_start_time)`);

    // Categories/Tags table for organizing ads
    db.run(`
      CREATE TABLE IF NOT EXISTS ad_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ad_id TEXT,
        category TEXT,
        FOREIGN KEY (ad_id) REFERENCES ads(id),
        UNIQUE(ad_id, category)
      )
    `);

    // User saved ads (for future functionality)
    db.run(`
      CREATE TABLE IF NOT EXISTS saved_ads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ad_id TEXT,
        user_id TEXT,
        notes TEXT,
        saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ad_id) REFERENCES ads(id)
      )
    `);

    console.log('Database initialized');
  });
};

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

module.exports = {
  init,
  query,
  run,
  get,
  db
};

