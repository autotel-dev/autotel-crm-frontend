import { ApexOptions } from "apexcharts";
import ConfigDB from "../../../../../Config/ThemeConfig";

export const totalEarningChart: ApexOptions = {
  series: [
    {
      name: "killed vehicles",
      data: [25, 35, 30, 25, 80, 37, 35, 50],
    },
  ],
  colors: [
    "#35bfbf21",
    "#35bfbf21",
    "#35bfbf21",
    "#35bfbf21",
    "#35bfbf21",
    "#35bfbf21",
    "#35bfbf21",
    "#33BFBF",
  ],
  chart: {
    height: 80,
    type: "bar",
    offsetY: 30,
    sparkline: {
      enabled: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  plotOptions: {
    bar: {
      distributed: true,
      barHeight: "30%",
      dataLabels: {
        position: "top",
      },
    },
  },
//   responsive: [
//     {
//       breakpoint: 1700,
//       options: {
//         chart: {
//           height: 86,
//         },
//       },
//     },
//     {
//       breakpoint: 1699,
//       options: {
//         chart: {
//           height: 95,
//         },
//       },
//     },
//     {
//       breakpoint: 1460,
//       options: {
//         grid: {
//           padding: {
//             top: 0,
//             right: 0,
//             bottom: 0,
//             left: 5,
//           },
//         },
//       },
//     },
//     {
//       breakpoint: 576,
//       options: {
//         chart: {
//           offsetY: 0,
//         },
//       },
//     },
//     {
//       breakpoint: 376,
//       options: {
//         chart: {
//           height: 50,
//         },
//       },
//     },
//   ],
};

export const totalLikesOption: ApexOptions = {
  series: [
    {
      name: "series2",
      data: [0, 40, 25, 80, 35, 40, 38, 50, 35, 70, 40, 100, 20],
    },
  ],
  chart: {
    height: 95,
    offsetY: 30,
    type: "area",
    sparkline: {
      enabled: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ["#072448"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0.4,
    },
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  annotations: {
    points: [
      {
        x: 123,
        y: 40,
        marker: {
          size: 6,
          fillColor: "#ffffff",
          strokeColor: "#1F2F3E",
          strokeWidth: 2,
          radius: 1,
          cssClass: "apexcharts-custom-class",
        },
      },
    ],
  },
  responsive: [
    {
      breakpoint: 1800,
      options: {
        chart: {
          height: 80,
        },
      },
    },
    {
      breakpoint: 1500,
      options: {
        chart: {
          height: 80,
        },
      },
    },
    {
      breakpoint: 1400,
      options: {
        chart: {
          height: 80,
        },
      },
    },
    {
      breakpoint: 1200,
      options: {
        chart: {
          height: 70,
        },
        grid: {
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 5,
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        chart: {
          offsetY: 0,
        },
      },
    },
    {
      breakpoint: 376,
      options: {
        chart: {
          height: 50,
        },
      },
    },
  ],
};

export const visitorChart: ApexOptions = {
  series: [46],
  chart: {
    type: "radialBar",
    offsetY: 0,
    width: 270,
    height: 200,
    sparkline: {
      enabled: false,
    },
  },
  colors: [ConfigDB.data.color.secondary_color],
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: "rgba(255, 97, 80, 0.12)",
        strokeWidth: "120%",
        margin: 5,
      },
      dataLabels: {
        name: {
          show: true,
        },
        value: {
          offsetY: 5,
          fontSize: "18px",
        },
      },
    },
    bar: {
      horizontal: false,
      dataLabels: {
        position: "bottom",
      },
    },
  },
  labels: ["Visitors"],
  stroke: {
    lineCap: "round",
  },
  grid: {
    padding: {
      top: -10,
    },
  },
};
