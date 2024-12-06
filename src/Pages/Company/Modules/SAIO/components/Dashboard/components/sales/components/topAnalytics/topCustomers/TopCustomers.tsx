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
import { H2, H4 } from "../../../../../../../../../../../AbstractElements";

// Register necessary chart elements
ChartJS.register(ArcElement, Tooltip, Colors);

const TopCustomers = () => {
  const { topEntitesData } = useSelector((state: any) => state.salesDashboard);
  const customers = topEntitesData.topCustomers;
  const colors = ["#4A90E2", "#FF6F61", "#A4D200", "#F5A623", "#8B5FBF"];
  const customerLabels = [...customers.map((c: any, i: any) => c.fullName)];
  const customerVehicles = [
    ...customers.map((c: any, i: any) => c.vehicleCounter),
  ];

  const doughnutData = {
    labels: customerLabels,
    datasets: [
      {
        data: customerVehicles,
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
    cutout: 65, // Reduce this value to make the doughnut ring thicker
  };

  return (
    <>
      <Doughnut data={doughnutData} options={doughnutOption} />
    </>
  );
};

export default TopCustomers;
