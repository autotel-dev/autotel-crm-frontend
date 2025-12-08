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
import Skeleton from "../../../Utilities/Skeleton/Skeleton";

import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import LiveAlerts from "./Events/LiveAlerts/LiveAlerts";
import AssignedAlerts from "./Events/AssignedAlerts/AssignedAlerts";
import CompletedAlerts from "./Events/CompletedAlerts/CompletedAlerts";
import { useEffect, useState } from "react";
import { getAll } from "../../../../Utilities/api";
import Loader from "../../../Utilities/Loader/Loader";
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
  setPreInfoAlerts,
} from "../../../../ReaduxToolkit/Reducer/AlertsSlice";
import Swal from "sweetalert2";
import ControlRoomAnalytics from "./Analytics/ControlRoomAnalytics";
import {
  setDevices,
  setDevicesStatuses,
  setServerDevices,
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { useNavigate } from "react-router-dom";
import NoInternetConnection from "../../../Utilities/NoInternetConnection/NoInternetConnection";
import { getUserRole } from "../../../../Utilities/globals/globals";
import { ROLES } from "../../../../constants/roles";
import { setErrorData } from "../../../../ReaduxToolkit/Reducer/UserSlice";
import {
  CONTROLROOM_DASHBOARD_STATISTICS,
  GET_ALERT_EVENTS_V2,
  GET_ALL_ASSIGNED_ALERT_EVENTS,
  GET_ALL_COMMANDED_DEVICES,
  GET_ALL_COMPLETED_ALERT_EVENTS,
  GET_ALL_KILLED_DEVICES,
  GET_ALL_VALID_PRE_INFOS,
  GET_DEVICES,
  VERIFY_AND_UPDATE_ALL_VEHICLE_BLOCK_STATUS,
} from "../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../Utilities/constants/constants";

const ControlRoom = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { assignedAlerts, completedAlerts, isConnected, liveAlerts } =
    useSelector((state: any) => state.alerts);
  const { devices } = useSelector((state: any) => state.monitoring);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState([]);
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var allAlertsPreview = userPermissions.find(
    (item: any) => item.title === "All Alerts Preview"
  );
  // console.log("All Alerts Preview", allAlertsPreview);

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(setAssignedAlerts([]));
    dispatch(setLiveAlerts([]));
    dispatch(setLiveAlertsData(null));
    dispatch(setCompletedAlerts([]));

    getAll({ url: `${GET_ALERT_EVENTS_V2}?page=1&limit=30` }).then(
      (data: any) => {
        // // console.log("api call --- >", data);
        // // console.log("data,data");

        if (data == undefined) {
          dispatch(setLiveAlerts([]));
          dispatch(setLiveAlertsData(null));
        }
        if (data !== undefined) {
          if (!data.success && data.message === ERROR_MESSAGE) {
            dispatch(setIsConnected(true));
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
            // // console.log("length --- >", data.data.allAlertEvents.length);
            // if (data.data.serverErrors.length !== 0) {
            //   setServerErrors(data.data.serverErrors);
            // }
            dispatch(setLiveAlerts(data.data.rows));
            dispatch(setLiveAlertsData(data.data));
          }
          if (!data.success) {
            // // console.log("length --- >", data.data.allAlertEvents.length);
            dispatch(setLiveAlerts([]));
            dispatch(setLiveAlertsData([]));
          }
        }
        setLoading(false);
        if (devices.length !== 0) {
          setDevicesLoading(false);
        }
      }
    );

    // getAll({ url: `${GET_ALERT_EVENTS}?pageNo=1` }).then((data: any) => {
    //   // // console.log("api call --- >", data);
    //   // // console.log("data,data");

    //   if (data == undefined) {
    //     dispatch(setLiveAlerts([]));
    //     dispatch(setLiveAlertsData(null));
    //   }
    //   if (data !== undefined) {
    //     if (!data.success && data.message === ERROR_MESSAGE) {
    //       dispatch(setIsConnected(true));
    //     }
    //     if (!data.success && data.message === ERROR_MESSAGE) {
    //       Swal.fire({
    //         text: `${data.message}`,
    //         icon: "error",
    //         timer: 2000,
    //         showConfirmButton: false,
    //       });
    //     }
    //     if (data.success) {
    //       // // console.log("length --- >", data.data.allAlertEvents.length);
    //       if (data.data.serverErrors.length !== 0) {
    //         setServerErrors(data.data.serverErrors);
    //       }
    //       dispatch(setLiveAlerts(data.data.allAlertEvents));
    //       dispatch(setLiveAlertsData(data.data));
    //     }
    //     if (!data.success) {
    //       // // console.log("length --- >", data.data.allAlertEvents.length);
    //       dispatch(setLiveAlerts([]));
    //       dispatch(setLiveAlertsData([]));
    //     }
    //   }
    //   setLoading(false);
    //   if (devices.length !== 0) {
    //     setDevicesLoading(false);
    //   }
    // });
    getAll({ url: GET_ALL_ASSIGNED_ALERT_EVENTS }).then((data: any) => {
      // // console.log("assigned --- >", data);
      // setLoading(false);
      if (data == undefined) {
        dispatch(setAssignedAlerts([]));
      }
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setIsConnected(true));
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
          // // console.log("length --- >", data.data.length);
          dispatch(setAssignedAlerts(data.data));
        }
        if (!data.success) {
          // // console.log("length --- >", data.data.length);
          dispatch(setAssignedAlerts([]));
        }
      }
    });
    getAll({ url: GET_ALL_COMPLETED_ALERT_EVENTS }).then((data: any) => {
      // // console.log("completed --- >", data);
      // setLoading(false);
      if (data == undefined) {
        dispatch(setCompletedAlerts([]));
      }
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setIsConnected(true));
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
          // // console.log("length --- >", data.data.length);
          dispatch(setCompletedAlerts(data.data));
        }
        if (!data.success) {
          // // console.log("length --- >", data.data.length);
          dispatch(setCompletedAlerts([]));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: `${GET_ALL_KILLED_DEVICES}?type=self` }).then((data: any) => {
      // // console.log("api call --- >", data);

      if (data !== undefined) {
        if (data.success) {
          // // console.log("length --- >", data.data);
          dispatch(setKilledDevices(data.data));
        }
        if (!data.success) {
          // // // console.log("length --- >", data.data);
          dispatch(setKilledDevices([]));
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
      // // console.log("api call --- >", data);

      if (data !== undefined) {
        if (data.success) {
          // // // console.log("length --- >", data.data);
          dispatch(setDashboardStatistics(data.data));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_COMMANDED_DEVICES }).then((data: any) => {
      // // console.log("api call --- >", data);

      if (data !== undefined) {
        if (data.success) {
          // // // console.log("length --- >", data.data);
          dispatch(setSelfSendCommands(data.data));
        }
        if (!data.success) {
          // // // console.log("length --- >", data.data);
          dispatch(setSelfSendCommands([]));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_VALID_PRE_INFOS }).then((data: any) => {
      // // console.log("api call --- >", data);

      if (data !== undefined) {
        if (data.success) {
          // // console.log("length --- >", data.data);
          dispatch(setPreInfoAlerts(data.data));
        }
        if (!data.success) {
          // // // console.log("length --- >", data.data);
          dispatch(setPreInfoAlerts([]));
        }
      }
    });
  }, []);

  useEffect(() => {
    let intervalId: any; // Declare variable to store interval ID

    // Function to fetch data and dispatch actions
    const VerifyAndUpdateAllBlockStatus = () => {
      getAll({ url: VERIFY_AND_UPDATE_ALL_VEHICLE_BLOCK_STATUS }).then(
        (data: any) => {
          // // console.log("api call --- >", data);

          if (data !== undefined) {
            if (data.success) {
            }
          }
        }
      );
    };

    // // console.log("Setting up interval verify-and-update-all-block-status...");
    intervalId = setInterval(() => {
      VerifyAndUpdateAllBlockStatus();
    }, 300000);

    return () => {
      // // console.log("Clearing interval verify-and-update-all-block-status...");
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
    if (devices.length === 0) {
      getAll({ url: GET_DEVICES }).then((data: any) => {
        // // console.log("data", data);
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
          if (!data.success && data.message === ERROR_MESSAGE) {
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
            setDevicesLoading(false);

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

  useEffect(() => {
    const showSwalAlerts = (errors: any, index: any) => {
      // Base case: If index is equal to the length of errors array, stop recursion
      if (index === errors.length) return;

      const server = errors[index].server;
      const serverError = errors[index].serverError;

      Swal.fire({
        title: `${server?.companyName}`,
        text: `${serverError?.message}`,
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Update Credentials", // Add "Update Credentials" button
      }).then((result) => {
        if (result.isConfirmed) {
          // User clicked "OK", recursively call showSwalAlerts with the next index
          showSwalAlerts(errors, index + 1);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // User clicked "Update Credentials", handle update logic here
          // You can add your update logic here or call a separate function
          dispatch(setErrorData(true));
          navigate(`${process.env.PUBLIC_URL}/users/account`);

          // console.log("Update Credentials clicked");
        }
      });
    };

    const timer = setTimeout(() => {
      // const serverErrorss = serverErrors;
      // If there are server errors, start showing alerts
      if (serverErrors && serverErrors.length !== 0) {
        showSwalAlerts(serverErrors, 0); // Start from index 0
      }
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, [serverErrors]);

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
              parent={getUserRole() === ROLES.COMPANY ? "Company" : "Operator"}
              title="Module / Control Room"
            />
          </Row>

          {!loading ? (
            <Row>
              <Row>
                <ControlRoomAnalytics />
              </Row>
              <Row>
                <LiveAlerts />
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
              {/* {allAlertsPreview !== undefined && allAlertsPreview?.read && (
                
              )} */}
            </Row>
          ) : (
            <div
            // style={{
            //   display: "flex",
            //   justifyContent: "center",
            //   height: "80vh",
            //   backgroundColor: "white",
            //   alignItems: "center",
            // }}
            >
              <div
                style={{
                  textAlign: "center",
                  // display: "flex",
                  height: "75vh",
                  // alignItems: "center",
                }}
              >
                {/* <Loader /> */}

                <div
                  style={{
                    display: "flex",
                    // flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Skeleton
                    height="140px"
                    width="100%"
                    marginTop="30px"
                    marginBottom="20px"
                    borderRadius="10px"
                    marginRight="20px"
                  />
                  <Skeleton
                    height="140px"
                    width="100%"
                    marginTop="30px"
                    marginBottom="20px"
                    borderRadius="10px"
                    marginRight="20px"
                  />
                  <Skeleton
                    height="140px"
                    width="100%"
                    marginTop="30px"
                    marginBottom="20px"
                    borderRadius="10px"
                    marginRight="20px"
                  />
                  <Skeleton
                    height="140px"
                    width="100%"
                    marginTop="30px"
                    marginBottom="20px"
                    borderRadius="10px"
                    marginRight="20px"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    // flexDirection: "column",
                    width: "100%",
                    // marginLeft:"20px",
                    marginTop: "20px",
                  }}
                >
                  <div
                    style={{
                      // display: "flex",
                      // flexDirection: "column",
                      width: "50%",
                      // marginLeft:"20px"
                      paddingRight: "10px",
                    }}
                  >
                    <Skeleton
                      height="100px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="20px"
                      borderRadius="10px"
                      // marginRight="20px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="20px"
                      borderRadius="10px"
                      // marginRight="20px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="20px"
                      borderRadius="10px"
                      // marginRight="20px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="20px"
                      borderRadius="10px"
                      // marginRight="20px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="20px"
                      borderRadius="10px"
                      // marginRight="20px"
                    />
                  </div>
                  <div
                    style={{
                      // display: "flex",
                      // flexDirection: "column",
                      width: "50%",
                      marginRight: "20px",
                      paddingLeft: "10px",
                    }}
                  >
                    <Skeleton
                      height="100px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="20px"
                      borderRadius="10px"
                      // marginRight="20px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="20px"
                      borderRadius="10px"
                      // marginRight="20px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="20px"
                      borderRadius="10px"
                      // marginRight="20px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="20px"
                      borderRadius="10px"
                      // marginRight="20px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="20px"
                      borderRadius="10px"
                      // marginRight="20px"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      )}
    </>
  );
};

export default ControlRoom;
