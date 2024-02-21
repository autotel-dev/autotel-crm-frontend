import {
  Card,
  CardBody,
  Col,
  Container,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { support } from "../../utils/Constant";
import CommonHeader from "../../Common/CommonHeader";
import ticketImage from "../../assets/ticketImage.png";
import { IoSend } from "react-icons/io5";
import { useRef, useState } from "react";

const TicketDetails = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Ref for the textarea element

  const handleGoToReply = () => {
    if (!textareaRef.current) return; // Ensure textareaRef.current exists
    // Scroll to the textarea
    (textareaRef.current as HTMLTextAreaElement).scrollIntoView({
      behavior: "smooth",
    });
    // Focus on the textarea
    (textareaRef.current as HTMLTextAreaElement).focus();
  };
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    setAddModal(!addModal);
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <>
      <Breadcrumbs
        mainTitle="Ticket Details"
        parent={support}
        title="Ticket Details"
      />
      <Container fluid>
        <Row>
          <Col sm={12} md={12} lg={9} xl={9}>
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
                        position: "relative",
                        marginRight: "20px",
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={addToggle}
                    >
                      <img
                        src={ticketImage}
                        alt=""
                        height={220}
                        width={350}
                        style={{ borderRadius: "10px" }}
                      />
                      {isHovered && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0, 0, 0, 0.7)", // Light black color with opacity
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "20px",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            View Image
                          </span>
                        </div>
                      )}
                      {/* <div
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
                      </div> */}
                    </div>

                    <Modal
                      isOpen={addModal}
                      toggle={addToggle}
                      size="md"
                      centered
                    >
                      <ModalBody>
                        <div>
                          <div className="modal-header"></div>
                          <img
                            src={ticketImage}
                            alt=""
                            height={350}
                            width="100%"
                          />
                        </div>
                      </ModalBody>
                    </Modal>
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
                      <div
                        style={{
                          border: "1px solid lightgray",
                        }}
                      >
                        <textarea
                          ref={textareaRef}
                          className="form-control"
                          placeholder="Reply Here..."
                          rows={3} // Minimum number of visible lines
                          style={{
                            maxHeight: "100px", // Maximum height for 5 lines of text
                            resize: "vertical", // Allow vertical resizing within the specified range
                            borderRadius: "0px",
                            fontSize: "18px",
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

          <Col
            sm={12}
            md={12}
            lg={3}
            xl={3}
            style={{
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
            }}
          >
            <div>
              <div
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  fontWeight: "bold",
                  padding: "20px",
                  fontSize: "25px",
                }}
              >
                Tickets Info
              </div>
              <div
                style={{
                  backgroundColor: "white",
                  color: "gray",
                  padding: "15px",
                }}
              >
                <div
                  style={{
                    borderBottom: "1px solid #e1e1e1",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "25px 0px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      fontWeight: "bold",
                    }}
                  >
                    Ticket Id
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "black",
                    }}
                  >
                    #GH123
                  </div>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #e1e1e1",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "25px 0px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      fontWeight: "bold",
                    }}
                  >
                    Time
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "black",
                    }}
                  >
                    #GH123
                  </div>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #e1e1e1",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "25px 0px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      fontWeight: "bold",
                    }}
                  >
                    Date
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "black",
                    }}
                  >
                    #GH123
                  </div>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #e1e1e1",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "25px 0px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      fontWeight: "bold",
                    }}
                  >
                    Subject
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "black",
                    }}
                  >
                    #GH123
                  </div>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #e1e1e1",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "25px 0px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      fontWeight: "bold",
                    }}
                  >
                    Priority
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "black",
                    }}
                  >
                    #GH123
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "25px 0px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      fontWeight: "bold",
                    }}
                  >
                    Response
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "black",
                    }}
                  >
                    #GH123
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
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
                    onClick={handleGoToReply}
                  >
                    Go to Reply
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TicketDetails;
