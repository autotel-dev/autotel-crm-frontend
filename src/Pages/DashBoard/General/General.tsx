import { Card, CardBody, CardHeader, Col, Progress, Row } from "reactstrap";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { H3, H5, P, Image, LI, UL } from "../../../AbstractElements";
import { boxesData1, boxesData2, operatorPerformanceData } from "./GeneralData";

import { Link } from "react-router-dom";
import { dynamicImage } from "../../../Service";
import { Href } from "../../../utils/Constant";
import { Button } from "reactstrap";
import { Fragment } from "react";

const General = () => {
  return (
    <Col xl="12" lg="12" md="12" sm="12">
      <Row style={{ display: "flex" }}>
        <Col xl="3">
          <Card className="widget-sell">
            <CardBody className="pb-0">
              <Row>
                {boxesData1.map((data, index) => (
                  <Col xl="12" lg="12" sm="12" className="mb-3" key={index}>
                    <div className="sale">
                      <H3>{data.title}</H3>
                      <H5>{data.count}</H5>
                      <P className="d-flex">
                        <span className={`bg-light-${data.color} me-2`}>
                          <SVG iconId={data.svgIcon} />
                        </span>
                        <span className={`font-${data.color}`}>
                          {data.percentage}
                        </span>
                      </P>
                      <span className="sale-title">{data.time}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col xl="6">
          <Row>
            <Col xl="12" lg="12">
              <Card className="deal-open">
                <CardHeader className="pb-0">
                  <div className="header-top">
                    <H3 className="m-0">Operator Performance</H3>
                  </div>
                </CardHeader>
                <CardBody>
                  <UL className="theme-scrollbar">
                    {operatorPerformanceData.map((data, index) => (
                      <li
                        className="d-flex align-items-center"
                        key={index}
                        style={{
                          padding: "1px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <Image
                            src={dynamicImage(
                              `dashboard-2/user/${data.img}.jpg`
                            )}
                            alt=""
                          />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Link className="ms-2" to={Href}>
                              <H5>{data.title}</H5>
                              <span>{data.subTitle}</span>
                            </Link>
                          </div>
                        </div>
                        {/* <div className="flex-grow-1 ms-2">
                          <H5>{data.duration}</H5>
                          <span>{data.date}</span>
                        </div> */}
                        <div
                          style={{
                            textAlign: "center",
                            width: "30%",
                            alignItems: "center",
                          }}
                        >
                          <H5>50%</H5>
                          <Fragment key={index}>
                            <Progress
                              value={50}
                              className="mb-4"
                              striped={true}
                              color="success"
                              animated={true}
                            >
                              50
                            </Progress>
                          </Fragment>
                          {/* <Button
                            color="transperant"
                            className="bg-light-primary txt-primary"
                          >
                            {data.btn}
                          </Button> */}
                        </div>
                      </li>
                    ))}
                  </UL>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xl="3">
          <Card className="widget-sell">
            <CardBody className="pb-0">
              <Row>
                {boxesData2.map((data, index) => (
                  <Col xl="12" lg="12" sm="12" className="mb-3" key={index}>
                    <div className="sale">
                      <H3>{data.title}</H3>
                      <H5>{data.count}</H5>
                      <P className="d-flex">
                        <span className={`bg-light-${data.color} me-2`}>
                          <SVG iconId={data.svgIcon} />
                        </span>
                        <span className={`font-${data.color}`}>
                          {data.percentage}
                        </span>
                      </P>
                      <span className="sale-title">{data.time}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default General;
