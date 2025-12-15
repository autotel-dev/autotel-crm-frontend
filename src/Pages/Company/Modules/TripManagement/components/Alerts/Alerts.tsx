import {
  Col,
  Container,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Badge,
} from "reactstrap";
import Breadcrumbs from "../../../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import LiveTripAlerts from "./components/LiveTripAlerts";
import AssignedTripAlerts from "./components/AssignedTripAlerts";
import CompletedTripAlerts from "./components/CompletedTripAlerts";
import { useEffect, useState } from "react";
import { getAll } from "../../../../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setLiveAlerts,
  setAssignedAlerts,
  setCompletedAlerts,
  setLiveAlertsData,
  setDashboardStatistics,
} from "../../../../../../ReaduxToolkit/Reducer/AlertsSlice";
import Swal from "sweetalert2";
import {
  CONTROLROOM_DASHBOARD_STATISTICS,
  GET_ALERT_EVENTS_V2,
  GET_ALL_ASSIGNED_ALERT_EVENTS,
  GET_ALL_COMPLETED_ALERT_EVENTS,
} from "../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../Utilities/constants/constants";
import { H4, H5 } from "../../../../../../AbstractElements";
import { MdError, MdWarning, MdCheckCircle, MdSpeed } from "react-icons/md";

const Alerts = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { assignedAlerts, completedAlerts, liveAlerts } = useSelector(
    (state: any) => state.alerts
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(setAssignedAlerts([]));
    dispatch(setLiveAlerts([]));
    dispatch(setLiveAlertsData(null));
    dispatch(setCompletedAlerts([]));

    getAll({ url: `${GET_ALERT_EVENTS_V2}?page=1&limit=30` }).then(
      (data: any) => {
        if (data == undefined) {
          dispatch(setLiveAlerts([]));
          dispatch(setLiveAlertsData(null));
        }
        if (data !== undefined) {
          if (!data.success && data.message === ERROR_MESSAGE) {
          }
          if (!data.success && data.message === ERROR_MESSAGE) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }
          if (data.success) {
            dispatch(setLiveAlerts(data.data.rows));
            dispatch(setLiveAlertsData(data.data));
          }
          if (!data.success) {
            dispatch(setLiveAlerts([]));
            dispatch(setLiveAlertsData([]));
          }
        }
        setLoading(false);
      }
    );

    getAll({ url: GET_ALL_ASSIGNED_ALERT_EVENTS }).then((data: any) => {
      if (data == undefined) {
        dispatch(setAssignedAlerts([]));
      }
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
          setLoading(false);
        }
        if (!data.success && data.message === ERROR_MESSAGE) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
        }
        if (data.success) {
          dispatch(setAssignedAlerts(data.data));
        }
        if (!data.success) {
          dispatch(setAssignedAlerts([]));
        }
      }
    });

    getAll({ url: GET_ALL_COMPLETED_ALERT_EVENTS }).then((data: any) => {
      if (data == undefined) {
        dispatch(setCompletedAlerts([]));
      }
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
        }
        if (!data.success && data.message === ERROR_MESSAGE) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          dispatch(setCompletedAlerts(data.data));
        }
        if (!data.success) {
          dispatch(setCompletedAlerts([]));
        }
      }
    });
  }, []);

  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startDate = yesterday.toISOString();
    const endDate = new Date().toISOString();

    getAll({
      url: `${CONTROLROOM_DASHBOARD_STATISTICS}?fromDate=${startDate}&toDate=${endDate}`,
    }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          dispatch(setDashboardStatistics(data.data));
        }
      }
    });
  }, []);

  const statsCards = [
    {
      title: "Active Violations",
      value: "12",
      badgeColor: "primary",
      icon: <MdError color="#35bfbf" size={18} />,
    },
    {
      title: "Speed Violations",
      value: "8",
      badgeColor: "primary",
      icon: <MdSpeed color="#35bfbf" size={18} />,
    },
    {
      title: "Route Deviations",
      value: "5",
      badgeColor: "primary",
      icon: <MdWarning color="#35bfbf" size={18} />,
    },
    {
      title: "Compliant Trips",
      value: "45",
      badgeColor: "primary",
      icon: <MdCheckCircle color="#35bfbf" size={18} />,
    },
  ];

  const events = [
    {
      id: "1",
      element: <AssignedTripAlerts />,
    },
    {
      id: "2",
      element: <CompletedTripAlerts />,
    },
  ];

  const [basicTab, setBasicTab] = useState("1");

  return (
    <>
      <Container fluid className="dashboard_default">
        <Row className="widget-grid">
          <Breadcrumbs
            mainTitle="Alerts"
            parent="Trip Management"
            title="Module / Alerts"
          />
        </Row>

        {!loading ? (
          <Row>
            <Row className="widget-grid">
              {statsCards.map((data, index) => (
                <Col
                  xxl="3"
                  xl="3"
                  lg="6"
                  sm="12"
                  className="box-col-3"
                  key={index}
                >
                  <Card className="total-earning">
                    <CardBody>
                      <Row>
                        <Col sm="12" className="box-col-12">
                          <div className="d-flex">
                            <Badge
                              style={{
                                fontSize: "1rem",
                                padding: "0.2rem 0.5rem",
                                width: "40px",
                                height: "40px",
                              }}
                              color="transparent"
                              className={`bg-light-${data.badgeColor} badge-rounded font-primary me-2`}
                            >
                              {data.icon}
                            </Badge>
                            <div className="flex-grow-1">
                              <H4>{data.title}</H4>
                            </div>
                          </div>
                          <div style={{ margin: "15px 0px" }}></div>
                          <H5>{data.value}</H5>
                          <div style={{ margin: "15px 0px" }}></div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>

            <Row>
              <LiveTripAlerts />
              <Col xl="6" lg="6">
                <div style={{ backgroundColor: "white" }}>
                  <Nav
                    tabs
                    className="simple-wrapper"
                    style={{
                      backgroundColor: `${
                        userPersonalizationData !== null &&
                        userPersonalizationData?.buttonsAndBarsColor !== null
                          ? userPersonalizationData?.buttonsAndBarsColor
                          : "#63d5be"
                      }`,
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  >
                    <NavItem
                      style={{
                        width: "50%",
                        height: "40px",
                        textAlign: "center",
                        fontSize: "18px",
                        cursor: "pointer",
                      }}
                    >
                      <NavLink
                        className={` ${basicTab === "1" ? "active" : ""}`}
                        style={{
                          color: `${
                            basicTab === "1"
                              ? userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor !==
                                  null
                                ? userPersonalizationData?.buttonsAndBarsColor
                                : "#63d5be"
                              : "white"
                          }`,
                        }}
                        onClick={() => setBasicTab("1")}
                      >
                        Assigned Events ({assignedAlerts.length})
                      </NavLink>
                    </NavItem>
                    <NavItem
                      style={{
                        width: "50%",
                        height: "40px",
                        textAlign: "center",
                        fontSize: "18px",
                        cursor: "pointer",
                      }}
                    >
                      <NavLink
                        className={` ${basicTab === "2" ? "active" : ""}`}
                        style={{
                          color: `${
                            basicTab === "2"
                              ? userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor !==
                                  null
                                ? userPersonalizationData?.buttonsAndBarsColor
                                : "#63d5be"
                              : "white"
                          }`,
                        }}
                        onClick={() => setBasicTab("2")}
                      >
                        Completed Events ({completedAlerts.length})
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={basicTab}>
                    {events &&
                      events.map((item, index) => (
                        <TabPane
                          className="fade show"
                          tabId={item.id}
                          key={index}
                        >
                          {item.element}
                        </TabPane>
                      ))}
                  </TabContent>
                </div>
              </Col>
            </Row>
          </Row>
        ) : (
          <div style={{ textAlign: "center", height: "75vh" }}>
            Loading...
          </div>
        )}
      </Container>
    </>
  );
};

export default Alerts;
