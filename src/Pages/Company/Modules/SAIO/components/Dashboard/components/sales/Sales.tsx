import { Badge, Card, CardBody, Col, Container, Row } from "reactstrap";

import ReactApexChart from "react-apexcharts";
import { H2, H3, H4, H5, P } from "../../../../../../../../AbstractElements";
import SVG from "../../../../../../../../utils/CommonSvgIcon/SVG";

const TotalEarning = () => {
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

  const totalLikesOption: any = {
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

  const visitorChart: any = {
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
      charts: totalLikesOption,
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
            <Col xl="4" lg="6" sm="12" className="box-col-4" key={index}>
              <Card className="total-earning">
                <CardBody>
                  <Row>
                    <Col sm="7" className="box-col-7">
                      <div className="d-flex">
                        <Badge
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
                          <H2>{data.title}</H2>
                        </div>
                      </div>
                      <div
                        style={{
                          margin: "15px 0px",
                        }}
                      ></div>
                      <H3>{data.amount}</H3>
                      <div
                        style={{
                          margin: "15px 0px",
                        }}
                      ></div>
                      <P className="d-flex">
                        <span className={`bg-light-${data.color} me-2`}>
                          <SVG iconId={data.icon} />
                        </span>
                        <span className={`font-${data.color} me-2`}>
                          {data.percentage}
                        </span>
                        <span>{data.time}</span>
                      </P>
                    </Col>
                    <Col sm="5" className={`box-col-5 ${data.chartClass}`}>
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
      </Container>
    </>
  );
};

export default TotalEarning;
