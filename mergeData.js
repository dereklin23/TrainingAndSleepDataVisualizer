import fetch from "node-fetch";
import "dotenv/config";

const OURA_ACCESS_TOKEN = process.env.OURA_ACCESS_TOKEN;
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
let STRAVA_REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;

// Refresh Strava token
async function refreshStravaToken() {
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: STRAVA_REFRESH_TOKEN,
    }),
  });
  const data = await res.json();
  STRAVA_REFRESH_TOKEN = data.refresh_token;
  return data.access_token;
}

// Fetch Strava runs
async function getStravaActivities() {
  const accessToken = await refreshStravaToken();
  const res = await fetch(
    "https://www.strava.com/api/v3/athlete/activities?per_page=200",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  return (data || [])
    .filter(a => a.type === "Run")
    .map(a => ({
      date: a.start_date_local.split("T")[0],
      distance: a.distance, // meters
    }));
}

// Fetch Oura sleep for a date range
async function getOuraSleep(start, end) {
  const res = await fetch(
    `https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${start}&end_date=${end}`,
    { headers: { Authorization: `Bearer ${OURA_ACCESS_TOKEN}` } }
  );
  const data = await res.json();
  return (data.data || []).map(s => ({
    date: s.day,
    sleep_seconds: s.contributors.total_sleep, // total sleep in seconds
    sleep_score: s.score
  }));
}

// Merge runs + sleep for December 2025
export default async function mergeData() {
  const runs = await getStravaActivities();
  const sleep = await getOuraSleep("2025-12-01", "2025-12-31");

  const merged = {};

  // Initialize with sleep
  sleep.forEach(s => {
    merged[s.date] = { sleep: s, runs: [] };
  });

  // Merge runs
  runs.forEach(r => {
    if (!merged[r.date]) merged[r.date] = { sleep: null, runs: [] };
    merged[r.date].runs.push(r);
  });

  // Sort by date
  return Object.fromEntries(
    Object.entries(merged).sort(([a], [b]) => a.localeCompare(b))
  );
}
