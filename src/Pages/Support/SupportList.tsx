import { Card, CardBody, Col, Progress, Row } from "reactstrap";
import { H3 } from "../../AbstractElements";
import CountUp from "react-countup";
import ProfitAndLoss from "./ProfitAndLoss";
import { ticketData } from "./data/SupportData";

const TicketList = () => {
  return (
    <Row
      style={{
        marginBottom: "20px",
      }}
    >
      {ticketData.map((item, index) => (
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
                  <Col xs={6}>
                    {/* <span>{item.title}</span> */}
                    <H3 className="total-num counter">
                      <CountUp
                        end={item.num}
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
                      Total Tickets
                    </span>
                  </Col>
                  {/* <ProfitAndLoss /> */}
                  <Col xs={6}>
                    <div>
                     
                    </div>
                  </Col>
                </Row>
                <Progress
                  className="sm-progress-bar mt-4"
                  color={item.class}
                  value={70}
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
                      color: "red",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    55.5%
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default TicketList;
