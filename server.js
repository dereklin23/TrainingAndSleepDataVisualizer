import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mergeData from "./mergeData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Serve frontend
app.use(express.static("public", { index: "index.html" }));

function formatSeconds(seconds) {
  if (!seconds || seconds <= 0) return null;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

app.get("/data", async (req, res) => {
  console.log("🔥 /data HIT");

  try {
    const merged = await mergeData();

    const december2025 = Object.entries(merged)
      .filter(([date]) => {
        const d = new Date(date);
        return d.getFullYear() === 2025 && d.getMonth() === 11; // December
      })
      .map(([date, value]) => {
        const totalMeters = value.runs.length
          ? value.runs.reduce((sum, r) => sum + r.distance, 0)
          : 0;

        return {
          date,
          distance: +(totalMeters / 1609.34).toFixed(2), // meters → miles

          sleep: value.sleep ? formatSeconds(value.sleep.total) : null,
          light: value.sleep ? formatSeconds(value.sleep.light) : null,
          rem: value.sleep ? formatSeconds(value.sleep.rem) : null,
          deep: value.sleep ? formatSeconds(value.sleep.deep) : null,

          crown: value.sleep ? value.sleep.score : null
        };
      });

    return res.json(december2025);
  } catch (err) {
    console.error("❌ /data error:", err);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Fallback: serve index.html for all other routes (SPA support)
app.use((req, res) => {
  // If it's not the /data route, serve index.html for client-side routing
  if (req.path !== "/data" && !req.path.startsWith("/data")) {
    res.sendFile(join(__dirname, "public", "index.html"));
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
