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
import { MdFilterList } from "react-icons/md";

import { Link } from "react-router-dom";
import { Fragment, useEffect, useRef, useState } from "react";

import "react-loading-skeleton/dist/skeleton.css";

import Chart from "react-google-charts";

import { useDispatch, useSelector } from "react-redux";
import OperatorAlerts from "./components/OperatorAlerts";

import "./operations.css";
import { getAll } from "../../../../../../../../Utilities/api";
import { H4, H5, UL } from "../../../../../../../../AbstractElements";
import { getUserRole } from "../../../../../../../../Utilities/globals/globals";
import { ROLES } from "../../../../../../../../constants/roles";
import {
  GET_ACTIVITIES_BY_TYPE,
  GET_ACTIVITY_STATISTICS,
  GET_GENERAL_DASHBOARD_STATISTICS,
  GET_OPERATOR_PERFORMANCE,
} from "../../../../../../../../Utilities/api/apiEndpoints";
import {
  setGeneralData,
  setOperatorPerformance,
} from "../../../../../../../../ReaduxToolkit/Reducer/DashboardSlice";
import { Href } from "../../../../../../../../utils/Constant";
import P3 from "../../../../../../../../CommonElements/Paragraph/P3Element";
import {
  setActivitiesData,
  setStatisticsData,
} from "../../../../../../../../ReaduxToolkit/Reducer/SalesDashboardSlice";

const Operations = () => {
  const dispatch = useDispatch();

  // Simulating data fetching with a timeout

  const [generalloading, setGeneralLoading] = useState<boolean>(true);
  const [operatorPerformanceloading, setOperatorPerformanceLoading] =
    useState<boolean>(true);
  const { generalData, operatorPerformance } = useSelector(
    (state: any) => state.dashboard
  );

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
  const [activityType, setActivityType] = useState("TRANSFER");

  const [selectedFilter, setSelectedFilter] = useState("Today");
  const dropdownRef = useRef<HTMLDivElement>(null); // Add type assertion here
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [staisticsLoading, setStatisticsLoading] = useState(false);
  const [activitiesDataLoading, setActivitiesDataLoading] = useState(false);

  const getActivitiesData = (from: any, to: any) => {
    setStatisticsLoading(true);
    getAll({
      url: `${GET_ACTIVITY_STATISTICS}/?fromDate=${from}&toDate=${to}`,
    }).then((data: any) => {
      if (data == undefined) {
        setStatisticsLoading(false);
      }
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          dispatch(setStatisticsData(data.data.statistics));
          setStatisticsLoading(false);
        }
        if (!data.success) {
          // // // console.log("length --- >", data.data);
          setStatisticsLoading(false);
          dispatch(setStatisticsData(null));
        }
      }
    });
  };

  const getActivitiesDataByType = (from: any, to: any, type: any) => {
    setActivitiesDataLoading(true);
    getAll({
      url: `${GET_ACTIVITIES_BY_TYPE}/?activityType=${type}&fromDate=${from}&toDate=${to}`,
    }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data == undefined) {
        setActivitiesDataLoading(false);
      }

      if (data !== undefined) {
        if (data.success) {
          dispatch(setActivitiesData(data.data));
          setActivitiesDataLoading(false);
        }
        if (!data.success) {
          setActivitiesDataLoading(false);
          dispatch(setActivitiesData(null));
        }
      }
    });
  };

  // useEffect(() => {
  //   getActivitiesData(fromDate, toDate);
  // }, [fromDate, toDate]);
  // useEffect(() => {
  //   getActivitiesDataByType(fromDate, toDate, activityType);
  // }, [fromDate, toDate, activityType]);

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

  const [addModal, setAddModal] = useState(false);

  const addToggle = () => {
    setAddModal(!addModal);
  };

  return (
    <Col xl="12" lg="12" md="12" sm="12" style={{}}>
      {staisticsLoading && activitiesDataLoading ? (
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
            <Col xl="12" lg="12" md="12" sm="12" className="skeleton2"></Col>
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
            <Col xl="12" lg="12" md="12" sm="12" className="skeleton2"></Col>
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
                      style={{ minHeight: "370px", maxHeight: "370px" }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <H4>Total Activities</H4>
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
                            {/* {generalData !== null
                              ? generalData?.companyServerStatistics
                                  ?.totalActiveServers +
                                generalData?.companyServerStatistics
                                  ?.totalInActiveServers
                              : 0} */}
                            13
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "90%", // Set the width of the outer container
                            height: "160px", // Set the height of the outer container
                            marginTop: "20%",
                            marginLeft: "-50px",
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
                              width={"120%"}
                              height={"120%"} // Set the height of the chart to fill the outer container
                              chartType={"PieChart"}
                              loader={<div>{"Loading Chart"}</div>}
                              data={[
                                ["Task", "Hours per Day"],
                                ["Total", 13],
                              ]}
                              options={{
                                backgroundColor: "transparent", // Set chart background color as transparent
                                chartArea: {
                                  backgroundColor: "transparent", // Set chart area background color as transparent
                                  top: "5%", // Set padding of the top of chart area to 0
                                  left: 25, // Set padding of the left of chart area to 0
                                  right: 0,
                                  botton: 0,
                                },
                                pieSliceText: "value", // Display the exact values of each option
                                colors: ["#51bb25"], // Custom colors for Active and Inactive options respectively
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
                      <H4 className="m-0">(Status) Activites</H4>
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
                              <div style={{ fontSize: "30px", color: "white" }}>
                                <MdFilterList style={{ marginTop: "12px" }} />
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
                                      toggleDropdown(e);
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

                                      toggleDropdown(e);
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

                                      toggleDropdown(e);
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

                                      toggleDropdown(e);
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
                                      <H4 className="modal-title">
                                        Custom Filter Date
                                      </H4>
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
                                                url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${fromDate}&toDate=${toDate}`,
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
                                                    // setSelectedFilter("Today");
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
                          backgroundColor: "rgb(255, 97, 80)",
                          borderRadius: "10px",
                          color: "white",
                        }}
                      >
                        Assigned:&nbsp;
                        {
                          operatorPerformance?.companyAlertEventsStatistics
                            ?.totalLiveAlerts
                        }
                      </div>
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
                        Installed: &nbsp;
                        {
                          operatorPerformance?.companyAlertEventsStatistics
                            ?.totalAssignedAlerts
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
                          operatorPerformance?.companyAlertEventsStatistics
                            ?.totalCompletedAlerts
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

                      {operatorPerformance?.groupedAlerts?.map(
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
                                    <H5>{data.operator.fullName}</H5>
                                    <P3
                                      style={{
                                        // fontSize: "12px",
                                        color: "black",
                                      }}
                                    >
                                      {data.operator.emailAddress}
                                    </P3>
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
                                <H4>
                                  {operatorPerformance?.totalAlertEventsOfCompany ==
                                  0
                                    ? 0
                                    : (
                                        (data.alerts.length /
                                          operatorPerformance?.totalAlertEventsOfCompany) *
                                        100
                                      ).toFixed(0)}
                                  %
                                </H4>
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
                      style={{ minHeight: "370px", maxHeight: "370px" }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <H4>Activities Status</H4>
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
                            {/* {generalData !== null
                              ? generalData?.operatorStatistics
                                  ?.totalActiveOperators +
                                generalData?.operatorStatistics
                                  ?.totalInActiveOperators
                              : 0} */}
                            10
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%", // Set the width of the outer container
                            height: "160px", // Set the height of the outer container
                            marginTop: "20%",
                            marginLeft: "-50px",
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
                              width={"110%"}
                              height={"110%"} // Set the height of the chart to fill the outer container
                              chartType={"PieChart"}
                              loader={<div>{"Loading Chart"}</div>}
                              data={[
                                ["Task", "Hours per Day"],
                                ["Transfer", 2],
                                ["Remove", 2],
                                ["Redo", 2],
                                ["Ownership Change", 2],
                                ["Temporary Remove", 2],
                                ["Customer Data Update", 2],
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
                                colors: [
                                  "#51bb25",
                                  "#ff6150",
                                  "#51bb25",
                                  "#ff6150",
                                  "#51bb25",
                                  "#ff6150",
                                ], // Custom colors for Active and Inactive options respectively
                                is3D: true, // Set the chart type to 3D
                              }}
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

export default Operations;
