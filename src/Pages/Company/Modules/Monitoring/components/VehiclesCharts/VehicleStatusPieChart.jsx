import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";

function VehicleStatusPieChart() {
  const { devices } = useSelector((state) => state.monitoring);
  // console.log("devices from redux",devices);

  const devicess = devices;

  const vehicles = Array.isArray(devicess) ? devicess : [];

  // Initialize all possible statuses with a count of 0
  const possibleStatuses = ["STOP", "MOVING", "OFFLINE", "NODATA", "IDLE"];
  const statusCounts = possibleStatuses.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  // Aggregate actual statuses from the devices
  vehicles.forEach((vehicle) => {
    const status = vehicle.device?.currentStatus || "Unknown";
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status] += 1;
    }
  });

  // Extract labels and series for the pie chart
  const labels = Object.keys(statusCounts);
  const series = Object.values(statusCounts);

  const apexPieChart = {
    series: series,
    options: {
      chart: {
        width: 380,
        type: "pie",
        toolbar: { show: false },
      },
      labels: labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: "bottom" },
          },
        },
      ],
      colors: ["#ff5733", "#33ff57", "#3375ff", "#f4d03f", "#a569bd"], // Custom colors
    },
  };

  return (
    <Card
      style={{
        borderRadius: "5px",
        minWidth: "100%",
        maxWidth: "100%",
        backgroundColor: "#99A6A7",
      }}
    >
      <CardHeader style={{ padding: "2px 8px" }}>
        <h4
          style={{
            margin: "10px 0px",
            fontWeight: "bold",
            fontSize: "17px",
          }}
        >
          Vehicle Status Pie Chart
        </h4>
      </CardHeader>
      <CardBody className="apex-chart" style={{ padding: "10px 0px" }}>
        <div id="piechart">
          {series.some((count) => count > 0) ? (
            <ReactApexChart
              options={apexPieChart.options}
              series={apexPieChart.series}
              type="pie"
              width={300}
            />
          ) : (
            <p>No data available to display the chart.</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default VehicleStatusPieChart;
