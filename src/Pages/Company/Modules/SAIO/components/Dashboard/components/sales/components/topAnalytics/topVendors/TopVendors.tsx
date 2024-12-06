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

const TopVendors = () => {
  const { topEntitesData } = useSelector((state: any) => state.salesDashboard);
  const vendors = topEntitesData.topVendors;
  const colors = ["#4A90E2", "#FF6F61", "#A4D200", "#F5A623", "#8B5FBF"];
  const vendorLabels = [...vendors.map((c: any, i: any) => c.vendorName)];
  const vendorInvoicesData = [
    ...vendors.map((c: any, i: any) => c.invoiceCount),
  ];

  const doughnutData = {
    labels: vendorLabels,
    datasets: [
      {
        data: vendorInvoicesData,
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

export default TopVendors;
