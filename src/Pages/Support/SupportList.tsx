import { Card, CardBody, Col, Progress, Row } from "reactstrap";
import { H3 } from "../../AbstractElements";
import CountUp from "react-countup";
import ProfitAndLoss from "./ProfitAndLoss";
import { ticketData } from "./data/SupportData";
import { useSelector } from "react-redux";

const TicketList = () => {
  const { supportStatistics } = useSelector((state: any) => state.support);
  return (
    <Row
      style={{
        marginBottom: "20px",
      }}
    >
      
      {supportStatistics.map((item: any, index: any) => {
        if (index < 4) {
          return (
            <Col sm={12} xs={12} md={6} lg={3} xl={3} key={index}>
              <div
                style={{
                  margin: "5px",
                  boxShadow: "5px 5px 10px lightgray",
                  borderRadius: "15px",
                }}
              >
                <Card className="ecommerce-widget">
                  <CardBody className="support-ticket-font">
                    <Row>
                      <Col xs={9}>
                        {/* <span>{item.title}</span> */}
                        <H3 className="total-num counter">
                          <CountUp
                            end={item.value}
                            style={{
                              color: "black",
                              fontSize: "22px",
                              fontWeight: "bold",
                            }}
                          />
                        </H3>
                        {/* <span>{item.title}</span> */}
                        <span
                          style={{
                            color: "gray",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          {item.key}
                        </span>
                      </Col>
                      {/* <ProfitAndLoss /> */}
                      <Col xs={3}>
                        <div></div>
                      </Col>
                    </Row>
                    <Progress
                      className="sm-progress-bar mt-4"
                      color={
                        item.key == "Pending Tickets"
                          ? "danger"
                          : item.key == "New Tickets"
                          ? "seconadry"
                          : item.key == "Resolved Tickets"
                          ? "primary"
                          : "warning"
                      }
                      value={(item.value / supportStatistics[4].value) * 100}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        marginTop: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: `${
                            item.key == "Pending Tickets"
                              ? "info"
                              : item.key == "New Tickets"
                              ? "seconadry"
                              : item.key == "Resolved Tickets"
                              ? "primary"
                              : "warning"
                          }`,
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        {((item.value / supportStatistics[4].value) * 100)
                          .toFixed(1)
                          .toString()}
                        %
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Col>
          );
        }
      })}
    </Row>
  );
};

export default TicketList;
