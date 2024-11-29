import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  //   Legend,
  //   Title,
  Colors,
} from "chart.js";
import { useSelector } from "react-redux";

// Register necessary chart elements
ChartJS.register(ArcElement, Tooltip, Colors);

const TopInsurances = () => {
  const { topEntitesData } = useSelector((state: any) => state.salesDashboard);
  const insurances = topEntitesData.topInsurance;
  const colors = ["#4A90E2", "#FF6F61", "#A4D200", "#F5A623", "#8B5FBF"];
  const insuranceLabels = [...insurances.map((c: any, i: any) => c.name)];
  const insuranceVehicles = [
    ...insurances.map((c: any, i: any) => c.vehicleCounter),
  ];

  const doughnutData = {
    labels: insuranceLabels,
    datasets: [
      {
        data: insuranceVehicles,
        backgroundColor: colors,
        borderWidth: 3, // Thickness of the doughnut border
      },
    ],
  };

  const doughnutOption = {
    maintainAspectRatio: false, // Disable aspect ratio to fill the container
    responsive: true, // Ensures chart adjusts to container size
    legend: {
      display: false,
    },
    cutout: 70, // Reduce this value to make the doughnut ring thicker
  };

  return (
    <div style={{ width: "180px", height: "180px" }}>
      <Doughnut data={doughnutData} options={doughnutOption} />
    </div>
  );
};

export default TopInsurances;
