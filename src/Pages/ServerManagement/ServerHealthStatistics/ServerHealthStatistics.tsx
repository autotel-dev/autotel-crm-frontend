import { Badge, Card, CardBody, Col, Row } from "reactstrap";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { totalEarningData } from "../../../Data/Dashboard/ShoppingPlace/TotalEarning";
import ReactApexChart from "react-apexcharts";
import { H3, H5, P } from "../../../AbstractElements";
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
                <Col sm="12" className="box-col-7">
                  {/* <div className="d-flex">
                    <Badge
                      color="transperant"
                      className={`bg-light-primary badge-rounded font-primary me-2`}
                    >
                      $
                    </Badge>
                    <div className="flex-grow-1">
                      <H3>Server Uptime</H3>
                    </div>
                  </div> */}
                  <div className="d-flex">
                    <div className="flex-grow-1" style={{marginBottom:"20px"}}>
                      <H3>Server Uptime</H3>
                    </div>
                  </div>
                  <div className="d-flex">
                    <Badge
                      color="transperant"
                      className={`bg-light-primary badge-rounded font-primary me-2`}
                    >
                      $
                    </Badge>
                    <div className="flex-grow-1">
                      <H5>{serverHealthStatistics.upTime}</H5>
                    </div>
                  </div>
                  {/* <H5>{serverHealthStatistics.upTime}</H5> */}
                  <P className="d-flex">
                    <span className={`bg-light-primary me-2`}>
                      {/* <SVG iconId={data.icon} /> */}
                    </span>
                    <span className={` me-2`}>Updated At :</span>
                    <span className="font-secondary">{getTime}</span>
                  </P>
                </Col>
                {/* <Col sm="3" className={`box-col-5`}>
                  <img
                    src={ServerUptime}
                    alt="DatabaseSize"
                    style={{ width: "80%" }}
                  />
                </Col> */}
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col xl="4" lg="6" sm="12" className="box-col-4">
          <Card className="total-earning">
            <CardBody>
              <Row>
                <Col sm="12" className="box-col-7">
                  <div className="d-flex">
                    <Badge
                      color="transperant"
                      className={`bg-light-primary badge-rounded font-primary me-2`}
                    >
                      $
                    </Badge>
                    <div className="flex-grow-1">
                      <H3>Database Size</H3>
                    </div>
                  </div>
                  <H5>{serverHealthStatistics.databaseSize}</H5>
                  <P className="d-flex">
                    <span className={`bg-light-primary me-2`}>
                      {/* <SVG iconId={data.icon} /> */}
                    </span>
                    <span className={`font-secondary me-2`}>Updated At :</span>
                    <span>{getTime}</span>
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
