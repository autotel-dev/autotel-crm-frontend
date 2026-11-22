import React from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";

const SalesSummary = () => {
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
        primary_color: "#35bfbf",
        secondary_color: "#FF6150",
        dark_color: "#31322D",
        light_color: "#F1F8F1",
        mix_background_layout: "light",
      },
      router_animation: "fadeIn",
    };
  }
  const { salesSummaryData } = useSelector(
    (state: any) => state.salesDashboard
  );
  const months = (salesSummaryData || []).map(
    (summary: any, index: any) => summary.month
  );
  const amounts = (salesSummaryData || []).map(
    (summary: any, index: any) => summary.totalSales
  );
  const salesSummaryChart: any = {
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
        name: "Total Sales",
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
          return val + "" + "";
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
      options={salesSummaryChart}
      series={salesSummaryChart.series}
      type="area"
      height={340}
    />
  );
};

export default SalesSummary;
