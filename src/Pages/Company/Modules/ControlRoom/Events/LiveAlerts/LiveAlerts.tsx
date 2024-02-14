import { Card, CardBody, CardHeader, Col, Table } from "reactstrap";
import { H3, H4 } from "../../../../../../AbstractElements";
import { useEffect, useRef, useState } from "react";
import { create, getAll } from "../../../../../../Api";
import { useDispatch, useSelector } from "react-redux";
import { setLiveAlerts } from "../../../../../../ReaduxToolkit/Reducer/AlertsSlice";

const LiveAlerts = () => {
  const dispatch = useDispatch();
  const { liveAlerts } = useSelector((state: any) => state.alerts);
  console.log("liveAlertsData", liveAlerts);

  const [data, setData]: any = useState([]);
  const tableHeader = ["ID", "Device", "Alert", "Type", "Message", "Address"];
  const containerRef = useRef(null);
  const [pageNo, setPageNo] = useState(1);
  useEffect(() => {
    setData(liveAlerts.slice(0, 12)); // Initially display the first 6 elements
  }, [liveAlerts]);

  const handleScroll = () => {
    if (!containerRef.current) return; // Ensure containerRef.current exists
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    if (scrollHeight - scrollTop === clientHeight) {
      // If scrolled to the bottom
      const nextBatch = liveAlerts.slice(data.length, data.length + 6); // Fetch the next 6 elements
      setData((prevData: any) => [...prevData, ...nextBatch]); // Append to the existing data
    }
    if (data.length == 30 * pageNo) {
      getAll({ url: `company/alert-events?pageNo=${pageNo + 1}` }).then(
        (data: any) => {
          console.log("api call --- >", data);
          setPageNo(pageNo + 1);
          if (data !== undefined) {
            if (data.success) {
              console.log("length --- >", data.data.allAlertEvents.length);
              dispatch(setLiveAlerts(data.data.allAlertEvents));
            }
          }
        }
      );
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
                <tr
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={async () => {
                    const assignEvent = {
                      eventId: data.id,
                      deviceId: data.device_id,
                      deviceName: data.device_name,
                      latitude: data.latitude,
                      longitude: data.longitude,
                      speed: data.id,
                      type: data.type,
                      message: data.message,
                      serverId: "65c6134bf8aaf7c366e7b275",
                      serverHashKey:
                        "$2y$10$IcpqbcgY1hrVyyD24EYRU.Ek8Lc66dFDMk93rPodLpTQawGklsBhi",
                    };
                    console.log(assignEvent);
                    try {
                      console.log("liveAlerts[index]: ", liveAlerts[index]);
                      await create(assignEvent, {
                        url: "company/assign-alert-event-to-me",
                      }).then((data: any) => {
                        var updatedAlerts = [...liveAlerts]; // Create a shallow copy of the liveAlerts array
                        updatedAlerts.splice(index, 1); // Remove the item at the specified index
                        dispatch(setLiveAlerts(updatedAlerts)); // Dispatch the action with the updated array
                        if (data.success) {
                          console.log(data);
                          // getAll({ url: "company/alert-events" }).then(
                          //   (data: any) => {
                          //     console.log("api call --- >", data);
                          //     if (data !== undefined) {
                          //       if (data.success) {
                          //         dispatch(setLiveAlerts(data.data));
                          //       }
                          //     }
                          //   }
                          // );
                        }
                      });
                      // Handle successful post creation (e.g., show a success message, redirect, etc.)
                    } catch (error: any) {
                      // Handle error (e.g., show an error message)
                      console.error("Error creating post:", error);
                    }
                  }}
                >
                  <td>{data.id}</td>
                  <td>
                    <div className="d-flex">
                      <div className="flex-grow-1 ms-2">
                        <H4>{data.device_name}</H4>
                        <span style={{ fontSize: "10px" }}>
                          {data.created_at}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className={`txt-primary`}>{data.name}</td>
                  <td>{data.type}</td>
                  <td>{data.message}</td>
                  <td>{data.address == null ? "N/A" : data.address}</td>
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
