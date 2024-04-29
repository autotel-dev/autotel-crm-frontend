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
import Swal from "sweetalert2";
import { Select } from "antd";
import { H3, H5, P } from "../../../../AbstractElements";
import { Heading5 } from "../../../../utils/Constant";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  data: any;
}

const OperatorAlerts: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  data,
}) => {
  const [dataList, setDataList]: any = useState([...data]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const tableHeader = [
    "Device",
    "Alert",
    "Type",
    "Message",
    "Address",
    "User",
    "Completion Response",
    "Count Down",
  ];
  const containerRef = useRef(null);

  const [deviceData, setDeviceData] = useState("");
  useEffect(() => {
    if (data.length !== 0) {
      const updatedDataList = data.slice(0, 12).map((alertData: any) => {
        return {
          ...alertData,
          remainingTime: calculateRemainingTime(
            new Date(alertData.createdAt).toLocaleString()
          ),
        };
      });

      setDataList(updatedDataList);
      // console.log("dataList", dataList);
    }
  }, [data]);

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
      const nextBatch = data
        .slice(dataList.length, dataList.length + 6)
        .map((alertData: any) => {
          return {
            ...alertData,
            remainingTime: calculateRemainingTime(
              new Date(alertData.createdAt).toLocaleString()
            ),
          };
        });

      setDataList((prevData: any) => [...prevData, ...nextBatch]);
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

  const tempCommandsTypeList: any = [];
  const [commandsType, setCommandsType] = useState(tempCommandsTypeList);
  useEffect(() => {
    const titleSet = new Set(); // Using a Set to maintain unique titles

    data.forEach((item: any) => {
      const title = item.message;
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
  }, [data]);

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
        <H3 className="modal-title">Operator Alerts</H3>
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
                <P>Search Alert</P>
                <input
                  className="form-control"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="text"
                  placeholder="Search Alerts"
                />
              </FormGroup>
              <FormGroup className="col-md-6 create-group">
                <P>Filter Alerts</P>
                <Select
                  showSearch
                  style={{ width: "100%", height: 36 }}
                  placeholder="Select Message Type"
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
                        <th key={index} style={{ width: "12%" }}>
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
                          No Alerts Found
                        </td>
                      </tr>
                    ) : (
                      dataList
                        .filter((data: any) =>
                          data.message
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                        )
                        .map(
                          (data: any, index: any) =>
                            (typeTitle === data.message ||
                              typeTitle === "") && (
                              <tr
                                style={{
                                  cursor: "pointer",
                                }}
                                key={index}
                              >
                                {/* <td>{data.eventId}</td> */}
                                <td style={{ width: "12%" }}>
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

                                      <div style={{ fontSize: "12px" }}>
                                        {data.createdAt.slice(0, 10)}
                                      </div>

                                      <div style={{ fontSize: "12px" }}>
                                        {data.createdAt.slice(11, 19)}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  className={`txt-primary`}
                                  style={{ width: "12%" }}
                                >
                                  {data.message}
                                </td>
                                <td style={{ width: "12%" }}>{data.type}</td>
                                <td style={{ width: "12%" }}>{data.message}</td>
                                <td
                                  id="addressAssignedAlerts"
                                  style={{ width: "12%" }}
                                >
                                  {data.address == null
                                    ? "N/A"
                                    : data.address.length > 10
                                    ? data.address.substring(0, 10) + "..."
                                    : data.address}
                                </td>
                                <td style={{ width: "12%" }}>
                                  {data.assignedTo.fullName}
                                </td>
                                <td style={{ width: "12%" }}>
                                  {data.completionResponse == ""
                                    ? "N/A"
                                    : data.completionResponse}
                                </td>
                                <td
                                  className="micro-5-charted-regular"
                                  style={{ width: "12%" }}
                                >
                                  {data.remainingTime}
                                </td>
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

export default OperatorAlerts;
