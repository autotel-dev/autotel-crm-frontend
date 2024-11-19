import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  FormGroup,
  Col,
  CardHeader,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { H3, H4, P } from "../../../AbstractElements";

import { getAll } from "../../../Utilities/api";
import { setKilledDevices } from "../../../ReaduxToolkit/Reducer/AlertsSlice";
import Loader from "../../Utilities/Loader/Loader";
import SendCommand from "../../Company/Modules/ControlRoom/Analytics/components/SendCommand";
import Swal from "sweetalert2";

interface PropsTypes {
  fromDate: any;
  toDate: any;
}

const KilledVehicles: React.FC<PropsTypes> = ({ fromDate, toDate }) => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var allAlertsPreview = userPermissions.find(
    (item: any) => item.title === "All Alerts Preview"
  );
  const { killedDevices, liveAlertsData } = useSelector(
    (state: any) => state.alerts
  );
  const { devices } = useSelector((state: any) => state.monitoring);
  const [isUpdateModalOpenForSendCommand, setIsUpdateModalOpenForSendCommand] =
    useState(false);
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

  const [dataList, setDataList]: any = useState([...killedDevices]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const tableHeader = [
    "Device ID",
    "Device Name",
    "Status",
    "Last Packet",
    "Latitude",
    "Longitude",
    "Address",
    "Server",
    "Sent Command Time",
    "Is Killed",
    "Count Down",
    "Action",
  ];
  const containerRef = useRef(null);

  const [deviceData, setDeviceData] = useState("");
  useEffect(() => {
    if (killedDevices.length !== 0) {
      const updatedDataList = killedDevices.slice(0, 12).map((device: any) => {
        const matchedDevice = devices.find((item: any) =>
          item.items.some((subItem: any) => subItem.id === device.deviceId)
        );
        const deviceData = matchedDevice
          ? matchedDevice.items.find((item: any) => item.id === device.deviceId)
          : null;
        return {
          ...device,
          remainingTime: calculateRemainingTime(device.createdAt),
          deviceData: deviceData ? { ...deviceData } : null,
        };
      });

      setDataList(updatedDataList);
      // // // console.log("dataList", dataList);
    }
  }, [killedDevices, devices]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataList((prevDataList: any) =>
        prevDataList.map((device: any) => ({
          ...device,
          remainingTime: calculateRemainingTime(device.createdAt),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateRemainingTime = (timestamp: string): string => {
    // Convert the timestamp to a Date object
    const targetDate = new Date(timestamp);

    // Get the current time
    const currentTime = new Date();

    // Calculate the difference in milliseconds
    const difference = currentTime.getTime() - targetDate.getTime();

    // Convert the difference to seconds
    const remainingSeconds = Math.floor(difference / 1000);

    // Check if the remaining time is negative (i.e., the target time has already passed)
    if (remainingSeconds <= 0) return "00:00:00";

    // Calculate the remaining hours, minutes, and seconds
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    // Format the remaining time as a string
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const bottomOffset = scrollHeight - (scrollTop + clientHeight);
    if (bottomOffset < 50) {
      const nextBatch = killedDevices
        .slice(dataList.length, dataList.length + 6)
        .map((device: any) => {
          const matchedDevice = devices.find((item: any) =>
            item.items.some((subItem: any) => subItem.id === device.deviceId)
          );
          const deviceData = matchedDevice
            ? matchedDevice.items.find(
                (item: any) => item.id === device.deviceId
              )
            : null;
          return {
            ...device,
            remainingTime: calculateRemainingTime(device.createdAt),
            deviceData: deviceData ? { ...deviceData } : null,
          };
        });

      setDataList((prevData: any) => [...prevData, ...nextBatch]);
      // // // console.log("dataList", dataList);

      // const nextBatch = killedDevices
      //   .slice(dataList.length, dataList.length + 6)
      //   .map((device: any) => ({
      //     ...device,
      //     // remainingTime: calculateRemainingTime(device.lastPacketTimeStamp),
      //     remainingTime: calculateRemainingTime(
      //       new Date(device.updatedAt).toLocaleString()
      //     ),
      //   }));
      // setDataList((prevData: any) => [...prevData, ...nextBatch]);
    }
  };
  const format = (dateInput: string, type: string) => {
    const new_date = new Date(dateInput);
    // Extract the date components
    const year = new_date.getFullYear();
    const month = new_date.getMonth() + 1; // Month is zero-based, so add 1
    const day = new_date.getDate();

    // Get the hours, minutes, and seconds
    let hours = new_date.getHours();
    const minutes = new_date.getMinutes();
    const seconds = new_date.getSeconds();

    // Convert AM to PM and PM to AM
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 hours to 12

    // Combine the date components and time into the desired format
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${amPm}`;

    if (type === "date") {
      return formattedDate;
    } else if (type === "time") {
      return formattedTime;
    }
  };
  const [basicTab, setBasicTab] = useState("1");
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");

  return (
    <Col xl="12">
      <Card className="invoice-card">
        <CardBody className="transaction-card">
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "50vh",
                backgroundColor: "white",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Loader />
              </div>
            </div>
          ) : (
            <div>
              <CardHeader
                className="pb-0"
                style={{
                  padding: "0px",
                }}
              >
                <div className="header-top">
                  <H4 className="m-0">
                    Killed Vehicles ({killedDevices.length})
                  </H4>
                </div>
              </CardHeader>
              <Row style={{ marginTop: "20px" }}>
                <FormGroup className="col-md-12 create-group">
                  <P>Search Vehicles</P>
                  <input
                    className="form-control"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    type="text"
                    placeholder="Search Killed Vehicles"
                  />
                </FormGroup>
              </Row>
              <div
                ref={containerRef}
                className="table-responsive theme-scrollbar recent-wrapper"
                style={{
                  overflowY: "scroll",
                  maxHeight: "calc(45vh - 20px)", // Subtract scrollbar width from max height
                  WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
                  scrollbarWidth: "thin", // Specify scrollbar width
                  WebkitBorderRadius: "5px", // For WebKit browsers (Chrome, Safari)
                  MozBorderRadius: "5px", // For Mozilla Firefox
                  borderRadius: "5px", // For other browsers
                  scrollbarColor: "lightgray transparent", // Specify scrollbar color
                }}
                onScroll={handleScroll}
              >
                <div className="table-responsive theme-scrollbar recent-wrapper">
                  <Table className="display order-wrapper" id="recent-order">
                    <thead>
                      <tr>
                        {tableHeader.map((data, index) => (
                          <th
                            key={index}
                            style={{
                              width:
                                data === "Last Packet" || data === "Killed Time"
                                  ? "10%"
                                  : "8%",
                            }}
                          >
                            {data == "Count Down" ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span>{data}</span>
                                <span>(HH:MM:SS)</span>
                              </div>
                            ) : (
                              data
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataList.length === 0 ? (
                        <tr>
                          <td colSpan={11} style={{ fontSize: "25px" }}>
                            No Devices Found
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
                              <td style={{ width: "8%" }}>{data.deviceId}</td>
                              <td style={{ width: "8%" }}>{data.deviceName}</td>

                              <td style={{ width: "8%" }}>
                                <div
                                  style={{
                                    padding: "5px",
                                    backgroundColor:
                                      data.onlineStatus === "ack"
                                        ? "rgba(255, 0, 0, 0.1)"
                                        : data.onlineStatus === "engine"
                                        ? "rgba(255, 165, 0, 0.1)"
                                        : data.onlineStatus === "online"
                                        ? "rgba(0, 255, 0, 0.1)"
                                        : "rgba(0, 0, 0, 0.1)",
                                    color:
                                      data.onlineStatus === "ack"
                                        ? "red"
                                        : data.onlineStatus === "engine"
                                        ? "orange"
                                        : data.onlineStatus === "online"
                                        ? "green"
                                        : "black",
                                    borderRadius: "5px",
                                  }}
                                >
                                  {data.onlineStatus === "ack"
                                    ? "Stop"
                                    : data.onlineStatus === "engine"
                                    ? "Idle"
                                    : data.onlineStatus === "online"
                                    ? "Moving"
                                    : "Offline"}
                                </div>
                              </td>
                              <td style={{ width: "10%" }}>
                                <div className="d-flex">
                                  <div className="flex-grow-1 ms-2">
                                    <div style={{ fontSize: "10px" }}>
                                      {format(
                                        new Date(
                                          data?.lastPacketTimeStamp * 1000
                                        ).toISOString(),
                                        "date"
                                      )}
                                    </div>
                                    <div style={{ fontSize: "10px" }}>
                                      {/* {data.updatedAt.toString().slice(11, 19)} */}
                                      {format(
                                        new Date(
                                          data?.lastPacketTimeStamp * 1000
                                        ).toISOString(),
                                        "time"
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ width: "8%" }}>{data.latitude}</td>
                              <td style={{ width: "8%" }}>{data.longitude}</td>
                              <td style={{ width: "8%" }}>
                                {data.address == undefined ||
                                data.address === "" ||
                                data.address == null
                                  ? "N/A"
                                  : data.address}
                              </td>
                              <td style={{ width: "10%" }}>
                                {data?.server?.companyName}
                              </td>
                              <td style={{ width: "8%" }}>
                                <div className="d-flex">
                                  <div className="flex-grow-1 ms-2">
                                    <div style={{ fontSize: "10px" }}>
                                      {format(
                                        new Date(data?.createdAt).toISOString(),
                                        "date"
                                      )}
                                    </div>
                                    <div style={{ fontSize: "10px" }}>
                                      {/* {data.updatedAt.toString().slice(11, 19)} */}
                                      {format(
                                        new Date(data?.createdAt).toISOString(),
                                        "time"
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ width: "8%" }}>
                                <div
                                  style={{
                                    padding: "5px",
                                    backgroundColor: data.isKilled
                                      ? "rgba(255, 0, 0, 0.1)"
                                      : "rgba(0, 255, 0, 0.1)",
                                    color: data.isKilled ? "red" : "green",
                                    borderRadius: "5px",
                                  }}
                                >
                                  {data.isKilled ? "Killed" : "Released"}
                                </div>
                              </td>
                              <td
                                className="micro-5-charted-regular"
                                style={{ width: "8%" }}
                              >
                                {data?.remainingTime}
                              </td>
                              <td style={{ width: "8%" }}>
                                <div>
                                  <button
                                    className="btn-primary"
                                    style={{
                                      borderRadius: "5px",
                                      padding: "5px 15px",
                                      color: "white",
                                      outline: "none",
                                      border: "none",
                                      marginTop: "10px",
                                    }}
                                    onClick={() => {
                                      var checkServer =
                                        liveAlertsData?.connectedServers?.find(
                                          (item: any) =>
                                            item.server._id === data.server._id
                                        );
                                      if (checkServer?.isConnected) {
                                        setDeviceData(data.deviceData);
                                        setIsUpdateModalOpenForSendCommand(
                                          true
                                        );
                                      } else {
                                        Swal.fire({
                                          title: `${checkServer?.server?.companyName}`,
                                          text: `You cannot relase this device because the Server Credentaisl that attached with it  are wrong`,
                                          icon: "error",
                                          // timer: 2000,
                                          showConfirmButton: true,
                                        });
                                      }
                                    }}
                                    disabled={devices.length == 0}
                                    id="releaseButtonWaitForDevices"
                                  >
                                    Release
                                  </button>
                                </div>
                              </td>

                              {devices.length == 0 && (
                                <UncontrolledPopover
                                  placement="top"
                                  trigger="hover"
                                  target="releaseButtonWaitForDevices"
                                >
                                  <PopoverHeader>Reason</PopoverHeader>
                                  <PopoverBody>
                                    Please wait a while because devices are
                                    loading in background
                                  </PopoverBody>
                                </UncontrolledPopover>
                              )}
                            </tr>
                          ))
                      )}
                    </tbody>
                    <SendCommand
                      addModal={isUpdateModalOpenForSendCommand}
                      setAddModal={setIsUpdateModalOpenForSendCommand}
                      dropDownDevices={devices}
                      prevItem={deviceData}
                      fromDate={fromDate}
                      toDate={toDate}
                    />
                  </Table>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default KilledVehicles;
