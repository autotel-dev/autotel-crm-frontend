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
import { H4, P, Image, LI, UL, H5 } from "../../../AbstractElements";
import { boxesData1, boxesData2, operatorPerformanceData } from "./GeneralData";
import { MdFilterList } from "react-icons/md";

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
import { Collapse, Select } from "antd";
import Chart from "react-google-charts";
import { getAll } from "../../../Utilities/api";
import {
  setAlertsOverview,
  setGeneralData,
  setOperatorPerformance,
} from "../../../ReaduxToolkit/Reducer/DashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import OperatorAlerts from "./components/OperatorAlerts";
import { getUserRole } from "../../../Utilities/globals/globals";
import { ROLES } from "../../../constants/roles";

import {
  setDevices,
  setDevicesStatuses,
  setServerDevices,
} from "../../../ReaduxToolkit/Reducer/MonitoringSlice";
import Swal from "sweetalert2";
import "./general.css";
import {
  GET_DEVICES,
  GET_GENERAL_DASHBOARD_STATISTICS,
  GET_OPERATOR_PERFORMANCE,
} from "../../../Utilities/api/apiEndpoints";
import P1 from "../../../CommonElements/Paragraph/P1Element";
import { color } from "framer-motion";
import P3 from "../../../CommonElements/Paragraph/P3Element";
import P2 from "../../../CommonElements/Paragraph/P2Element";

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
  const { devices } = useSelector((state: any) => state.monitoring);
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
      getAll({ url: GET_GENERAL_DASHBOARD_STATISTICS }).then((data: any) => {
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
        url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${fromDate}&toDate=${toDate}`,
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
  const daysFilter = [
    { label: "Today", value: "Today" },
    { label: "Yesterday", value: "Yesterday" },
    { label: "1 Week", value: "1 Week" },
    { label: "1 Month", value: "1 Month" },
    { label: "Custom", value: "Custom" },
  ];

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !document.querySelector(".modal-content")?.contains(event.target as Node)
    ) {
      // Add type assertion here
      setIsDropdownOpen(false);
      setAddModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const groups: any = [];
  const groupDevicesObj: any = {};
  const initialGroupDevices: any = [];

  const statuses: any = [];
  const statusDevicesObj: any = {};
  var initialGroupDevicesStatuses: any = [];

  const [groupdevices, setgroupdevices]: any = useState([]);
  const [groupdevicesStatuses, setgroupdevicesStatuses]: any = useState([]);

  useEffect(() => {
    if (devices.length === 0 && getUserRole() == ROLES.COMPANY) {
      getAll({ url: GET_DEVICES }).then((data: any) => {
        if (data !== undefined) {
          // if (!data.success && data.message === ERROR_MESSAGE) {
          //   dispatch(setIsConnected(true));
          // }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }
          // console.log("error");

          if (data.success) {
            // // console.log("api call --- >", data);
            // // console.log("length --- >", data.data.length);
            dispatch(setServerDevices(data.data.allDevices));

            for (let i = 0; i < data.data.allDevices.length; i++) {
              const element = data.data.allDevices[i].title;
              if (!groups.includes(element)) {
                groups.push(element);
              }
            }

            groups.forEach((title: any) => {
              groupDevicesObj[title] = data.data.allDevices
                .filter((obj: any) => obj.title === title)
                .map((item: any) => ({ ...item, checked: false }));
            });

            // Convert groupDevicesObj to initialGroupDevices array format
            Object.keys(groupDevicesObj).forEach((title: any) => {
              initialGroupDevices.push({
                title,
                checked: false,
                items: groupDevicesObj[title],
              });
            });

            // Update state with initialGroupDevices
            setgroupdevices(initialGroupDevices);
            // // console.log("groups", groups);
            // // console.log("groupDevices", groupdevices);
            dispatch(setDevices(initialGroupDevices));

            // ---------------------- For device status-----------------------------------

            for (let i = 0; i < data.data.allDevices.length; i++) {
              const element = data.data.allDevices[i].online;
              if (!statuses.includes(element)) {
                statuses.push(element);
                // setMyArray((prevArray) => [...prevArray, element]);
              }
            }
            statuses.forEach((online: any) => {
              statusDevicesObj[online] = data.data.allDevices
                .filter((obj: any) => obj.online === online)
                .map((item: any) => ({ ...item, checked: false }));
            });

            // Convert groupDevicesObj to initialGroupDevices array format
            Object.keys(statusDevicesObj).forEach((online: any) => {
              initialGroupDevicesStatuses.push({
                online,
                items: statusDevicesObj[online],
              });
            });

            const expiredDevices = [];
            const notConnectedDevices = [];
            const currentDate = new Date(); // Get the current date and time

            for (let i = 0; i < data.data.allDevices.length; i++) {
              const element = data.data.allDevices[i];
              if (
                element.expiration_date != null &&
                element.expiration_date !== ""
              ) {
                const expirationDate = new Date(element.expiration_date); // Convert expiration date string to Date object
                if (expirationDate < currentDate) {
                  // Compare expiration date with current date
                  expiredDevices.push({ ...element, checked: false });
                }
              }
              if (i === data.data.length - 1) {
                // // console.log("expiredDevices", expiredDevices);
                initialGroupDevicesStatuses.push({
                  online: "Expired",
                  items: expiredDevices,
                });
              }
            }

            for (let i = 0; i < data.data.allDevices.length; i++) {
              const element = data.data.allDevices[i];
              if (
                element.time == null ||
                element.time === "" ||
                element.time == undefined
              ) {
                notConnectedDevices.push({ ...element, checked: false });
              }
              if (i === data.data.length - 1) {
                // // console.log("notConnectedDevices", notConnectedDevices);
                initialGroupDevicesStatuses.push({
                  online: "Not Connected",
                  items: notConnectedDevices,
                });
              }
            }

            // Update state with initialGroupDevicesStatuses
            setgroupdevicesStatuses(initialGroupDevicesStatuses);
            // // console.log("statuses", statuses);
            // // console.log("groupDevicesStatuses", initialGroupDevicesStatuses);
            dispatch(setDevicesStatuses(initialGroupDevicesStatuses));
          }
        }
      });
    }
  }, []);

  return (
    <Col xl="12" lg="12" md="12" sm="12" style={{}}>
      {generalloading == true ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: "40px",
          }}
        >
          <Col
            xl="3"
            lg="3"
            md="3"
            sm="3"
            style={{
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <Col
              xl="12"
              lg="12"
              md="12"
              sm="12"
              style={{
                marginBottom: "20px",
              }}
              className="skeleton"
            ></Col>
            <Col xl="12" lg="12" md="12" sm="12" className="skeleton"></Col>
          </Col>
          <Col
            xl="6"
            lg="6"
            md="6"
            sm="6"
            style={{
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <Col xl="12" lg="12" md="12" sm="12" className="skeleton2"></Col>
          </Col>
          <Col
            xl="3"
            lg="3"
            md="3"
            sm="3"
            style={{
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <Col
              xl="12"
              lg="12"
              md="12"
              sm="12"
              style={{
                marginBottom: "20px",
              }}
              className="skeleton"
            ></Col>
            <Col xl="12" lg="12" md="12" sm="12" className="skeleton"></Col>
          </Col>
        </div>
      ) : (
        <Row style={{ display: "flex" }}>
          <Col xl="3">
            <Card
              className="widget-sell handle"
              style={{ minHeight: "410px", maxHeight: "410px" }}
            >
              <CardBody className="pb-0">
                <Row>
                  <Col xl="12" lg="12" sm="12" className="mb-3">
                    <div
                      className="sale"
                      style={{ minHeight: "180px", maxHeight: "180px" }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <H4>Total Operators</H4>
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
                              // fontFamily: "Sedan, serif",
                              // fontWeight: "400",
                              // fontStyle: "normal",
                            }}
                          >
                            {generalData !== null
                              ? generalData?.operatorStatistics
                                  ?.totalActiveOperators +
                                generalData?.operatorStatistics
                                  ?.totalInActiveOperators
                              : 0}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "90%", // Set the width of the outer container
                            height: "160px", // Set the height of the outer container
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
                                  generalData?.operatorStatistics
                                    ?.totalActiveOperators,
                                ],
                                [
                                  "Inctive",
                                  generalData?.operatorStatistics
                                    ?.totalInActiveOperators,
                                ],
                              ]}
                              options={{
                                backgroundColor: "transparent", // Set chart background color as transparent
                                chartArea: {
                                  backgroundColor: "transparent", // Set chart area background color as transparent
                                  top: "5%", // Set padding of the top of chart area to 0
                                  left: 25, // Set padding of the left of chart area to 0
                                  right: 0,
                                },
                                // pieHole: 0.4,
                                pieSliceText: "value", // Display the exact values of each option
                                colors: ["#51bb25", "#ff6150"], // Custom colors for Active and Inactive options respectively
                                is3D: true, // Set the chart type to 3D
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
                    <div
                      className="sale"
                      style={{ minHeight: "180px", maxHeight: "180px" }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <H4>Total Servers</H4>
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
                              // fontFamily: "Sedan, serif",
                              // fontWeight: "400",
                              // fontStyle: "normal",
                            }}
                          >
                            {generalData !== null
                              ? generalData?.companyServerStatistics
                                  ?.totalActiveServers +
                                generalData?.companyServerStatistics
                                  ?.totalInActiveServers
                              : 0}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "93%", // Set the width of the outer container
                            height: "160px", // Set the height of the outer container
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
                                  generalData?.companyServerStatistics
                                    ?.totalActiveServers,
                                ],
                                [
                                  "Disconnected",
                                  generalData?.companyServerStatistics
                                    ?.totalInActiveServers,
                                ],
                              ]}
                              options={{
                                backgroundColor: "transparent", // Set chart background color as transparent
                                chartArea: {
                                  backgroundColor: "transparent", // Set chart area background color as transparent
                                  top: "5%", // Set padding of the top of chart area to 0
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
                      <H4 className="m-0">Operator Performance</H4>

                      <Select
                        value={selectedFilter !== "" ? selectedFilter : null}
                        // showSearch
                        style={{ width: "200px", height: 36 }}
                        placeholder="Select Type"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.label ?? "").includes(input)
                        }
                        onChange={(e) => {
                          // console.log(e);
                          setSelectedFilter(e);
                          if (e == "Yesterday") {
                            setGeneralLoading(true);
                            const dayBeforeYesterday = new Date();

                            dayBeforeYesterday.setDate(
                              dayBeforeYesterday.getDate() - 2
                            );

                            const yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);
                            const startDate = dayBeforeYesterday.toISOString();
                            const endDate = yesterday.toISOString();
                            setFromDate(startDate);
                            setToDate(endDate);
                            getAll({
                              url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${startDate}&toDate=${endDate}`,
                            }).then((data: any) => {
                              if (data !== undefined) {
                                if (data.success) {
                                  // // console.log("length --- >", data.data);
                                  dispatch(setOperatorPerformance(data.data));
                                  setGeneralLoading(false);
                                }
                                if (!data.success) {
                                  // // // console.log("length --- >", data.data);
                                  dispatch(setOperatorPerformance([]));
                                  setGeneralLoading(false);
                                }
                              }
                            });
                          }
                          if (e == "Today") {
                            setGeneralLoading(true);
                            const yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);
                            const startDate = yesterday.toISOString();
                            const endDate = new Date().toISOString();
                            setFromDate(startDate);
                            setToDate(endDate);
                            getAll({
                              url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${startDate}&toDate=${endDate}`,
                            }).then((data: any) => {
                              if (data !== undefined) {
                                if (data.success) {
                                  // // console.log("length --- >", data.data);
                                  dispatch(setOperatorPerformance(data.data));
                                  setGeneralLoading(false);
                                }
                                if (!data.success) {
                                  // // // console.log("length --- >", data.data);
                                  dispatch(setOperatorPerformance([]));
                                  setGeneralLoading(false);
                                }
                              }
                            });
                          }
                          if (e == "1 Week") {
                            setGeneralLoading(true);
                            const oneWeek = new Date();
                            oneWeek.setDate(oneWeek.getDate() - 7);
                            const startDate = oneWeek.toISOString();
                            const endDate = new Date().toISOString();
                            setFromDate(startDate);
                            setToDate(endDate);
                            getAll({
                              url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${startDate}&toDate=${endDate}`,
                            }).then((data: any) => {
                              if (data !== undefined) {
                                if (data.success) {
                                  // // console.log("length --- >", data.data);
                                  dispatch(setOperatorPerformance(data.data));
                                  setGeneralLoading(false);
                                }
                                if (!data.success) {
                                  // // // console.log("length --- >", data.data);
                                  dispatch(setOperatorPerformance([]));
                                  setGeneralLoading(false);
                                }
                              }
                            });
                          }
                          if (e == "1 Month") {
                            setGeneralLoading(true);
                            const oneMonth = new Date();
                            oneMonth.setDate(oneMonth.getDate() - 30);
                            const startDate = oneMonth.toISOString();
                            const endDate = new Date().toISOString();
                            setFromDate(startDate);
                            setToDate(endDate);
                            getAll({
                              url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${startDate}&toDate=${endDate}`,
                            }).then((data: any) => {
                              if (data !== undefined) {
                                if (data.success) {
                                  // // console.log("length --- >", data.data);
                                  dispatch(setOperatorPerformance(data.data));
                                  setGeneralLoading(false);
                                }
                                if (!data.success) {
                                  // // // console.log("length --- >", data.data);
                                  dispatch(setOperatorPerformance([]));
                                  setGeneralLoading(false);
                                }
                              }
                            });
                          }
                          if (e == "Custom") {
                            setSelectedFilter("Custom");
                            addToggle();
                          }
                        }}
                        options={daysFilter}
                      />

                      <Modal
                        isOpen={addModal}
                        toggle={addToggle}
                        size="md"
                        centered
                      >
                        <div className="modal-header">
                          <H4 className="modal-title">Custom Filter Date</H4>
                          <Button
                            color="transprant"
                            className="btn-close"
                            onClick={addToggle}
                          ></Button>
                        </div>

                        <ModalBody className="modal-content">
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
                                        new Date(e.target.value).toISOString()
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
                                        new Date(e.target.value).toISOString()
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
                                //   disabled={generalloading ? true : false}
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
                                  setGeneralLoading(true);
                                  e.preventDefault();
                                  getAll({
                                    url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${fromDate}&toDate=${toDate}`,
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
                                        addToggle();
                                        // setSelectedFilter("Today");
                                      }
                                      if (!data.success) {
                                        // // // console.log("length --- >", data.data);
                                        dispatch(setOperatorPerformance([]));
                                        setGeneralLoading(false);
                                        addToggle();
                                      }
                                    }
                                  });
                                }}
                              >
                                Set
                                {/* {generalloading ? "Loading ..." : `Set`} */}
                              </Button>
                            </div>
                          </form>
                        </ModalBody>
                      </Modal>
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
                          borderRadius: "5px",
                          color: "white",
                        }}
                      >
                        <P2>
                          Total:&nbsp;
                          {
                            operatorPerformance?.companyAlertEventsStatistics
                              ?.totalLiveAlerts
                          }
                        </P2>
                      </div>
                      <div
                        style={{
                          width: "32%",
                          padding: "6px",
                          textAlign: "center",
                          backgroundColor: "rgb(255, 97, 80)",
                          borderRadius: "5px",
                          color: "white",
                        }}
                      >
                        <P2>
                          Assigned: &nbsp;
                          {
                            operatorPerformance?.companyAlertEventsStatistics
                              ?.totalAssignedAlerts
                          }
                        </P2>
                      </div>
                      <div
                        style={{
                          width: "32%",
                          padding: "6px",
                          textAlign: "center",
                          backgroundColor: "rgb(81, 187, 37)",
                          borderRadius: "5px",
                          color: "white",
                        }}
                      >
                        <P2>
                          Completed:&nbsp;
                          {
                            operatorPerformance?.companyAlertEventsStatistics
                              ?.totalCompletedAlerts
                          }
                        </P2>
                      </div>
                    </div>
                    <UL
                      className="theme-scrollbar"
                      style={{
                        overflowY: "scroll",
                        overflowX: "auto",
                        maxHeight: "34vh", // Subtract scrollbar width from max height
                        WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
                        scrollbarWidth: "thin", // Specify scrollbar width
                        WebkitBorderRadius: "5px", // For WebKit browsers (Chrome, Safari)
                        MozBorderRadius: "5px", // For Mozilla Firefox
                        borderRadius: "5px", // For other browsers
                        scrollbarColor: "lightgray transparent", // Specify scrollbar color
                      }}
                    >
                      {operatorPerformance?.groupedAlerts?.map(
                        (data: any, index: any) => (
                          <>
                            <li
                              className="align-items-center"
                              key={index}
                              style={{
                                padding: "8px 12px",
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
                                  width: "33%",
                                }}
                              >
                                <P2>{data.operator.fullName}</P2>
                              </div>

                              <div
                                style={{
                                  textAlign: "center",
                                  width: "33%",
                                  alignItems: "center",
                                }}
                              >
                                <P2>
                                  {operatorPerformance?.totalAlertEventsOfCompany ==
                                  0
                                    ? 0
                                    : (
                                        (data.alerts.length /
                                          operatorPerformance?.totalAlertEventsOfCompany) *
                                        100
                                      ).toFixed(0)}
                                  %
                                </P2>

                                <Fragment key={index}>
                                  <Progress
                                    value={
                                      operatorPerformance?.totalAlertEventsOfCompany ==
                                      0
                                        ? 0
                                        : (
                                            (data.alerts.length /
                                              operatorPerformance?.totalAlertEventsOfCompany) *
                                            100
                                          ).toFixed(0)
                                    }
                                    // className="mb-4"
                                    striped={true}
                                    color="success"
                                    animated={true}
                                  >
                                    {operatorPerformance?.totalAlertEventsOfCompany ==
                                    0
                                      ? 0
                                      : (
                                          (data.alerts.length /
                                            operatorPerformance?.totalAlertEventsOfCompany) *
                                          100
                                        ).toFixed(0)}
                                  </Progress>
                                </Fragment>
                              </div>
                              <div
                                style={{
                                  width: "33%",
                                  textAlign: "end",
                                }}
                              >
                                <P2>
                                  Alerts Catered: &nbsp;{data.alerts.length}
                                </P2>
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
                    <div
                      className="sale"
                      style={{ minHeight: "180px", maxHeight: "180px" }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <H4>Package Expiry - Days</H4>
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
                              // fontFamily: "Sedan, serif",
                              // fontWeight: "400",
                              // fontStyle: "normal",
                            }}
                          >
                            {daysRemaining}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "90%", // Set the width of the outer container
                            height: "160px", // Set the height of the outer container
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
                                    ? generalData?.companyPackageStatistics
                                        ?.packageDays - daysRemaining
                                    : generalData?.companyPackageStatistics
                                        ?.packageDays,
                                ],
                              ]}
                              options={{
                                backgroundColor: "transparent", // Set chart background color as transparent
                                chartArea: {
                                  backgroundColor: "transparent", // Set chart area background color as transparent
                                  top: "5%", // Set padding of the top of chart area to 0
                                  left: 25, // Set padding of the left of chart area to 0
                                  right: 0,
                                },
                                // pieHole: 0.4,
                                pieSliceText: "value", // Display the exact values of each option
                                colors: ["#51bb25", "#ff6150"], // Custom colors for Active and Inactive options respectively
                                is3D: true, // Set the chart type to 3D
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xl="12" lg="12" sm="12" className="mb-3">
                    <div
                      className="sale"
                      style={{ minHeight: "180px", maxHeight: "180px" }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <H4>Total Leads</H4>
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
                              // fontFamily: "Sedan, serif",
                              // fontWeight: "400",
                              // fontStyle: "normal",
                            }}
                          >
                            1
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "90%", // Set the width of the outer container
                            height: "160px", // Set the height of the outer container
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
                                  top: "5%", // Set padding of the top of chart area to 0
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
  /* <Skeleton width={700} height={440} /> */
}

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
//                   <H4>{data.title}</H4>
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
//               <H4>50%</H4>
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
//                   <H4>Device Name</H4>
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

{
  /* <div>
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
                              {/* Filter : Today */
}
//       </div>
//       <div
//         style={{
//           cursor: "pointer",
//         }}
//         onClick={(e: any) => {
//           toggleDropdown(e);
//         }}
//       >
//         <div style={{ fontSize: "30px", color: "white" }}>
//           <MdFilterList style={{ marginTop: "12px" }} />
//         </div>
//       </div>
//     </div>
//   </div>
//   <div
//     ref={dropdownRef}
//     style={{
//       width: "250px",
//       display: "flex",
//       justifyContent: "end",
//     }}
//   >
//     {isDropdownOpen && (
//       <div
//         className="custom-dropdown-analytics"
//         style={{
//           width: "250px",
//           position: "absolute",
//           zIndex: "1",
//         }}
//       >
//         {isDropdownOpen && (
//           <div
//             className="dropdown-options-analytics"
//             style={{
//               width: "250px",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 width: "250px",
//               }}
//               className="dropdown-item"
//               onClick={(e) => {
//                 setGeneralLoading(true);
//                 setSelectedFilter("Yesterday");
//                 const dayBeforeYesterday = new Date();

//                 dayBeforeYesterday.setDate(
//                   dayBeforeYesterday.getDate() - 2
//                 );

//                 const yesterday = new Date();
//                 yesterday.setDate(
//                   yesterday.getDate() - 1
//                 );
//                 const startDate =
//                   dayBeforeYesterday.toISOString();
//                 const endDate = yesterday.toISOString();
//                 setFromDate(startDate);
//                 setToDate(endDate);

//                 getAll({
//                   url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${startDate}&toDate=${endDate}`,
//                 }).then((data: any) => {
//                   toggleDropdown(e);
//                   // console.log("api call --- >", data);
//                   if (data !== undefined) {
//                     if (data.success) {
//                       // // console.log("length --- >", data.data);
//                       dispatch(
//                         setOperatorPerformance(data.data)
//                       );
//                       setGeneralLoading(false);
//                     }
//                     if (!data.success) {
//                       // // // console.log("length --- >", data.data);
//                       dispatch(
//                         setOperatorPerformance([])
//                       );
//                       setGeneralLoading(false);
//                     }
//                   }
//                 });
//               }}
//             >
//               Yesterday
//             </div>
//             <div
//               style={{
//                 width: "250px",
//               }}
//               className="dropdown-item"
//               onClick={(e) => {
//                 setGeneralLoading(true);
//                 setSelectedFilter("Today");
//                 const yesterday = new Date();
//                 yesterday.setDate(
//                   yesterday.getDate() - 1
//                 );
//                 const startDate = yesterday.toISOString();
//                 const endDate = new Date().toISOString();
//                 setFromDate(startDate);
//                 setToDate(endDate);

//                 getAll({
//                   url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${startDate}&toDate=${endDate}`,
//                 }).then((data: any) => {
//                   toggleDropdown(e);
//                   // console.log("api call --- >", data);
//                   if (data !== undefined) {
//                     if (data.success) {
//                       // // console.log("length --- >", data.data);
//                       dispatch(
//                         setOperatorPerformance(data.data)
//                       );
//                       setGeneralLoading(false);
//                     }
//                     if (!data.success) {
//                       // // // console.log("length --- >", data.data);
//                       dispatch(
//                         setOperatorPerformance([])
//                       );
//                       setGeneralLoading(false);
//                     }
//                   }
//                 });
//               }}
//             >
//               Today
//             </div>
//             <div
//               style={{
//                 width: "250px",
//               }}
//               className="dropdown-item"
//               onClick={(e) => {
//                 setGeneralLoading(true);
//                 setSelectedFilter("1 Week");
//                 const oneWeek = new Date();
//                 oneWeek.setDate(oneWeek.getDate() - 7);
//                 const startDate = oneWeek.toISOString();
//                 const endDate = new Date().toISOString();
//                 setFromDate(startDate);
//                 setToDate(endDate);

//                 getAll({
//                   url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${startDate}&toDate=${endDate}`,
//                 }).then((data: any) => {
//                   toggleDropdown(e);
//                   // console.log("api call --- >", data);
//                   if (data !== undefined) {
//                     if (data.success) {
//                       // // console.log("length --- >", data.data);
//                       dispatch(
//                         setOperatorPerformance(data.data)
//                       );
//                       setGeneralLoading(false);
//                     }
//                     if (!data.success) {
//                       // // // console.log("length --- >", data.data);
//                       dispatch(
//                         setOperatorPerformance([])
//                       );
//                       setGeneralLoading(false);
//                     }
//                   }
//                 });
//               }}
//             >
//               1 Week
//             </div>
//             <div
//               style={{
//                 width: "250px",
//               }}
//               className="dropdown-item"
//               onClick={(e) => {
//                 setGeneralLoading(true);
//                 setSelectedFilter("1 Month");
//                 const oneMonth = new Date();
//                 oneMonth.setDate(oneMonth.getDate() - 30);
//                 const startDate = oneMonth.toISOString();
//                 const endDate = new Date().toISOString();
//                 setFromDate(startDate);
//                 setToDate(endDate);

// getAll({
//   url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${startDate}&toDate=${endDate}`,
// }).then((data: any) => {
//   toggleDropdown(e);
//   // console.log("api call --- >", data);
//   if (data !== undefined) {
//     if (data.success) {
//       // // console.log("length --- >", data.data);
//       dispatch(
//         setOperatorPerformance(data.data)
//       );
//       setGeneralLoading(false);
//     }
//     if (!data.success) {
//       // // // console.log("length --- >", data.data);
//       dispatch(
//         setOperatorPerformance([])
//       );
//       setGeneralLoading(false);
//     }
//   }
// });
//               }}
//             >
//               1 Month
//             </div>

//             <div
//               style={{
//                 width: "250px",
//               }}
//               className="dropdown-item"
//               onClick={(e) => {
//                 setSelectedFilter("Custom");
//                 addToggle();
//                 // toggleDropdown(e);
//               }}
//             >
//               Custom
//             </div>
//             <Modal
//               isOpen={addModal}
//               toggle={addToggle}
//               size="md"
//               centered
//             >
//               <div className="modal-header">
//                 <H4 className="modal-title">
//                   Custom Filter Date
//                 </H4>
//                 <Button
//                   color="transprant"
//                   className="btn-close"
//                   onClick={addToggle}
//                 ></Button>
//               </div>

//               <ModalBody className="modal-content">
//                 <form className="form-bookmark needs-validation">
//                   <Row>
//                     <FormGroup
//                       className="col-md-12 create-group"
//                       style={{
//                         alignItems: "center",
//                       }}
//                     >
//                       <div>Date From:</div>
//                       <Col md={12}>
//                         <input
//                           className="form-control"
//                           type="date"
//                           value={fromDate.slice(0, 10)}
//                           onChange={(e) => {
//                             setFromDate(
//                               new Date(
//                                 e.target.value
//                               ).toISOString()
//                             );
//                             // console.log("e", e.target.value);
//                           }}
//                         />
//                       </Col>
//                     </FormGroup>
//                     <FormGroup
//                       className="col-md-12 create-group"
//                       style={{
//                         alignItems: "center",
//                       }}
//                     >
//                       <div>Date To:</div>
//                       <Col md={12}>
//                         <input
//                           className="form-control"
//                           type="date"
//                           value={toDate.slice(0, 10)}
//                           onChange={(e) => {
//                             // console.log(e.target.value);
//                             setToDate(
//                               new Date(
//                                 e.target.value
//                               ).toISOString()
//                             );
//                           }}
//                         />
//                       </Col>
//                     </FormGroup>
//                   </Row>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "end",
//                       alignItems: "end",
//                       marginTop: "-20px",
//                     }}
//                   >
//                     <Button
//                       disabled={
//                         generalloading ? true : false
//                       }
//                       color="secondary"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         addToggle();
//                       }}
//                     >
//                       Cancel
//                     </Button>
//                     &nbsp;&nbsp;
//                     <Button
//                       color="primary"
//                       className="me-1"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         setGeneralLoading(true);
//                         getAll({
//                           url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${fromDate}&toDate=${toDate}`,
//                         }).then((data: any) => {
//                           toggleDropdown(e);
//                           // console.log("api call --- >", data);
//                           if (data !== undefined) {
//                             if (data.success) {
//                               // // console.log("length --- >", data.data);
//                               dispatch(
//                                 setOperatorPerformance(
//                                   data.data
//                                 )
//                               );
//                               setGeneralLoading(false);
//                               addToggle();
//                               // setSelectedFilter("Today");
//                             }
//                             if (!data.success) {
//                               // // // console.log("length --- >", data.data);
//                               dispatch(
//                                 setOperatorPerformance([])
//                               );
//                               setGeneralLoading(false);
//                               addToggle();
//                             }
//                           }
//                         });
//                       }}
//                     >
//                       {generalloading
//                         ? "Loading ..."
//                         : `Set`}
//                     </Button>
//                   </div>
//                 </form>
//               </ModalBody>
//             </Modal>
//           </div>
//         )}
//       </div>
//     )}
//   </div>
// </div> */}
