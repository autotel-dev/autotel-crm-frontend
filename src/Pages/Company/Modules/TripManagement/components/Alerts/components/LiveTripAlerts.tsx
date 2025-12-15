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
import { create, getAll } from "../../../../../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setAssignedAlerts,
  setCompletedAlerts,
  setLiveAlerts,
  setLiveAlertsData,
} from "../../../../../../../ReaduxToolkit/Reducer/AlertsSlice";
import Swal from "sweetalert2";
import Loader from "../../../../../../Utilities/Loader/Loader";
import { serverCredentials } from "../../../../../../../Utilities/headers/header";
import {
  formatUnderscoredString,
  getUserRole,
} from "../../../../../../../Utilities/globals/globals";
import {
  ASSIGN_ALERT_EVENT_TO_ME,
  ASSIGN_ALERT_EVENT_TO_ME_V2,
  COMPLETE_AN_ALERT_EVENT,
  GET_ALERT_EVENTS,
  GET_ALERT_EVENTS_V2,
  GET_ALL_ASSIGNED_ALERT_EVENTS,
  GET_ALL_COMPLETED_ALERT_EVENTS,
} from "../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../Utilities/constants/constants";

const LiveTripAlerts = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const { liveAlerts, liveAlertsData } = useSelector(
    (state: any) => state.alerts
  );
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var allAlertsPreview = userPermissions.find(
    (item: any) => item.title === "All Alerts Preview"
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
  const [assignLoading, setAssignLoading] = useState(true);
  const tableHeader = ["Device", "Alert", "Type", "Message", "Address"];
  const containerRef = useRef(null);
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    setDataList(liveAlerts.slice(0, 12));
  }, [liveAlerts]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const bottomOffset = scrollHeight - (scrollTop + clientHeight);
    if (bottomOffset < 50) {
      const nextBatch = liveAlerts.slice(dataList.length, dataList.length + 6);
      setDataList((prevData: any) => [...prevData, ...nextBatch]);
    }
    if (
      bottomOffset < 5 &&
      dataList.length == liveAlerts.length &&
      loading !== true &&
      liveAlertsData?.pagination?.totalPages > 1
    ) {
      setLoading(true);
      const url = `${GET_ALERT_EVENTS_V2}?page=${pageNo + 1}&limit=30`;
      getAll({ url: url }).then((data: any) => {
        if (data !== undefined) {
          if (data.success) {
            setPageNo((prevPageNo) => prevPageNo + 1);
            const temp = [...liveAlerts, ...data.data.rows];
            setLoading(false);
            dispatch(setLiveAlerts(temp));

            if (containerRef.current) {
              const containerHeight = (containerRef.current as HTMLElement)
                .clientHeight;
              const tableHeight = (containerRef.current as HTMLElement)
                .scrollHeight;
              const middlePosition = (tableHeight - containerHeight) / 2;

              (containerRef.current as HTMLElement).scrollTop = middlePosition;
            }
          }
          if (!data.success) {
            setLoading(false);
          }
        }
      });
    }
  };

  useEffect(() => {
    let intervalId: any;

    const fetchDataAndDispatch = () => {
      getAll({ url: `${GET_ALERT_EVENTS_V2}?page=1&limit=30` }).then(
        (data: any) => {
          if (data == undefined) {
            dispatch(setLiveAlerts([]));
            dispatch(setLiveAlertsData(null));
          } else {
            if (data.success) {
              setPageNo(1);
              dispatch(setLiveAlerts(data.data.rows));
              dispatch(setLiveAlertsData(data.data));
              setDataList(liveAlerts.slice(0, 12));
              if (containerRef.current) {
                (containerRef.current as HTMLElement).scrollTop = 0;
              }
            } else {
              dispatch(setLiveAlerts([]));
              dispatch(setLiveAlertsData(null));
            }
          }
        }
      );
    };

    intervalId = setInterval(() => {
      fetchDataAndDispatch();
    }, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const [searchValue, setSearchValue] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");

  function extractBracketText(message: string) {
    const match = message.match(/\[(.*?)\]/);
    return match ? match[1] : message;
  }

  return (
    <Col xl="6" lg="6">
      <Card>
        <div
          style={{
            backgroundColor:
              userPersonalizationData !== null &&
              userPersonalizationData?.buttonsAndBarsColor !== null
                ? userPersonalizationData?.buttonsAndBarsColor
                : "#63d5be",
            height: "40px",
            fontSize: "18px",
            padding: "10px",
            borderTopLeftRadius: "10px",
            color: "white",
            borderTopRightRadius: "10px",
          }}
        >
          <div>
            Live Alerts (
            {liveAlertsData == null
              ? 0
              : liveAlertsData?.pagination?.totalCount}
            )
          </div>
        </div>

        <CardBody>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Search Vehicles</P>
              <input
                className="form-control"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                placeholder="Search Vehicles"
              />
            </FormGroup>
          </Row>

          <Table className="display order-wrapper" id="recent-order">
            <thead>
              <tr>
                {tableHeader.map((data, index) => (
                  <th key={index} style={{ width: "20%" }}>
                    {data}
                  </th>
                ))}
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
              WebkitBorderRadius: "5px !important",
              MozBorderRadius: "5px !important",
              borderRadius: "5px !important",
              scrollbarColor: "lightgray transparent",
            }}
            onScroll={handleScroll}
          >
            <Table className="display order-wrapper" id="recent-order">
              <tbody>
                {dataList.length > 0 ? (
                  dataList
                    .filter((data: any) =>
                      data?.vehicle?.registrationNo
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )
                    .map((data: any, index: any) => (
                      <tr
                        key={index}
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
                        onClick={async () => {
                          if (data.preInfo == null) {
                            if (assignLoading) {
                              Swal.fire({
                                text: "Loading....",
                                icon: "info",
                                showConfirmButton: false,
                                allowOutsideClick: false,
                              });
                            }

                            const assignEvent = {
                              liveAlertEventId: data?._id,
                            };

                            try {
                              await create(assignEvent, {
                                url: ASSIGN_ALERT_EVENT_TO_ME_V2,
                              }).then((dataa: any) => {
                                if (
                                  !dataa.success &&
                                  dataa.message === ERROR_MESSAGE
                                ) {
                                  setAssignLoading(false);
                                }
                                if (dataa.success == false) {
                                  Swal.fire({
                                    text: `${dataa.message}`,
                                    icon: "error",
                                    timer: 2000,
                                    showConfirmButton: false,
                                  });

                                  setAssignLoading(false);
                                }

                                if (dataa.success) {
                                  setAssignLoading(false);
                                  var updatedAlerts = [...liveAlerts];
                                  updatedAlerts.splice(index, 1);

                                  setDataList(
                                    updatedAlerts.slice(0, dataList.length)
                                  );

                                  dispatch(setLiveAlerts(updatedAlerts));

                                  Swal.fire({
                                    text: "Assigned Successfully",
                                    icon: "success",
                                    timer: 1000,
                                    showConfirmButton: false,
                                  });
                                  getAll({
                                    url: GET_ALL_ASSIGNED_ALERT_EVENTS,
                                  }).then((data: any) => {
                                    if (data != undefined) {
                                      if (data.success) {
                                        dispatch(setAssignedAlerts(data.data));
                                        setAssignLoading(true);
                                      }
                                    }
                                  });
                                }
                              });
                            } catch (error: any) {
                            }
                          }
                        }}
                      >
                        <td style={{ width: "20%" }}>
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <h5
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}
                              >
                                {data?.vehicle?.registrationNo}
                              </h5>
                              <div style={{ fontSize: "10px" }}>
                                {data?.packetData?.serverTime?.slice(0, 10)}
                              </div>

                              <div style={{ fontSize: "10px" }}>
                                {(() => {
                                  const timeStr =
                                    data?.packetData?.serverTime?.slice(11, 19);

                                  const hours24 = parseInt(timeStr.slice(0, 2));
                                  const minutes = timeStr.slice(3, 5);
                                  const seconds = timeStr.slice(6, 8);

                                  const period = hours24 >= 12 ? "PM" : "AM";

                                  const hours12 = hours24 % 12 || 12;

                                  return `${hours12}:${minutes}:${seconds} ${period}`;
                                })()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`txt-primary`} style={{ width: "20%" }}>
                          {extractBracketText(data?.message)}
                        </td>
                        <td style={{ width: "20%" }}>
                          {formatUnderscoredString(data?.alertType)}
                        </td>
                        <td style={{ width: "20%" }}>
                          {extractBracketText(data?.message)}
                        </td>
                        <td id="addressLiveAlerts" style={{ width: "20%" }}>
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
                            target="addressLiveAlerts"
                          >
                            <PopoverHeader>Address</PopoverHeader>
                            <PopoverBody>{data.address}</PopoverBody>
                          </UncontrolledPopover>
                        )}
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ fontSize: "25px" }}>
                      No Live Alerts Found
                    </td>
                  </tr>
                )}
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
    </Col>
  );
};

export default LiveTripAlerts;
