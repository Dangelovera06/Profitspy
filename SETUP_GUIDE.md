# Setup Guide - Meta Ads Discovery Platform

This guide will walk you through setting up the Meta Ads Discovery Platform step by step.

## Prerequisites Check

Before you begin, ensure you have:

- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] A Meta for Developers account
- [ ] Basic familiarity with terminal/command line

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
# Navigate to the project directory
cd /tmp/meta-ads-platform

# Install all dependencies (root, backend, and frontend)
npm run install-all
```

This command will:
1. Install root dependencies (concurrently)
2. Install backend dependencies (express, axios, sqlite3, etc.)
3. Install frontend dependencies (react, vite, etc.)

Expected output: No errors, lots of npm install logs

### Step 2: Get Your Meta Access Token

#### Option A: Using Graph API Explorer (Quick)

1. Go to https://developers.facebook.com/tools/explorer/
2. Select an app (or create one if needed)
3. Click "Generate Access Token"
4. Copy the token

**Note:** This token expires in 1-2 hours. Good for testing only.

#### Option B: Generate Long-Lived Token (Recommended)

1. Go to https://developers.facebook.com/
2. Create or select your app
3. Navigate to Settings > Basic
4. Note your App ID and App Secret
5. Use the token exchange endpoint:

```bash
curl -X GET "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

This will give you a token that lasts ~60 days.

### Step 3: Configure Backend

```bash
# Navigate to backend directory
cd backend

# Copy the example environment file
cp .env.example .env

# Open .env in your editor
# On Mac/Linux:
nano .env
# Or use your preferred editor (vim, code, etc.)
```

Update the `.env` file:

```env
META_ACCESS_TOKEN=YOUR_ACTUAL_TOKEN_HERE
META_API_VERSION=v19.0
PORT=3001
NODE_ENV=development
DB_PATH=./database/ads.db
SYNC_INTERVAL=60
```

**Important:** Replace `YOUR_ACTUAL_TOKEN_HERE` with your actual Meta access token!

### Step 4: Start the Application

```bash
# Go back to root directory
cd /tmp/meta-ads-platform

# Start both backend and frontend
npm run dev
```

You should see:
```
[0] Server running on port 3001
[1] VITE v5.x.x ready in xxx ms
[1] ➜  Local:   http://localhost:3000/
```

### Step 5: Sync Your First Ads

1. Open your browser to http://localhost:3000
2. You'll see an empty dashboard (no ads yet)
3. Click "Sync Ads" in the navigation
4. Configure your first sync:
   - Search Terms: Leave empty or try "fitness", "marketing", etc.
   - Country: Select "United States (US)" or your preference
5. Click "Sync Ads"
6. Wait for the sync to complete (may take 10-30 seconds)
7. Navigate back to the Dashboard

You should now see ads!

## Verification Checklist

After setup, verify everything works:

- [ ] Backend is running on http://localhost:3001
- [ ] Frontend is running on http://localhost:3000
- [ ] No errors in terminal
- [ ] Dashboard loads successfully
- [ ] You can sync ads from the Sync page
- [ ] Ads appear on the dashboard
- [ ] You can click on an ad to view details
- [ ] Filtering and sorting work

## Common Setup Issues

### Issue: "META_ACCESS_TOKEN not configured"

**Solution:**
- Check that you created `.env` file in the `backend` directory (not root)
- Verify the token is set correctly with no extra spaces
- Make sure you restarted the server after adding the token

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
cd backend
npm install
```

### Issue: Frontend shows blank page

**Solution:**
- Check browser console for errors (F12 > Console)
- Verify backend is running on port 3001
- Clear browser cache and reload

### Issue: "EADDRINUSE: address already in use"

**Solution:**
- Another process is using the port
- Kill the process or change ports in .env and vite.config.js

```bash
# Find and kill process on port 3001 (Mac/Linux)
lsof -ti:3001 | xargs kill -9

# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: No ads syncing

**Possible causes:**
1. Invalid or expired Meta access token
2. Meta API rate limiting
3. No ads match your search criteria

**Solution:**
- Try syncing without search terms
- Check Meta API status
- Generate a new access token
- Try a different country

## Testing Your Setup

### Test 1: Backend Health Check

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-..."}
```

### Test 2: Manual API Sync

```bash
curl -X POST http://localhost:3001/api/sync \
  -H "Content-Type: application/json" \
  -d '{"searchTerms":"fitness","country":"US"}'
```

### Test 3: Check Database

```bash
# Install sqlite3 command line tool if needed
# Then check the database
sqlite3 backend/database/ads.db "SELECT COUNT(*) FROM ads;"
```

Should return the number of synced ads.

## Development Tips

### Watching Logs

**Backend logs:**
Terminal will show all Express server logs, including:
- API requests
- Sync operations
- Database queries
- Errors

**Frontend logs:**
- Open browser Developer Tools (F12)
- Check Console tab for React logs and errors

### Database Management

View your data:
```bash
cd backend/database
sqlite3 ads.db

# Inside sqlite:
.tables              # List all tables
SELECT * FROM ads LIMIT 5;  # View sample ads
.exit               # Exit sqlite
```

### Resetting Everything

If things get messy:
```bash
# Stop all processes (Ctrl+C)

# Remove database
rm backend/database/ads.db

# Remove node_modules
rm -rf node_modules backend/node_modules frontend/node_modules

# Reinstall
npm run install-all

# Start fresh
npm run dev
```

## Next Steps

Once everything is working:

1. **Customize the sync:** Try different search terms and countries
2. **Explore filters:** Use the dashboard filters to find specific ads
3. **Check performance scores:** Sort by performance to find top ads
4. **Analyze ad creative:** Click into ads to see detailed targeting and copy
5. **Set up auto-sync:** Adjust SYNC_INTERVAL in .env for automatic updates

## Getting Help

If you're still stuck:

1. Check the main README.md for more details
2. Review the Meta Ads Library API docs: https://www.facebook.com/ads/library/api/
3. Check that your Node.js version is 16+
4. Try the troubleshooting steps above
5. Look for error messages in terminal and browser console

## Production Deployment

Ready to deploy? See the Deployment section in README.md for:
- Hosting recommendations
- Environment configuration
- Security best practices
- Database migrations

---

**Setup complete? Start discovering amazing ads! 🚀**

