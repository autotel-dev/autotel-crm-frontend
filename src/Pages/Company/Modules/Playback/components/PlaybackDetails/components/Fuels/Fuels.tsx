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

const Fuels = () => {
  const generateFuelData = () => {
    const distanceLabels: string[] = [];
    const fuelData: number[] = [];

    const initialFuel = 8; // liters
    const maxDistance = 700; // km
    const consumptionPerKm = initialFuel / maxDistance; // ~0.0114 L/km

    const totalPoints = 40; // Number of data points for smooth curve
    const interval = maxDistance / totalPoints;

    for (let i = 0; i <= totalPoints; i++) {
      const km = Math.round(i * interval);
      const fuel = Math.max(initialFuel - km * consumptionPerKm, 0);
      distanceLabels.push(`${km} km`);
      fuelData.push(Number(fuel.toFixed(2)));
    }

    return { distanceLabels, fuelData };
  };

  const { distanceLabels, fuelData } = useMemo(() => generateFuelData(), []);

  const data = {
    labels: distanceLabels,
    datasets: [
      {
        label: "Fuel (liters)",
        data: fuelData,
        fill: {
          target: "origin",
          above: "rgba(255, 165, 0, 0.3)", // orange fill
        },
        backgroundColor: "rgb(255, 140, 0)",
        borderColor: "rgba(255, 99, 71, 1)",
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: "rgba(255, 99, 71, 1)",
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
          label: (context: any) => `Fuel: ${context.parsed.y} L`,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Fuel (Liters)",
        },
        min: 0,
        max: 8,
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

export default Fuels;
