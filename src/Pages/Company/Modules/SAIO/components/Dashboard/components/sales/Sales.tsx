import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";

import ReactApexChart from "react-apexcharts";
import { H2, H3, H4, H5, P } from "../../../../../../../../AbstractElements";
import SVG from "../../../../../../../../utils/CommonSvgIcon/SVG";
import P2 from "../../../../../../../../CommonElements/Paragraph/P2Element";
import SalesSummary from "./components/salesSummary/SalesSummary";
import SalesTable from "./components/salesTable/SalesTable";

const TotalEarning = () => {
  const totalEarningChart: any = {
    series: [
      {
        name: "series2",
        data: [25, 35, 30, 25, 60, 37, 35, 50],
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
      height: 95,
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
        barHeight: "35%",
        dataLabels: {
          position: "top",
        },
      },
    },
    responsive: [
      {
        breakpoint: 1700,
        options: {
          chart: {
            height: 86,
          },
        },
      },
      {
        breakpoint: 1699,
        options: {
          chart: {
            height: 95,
          },
        },
      },
      {
        breakpoint: 1460,
        options: {
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

  const totalVehiclesOption: any = {
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

  const totalEarningData = [
    {
      badgeColor: "primary",
      badge: "$",
      title: "Sales",
      amount: "$200.790",
      color: "secondary",
      icon: "arrow-down",
      percentage: "- 36.28%",
      time: "Since Last Month",
      chartId: "expensesChart",
      charts: totalEarningChart,
      type: "bar",
    },
    {
      badgeColor: "dark",
      svgIcon: "fill-Buy",
      // badge: "$",
      title: "Vehicles",
      amount: "560",
      color: "dark",
      icon: "arrow-up",
      percentage: "- 90.28%",
      time: "Then Last Week",
      chartId: "totalLikesAreaChart",
      charts: totalVehiclesOption,
      type: "area",
    },
    {
      badgeColor: "primary",
      badge: "$",
      title: "Customers",
      amount: "100",
      color: "secondary",
      icon: "arrow-down",
      percentage: "- 36.28%",
      time: "Since Last Month",
      chartId: "expensesChart",
      charts: totalEarningChart,
      type: "bar",
    },
  ];
  return (
    <>
      <Container fluid className="dashboard_default">
        <Row className="widget-grid">
          {totalEarningData.map((data: any, index: any) => (
            <Col
              xxl="4"
              xl="4"
              lg="4"
              sm="12"
              className="box-col-4"
              key={index}
            >
              <Card className="total-earning">
                <CardBody>
                  <Row>
                    <Col sm="7" className="box-col-7">
                      <div className="d-flex">
                        <Badge
                          style={{
                            fontSize: "1rem",
                            padding: "0.2rem 0.5rem",
                            // style={{
                            width: "40px",
                            height: "40px",
                            // }}
                          }}
                          color="transperant"
                          className={`bg-light-${data.badgeColor} badge-rounded font-primary me-2`}
                        >
                          {data.badge ? (
                            data.badge
                          ) : (
                            <SVG iconId={data.svgIcon} />
                          )}
                        </Badge>
                        <div className="flex-grow-1">
                          <H4>{data.title}</H4>
                        </div>
                      </div>
                      <div
                        style={{
                          margin: "15px 0px",
                        }}
                      ></div>
                      <H5>{data.amount}</H5>
                      <div
                        style={{
                          margin: "15px 0px",
                        }}
                      ></div>
                      <P2 className="d-flex">
                        <span className={`bg-light-${data.color} me-2`}>
                          <SVG iconId={data.icon} />
                        </span>
                        <span className={`font-${data.color} me-2`}>
                          {data.percentage}
                        </span>
                        <span>{data.time}</span>
                      </P2>
                    </Col>
                    <Col
                      sm="5"
                      className={`box-col-5 ${data.chartClass}`}
                      style={{
                        marginTop: "-10px",
                      }}
                    >
                      <ReactApexChart
                        id={data.chartId}
                        options={data.charts}
                        series={data.charts.series}
                        type={data.charts.chart?.type}
                        height={data.charts.chart?.height}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        <Row>
          <Col xxl="6" xl="6" lg="6" md="12">
            <Card className="invoice-card">
              <CardHeader className="pb-0">
                <H4>Recent Sales</H4>
              </CardHeader>
              <CardBody className="transaction-card">
                <SalesTable />
              </CardBody>
            </Card>
          </Col>
          <Col xxl="6" xl="6" lg="6" md="12">
            <Card>
              <CardHeader>
                <H4>Sales Summary</H4>
              </CardHeader>
              <CardBody className="p-0">
                <SalesSummary />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TotalEarning;
