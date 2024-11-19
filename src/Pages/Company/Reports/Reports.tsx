import { Col, Container, Row, Input, Form, Card } from "reactstrap";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import ReportsList from "./ReportsList";
import ReportsListNav from "./ReportsListNav";
import { getAll } from "../../../Utilities/api";
import Swal from "sweetalert2";
import "../../../CssConstaints/Style.css";
import Loader from "../../Utilities/Loader/Loader";
import {
  setIsConnected,
  setReportstype,
} from "../../../ReaduxToolkit/Reducer/ReportsSlice";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import { Flex } from "antd";
import {
  GET_ALL_REPORT_TYPES,
  GET_DEVICES,
} from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

const Reports = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const groups: any = [];
  const groupDevicesObj: any = {};
  const initialGroupDevices: any = [];
  const [dropDownDevices, setDropDownDevices] = useState([]);
  const [undefinedData, setUndefinedData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportTypes, setReportTypes] = useState([]);
  const { isConnected } = useSelector((state: any) => state.reports);
  const { devices } = useSelector((state: any) => state.monitoring);

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const getData = () => {
    setLoading(true);
    getAll({ url: GET_DEVICES }).then((data: any) => {
      // console.log("data", data);
      if (data == undefined) {
        setUndefinedData(true);
        setLoading(false);
        Swal.fire({
          text: "Failed to Fetch due to connection refused",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
      if (data !== undefined) {
        if (!data.success) {
          setLoading(false);
          Swal.fire({
            text: "Failed to Fetch the devices",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          setUndefinedData(false);
          // console.log("api call --- >", data);
          // console.log("length --- >", data.data.length);

          setDropDownDevices(data.data.allDevices);
          for (let i = 0; i < data.data.allDevices.length; i++) {
            const element = data.data.allDevices[i].title;
            if (!groups.includes(element)) {
              groups.push(element);
            }
          }

          groups.forEach((title: any) => {
            groupDevicesObj[title] = data.data.allDevices
              .filter((obj: any) => obj.title === title)
              .map((item: any) => ({ ...item, checked: false }));
          });

          // Convert groupDevicesObj to initialGroupDevices array format
          Object.keys(groupDevicesObj).forEach((title: any) => {
            initialGroupDevices.push({
              title,
              checked: false,
              items: groupDevicesObj[title],
            });
          });

          // Update state with initialGroupDevices
          setDropDownDevices(initialGroupDevices);
          setLoading(false);

          // ---------------------- For device status-----------------------------------
        }
      }
    });
  };

  useEffect(() => {
    if (devices.length === 0) {
      getData();
    } else {
      setDropDownDevices(devices);
      setLoading(false);
    }

    getAll({ url: GET_ALL_REPORT_TYPES }).then((data: any) => {
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setIsConnected(true));
        }
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          // console.log("api call --- >", data);
          // console.log("length --- >", data.data.allReportTypes);
          dispatch(setReportstype(data.data.allReportTypes));
        }
      }
    });
  }, []);

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle="Reports List"
            parent="Reports"
            title="Reports List"
          />
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "80vh",
                backgroundColor: "white",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Loader />
              </div>
            </div>
          ) : (
            <Container fluid>
              <Row className="project-card">
                <Col md={12} className="project-list">
                  <Card>
                    <ReportsListNav dropDownDevices={dropDownDevices} />
                    <Col md={12}>
                      <input
                        className="global-search-field"
                        type="text"
                        placeholder="Type to Search.."
                        value={searchValue}
                        onChange={(e) => {
                          // filterCountriess(e);
                        }}
                        // style={{
                        //   backgroundColor: "#f1f1f1",
                        //   borderRadius: "5px",
                        //   padding: "15px",
                        //   margin: "15px",
                        //   width: "calc(100% - 30px)", // Adjusting width to accommodate padding and margin
                        //   border: "none",
                        //   outline: "none", // Removing default border outline
                        // }}
                      />
                    </Col>
                  </Card>
                </Col>
                <Col sm={12}>
                  <ReportsList />
                </Col>
              </Row>
            </Container>
          )}
        </div>
      )}
    </>
  );
};

export default Reports;
