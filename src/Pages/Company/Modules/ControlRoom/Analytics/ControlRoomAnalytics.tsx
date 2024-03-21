import { Badge, Card, CardBody, Col, Row } from "reactstrap";
import "./AnalyticsCss.css";
import ReactApexChart from "react-apexcharts";

import {
  SinceLastMonth,
  ThenLastWeek,
  TotalEarning,
  TotalSales,
} from "../../../../../utils/Constant";

import { H2, H3, H4, H5, P } from "../../../../../AbstractElements";
import SVG from "../../../../../utils/CommonSvgIcon/SVG";
import TotalKillingDevices from "./components/TotalKillingDevices";
import { useEffect, useRef, useState } from "react";
import SendCommand from "./components/SendCommand";
import AddPreAlertinfo from "./components/AddPreAlertInfo";
import { useDispatch, useSelector } from "react-redux";

import { ImArrowUp, ImArrowDown } from "react-icons/im";
import SelfSendCommands from "./components/SelfSendCommands";
import { getAll } from "../../../../../Api";
import { setDashboardStatistics } from "../../../../../ReaduxToolkit/Reducer/AlertsSlice";
import { ApexOptions } from "apexcharts";
import TotalPreInfoAlerts from "./components/TotalPreInfoAlerts";

const ControlRoomAnalytics = () => {
  const { devices } = useSelector((state: any) => state.monitoring);
  const { dashboardStatistics, liveAlertsData } = useSelector(
    (state: any) => state.alerts
  );

  // Initialize empty arrays for categories and data
  const [
    totalKilledDevicesByDayCategories,
    setTotalKilledDevicesByDayCategories,
  ] = useState([]);
  const [totalKilledDevicesByDayData, setTotalKilledDevicesByDayData] =
    useState([]);
  const [
    totalCommandedDevicesByDayCategories,
    setTotalCommandedDevicesByDayCategories,
  ] = useState([]);
  const [totalCommandedDevicesByDayData, setTotalCommandedDevicesByDayData] =
    useState([]);
  const [totalPreInfosByDayCategories, setTotalPreInfosByDayCategories] =
    useState([]);
  const [totalPreInfosByDayData, setTotalPreInfosByDayData] = useState([]);
  useEffect(() => {
    // console.log(
    //   "dashboardStatistics?.controlRoomAnalytics?",
    //   dashboardStatistics
    // );

    var killedDevicesDays: any = [];
    var killedDevicesCategories: any = [];
    var totalCommandedDevicesDays: any = [];
    var totalCommandedDevicesCategories: any = [];
    var totalPreInfosDays: any = [];
    var totalPreInfosCategories: any = [];
    dashboardStatistics?.controlRoomAnalytics?.totalKilledDevicesByDay.forEach(
      (item: any) => {
        killedDevicesCategories.push(item.dayOfWeek);
        killedDevicesDays.push(item.count);
      }
    );
    setTotalKilledDevicesByDayCategories(killedDevicesCategories);
    setTotalKilledDevicesByDayData(killedDevicesDays);
    dashboardStatistics?.controlRoomAnalytics?.totalCommandedDevicesByDay.forEach(
      (item: any) => {
        totalCommandedDevicesCategories.push(item.dayOfWeek);
        totalCommandedDevicesDays.push(item.count);
      }
    );
    setTotalCommandedDevicesByDayCategories(totalCommandedDevicesCategories);
    setTotalCommandedDevicesByDayData(totalCommandedDevicesDays);
    dashboardStatistics?.controlRoomAnalytics?.totalPreInfosByDay.forEach(
      (item: any) => {
        totalPreInfosCategories.push(item.dayOfWeek);
        totalPreInfosDays.push(item.count);
      }
    );
    setTotalPreInfosByDayCategories(totalPreInfosCategories);
    setTotalPreInfosByDayData(totalPreInfosDays);
  }, []);

  // Map data from totalKilledDevicesByDay to categories and data arrays

  const killedDevices: ApexOptions = {
    series: [
      {
        name: "killed vehicles",
        data: totalKilledDevicesByDayData,
      },
    ],
    xaxis: {
      categories: totalKilledDevicesByDayCategories,
    },
    colors: [
      "#33BFBF",
      "#33BFBF",
      "#33BFBF",
      "#33BFBF",
      "#33BFBF",
      "#33BFBF",
      "#33BFBF",
    ],
    chart: {
      height: 70,
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
  };

  const sendCommand: ApexOptions = {
    series: [
      {
        name: "Commands",
        data: totalCommandedDevicesByDayData,
      },
    ],
    xaxis: {
      categories: totalCommandedDevicesByDayCategories,
    },
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
          x: 80,
          y: 30,
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

  const preAlertInfo: ApexOptions = {
    series: [
      {
        name: "Pre Info",
        data: totalPreInfosByDayData,
      },
    ],
    xaxis: {
      categories: totalPreInfosByDayCategories,
    },
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
          x: 80,
          y: 30,
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

  const controlRoomAnalytics = [
    {
      badgeColor: "primary",
      badge: "$",
      title: "Killed Vehicles",
      amount: "10",
      color: "secondary",
      icon: "arrow-down",
      percentage: "- 36.28%",
      time: SinceLastMonth,
      chartId: "expensesChart",
      charts: killedDevices,
      type: "bar",
    },
    {
      badgeColor: "dark",
      svgIcon: "fill-Buy",
      title: TotalSales,
      amount: "$65.340",
      color: "dark",
      icon: "arrow-up",
      percentage: "- 90.28%",
      time: ThenLastWeek,
      chartId: "totalLikesAreaChart",
      charts: sendCommand,
      type: "area",
    },
    {
      badgeColor: "primary",
      badge: "$",
      title: TotalEarning,
      amount: "$20.790",
      color: "secondary",
      icon: "arrow-down",
      percentage: "- 36.28%",
      time: SinceLastMonth,
      chartId: "expensesChart",
      charts: preAlertInfo,
      type: "area",
    },
  ];

  const [
    isUpdateModalOpenForkillingDevices,
    setIsUpdateModalOpenForkillingDevices,
  ] = useState(false);
  const [isUpdateModalOpenForSendCommand, setIsUpdateModalOpenForSendCommand] =
    useState(false);
  const [
    isUpdateModalOpenForPreAlertinfo,
    setIsUpdateModalOpenForPreAlertinfo,
  ] = useState(false);
  const [
    isUpdateModalOpenForGetSendCommands,
    setIsUpdateModalOpenForGetSendCommands,
  ] = useState(false);

  const [
    isUpdateModalOpenForPreInfoAlerts,
    setIsUpdateModalOpenForPreInfoAlerts,
  ] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("Today");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [containerWidth, setContainerWidth] = useState("350px");

  const dropdownRef = useRef<HTMLDivElement>(null); // Add type assertion here

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      // Add type assertion here
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleContainerWidth = () => {
    if (containerWidth === "350px") {
      setContainerWidth("170px");
      if (isDropdownOpen) {
        setIsDropdownOpen(!isDropdownOpen);
      }
    } else {
      setContainerWidth("350px");
    }
  };

  const dispatch = useDispatch();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const startDate = yesterday.toISOString();
  const endDate = new Date().toISOString();

  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);
  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
        <div
          style={{
            width: containerWidth === "350px" ? "350px" : "170px",
            overflow: "hidden",
            height: "30px",
            transition: "width 0.5s",

            borderRadius: "5px",
          }}
          className="btn-primary"
        >
          <div
            style={{
              padding: "10px",
              height: "30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              onClick={toggleContainerWidth}
              style={{
                cursor: "pointer",
                fontSize: "14px",
                color: "white",
                paddingRight: "10px",
                borderRight:
                  containerWidth === "350px" ? "1px solid black" : "0px",
              }}
            >
              {containerWidth === "350px" ? "Hide Analytics" : "Show Analytics"}
            </div>

            {containerWidth === "350px" && (
              <div
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "white",
                  paddingRight: "45px",
                  borderRight: "1px solid black",
                }}
              >
                Filter : {selectedFilter}
              </div>
            )}
            {/*  */}
            {containerWidth === "350px" && (
              <div
                style={{
                  cursor: "pointer",
                }}
                onClick={toggleDropdown}
              >
                <div style={{ fontSize: "24px", color: "white" }}>&#9776;</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div ref={dropdownRef} style={{ position: "relative" }}>
        <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
          {isDropdownOpen && (
            <div
              className="custom-dropdown-analytics"
              style={{ width: "350px", position: "absolute", zIndex: "1" }}
            >
              {isDropdownOpen && (
                <div className="dropdown-options-analytics">
                  <div
                    className="item"
                    onClick={() => {
                      setSelectedFilter("Today");
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      const startDate = yesterday.toISOString();
                      const endDate = new Date().toISOString();
                      setFromDate(startDate);
                      setToDate(endDate);

                      getAll({
                        url: `control-room/dashboard/statistics?fromDate=${startDate}&toDate=${endDate}`,
                      }).then((data: any) => {
                        // // console.log("api call --- >", data);

                        if (data !== undefined) {
                          if (data.success) {
                            // // // console.log("length --- >", data.data);
                            dispatch(setDashboardStatistics(data.data));
                            toggleDropdown();
                          }
                        }
                      });
                    }}
                  >
                    Today
                  </div>
                  <div
                    className="item"
                    onClick={() => {
                      setSelectedFilter("1 Week");
                      const oneWeek = new Date();
                      oneWeek.setDate(oneWeek.getDate() - 7);
                      const startDate = oneWeek.toISOString();
                      const endDate = new Date().toISOString();
                      setFromDate(startDate);
                      setToDate(endDate);

                      getAll({
                        url: `control-room/dashboard/statistics?fromDate=${startDate}&toDate=${endDate}`,
                      }).then((data: any) => {
                        // // console.log("api call --- >", data);

                        if (data !== undefined) {
                          if (data.success) {
                            // // // console.log("length --- >", data.data);

                            dispatch(setDashboardStatistics(data.data));
                            toggleDropdown();
                          }
                        }
                      });
                    }}
                  >
                    1 Week
                  </div>
                  <div
                    className="item"
                    onClick={() => {
                      setSelectedFilter("1 Month");
                      const oneMonth = new Date();
                      oneMonth.setDate(oneMonth.getDate() - 30);
                      const startDate = oneMonth.toISOString();
                      const endDate = new Date().toISOString();
                      setFromDate(startDate);
                      setToDate(endDate);

                      getAll({
                        url: `control-room/dashboard/statistics?fromDate=${startDate}&toDate=${endDate}`,
                      }).then((data: any) => {
                        // // console.log("api call --- >", data);

                        if (data !== undefined) {
                          if (data.success) {
                            // // // console.log("length --- >", data.data);
                            dispatch(setDashboardStatistics(data.data));
                            toggleDropdown();
                          }
                        }
                      });
                    }}
                  >
                    1 Month
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Col
          xl="12"
          lg="12"
          md="12"
          sm="12"
          style={{
            height: containerWidth === "350px" ? "100%" : "0",
            overflow: "hidden",
            transition: "height 0.5s",
            marginTop: "20px",
          }}
        >
          <Row>
            <Col xl="3" lg="6" md="6" sm="12" className="box-col-3">
              <Card className="total-earning">
                <CardBody>
                  <Row style={{ height: "16vh" }}>
                    <Col sm="7" className="box-col-7">
                      <div className="d-flex">
                        <div
                          className="flex-grow-1"
                          style={{ margin: "5px 0px" }}
                        >
                          <H3>{controlRoomAnalytics[0].title}</H3>
                        </div>
                      </div>
                      <H3>
                        {
                          dashboardStatistics?.controlRoomStatistics
                            ?.totalKilledDevicesCount
                        }
                      </H3>
                      <div>
                        <button
                          className="btn-primary"
                          style={{
                            borderRadius: "5px",
                            padding: "5px 15px",
                            color: "white",
                            outline: "none",
                            border: "none",
                            marginTop: "30px",
                          }}
                          onClick={() => {
                            setIsUpdateModalOpenForkillingDevices(true);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </Col>
                    <Col sm="5" className={`box-col-5 `}>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            marginBottom: "-10px",
                            color: "green",
                          }}
                        >
                          {selectedFilter}
                        </div>
                        <ReactApexChart
                          id={controlRoomAnalytics[0].chartId}
                          options={{
                            ...controlRoomAnalytics[0].charts,
                            xaxis: {
                              ...controlRoomAnalytics[0].charts.xaxis,
                            },
                          }}
                          // options={controlRoomAnalytics[0].charts}
                          series={controlRoomAnalytics[0].charts.series}
                          type={controlRoomAnalytics[0].charts.chart?.type}
                          height={controlRoomAnalytics[0].charts.chart?.height}
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <TotalKillingDevices
              isVisible={isUpdateModalOpenForkillingDevices}
              setIsVisible={setIsUpdateModalOpenForkillingDevices}
              fromDate={fromDate}
              toDate={toDate}
            />
            {/*  */}
            <Col xl="3" lg="6" md="6" sm="12" className="box-col-3">
              <Card className="total-earning">
                <CardBody>
                  <Row style={{ height: "16vh" }}>
                    <Col sm="12" className="box-col-7">
                      <div className="d-flex">
                        <div
                          className="flex-grow-1"
                          style={{ margin: "5px 0px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <H3>Connected Servers</H3>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "end",
                                marginBottom: "-10px",
                                color: "green",
                              }}
                            >
                              {selectedFilter}
                            </div>
                          </div>
                        </div>
                      </div>
                      {liveAlertsData?.connectedServers?.map(
                        (server: any, index: any) => {
                          return (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "start",
                              }}
                            >
                              <div
                                style={{ fontSize: "16px", fontWeight: "bold" }}
                              >
                                {server?.server?.companyName} :
                              </div>
                              <div
                                style={{
                                  marginLeft: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    height: "10px",
                                    width: "10px",
                                    borderRadius: "50px",
                                    backgroundColor: `${
                                      server?.isConnected ? "green" : "red"
                                    }`,
                                    marginRight: "5px",
                                  }}
                                ></div>
                                <div>
                                  {server?.isConnected
                                    ? "Connected"
                                    : "Not Connected"}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/*  */}
            <Col xl="3" lg="6" md="6" sm="12" className="box-col-3">
              <Card className="total-earning">
                <CardBody>
                  <Row style={{ height: "16vh" }}>
                    <Col sm="7" className="box-col-7">
                      <div className="d-flex">
                        <div
                          className="flex-grow-1"
                          style={{ margin: "5px 0px" }}
                        >
                          <H3>Send Command</H3>
                        </div>
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                        <H3>
                          {
                            dashboardStatistics?.controlRoomStatistics
                              ?.totalCommandedDevicesCount
                          }
                        </H3>
                      </div>
                      <div>
                        <div style={{ display: "flex" }}>
                          <button
                            className="btn-primary"
                            style={{
                              borderRadius: "5px",
                              padding: "5px 15px",
                              color: "white",
                              outline: "none",
                              border: "none",
                              marginTop: "30px",
                            }}
                            onClick={() => {
                              setIsUpdateModalOpenForSendCommand(true);
                            }}
                          >
                            Send
                          </button>
                          <button
                            className="btn-primary"
                            style={{
                              borderRadius: "5px",
                              padding: "5px 15px",
                              color: "white",
                              outline: "none",
                              border: "none",
                              marginTop: "30px",
                              marginLeft: "10px",
                            }}
                            onClick={() => {
                              setIsUpdateModalOpenForGetSendCommands(true);
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Col>
                    <Col sm="5" className={`box-col-5 `}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          marginBottom: "-10px",
                          color: "green",
                        }}
                      >
                        {selectedFilter}
                      </div>
                      <ReactApexChart
                        id={controlRoomAnalytics[1].chartId}
                        options={controlRoomAnalytics[1].charts}
                        series={controlRoomAnalytics[1].charts.series}
                        type={controlRoomAnalytics[1].charts.chart?.type}
                        height={controlRoomAnalytics[1].charts.chart?.height}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <SendCommand
              addModal={isUpdateModalOpenForSendCommand}
              setAddModal={setIsUpdateModalOpenForSendCommand}
              dropDownDevices={devices}
              prevItem=""
              fromDate={fromDate}
              toDate={toDate}
            />
            <SelfSendCommands
              isVisible={isUpdateModalOpenForGetSendCommands}
              setIsVisible={setIsUpdateModalOpenForGetSendCommands}
            />
            {/*  */}
            <Col xl="3" lg="6" md="6" sm="12" className="box-col-3">
              <Card className="total-earning">
                <CardBody>
                  <Row style={{ height: "16vh" }}>
                    <Col sm="7" className="box-col-7">
                      <div className="d-flex">
                        <div
                          className="flex-grow-1"
                          style={{ margin: "5px 0px" }}
                        >
                          <H3>Pre Alert info</H3>
                        </div>
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                        {
                          dashboardStatistics?.controlRoomStatistics
                            ?.totalPreInfosCount
                        }
                      </div>
                      <div style={{ display: "flex" }}>
                        <button
                          className="btn-primary"
                          style={{
                            borderRadius: "5px",
                            padding: "5px 15px",
                            color: "white",
                            outline: "none",
                            border: "none",
                            marginTop: "30px",
                          }}
                          onClick={() => {
                            setIsUpdateModalOpenForPreAlertinfo(true);
                          }}
                        >
                          Add
                        </button>
                        <button
                          className="btn-primary"
                          style={{
                            borderRadius: "5px",
                            padding: "5px 15px",
                            color: "white",
                            outline: "none",
                            border: "none",
                            marginTop: "30px",
                            marginLeft: "10px",
                          }}
                          onClick={() => {
                            setIsUpdateModalOpenForPreInfoAlerts(true);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </Col>
                    <Col sm="5" className={`box-col-5 `}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          marginBottom: "-10px",
                          color: "green",
                        }}
                      >
                        {selectedFilter}
                      </div>
                      <ReactApexChart
                        id={controlRoomAnalytics[2].chartId}
                        options={controlRoomAnalytics[2].charts}
                        series={controlRoomAnalytics[2].charts.series}
                        type={controlRoomAnalytics[2].charts.chart?.type}
                        height={controlRoomAnalytics[2].charts.chart?.height}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <AddPreAlertinfo
              addModal={isUpdateModalOpenForPreAlertinfo}
              setAddModal={setIsUpdateModalOpenForPreAlertinfo}
              dropDownDevices={devices}
              fromDate={fromDate}
              toDate={toDate}
            />
            <TotalPreInfoAlerts
              isVisible={isUpdateModalOpenForPreInfoAlerts}
              setIsVisible={setIsUpdateModalOpenForPreInfoAlerts}
            />
          </Row>
        </Col>
      </div>
    </>
  );
};

export default ControlRoomAnalytics;

{
  /* {containerWidth === "200px" ? (
              <ImArrowUp
                onClick={toggleContainerWidth}
                style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
              />
            ) : (
              <ImArrowDown
                onClick={toggleContainerWidth}
                style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
              />
            )} */
}
