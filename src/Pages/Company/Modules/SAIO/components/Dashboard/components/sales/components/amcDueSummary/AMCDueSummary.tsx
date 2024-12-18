import { Card, CardBody, CardHeader, Col } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useSelector } from "react-redux";
import { H4 } from "../../../../../../../../../../AbstractElements";

const AMCDueSummary = () => {
  const { vehiclesSummaryData } = useSelector(
    (state: any) => state.salesDashboard
  );
  const months = vehiclesSummaryData?.map(
    (summary: any, index: any) => summary.month
  );
  const vehicles = vehiclesSummaryData?.map(
    (summary: any, index: any) => summary.totalVehicles
  );
  const amounts = vehiclesSummaryData?.map(
    (summary: any, index: any) => summary.totalServiceCharges
  );

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
        name: "Data",
        data: amounts, // Show amounts on the Y-axis
      },
    ],
    xaxis: {
      categories: months,
      title: {
        text: "Months",
      },
    },
    yaxis: {
      title: {
        text: "Total Service Charges", // Y-axis title for amounts
      },
      // Optional: Set the range for the Y-axis based on amounts data
      // min: 0,
      // max: Math.max(...amounts) + 1000, // Example: auto calculate max value + some padding
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val, index) {
          const array = index.series[0];

          const indexx = array.indexOf(val);

          const vehicleCount = vehicles[indexx];
          return `<div><span>Vehicles : ${vehicleCount}</span>, <span>Amount : ${val}</span></div>`;
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
