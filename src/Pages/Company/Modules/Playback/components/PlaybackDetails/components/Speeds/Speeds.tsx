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

interface SpeedsProps {
  vehicleHistoryData: any[];
}

const Speeds: React.FC<SpeedsProps> = ({ vehicleHistoryData }) => {
  const { timeLabels, speedData } = useMemo(() => {
    if (!vehicleHistoryData || vehicleHistoryData.length === 0) {
      return { timeLabels: [], speedData: [] };
    }

    const labels = vehicleHistoryData.map((item: any) => {
      const date = new Date(item.timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    });

    const dataPoints = vehicleHistoryData.map((item: any) =>
      Math.round(item.speed || 0)
    );

    return { timeLabels: labels, speedData: dataPoints };
  }, [vehicleHistoryData]);

  const data = {
    labels: timeLabels,
    datasets: [
      {
        label: "Speed",
        data: speedData,
        fill: {
          target: "origin",
          above: "rgba(172, 237, 237, 0.5)",
        },
        backgroundColor: "rgb(147, 224, 224)",
        borderColor: "rgba(53, 191, 191, 1)",
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: "rgba(53, 191, 191, 1)",
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
          title: (context: any) => `Time: ${context[0].label}`,
          label: (context: any) => `Speed: ${context.parsed.y} km/h`,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Speed (km/h)",
        },
        min: 0,
        max: 120,
      },
      x: {
        title: {
          display: true,
          text: "Time (24 Hour Period)",
          font: {
            size: 10,
          },
        },
        ticks: {
          font: {
            size: 9,
          },
          callback: (value: any, index: any) => {
            if (
              index % 4 === 0 ||
              timeLabels[index] === "12:00 AM" ||
              timeLabels[index] === "6:00 AM" ||
              timeLabels[index] === "12:00 PM" ||
              timeLabels[index] === "6:00 PM"
            ) {
              return timeLabels[index];
            }
            return "";
          },
        },
        grid: {
          display: true,
          drawTicks: true,
          tickLength: 5,
          tickColor: "rgba(0, 0, 0, 0.1)",
          lineWidth: 1,
          borderDash: [],
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

export default Speeds;
