import React from "react";
import ReactApexChart from "react-apexcharts";

const PurchaseSummary = () => {
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
  const salesSummaryChart = {
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
        name: "series1",
        data: [0, 40, 25, 80, 35, 40, 38, 50, 35, 70, 40, 100],
      },
      //   {
      //     name: "series2",
      //     data: [5, 50, 70, 55, 78, 45, 100, 80, 85, 60, 35, 80],
      //   },
    ],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
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
        formatter: function (val) {
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
      options={salesSummaryChart}
      series={salesSummaryChart.series}
      type="area"
      height={370}
    />
  );
};

export default PurchaseSummary;
