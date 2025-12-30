fetch("/data")
  .then(res => res.json())
  .then(data => {
    const labels = data.map(d => d.date);
    const distance = data.map(d => d.distance);
    const sleep = data.map(d => d.sleep);
    const crown = data.map(d => d.crown);

    new Chart(document.getElementById("chart"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Miles Run",
            data: distance,
            yAxisID: "y",
          },
          {
            label: "Sleep (hrs)",
            data: sleep,
            yAxisID: "y1",
          },
          {
            label: "Oura Score",
            data: crown,
            yAxisID: "y2",
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { position: "left" },
          y1: { position: "right", grid: { drawOnChartArea: false } },
          y2: { position: "right", grid: { drawOnChartArea: false } }
        }
      }
    });
  });
