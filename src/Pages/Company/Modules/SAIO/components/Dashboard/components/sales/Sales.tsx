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
import AMCDueTable from "./components/amcDueTable/AMCDueTable";
import AMCDueSummary from "./components/amcDueSummary/AMCDueSummary";
import TopCustomers from "./components/topAnalytics/topCustomers/TopCustomers";
import TopVendors from "./components/topAnalytics/topVendors/TopVendors";
import TopInsurances from "./components/topAnalytics/topInsurances/TopInsurances";
import TopBanks from "./components/topAnalytics/topBanks/TopBanks";
import P3 from "../../../../../../../../CommonElements/Paragraph/P3Element";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAll } from "../../../../../../../../Utilities/api";
import { GET_TOP_ENTITIES } from "../../../../../../../../Utilities/api/apiEndpoints";
import Swal from "sweetalert2";
import {
  setTopEntitesData,
  setTopEntitiesLoading,
} from "../../../../../../../../ReaduxToolkit/Reducer/SalesDashboardSlice";
import { ERROR_MESSAGE } from "../../../../../../../../Utilities/constants/constants";
import { useSelector } from "react-redux";
import Skeleton from "../../../../../../../Utilities/Skeleton/Skeleton";

const Sales = () => {
  const { topEntitesLoading, topEntitesData } = useSelector(
    (state: any) => state.salesDashboard
  );

  const [] = useState([]);
  const colors = ["#4A90E2", "#FF6F61", "#A4D200", "#F5A623", "#8B5FBF"];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTopEntitiesLoading(true));
    getAll({ url: GET_TOP_ENTITIES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setTopEntitesData(null));
        }
        if (data.success) {
          dispatch(setTopEntitesData(data.data));
        }
      }
    });
  }, []);
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
        {topEntitesLoading ? (
          <Row>
            <Col xxl="6" xl="6" lg="6" md="6" sm="6">
              <Skeleton
                height="280px"
                width="100%"
                marginTop="10px"
                marginBottom="25px"
                marginRight="20px"
                borderRadius="10px"
              />
            </Col>
            <Col xxl="6" xl="6" lg="6" md="6" sm="6">
              <Skeleton
                height="280px"
                width="100%"
                marginTop="10px"
                marginBottom="25px"
                marginRight="20px"
                borderRadius="10px"
              />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xxl="6" xl="6" lg="6" md="12">
              <Card className="invoice-card">
                <CardHeader className="pb-0">
                  <H4>Top Customers</H4>
                </CardHeader>
                <CardBody className="chart-block chart-vertical-center">
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ width: "180px", height: "180px" }}>
                      <TopCustomers />
                    </div>

                    <div style={{ display: "flex", gap: "25px" }}>
                      {topEntitesData?.topCustomers.map(
                        (data: any, index: any) => (
                          <div
                            style={{ display: "flex", gap: "6px" }}
                            key={index}
                          >
                            <div
                              style={{
                                maxWidth: "3px",
                                minWidth: "3px",
                                height: "40px",
                                backgroundColor: colors[index], // Dynamic color from customer data
                              }}
                            ></div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <H3>{data?.vehicleCounter}</H3>
                              {/* Dynamic percentage from customer data */}
                              <span>{data?.fullName}</span>
                              {/* Dynamic name from customer data */}
                              <span>{data?.percentage}%</span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="6" xl="6" lg="6" md="12">
              <Card>
                <CardHeader className="pb-0">
                  <H4>Top Vendors</H4>
                </CardHeader>
                <CardBody className="chart-block chart-vertical-center">
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ width: "180px", height: "180px" }}>
                      <TopVendors />
                    </div>

                    <div style={{ display: "flex", gap: "25px" }}>
                      {topEntitesData?.topVendors.map(
                        (data: any, index: any) => (
                          <div
                            style={{ display: "flex", gap: "6px" }}
                            key={index}
                          >
                            <div
                              style={{
                                maxWidth: "3px",
                                minWidth: "3px",
                                height: "40px",
                                backgroundColor: colors[index], // Dynamic color from customer data
                              }}
                            ></div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <H3>{data?.invoiceCount}</H3>
                              {/* Dynamic percentage from customer data */}
                              <span>{data?.vendorName}</span>
                              {/* Dynamic name from customer data */}
                              <span>{data?.percentage}%</span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
        {topEntitesLoading ? (
          <Row>
            <Col xxl="6" xl="6" lg="6" md="6" sm="6">
              <Skeleton
                height="280px"
                width="100%"
                marginTop="10px"
                marginBottom="25px"
                marginRight="20px"
                borderRadius="10px"
              />
            </Col>
            <Col xxl="6" xl="6" lg="6" md="6" sm="6">
              <Skeleton
                height="280px"
                width="100%"
                marginTop="10px"
                marginBottom="25px"
                marginRight="20px"
                borderRadius="10px"
              />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xxl="6" xl="6" lg="6" md="12">
              <Card className="invoice-card">
                <CardHeader className="pb-0">
                  <H4>Top Banks</H4>
                </CardHeader>
                <CardBody className="chart-block chart-vertical-center">
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ width: "180px", height: "180px" }}>
                      <TopBanks />
                    </div>

                    <div style={{ display: "flex", gap: "25px" }}>
                      {topEntitesData?.topBanks.map((data: any, index: any) => (
                        <div
                          style={{ display: "flex", gap: "6px" }}
                          key={index}
                        >
                          <div
                            style={{
                              maxWidth: "3px",
                              minWidth: "3px",
                              height: "40px",
                              backgroundColor: colors[index], // Dynamic color from customer data
                            }}
                          ></div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <H3>{data?.vehicleCounter}</H3>
                            {/* Dynamic percentage from customer data */}
                            <span>{data?.name}</span>
                            {/* Dynamic name from customer data */}
                            <span>{data?.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="6" xl="6" lg="6" md="12">
              <Card>
                <CardHeader className="pb-0">
                  <H4>Top Insurances</H4>
                </CardHeader>
                <CardBody className="chart-block chart-vertical-center">
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ width: "180px", height: "180px" }}>
                      <TopInsurances />
                    </div>

                    <div style={{ display: "flex", gap: "25px" }}>
                      {topEntitesData?.topInsurance.map(
                        (data: any, index: any) =>
                          index <= 4 && (
                            <div
                              style={{ display: "flex", gap: "6px" }}
                              key={index}
                            >
                              <div
                                style={{
                                  maxWidth: "3px",
                                  minWidth: "3px",
                                  height: "40px",
                                  backgroundColor: colors[index], // Dynamic color from customer data
                                }}
                              ></div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <H3>{data?.vehicleCounter}</H3>

                                <span>{data?.name}</span>

                                <span>{data?.percentage}%</span>
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
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

        <Row>
          <Col xxl="6" xl="6" lg="6" md="12">
            <Card>
              <CardHeader>
                <H4>AMC</H4>
              </CardHeader>
              <CardBody className="p-0">
                <AMCDueSummary />
              </CardBody>
            </Card>
          </Col>
          <Col xxl="6" xl="6" lg="6" md="12">
            <Card className="invoice-card">
              <CardHeader className="pb-0">
                <H4>AMC Due</H4>
              </CardHeader>
              <CardBody className="transaction-card">
                <AMCDueTable />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Sales;
