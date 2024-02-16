import { Card, CardBody, CardHeader, Col, Table } from "reactstrap";
import { H3, H4 } from "../../../../../../AbstractElements";
import { useEffect, useRef, useState } from "react";
import { create, getAll } from "../../../../../../Api";
import { useDispatch, useSelector } from "react-redux";
import {
  setAssignedAlerts,
  setLiveAlerts,
} from "../../../../../../ReaduxToolkit/Reducer/AlertsSlice";
import Swal from "sweetalert2";
import Loader from "../../../../../Loader/Loader";
import { serverCredentials } from "../../../../../../Api/header";

const LiveAlerts = () => {
  const dispatch = useDispatch();
  const { liveAlerts } = useSelector((state: any) => state.alerts);
  console.log("liveAlertsData", liveAlerts);

  const [dataList, setDataList]: any = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [assignLoading, setAssignLoading] = useState(true);
  const tableHeader = ["ID", "Device", "Alert", "Type", "Message", "Address"];
  const containerRef = useRef(null);
  const [pageNo, setPageNo] = useState(1);
  useEffect(() => {
    setDataList(liveAlerts.slice(0, 12)); // Initially display the first 6 elements
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return; // Ensure containerRef.current exists
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    if (scrollHeight - scrollTop === clientHeight) {
      // If scrolled to the bottom
      const nextBatch = liveAlerts.slice(dataList.length, dataList.length + 6); // Fetch the next 6 elements
      setDataList((prevData: any) => [...prevData, ...nextBatch]); // Append to the existing data
    }
    if (
      dataList[dataList.length - 1].id === liveAlerts[liveAlerts.length - 1].id
    ) {
      console.log("data[data.length - 1].id", dataList[dataList.length - 1].id);
      console.log(
        "liveAlerts[liveAlerts.length - 1].id",
        liveAlerts[liveAlerts.length - 1].id
      );
      setLoading(true); // Set loading to true before making API call
      const url = `company/alert-events?pageNo=${pageNo + 1}`;
      getAll({ url: url }).then((data: any) => {
        // Set loading to false when API call completes
        console.log("api call --- >", data);

        if (data !== undefined) {
          if (data.success) {
            setPageNo(pageNo + 1);
            console.log("length --- >", data.data.allAlertEvents.length);
            const temp = [...liveAlerts, ...data.data.allAlertEvents];
            console.log("temp", temp);
            setLoading(false);
            dispatch(setLiveAlerts(temp));
          }
          if (!data.success) {
            setLoading(false);
          }
        }
      });
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
              {dataList.map((data: any, index: any) => (
                <tr
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={async () => {
                    if (assignLoading) {
                      Swal.fire({
                        text: "Loading....",
                        icon: "info",
                        showConfirmButton: false,
                        allowOutsideClick: false, // Prevent closing by clicking outside the modal
                      });
                    }
                    const serverInfo = serverCredentials(data.server._id);
                    console.log("serverInfo", serverInfo);

                    const assignEvent = {
                      eventId: data.id,
                      deviceId: data.device_id,
                      deviceName: data.device_name,
                      latitude: data.latitude,
                      longitude: data.longitude,
                      speed: data.id,
                      type: data.type,
                      message: data.message,
                      serverId: serverInfo?.element.serverId,
                      serverHashKey: serverInfo?.element.serverHashKey,
                    };
                    console.log(assignEvent);
                    try {
                      console.log("liveAlerts[index]: ", liveAlerts[index]);

                      await create(assignEvent, {
                        url: "company/assign-alert-event-to-me",
                      }).then((dataa: any) => {
                        setAssignLoading(false);
                        if (dataa.success) {
                          var updatedAlerts = [...liveAlerts]; // Create a shallow copy of the liveAlerts array
                          updatedAlerts.splice(index, 1); // Remove the item at the specified index

                          setDataList(updatedAlerts.slice(0, dataList.length));
                          console.log("updatedAlerts", updatedAlerts);
                          console.log("dataList", dataList);
                          dispatch(setLiveAlerts(updatedAlerts)); // Dispatch the action with the updated array
                          console.log(dataa);
                          Swal.fire({
                            text: "Assigned Successfully",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                          });
                          getAll({
                            url: "company/get-all-assigned-events",
                          }).then((data: any) => {
                            console.log("assigned --- >", data);
                            // setLoading(false);
                            if (data !== undefined) {
                              if (data.success) {
                                setAssignLoading(true);
                                console.log("length --- >", data.data.length);
                                dispatch(setAssignedAlerts(data.data));
                              }
                            }
                          });
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
          {loading && (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <Loader />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default LiveAlerts;
