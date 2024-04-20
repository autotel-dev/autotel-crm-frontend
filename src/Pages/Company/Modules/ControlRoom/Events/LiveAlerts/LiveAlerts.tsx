import {
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  PopoverBody,
  PopoverHeader,
  Row,
  Table,
  UncontrolledPopover,
} from "reactstrap";
import { H3, H4, H5, P } from "../../../../../../AbstractElements";
import { useEffect, useRef, useState } from "react";
import { create, getAll } from "../../../../../../Api";
import { useDispatch, useSelector } from "react-redux";
import {
  setAssignedAlerts,
  setCompletedAlerts,
  setLiveAlerts,
  setLiveAlertsData,
} from "../../../../../../ReaduxToolkit/Reducer/AlertsSlice";
import Swal from "sweetalert2";
import Loader from "../../../../../Loader/Loader";
import { serverCredentials } from "../../../../../../Api/header";
import { getUserRole } from "../../../../../../Api/globals";

const LiveAlerts = () => {
  const dispatch = useDispatch();
  const { liveAlerts, liveAlertsData } = useSelector(
    (state: any) => state.alerts
  );
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var allAlertsPreview = userPermissions.find(
    (item: any) => item.title === "All Alerts Preview"
  );
  // console.log("All Alerts Preview", allAlertsPreview);

  const [dataList, setDataList]: any = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [assignLoading, setAssignLoading] = useState(true);
  const tableHeader = [
    // "ID",
    "Device",
    "Alert",
    "Type",
    "Message",
    "Address",
  ];
  const containerRef = useRef(null);
  const [pageNo, setPageNo] = useState(1);
  useEffect(() => {
    setDataList(liveAlerts.slice(0, 12)); // Initially display the first 6 elements
  }, [liveAlerts]);

  const handleScroll = () => {
    if (!containerRef.current) return; // Ensure containerRef.current exists
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const bottomOffset = scrollHeight - (scrollTop + clientHeight);
    if (bottomOffset < 50) {
      // If scrolled to the bottom
      const nextBatch = liveAlerts.slice(dataList.length, dataList.length + 6); // Fetch the next 6 elements
      setDataList((prevData: any) => [...prevData, ...nextBatch]); // Append to the existing data
    }
    if (
      // dataList[dataList.length - 1]?.deviceId ===
      //   liveAlerts[liveAlerts.length - 1]?.deviceId &&
      // loading !== true
      bottomOffset < 5 &&
      dataList.length == liveAlerts.length &&
      loading !== true &&
      liveAlertsData.lastPage > 1
    ) {
      setLoading(true); // Set loading to true before making API call
      const url = `company/alert-events?pageNo=${pageNo + 1}`;
      getAll({ url: url }).then((data: any) => {
        // Set loading to false when API call completes
        // console.log("api call --- >", data);

        if (data !== undefined) {
          if (data.success) {
            setPageNo((prevPageNo) => prevPageNo + 1);
            // console.log("length --- >", data.data.allAlertEvents.length);
            const temp = [...liveAlerts, ...data.data.allAlertEvents];
            // console.log("temp", temp);
            setLoading(false);
            dispatch(setLiveAlerts(temp));

            // // Scroll to the top of the table
            // if (containerRef.current) {
            //   containerRef.current.scrollTop = 0;
            // }
            // For scroll on top
            // if (containerRef.current) {
            //   (containerRef.current as HTMLElement).scrollTop = 0;
            // }

            if (containerRef.current) {
              const containerHeight = (containerRef.current as HTMLElement)
                .clientHeight;
              const tableHeight = (containerRef.current as HTMLElement)
                .scrollHeight;
              const middlePosition = (tableHeight - containerHeight) / 2;

              (containerRef.current as HTMLElement).scrollTop = middlePosition;
            }
          }
          if (!data.success) {
            setLoading(false);
          }
        }
      });
      // console.log("pageNo", pageNo);
    }
  };

  useEffect(() => {
    let intervalId: any; // Declare variable to store interval ID

    // Function to fetch data and dispatch actions
    const fetchDataAndDispatch = () => {
      getAll({ url: "company/alert-events?pageNo=1" }).then((data: any) => {
        // console.log("api call --- >", data);

        if (data == undefined) {
          dispatch(setLiveAlerts([]));
          dispatch(setLiveAlertsData(null));
        } else {
          if (data.success) {
            setPageNo(1);
            // console.log("length --- >", data.data.allAlertEvents.length);
            dispatch(setLiveAlerts(data.data.allAlertEvents));
            dispatch(setLiveAlertsData(data.data));
            setDataList(liveAlerts.slice(0, 12));
            if (containerRef.current) {
              (containerRef.current as HTMLElement).scrollTop = 0;
            }
          } else {
            dispatch(setLiveAlerts([]));
            dispatch(setLiveAlertsData(null));
          }
        }
      });
    };

    // console.log("Setting up interval...");
    intervalId = setInterval(() => {
      // console.log("Interval Called");
      // console.log("LiveAlerts in interval");
      fetchDataAndDispatch(); // Call function to fetch data and dispatch actions
    }, 15000);

    // Cleanup function to clear interval when component unmounts or when loading becomes true
    return () => {
      // console.log("Clearing interval...");
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array to run the effect only once after mounting

  const [searchValue, setSearchValue] = useState("");

  return (
    <Card className="invoice-card">
      <div
        style={{
          backgroundColor: "#63d5be",
          height: "40px",
          fontSize: "18px",
          padding: "10px",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          fontWeight: "bold",
        }}
      >
        <div>
          Live Alerts (
          {liveAlertsData == null
            ? 0
            : liveAlerts.length < 15
            ? liveAlerts.length
            : liveAlertsData.lastPage > 1
            ? liveAlerts.length + (liveAlertsData.lastPage - 1) * 30
            : liveAlerts.length}
          )
        </div>
      </div>

      <CardBody className="transaction-card">
        <Row>
          <FormGroup className="col-md-12 create-group">
            <P>Search Vehicles</P>
            <input
              className="form-control"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              placeholder="Search Vehicles"
            />
          </FormGroup>
        </Row>
        <div
          ref={containerRef}
          className="table-responsive theme-scrollbar recent-wrapper"
          style={{
            overflowY: "scroll",
            maxHeight: "calc(66vh - 20px)", // Subtract scrollbar width from max height
            WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
            scrollbarWidth: "thin", // Specify scrollbar width
            WebkitBorderRadius: "5px !important", // For WebKit browsers (Chrome, Safari)
            MozBorderRadius: "5px !important", // For Mozilla Firefox
            borderRadius: "5px !important", // For other browsers
            scrollbarColor: "lightgray transparent", // Specify scrollbar color
          }}
          onScroll={handleScroll}
        >
          <Table className="display order-wrapper" id="recent-order">
            <thead>
              <tr>
                {tableHeader.map((data, index) => (
                  <th key={index} style={{ width: "20%" }}>
                    {data}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 ? (
                dataList
                  .filter((data: any) =>
                    data?.deviceName
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  )
                  .map((data: any, index: any) => (
                    <tr
                      key={index}
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={async () => {
                        if (data.preInfo == null) {
                          if (assignLoading) {
                            Swal.fire({
                              text: "Loading....",
                              icon: "info",
                              showConfirmButton: false,
                              allowOutsideClick: false, // Prevent closing by clicking outside the modal
                            });
                          }
                          const serverInfo = serverCredentials(data.server._id);
                          // console.log("serverInfo", serverInfo);

                          const assignEvent = {
                            eventId: data?.eventId,
                            deviceId: data?.deviceId,
                            deviceName: data?.deviceName,
                            latitude: data.latitude,
                            longitude: data.longitude,
                            speed: data.speed,
                            type: data.type,
                            message: data.message,
                            time: data.time,
                            course: data.course,
                            serverId: serverInfo?.serverId,
                            serverHashKey: serverInfo?.serverHashKey,
                          };
                          // console.log(assignEvent);
                          try {
                            // console.log("liveAlerts[index]: ", liveAlerts[index]);

                            await create(assignEvent, {
                              url: "company/assign-alert-event-to-me",
                            }).then((dataa: any) => {
                              if (
                                !dataa.success &&
                                dataa.message === "ERROR_INTERNET_DISCONNECTED"
                              ) {
                                setAssignLoading(false);
                              }
                              if (dataa.success == false) {
                                Swal.fire({
                                  text: `${dataa.message}`,
                                  icon: "error",
                                  timer: 2000,
                                  showConfirmButton: false,
                                });
                                console.log("Failed");
                                console.log("Data : ", dataa);

                                setAssignLoading(false);
                              }

                              if (dataa.success) {
                                setAssignLoading(false);
                                var updatedAlerts = [...liveAlerts]; // Create a shallow copy of the liveAlerts array
                                updatedAlerts.splice(index, 1); // Remove the item at the specified index

                                setDataList(
                                  updatedAlerts.slice(0, dataList.length)
                                );
                                // console.log("updatedAlerts", updatedAlerts);
                                // console.log("dataList", dataList);
                                dispatch(setLiveAlerts(updatedAlerts)); // Dispatch the action with the updated array
                                // console.log(dataa);
                                Swal.fire({
                                  text: "Assigned Successfully",
                                  icon: "success",
                                  timer: 1000,
                                  showConfirmButton: false,
                                });
                                getAll({
                                  url: "company/get-all-assigned-events",
                                }).then((data: any) => {
                                  // console.log("assigned --- >", data);
                                  // setLoading(false);
                                  if (data != undefined) {
                                    if (data.success) {
                                      // console.log("length --- >", data.data.length);
                                      dispatch(setAssignedAlerts(data.data));
                                      setAssignLoading(true);
                                    }
                                  }
                                });
                              }
                            });
                            // Handle successful post creation (e.g., show a success message, redirect, etc.)
                          } catch (error: any) {
                            // Handle error (e.g., show an error message)
                            // console.error("Error creating post:", error);
                          }
                        } else {
                          Swal.fire({
                            title: "Pre Info is already added",
                            icon: "warning",
                            showCancelButton: false,

                            html: `<div>User : <span style="font-weight:bold">
                            ${data.preInfo.addedByUser.fullName}
                            </span><br>
                            Message : <span style="font-weight:bold">
                            ${data.preInfo.preInfoMessage}
                            </span>
                            </div>`,
                            showCloseButton: true,
                            showConfirmButton: true,
                            confirmButtonText: "Assign",
                            showDenyButton: true,
                            denyButtonText: "Complete",
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              // Handle Assigned button click
                              // Your code here

                              if (assignLoading) {
                                Swal.fire({
                                  text: "Loading....",
                                  icon: "info",
                                  showConfirmButton: false,
                                  allowOutsideClick: false, // Prevent closing by clicking outside the modal
                                });
                              }
                              const serverInfo = serverCredentials(
                                data.server._id
                              );
                              // console.log("serverInfo", serverInfo);

                              const assignEvent = {
                                eventId: data?.eventId,
                                deviceId: data?.deviceId,
                                deviceName: data?.deviceName,
                                latitude: data.latitude,
                                longitude: data.longitude,
                                speed: data.speed,
                                type: data.type,
                                message: data.message,
                                time: data.time,
                                serverId: serverInfo?.serverId,
                                serverHashKey: serverInfo?.serverHashKey,
                              };
                              console.log(assignEvent);
                              try {
                                // console.log("liveAlerts[index]: ", liveAlerts[index]);

                                await create(assignEvent, {
                                  url: "company/assign-alert-event-to-me",
                                }).then((dataa: any) => {
                                  if (
                                    !dataa.success &&
                                    dataa.message ==
                                      "ERROR_INTERNET_DISCONNECTED"
                                  ) {
                                    setAssignLoading(false);
                                  }
                                  if (!dataa.success) {
                                    Swal.fire({
                                      text: `${dataa.message}`,
                                      icon: "error",
                                      timer: 2000,
                                      showConfirmButton: false,
                                    });
                                    setAssignLoading(false);
                                  }

                                  if (dataa.success) {
                                    setAssignLoading(false);
                                    var updatedAlerts = [...liveAlerts]; // Create a shallow copy of the liveAlerts array
                                    updatedAlerts.splice(index, 1); // Remove the item at the specified index

                                    setDataList(
                                      updatedAlerts.slice(0, dataList.length)
                                    );
                                    // console.log("updatedAlerts", updatedAlerts);
                                    // console.log("dataList", dataList);
                                    dispatch(setLiveAlerts(updatedAlerts)); // Dispatch the action with the updated array
                                    // console.log(dataa);
                                    Swal.fire({
                                      text: "Assigned Successfully",
                                      icon: "success",
                                      timer: 1000,
                                      showConfirmButton: false,
                                    });
                                    getAll({
                                      url: "company/get-all-assigned-events",
                                    }).then((data: any) => {
                                      // console.log("assigned --- >", data);
                                      // setLoading(false);
                                      if (data != undefined) {
                                        if (data.success) {
                                          setAssignLoading(true);
                                          // console.log("length --- >", data.data.length);
                                          dispatch(
                                            setAssignedAlerts(data.data)
                                          );
                                        }
                                      }
                                    });
                                  }
                                });
                                // Handle successful post creation (e.g., show a success message, redirect, etc.)
                              } catch (error: any) {
                                // Handle error (e.g., show an error message)
                                // console.error("Error creating post:", error);
                              }
                            } else if (result.isDenied) {
                              // Handle Completed button click
                              // Your code here
                              Swal.fire({
                                text: "Loading....",
                                icon: "info",
                                showConfirmButton: false,
                                allowOutsideClick: false, // Prevent closing by clicking outside the modal
                              });

                              const serverInfo = serverCredentials(
                                data.server._id
                              );
                              // console.log("serverInfo", serverInfo);

                              const assignEvent = {
                                eventId: data?.eventId,
                                deviceId: data?.deviceId,
                                deviceName: data?.deviceName,
                                latitude: data.latitude,
                                longitude: data.longitude,
                                speed: data.speed,
                                type: data.type,
                                message: data.message,
                                time: data.time,
                                serverId: serverInfo?.serverId,
                                serverHashKey: serverInfo?.serverHashKey,
                              };
                              // console.log(assignEvent);
                              try {
                                // console.log("liveAlerts[index]: ", liveAlerts[index]);

                                await create(assignEvent, {
                                  url: "company/assign-alert-event-to-me",
                                }).then(async (dataa: any) => {
                                  if (
                                    !dataa.success &&
                                    dataa.message ==
                                      "ERROR_INTERNET_DISCONNECTED"
                                  ) {
                                    setAssignLoading(false);
                                  }
                                  if (!dataa.success) {
                                    Swal.fire({
                                      text: `${dataa.message}`,
                                      icon: "error",
                                      timer: 2000,
                                      showConfirmButton: false,
                                    });
                                    setAssignLoading(false);
                                  }

                                  if (dataa.success) {
                                    setAssignLoading(false);
                                    var updatedAlerts = [...liveAlerts]; // Create a shallow copy of the liveAlerts array
                                    updatedAlerts.splice(index, 1); // Remove the item at the specified index

                                    setDataList(
                                      updatedAlerts.slice(0, dataList.length)
                                    );
                                    // console.log("updatedAlerts", updatedAlerts);
                                    // console.log("dataList", dataList);
                                    dispatch(setLiveAlerts(updatedAlerts)); // Dispatch the action with the updated array
                                    // console.log(dataa);

                                    const completedResponse = {
                                      alertEventId: dataa.data._id,
                                      completionResponse:
                                        data.preInfo.preInfoMessage,
                                      alertEventCloseDate:
                                        new Date().toISOString(),
                                    };
                                    // console.log(completedResponse);
                                    try {
                                      await create(completedResponse, {
                                        url: "alert-events/complete-an-alert-event",
                                      }).then((data: any) => {
                                        if (
                                          !data.success &&
                                          data.message ==
                                            "ERROR_INTERNET_DISCONNECTED"
                                        ) {
                                          setLoading(false);
                                        }
                                        if (!data.success) {
                                          Swal.fire({
                                            text: `${data.message}`,
                                            icon: "error",
                                            timer: 2000,
                                            showConfirmButton: false,
                                          });
                                          setLoading(false);
                                        }
                                        if (data.success) {
                                          // console.log(data);
                                          setLoading(false);
                                          Swal.fire({
                                            text: "Alert Completed Successfully",
                                            icon: "success",
                                            timer: 1000,
                                            showConfirmButton: false,
                                          });

                                          getAll({
                                            url: "company/get-all-assigned-events",
                                          }).then((data: any) => {
                                            // console.log("assigned --- >", data);
                                            // setLoading(false);
                                            if (data !== undefined) {
                                              if (data.success) {
                                                // console.log("length --- >", data.data.length);
                                                dispatch(
                                                  setAssignedAlerts(data.data)
                                                );
                                              }
                                              if (data.statusCode === 404) {
                                                dispatch(setAssignedAlerts([]));
                                              }
                                            }
                                          });
                                          getAll({
                                            url: "company/get-all-completed-events",
                                          }).then((data: any) => {
                                            // console.log("assigned --- >", data);
                                            // setLoading(false);
                                            if (data !== undefined) {
                                              if (data.success) {
                                                // console.log("length --- >", data.data.length);
                                                dispatch(
                                                  setCompletedAlerts(data.data)
                                                );
                                              }
                                            }
                                          });
                                        }
                                      });
                                      // Handle successful post creation (e.g., show a success message, redirect, etc.)
                                    } catch (error: any) {
                                      // Handle error (e.g., show an error message)
                                      // console.error("Error creating post:", error);
                                      setLoading(false);
                                    }
                                  }
                                });
                                // Handle successful post creation (e.g., show a success message, redirect, etc.)
                              } catch (error: any) {
                                // Handle error (e.g., show an error message)
                                // console.error("Error creating post:", error);
                              }
                            }
                          });
                        }
                      }}
                    >
                      {/* <td>{data.id}</td> */}
                      <td style={{ width: "20%" }}>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <H5>{data?.deviceName}</H5>
                            <div style={{ fontSize: "10px" }}>
                              {data.time.slice(0, 10)}
                            </div>

                            <div style={{ fontSize: "10px" }}>
                              {data.time.slice(11)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`txt-primary`} style={{ width: "20%" }}>
                        {data.name}
                      </td>
                      <td style={{ width: "20%" }}>{data.type}</td>
                      <td style={{ width: "20%" }}>{data.message}</td>
                      <td id="addressLiveAlerts" style={{ width: "20%" }}>
                        {data.address == null
                          ? "N/A"
                          : data.address.length > 10
                          ? data.address.substring(0, 10) + "..."
                          : data.address}
                      </td>
                      {data.address != null && (
                        <UncontrolledPopover
                          placement="top"
                          trigger="hover"
                          target="addressLiveAlerts"
                        >
                          <PopoverHeader>Address</PopoverHeader>
                          <PopoverBody>{data.address}</PopoverBody>
                        </UncontrolledPopover>
                      )}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ fontSize: "25px" }}>
                    No Live Alerts Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {loading && (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <Loader />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default LiveAlerts;
