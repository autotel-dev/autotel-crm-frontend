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
import { H3, H4, H5, P } from "../../../../../../../AbstractElements";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { create, getAll } from "../../../../../../../Utilities/api";
import { serverCredentials } from "../../../../../../../Utilities/headers/header";
import { setModalData } from "../../../../../../../ReaduxToolkit/Reducer/AlertsSlice";
import Swal from "sweetalert2";
import {
  GET_ALERT_EVENT_BY_ID,
  GET_ALERT_EVENT_BY_ID_v2,
} from "../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../Utilities/constants/constants";
import { formatUnderscoredString } from "../../../../../../../Utilities/globals/globals";

const AssignedTripAlerts = () => {
  const dispatch = useDispatch();
  const { assignedAlerts, liveAlertsData } = useSelector(
    (state: any) => state.alerts
  );
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var allAlertsPreview = userPermissions.find(
    (item: any) => item.title === "All Alerts Preview"
  );

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  function hexToRgb(hex: any) {
    hex = hex?.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor);

  const [dataList, setDataList]: any = useState([]);
  const [loading, setLoading] = useState(false);
  const tableHeader = [
    "Device",
    "Alert",
    "Type",
    "Message",
    "Server Time",
  ];
  const containerRef = useRef(null);

  useEffect(() => {
    if (assignedAlerts.length > 12) {
      setDataList(assignedAlerts.slice(0, 12));
    }
  }, [assignedAlerts]);

  useEffect(() => {
    setDataList(assignedAlerts.slice(0, 12));
  }, [assignedAlerts]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const bottomOffset = scrollHeight - (scrollTop + clientHeight);
    if (bottomOffset < 50) {
      const nextBatch = assignedAlerts.slice(
        dataList.length,
        dataList.length + 6
      );
      setDataList((prevData: any) => [...prevData, ...nextBatch]);
    }
  };

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [basicTab, setBasicTab] = useState("1");
  const [searchValue, setSearchValue] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");

  function extractBracketText(message: string) {
    const match = message.match(/\[(.*?)\]/);
    return match ? match[1] : message;
  }

  return (
    <Col xl="12" lg="12">
      <Card>
        <CardBody>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Search Vehicles</P>
              <input
                className="form-control"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                placeholder="Search Assigned Vehicles"
              />
            </FormGroup>
          </Row>

          <div className="table-responsive theme-scrollbar recent-wrapper">
            <Table className="display order-wrapper" id="recent-order">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Alert</th>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Server Time</th>
                </tr>
              </thead>
            </Table>
            <div
              ref={containerRef}
              className="table-responsive theme-scrollbar recent-wrapper"
              style={{
                overflowY: "scroll",
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
              <Table className="display order-wrapper" id="recent-order">
                <tbody>
                  {dataList.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ fontSize: "25px" }}>
                        No Assigned Alerts Found
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
                        <tr
                          key={index}
                          onClick={async () => {
                            console.log("data", data);
                            setBasicTab("1");
                            setIsUpdateModalOpen(true);

                            try {
                              await getAll({
                                url: `${GET_ALERT_EVENT_BY_ID_v2}/${data._id}`,
                              }).then((data: any) => {
                                if (
                                  !data.success &&
                                  data.message === ERROR_MESSAGE
                                ) {
                                }
                                if (!data.success) {
                                  Swal.fire({
                                    text: `${data.message}`,
                                    icon: "error",
                                    timer: 2000,
                                    showConfirmButton: false,
                                  });
                                  setIsUpdateModalOpen(false);
                                }
                                if (data.success) {
                                  dispatch(setModalData(data.data));
                                }
                              });
                            } catch (error: any) {
                              dispatch(setModalData(undefined));
                            }
                          }}
                          onMouseEnter={() => {
                            setIsHovered(true);
                            setIdd(index);
                          }}
                          onMouseLeave={() => setIsHovered(false)}
                          style={{
                            backgroundColor:
                              isHovered && idd == index
                                ? userPersonalizationData == null
                                  ? "#D6EEEE"
                                  : `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`
                                : "transparent",
                            transition: "background-color 0.3s",
                            cursor: "pointer",
                          }}
                        >
                          <td>
                            <div className="d-flex">
                              <div className="flex-grow-1">
                                <h5
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {data.deviceName}
                                </h5>
                                <div style={{ fontSize: "10px" }}>
                                  {new Date(
                                    new Date(data.createdAt).setHours(
                                      new Date(data.createdAt).getHours() + 5
                                    )
                                  )
                                    .toISOString()
                                    .slice(0, 10)}
                                </div>

                                <div style={{ fontSize: "10px" }}>
                                  {(() => {
                                    const originalDate = new Date(
                                      data.createdAt
                                    );

                                    originalDate.setHours(
                                      originalDate.getHours()
                                    );

                                    const hours24 = originalDate.getHours();
                                    const minutes = originalDate
                                      .getMinutes()
                                      .toString()
                                      .padStart(2, "0");
                                    const seconds = originalDate
                                      .getSeconds()
                                      .toString()
                                      .padStart(2, "0");

                                    const period = hours24 >= 12 ? "PM" : "AM";

                                    const hours12 = hours24 % 12 || 12;

                                    return `${hours12}:${minutes}:${seconds} ${period}`;
                                  })()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={`txt-primary`}>
                            {extractBracketText(data?.message)}
                          </td>
                          <td style={{ width: "20%" }}>
                            {formatUnderscoredString(data.type)}
                          </td>
                          <td>{extractBracketText(data?.message)}</td>

                          <td style={{ width: "15%" }}>
                            <div style={{ fontSize: "10px" }}>
                              {data.serverDateAndTime.slice(0, 10)}
                            </div>

                            <div style={{ fontSize: "10px" }}>
                              {(() => {
                                const timeStr = data.serverDateAndTime.slice(
                                  11,
                                  19
                                );

                                const hours24 = parseInt(timeStr.slice(0, 2));
                                const minutes = timeStr.slice(3, 5);
                                const seconds = timeStr.slice(6, 8);

                                const period = hours24 >= 12 ? "PM" : "AM";

                                const hours12 = hours24 % 12 || 12;

                                return `${hours12}:${minutes}:${seconds} ${period}`;
                              })()}
                            </div>
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
    </Col>
  );
};

export default AssignedTripAlerts;
