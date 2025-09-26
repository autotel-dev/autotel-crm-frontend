// ----------------------------------------------------------
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Temperature = () => {
  const generateTemperatureData = () => {
    const distanceLabels: string[] = [];
    const tempData: number[] = [];

    const maxDistance = 700; // km
    const totalPoints = 40; // number of points
    const interval = maxDistance / totalPoints;

    let currentTemp = 30; // starting temperature

    for (let i = 0; i <= totalPoints; i++) {
      const km = Math.round(i * interval);

      // Random variation between -2 and +2
      const variation = Math.floor(Math.random() * 5) - 2;
      currentTemp = Math.max(15, Math.min(currentTemp + variation, 45));

      distanceLabels.push(`${km} km`);
      tempData.push(currentTemp);
    }

    return { distanceLabels, tempData };
  };

  const { distanceLabels, tempData } = useMemo(
    () => generateTemperatureData(),
    []
  );

  const data = {
    labels: distanceLabels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: tempData,
        fill: {
          target: "origin",
          above: "rgba(255, 99, 132, 0.2)", // redish fill
        },
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 0, 0, 0.8)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgba(255, 0, 0, 0.8)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context: any) => `Distance: ${context[0].label}`,
          label: (context: any) => `Temperature: ${context.parsed.y} °C`,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
        },
        min: 15,
        max: 45,
      },
      x: {
        title: {
          display: true,
          text: "Distance (km)",
        },
      },
    },
  };

  return (
    <div style={{ width: "98%", height: "31vh", position: "relative" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default Temperature;
