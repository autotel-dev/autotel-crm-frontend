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
import { useSelector } from "react-redux";
import { formatUnderscoredString } from "../../../../../../../Utilities/globals/globals";

const CompletedTripAlerts = () => {
  const { completedAlerts } = useSelector((state: any) => state.alerts);

  const [dataList, setDataList]: any = useState([]);
  const [loading, setLoading] = useState(false);
  const tableHeader = [
    "Device",
    "Alert",
    "Type",
    "Message",
    "Server Time",
    "Completion Response",
  ];
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
  const containerRef = useRef(null);
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    if (completedAlerts.length > 12) {
      setDataList(completedAlerts.slice(0, 12));
    }
  }, [completedAlerts]);

  useEffect(() => {
    setDataList(completedAlerts.slice(0, 12));
  }, [completedAlerts]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const bottomOffset = scrollHeight - (scrollTop + clientHeight);
    if (bottomOffset < 50) {
      const nextBatch = completedAlerts.slice(
        dataList.length,
        dataList.length + 6
      );
      setDataList((prevData: any) => [...prevData, ...nextBatch]);
    }
  };

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
                placeholder="Search Completed Vehicles"
              />
            </FormGroup>
          </Row>

          <div className="table-responsive theme-scrollbar recent-wrapper">
            <Table className="display order-wrapper" id="recent-order">
              <thead>
                <tr>
                  {tableHeader.map((data, index) => (
                    <th
                      key={index}
                      style={{
                        width:
                          data === "Device" || data === "Type" ? "15%" : "20%",
                      }}
                    >
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
                      <td colSpan={7} style={{ fontSize: "25px" }}>
                        No Completed Alerts Found
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
                          <td style={{ width: "15%" }}>
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
                                    const adjustedDate = new Date(
                                      new Date(data.createdAt).setHours(
                                        new Date(data.createdAt).getHours()
                                      )
                                    );

                                    const hours24 = adjustedDate.getHours();
                                    const minutes = adjustedDate
                                      .getMinutes()
                                      .toString()
                                      .padStart(2, "0");
                                    const seconds = adjustedDate
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
                          <td
                            className={`txt-primary`}
                            style={{ width: "20%" }}
                          >
                            {extractBracketText(data?.message)}
                          </td>
                          <td style={{ width: "15%" }}>
                            {formatUnderscoredString(data.type)}
                          </td>
                          <td style={{ width: "20%" }}>
                            {extractBracketText(data?.message)}
                          </td>

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
                          <td style={{ width: "20%" }}>
                            {data.completionResponse}
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

export default CompletedTripAlerts;
