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
import { H3, H4, P } from "../../../../../../AbstractElements";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
}

const TotalPreInfoAlerts: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
}) => {
  const { preInfos } = useSelector((state: any) => state.alerts);

  const [dataList, setDataList]: any = useState([...preInfos]);
  const tableHeader = [
    "Device ID",
    "Device Name",
    "User",
    "Company",
    // "server",
    "Pre Info Message",
    "From Date",
    "To Date",
  ];
  const containerRef = useRef(null);
  useEffect(() => {
    if (preInfos.length < 12) {
      setDataList(preInfos.slice(0, 12)); // Initially display the first 6 elements
    }
  }, [preInfos]);
  useEffect(() => {
    setDataList(preInfos.slice(0, 12)); // Initially display the first 6 elements
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return; // Ensure containerRef.current exists
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const bottomOffset = scrollHeight - (scrollTop + clientHeight);
    if (bottomOffset < 50) {
      // If scrolled to the bottom
      const nextBatch = preInfos.slice(dataList.length, dataList.length + 6); // Fetch the next 6 elements
      setDataList((prevData: any) => [...prevData, ...nextBatch]); // Append to the existing data
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
        <H3 className="modal-title">Total Pre Info Sent</H3>
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
              <FormGroup className="col-md-12 create-group">
                <P>Search Vehicles</P>
                <input
                  className="form-control"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="text"
                  placeholder="Search Pre Info Vehicles"
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
                            width: "10%",
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
                          No Pre Infos Found
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
                          <tr style={{ cursor: "pointer" }} key={index}>
                            <td style={{ width: "10%" }}>{data.deviceId}</td>
                            <td style={{ width: "10%" }}>{data.deviceName}</td>

                            <td style={{ width: "10%" }}>
                              {data.addedByUser.fullName}
                            </td>
                            {/* <td style={{ width: "10%" }}>
                              {data?.company?.fullName}
                            </td> */}
                            {/* <td style={{ width: "15%" }}>
                              {data?.server?.companyName}
                            </td> */}
                            <td style={{ width: "15%" }}>
                              {data?.preInfoMessage}
                            </td>

                            <td style={{ width: "15%" }}>
                              <div className="d-flex">
                                <div className="flex-grow-1 ms-2">
                                  <div style={{ fontSize: "10px" }}>
                                    {format(
                                      new Date(data?.from).toISOString(),
                                      "date"
                                    )}
                                  </div>
                                  <div style={{ fontSize: "10px" }}>
                                    {/* {data.updatedAt.toString().slice(11, 19)} */}
                                    {format(
                                      new Date(data?.from).toISOString(),
                                      "time"
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ width: "15%" }}>
                              <div className="d-flex">
                                <div className="flex-grow-1 ms-2">
                                  <div style={{ fontSize: "10px" }}>
                                    {format(
                                      new Date(data?.to).toISOString(),
                                      "date"
                                    )}
                                  </div>
                                  <div style={{ fontSize: "10px" }}>
                                    {/* {data.updatedAt.toString().slice(11, 19)} */}
                                    {format(
                                      new Date(data?.to).toISOString(),
                                      "time"
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
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

export default TotalPreInfoAlerts;
