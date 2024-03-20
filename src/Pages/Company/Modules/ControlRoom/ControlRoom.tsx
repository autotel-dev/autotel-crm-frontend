import {
  Col,
  Container,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import LiveAlerts from "./Events/LiveAlerts/LiveAlerts";
import AssignedAlerts from "./Events/AssignedAlerts/AssignedAlerts";
import CompletedAlerts from "./Events/CompletedAlerts/CompletedAlerts";
import { useEffect, useState } from "react";
import { getAll } from "../../../../Api";
import Loader from "../../../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  setLiveAlerts,
  setAssignedAlerts,
  setCompletedAlerts,
  setLiveAlertsData,
  setIsConnected,
  setSendCommandsType,
  setKilledDevices,
  setDashboardStatistics,
  setSelfSendCommands,
} from "../../../../ReaduxToolkit/Reducer/AlertsSlice";
import Swal from "sweetalert2";
import ControlRoomAnalytics from "./Analytics/ControlRoomAnalytics";
import {
  setDevices,
  setDevicesStatuses,
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { useNavigate } from "react-router-dom";
import NoInternetConnection from "../../../NoInternetConnection/NoInternetConnection";

const ControlRoom = () => {
  const { assignedAlerts, completedAlerts, isConnected, liveAlerts } =
    useSelector((state: any) => state.alerts);
  const { devices } = useSelector((state: any) => state.monitoring);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const navigate = useNavigate();
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var allAlertsPreview = userPermissions.find(
    (item: any) => item.title === "All Alerts Preview"
  );
  console.log("All Alerts Preview", allAlertsPreview);

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(setAssignedAlerts([]));
    dispatch(setLiveAlerts([]));
    dispatch(setLiveAlertsData(null));
    dispatch(setCompletedAlerts([]));
    getAll({ url: "company/alert-events?pageNo=1" }).then((data: any) => {
      // console.log("api call --- >", data);
      // console.log("data,data");

      if (data == undefined) {
        dispatch(setLiveAlerts([]));
        dispatch(setLiveAlertsData(null));
      }
      if (data !== undefined) {
        if (!data.success && data.message == "ERROR_INTERNET_DISCONNECTED") {
          dispatch(setIsConnected(true));
        }
        if (!data.success && data.message == "ERROR_INTERNET_DISCONNECTED") {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          // console.log("length --- >", data.data.allAlertEvents.length);
          dispatch(setLiveAlerts(data.data.allAlertEvents));
          dispatch(setLiveAlertsData(data.data));
        }
      }
      setLoading(false);
      if (devices.length !== 0) {
        setDevicesLoading(false);
      }
    });
    getAll({ url: "company/get-all-assigned-events" }).then((data: any) => {
      // console.log("assigned --- >", data);
      // setLoading(false);
      if (data == undefined) {
        dispatch(setAssignedAlerts([]));
      }
      if (data !== undefined) {
        if (!data.success && data.message == "ERROR_INTERNET_DISCONNECTED") {
          dispatch(setIsConnected(true));
          setLoading(false);
        }
        if (!data.success && data.message == "ERROR_INTERNET_DISCONNECTED") {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
        }
        if (data.success) {
          // console.log("length --- >", data.data.length);
          dispatch(setAssignedAlerts(data.data));
        }
      }
    });
    getAll({ url: "company/get-all-completed-events" }).then((data: any) => {
      // console.log("completed --- >", data);
      // setLoading(false);
      if (data == undefined) {
        dispatch(setCompletedAlerts([]));
      }
      if (data !== undefined) {
        if (!data.success && data.message == "ERROR_INTERNET_DISCONNECTED") {
          dispatch(setIsConnected(true));
        }
        if (!data.success && data.message == "ERROR_INTERNET_DISCONNECTED") {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          // console.log("length --- >", data.data.length);
          dispatch(setCompletedAlerts(data.data));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: "control-room/get-all-killed-devices?type=self" }).then(
      (data: any) => {
        // console.log("api call --- >", data);

        if (data !== undefined) {
          if (data.success) {
            // console.log("length --- >", data.data);
            dispatch(setKilledDevices(data.data));
          }
          if (!data.success) {
            // // console.log("length --- >", data.data);
            dispatch(setKilledDevices([]));
          }
        }
      }
    );
  }, []);
  useEffect(() => {
    getAll({ url: "control-room/dashboard/statistics" }).then((data: any) => {
      // console.log("api call --- >", data);

      if (data !== undefined) {
        if (data.success) {
          // // console.log("length --- >", data.data);
          dispatch(setDashboardStatistics(data.data.controlRoomStatistics));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: "control-room/get-all-commanded-devices" }).then(
      (data: any) => {
        // console.log("api call --- >", data);

        if (data !== undefined) {
          if (data.success) {
            // // console.log("length --- >", data.data);
            dispatch(setSelfSendCommands(data.data));
          }
          if (!data.success) {
            // // console.log("length --- >", data.data);
            dispatch(setSelfSendCommands([]));
          }
        }
      }
    );
  }, []);

  useEffect(() => {
    let intervalId: any; // Declare variable to store interval ID

    // Function to fetch data and dispatch actions
    const VerifyAndUpdateAllBlockStatus = () => {
      getAll({ url: "control-room/verify-and-update-all-block-status" }).then(
        (data: any) => {
          // console.log("api call --- >", data);

          if (data !== undefined) {
            if (data.success) {
            }
          }
        }
      );
    };

    // console.log("Setting up interval verify-and-update-all-block-status...");
    intervalId = setInterval(() => {
      VerifyAndUpdateAllBlockStatus();
    }, 300000);

    return () => {
      // console.log("Clearing interval verify-and-update-all-block-status...");
      clearInterval(intervalId);
    };
  }, []);

  const groups: any = [];
  const groupDevicesObj: any = {};
  const initialGroupDevices: any = [];

  const statuses: any = [];
  const statusDevicesObj: any = {};
  var initialGroupDevicesStatuses: any = [];

  const [groupdevices, setgroupdevices]: any = useState([]);
  const [groupdevicesStatuses, setgroupdevicesStatuses]: any = useState([]);

  useEffect(() => {
    if (devices.length == 0) {
      getAll({ url: "company/devices" }).then((data: any) => {
        // console.log("data", data);
        // if (data == undefined) {
        //   setDevicesLoading(false);
        //   Swal.fire({
        //     text: "Failed to Fetch",
        //     icon: "error",
        //     timer: 2000,
        //     showConfirmButton: false,
        //   });
        // }
        if (data !== undefined) {
          if (!data.success && data.message == "ERROR_INTERNET_DISCONNECTED") {
            dispatch(setIsConnected(true));
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setDevicesLoading(false);
          }

          if (data.success) {
            // console.log("api call --- >", data);
            // console.log("length --- >", data.data.length);

            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i].title;
              if (!groups.includes(element)) {
                groups.push(element);
              }
            }

            groups.forEach((title: any) => {
              groupDevicesObj[title] = data.data
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
            // console.log("groups", groups);
            // console.log("groupDevices", groupdevices);
            dispatch(setDevices(initialGroupDevices));
            setDevicesLoading(false);

            // ---------------------- For device status-----------------------------------

            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i].online;
              if (!statuses.includes(element)) {
                statuses.push(element);
                // setMyArray((prevArray) => [...prevArray, element]);
              }
            }
            statuses.forEach((online: any) => {
              statusDevicesObj[online] = data.data
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

            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i];
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
                // console.log("expiredDevices", expiredDevices);
                initialGroupDevicesStatuses.push({
                  online: "Expired",
                  items: expiredDevices,
                });
              }
            }

            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i];
              if (
                element.time == null ||
                element.time === "" ||
                element.time === undefined
              ) {
                notConnectedDevices.push({ ...element, checked: false });
              }
              if (i === data.data.length - 1) {
                // console.log("notConnectedDevices", notConnectedDevices);
                initialGroupDevicesStatuses.push({
                  online: "Not Connected",
                  items: notConnectedDevices,
                });
              }
            }

            // Update state with initialGroupDevicesStatuses
            setgroupdevicesStatuses(initialGroupDevicesStatuses);
            // console.log("statuses", statuses);
            // console.log("groupDevicesStatuses", initialGroupDevicesStatuses);
            dispatch(setDevicesStatuses(initialGroupDevicesStatuses));
          }
        }
      });
    }
  }, []);

  const events = [
    {
      id: "1",
      element: <AssignedAlerts />,
    },
    {
      id: "2",
      element: <CompletedAlerts />,
    },
  ];

  const [basicTab, setBasicTab] = useState("1");
  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <Container fluid className="dashboard_default">
          <Row className="widget-grid">
            <Breadcrumbs
              mainTitle="Control Room"
              parent="Company"
              title="Module / Control Room"
            />
          </Row>

          {!loading && !devicesLoading ? (
            <Row>
              <Row>
                <ControlRoomAnalytics />
              </Row>
              <Row>
                  <Col xl="6">
                    <LiveAlerts />
                  </Col>
                  <Col xl="6">
                    <div style={{ backgroundColor: "white" }}>
                      <Nav
                        tabs
                        className="simple-wrapper"
                        style={{
                          backgroundColor: "#63d5be",
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                        }}
                      >
                        <NavItem
                          style={{
                            width: "50%",
                            height: "50px",
                            textAlign: "center",
                            fontSize: "22px",
                            cursor: "pointer",
                          }}
                        >
                          <NavLink
                            className={` ${basicTab === "1" ? "active" : ""}`}
                            style={{
                              color: `${
                                basicTab === "1" ? "#63d5be" : "white"
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
                            height: "50px",
                            textAlign: "center",
                            fontSize: "22px",
                            cursor: "pointer",
                          }}
                        >
                          <NavLink
                            className={` ${basicTab === "2" ? "active" : ""}`}
                            style={{
                              color: `${
                                basicTab === "2" ? "#63d5be" : "white"
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
              {/* {allAlertsPreview !== undefined && allAlertsPreview?.read && (
                
              )} */}
            </Row>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "white",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Loader />
              </div>
            </div>
          )}
        </Container>
      )}
    </>
  );
};

export default ControlRoom;
