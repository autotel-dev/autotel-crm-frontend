import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { support } from "../../utils/Constant";
import CommonHeader from "../../Common/CommonHeader";
import ticketImage from "../../assets/ticketImage.png";
import { IoSend } from "react-icons/io5";

const TicketDetails = () => {
  return (
    <>
      <Breadcrumbs
        mainTitle="Ticket Details"
        parent={support}
        title="Ticket Details"
      />
      <Container fluid>
        <Row>
          <Col sm={12}>
            <Card>
              <div
                style={{
                  padding: "0px 20px",
                }}
              >
                <CommonHeader
                  title="Ticket Details"
                  subTitle={[{ text: "Details of a Single Ticket..." }]}
                />
              </div>
              <CardBody>
                <div
                  style={{
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                  >
                    Abdullah Mamun
                  </div>
                  <div
                    style={{
                      color: "blue",
                      fontWeight: "normal",
                      fontSize: "20px",
                      marginBottom: "10px",
                    }}
                  >
                    Qomodosoft Digtal Agency
                  </div>
                  <Row>
                    <Col md={9}>
                      <div
                        style={{
                          fontSize: "20px",
                          margin: "25px 0px",
                        }}
                      >
                        hi Crancy Team, I am Poom. I am a senior student at King
                        Mongkut's Institute ofTechnology Ladkrabang. which is
                        doing a graduation project into thea aboutdesign
                        thinking. I'd like to know about your design template.
                        Did itgo through the design thinking process?
                      </div>
                      <div
                        style={{
                          fontSize: "20px",
                        }}
                      >
                        I desire answers for myresearch project. Thank you so
                        much&nbsp;
                        <a
                          href="#"
                          style={{
                            fontSize: "20px",
                            color: "blue",
                          }}
                        >
                          https://www.uplabs.cm/posts/bitcoin-exchange-website-dc1ca4cd-b206-4de0-96b0-0b
                        </a>
                        &nbsp;looking forward to hearing back from you.
                      </div>
                    </Col>
                    <Col
                      md={3}
                      style={{
                        color: "blue",
                        margin: "25px 0px",
                        fontSize: "20px",
                      }}
                    >
                      Sat 5:15 AM
                    </Col>
                  </Row>
                  <div
                    style={{
                      margin: "30px 0px",
                    }}
                  >
                    <hr />
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      3 Attachements
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        marginRight: "20px",
                      }}
                    >
                      <img
                        src={ticketImage}
                        alt=""
                        height={220}
                        width={350}
                        style={{ borderRadius: "10px" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontSize: "18px", color: "gray" }}>
                          Image name.png
                        </span>
                        <span style={{ fontSize: "18px", color: "gray" }}>
                          124kb
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        marginRight: "20px",
                      }}
                    >
                      <img
                        src={ticketImage}
                        alt=""
                        height={220}
                        width={350}
                        style={{ borderRadius: "10px" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontSize: "18px", color: "gray" }}>
                          Image name.png
                        </span>
                        <span style={{ fontSize: "18px", color: "gray" }}>
                          124kb
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        marginRight: "20px",
                      }}
                    >
                      <img
                        src={ticketImage}
                        alt=""
                        height={220}
                        width={350}
                        style={{ borderRadius: "10px" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontSize: "18px", color: "gray" }}>
                          Image name.png
                        </span>
                        <span style={{ fontSize: "18px", color: "gray" }}>
                          124kb
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#def4fb",
                      padding: "15px",
                      borderRadius: "10px",
                      margin: "50px 0px",
                    }}
                  >
                    <Row>
                      <Col md={9}>
                        <div
                          style={{
                            fontSize: "18px",
                            margin: "25px 0px",
                          }}
                        >
                          I woke up calmnnn i put it on the charger the phone
                          was into the fool turned off next to me i took it out
                          while i was sleeping of the mdind to i slept early
                          girl i slept at 3 end.
                        </div>
                        <div
                          style={{
                            fontSize: "18px",
                            margin: "25px 0px",
                          }}
                        >
                          1.Please use open Setting option. and go to Peanl
                          option.
                        </div>
                        <div
                          style={{
                            fontSize: "18px",
                          }}
                        >
                          2.In Windows 10, go to Settings &gt; Update & Security
                          &gt; Windows Update and click the Check for updates
                          button. If Windows 11 is waiting for you, it can then
                          be installed as an update.
                        </div>
                      </Col>

                      <Col
                        md={3}
                        style={{
                          color: "blue",
                          margin: "25px 0px",
                          fontSize: "20px",
                        }}
                      >
                        Sat 5:15 AM
                      </Col>
                    </Row>
                    <div
                      style={{
                        color: "gray",
                        fontWeight: "bold",
                        fontSize: "24px",
                        margin: "20px 0px",
                      }}
                    >
                      Regards
                    </div>
                    <div
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "24px",
                        margin: "15px 0px",
                      }}
                    >
                      Muhammad Bilal
                    </div>
                    <div
                      style={{
                        color: "blue",
                        fontWeight: "normal",
                        fontSize: "20px",
                        marginBottom: "10px",
                      }}
                    >
                      <a href="#" style={{ color: "blue", fontSize: "20px" }}>
                        Doanmo.com
                      </a>
                    </div>
                  </div>
                  <div>
                    <Col
                      md={12}
                      style={{
                        fontSize: "18px",
                        margin: "50px 0px",
                      }}
                    >
                      <div>
                        <textarea
                          className="form-control"
                          rows={3} // Minimum number of visible lines
                          style={{
                            maxHeight: "100px", // Maximum height for 5 lines of text
                            resize: "vertical", // Allow vertical resizing within the specified range
                          }}
                        />
                        <div
                          style={{
                            backgroundColor: "#ededed",
                            padding: "20px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div></div>
                          <div>
                            <button
                              className="btn btn-primary"
                              style={{
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "5px 20px",
                                margin: "0px 15px",
                                height: "50px",
                                width: "auto",
                                fontSize: "18px",
                                fontWeight: "bold",
                              }}
                              // onClick={addToggle}
                            >
                              <div style={{ marginRight: "10px" }}>
                                <IoSend color="white" />
                              </div>
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TicketDetails;
