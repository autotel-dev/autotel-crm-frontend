import { Card, CardBody, CardHeader, Col } from "reactstrap";
import { BalanceOverviews } from "../../../utils/Constant";
import ReactApexChart from "react-apexcharts";
import { H3, H5 } from "../../../AbstractElements";
import { ApexOptions } from "apexcharts";
import CommonHeader from "../../../Common/CommonHeader";
import { useSelector } from "react-redux";

const AlertsOverview = () => {
  const { alertsOverview } = useSelector((state: any) => state.dashboard);
  var alertsChartData: ApexOptions = {
    chart: {
      height: 400,
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
        text: "Alerts",
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
    colors: ["#33BFBF", "#FF6150", "#51bb25"],
  };
  return (
    <Col xl="6">
      <Card>
        <CardHeader className="pb-0">
          <div className="header-top">
            <H5 className="m-0">Alerts Overview</H5>
          </div>
        </CardHeader>
        <CardBody>
          <div id="column-chart">
            <ReactApexChart
              options={{
                ...alertsChartData,
                xaxis: {
                  categories: [
                    alertsOverview[0].dayOfWeek,
                    alertsOverview[1].dayOfWeek,
                    alertsOverview[2].dayOfWeek,
                    alertsOverview[3].dayOfWeek,
                    alertsOverview[4].dayOfWeek,
                    alertsOverview[5].dayOfWeek,
                    alertsOverview[6].dayOfWeek,
                  ],
                },
              }}
              // options={alertsChartData}
              series={[
                {
                  name: "Total",
                  data: [
                    alertsOverview[0].totalAlerts,
                    alertsOverview[1].totalAlerts,
                    alertsOverview[2].totalAlerts,
                    alertsOverview[3].totalAlerts,
                    alertsOverview[4].totalAlerts,
                    alertsOverview[5].totalAlerts,
                    alertsOverview[6].totalAlerts,
                  ],
                },
                {
                  name: "Assigned",
                  data: [
                    alertsOverview[0].totalAssigned,
                    alertsOverview[1].totalAssigned,
                    alertsOverview[2].totalAssigned,
                    alertsOverview[3].totalAssigned,
                    alertsOverview[4].totalAssigned,
                    alertsOverview[5].totalAssigned,
                    alertsOverview[6].totalAssigned,
                  ],
                },
                {
                  name: "Completed",
                  data: [
                    alertsOverview[0].totalCompleted,
                    alertsOverview[1].totalCompleted,
                    alertsOverview[2].totalCompleted,
                    alertsOverview[3].totalCompleted,
                    alertsOverview[4].totalCompleted,
                    alertsOverview[5].totalCompleted,
                    alertsOverview[6].totalCompleted,
                  ],
                },
              ]}
              type="bar"
              height={400}
            />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default AlertsOverview;
