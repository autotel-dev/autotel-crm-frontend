import React from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";

const PurchaseSummary = () => {
  const { purchasesSummaryData } = useSelector(
    (state: any) => state.salesDashboard
  );
  class ConfigDB {
    static data = {
      settings: {
        layout_type: "ltr",
        layout_class: "material-icon",
        sidebar: {
          iconType: "stroke",
        },
        sidebar_setting: "default-sidebar",
      },
      color: {
        primary_color: "#51bb25",
        secondary_color: "#FF6150",
        dark_color: "#31322D",
        light_color: "#F1F8F1",
        mix_background_layout: "light",
      },
      router_animation: "fadeIn",
    };
  }

  const months = purchasesSummaryData?.map(
    (summary: any, index: any) => summary.month
  );
  const amounts = purchasesSummaryData?.map(
    (summary: any, index: any) => summary.totalPurchases
  );
  const purchaseSummaryChart: any = {
    chart: {
      height: 385,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    series: [
      {
        name: "Total Purchases",
        data: amounts,
      },
    ],
    xaxis: {
      categories: months,
      labels: {
        style: {
          fontSize: "13px",
          colors: "#848789",
          fontFamily: "nunito, sans-serif",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val: any) {
          return val + "0" + "k";
        },
        style: {
          fontSize: "14px",
          colors: "$black",
          fontFamily: "nunito, sans-serif",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    legend: {
      show: false,
    },
    fill: {
      colors: [
        ConfigDB.data.color.primary_color,
        ConfigDB.data.color.secondary_color,
      ],
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.4,
      },
    },
    colors: [
      ConfigDB.data.color.primary_color,
      ConfigDB.data.color.secondary_color,
    ],
  };

  return (
    <ReactApexChart
      id="area-line"
      options={purchaseSummaryChart}
      series={purchaseSummaryChart.series}
      type="area"
      height={340}
    />
  );
};

export default PurchaseSummary;
