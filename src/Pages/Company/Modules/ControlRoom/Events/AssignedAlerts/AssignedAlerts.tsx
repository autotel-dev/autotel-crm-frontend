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
import AssignedAlertModal from "./AssignedAlertModal";
import { useDispatch, useSelector } from "react-redux";
import { create } from "../../../../../../Utilities/api";
import { serverCredentials } from "../../../../../../Utilities/headers/header";
import { setModalData } from "../../../../../../ReaduxToolkit/Reducer/AlertsSlice";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import { GET_ALERT_EVENT_BY_ID } from "../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../Utilities/constants/constants";

const AssignedAlerts = () => {
  const dispatch = useDispatch();
  const { assignedAlerts, liveAlertsData } = useSelector(
    (state: any) => state.alerts
  );
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var allAlertsPreview = userPermissions.find(
    (item: any) => item.title === "All Alerts Preview"
  );
  // console.log("All Alerts Preview", allAlertsPreview);
  // // console.log("assignedAlertsData", assignedAlerts);
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  function hexToRgb(hex: any) {
    // Remove the hash sign if present
    hex = hex?.replace(/^#/, "");
    // Parse the hex values to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  // Usage
  const hexColor = "#ff0000"; // Example hex color
  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor); // Convert hex to RGB

  const [dataList, setDataList]: any = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const tableHeader = [
    // "ID",
    "Device",
    "Alert",
    "Type",
    "Message",
    "Address",
  ];
  const containerRef = useRef(null);

  useEffect(() => {
    if (assignedAlerts.length > 12) {
      setDataList(assignedAlerts.slice(0, 12)); // Initially display the first 6 elements
    }
  }, [assignedAlerts]);
  useEffect(() => {
    setDataList(assignedAlerts.slice(0, 12)); // Initially display the first 6 elements
  }, [assignedAlerts]);

  const handleScroll = () => {
    if (!containerRef.current) return; // Ensure containerRef.current exists
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const bottomOffset = scrollHeight - (scrollTop + clientHeight);
    if (bottomOffset < 50) {
      // If scrolled to the bottom
      const nextBatch = assignedAlerts.slice(
        dataList.length,
        dataList.length + 6
      ); // Fetch the next 6 elements
      setDataList((prevData: any) => [...prevData, ...nextBatch]); // Append to the existing data
    }
  };

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [basicTab, setBasicTab] = useState("1");
  const [fisrtTime, setFirstTime] = useState(true);

  const [searchValue, setSearchValue] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");

  return (
    <Col xl="12" lg="12">
      <Card>
        <CardBody>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Search Vehicles</P>
              <input
                className="form-control"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                placeholder="Search Assigned Vehicles"
              />
            </FormGroup>
          </Row>

          <div className="table-responsive theme-scrollbar recent-wrapper">
            <Table className="display order-wrapper" id="recent-order">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Alert</th>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Address</th>
                </tr>
              </thead>
            </Table>
            <div
              ref={containerRef}
              className="table-responsive theme-scrollbar recent-wrapper"
              style={{
                overflowY: "scroll",
                overflowX: "auto",
                maxHeight: "calc(66vh - 20px)", // Subtract scrollbar width from max height
                WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
                scrollbarWidth: "thin", // Specify scrollbar width
                WebkitBorderRadius: "5px", // For WebKit browsers (Chrome, Safari)
                MozBorderRadius: "5px", // For Mozilla Firefox
                borderRadius: "5px", // For other browsers
                scrollbarColor: "lightgray transparent", // Specify scrollbar color
              }}
              onScroll={handleScroll}
            >
              <Table className="display order-wrapper" id="recent-order">
                <tbody>
                  {dataList.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ fontSize: "25px" }}>
                        No Assigned Alerts Found
                      </td>
                    </tr>
                  ) : (
                    dataList
                      .filter((data: any) =>
                        data.deviceName
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                      .map((data: any, index: any) => (
                        <tr
                          key={index}
                          onClick={async () => {
                            var checkServer =
                              liveAlertsData?.connectedServers?.find(
                                (item: any) => item.server._id === data.server
                              );
                            // console.log(liveAlertsData?.connectedServers);

                            console.log("server", data.server);

                            // console.log("server", checkServer);
                            if (checkServer && checkServer?.isConnected) {
                              const serverInfo = serverCredentials(data.server);

                              setBasicTab("1");
                              setIsUpdateModalOpen(true);

                              const sendData = {
                                eventId: data._id,
                                serverId: serverInfo?.serverId,
                                serverHashKey: serverInfo?.serverHashKey,
                                deviceId: data.deviceId,
                              };

                              try {
                                await create(sendData, {
                                  url: GET_ALERT_EVENT_BY_ID,
                                }).then((data: any) => {
                                  // // console.log(data);
                                  if (
                                    !data.success &&
                                    data.message === ERROR_MESSAGE
                                  ) {
                                  }
                                  if (!data.success) {
                                    Swal.fire({
                                      text: `${data.message}`,
                                      icon: "error",
                                      timer: 2000,
                                      showConfirmButton: false,
                                    });
                                    setIsUpdateModalOpen(false);
                                  }
                                  if (data.success) {
                                    dispatch(setModalData(data.data));
                                  }
                                });
                                // Handle successful post creation (e.g., show a success message, redirect, etc.)
                              } catch (error: any) {
                                // Handle error (e.g., show an error message)
                                dispatch(setModalData(undefined));
                              }
                            } else if (checkServer == undefined) {
                              Swal.fire({
                                title: `Server Not Found`,
                                text: `This Server is Not provided to You`,
                                icon: "error",
                                // timer: 2000,
                                showConfirmButton: true,
                              });
                            } else {
                              Swal.fire({
                                title: `${checkServer.server.companyName}`,
                                text: `You cannot get the info of this alert because its Server Credentials are wrong`,
                                icon: "error",
                                // timer: 2000,
                                showConfirmButton: true,
                              });
                            }
                          }}
                          onMouseEnter={() => {
                            setIsHovered(true);
                            setIdd(index);
                          }}
                          onMouseLeave={() => setIsHovered(false)}
                          style={{
                            backgroundColor:
                              isHovered && idd == index
                                ? userPersonalizationData == null
                                  ? "#D6EEEE"
                                  : `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`
                                : "transparent",
                            transition: "background-color 0.3s",
                            cursor: "pointer",
                          }}
                        >
                          {/* <td>{data.eventId}</td> */}
                          <td>
                            <div className="d-flex">
                              <div className="flex-grow-1">
                                <h5
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {data.deviceName}
                                </h5>
                                <div style={{ fontSize: "10px" }}>
                                  {new Date(
                                    new Date(data.createdAt).setHours(
                                      new Date(data.createdAt).getHours() + 5
                                    )
                                  )
                                    .toISOString()
                                    .slice(0, 10)}
                                </div>

                                <div style={{ fontSize: "10px" }}>
                                  {(() => {
                                    // Create a new Date object for the original time in UTC
                                    const originalDate = new Date(
                                      data.createdAt
                                    );

                                    // Adjust the time by adding 5 hours
                                    originalDate.setHours(
                                      originalDate.getHours()
                                    );

                                    // Get the hours, minutes, and seconds from the adjusted date
                                    const hours24 = originalDate.getHours(); // Get the hours in 24-hour format
                                    const minutes = originalDate
                                      .getMinutes()
                                      .toString()
                                      .padStart(2, "0"); // Get minutes, ensure 2 digits
                                    const seconds = originalDate
                                      .getSeconds()
                                      .toString()
                                      .padStart(2, "0"); // Get seconds, ensure 2 digits

                                    // Determine AM/PM
                                    const period = hours24 >= 12 ? "PM" : "AM";

                                    // Convert to 12-hour format
                                    const hours12 = hours24 % 12 || 12; // Convert 0 to 12 (midnight), 13-23 to 1-11 PM

                                    // Return the formatted time in 12-hour format with AM/PM
                                    return `${hours12}:${minutes}:${seconds} ${period}`;
                                  })()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={`txt-primary`}>{data.message}</td>
                          <td>{data.type}</td>
                          <td>{data.message}</td>
                          <td id="addressAssignedAlerts">
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
                              target="addressAssignedAlerts"
                            >
                              <PopoverHeader>Address</PopoverHeader>
                              <PopoverBody>{data.address}</PopoverBody>
                            </UncontrolledPopover>
                          )}
                        </tr>
                      ))
                  )}
                </tbody>
              </Table>
              <AssignedAlertModal
                isVisible={isUpdateModalOpen}
                setIsVisible={setIsUpdateModalOpen}
                tab={basicTab}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default AssignedAlerts;
