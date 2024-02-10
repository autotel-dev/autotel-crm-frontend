import { Card, CardBody, CardHeader, Col, Table } from "reactstrap";
import { H3, H4 } from "../../../../../../AbstractElements";
import { useEffect, useRef, useState } from "react";
import { getAll } from "../../../../../../Api";

const LiveAlerts = (liveAlertsData: any) => {
  console.log("liveAlertsData", liveAlertsData.liveAlertsData[0]);

  const [data, setData]: any = useState([]);
  const tableHeader = ["ID", "Device", "Alert", "Type", "Message", "Address"];
  const containerRef = useRef(null);
  useEffect(() => {
    setData(liveAlertsData.liveAlertsData.slice(0, 12)); // Initially display the first 6 elements
  }, [liveAlertsData.liveAlertsData]);

  const handleScroll = () => {
    if (!containerRef.current) return; // Ensure containerRef.current exists
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    if (scrollHeight - scrollTop === clientHeight) {
      // If scrolled to the bottom
      const nextBatch = liveAlertsData.liveAlertsData.slice(
        data.length,
        data.length + 6
      ); // Fetch the next 6 elements
      setData((prevData: any) => [...prevData, ...nextBatch]); // Append to the existing data
    }
  };

  return (
    <Card className="invoice-card">
      <CardHeader className="pb-0" style={{ backgroundColor: "#63d5be" }}>
        <div style={{ paddingBottom: "10px" }}>
          <H3>Live Alerts</H3>
        </div>
      </CardHeader>
      <CardBody className="transaction-card">
        <div
          ref={containerRef}
          className="table-responsive theme-scrollbar recent-wrapper"
          style={{ maxHeight: "66vh", overflowY: "auto" }}
          onScroll={handleScroll}
        >
          <Table className="display order-wrapper" id="recent-order">
            <thead>
              <tr>
                {tableHeader.map((data, index) => (
                  <th key={index}>{data}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((data: any, index: any) => (
                <tr key={index} style={{ cursor: "pointer" }}>
                  <td>{data.id}</td>
                  <td>
                    <div className="d-flex">
                      <div className="flex-grow-1 ms-2">
                        <H4>{data.device_name}</H4>
                        <span style={{ fontSize: "11px" }}>
                          {data.created_at}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className={`txt-primary`}>{data.name}</td>
                  <td>{data.type}</td>
                  <td>{data.message}</td>
                  <td>{data.address}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default LiveAlerts;
