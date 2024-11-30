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
    <>
      {insurances.length > 0 ? (
        <div style={{ width: "180px", height: "180px" }}>
          <Doughnut data={doughnutData} options={doughnutOption} />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "180px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <H4>No data Yet</H4>
        </div>
      )}
    </>
  );
};

export default TopInsurances;
