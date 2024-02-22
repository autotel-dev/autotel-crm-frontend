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
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, getImage, patch } from "../../Api";
import Loader from "../Loader/Loader";
import { setTicketDetails } from "../../ReaduxToolkit/Reducer/SupportSlice";

const TicketDetails = () => {
  const [itemsLength, setItemsLength] = useState(2);
  const [imageUrl, setImageUrl] = useState("");
  const [ticketImages, setTicketImages] = useState<any[]>([]);

  const { tableRow, ticketDetails } = useSelector(
    (state: any) => state.support
  );
  console.log("tableRow", tableRow);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Ref for the textarea element
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const dispatch = useDispatch();

  const handleGoToReply = () => {
    if (!textareaRef.current) return; // Ensure textareaRef.current exists
    // Scroll to the textarea
    (textareaRef.current as HTMLTextAreaElement).scrollIntoView({
      behavior: "smooth",
    });
    // Focus on the textarea
    (textareaRef.current as HTMLTextAreaElement).focus();
  };

  const handleChange = (e: any) => {
    const textValue = e.target.value;
    setReplyText(textValue);
    console.log(textValue);
  };
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    setAddModal(!addModal);
  };

  const [isHovered, setIsHovered] = useState(false);
  const [index, setIndex] = useState(0);

  const handleMouseEnter = (index: any) => {
    setIsHovered(true);
    setIndex(index);
  };
  const handleMouseLeave = (index: any) => {
    setIsHovered(false);
    setIndex(index);
  };

  useEffect(() => {
    setLoading(true);
    if (tableRow.status == "NEW") {
      console.log("IF");
      patch(
        { updatedStatus: "IN_PROGRESS" },
        {
          url: `support/bug-report/update-status/${tableRow.id}`,
        }
      ).then((data: any) => {
        console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            getAll({
              url: `support/bug-report/get-bug-report/${tableRow.id}`,
            }).then((data: any) => {
              console.log("api call --- >", data);
              if (data !== undefined) {
                if (data.success) {
                  dispatch(setTicketDetails(data.data.bugReport));
                  setLoading(false);
                  console.log("hhg");
                }
              }
            });
          }
        }
      });
    } else {
      console.log("Else");
      getAll({
        url: `support/bug-report/get-bug-report/${tableRow.id}`,
      }).then((data: any) => {
        console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            dispatch(setTicketDetails(data.data.bugReport));
            data.data.bugReport.images.map((image: any, index: any) => {
              console.log("image", image.url);
              setTicketImages([]);
              getImage({
                url: `http://124.29.238.127:8080/${image.url}`,
              }).then(async (data: any) => {
                console.log("image api --- >", data);
                setTicketImages((prevImages) => [...prevImages, data]);

                console.log("Ticket Images", ticketImages);
                console.log("objectURL: ", data);
              });
              if (index == data.data.bugReport.images.length - 1) {
                setLoading(false);
              }
            });
          }
        }
      });
    }
  }, []);

  const convertDateString = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = days[date.getDay()];
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? "AM" : "PM";

    // Convert to 12-hour format
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${day} ${hours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${amOrPm}`;
  };

  const sendMessage = () => {
    if (replyText.length > 0) {
      patch(
        { message: replyText },
        {
          url: `support/bug-report/${tableRow.id}/send-message`,
        }
      ).then((data: any) => {
        console.log("api call --- >", data);
        setReplyText("");
        if (data !== undefined) {
          if (data.success) {
            getAll({
              url: `support/bug-report/get-bug-report/${tableRow.id}`,
            }).then((data: any) => {
              console.log("api call --- >", data);
              if (data !== undefined) {
                if (data.success) {
                  dispatch(setTicketDetails(data.data.bugReport));
                  console.log("hhg");
                }
              }
            });
          }
        }
      });
    }
  };
  const calculateTimeAgo = (date: string) => {
    const currentTime = new Date();
    const previousTime = new Date(date);
    const timeDifference = Math.floor(
      (currentTime.getTime() - previousTime.getTime()) / 1000
    );
    const minutes = Math.floor(timeDifference / 60);
    const hours = Math.floor(timeDifference / 3600);
    const days = Math.floor(timeDifference / (3600 * 24));
    var time;

    if (minutes < 1) {
      time = "Just now";
    } else if (minutes === 1) {
      time = "1 min ago";
    } else if (minutes > 1 && minutes < 60) {
      time = `${minutes} mins ago`;
    } else if (hours > 0) {
      time = `${hours === 1 ? "1 hour" : `${hours} hours`} ago`;
    } else if (days > 0) {
      time = `${days === 1 ? "1 day" : `${days} days`} ago`;
    }
    return time;
  };

  // useEffect(() => {
  //   if (ticketDetails !== null) {
  //     const intervalId = setInterval(
  //       calculateTimeAgo(
  //         ticketDetails.messages[ticketDetails.messages.length - 1].updatedAt
  //       ),
  //       60000
  //     ); // Update every minute

  //     return () => clearInterval(intervalId);
  //   }
  // }, [ticketDetails]);
  return (
    <>
      <Breadcrumbs
        mainTitle="Ticket Details"
        parent={support}
        title="Ticket Details"
      />
      <Container fluid>
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
          {!loading ? (
            <CardBody>
              <Row>
                <Col sm={12} md={12} lg={9} xl={9}>
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
                      {ticketDetails.user.fullName}
                    </div>
                    <div
                      style={{
                        color: "blue",
                        fontWeight: "normal",
                        fontSize: "20px",
                        marginBottom: "10px",
                      }}
                    >
                      {ticketDetails.user.emailAddress}
                    </div>
                    <Row>
                      <Col md={9}>
                        <div
                          style={{
                            fontSize: "20px",
                            margin: "25px 0px",
                          }}
                        >
                          {ticketDetails.description}
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
                        {convertDateString(ticketDetails.createdAt)}
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
                        {ticketImages.length} Attachements
                      </div>
                    </div>
                    <div style={{ display: "flex" ,flexWrap:"wrap"}}>
                      {ticketImages.map((image, imageIndex) => (
                        <div
                          style={{
                            position: "relative",
                            marginRight: "20px",
                          }}
                          onMouseEnter={() => handleMouseEnter(imageIndex)}
                          onMouseLeave={() => handleMouseLeave(imageIndex)}
                          onClick={() => {
                            setImageUrl(image);
                            addToggle();
                          }}
                        >
                          <img
                            src={image}
                            alt=""
                            height={220}
                            width={350}
                            style={{ borderRadius: "10px" }}
                          />
                          {isHovered && index == imageIndex && (
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
                      ))}
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
                              src={imageUrl}
                              alt=""
                              height={350}
                              width="100%"
                            />
                          </div>
                        </ModalBody>
                      </Modal>
                    </div>
                    {ticketDetails.messages.length >= 1 && (
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
                              {
                                ticketDetails.messages[
                                  ticketDetails.messages.length - 1
                                ].messageText
                              }
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
                            {convertDateString(
                              ticketDetails.messages[
                                ticketDetails.messages.length - 1
                              ].createdAt
                            )}
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
                            margin: "5px 0px",
                          }}
                        >
                          {
                            ticketDetails.messages[
                              ticketDetails.messages.length - 1
                            ].user.fullName
                          }
                        </div>
                        <div
                          style={{
                            color: "blue",
                            fontWeight: "normal",
                            fontSize: "20px",
                            marginBottom: "10px",
                          }}
                        >
                          <a
                            href="#"
                            style={{ color: "blue", fontSize: "20px" }}
                          >
                            {
                              ticketDetails.messages[
                                ticketDetails.messages.length - 1
                              ].user.emailAddress
                            }
                          </a>
                        </div>
                      </div>
                    )}

                    {ticketDetails.messages.length >= 1 && (
                      <div
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "24px",
                        }}
                      >
                        Replies
                      </div>
                    )}
                    <div
                      style={{
                        overflowY: "auto",
                        maxHeight: "32vh", // Subtract scrollbar width from max height
                        WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
                        scrollbarWidth: "thin", // Specify scrollbar width
                        WebkitBorderRadius: "5px !important", // For WebKit browsers (Chrome, Safari)
                        MozBorderRadius: "5px !important", // For Mozilla Firefox
                        borderRadius: "5px !important", // For other browsers
                        scrollbarColor: "lightgray transparent", // Specify scrollbar color
                      }}
                    >
                      {ticketDetails.messages.map((reply: any, index: any) => {
                        if (index < itemsLength) {
                          return (
                            <div
                              style={{
                                backgroundColor: "whitesmoke",
                                padding: "15px",
                                borderRadius: "10px",
                                marginBottom: `${
                                  index == 2 &&
                                  index == ticketDetails.messages.length - 1
                                    ? "50px"
                                    : "20px"
                                }`,
                                marginTop: "10px",
                              }}
                            >
                              <Row>
                                <Col md={12}>
                                  <div
                                    style={{
                                      fontSize: "18px",
                                      margin: "10px 0px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                      }}
                                    >
                                      <div
                                        style={{
                                          backgroundColor: "black",
                                          color: "white",
                                          minWidth: "40px",
                                          height: "40px",
                                          borderRadius: "50px",
                                          textAlign: "center",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        SB
                                      </div>
                                      <div
                                        style={{
                                          margin: "0px 10px",
                                        }}
                                      >
                                        <div
                                          style={{
                                            color: "black",
                                            fontWeight: "bold",
                                            fontSize: "18px",
                                            marginTop: "-3px",
                                          }}
                                        >
                                          {reply.user.fullName}
                                        </div>
                                        <div
                                          style={{
                                            color: "gray",
                                            fontWeight: "normal",
                                            fontSize: "12px",
                                            marginTop: "-5px",
                                          }}
                                        >
                                          {reply.user.emailAddress}
                                        </div>
                                        <div
                                          style={{
                                            color: "black",
                                            fontSize: "16px",
                                            marginTop: "5px",
                                          }}
                                        >
                                          {reply.messageText}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          );
                        }
                      })}
                    </div>

                    {ticketDetails.messages.length > 2 && (
                      <div
                        style={{
                          display: "flex",
                          color: "gray",
                          fontSize: "18px",
                          justifyContent: "end",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (itemsLength == 2) {
                            setItemsLength(ticketDetails.messages.length);
                          } else {
                            setItemsLength(2);
                          }
                        }}
                      >
                        {itemsLength == 2 ? "Show More.." : "Show Less.."}
                      </div>
                    )}
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
                            onChange={handleChange}
                            value={replyText}
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
                                onClick={sendMessage}
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
                        // backgroundColor: "",
                        color: "white",
                        fontWeight: "bold",
                        padding: "20px",
                        fontSize: "25px",
                      }}
                      className="btn-primary"
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
                          {convertDateString(ticketDetails.createdAt)}
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
                          {ticketDetails.createdAt.toString().slice(0, 10)}
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
                          {ticketDetails.name}
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
                            color: "red",
                          }}
                        >
                          {ticketDetails.priorty}
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
                            color: "green",
                          }}
                        >
                          {ticketDetails.messages.length >= 1 &&
                            calculateTimeAgo(
                              ticketDetails.messages[
                                ticketDetails.messages.length - 1
                              ].updatedAt
                            )}
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
            </CardBody>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "80vh",
                backgroundColor: "white",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Loader />
              </div>
            </div>
          )}
        </Card>
      </Container>
    </>
  );
};

export default TicketDetails;
