import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Modal,
  ModalBody,
  Progress,
  Row,
} from "reactstrap";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { H3, H5, P, Image, LI, UL } from "../../../AbstractElements";
import { boxesData1, boxesData2, operatorPerformanceData } from "./GeneralData";

import { Link } from "react-router-dom";
import { dynamicImage } from "../../../Service";
import { Href } from "../../../utils/Constant";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { apexDonutCharts } from "../../../Data/Charts/ApexChartsData";
import { ApexOptions } from "apexcharts";
import Draggable from "react-draggable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import Chart from "react-google-charts";
import { getAll } from "../../../Api";
import {
  setAlertsOverview,
  setGeneralData,
  setOperatorPerformance,
} from "../../../ReaduxToolkit/Reducer/DashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import OperatorAlerts from "./components/OperatorAlerts";
import { getUserRole } from "../../../Api/globals";
import { ROLES } from "../../../constants/roles";

interface DraggableBoxProps {
  initialPosition: { x: number; y: number };
}

const General = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  // Simulating data fetching with a timeout

  const [generalloading, setGeneralLoading] = useState<boolean>(true);
  const [operatorPerformanceloading, setOperatorPerformanceLoading] =
    useState<boolean>(true);
  const { generalData, operatorPerformance } = useSelector(
    (state: any) => state.dashboard
  );
  const donutChart = {
    chartType: "PieChart",
    data: [
      ["Task", "Hours per Day"],
      ["Active", 11],
      ["Inctive", 2],
    ],
    option: {
      title: "Operators",
      colors: ["#33BFBF", "#FF6150"],
    },
  };

  const pieChart = {
    width: "100%",
    height: "400px",
    chartType: "PieChart",
    data: [
      ["Task", "Hours per Day"],
      ["Connecetd", 11],
      ["Not Connected", 2],
    ],
    option: {
      title: "My Daily Activities",
      colors: ["#33BFBF", "#FF6150"],
    },
    rootProps: {
      "data-testid": "2",
    },
  };

  // const [positions, setPositions] = useState(() => {
  //   const savedPositionsString = localStorage.getItem("positions");
  //   if (savedPositionsString !== null) {
  //     const savedPositions = JSON.parse(savedPositionsString);
  //     return savedPositions;
  //   }
  // });

  // const handleDrag = (key: string, e: any, ui: any) => {
  //   const { x, y } = ui;
  //   setPositions((prevPositions: any) => ({
  //     ...prevPositions,
  //     [key]: { x, y }, // Update position for the specific draggable element
  //   }));
  // };

  // useEffect to save positions to localStorage when positions change
  // useEffect(() => {
  //   localStorage.setItem("positions", JSON.stringify(positions));
  // }, [positions]);

  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    if (getUserRole() == ROLES.COMPANY) {
      getAll({ url: "company/dashboard/general" }).then((data: any) => {
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            // // console.log("length --- >", data.data);
            const expirationDate = new Date(
              data.data.companyPackageStatistics.packageExpirationDate
            );
            const today = new Date();
            const differenceInTime = expirationDate.getTime() - today.getTime();
            const differenceInDays = Math.ceil(
              differenceInTime / (1000 * 3600 * 24)
            );
            setDaysRemaining(differenceInDays);
            dispatch(setGeneralData(data.data));

            setGeneralLoading(false);
          }
          if (!data.success) {
            // // // console.log("length --- >", data.data);
            dispatch(setGeneralData(null));
            setGeneralLoading(false);
          }
        }
      });

      getAll({
        url: `company/dashboard/operators-performance?fromDate=${fromDate}&toDate=${toDate}`,
      }).then((data: any) => {
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            // // console.log("length --- >", data.data);
            dispatch(setOperatorPerformance(data.data));
            setOperatorPerformanceLoading(false);
          }
          if (!data.success) {
            // // // console.log("length --- >", data.data);
            dispatch(setOperatorPerformance([]));
            setOperatorPerformanceLoading(false);
          }
        }
      });
    }
  }, []);
  const [
    isUpdateModalOpenForOperatorAlerts,
    setIsUpdateModalOpenForOperatorAlerts,
  ] = useState(false);

  const [alertsData, setAlertsData] = useState();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const startDate = yesterday.toISOString();
  const endDate = new Date().toISOString();

  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);

  const [selectedFilter, setSelectedFilter] = useState("Today");
  const dropdownRef = useRef<HTMLDivElement>(null); // Add type assertion here
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (
  //     dropdownRef.current &&
  //     !dropdownRef.current.contains(event.target as Node)
  //   ) {
  //     // Add type assertion here
  //     setIsDropdownOpen(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const toggleDropdown = (e: any) => {
    e.stopPropagation(); // Stop event propagation
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [customFilterModal, setCustomFilterModal] = useState(false);

  const [addModal, setAddModal] = useState(false);

  const addToggle = () => {
    // if (!generalloading) {
    setAddModal(!addModal);

    // }
  };

  return (
    <Col xl="12" lg="12" md="12" sm="12">
      {generalloading == true ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <Skeleton width={350} height={200} />
            </div>
            <div>
              <Skeleton width={350} height={210} />
            </div>
          </div>
          <div
            style={{
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <Skeleton width={700} height={440} />
          </div>
          <div
            style={{
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <Skeleton width={350} height={200} />
            </div>
            <div>
              <Skeleton width={350} height={210} />
            </div>
          </div>
          {/* Example for an avatar */}
          {/* <Skeleton count={3} height={20} /> Example for text */}
        </div>
      ) : (
        <Row style={{ display: "flex" }}>
          {/* <Draggable
            handle=".handle"
            defaultPosition={positions.box1}
            grid={[1, 1]}
            scale={1}
            onStart={() => {}}
            onDrag={(e, ui) => handleDrag("box1", e, ui)}
            onStop={() => {}}
          >
            
          </Draggable> */}

          <Col xl="3" className="box">
            <Card
              className="widget-sell handle"
              style={{ minHeight: "410px", maxHeight: "410px" }}
            >
              <CardBody className="pb-0">
                <Row>
                  <Col xl="12" lg="12" sm="12" className="mb-3">
                    <div className="sale">
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <H5>Total Operators</H5>
                          <div
                            style={{
                              padding: "6px",
                              width: "35px",
                              height: "35px",
                              borderRadius: "100px",
                              backgroundColor: "black",
                              color: "white",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontFamily: "Sedan, serif",
                              fontWeight: "400",
                              fontStyle: "normal",
                            }}
                          >
                            {generalData.operatorStatistics
                              .totalActiveOperators +
                              generalData.operatorStatistics
                                .totalInActiveOperators}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "85%", // Set the width of the outer container
                            height: "22vh", // Set the height of the outer container
                            // backgroundColor: "gray", // Remove the background color
                          }}
                        >
                          <div
                            style={{
                              flex: "1",
                              marginRight: "0px",
                              // backgroundColor: "gray",
                            }}
                          >
                            <Chart
                              width={"100%"}
                              height={"100%"} // Set the height of the chart to fill the outer container
                              chartType={"PieChart"}
                              loader={<div>{"Loading Chart"}</div>}
                              data={[
                                ["Task", "Hours per Day"],
                                [
                                  "Active",
                                  generalData.operatorStatistics
                                    .totalActiveOperators,
                                ],
                                [
                                  "Inctive",
                                  generalData.operatorStatistics
                                    .totalInActiveOperators,
                                ],
                              ]}
                              options={{
                                backgroundColor: "transparent", // Set chart background color as transparent
                                chartArea: {
                                  backgroundColor: "transparent", // Set chart area background color as transparent
                                  top: 10, // Set padding of the top of chart area to 0
                                  left: 25, // Set padding of the left of chart area to 0
                                  right: 0,
                                },
                                pieHole: 0.4,
                                pieSliceText: "value", // Display the exact values of each option
                                colors: ["#51bb25", "#ff6150"], // Custom colors for Active and Inactive options respectively
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {/* <P className="d-flex">
                        <span className={`bg-light-${data.color} me-2`}>
                          <SVG iconId={data.svgIcon} />
                        </span>
                        <span className={`font-${data.color}`}>
                          {data.percentage}
                        </span>
                      </P>
                      <span className="sale-title">{data.time}</span> */}
                    </div>
                  </Col>
                  <Col xl="12" lg="12" sm="12" className="mb-3">
                    <div className="sale">
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <H5>Total Servers</H5>
                          <div
                            style={{
                              padding: "6px",
                              width: "35px",
                              height: "35px",
                              borderRadius: "100px",
                              backgroundColor: "black",
                              color: "white",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontFamily: "Sedan, serif",
                              fontWeight: "400",
                              fontStyle: "normal",
                            }}
                          >
                            {generalData.companyServerStatistics
                              .totalActiveServers +
                              generalData.companyServerStatistics
                                .totalInActiveServers}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "85%", // Set the width of the outer container
                            height: "22vh", // Set the height of the outer container
                            // backgroundColor: "gray", // Remove the background color
                          }}
                        >
                          <div
                            style={{
                              flex: "1",
                              marginRight: "0px",
                              // backgroundColor: "gray",
                            }}
                          >
                            <Chart
                              width={"100%"}
                              height={"100%"} // Set the height of the chart to fill the outer container
                              chartType={"PieChart"}
                              loader={<div>{"Loading Chart"}</div>}
                              data={[
                                ["Task", "Hours per Day"],
                                [
                                  "Connected",
                                  generalData.companyServerStatistics
                                    .totalActiveServers,
                                ],
                                [
                                  "Disconnected",
                                  generalData.companyServerStatistics
                                    .totalInActiveServers,
                                ],
                              ]}
                              options={{
                                backgroundColor: "transparent", // Set chart background color as transparent
                                chartArea: {
                                  backgroundColor: "transparent", // Set chart area background color as transparent
                                  top: 10, // Set padding of the top of chart area to 0
                                  left: 25, // Set padding of the left of chart area to 0
                                  right: 0,
                                },
                                pieSliceText: "value", // Display the exact values of each option
                                colors: ["#51bb25", "#ff6150"], // Custom colors for Active and Inactive options respectively
                              }}
                              rootProps={pieChart.rootProps}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          {/* <Draggable
            handle=".handle1"
            defaultPosition={positions.box2}
            grid={[1, 1]}
            scale={1}
            onStart={() => {}}
            onDrag={(e, ui) => handleDrag("box2", e, ui)}
            onStop={() => {}}
          >
            
          </Draggable> */}

          <Col xl="6" className="box">
            <Row className="handle1">
              <Col xl="12" lg="12">
                <Card
                  className="deal-open"
                  style={{ minHeight: "410px", maxHeight: "410px" }}
                >
                  <CardHeader className="pb-0">
                    <div
                      className="header-top"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <H5 className="m-0">Operator Performance</H5>
                      <div>
                        <div
                          style={{
                            width: "250px",
                            overflow: "hidden",
                            height: "30px",
                            // transition: "width 0.5s",
                            color: "white",
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
                              style={{
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "white",
                                paddingRight: "45px",
                                borderRight: "1px solid black",
                              }}
                              onClick={(e: any) => {
                                toggleDropdown(e);
                              }}
                            >
                              Filter : {selectedFilter}
                              {/* Filter : Today */}
                            </div>
                            <div
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={(e: any) => {
                                toggleDropdown(e);
                              }}
                            >
                              <div style={{ fontSize: "24px", color: "white" }}>
                                &#9776;
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          ref={dropdownRef}
                          style={{
                            width: "250px",
                            display: "flex",
                            justifyContent: "end",
                          }}
                        >
                          {isDropdownOpen && (
                            <div
                              className="custom-dropdown-analytics"
                              style={{
                                width: "250px",
                                position: "absolute",
                                zIndex: "1",
                              }}
                            >
                              {isDropdownOpen && (
                                <div
                                  className="dropdown-options-analytics"
                                  style={{
                                    width: "250px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "250px",
                                    }}
                                    className="dropdown-item"
                                    onClick={(e) => {
                                      setGeneralLoading(true);
                                      setSelectedFilter("Yesterday");
                                      const dayBeforeYesterday = new Date();

                                      dayBeforeYesterday.setDate(
                                        dayBeforeYesterday.getDate() - 2
                                      );

                                      const yesterday = new Date();
                                      yesterday.setDate(
                                        yesterday.getDate() - 1
                                      );
                                      const startDate =
                                        dayBeforeYesterday.toISOString();
                                      const endDate = yesterday.toISOString();
                                      setFromDate(startDate);
                                      setToDate(endDate);

                                      getAll({
                                        url: `company/dashboard/operators-performance?fromDate=${startDate}&toDate=${endDate}`,
                                      }).then((data: any) => {
                                        toggleDropdown(e);
                                        // console.log("api call --- >", data);
                                        if (data !== undefined) {
                                          if (data.success) {
                                            // // console.log("length --- >", data.data);
                                            dispatch(
                                              setOperatorPerformance(data.data)
                                            );
                                            setGeneralLoading(false);
                                          }
                                          if (!data.success) {
                                            // // // console.log("length --- >", data.data);
                                            dispatch(
                                              setOperatorPerformance([])
                                            );
                                            setGeneralLoading(false);
                                          }
                                        }
                                      });
                                    }}
                                  >
                                    Yesterday
                                  </div>
                                  <div
                                    style={{
                                      width: "250px",
                                    }}
                                    className="dropdown-item"
                                    onClick={(e) => {
                                      setGeneralLoading(true);
                                      setSelectedFilter("Today");
                                      const yesterday = new Date();
                                      yesterday.setDate(
                                        yesterday.getDate() - 1
                                      );
                                      const startDate = yesterday.toISOString();
                                      const endDate = new Date().toISOString();
                                      setFromDate(startDate);
                                      setToDate(endDate);

                                      getAll({
                                        url: `company/dashboard/operators-performance?fromDate=${startDate}&toDate=${endDate}`,
                                      }).then((data: any) => {
                                        toggleDropdown(e);
                                        // console.log("api call --- >", data);
                                        if (data !== undefined) {
                                          if (data.success) {
                                            // // console.log("length --- >", data.data);
                                            dispatch(
                                              setOperatorPerformance(data.data)
                                            );
                                            setGeneralLoading(false);
                                          }
                                          if (!data.success) {
                                            // // // console.log("length --- >", data.data);
                                            dispatch(
                                              setOperatorPerformance([])
                                            );
                                            setGeneralLoading(false);
                                          }
                                        }
                                      });
                                    }}
                                  >
                                    Today
                                  </div>
                                  <div
                                    style={{
                                      width: "250px",
                                    }}
                                    className="dropdown-item"
                                    onClick={(e) => {
                                      setGeneralLoading(true);
                                      setSelectedFilter("1 Week");
                                      const oneWeek = new Date();
                                      oneWeek.setDate(oneWeek.getDate() - 7);
                                      const startDate = oneWeek.toISOString();
                                      const endDate = new Date().toISOString();
                                      setFromDate(startDate);
                                      setToDate(endDate);

                                      getAll({
                                        url: `company/dashboard/operators-performance?fromDate=${startDate}&toDate=${endDate}`,
                                      }).then((data: any) => {
                                        toggleDropdown(e);
                                        // console.log("api call --- >", data);
                                        if (data !== undefined) {
                                          if (data.success) {
                                            // // console.log("length --- >", data.data);
                                            dispatch(
                                              setOperatorPerformance(data.data)
                                            );
                                            setGeneralLoading(false);
                                          }
                                          if (!data.success) {
                                            // // // console.log("length --- >", data.data);
                                            dispatch(
                                              setOperatorPerformance([])
                                            );
                                            setGeneralLoading(false);
                                          }
                                        }
                                      });
                                    }}
                                  >
                                    1 Week
                                  </div>
                                  <div
                                    style={{
                                      width: "250px",
                                    }}
                                    className="dropdown-item"
                                    onClick={(e) => {
                                      setGeneralLoading(true);
                                      setSelectedFilter("1 Month");
                                      const oneMonth = new Date();
                                      oneMonth.setDate(oneMonth.getDate() - 30);
                                      const startDate = oneMonth.toISOString();
                                      const endDate = new Date().toISOString();
                                      setFromDate(startDate);
                                      setToDate(endDate);

                                      getAll({
                                        url: `company/dashboard/operators-performance?fromDate=${startDate}&toDate=${endDate}`,
                                      }).then((data: any) => {
                                        toggleDropdown(e);
                                        // console.log("api call --- >", data);
                                        if (data !== undefined) {
                                          if (data.success) {
                                            // // console.log("length --- >", data.data);
                                            dispatch(
                                              setOperatorPerformance(data.data)
                                            );
                                            setGeneralLoading(false);
                                          }
                                          if (!data.success) {
                                            // // // console.log("length --- >", data.data);
                                            dispatch(
                                              setOperatorPerformance([])
                                            );
                                            setGeneralLoading(false);
                                          }
                                        }
                                      });
                                    }}
                                  >
                                    1 Month
                                  </div>

                                  <div
                                    style={{
                                      width: "250px",
                                    }}
                                    className="dropdown-item"
                                    onClick={(e) => {
                                      setSelectedFilter("Custom");
                                      addToggle();
                                      // toggleDropdown(e);
                                    }}
                                  >
                                    Custom
                                  </div>

                                  <Modal
                                    isOpen={addModal}
                                    toggle={addToggle}
                                    size="md"
                                    centered
                                  >
                                    <div className="modal-header">
                                      <H3 className="modal-title">
                                        Custom Filter Date
                                      </H3>
                                      <Button
                                        color="transprant"
                                        className="btn-close"
                                        onClick={addToggle}
                                      ></Button>
                                    </div>

                                    <ModalBody>
                                      <form className="form-bookmark needs-validation">
                                        <Row>
                                          <FormGroup
                                            className="col-md-12 create-group"
                                            style={{
                                              alignItems: "center",
                                            }}
                                          >
                                            <div>Date From:</div>
                                            <Col md={12}>
                                              <input
                                                className="form-control"
                                                type="date"
                                                value={fromDate.slice(0, 10)}
                                                onChange={(e) => {
                                                  setFromDate(
                                                    new Date(
                                                      e.target.value
                                                    ).toISOString()
                                                  );
                                                  // console.log("e", e.target.value);
                                                }}
                                              />
                                            </Col>
                                          </FormGroup>
                                          <FormGroup
                                            className="col-md-12 create-group"
                                            style={{
                                              alignItems: "center",
                                            }}
                                          >
                                            <div>Date To:</div>
                                            <Col md={12}>
                                              <input
                                                className="form-control"
                                                type="date"
                                                value={toDate.slice(0, 10)}
                                                onChange={(e) => {
                                                  // console.log(e.target.value);
                                                  setToDate(
                                                    new Date(
                                                      e.target.value
                                                    ).toISOString()
                                                  );
                                                }}
                                              />
                                            </Col>
                                          </FormGroup>
                                        </Row>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "end",
                                            alignItems: "end",
                                            marginTop: "-20px",
                                          }}
                                        >
                                          <Button
                                            disabled={
                                              generalloading ? true : false
                                            }
                                            color="secondary"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              addToggle();
                                            }}
                                          >
                                            Cancel
                                          </Button>
                                          &nbsp;&nbsp;
                                          <Button
                                            color="primary"
                                            className="me-1"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setGeneralLoading(true);
                                              getAll({
                                                url: `company/dashboard/operators-performance?fromDate=${fromDate}&toDate=${toDate}`,
                                              }).then((data: any) => {
                                                toggleDropdown(e);
                                                // console.log("api call --- >", data);
                                                if (data !== undefined) {
                                                  if (data.success) {
                                                    // // console.log("length --- >", data.data);
                                                    dispatch(
                                                      setOperatorPerformance(
                                                        data.data
                                                      )
                                                    );
                                                    setGeneralLoading(false);
                                                    addToggle();
                                                  }
                                                  if (!data.success) {
                                                    // // // console.log("length --- >", data.data);
                                                    dispatch(
                                                      setOperatorPerformance([])
                                                    );
                                                    setGeneralLoading(false);
                                                    addToggle();
                                                  }
                                                }
                                              });
                                            }}
                                          >
                                            {generalloading
                                              ? "Loading ..."
                                              : `Set`}
                                          </Button>
                                        </div>
                                      </form>
                                    </ModalBody>
                                  </Modal>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div
                      style={{
                        margin: "15px 0px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          width: "32%",
                          padding: "6px",
                          textAlign: "center",
                          backgroundColor: "rgb(51, 191, 191)",
                          borderRadius: "10px",
                          color: "white",
                        }}
                      >
                        Total:&nbsp;
                        {
                          operatorPerformance.companyAlertEventsStatistics
                            .totalLiveAlerts
                        }
                      </div>
                      <div
                        style={{
                          width: "32%",
                          padding: "6px",
                          textAlign: "center",
                          backgroundColor: "rgb(255, 97, 80)",
                          borderRadius: "10px",
                          color: "white",
                        }}
                      >
                        Assigned: &nbsp;
                        {
                          operatorPerformance.companyAlertEventsStatistics
                            .totalAssignedAlerts
                        }
                      </div>
                      <div
                        style={{
                          width: "32%",
                          padding: "6px",
                          textAlign: "center",
                          backgroundColor: "rgb(81, 187, 37)",
                          borderRadius: "10px",
                          color: "white",
                        }}
                      >
                        Completed:&nbsp;
                        {
                          operatorPerformance.companyAlertEventsStatistics
                            .totalCompletedAlerts
                        }
                      </div>
                    </div>
                    <UL
                      className="theme-scrollbar"
                      style={{
                        overflowY: "scroll",
                        overflowX: "auto",
                        maxHeight: "calc(38vh - 20px)", // Subtract scrollbar width from max height
                        WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
                        scrollbarWidth: "thin", // Specify scrollbar width
                        WebkitBorderRadius: "5px", // For WebKit browsers (Chrome, Safari)
                        MozBorderRadius: "5px", // For Mozilla Firefox
                        borderRadius: "5px", // For other browsers
                        scrollbarColor: "lightgray transparent", // Specify scrollbar color
                      }}
                    >
                      {/* <Collapse
                          defaultActiveKey={[""]}
                          // onChange={onChange}
                          items={items}
                          style={{
                            padding: "0px",
                            border: "none",
                            outline: "none",
                          }}
                        /> */}

                      {operatorPerformance.groupedAlerts.map(
                        (data: any, index: any) => (
                          <>
                            <li
                              className="d-flex align-items-center"
                              key={index}
                              style={{
                                padding: "10px 12px",
                                display: "flex",
                                justifyContent: "space-between",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setIsUpdateModalOpenForOperatorAlerts(true);
                                setAlertsData(data.alerts);
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                {/* <Image
                                src={dynamicImage(
                                  `dashboard-2/user/${data.img}.jpg`
                                )}
                                alt=""
                              /> */}
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Link className="ms-2" to={Href}>
                                    <h5
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {data.operator.fullName}
                                    </h5>
                                    <span
                                      style={{
                                        fontSize: "13px",
                                      }}
                                    >
                                      {data.operator.emailAddress}
                                    </span>
                                  </Link>
                                </div>
                              </div>

                              <div
                                style={{
                                  textAlign: "center",
                                  width: "30%",
                                  alignItems: "center",
                                }}
                              >
                                <H5>
                                  {operatorPerformance.totalAlertEventsOfCompany ==
                                  0
                                    ? 0
                                    : (
                                        (data.alerts.length /
                                          operatorPerformance.totalAlertEventsOfCompany) *
                                        100
                                      ).toFixed(0)}
                                  %
                                </H5>
                                <Fragment key={index}>
                                  <Progress
                                    value={
                                      operatorPerformance.totalAlertEventsOfCompany ==
                                      0
                                        ? 0
                                        : (
                                            (data.alerts.length /
                                              operatorPerformance.totalAlertEventsOfCompany) *
                                            100
                                          ).toFixed(0)
                                    }
                                    // className="mb-4"
                                    striped={true}
                                    color="success"
                                    animated={true}
                                  >
                                    {operatorPerformance.totalAlertEventsOfCompany ==
                                    0
                                      ? 0
                                      : (
                                          (data.alerts.length /
                                            operatorPerformance.totalAlertEventsOfCompany) *
                                          100
                                        ).toFixed(0)}
                                  </Progress>
                                </Fragment>
                              </div>
                              <div>
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Alerts Catered: &nbsp;
                                </span>
                                <span
                                  style={{
                                    fontSize: "20px",
                                  }}
                                >
                                  {data.alerts.length}
                                </span>
                              </div>
                            </li>
                          </>
                        )
                      )}
                      {isUpdateModalOpenForOperatorAlerts && (
                        <OperatorAlerts
                          isVisible={isUpdateModalOpenForOperatorAlerts}
                          setIsVisible={setIsUpdateModalOpenForOperatorAlerts}
                          data={alertsData}
                        />
                      )}
                    </UL>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>

          {/* <Draggable
            handle=".handle2"
            defaultPosition={positions.box3}
            grid={[1, 1]}
            scale={1}
            onStart={() => {}}
            onDrag={(e, ui) => handleDrag("box3", e, ui)}
            onStop={() => {}}
          >
            
          </Draggable> */}

          <Col xl="3" className="box">
            <Card
              className="widget-sell handle2"
              style={{ minHeight: "410px", maxHeight: "410px" }}
            >
              <CardBody className="pb-0">
                <Row>
                  <Col xl="12" lg="12" sm="12" className="mb-3">
                    <div className="sale">
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <H5>Package Expiry - Days</H5>
                          <div
                            style={{
                              padding: "6px",
                              width: "35px",
                              height: "35px",
                              borderRadius: "100px",
                              backgroundColor: "black",
                              color: "white",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontFamily: "Sedan, serif",
                              fontWeight: "400",
                              fontStyle: "normal",
                            }}
                          >
                            {daysRemaining}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "85%", // Set the width of the outer container
                            height: "22vh", // Set the height of the outer container
                            // backgroundColor: "gray", // Remove the background color
                          }}
                        >
                          <div
                            style={{
                              flex: "1",
                              marginRight: "0px",
                              // backgroundColor: "gray",
                            }}
                          >
                            <Chart
                              width={"100%"}
                              height={"100%"} // Set the height of the chart to fill the outer container
                              chartType={"PieChart"}
                              loader={<div>{"Loading Chart"}</div>}
                              data={[
                                ["Task", "Hours per Day"],
                                [
                                  "Remaining",
                                  daysRemaining < 0 ? 0 : daysRemaining,
                                ],
                                [
                                  "Passed",
                                  daysRemaining > 0
                                    ? generalData.companyPackageStatistics
                                        .packageDays - daysRemaining
                                    : generalData.companyPackageStatistics
                                        .packageDays,
                                ],
                              ]}
                              options={{
                                backgroundColor: "transparent", // Set chart background color as transparent
                                chartArea: {
                                  backgroundColor: "transparent", // Set chart area background color as transparent
                                  top: 10, // Set padding of the top of chart area to 0
                                  left: 25, // Set padding of the left of chart area to 0
                                  right: 0,
                                },
                                pieHole: 0.4,
                                pieSliceText: "value", // Display the exact values of each option
                                colors: ["#51bb25", "#ff6150"], // Custom colors for Active and Inactive options respectively
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xl="12" lg="12" sm="12" className="mb-3">
                    <div className="sale">
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <H5>Total Leads</H5>
                          <div
                            style={{
                              padding: "6px",
                              width: "35px",
                              height: "35px",
                              borderRadius: "100px",
                              backgroundColor: "black",
                              color: "white",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontFamily: "Sedan, serif",
                              fontWeight: "400",
                              fontStyle: "normal",
                            }}
                          >
                            1
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "85%", // Set the width of the outer container
                            height: "22vh", // Set the height of the outer container
                            // backgroundColor: "gray", // Remove the background color
                          }}
                        >
                          <div
                            style={{
                              flex: "1",
                              marginRight: "0px",
                              // backgroundColor: "gray",
                            }}
                          >
                            <Chart
                              width={"100%"}
                              height={"100%"} // Set the height of the chart to fill the outer container
                              chartType={"PieChart"}
                              loader={<div>{"Loading Chart"}</div>}
                              data={[
                                ["Task", "Hours per Day"],
                                ["Active", 1],
                              ]}
                              options={{
                                backgroundColor: "transparent", // Set chart background color as transparent
                                chartArea: {
                                  backgroundColor: "transparent", // Set chart area background color as transparent
                                  top: 10, // Set padding of the top of chart area to 0
                                  left: 25, // Set padding of the left of chart area to 0
                                  right: 0,
                                },
                                pieSliceText: "value", // Display the exact values of each option
                                colors: ["#51bb25", "#ff6150"], // Custom colors for Active and Inactive options respectively
                              }}
                              rootProps={pieChart.rootProps}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </Col>
  );
};

export default General;

{
  /* <Draggable
          handle=".handle"
          defaultPosition={{ x: position.x, y: position.y }}
          grid={[1, 1]}
          scale={1}
          onStart={() => {}}
          onDrag={handleDrag}
          onStop={() => {}}
        >
          <div className="box">
            <div className="handle">Drag me!</div>
            <div>
              Position: x={position.x}, y={position.y}
            </div>
          </div>
        </Draggable> */
}

// var seriesData = [5, 10]; // Your series data

// var apexDonutCharts: ApexOptions = {
//   chart: {
//     width: "100%", // Make the width responsive
//     type: "donut",
//   },
//   series: seriesData,
//   responsive: [
//     {
//       breakpoint: 1440, // Adjust based on your screen size
//       options: {
//         chart: {
//           width: "115%", // Adjust width for smaller screens
//         },
//       },
//     },
//     {
//       breakpoint: 1200, // Adjust based on your screen size
//       options: {
//         chart: {
//           width: "80%", // Adjust width for smaller screens
//         },
//       },
//     },
//     {
//       breakpoint: 1040, // Adjust based on your screen size
//       options: {
//         chart: {
//           width: "80%", // Adjust width for smaller screens
//         },
//       },
//     },
//     {
//       breakpoint: 768, // Adjust based on your screen size
//       options: {
//         chart: {
//           width: "80%", // Adjust width for smaller screens
//         },
//       },
//     },
//     {
//       breakpoint: 480, // Adjust based on your screen size
//       options: {
//         chart: {
//           width: "100%", // Adjust width for even smaller screens
//         },
//       },
//     },
//   ],
//   colors: ["#33BFBF", "#FF6150"],
//   labels: ["Active", "Not Active"], // Set series names here
//   plotOptions: {
//     pie: {
//       donut: {
//         size: "60%", // Adjust the thickness of the donut chart
//       },
//     },
//   },
// };

//   const text = `
//   A dog is a type of domesticated animal.
//   Known for its loyalty and faithfulness,
//   it can be found as a welcome guest in many households across the world.
// `;

//   const items: CollapseProps["items"] = operatorPerformanceData.map(
//     (data, index) => ({
//       key: `${index}`,
//       label: (
//         <Fragment>
//           <li
//             className="d-flex align-items-center"
//             key={index}
//             style={{
//               padding: "1px 10px",
//               display: "flex",
//               border: "none",
//               outline: "none",
//               justifyContent: "space-between",
//             }}
//           >
//             <div style={{ display: "flex", border: "none", outline: "none" }}>
//               {/* <Image
//                 src={dynamicImage(`dashboard-2/user/${data.img}.jpg`)}
//                 alt=""
//               /> */}
//               <div style={{ display: "flex", flexDirection: "column" }}>
//                 <Link className="ms-2" to={Href}>
//                   <H5>{data.title}</H5>
//                   <span>{data.subTitle}</span>
//                 </Link>
//               </div>
//             </div>
//             <div>
//               <span
//                 style={{
//                   fontSize: "20px",
//                 }}
//               >
//                 Alerts Catered: &nbsp;
//               </span>
//               <span
//                 style={{
//                   fontSize: "20px",
//                 }}
//               >
//                 200
//               </span>
//             </div>
//             {/* <div
//               style={{
//                 textAlign: "center",
//                 width: "30%",
//                 alignItems: "center",
//               }}
//             >
//               <H5>50%</H5>
//               <Fragment>
//                 <Progress
//                   value={50}
//                   className="mb-4"
//                   striped={true}
//                   color="success"
//                   animated={true}
//                 >
//                   50
//                 </Progress>
//               </Fragment>
//             </div> */}
//           </li>
//         </Fragment>
//       ),
//       children: [
//         <thead>
//           <tr>
//             <th>Device</th>
//             <th>Alert</th>
//             <th>Type</th>
//             <th>Message</th>
//             <th>Address</th>
//           </tr>
//         </thead>,
//         operatorPerformanceData.map((data, index) => (
//           <tr
//             style={{
//               cursor: "pointer",
//             }}
//             key={index}
//           >
//             {/* <td>{data.eventId}</td> */}
//             <td>
//               <div className="d-flex">
//                 <div className="flex-grow-1">
//                   <H5>Device Name</H5>
//                   <div style={{ fontSize: "10px" }}>Date</div>

//                   <div style={{ fontSize: "10px" }}>Time</div>
//                 </div>
//               </div>
//             </td>
//             <td className={`txt-primary`}>Alert</td>
//             <td>Type</td>
//             <td>Message</td>
//             <td id="addressAssignedAlerts">Address</td>
//           </tr>
//         )),
//       ],
//       showArrow: false,
//     })
//   );
