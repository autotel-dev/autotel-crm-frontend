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
import { useSelector } from "react-redux";

const AssignedAlerts = () => {
  const { completedAlerts } = useSelector((state: any) => state.alerts);
  // // console.log("completedAlertsData", completedAlerts);

  const [dataList, setDataList]: any = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const tableHeader = [
    // "ID",
    "Device",
    "Alert",
    "Type",
    "Message",
    "Server Time",
    "Completion Response",
  ];
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
  const containerRef = useRef(null);
  const [pageNo, setPageNo] = useState(1);
  useEffect(() => {
    if (completedAlerts.length > 12) {
      setDataList(completedAlerts.slice(0, 12)); // Initially display the first 6 elements
    }
  }, [completedAlerts]);
  useEffect(() => {
    setDataList(completedAlerts.slice(0, 12)); // Initially display the first 6 elements
  }, [completedAlerts]);

  const handleScroll = () => {
    if (!containerRef.current) return; // Ensure containerRef.current exists
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const bottomOffset = scrollHeight - (scrollTop + clientHeight);
    if (bottomOffset < 50) {
      // If scrolled to the bottom
      const nextBatch = completedAlerts.slice(
        dataList.length,
        dataList.length + 6
      ); // Fetch the next 6 elements
      setDataList((prevData: any) => [...prevData, ...nextBatch]); // Append to the existing data
    }
  };

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
                placeholder="Search Completed Vehicles"
              />
            </FormGroup>
          </Row>

          <div className="table-responsive theme-scrollbar recent-wrapper">
            <Table className="display order-wrapper" id="recent-order">
              <thead>
                <tr>
                  {tableHeader.map((data, index) => (
                    <th
                      key={index}
                      style={{
                        width:
                          data === "Device" || data === "Type" ? "15%" : "20%",
                      }}
                    >
                      {data}
                    </th>
                  ))}
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
                      <td colSpan={7} style={{ fontSize: "25px" }}>
                        No Completed Alerts Found
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
                          {/* <td>{data.eventId}</td> */}
                          <td style={{ width: "15%" }}>
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
                                    // Adjust the time by adding 5 hours to the `createdAt` time
                                    const adjustedDate = new Date(
                                      new Date(data.createdAt).setHours(
                                        new Date(data.createdAt).getHours()
                                      )
                                    );

                                    // Get the hours, minutes, and seconds from the adjusted date
                                    const hours24 = adjustedDate.getHours(); // Get the hours in 24-hour format
                                    const minutes = adjustedDate
                                      .getMinutes()
                                      .toString()
                                      .padStart(2, "0"); // Get minutes, ensure 2 digits
                                    const seconds = adjustedDate
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
                          <td
                            className={`txt-primary`}
                            style={{ width: "20%" }}
                          >
                            {data.message}
                          </td>
                          <td style={{ width: "15%" }}>{data.type}</td>
                          <td style={{ width: "20%" }}>{data.message}</td>

                          <td style={{ width: "15%" }}>
                            <div style={{ fontSize: "10px" }}>
                              {data.serverDateAndTime.slice(0, 10)}
                            </div>

                            <div style={{ fontSize: "10px" }}>
                              {(() => {
                                // Extract the time part from the ISO string
                                const timeStr = data.serverDateAndTime.slice(
                                  11,
                                  19
                                ); // Get the time part "HH:MM:SS"

                                // Convert to 12-hour format with AM/PM
                                const hours24 = parseInt(timeStr.slice(0, 2)); // Get the hours (0-23)
                                const minutes = timeStr.slice(3, 5); // Get the minutes (00-59)
                                const seconds = timeStr.slice(6, 8); // Get the seconds (00-59)

                                // Determine AM or PM
                                const period = hours24 >= 12 ? "PM" : "AM";

                                // Convert to 12-hour format
                                const hours12 = hours24 % 12 || 12; // Convert 0 to 12 (midnight), 13-23 to 1-11 PM

                                // Format time in 12-hour format with AM/PM
                                return `${hours12}:${minutes}:${seconds} ${period}`;
                              })()}
                            </div>
                          </td>
                          {/* <td
                            id="addressCompletedAlerts"
                            style={{ width: "20%" }}
                          >
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
                              target="addressCompletedAlerts"
                            >
                              <PopoverHeader>Address</PopoverHeader>
                              <PopoverBody>{data.address}</PopoverBody>
                            </UncontrolledPopover>
                          )} */}
                          <td style={{ width: "20%" }}>
                            {data.completionResponse}
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
    </Col>
  );
};

export default AssignedAlerts;
