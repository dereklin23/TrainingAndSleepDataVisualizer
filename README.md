# Training & Sleep Data Visualizer

A web application that visualizes training data from Strava and sleep/readiness data from Oura Ring, providing insights into the relationship between fitness and recovery.

## Features

- **Running Metrics**: Distance, pace, heart rate, and cadence tracking
- **Sleep Analysis**: Total sleep, light/REM/deep sleep breakdown, and sleep scores
- **Readiness Scores**: Daily readiness metrics from Oura Ring
- **Interactive Charts**: 
  - Sleep breakdown (stacked bar chart)
  - Running metrics (distance, pace, heart rate, cadence)
- **Date Range Selection**: View data for custom date ranges or use quick presets (Last 7 Days, Last 30 Days, This Month, Last Month)
- **Summary Statistics**: Key metrics at a glance including averages, totals, and crowns

## Project Structure

```
strava-oura/
├── src/                          # Backend source code
│   ├── apiServer.js             # Express API server
│   └── services/                # Service layer
│       └── fitnessDataService.js # Data fetching & merging service
├── public/                       # Frontend files
│   ├── dashboard.html           # Main dashboard (entry point)
│   ├── index.html               # Redirect to dashboard.html
│   └── app.js                   # Frontend application logic
├── package.json                  # NPM configuration
└── README.md                    # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Strava API credentials (Client ID, Client Secret, Refresh Token)
- Oura Ring API access token

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dereklin23/TrainingAndSleepDataVisualizer.git
   cd TrainingAndSleepDataVisualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory with the following:
   ```env
   OURA_ACCESS_TOKEN=your_oura_access_token
   STRAVA_CLIENT_ID=your_strava_client_id
   STRAVA_CLIENT_SECRET=your_strava_client_secret
   STRAVA_REFRESH_TOKEN=your_strava_refresh_token
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   Or directly:
   ```bash
   node src/apiServer.js
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## API Endpoints

### GET `/data`

Fetches merged fitness and sleep data for a specified date range.

**Query Parameters:**
- `startDate` (optional): Start date in YYYY-MM-DD format (default: last 7 days)
- `endDate` (optional): End date in YYYY-MM-DD format (default: today)

**Example:**
```
GET /data?startDate=2025-12-01&endDate=2025-12-31
```

**Response:**
```json
[
  {
    "date": "2025-12-01",
    "distance": 5.2,
    "sleep": "7h 30m",
    "light": "4h 15m",
    "rem": "2h 10m",
    "deep": "1h 5m",
    "sleepScore": 85,
    "readinessScore": 82,
    "pace": 7.5,
    "averageHeartrate": 155,
    "maxHeartrate": 172,
    "cadence": 168
  }
]
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, Chart.js
- **APIs**: Strava API, Oura Ring API
- **Data Fetching**: node-fetch

## Data Sources

- **Strava**: Running activities, distance, pace, heart rate, cadence
- **Oura Ring**: Sleep duration, sleep stages, sleep scores, readiness scores

## License

ISC
