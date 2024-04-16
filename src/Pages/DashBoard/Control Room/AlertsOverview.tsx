import { Card, CardBody, CardHeader, Col } from "reactstrap";
import { BalanceOverviews } from "../../../utils/Constant";
import ReactApexChart from "react-apexcharts";
import { H3 } from "../../../AbstractElements";
import { ApexOptions } from "apexcharts";
import CommonHeader from "../../../Common/CommonHeader";

const AlertsOverview = () => {
  var alertsChartData: ApexOptions = {
    chart: {
      height: 350,
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
        name: "Total",
        data: [44, 55, 57, 56, 61, 58, 63],
      },
      {
        name: "Assigned",
        data: [76, 85, 101, 98, 87, 105, 91],
      },
      {
        name: "Completed",
        data: [35, 41, 36, 26, 45, 48, 52],
      },
    ],
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      title: {
        text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    },
    colors: ["#33BFBF", "#FF6150", "#51bb25"],
  };
  return (
    <Col xl="6">
      <Card>
        <CommonHeader title="Alerts Overview" headClass="pb-0" />
        <CardBody>
          <div id="column-chart">
            <ReactApexChart
              options={alertsChartData}
              series={alertsChartData.series}
              type="bar"
              height={350}
            />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default AlertsOverview;
