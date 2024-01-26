import { Badge, Card, CardBody, Col, Row } from "reactstrap";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { totalEarningData } from "../../../Data/Dashboard/ShoppingPlace/TotalEarning";
import ReactApexChart from "react-apexcharts";
import { H1, H2, H3, H5, P } from "../../../AbstractElements";
import { useSelector } from "react-redux";
import DatabaseSize from "../../../assets/databaseSize.png";
import ServerUptime from "../../../assets/serverUptime.png";

const ServerHealthStatistics = () => {
  const { serverHealthStatistics, getTime } = useSelector(
    (state: any) => state.serverManagement
  );
  return (
    <>
      <Row>
        <Col xl="4" lg="6" sm="12" className="box-col-4">
          <Card className="total-earning">
            <CardBody>
              <Row>
                <Col sm="12" style={{ marginTop: "6px" }}>
                  <div className="flex-grow-1">
                    <H1>Database Size</H1>
                  </div>
                  <h3 style={{ marginTop: "10px", marginBottom: "15px" }}>
                    {serverHealthStatistics.databaseSize}
                  </h3>
                  <P className="d-flex">
                    <span style={{ fontSize: "12px" }}>Updated At :</span>
                    <span
                      style={{ fontSize: "12px" }}
                      className={`font-secondary me-2`}
                    >
                      {getTime}
                    </span>
                  </P>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col xl="4" lg="6" sm="12" className="box-col-4">
          <Card className="total-earning">
            <CardBody>
              <Row>
                {/* <Col sm="2" style={{ paddingRight: "0px" }}>
                  <div className="d-flex">
                    <Badge
                      color="transperant"
                      className={`bg-light-primary badge-rounded font-primary me-2`}
                    >
                      $
                    </Badge>
                  </div> */}
                {/* </Col> */}
                <Col sm="12" style={{ marginTop: "6px" }}>
                  <div className="flex-grow-1">
                    <H1>Server Uptime</H1>
                  </div>
                  <h3 style={{ marginTop: "10px", marginBottom: "15px" }}>
                    {serverHealthStatistics.upTime}
                  </h3>
                  <P className="d-flex">
                    {/* <span className={`bg-light-primary me-2`}>
                      <SVG iconId={data.icon} />
                    </span> */}
                    <span style={{ fontSize: "12px" }}>Updated At :</span>
                    <span
                      style={{ fontSize: "12px" }}
                      className={`font-secondary me-2`}
                    >
                      {getTime}
                    </span>
                  </P>
                </Col>
                {/* <Col sm="3" className={`box-col-5`}>
                  <img
                    src={DatabaseSize}
                    alt="DatabaseSize"
                    style={{ width: "60%" }}
                  />
                </Col> */}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ServerHealthStatistics;
