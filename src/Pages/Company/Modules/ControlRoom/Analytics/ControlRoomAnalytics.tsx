import { Badge, Card, CardBody, Col, Row } from "reactstrap";

import ReactApexChart from "react-apexcharts";

import {
  SinceLastMonth,
  ThenLastWeek,
  TotalEarning,
  TotalSales,
  TotalVisitors,
} from "../../../../../utils/Constant";
import { totalEarningChart, totalLikesOption, visitorChart } from "./CHartData";
import { H2, H3, H4, H5, P } from "../../../../../AbstractElements";
import SVG from "../../../../../utils/CommonSvgIcon/SVG";
import TotalKillingDevices from "./components/TotalKillingDevices";
import { useState } from "react";
import SendCommand from "./components/SendCommand";
import AddPreAlertinfo from "./components/AddPreAlertInfo";
import { useSelector } from "react-redux";

import { ImArrowUp, ImArrowDown } from "react-icons/im";
import SelfSendCommands from "./components/SelfSendCommands";

const ControlRoomAnalytics = () => {
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
      charts: totalEarningChart,
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
      charts: totalLikesOption,
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
      charts: visitorChart,
      type: "area",
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
      charts: totalLikesOption,
      type: "area",
    },
  ];
  const { devices } = useSelector((state: any) => state.monitoring);
  const { dashboardStatistics } = useSelector((state: any) => state.alerts);
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [containerHeight, setContainerHeight] = useState("21vh");
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleContainerHeight = () => {
    if (containerHeight === "21vh") {
      setContainerHeight("10vh");
    } else {
      setContainerHeight("21vh");
    }
  };
  return (
    <>
      {/* {containerHeight == "21vh" && (
        
      )} */}
      <Col
        xl="11"
        lg="11"
        md="11"
        sm="11"
        style={{
          height: containerHeight === "21vh" ? "100%" : "0",
          overflow: "hidden",
          transition: "height 0.5s",
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
                    <H3>{dashboardStatistics.totalKilledDevicesCount}</H3>
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
                        Today
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
                            Today
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "start" }}>
                      <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                        Auto Tel:
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
                            backgroundColor: "red",
                            marginRight: "5px",
                          }}
                        ></div>
                        <div>Not Connected</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "start" }}>
                      <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                        Auto Tel:{" "}
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
                            backgroundColor: "green",
                            marginRight: "5px",
                          }}
                        ></div>
                        <div>Connected</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "start" }}>
                      <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                        Auto Tel:{" "}
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
                            backgroundColor: "green",
                            marginRight: "5px",
                          }}
                        ></div>
                        <div>Connected</div>
                      </div>
                    </div>
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
                      <H3>{dashboardStatistics.totalCommandedDevicesCount}</H3>
                    </div>
                    <div>
                      <div style={{ display: "flex", marginTop: "-15px" }}>
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
                      Today
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
                      8
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
                          setIsUpdateModalOpenForkillingDevices(true);
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
                      Today
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

          <AddPreAlertinfo
            addModal={isUpdateModalOpenForPreAlertinfo}
            setAddModal={setIsUpdateModalOpenForPreAlertinfo}
            dropDownDevices={devices}
          />
          <TotalKillingDevices
            isVisible={isUpdateModalOpenForkillingDevices}
            setIsVisible={setIsUpdateModalOpenForkillingDevices}
          />
        </Row>
      </Col>
      <Col
        xl="1"
        lg="1"
        md="1"
        sm="1"
        style={{
          height: containerHeight === "10vh" ? "10vh" : "21vh",
          overflow: "hidden",
          transition: "height 0.5s",
          marginBottom: containerHeight == "10vh" ? "20px" : "0px",
          // zIndex: "9999",
        }}
        // xl={containerHeight == "10vh" ? "12" : "1"}
        // lg={containerHeight == "10vh" ? "12" : "1"}
        // md={containerHeight == "10vh" ? "12" : "1"}
        // sm={containerHeight == "10vh" ? "12" : "1"}
        // style={{
        //   height: containerHeight,
        //   display: "flex",
        //   justifyContent: "end",
        //   marginBottom: containerHeight == "10vh" ? "20px" : "0px",
        //   transition: "height 0.5s ease-in-out",
        // }}
      >
        <div
          style={{
            backgroundColor: "green",
            padding: "20px",
            height: "100%",
            width: "45px",
            borderRadius: "5px",
            position: "relative",
          }}
        >
          {/* Hamburger Icon */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
              marginTop: "-15px",
            }}
            onClick={toggleDropdown}
          >
            <div style={{ fontSize: "24px", color: "white" }}>&#9776;</div>
          </div>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "0%",
                left: "70%",
                backgroundColor: "lightgray",
                padding: "10px",
                borderRadius: "5px",
                width: "75px",
                zIndex: "9999",
              }}
            >
              <div>Today</div>
              <div>7 Days</div>
              <div>1 Month</div>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {containerHeight === "21vh" ? (
              <ImArrowUp
                onClick={toggleContainerHeight}
                style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
              />
            ) : (
              <ImArrowDown
                onClick={toggleContainerHeight}
                style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
              />
            )}
          </div>
        </div>
      </Col>
    </>
  );
};

export default ControlRoomAnalytics;
