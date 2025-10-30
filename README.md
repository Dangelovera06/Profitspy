# Meta Ads Discovery Platform

A powerful web platform that integrates with the Meta Ads Library API to help marketers discover, analyze, and organize effective advertising campaigns from across Meta's advertising ecosystem.

![Platform Preview](https://via.placeholder.com/800x400?text=Meta+Ads+Discovery+Platform)

## 🌟 Features

- **Meta Ads Library Integration**: Seamlessly fetch ads from Meta's public Ads Library API
- **Smart Performance Scoring**: Automatically calculate performance scores based on impressions, spend efficiency, and engagement metrics
- **Advanced Filtering**: Search and filter ads by keyword, status, performance score, and more
- **Beautiful Modern UI**: Clean, responsive interface built with React
- **Detailed Analytics**: View comprehensive ad details, targeting information, and performance metrics
- **Real-time Sync**: Manual and automatic synchronization of ads from Meta's API
- **Organized Data**: SQLite database for efficient storage and retrieval of ad data

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Meta Access Token (from Facebook for Developers)

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

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file and add your Meta access token:

```env
# Meta Ads Library API Configuration
META_ACCESS_TOKEN=your_actual_token_here
META_API_VERSION=v19.0

# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DB_PATH=./database/ads.db

# Sync Configuration (in minutes)
SYNC_INTERVAL=60
```

### 4. Start the application

From the root directory:

```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:3001`
- Frontend on `http://localhost:3000`

## 🔑 Getting a Meta Access Token

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create an app or use an existing one
3. Navigate to Tools > Graph API Explorer
4. Select your app and generate an access token with appropriate permissions
5. For production use, generate a long-lived token

**Required Permissions:**
- `ads_read` (if available)
- Access to the Ads Library API endpoint

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
│   │   └── metaAdsService.js  # Meta API integration
│   ├── server.js              # Express server
│   ├── package.json
│   └── .env.example
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
  "country": "US"
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
- Manual ad synchronization from Meta API
- Country and keyword-based search
- Real-time sync status updates
- Helpful setup instructions

## 🔧 Configuration Options

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `META_ACCESS_TOKEN` | Your Meta API access token | Required |
| `META_API_VERSION` | Meta API version | v19.0 |
| `PORT` | Backend server port | 3001 |
| `DB_PATH` | SQLite database path | ./database/ads.db |
| `SYNC_INTERVAL` | Auto-sync interval (minutes) | 60 |

### Automatic Sync

The platform automatically fetches new ads every hour (configurable via `SYNC_INTERVAL`). To disable automatic sync, comment out the cron job in `backend/server.js`.

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

- **Never commit your `.env` file** or expose your Meta access token
- Use environment variables for all sensitive configuration
- Implement rate limiting for production API
- Add authentication for user-specific features
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

- Meta Ads Library API for providing public ad data
- React and Vite for the frontend framework
- Express.js for the backend API
- SQLite for lightweight data storage

## 📞 Support

For issues or questions:
1. Check the [Meta Ads Library API documentation](https://www.facebook.com/ads/library/api/)
2. Review the troubleshooting section below
3. Open an issue in the project repository

## 🐛 Troubleshooting

### "META_ACCESS_TOKEN not configured"
- Ensure you've created a `.env` file in the `backend` directory
- Verify your access token is valid and not expired

### "No ads found"
- Run a manual sync from the Sync page
- Check that your Meta access token has the correct permissions
- Verify your search parameters aren't too restrictive

### Database errors
- Delete the `backend/database/ads.db` file and restart the server
- The database will be recreated automatically

### Frontend not connecting to backend
- Ensure the backend is running on port 3001
- Check the proxy configuration in `frontend/vite.config.js`
- Verify CORS settings in the backend

---

**Built with ❤️ for marketers and advertisers**

