import { Card, CardBody, CardHeader, Col, Table } from "reactstrap";
import { H3, H4 } from "../../../../../../AbstractElements";
import { useEffect, useRef, useState } from "react";
import AssignedAlertModal from "./AssignedAlertModal";
import { useDispatch, useSelector } from "react-redux";
import { create } from "../../../../../../Api";
import { serverCredentials } from "../../../../../../Api/header";
import { setModalData } from "../../../../../../ReaduxToolkit/Reducer/AlertsSlice";
import { AnimatePresence, motion } from "framer-motion";

const AssignedAlerts = () => {
  const dispatch = useDispatch();
  const { assignedAlerts } = useSelector((state: any) => state.alerts);
  console.log("assignedAlertsData", assignedAlerts);

  const [dataList, setDataList]: any = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const tableHeader = ["ID", "Device", "Alert", "Type", "Message", "Address"];
  const containerRef = useRef(null);
  const [pageNo, setPageNo] = useState(1);
  const [clickedRow, setClickedRow] = useState(null);
  const [rowindex, setRowIndex] = useState(null);
  const [liveAlertAssigned, setLiveAlertAssigned] = useState(false);

  useEffect(() => {
    if (rowindex !== null) {
      setClickedRow(rowindex);
      setTimeout(() => {
        // After 1 second, reset the clickedRow state to null to dismiss the row completely
        setDataList([
          ...assignedAlerts.slice(0, rowindex),
          ...assignedAlerts.slice(rowindex + 1),
        ]);
        setRowIndex(null);
        setClickedRow(null);
      }, 1000);
    } else {
      setLiveAlertAssigned(true);
      setDataList([...assignedAlerts.slice(0, dataList.length)]);
      setTimeout(() => {
        setLiveAlertAssigned(false);
      }, 1000);
    }
  }, [assignedAlerts]);

  useEffect(() => {
    setDataList(assignedAlerts.slice(0, 12)); // Initially display the first 6 elements
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return; // Ensure containerRef.current exists
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    if (scrollHeight - scrollTop === clientHeight) {
      // If scrolled to the bottom
      const nextBatch = assignedAlerts.slice(
        dataList.length,
        dataList.length + 6
      ); // Fetch the next 6 elements
      setDataList((prevData: any) => [...prevData, ...nextBatch]); // Append to the existing data
    }
  };

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [basicTab, setBasicTab] = useState("1");
  const [fisrtTime,setFirstTime] = useState(true);

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
                <AnimatePresence>
                  {dataList.length == 0 ? (
                    <tr>
                      <td colSpan={6} style={{ fontSize: "25px" }}>
                        No Assigned Alerts Found
                      </td>
                    </tr>
                  ) : (
                    dataList.map((data: any, index: any) => (
                      <motion.tr
                        style={{
                          cursor: "pointer",
                        }}
                        initial={{ opacity: 1 }}
                        animate={{
                          opacity: clickedRow === index ? 0 : 1,
                          y:
                            clickedRow === index
                              ? -100
                              : liveAlertAssigned
                              ? 80
                              : 0,
                        }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 1 }}
                        key={index}
                        onClick={async () => {
                          setRowIndex(index);

                          const serverInfo = serverCredentials(data.server);
                          console.log("serverInfo", serverInfo);
                          setBasicTab("1");
                          setIsUpdateModalOpen(true);
                          console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                          const sendData = {
                            eventId: data._id,
                            serverId: serverInfo?.element.serverId,
                            serverHashKey: serverInfo?.element.serverHashKey,
                            deviceId: data.deviceId,
                          };
                          console.log(sendData);
                          try {
                            await create(sendData, {
                              url: "alert-events/get-alert-event-by-id",
                            }).then((data: any) => {
                              console.log(data);
                              if (data.success) {
                                dispatch(setModalData(data.data));
                              }
                            });
                            // Handle successful post creation (e.g., show a success message, redirect, etc.)
                          } catch (error: any) {
                            // Handle error (e.g., show an error message)
                            dispatch(setModalData(undefined));
                            console.error("Error creating post:", error);
                          }
                          // setTimeout(() => {
                          //   setDataList((prevData: any) =>
                          //     prevData.filter(
                          //       (item: any, i: any) => i !== index
                          //     )
                          //   );
                          //   setClickedRow(null);
                          // }, 1000);
                        }}
                      >
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
                        <td>
                          {data.address == null && data.address == undefined
                            ? "N/A"
                            : data.address}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </Table>
            <AssignedAlertModal
              isVisible={isUpdateModalOpen}
              setIsVisible={setIsUpdateModalOpen}
              tab={basicTab}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AssignedAlerts;
