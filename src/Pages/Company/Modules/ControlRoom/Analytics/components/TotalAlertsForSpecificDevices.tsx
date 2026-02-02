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
import { create } from "../../../../../../Utilities/api";
import Swal from "sweetalert2";
import { serverCredentials } from "../../../../../../Utilities/headers/header";
import { Select } from "antd";
import Loader from "../../../../../Utilities/Loader/Loader";

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
    // console.log("deviceSelecetdAlerts---", deviceSelecetdAlerts);
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
        dataList.length + 6,
      ); // Fetch the next 6 elements
      setDataList((prevData: any) => [...prevData, ...nextBatch]); // Append to the existing data
    }
  };

  const [typeTitle, setTypeTitle] = useState("");

  const tempAlertTypeList: any = [];
  const [alertsType, setAlertsType] = useState(tempAlertTypeList);
  useEffect(() => {
    const messageSet = new Set(); // Using a Set to maintain unique titles

    deviceSelecetdAlerts.forEach((item: any) => {
      const message = item.message;
      // Check if the title is not already in the set
      if (!messageSet.has(message)) {
        tempAlertTypeList.push({
          value: message,
          label: message,
        });
        messageSet.add(message); // Add the title to the set to mark it as seen
      }
    });

    setAlertsType(tempAlertTypeList);
  }, [deviceSelecetdAlerts]);

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
              <FormGroup className="col-md-6 create-group">
                <P>Search Vehicles</P>
                <input
                  className="form-control"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="text"
                  placeholder="Search Device Alerts"
                />
              </FormGroup>
              <FormGroup className="col-md-6 create-group">
                <P>Filter Alerts Type</P>
                <Select
                  showSearch
                  style={{ width: "100%", height: 36 }}
                  placeholder="Select Alert Type"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA: any, optionB: any) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={(e: any, option: any) => {
                    setTypeTitle(e);
                  }}
                  options={alertsType}
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
                              .includes(searchValue.toLowerCase()),
                        )
                        .map(
                          (data: any, index: any) =>
                            (typeTitle === data?.message ||
                              typeTitle === "") && (
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
                                <td className={`txt-primary`}>
                                  {data?.message}
                                </td>
                                <td>{data?.type}</td>
                                <td>{data?.message}</td>
                                <td>
                                  {data?.address == null
                                    ? "N/A"
                                    : data?.address}
                                </td>
                              </tr>
                            ),
                        )
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
