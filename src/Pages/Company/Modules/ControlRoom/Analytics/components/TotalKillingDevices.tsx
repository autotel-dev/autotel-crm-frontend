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
} from "reactstrap";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { H3, H4, P } from "../../../../../../AbstractElements";
import SendCommand from "./SendCommand";
import { getAll } from "../../../../../../Api";
import { setKilledDevices } from "../../../../../../ReaduxToolkit/Reducer/AlertsSlice";
import Loader from "../../../../../Loader/Loader";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  fromDate: any;
  toDate: any;
}

const TotalKillingDevices: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  fromDate,
  toDate,
}) => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var allAlertsPreview = userPermissions.find(
    (item: any) => item.title === "All Alerts Preview"
  );
  const { killedDevices } = useSelector((state: any) => state.alerts);
  const { devices } = useSelector((state: any) => state.monitoring);
  const [isUpdateModalOpenForSendCommand, setIsUpdateModalOpenForSendCommand] =
    useState(false);

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
  // useEffect(() => {
  //   if (killedDevices.length !== 0) {
  //     setDataList(
  //       killedDevices.slice(0, 12).map((device: any) => ({
  //         ...device,
  //         remainingTime: calculateRemainingTime(
  //           new Date(device.updatedAt).toLocaleString()
  //         ),
  //       }))
  //     );
  //   }
  // }, [killedDevices]);

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
          remainingTime: calculateRemainingTime(
            new Date(device.createdAt).toLocaleString()
          ),
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
          remainingTime: calculateRemainingTime(
            new Date(device.createdAt).toLocaleString()
          ),
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
            remainingTime: calculateRemainingTime(
              new Date(device.updatedAt).toLocaleString()
            ),
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

  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={() => {
        setIsVisible(!isVisible);
      }}
      size="xl"
      onClosed={() => {
        // setValue("")
        setIsVisible(false);
      }}
    >
      <div className="modal-header">
        <H3 className="modal-title">Total Killed Devices</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
          }}
        ></Button>
      </div>
      <ModalBody>
        <Card className="invoice-card">
          <CardBody className="transaction-card">
            {allAlertsPreview !== undefined && allAlertsPreview?.read ? (
              <div>
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
                      height: "40px",
                      textAlign: "center",
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                  >
                    <NavLink
                      className={` ${basicTab === "1" ? "active" : ""}`}
                      style={{
                        color: `${basicTab === "1" ? "#63d5be" : "white"}`,
                      }}
                      onClick={() => {
                        setBasicTab("1");
                        setLoading(true);
                        getAll({
                          url: "control-room/get-all-killed-devices?type=self",
                        }).then((data: any) => {
                          // // // console.log("api call --- >", data);

                          if (data !== undefined) {
                            if (data.success) {
                              setLoading(false);
                              // // // console.log("length --- >", data.data);
                              dispatch(setKilledDevices(data.data));
                            }
                            if (!data.success) {
                              setLoading(false);
                              // // // // console.log("length --- >", data.data);
                              dispatch(setKilledDevices([]));
                            }
                          }
                        });
                      }}
                    >
                      Self
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
                        color: `${basicTab === "2" ? "#63d5be" : "white"}`,
                      }}
                      onClick={() => {
                        setBasicTab("2");
                        setLoading(true);
                        getAll({
                          url: "control-room/get-all-killed-devices?type=self",
                        }).then((data: any) => {
                          // // // console.log("api call --- >", data);

                          if (data !== undefined) {
                            if (data.success) {
                              setLoading(false);
                              // // // console.log("length --- >", data.data);
                              dispatch(setKilledDevices(data.data));
                            }
                            if (!data.success) {
                              setLoading(false);
                              // // // // console.log("length --- >", data.data);
                              dispatch(setKilledDevices([]));
                            }
                          }
                        });
                      }}
                    >
                      All
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={basicTab}>
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
                    <div style={{ marginTop: "20px" }}>
                      <Row>
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
                        <div className="table-responsive theme-scrollbar recent-wrapper">
                          <Table
                            className="display order-wrapper"
                            id="recent-order"
                          >
                            <thead>
                              <tr>
                                {tableHeader.map((data, index) => (
                                  <th
                                    key={index}
                                    style={{
                                      width:
                                        data === "Last Packet" ||
                                        data === "Killed Time"
                                          ? "10%"
                                          : "8%",
                                    }}
                                  >
                                    {data}
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
                                      style={{ cursor: "pointer" }}
                                      key={index}
                                    >
                                      <td style={{ width: "8%" }}>
                                        {data.deviceId}
                                      </td>
                                      <td style={{ width: "8%" }}>
                                        {data.deviceName}
                                      </td>

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
                                                  new Date(
                                                    data?.lastPacketTimeStamp *
                                                      1000
                                                  ).toISOString()
                                                ).toLocaleString(),
                                                "date"
                                              )}
                                            </div>
                                            <div style={{ fontSize: "10px" }}>
                                              {/* {data.updatedAt.toString().slice(11, 19)} */}
                                              {format(
                                                new Date(
                                                  new Date(
                                                    data?.lastPacketTimeStamp *
                                                      1000
                                                  ).toISOString()
                                                ).toLocaleString(),
                                                "time"
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td style={{ width: "8%" }}>
                                        {data.latitude}
                                      </td>
                                      <td style={{ width: "8%" }}>
                                        {data.longitude}
                                      </td>
                                      <td style={{ width: "8%" }}>
                                        {data.address == undefined ||
                                        data.address === "" ||
                                        data.address == null
                                          ? "N/A"
                                          : data.address}
                                      </td>
                                      <td style={{ width: "10%" }}>
                                        {data.server.companyName}
                                      </td>
                                      <td style={{ width: "8%" }}>
                                        <div className="d-flex">
                                          <div className="flex-grow-1 ms-2">
                                            <div style={{ fontSize: "10px" }}>
                                              {format(
                                                new Date(
                                                  data?.createdAt
                                                ).toLocaleString(),
                                                "date"
                                              )}
                                            </div>
                                            <div style={{ fontSize: "10px" }}>
                                              {/* {data.updatedAt.toString().slice(11, 19)} */}
                                              {format(
                                                new Date(
                                                  data?.createdAt
                                                ).toLocaleString(),
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
                                            color: data.isKilled
                                              ? "red"
                                              : "green",
                                            borderRadius: "5px",
                                          }}
                                        >
                                          {data.isKilled
                                            ? "Killed"
                                            : "Released"}
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
                                              setDeviceData(data.deviceData);
                                              setIsUpdateModalOpenForSendCommand(
                                                true
                                              );
                                            }}
                                          >
                                            Release
                                          </button>
                                        </div>
                                      </td>
                                      <SendCommand
                                        addModal={
                                          isUpdateModalOpenForSendCommand
                                        }
                                        setAddModal={
                                          setIsUpdateModalOpenForSendCommand
                                        }
                                        dropDownDevices={devices}
                                        prevItem={deviceData}
                                        fromDate={fromDate}
                                        toDate={toDate}
                                      />
                                    </tr>
                                  ))
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  )}
                </TabContent>
              </div>
            ) : loading ? (
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
              <div style={{ marginTop: "20px" }}>
                <Row>
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
                  <div className="table-responsive theme-scrollbar recent-wrapper">
                    <Table className="display order-wrapper" id="recent-order">
                      <thead>
                        <tr>
                          {tableHeader.map((data, index) => (
                            <th
                              key={index}
                              style={{
                                width:
                                  data === "Last Packet" ||
                                  data === "Killed Time"
                                    ? "10%"
                                    : "8%",
                              }}
                            >
                              {data}
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
                          dataList.map((data: any, index: any) => (
                            <tr style={{ cursor: "pointer" }} key={index}>
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
                                          new Date(
                                            data?.lastPacketTimeStamp * 1000
                                          ).toISOString()
                                        ).toLocaleString(),
                                        "date"
                                      )}
                                    </div>
                                    <div style={{ fontSize: "10px" }}>
                                      {/* {data.updatedAt.toString().slice(11, 19)} */}
                                      {format(
                                        new Date(
                                          new Date(
                                            data?.lastPacketTimeStamp * 1000
                                          ).toISOString()
                                        ).toLocaleString(),
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
                                {data.server.companyName}
                              </td>
                              <td style={{ width: "8%" }}>
                                <div className="d-flex">
                                  <div className="flex-grow-1 ms-2">
                                    <div style={{ fontSize: "10px" }}>
                                      {format(
                                        new Date(
                                          data?.createdAt
                                        ).toLocaleString(),
                                        "date"
                                      )}
                                    </div>
                                    <div style={{ fontSize: "10px" }}>
                                      {/* {data.updatedAt.toString().slice(11, 19)} */}
                                      {format(
                                        new Date(
                                          data?.createdAt
                                        ).toLocaleString(),
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
                                      setDeviceData(data.deviceData);
                                      setIsUpdateModalOpenForSendCommand(true);
                                    }}
                                  >
                                    Release
                                  </button>
                                </div>
                              </td>
                              <SendCommand
                                addModal={isUpdateModalOpenForSendCommand}
                                setAddModal={setIsUpdateModalOpenForSendCommand}
                                dropDownDevices={devices}
                                prevItem={deviceData}
                                fromDate={fromDate}
                                toDate={toDate}
                              />
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
};

export default TotalKillingDevices;
