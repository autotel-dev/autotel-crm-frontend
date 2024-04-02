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
import { H3, H4, H5, P } from "../../../../../../AbstractElements";
import SendCommand from "./SendCommand";
import { create } from "../../../../../../Api";
import Swal from "sweetalert2";
import { serverCredentials } from "../../../../../../Api/header";
import { Select } from "antd";
import Loader from "../../../../../Loader/Loader";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
}

const TotalAlertsForSpecificDevices: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
}) => {
  const { deviceSelecetdAlerts } = useSelector((state: any) => state.alerts);

  const [dataList, setDataList]: any = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading

  const [searchValue, setSearchValue] = useState("");
  const containerRef = useRef(null);
  useEffect(() => {
    if (deviceSelecetdAlerts.length < 12) {
      setDataList(deviceSelecetdAlerts.slice(0, 12)); // Initially display the first 6 elements
    }
    console.log("deviceSelecetdAlerts---", deviceSelecetdAlerts);
  }, [deviceSelecetdAlerts]);
  useEffect(() => {
    setDataList(deviceSelecetdAlerts?.slice(0, 12)); // Initially display the first 6 elements
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return; // Ensure containerRef.current exists
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const bottomOffset = scrollHeight - (scrollTop + clientHeight);
    if (bottomOffset < 50) {
      // If scrolled to the bottom
      const nextBatch = deviceSelecetdAlerts?.slice(
        dataList.length,
        dataList.length + 6
      ); // Fetch the next 6 elements
      setDataList((prevData: any) => [...prevData, ...nextBatch]); // Append to the existing data
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
        <H3 className="modal-title">Alerts Data</H3>
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
                <P>Search Alerts</P>
                <input
                  className="form-control"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="text"
                  placeholder="Search Device Alerts"
                />
              </FormGroup>
            </Row>

            <div
              ref={containerRef}
              className="table-responsive theme-scrollbar recent-wrapper"
              style={{
                overflowY: "auto",
                overflowX: "auto",
                maxHeight: "calc(66vh - 20px)",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin",
                WebkitBorderRadius: "5px",
                MozBorderRadius: "5px",
                borderRadius: "5px",
                scrollbarColor: "lightgray transparent",
              }}
              onScroll={handleScroll}
            >
              <div className="table-responsive theme-scrollbar recent-wrapper">
                <Table className="display order-wrapper" id="recent-order">
                  <thead>
                    <tr>
                      <th>Device</th>
                      <th>Alert</th>
                      <th>Type</th>
                      <th>Message</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviceSelecetdAlerts == null ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          height: "60vh",
                          backgroundColor: "white",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <Loader />
                        </div>
                      </div>
                    ) : deviceSelecetdAlerts.length == 0 ? (
                      <tr>
                        <td colSpan={6} style={{ fontSize: "25px" }}>
                          No Device Alerts Found
                        </td>
                      </tr>
                    ) : (
                      dataList
                        .filter(
                          (data: any) =>
                            data?.deviceName
                              .toLowerCase()
                              .includes(searchValue.toLowerCase()) ||
                            data?.message
                              .toLowerCase()
                              .includes(searchValue.toLowerCase())
                        )
                        .map((data: any, index: any) => (
                          <tr
                            style={{
                              cursor: "pointer",
                            }}
                            key={index}
                          >
                            <td>
                              <div className="d-flex">
                                <div className="flex-grow-1">
                                  <H5>{data.deviceName}</H5>
                                  <div style={{ fontSize: "10px" }}>
                                    {data?.createdAt.slice(0, 10)}
                                  </div>

                                  <div style={{ fontSize: "10px" }}>
                                    {data?.createdAt.slice(11, 19)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className={`txt-primary`}>{data?.message}</td>
                            <td>{data?.type}</td>
                            <td>{data?.message}</td>
                            <td>
                              {data?.address == null ? "N/A" : data?.address}
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

export default TotalAlertsForSpecificDevices;
