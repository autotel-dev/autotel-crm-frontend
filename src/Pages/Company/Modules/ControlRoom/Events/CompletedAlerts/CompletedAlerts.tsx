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
    "Address",
    "Completion Response",
  ];
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

  return (
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
              placeholder="Search Completed Vehicles"
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
                          data === "Device" || data === "Type" ? "15%" : "20%",
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
                      <tr style={{ cursor: "pointer" }} key={index}>
                        {/* <td>{data.eventId}</td> */}
                        <td style={{ width: "15%" }}>
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <H5>{data.deviceName}</H5>
                              <div style={{ fontSize: "10px" }}>
                                {data.createdAt.slice(0, 10)}
                              </div>

                              <div style={{ fontSize: "10px" }}>
                                {data.createdAt.slice(11, 19)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`txt-primary`} style={{ width: "20%" }}>
                          {data.message}
                        </td>
                        <td style={{ width: "15%" }}>{data.type}</td>
                        <td style={{ width: "20%" }}>{data.message}</td>
                        <td
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
                        )}
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
  );
};

export default AssignedAlerts;
