import { Card, CardBody, CardHeader, Col, PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { H4 } from "../../../../../AbstractElements";

const ComplainHistory = () => {
  const { createComplainModalData } = useSelector((state: any) => state.complainCenter);
  // // console.log("completedAlertsData", modalData.previousAlerts);

  const [dataList, setDataList]: any = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const tableHeader = [
    "ID",
    "Device",
    "Alert",
    "Type",
    "Message",
    "Address",
    "Response",
  ];
  const containerRef = useRef(null);
  const [pageNo, setPageNo] = useState(1);
  useEffect(() => {
    if (createComplainModalData?.complaintHistory != null)
      setDataList(createComplainModalData?.complaintHistory.slice(0, 12)); // Initially display the first 6 elements
  }, [createComplainModalData?.complaintHistory]);

  const handleScroll = () => {
    if (!containerRef.current) return; // Ensure containerRef.current exists
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const bottomOffset = scrollHeight - (scrollTop + clientHeight);
    if (bottomOffset < 50) {
      // If scrolled to the bottom
      const nextBatch = createComplainModalData?.complaintHistory.slice(
        dataList.length,
        dataList.length + 6
      ); // Fetch the next 6 elements
      setDataList((prevData: any) => [...prevData, ...nextBatch]); // Append to the existing data
    }
  };

  return (
    <Card className="invoice-card">
      <CardBody className="transaction-card">
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
                    <th key={index}>{data}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ fontSize: "25px" }}>
                      No Previous Complains Found
                    </td>
                  </tr>
                ) : (
                  dataList.map((data: any, index: any) => (
                    <tr style={{ cursor: "pointer" }} key={index}>
                      <td>{data.eventId}</td>
                      <td>
                        <div className="d-flex">
                          <div className="flex-grow-1 ms-2">
                            <H4>{data.deviceName}</H4>
                            <span style={{ fontSize: "10px" }}>
                              {data.createdAt.toString().slice(0, 10) +
                                " " +
                                data.createdAt.toString().slice(11, 19)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className={`txt-primary`}>{data.message}</td>
                      <td>{data.type}</td>
                      <td>{data.message}</td>
                      <td id="Popover" style={{ width: "20%" }}>
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
                          target="Popover"
                        >
                          <PopoverHeader>Address</PopoverHeader>
                          <PopoverBody>{data.address}</PopoverBody>
                        </UncontrolledPopover>
                      )}
                      <td>
                        {data.completionResponse === ""
                          ? "N/A"
                          : data.completionResponse}
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

export default ComplainHistory;
