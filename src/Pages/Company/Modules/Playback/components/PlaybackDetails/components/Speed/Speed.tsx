// // Speed.js
// import React, { useMemo } from "react";
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Line } from "react-chartjs-2";

// // Register chart.js modules
// ChartJS.register(
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Title,
//   Tooltip,
//   Legend
// );

// const Speed = () => {
//   const generateDataPoints = (count: any) => {
//     const time = [];
//     const speed = [];
//     let y = 100;

//     for (let i = 0; i < count; i++) {
//       y += Math.round(5 + Math.random() * (-5 - 5));
//       time.push(`T${i + 1}`); // Time labels (e.g., T1, T2,...)
//       speed.push(y);
//     }

//     return { time, speed };
//   };

//   const { time, speed } = useMemo(() => generateDataPoints(100), []);

//   const data = {
//     labels: time,
//     datasets: [
//       {
//         label: "Speed vs Time",
//         data: speed,
//         fill: true,
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//         borderColor: "rgba(54, 162, 235, 1)",
//         tension: 0.3,
//         pointRadius: 0,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       //   title: {
//       //     display: true,
//       //     text: "Speed over Time",
//       //     font: { size: 20 },
//       //   },
//       //   legend: {
//       //     display: true,
//       //     position: "top" as const, // 👈 Fix here
//       //   },
//     },
//     scales: {
//       y: {
//         title: {
//           display: true,
//           text: "Speed (km/h)",
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: "Time",
//         },
//       },
//     },
//   };

//   return <Line data={data} options={options} />;
// };

// export default Speed;

// -------------------------------------------

// import React, { useMemo } from "react";
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Title,
//   Tooltip,
//   Legend,
//   Filler, // Add this import for fill functionality
// } from "chart.js";
// import { Line } from "react-chartjs-2";

// // Register chart.js modules
// ChartJS.register(
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Title,
//   Tooltip,
//   Legend,
//   Filler // Register the Filler plugin
// );

// const Speed = () => {
//   const generateDataPoints = (count: number) => {
//     const time = [];
//     const speed = [];
//     let y = 0;

//     for (let i = 0; i < count; i++) {
//       y += Math.round(5 + Math.random() * (-5 - 5));
//       y = Math.max(0, y); // Ensure y never goes below 0
//       time.push(`T${i + 1}`); // Time labels (e.g., T1, T2,...)
//       speed.push(y);
//     }

//     // Ensure the first value starts at 0
//     if (speed.length > 0) {
//       speed[0] = 0;
//     }

//     return { time, speed };
//   };

//   const { time, speed } = useMemo(() => generateDataPoints(200), []);

//   const data = {
//     labels: time,
//     datasets: [
//       {
//         label: "", // Hide dataset label
//         data: speed,
//         fill: {
//           target: "origin", // Fill from the bottom of the chart
//           above: "rgb(172, 237, 237)", // Fill color
//         },
//         backgroundColor: "rgb(147, 224, 224)",
//         borderColor: "rgba(53, 191, 191,1)",
//         tension: 0.3,
//         pointRadius: 0,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false, // Add this to allow independent width/height control
//     plugins: {
//       legend: {
//         display: false, // Hide legend
//       },
//     },
//     scales: {
//       y: {
//         title: {
//           display: true,
//           text: "Speed (km/h)",
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: "Time",
//         },
//       },
//     },
//   };

//   return (
//     <div style={{ width: "98%", height: "31vh", position: "relative" }}>
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default Speed;

// ------------------------------------------------------------------
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

const Speed = () => {
  const generateDataPoints = () => {
    const timeLabels = [];
    const speedData = [];
    let currentTime = new Date();
    currentTime.setHours(0, 0, 0, 0); // Start at midnight (12:00 AM)

    const totalPoints = 150; // Exactly 40 data points
    const totalMinutes = 1440; // 24 hours in minutes
    let pointsGenerated = 0;
    let y = 0;

    // Generate exactly 40 points with random intervals
    while (pointsGenerated < totalPoints) {
      // Format time label (12-hour format with AM/PM)
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      timeLabels.push(
        `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`
      );

      // Generate speed value with realistic variation
      y += Math.round(Math.random() * 20 - 10); // Random change between -4 and +6
      y = Math.max(0, Math.min(y, 120)); // Keep speed between 0 and 120 km/h
      speedData.push(y);
      pointsGenerated++;

      // Calculate next interval (random between 15-90 minutes for good distribution)
      if (pointsGenerated < totalPoints) {
        const remainingPoints = totalPoints - pointsGenerated;
        const elapsedMinutes =
          currentTime.getHours() * 60 + currentTime.getMinutes();
        const remainingMinutes = totalMinutes - elapsedMinutes;
        const avgInterval = remainingMinutes / remainingPoints;

        // Random interval with some variation but ensuring we reach 24 hours
        const minInterval = Math.max(15, avgInterval * 0.7);
        const maxInterval = Math.min(90, avgInterval * 1.3);
        const interval = Math.floor(
          minInterval + Math.random() * (maxInterval - minInterval)
        );

        currentTime = new Date(currentTime.getTime() + interval * 60000);
      }
    }

    // Ensure the last point is at 11:59 PM
    timeLabels[timeLabels.length - 1] = "11:59 PM";

    return { timeLabels, speedData };
  };

  const { timeLabels, speedData } = useMemo(() => generateDataPoints(), []);

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
      //   x: {
      //     title: {
      //       display: true,
      //       text: "Time (24 Hour Period)",
      //     },
      //     ticks: {
      //       // Show fewer labels to avoid crowding
      //       callback: (value: any, index: any) => {
      //         // Show every 4th label or important times (midnight, 6am, noon, 6pm)
      //         if (
      //           index % 4 === 0 ||
      //           timeLabels[index] === "12:00 AM" ||
      //           timeLabels[index] === "6:00 AM" ||
      //           timeLabels[index] === "12:00 PM" ||
      //           timeLabels[index] === "6:00 PM"
      //         ) {
      //           return timeLabels[index];
      //         }
      //         return "";
      //       },
      //     },
      //   },

      x: {
        title: {
          display: true,
          text: "Time (24 Hour Period)",
          font: {
            size: 10, // Smaller font for axis title
          },
        },
        ticks: {
          font: {
            size: 9, // Smaller font for tick labels
          },
          // Show fewer labels to avoid crowding
          callback: (value: any, index: any) => {
            // Show every 4th label or important times (midnight, 6am, noon, 6pm)
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
          tickLength: 5, // Length of the ticks
          tickColor: "rgba(0, 0, 0, 0.1)", // Color of the ticks
          lineWidth: 1,
          borderDash: [], // Solid line (not dashed)
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

export default Speed;
