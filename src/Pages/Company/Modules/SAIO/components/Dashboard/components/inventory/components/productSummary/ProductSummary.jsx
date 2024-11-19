import React from "react";
import ReactApexChart from "react-apexcharts";

const ProductSummary = () => {
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

  const productSalesChart = {
    series: [
      {
        name: "Product",
        data: [0, 40, 25, 80, 35, 40, 38, 50, 35, 70, 40, 100],
      },
    ],
    chart: {
      height: 300,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    colors: [ConfigDB.data.color.primary_color],
    grid: {
      row: {
        colors: ["transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      // categories: [' ', ' ', '12:00', ' ', ' ', ' ', '', ' ', '15:00' , ' ' , ' ' , ' ' , ' ' , ' ' , '18:00', ' ', ' ', ' ', ' ', ' ', '21:00', ' ', ' ' , ' ' , ' ' , ' ' , '03:00' , ' ' , ' ', ' ', ' ', ' ' , '04:00' , ' ' , ' ' ],
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
          return "$" + val + "" + "k";
        },
        style: {
          fontSize: "14px",
          colors: "$black",
          fontWeight: "500",
          fontFamily: "nunito, sans-serif",
        },
      },
    },
    responsive: [
      {
        breakpoint: 1200,
        options: {
          chart: {
            height: 215,
          },
        },
      },
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 180,
          },
        },
      },
    ],
  };

  return (
    <ReactApexChart
      id="area-line"
      options={productSalesChart}
      series={productSalesChart.series}
      type="area"
      height={370}
    />
  );
};

export default ProductSummary;
