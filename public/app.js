async function loadData() {
  try {
    const res = await fetch("/data");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error loading data:", error);
    return [];
  }
}

function parseHours(str) {
  if (!str) return 0;
  try {
    // Format is "8h 30m" or similar
    const parts = str.split(" ");
    let hours = 0;
    let minutes = 0;
    
    parts.forEach(part => {
      if (part.endsWith("h")) {
        hours = parseInt(part) || 0;
      } else if (part.endsWith("m")) {
        minutes = parseInt(part) || 0;
      }
    });
    
    return hours + minutes / 60;
  } catch (error) {
    console.error("Error parsing hours:", str, error);
    return 0;
  }
}

loadData().then(data => {
  if (!data || data.length === 0) {
    console.error("No data received");
    document.body.innerHTML += "<p style='color: red;'>No data available. Check server logs.</p>";
    return;
  }

  console.log("Data loaded:", data);

  const labels = data.map(d => d.date);

  const totalSleep = data.map(d => parseHours(d.sleep));
  const light = data.map(d => parseHours(d.light));
  const rem = data.map(d => parseHours(d.rem));
  const deep = data.map(d => parseHours(d.deep));
  const distance = data.map(d => d.distance || 0);

  /* =========================
     SLEEP STACKED BAR CHART
  ========================= */

  new Chart(document.getElementById("sleepChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Light", data: light, stack: "sleep" },
        { label: "REM", data: rem, stack: "sleep" },
        { label: "Deep", data: deep, stack: "sleep" }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Sleep Breakdown (hours)"
        }
      },
      scales: {
        x: { stacked: true },
        y: {
          stacked: true,
          title: { display: true, text: "Hours" }
        }
      }
    }
  });

  /* =========================
     DISTANCE LINE CHART
  ========================= */

  new Chart(document.getElementById("distanceChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Distance (miles)",
          data: distance,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Running Distance"
        }
      },
      scales: {
        y: {
          title: { display: true, text: "Miles" }
        }
      }
    }
  });
}).catch(error => {
  console.error("Error creating charts:", error);
  document.body.innerHTML += "<p style='color: red;'>Error loading charts: " + error.message + "</p>";
});
