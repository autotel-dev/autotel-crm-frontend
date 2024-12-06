import { Card, CardBody, CardHeader, Col } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useSelector } from "react-redux";
import { H4 } from "../../../../../../../../../../AbstractElements";

const AMCDueSummary = () => {
  //   const { alertsOverview } = useSelector((state: any) => state.dashboard);
  var alertsChartData: ApexOptions = {
    chart: {
      height: 370,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    series: [
      {
        name: "Sales",
        data: [44, 55, 57, 56, 61, 58, 63],
      },
    ],
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      title: {
        text: "AMC",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "" + val + " Alerts";
        },
      },
    },
    colors: ["#FF6150"],
  };
  return (
    <ReactApexChart
      id="area-line"
      options={alertsChartData}
      series={alertsChartData.series}
      type="bar"
      height={340}
    />
  );
};

export default AMCDueSummary;
