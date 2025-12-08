import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Modal,
  ModalBody,
  Row,
  Table,
} from "reactstrap";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { H3, H4, H5, P } from "../../../../../../AbstractElements";
import SendCommand from "./SendCommand";
import { create } from "../../../../../../Utilities/api";
import Swal from "sweetalert2";
import { serverCredentials } from "../../../../../../Utilities/headers/header";
import { Select } from "antd";
import { VERIFY_VEHICLE_BLOCK_STATUS } from "../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../Utilities/constants/constants";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
}

const SelfSendCommands: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
}) => {
  const { selfSendCommands } = useSelector((state: any) => state.alerts);
  const { devices } = useSelector((state: any) => state.monitoring);
  const [isUpdateModalOpenForSendCommand, setIsUpdateModalOpenForSendCommand] =
    useState(false);

  const [dataList, setDataList]: any = useState([...selfSendCommands]);
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
    "Command",
    "Emobilizer Status",
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
    if (selfSendCommands.length !== 0) {
      const updatedDataList = selfSendCommands
        .slice(0, 12)
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

      setDataList(updatedDataList);
      // console.log("dataList", dataList);
    }
  }, [selfSendCommands, devices]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataList((prevDataList: any) =>
        prevDataList.map((device: any) => ({
          ...device,
          remainingTime: calculateRemainingTime(
            new Date(device.updatedAt).toLocaleString()
          ),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  // console.log("dataList--", dataList);

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
      const nextBatch = selfSendCommands
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

  const [typeTitle, setTypeTitle] = useState("");

  // const tempCommandsTypeList: any = [
  //   { value: `Custom command`, label: `Custom command` },
  //   {
  //     value: `Kill Engine(GPRS template)`,
  //     label: `Kill Engine(GPRS template)`,
  //   },
  //   { value: `RESET(GPRS template)`, label: `RESET(GPRS template)` },
  //   {
  //     value: `Resume Engine(GPRS template)`,
  //     label: `Resume Engine(GPRS template)`,
  //   },
  // ];
  const tempCommandsTypeList: any = [];
  const [commandsType, setCommandsType] = useState(tempCommandsTypeList);
  useEffect(() => {
    const titleSet = new Set(); // Using a Set to maintain unique titles

    selfSendCommands.forEach((item: any) => {
      const title = item.commandData.title;
      // Check if the title is not already in the set
      if (!titleSet.has(title)) {
        tempCommandsTypeList.push({
          value: title,
          label: title,
        });
        titleSet.add(title); // Add the title to the set to mark it as seen
      }
    });

    setCommandsType(tempCommandsTypeList);
  }, [selfSendCommands]);

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
        <H3 className="modal-title">My Send Commands</H3>
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
            <Row>
              <FormGroup className="col-md-6 create-group">
                <P>Search Vehicles</P>
                <input
                  className="form-control"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="text"
                  placeholder="Search Commanded Vehicles"
                />
              </FormGroup>
              <FormGroup className="col-md-6 create-group">
                <P>Filter Commands</P>
                <Select
                  showSearch
                  style={{ width: "100%", height: 36 }}
                  placeholder="Select Command type"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA: any, optionB: any) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={(e: any, option: any) => {
                    // // console.log(e);
                    // // console.log(option);
                    setTypeTitle(e);
                  }}
                  options={commandsType}
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
                              data === "Last Packet" || data === "Killed Time"
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
                          No Commands Found
                        </td>
                      </tr>
                    ) : (
                      dataList
                        .filter((data: any) =>
                          data.deviceName
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                        )
                        .map(
                          (data: any, index: any) =>
                            (typeTitle === data.commandData.title ||
                              typeTitle === "") && (
                              <tr style={{ cursor: "pointer" }} key={index}>
                                <td style={{ width: "8%" }}>{data.deviceId}</td>
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

                                <td style={{ width: "7%" }}>
                                  {data?.latitude}
                                </td>
                                <td style={{ width: "7%" }}>
                                  {data.longitude}
                                </td>
                                <td style={{ width: "8%" }}>
                                  {data.address == undefined ||
                                  data?.address === "" ||
                                  data?.address == null
                                    ? "N/A"
                                    : data.address}
                                </td>
                                <td style={{ width: "8%" }}>
                                  {data?.server?.companyName}
                                </td>
                                <td style={{ width: "10%" }}>
                                  <div className="d-flex">
                                    <div className="flex-grow-1 ms-2">
                                      <div style={{ fontSize: "10px" }}>
                                        {format(
                                          new Date(
                                            data?.createdAt
                                          ).toISOString(),
                                          "date"
                                        )}
                                      </div>
                                      <div style={{ fontSize: "10px" }}>
                                        {/* {data.updatedAt.toString().slice(11, 19)} */}
                                        {format(
                                          new Date(
                                            data?.createdAt
                                          ).toISOString(),
                                          "time"
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td style={{ width: "8%" }}>
                                  {data?.commandData?.type === "custom"
                                    ? data?.commandData?.title
                                    : data?.commandData?.title}
                                </td>
                                {/* <td style={{ width: "8%" }}>{data.remainingTime}</td> */}
                                <td style={{ width: "11%" }}>
                                  {data?.eMobilizerStatus !== null &&
                                  data?.eMobilizerStatus !== undefined ? (
                                    <div
                                      style={{
                                        padding: "5px",
                                        backgroundColor: data?.eMobilizerStatus
                                          ? "rgba(255, 0, 0, 0.1)"
                                          : "rgba(0, 255, 0, 0.1)",
                                        color: data?.eMobilizerStatus
                                          ? "red"
                                          : "green",
                                        borderRadius: "5px",
                                      }}
                                    >
                                      {data?.eMobilizerStatus
                                        ? "Killed"
                                        : "Released"}
                                    </div>
                                  ) : (
                                    <div>
                                      <button
                                        className="btn-primary"
                                        style={{
                                          borderRadius: "5px",
                                          padding: "5px 5px",
                                          color: "white",
                                          outline: "none",
                                          border: "none",
                                          marginTop: "00px",
                                        }}
                                        onClick={async () => {
                                          const serverInfo = serverCredentials(
                                            data?.server?._id
                                          );
                                          const verifyData = {
                                            deviceId: data?.deviceId,
                                            // commandedDeviceId: data._id,
                                            serverId: serverInfo?.serverId,
                                            serverHashKey:
                                              serverInfo?.serverHashKey,
                                            commandedVehicleDeviceId: data?._id,
                                          };
                                          // addToggle();
                                          // console.log(verifyData);
                                          await create(verifyData, {
                                            url: VERIFY_VEHICLE_BLOCK_STATUS,
                                          }).then((data: any) => {
                                            // console.log("data", data);
                                            setLoading(false);
                                            if (
                                              !data.success &&
                                              data.message == ERROR_MESSAGE
                                            ) {
                                            }
                                            if (!data.success) {
                                              Swal.fire({
                                                text: `${data.message}`,
                                                icon: "error",
                                                timer: 2000,
                                                showConfirmButton: false,
                                              });
                                            }
                                            if (data.success) {
                                              const updatedDataList =
                                                dataList.map((item: any) => {
                                                  if (
                                                    item._id == data.data._id
                                                  ) {
                                                    // Update fields with new values
                                                    return {
                                                      ...item,
                                                      eMobilizerStatus:
                                                        data?.data?.isKilled,
                                                      lastPacketTimeStamp:
                                                        data.data
                                                          .lastPacketTimeStamp,
                                                      onlineStatus:
                                                        data?.data
                                                          ?.onlineStatus,
                                                    };
                                                  }
                                                  return item; // Return unchanged item if deviceId doesn't match
                                                });
                                              setDataList(updatedDataList);
                                            }
                                          });
                                        }}
                                      >
                                        Check Status
                                      </button>
                                    </div>
                                  )}
                                </td>
                                {/* <td>
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
                                Send
                              </button>
                            </div>
                          </td>
                          <SendCommand
                            addModal={isUpdateModalOpenForSendCommand}
                            setAddModal={setIsUpdateModalOpenForSendCommand}
                            dropDownDevices={devices}
                            prevItem={deviceData}
                          /> */}
                              </tr>
                            )
                        )
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
};

export default SelfSendCommands;
