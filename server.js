import express from "express";
import mergeData from "./mergeData.js";

const app = express();
const port = 3000;

// Serve frontend
app.use(express.static("public"));

app.get("/data", async (req, res) => {
  console.log("🔥 /data HIT");

  try {
    const merged = await mergeData();

    // Filter + shape December 2025 data
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
          sleep: value.sleep
            ? +(value.sleep.sleep_seconds / 3600).toFixed(2) // seconds → hours
            : null,
          crown: value.sleep ? value.sleep.sleep_score : null
        };
      });

    return res.json(december2025);
  } catch (err) {
    console.error("❌ /data error:", err);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
