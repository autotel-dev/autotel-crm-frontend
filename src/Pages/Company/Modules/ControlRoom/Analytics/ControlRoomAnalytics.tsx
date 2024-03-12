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
  ];
  const { devices } = useSelector((state: any) => state.monitoring);
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
  return (
    <>
      <Col xl="3" lg="6" md="6" sm="12" className="box-col-4">
        <Card className="total-earning">
          <CardBody>
            <Row style={{ height: "16vh" }}>
              <Col sm="7" className="box-col-7">
                <div className="d-flex">
                  <div className="flex-grow-1" style={{ margin: "5px 0px" }}>
                    <H3>{controlRoomAnalytics[0].title}</H3>
                  </div>
                </div>
                <H3>10</H3>
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
                  <ReactApexChart
                    id={controlRoomAnalytics[0].chartId}
                    options={controlRoomAnalytics[0].charts}
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
      <Col xl="3" lg="6" md="6" sm="12" className="box-col-4">
        <Card className="total-earning">
          <CardBody>
            <Row style={{ height: "16vh" }}>
              <Col sm="12" className="box-col-7">
                <div className="d-flex">
                  <div className="flex-grow-1" style={{ margin: "5px 0px" }}>
                    <H3>Connected Servers</H3>
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
      <Col xl="3" lg="6" md="6" sm="12" className="box-col-4">
        <Card className="total-earning">
          <CardBody>
            <Row style={{ height: "16vh" }}>
              <Col sm="7" className="box-col-7">
                <div className="d-flex">
                  <div className="flex-grow-1" style={{ margin: "5px 0px" }}>
                    <H3>Send Command</H3>
                  </div>
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>6</div>
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
                      setIsUpdateModalOpenForSendCommand(true);
                    }}
                  >
                    Send
                  </button>
                </div>
              </Col>
              <Col sm="5" className={`box-col-5 `}>
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
      />
      {/*  */}
      <Col xl="3" lg="6" md="6" sm="12" className="box-col-4">
        <Card className="total-earning">
          <CardBody>
            <Row style={{ height: "16vh" }}>
              <Col sm="7" className="box-col-7">
                <div className="d-flex">
                  <div className="flex-grow-1" style={{ margin: "5px 0px" }}>
                    <H3>Pre Alert info</H3>
                  </div>
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>8</div>
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
                      setIsUpdateModalOpenForPreAlertinfo(true);
                    }}
                  >
                    Add
                  </button>
                </div>
              </Col>
              <Col sm="5" className={`box-col-5 `}>
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
    </>
  );
};

export default ControlRoomAnalytics;
