import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserRole } from "../../Utilities/globals/globals";
import { ROLES } from "../../constants/roles";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import General from "./General/General";
import AlertsOverview from "./Control Room/AlertsOverview";
import TotalEarning from "./ShoppingPlace/TotalEarning/TotalEarning";
import RecentOrders from "./ShoppingPlace/RecentOrders/RecentOrders";
import TopSeller from "./ShoppingPlace/TopSeller/TopSeller";
import NewProduct from "./ShoppingPlace/NewProduct/NewProduct";
import TopCountries from "./ShoppingPlace/TopCountries/TopCountries";
import ActivityTimeline from "./ShoppingPlace/ActivityTimeline/ActivityTimeline";
import SalesSummary from "./ShoppingPlace/SalesSummary/SalesSummary";
import WeekendSale from "./ShoppingPlace/WeekendSale/WeekendSale";
import Invoice from "./ShoppingPlace/Invoice/Invoice";
import ProductSales from "./ShoppingPlace/ProductSales/ProductSales";
import KilledVehicles from "./Control Room/KilledVehicles";
import { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { getAll } from "../../Utilities/api";
import {
  setAssignedAlerts,
  setIsConnected,
  setKilledDevices,
  setLiveAlerts,
  setLiveAlertsData,
} from "../../ReaduxToolkit/Reducer/AlertsSlice";
import Swal from "sweetalert2";
import AlertsPending from "./Control Room/AlertsPending";
import {
  setAlertsOverview,
  setAlertsPending,
  setGeneralData,
  setOperatorPerformance,
} from "../../ReaduxToolkit/Reducer/DashboardSlice";
import {
  setDevices,
  setDevicesStatuses,
} from "../../ReaduxToolkit/Reducer/MonitoringSlice";
import { useNavigate } from "react-router-dom";
import { setErrorData } from "../../ReaduxToolkit/Reducer/UserSlice";
import {
  GET_COMPANY_ALERTS_OVERVIEW,
  GET_COMPLAINT_CENTER_STATISTICS,
} from "../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../Utilities/constants/constants";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Chart from "react-google-charts";
import { H4, H5, P } from "../../AbstractElements";
import SVG from "../../utils/CommonSvgIcon/SVG";
import {
  setComplainCenterRoles,
  setComplainCenterStatistics,
} from "../../ReaduxToolkit/Reducer/ComplainCenterSlice";
import Skeleton from "../Utilities/Skeleton/Skeleton";
import StickyBar from "./StickyBar/StickyBar";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loginData } = useSelector((state: any) => state.user);
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var dashboard = userPermissions.find(
    (item: any) => item.title === "Dashboard"
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [alertsOverviewloading, setAlertsOverviewLoading] =
    useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const showSwalAlerts = (errors: any, index: any) => {
      // Base case: If index is equal to the length of errors array, stop recursion
      if (index === errors.length) return;

      const server = errors[index].server;
      const serverError = errors[index].serverError;

      Swal.fire({
        title: `${server.companyName}`,
        text: `${serverError.message}`,
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
      const serverErrors = loginData?.data?.serverErrors;
      // If there are server errors, start showing alerts
      if (serverErrors && serverErrors.length !== 0) {
        showSwalAlerts(serverErrors, 0); // Start from index 0
      }
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, [loginData]);

  // Simulating data fetching with a timeout

  const [statisticsloading, setStatisticsLoading] = useState(true);
  const { complainCenterStatistics, complainCenterRoles } = useSelector(
    (state: any) => state.complainCenter
  );

  useEffect(() => {
    getAll({ url: GET_COMPLAINT_CENTER_STATISTICS }).then((data: any) => {
      // console.log("Data", data);

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
          setStatisticsLoading(false);
        }

        if (data.success) {
          dispatch(
            setComplainCenterRoles(
              data.data.InternalComplaintsStatistics.subRoleCounts
            )
          );
          const mappedArray = Object.entries(
            data.data.InternalComplaintsStatistics
          ).map(([key, value]) => {
            // Remove "total" from the key and replace "Count" with "Tickets"
            if (key !== "subRoleCounts") {
              const formattedKey = key
                .replace("total", "")
                .replace("Count", "");
              return { key: formattedKey, value: value };
            }
          });
          mappedArray.pop();
          // console.log(mappedArray);
          dispatch(setComplainCenterStatistics(mappedArray));
          setStatisticsLoading(false);
        }
      }
    });
  }, []);

  useEffect(() => {
    dispatch(setLiveAlerts([]));
    dispatch(setLiveAlertsData(null));

    if (getUserRole() == "COMPANY") {
      getAll({ url: "${company/alert-events}?pageNo=1" }).then((data: any) => {
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

            dispatch(setLiveAlerts(data.data.allAlertEvents));
            dispatch(setLiveAlertsData(data.data));
          }
          if (!data.success) {
            // // console.log("length --- >", data.data.allAlertEvents.length);
            dispatch(setLiveAlerts([]));
            dispatch(setLiveAlertsData([]));
          }
        }
      });
    }

    if (getUserRole() == ROLES.COMPANY) {
      getAll({ url: GET_COMPANY_ALERTS_OVERVIEW }).then((data: any) => {
        // console.log("api call --- >", data);
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
            // // console.log("length --- >", data.data);

            interface Alert {
              dayOfWeek: string;
              totalAssigned: number;
              totalCompleted: number;
              totalAlerts: number;
            }

            const alertsOverview: {
              dayOfWeek: string[];
              totalAssigned: number[];
              totalCompleted: number[];
              totalAlerts: number[];
            } = {
              dayOfWeek: [],
              totalAssigned: [],
              totalCompleted: [],
              totalAlerts: [],
            };

            (data.data.alertsOverview as Alert[]).forEach((day) => {
              alertsOverview.dayOfWeek.push(day.dayOfWeek);
              alertsOverview.totalAssigned.push(day.totalAssigned);
              alertsOverview.totalCompleted.push(day.totalCompleted);
              alertsOverview.totalAlerts.push(day.totalAlerts);
            });
            // console.log(alertsOverview);
            setTimeout(() => {
              dispatch(setAlertsOverview(alertsOverview));
            }, 500);

            dispatch(setAlertsPending(data.data.allPendingAlerts));
            setTimeout(() => {
              setAlertsOverviewLoading(false);
            }, 2500);
          }
          if (!data.success) {
            // // // console.log("length --- >", data.data);
            dispatch(setAlertsOverview(null));
            dispatch(setAlertsPending([]));
            setTimeout(() => {
              setAlertsOverviewLoading(false);
            }, 2500);
          }
        }
      });

      getAll({ url: "control-room/get-all-killed-devices?type=all" }).then(
        (data: any) => {
          // // console.log("api call --- >", data);

          if (data !== undefined) {
            if (data.success) {
              // // console.log("length --- >", data.data);
              dispatch(setKilledDevices(data.data));
              // setLoading(false);
            }
            if (!data.success) {
              // // // console.log("length --- >", data.data);
              dispatch(setKilledDevices([]));
              // setLoading(false);
            }
          }
        }
      );
    }
  }, []);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const startDate = yesterday.toISOString();
  const endDate = new Date().toISOString();
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);

  // Visibility state
  const [visibleSections, setVisibleSections]: any = useState({
    general: true,
    "control-room": true,
    "killed-vehicles": true,
    "complaint-center": true,
  });

  useEffect(() => {
    const storedVisibility = localStorage.getItem("visibilityState");
    if (storedVisibility !== null) {
      const parsedVisibility = JSON.parse(storedVisibility);
      setVisibleSections(parsedVisibility);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("visibilityState", JSON.stringify(visibleSections));
  }, [visibleSections]);

  type SectionKey = keyof typeof visibleSections;

  const toggleSection = (section: SectionKey) => {
    console.log(section);

    setVisibleSections((prevState: any) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
    console.log(visibleSections);
  };

  const componentMap: { [key: string]: JSX.Element } = {
    general: <General />,
    "control-room": (
      <Col xl="12" lg="12" md="12" sm="12">
        <Row>
          {alertsOverviewloading ? (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ marginBottom: "20px", marginRight: "20px" }}>
                <Skeleton height="450px" width="700px" />
              </div>
              <div style={{ marginBottom: "20px", marginRight: "20px" }}>
                <Skeleton height="450px" width="700px" />
              </div>
            </div>
          ) : (
            <Row
              id="control-room"
              style={{
                display: "flex",
                paddingRight: "0px",
                marginRight: "0px",
              }}
            >
              <AlertsOverview />
              <AlertsPending />
            </Row>
          )}
        </Row>
      </Col>
    ),
    "killed-vehicles": (
      <>
        {!alertsOverviewloading && (
          <Row>
            <Col xl="12">
              <div id="killed-vehicles">
                <KilledVehicles fromDate={fromDate} toDate={toDate} />
              </div>
            </Col>
          </Row>
        )}
      </>
    ),
    "complaint-center": statisticsloading ? (
      <div
        style={{
          display: "flex",
          // flexDirection: "column",
          width: "100%",
        }}
      >
        <Skeleton
          height="90px"
          width="100%"
          marginTop="10px"
          marginBottom="30px"
        />
        <Skeleton
          height="90px"
          width="100%"
          marginTop="10px"
          marginBottom="30px"
          marginLeft="30px"
        />
        <Skeleton
          height="90px"
          width="100%"
          marginTop="10px"
          marginBottom="20px"
          marginLeft="30px"
        />
        <Skeleton
          height="90px"
          width="100%"
          marginTop="10px"
          marginBottom="20px"
          marginLeft="30px"
        />
        <Skeleton
          height="90px"
          width="100%"
          marginTop="10px"
          marginBottom="20px"
          marginLeft="30px"
        />
        <Skeleton
          height="140px"
          width="100%"
          marginTop="10px"
          marginBottom="20px"
          marginLeft="30px"
        />
      </div>
    ) : (
      <Card
        style={{
          height: "200px",
          paddingBottom: "-20px",
          overflow: "hidden",
          transition: "height 0.5s",
          marginTop: "15px",
        }}
      >
        <CardBody>
          <div>
            <Col xl="12" className="widget-sell">
              <CardHeader
                className="pb-0"
                style={{
                  padding: "0px",
                }}
              >
                <div className="header-top">
                  <H4 className="m-0">Complaint Center</H4>
                </div>
              </CardHeader>
              <div
                style={{
                  marginBottom: "15px",
                }}
              ></div>
              <Row>
                {complainCenterStatistics.map((data: any, index: any) => (
                  <Col
                    xl={2}
                    lg={2}
                    md="4"
                    sm="12"
                    key={index}
                    style={{
                      marginTop: "15px",
                      // height: "80px",
                      position: "relative",
                    }}
                  >
                    <div
                      className="sale"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                        padding: "0px 15px",
                        backgroundColor: "white",
                        //   data.key === "New"
                        //     ? "rgba(0, 0, 255, 0.3)"
                        //     : data.key == "InProgress"
                        //       ? "rgba(255, 165, 0, 0.3)"
                        //       : data.key === "Pending"
                        //         ? "rgba(255, 0, 0, 0.3)" :
                        //         data.key === "Resolved"
                        //           ? "rgba(0, 255, 0, 0.3)" : "rgb(245, 246, 249)",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Example box shadow
                        height: "60px",
                        width: "92%",
                      }}
                    >
                      <H4>
                        {data.key !== "InternalComplaints"
                          ? data.key == "InProgress"
                            ? "In Progress"
                            : data.key
                          : "Total"}
                      </H4>

                      {/* <H6>{data.value}</H6> */}
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
                    <div
                      style={{
                        backgroundColor: "white",
                        border: `4px solid ${
                          data.key === "New"
                            ? "rgba(0, 0, 255, 0.3)"
                            : data.key == "InProgress"
                            ? "rgba(255, 165, 0, 0.3)"
                            : data.key === "Pending"
                            ? "rgba(255, 0, 0, 0.3)"
                            : data.key === "Resolved"
                            ? "rgba(0, 255, 0, 0.3)"
                            : "rgb(245, 246, 249)"
                        }`,
                        height: "45px",
                        width: "45px",
                        borderRadius: "100px",
                        position: "absolute",
                        top: "0",
                        right: "0",
                        marginTop: "8px",
                        marginRight: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "white",
                          border: `3px solid lightgray`,
                          height: "34px",
                          width: "34px",
                          borderRadius: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                        }}
                      >
                        <H5>{data.value}</H5>
                      </div>
                    </div>
                  </Col>
                ))}
                <Col
                  xl="2"
                  lg="2"
                  md="4"
                  sm="12"
                  style={
                    {
                      // display:"flex",
                      // alignItems:"center"
                      // marginTop: "15px"
                    }
                  }
                >
                  <div
                    className="sale"
                    style={{
                      backgroundColor: "white", // Remove the background color
                      paddingTop: "0px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%", // Set the width of the outer container
                          height: "170px", // Set the height of the outer container
                          backgroundColor: "white", // Remove the background color
                          // marginTop: "15px",
                          // marginBottom: "-100px"
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
                              ["Complains", "Hours per Day"],
                              ["New", complainCenterStatistics[1]?.value],
                              [
                                "In Progress",
                                complainCenterStatistics[2]?.value,
                              ],
                              ["Pending", complainCenterStatistics[3]?.value],
                              ["Resolved", complainCenterStatistics[4]?.value],
                            ]}
                            options={{
                              backgroundColor: "transparent", // Set chart background color as transparent
                              chartArea: {
                                backgroundColor: "transparent", // Set chart area background color as transparent
                                top: "5%", // Set padding of the top of chart area to 0
                                left: "3%", // Set padding of the left of chart area to 0
                                right: 0,
                              },
                              pieSliceText: "value", // Display the exact values of each option
                              colors: ["blue", "orange", "#ff6150", "#51bb25"], // Custom colors for Active and Inactive options respectively
                              is3D: true, // Set the chart type to 3D
                              legend: { position: "none" }, // Remove legend
                            }}
                            rootProps={{
                              "data-testid": "2",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </div>
        </CardBody>
      </Card>
    ),
  };

  const initialOrder: string[] = [
    "general",
    "control-room",
    "killed-vehicles",
    "complaint-center",
  ];

  const [componentOrder, setComponentOrder] = useState<string[]>(initialOrder);

  useEffect(() => {
    const storedOrder = localStorage.getItem("dashboardOrder");
    if (storedOrder) {
      setComponentOrder(JSON.parse(storedOrder));
    } else {
      setComponentOrder(initialOrder);
    }
  }, [alertsOverviewloading, statisticsloading]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newOrder = Array.from(componentOrder);
    const [movedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, movedItem);

    setComponentOrder(newOrder);
    localStorage.setItem("dashboardOrder", JSON.stringify(newOrder));
  };
  // ----------------------------------

  return (
    <>
      {getUserRole() === ROLES.COMPANY && (
        <StickyBar
          toggleSection={toggleSection}
          visibleSections={visibleSections}
        />
      )}
      <Breadcrumbs mainTitle="Dashboard" parent="Dashboard" title="Dashboard" />
      {getUserRole() === ROLES.SUPER_ADMIN ? (
        <Container fluid className="dashboard_default">
          <Row className="widget-grid">
            <TotalEarning />
            <RecentOrders />
            <TopSeller />
            <NewProduct />
            <TopCountries />
            <ActivityTimeline />
            <SalesSummary />
            <WeekendSale />
            <Invoice />
            <ProductSales />
          </Row>
        </Container>
      ) : dashboard !== undefined &&
        dashboard?.read &&
        getUserRole() === ROLES.COMPANY ? (
        <Container fluid className="crm_dashboard">
          <Row className="widget-grid">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="dashboard">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {componentOrder.map((id: any, index) => (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {/* {componentMap[id]} */}
                            {visibleSections[id] && componentMap[id]}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Row>
        </Container>
      ) : (
        <div
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "85vh",
          }}
        >
          {/* <div>Welcome to the Autotel Private Limited</div> */}
          <div>Something better is Coming</div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

// const [items, setItems] = useState([
//   {
//     id: "general", content: <div>
//       <General />
//     </div>
//   },
//   {
//     id: "control-room",
//     content: (
//       <>
//         {/* <AlertsOverview />
//         <AlertsPending /> */}
//         <Col xl="12" lg="12" md="12" sm="12">
//           <Row>
//             {alertsOverviewloading == true ? (
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <div
//                   style={{
//                     marginBottom: "20px",
//                     marginRight: "20px",
//                   }}
//                 >
//                   <Skeleton width={700} height={450} />
//                 </div>
//                 <div
//                   style={{
//                     marginBottom: "20px",
//                     marginRight: "20px",
//                   }}
//                 >
//                   <Skeleton width={700} height={440} />
//                 </div>
//               </div>
//             ) : (
//               <>

//                 <Row id="control-room" style={{
//                   display: "flex",
//                   paddingRight: "0px",
//                   marginRight: "0px"

//                 }}>
//                   <AlertsOverview />
//                   <AlertsPending />
//                 </Row>

//                 {/* <div id="killed-vehicles">
//                     <KilledVehicles fromDate={fromDate} toDate={toDate} />
//                   </div> */}

//               </>
//             )}
//           </Row>
//         </Col>
//       </>
//     ),
//   },
//   {
//     id: "killed-vehicles",
//     content: (
//       <>
//         {!alertsOverviewloading && <Row>
//           <Col xl="12">
//             <div id="killed-vehicles">
//               <KilledVehicles fromDate={fromDate} toDate={toDate} />
//             </div>
//           </Col>
//         </Row>}
//       </>
//     )
//     // <KilledVehicles fromDate={fromDate} toDate={toDate} />,
//   },
// ]);

// useEffect(() => {
//   setItems([
//     {
//       id: "general", content: <div>
//         <General />
//       </div>
//     },
//     {
//       id: "control-room",
//       content: (
//         <>
//           {/* <AlertsOverview />
//       <AlertsPending /> */}
//           <Col xl="12" lg="12" md="12" sm="12">
//             <Row>
//               {alertsOverviewloading == true ? (
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <div
//                     style={{
//                       marginBottom: "20px",
//                       marginRight: "20px",
//                     }}
//                   >
//                     <Skeleton width={700} height={450} />
//                   </div>
//                   <div
//                     style={{
//                       marginBottom: "20px",
//                       marginRight: "20px",
//                     }}
//                   >
//                     <Skeleton width={700} height={440} />
//                   </div>
//                 </div>
//               ) : (
//                 <>

//                   <Row id="control-room" style={{
//                     display: "flex",
//                     paddingRight: "0px",
//                     marginRight: "0px"

//                   }}>
//                     <AlertsOverview />
//                     <AlertsPending />
//                   </Row>

//                 </>
//               )}
//             </Row>
//           </Col>
//         </>
//       ),
//     },
//     {
//       id: "killed-vehicles",
//       content: (
//         <>
//           {!alertsOverviewloading && <Row>
//             <Col xl="12">
//               <div id="killed-vehicles">
//                 <KilledVehicles fromDate={fromDate} toDate={toDate} />
//               </div>
//             </Col>
//           </Row>}
//         </>
//       )

//     },
//   ])
// }, [alertsOverviewloading])

// const onDragEnd = (result: any) => {
//   if (!result.destination) {
//     return;
//   }

//   const reorderedItems = Array.from(items);
//   const [removed] = reorderedItems.splice(result.source.index, 1);
//   reorderedItems.splice(result.destination.index, 0, removed);

//   setItems(reorderedItems);
// };

// <Container fluid className="crm_dashboard">
//   <Row className="widget-grid">
//     {/* Skegeneralleton loading effect */}
//     <div id="genearl">
//       <General />
//     </div>

//     <Col xl="12" lg="12" md="12" sm="12">
//       <Row>
//         {alertsOverviewloading == true ? (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//             }}
//           >
//             <div
//               style={{
//                 marginBottom: "20px",
//                 marginRight: "20px",
//               }}
//             >
//               <Skeleton width={700} height={450} />
//             </div>
//             <div
//               style={{
//                 marginBottom: "20px",
//                 marginRight: "20px",
//               }}
//             >
//               <Skeleton width={700} height={440} />
//             </div>
//           </div>
//         ) : (
//           <>

//             <Row id="control-room" style={{
//               display: "flex",
//               paddingRight: "0px",
//               marginRight: "0px"

//             }}>
//               <AlertsOverview />
//               <AlertsPending />
//             </Row>

//             {/* <div id="killed-vehicles">
//               <KilledVehicles fromDate={fromDate} toDate={toDate} />
//             </div> */}

//           </>
//         )}
//       </Row>
//     </Col>
//     {!alertsOverviewloading && <Row>
//       <Col xl="12">
//         <div id="killed-vehicles">
//           <KilledVehicles fromDate={fromDate} toDate={toDate} />
//         </div>
//       </Col>
//     </Row>}
//   </Row>
// </Container>
