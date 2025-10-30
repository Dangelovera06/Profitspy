# ProfitSpy

A powerful web platform that helps marketers discover, analyze, and recreate winning advertising campaigns from Meta's advertising ecosystem using Apify's scraper - no Meta API access required!

![Platform Preview](https://via.placeholder.com/800x400?text=ProfitSpy)

## 🌟 Features

- **Apify Scraper Integration**: Fetch ads using Apify's powerful scraper - no Meta API approval needed!
- **Smart Performance Scoring**: Automatically calculate performance scores based on impressions, spend efficiency, and engagement metrics
- **Advanced Filtering**: Search and filter ads by keyword, creator, status, performance score, and more
- **Beautiful Modern UI**: Clean, responsive black & white interface with animated backgrounds
- **Detailed Analytics**: View comprehensive ad details, targeting information, and performance metrics
- **Recreation Scripts**: Generate ad recreation scripts with one click
- **Real-time Sync**: Manual synchronization with configurable ad limits
- **Organized Data**: SQLite database for efficient storage and retrieval of ad data

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Apify API Token (free tier: $5/month credits) - [Get yours here](https://console.apify.com/account/integrations)

## 🚀 Quick Start

### 1. Clone or navigate to the project

```bash
cd /tmp/meta-ads-platform
```

### 2. Install dependencies

```bash
npm run install-all
```

This will install dependencies for both the backend and frontend.

### 3. Configure the backend

Create a `.env` file in the `backend` directory with your Apify API token:

```bash
cd backend
```

Create `.env` file:

```env
# Apify Configuration
# Get your token from: https://console.apify.com/account/integrations
APIFY_API_TOKEN=your_apify_token_here

# Server Configuration
PORT=3001

# Optional: Enable automatic background syncing (uses credits)
ENABLE_AUTO_SYNC=false
SYNC_INTERVAL=60
```

**📖 For detailed Apify setup instructions, see [APIFY_SETUP.md](./APIFY_SETUP.md)**

### 4. Start the application

From the root directory:

```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:3001`
- Frontend on `http://localhost:3000`

## 🔑 Getting an Apify API Token

1. Sign up for a free account at [Apify](https://apify.com/)
2. Go to [Account Integrations](https://console.apify.com/account/integrations)
3. Copy your Personal API token
4. Add it to your backend `.env` file as `APIFY_API_TOKEN`

**Free Tier Benefits:**
- $5 in free monthly credits
- Approximately 50-100 ad scrapes per month
- No Meta API approval process required
- No Facebook developer account needed

**Detailed setup guide: [APIFY_SETUP.md](./APIFY_SETUP.md)**

## 📁 Project Structure

```
meta-ads-platform/
├── backend/
│   ├── database/
│   │   ├── db.js              # Database initialization and queries
│   │   └── ads.db             # SQLite database (created automatically)
│   ├── routes/
│   │   └── ads.js             # API routes for ads
│   ├── services/
│   │   ├── apifyAdsService.js # Apify scraper integration
│   │   └── metaAdsService.js  # Legacy Meta API (deprecated)
│   ├── server.js              # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Header.jsx
│   │   │   ├── AdCard.jsx
│   │   │   ├── Filters.jsx
│   │   │   └── StatsOverview.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdDetail.jsx
│   │   │   └── SyncAds.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Ads Endpoints

#### Get All Ads
```http
GET /api/ads?page=1&limit=20&sortBy=performance_score&order=DESC
```

Query Parameters:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `sortBy` (string): Sort field (performance_score, ad_delivery_start_time, engagement_rate)
- `order` (string): Sort order (ASC, DESC)
- `status` (string): Filter by status (ACTIVE, INACTIVE)
- `search` (string): Search in ad content
- `minScore` (number): Minimum performance score

#### Get Single Ad
```http
GET /api/ads/:id
```

#### Get Statistics
```http
GET /api/ads/stats/overview
```

#### Sync Ads
```http
POST /api/sync
Content-Type: application/json

{
  "searchTerms": "fitness",
  "country": "US",
  "maxAds": 50
}
```

## 🎯 Performance Score Calculation

The platform automatically calculates a performance score (0-100) for each ad based on:

1. **Impressions** (up to 50 points): Higher impression counts indicate better reach
2. **Spend Efficiency** (up to 30 points): Ratio of impressions to spend
3. **Ad Longevity** (10 points): Still-running ads likely perform well
4. **Geographic Reach** (up to 10 points): Broader audience targeting

## 🎨 Frontend Features

### Dashboard
- Grid view of all ads with performance metrics
- Real-time statistics overview
- Advanced filtering and sorting
- Pagination for large datasets

### Ad Detail Page
- Complete ad creative content (titles, body, descriptions)
- Performance metrics visualization
- Targeting information (locations, age, gender, platforms)
- Direct link to view the original ad on Meta

### Sync Page
- Manual ad synchronization via Apify scraper
- Country, keyword, and ad limit configuration
- Real-time sync status updates (typically 30-120 seconds)
- In-app setup instructions with links

## 🔧 Configuration Options

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APIFY_API_TOKEN` | Your Apify API token | Required |
| `PORT` | Backend server port | 3001 |
| `ENABLE_AUTO_SYNC` | Enable automatic syncing | false |
| `SYNC_INTERVAL` | Auto-sync interval (minutes) | 60 |

### Automatic Sync

Automatic sync is **disabled by default** to conserve Apify credits. Set `ENABLE_AUTO_SYNC=true` in your `.env` file to enable hourly automatic syncing. Manual sync via the UI is recommended.

## 📊 Database Schema

### Ads Table
Stores comprehensive ad data including:
- Ad creative content (titles, bodies, descriptions, captions)
- Delivery dates and status
- Performance metrics (impressions, spend, engagement)
- Targeting information (locations, demographics, platforms)
- Calculated performance scores

### Ad Categories Table
For future categorization and organization features

### Saved Ads Table
For future user bookmarking functionality

## 🚀 Deployment

### Backend Deployment

1. Choose a hosting platform (Heroku, DigitalOcean, AWS, etc.)
2. Set environment variables
3. Run `npm start` in the backend directory

### Frontend Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

3. Update the API proxy configuration in production

## 🔒 Security Considerations

- **Never commit your `.env` file** or expose your Apify API token
- Use environment variables for all sensitive configuration
- Implement rate limiting for production API
- Add authentication for user-specific features
- Monitor Apify usage to avoid unexpected charges
- Regularly rotate API tokens

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Style
The project follows standard JavaScript/React conventions:
- ESLint for linting
- Prettier for formatting

## 📝 Future Enhancements

- [ ] User authentication and saved ad collections
- [ ] Advanced analytics and trend analysis
- [ ] Export ads to CSV/PDF
- [ ] AI-powered ad copywriting suggestions
- [ ] Competitor analysis features
- [ ] Email notifications for new high-performing ads
- [ ] Integration with other ad platforms (Google Ads, TikTok)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [Apify](https://apify.com/) for providing the Meta Ads scraper
- Meta Ads Library for public ad data
- React and Vite for the frontend framework
- Express.js for the backend API
- SQLite for lightweight data storage
- [shadcn/ui](https://ui.shadcn.com/) for UI component inspiration

## 📞 Support

For issues or questions:
1. Check the [APIFY_SETUP.md](./APIFY_SETUP.md) guide
2. Review [Apify documentation](https://docs.apify.com/)
3. Check the troubleshooting section above
4. Open an issue in the project repository

## 🐛 Troubleshooting

### "APIFY_API_TOKEN not configured"
- Ensure you've created a `.env` file in the `backend` directory
- Get your token from: https://console.apify.com/account/integrations
- Verify there are no extra spaces in your token
- Restart the backend server after adding the token

### "Apify scraper timeout"
- Reduce the `maxAds` parameter (try 20-30 instead of 100)
- Check your Apify account has available credits
- Try again in a few minutes (temporary Apify service issue)

### "No ads found"
- Run a manual sync from the Sync page
- Try broader search terms or leave search empty
- Verify the selected country has ads in the library
- Check Apify service status

### Database errors
- Delete the `backend/database/ads.db` file and restart the server
- The database will be recreated automatically

### Frontend not connecting to backend
- Ensure the backend is running on port 3001
- Check the proxy configuration in `frontend/vite.config.js`
- Verify CORS settings in the backend

**For more detailed troubleshooting, see [APIFY_SETUP.md](./APIFY_SETUP.md)**

---

**Built with ❤️ for marketers and advertisers**

