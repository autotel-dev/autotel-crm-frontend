import { Button, Card, CardBody, Modal, ModalBody, Table } from "reactstrap";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { H3, H4 } from "../../../../../../AbstractElements";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
}

const TotalKillingDevices: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
}) => {
  const { killedDevices } = useSelector((state: any) => state.alerts);

  const [dataList, setDataList]: any = useState([...killedDevices]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const tableHeader = [
    "Device ID",
    "Device Name",
    "Status",
    "Last Packet",
    "Latitude",
    "Longitude",
    "Server",
    "Killed Time",
    "Count Down",
  ];
  const containerRef = useRef(null);
  useEffect(() => {
    if (killedDevices.length !== 0) {
      setDataList(
        killedDevices.slice(0, 12).map((device: any) => ({
          ...device,
          remainingTime: calculateRemainingTime(device.lastPacketTimeStamp),
        }))
      );
    }
  }, [killedDevices]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataList((prevDataList: any) =>
        prevDataList.map((device: any) => ({
          ...device,
          remainingTime: calculateRemainingTime(device.lastPacketTimeStamp),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateRemainingTime = (timestamp: number): string => {
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingSeconds = currentTime - timestamp;
    if (remainingSeconds <= 0) return "00:00:00";

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const bottomOffset = scrollHeight - (scrollTop + clientHeight);
    if (bottomOffset < 50) {
      const nextBatch = killedDevices
        .slice(dataList.length, dataList.length + 6)
        .map((device: any) => ({
          ...device,
          remainingTime: calculateRemainingTime(device.lastPacketTimeStamp),
        }));
      setDataList((prevData: any) => [...prevData, ...nextBatch]);
    }
  };

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
        <H3 className="modal-title">Total Kiling Devices</H3>
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
                    {dataList.length == 0 ? (
                      <tr>
                        <td colSpan={7} style={{ fontSize: "25px" }}>
                          No Kiling Devices
                        </td>
                      </tr>
                    ) : (
                      dataList.map((data: any, index: any) => (
                        <tr style={{ cursor: "pointer" }} key={index}>
                          <td>{data.deviceId}</td>
                          <td>{data.deviceName}</td>

                          <td className={`txt-primary`}>{data.onlineStatus}</td>
                          <td>{data.lastPacketTimeStamp}</td>
                          <td>{data.latitude}</td>
                          <td>{data.longitude}</td>
                          <td>{data.server}</td>
                          <td>
                            <div className="d-flex">
                              <div className="flex-grow-1 ms-2">
                                <H4>
                                  {data.updatedAt.toString().slice(0, 10)}
                                </H4>
                                <span style={{ fontSize: "10px" }}>
                                  {data.updatedAt.toString().slice(11, 19)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>{data.remainingTime}</td>
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

export default TotalKillingDevices;
