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
import { IMAGE_BASE_URL, getAll, getImage, patch } from "../../Api";
import Loader from "../Loader/Loader";
import {
  setPriorityStatuses,
  setStatuses,
  setTicketDetails,
} from "../../ReaduxToolkit/Reducer/SupportSlice";
import { Select } from "antd";
import {
  formatUnderscoredString,
  getUserId,
  getUserRole,
} from "../../Api/globals";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ROLES } from "../../constants/roles";

const TicketDetails = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { ticketId } = useParams();
  const [itemsLength, setItemsLength] = useState(2);
  const [showMore, setShowMore] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [ticketImages, setTicketImages] = useState<any[]>([]);
  const [full, setFull] = useState(false);
  const [changeStatus, setChangeStatus] = useState("");
  const [changePriortyStatus, setChangePriortyStatus] = useState("");

  const { tableRow, ticketDetails } = useSelector(
    (state: any) => state.support
  );
  // // console.log("tableRow", tableRow);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Ref for the textarea element
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const dispatch = useDispatch();

  const handleGoToReply = () => {
    if (!textareaRef.current) return; // Ensure textareaRef.current exists
    // Scroll to the textarea
    (textareaRef.current as HTMLTextAreaElement).scrollIntoView({
      behavior: "smooth",
      block: "center", // Scroll to the center of the viewport
      inline: "nearest", // Scroll to the nearest edge of the viewport
    });
    // Focus on the textarea
    (textareaRef.current as HTMLTextAreaElement).focus();
  };

  const handleChange = (e: any) => {
    const textValue = e.target.value;
    setReplyText(textValue);
    // console.log(textValue);
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
    if (tableRow?.status === "NEW" && getUserRole() === ROLES.SUPER_ADMIN) {
      // console.log("IF");
      patch(
        { updatedStatus: "IN_PROGRESS", resolvingDate: null },
        {
          url: `support/bug-report/update-status/${ticketId}`,
        }
      ).then((data: any) => {
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            getAll({
              url: `support/bug-report/get-bug-report/${ticketId}`,
            }).then((data: any) => {
              // console.log("api call --- >", data);
              if (data !== undefined) {
                if (data.success) {
                  dispatch(setTicketDetails(data.data.bugReport));
                  setTicketImages([]);
                  if (data.data.bugReport.images.length === 0) {
                    setLoading(false);
                  }
                  data.data.bugReport.images.map((image: any, index: any) => {
                    // console.log("image", image.url);

                    getImage({
                      url: `${IMAGE_BASE_URL}/${image.url}`,
                    }).then(async (data: any) => {
                      // console.log("image api --- >", data);
                      setTicketImages((prevImages) => [...prevImages, data]);

                      // console.log("Ticket Images", ticketImages);
                      // console.log("objectURL: ", data);
                    });
                    if (index === data.data.bugReport.images.length - 1) {
                      setLoading(false);
                    }
                  });
                }
              }
            });
          }
        }
      });
    } else {
      // console.log("Else");
      getAll({
        url: `support/bug-report/get-bug-report/${ticketId}`,
      }).then((data: any) => {
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            dispatch(setTicketDetails(data.data.bugReport));
            setChangeStatus(ticketDetails?.status);
            setChangePriortyStatus(ticketDetails?.priorty);
            setTicketImages([]);
            if (data.data.bugReport.images.length === 0) {
              setLoading(false);
            }
            data.data.bugReport.images.map((image: any, index: any) => {
              // console.log("image", image.url);

              getImage({
                url: `${IMAGE_BASE_URL}/${image.url}`,
              }).then(async (data: any) => {
                // console.log("image api --- >", data);
                setTicketImages((prevImages) => [...prevImages, data]);

                // console.log("Ticket Images", ticketImages);
                // console.log("objectURL: ", data);
              });
              if (index === data.data.bugReport.images.length - 1) {
                setLoading(false);
              }
            });
          }
        }
      });
    }
  }, []);

  const convertDateString = (dateString: string): string => {
    // // console.log(dateString);

    var date = new Date(dateString);
    // // console.log("date", date.toUTCString());
    date = new Date(date.toUTCString());

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = days[date.getUTCDay()];
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? "AM" : "PM";

    // Convert to 12-hour format
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${day}, ${hours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${amOrPm}`;
  };

  const sendMessage = () => {
    if (replyText.length > 0) {
      patch(
        { message: replyText },
        {
          url: `support/bug-report/${ticketId}/send-message`,
        }
      ).then((data: any) => {
        // console.log("api call --- >", data);
        setReplyText("");
        if (data !== undefined) {
          if (data.success) {
            getAll({
              url: `support/bug-report/get-bug-report/${ticketId}`,
            }).then((data: any) => {
              // console.log("api call --- >", data);
              if (data !== undefined) {
                if (data.success) {
                  dispatch(setTicketDetails(data.data.bugReport));
                  if (data.data.bugReport.messages.length > 2) {
                    setItemsLength(data.data.bugReport.messages.length);
                  }

                  // console.log("hhg");
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
    let previousTime = new Date(date);

    // Adding 12 hours to the previousTime
    previousTime.setHours(previousTime.getHours() + 12);

    const timeDifference = Math.floor(
      (currentTime.getTime() - previousTime.getTime()) / 1000
    ); // Difference in seconds
    // // console.log("current ", currentTime);
    // // console.log("previous ", previousTime.toUTCString());

    const minutes = Math.floor(timeDifference / 60);
    const hours = Math.floor(timeDifference / 3600);
    const days = Math.floor(timeDifference / (3600 * 24));
    // // console.log("timeDifference", timeDifference);
    // // console.log("minutes", minutes);
    // // console.log("hours", hours);
    // // console.log("days", days);
    let time;

    if (minutes < 1) {
      time = "Just now";
    } else if (minutes === 1) {
      time = "1 min ago";
    } else if (minutes < 60) {
      time = `${minutes} mins ago`;
    } else if (hours < 24) {
      time = `${hours === 1 ? "1 hour" : `${hours} hours`} ago`;
    } else {
      time = `${days === 1 ? "1 day" : `${days} days`} ago`;
    }
    return time;
  };
  const [isEdit, setEdit] = useState(false);

  const handleEdit = () => {
    setEdit(!isEdit);
    if (isEdit) {
      // console.log("function call");
      patch(
        { updatedStatus: changeStatus, resolvingDate: null },
        {
          url: `support/bug-report/update-status/${ticketId}`,
        }
      ).then((data: any) => {
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
            setEdit(false);
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setEdit(false);
          }
          if (data.success) {
            patch(
              { updatedPriortyStatus: changePriortyStatus },
              {
                url: `support/bug-report/update-priorty-status/${ticketId}`,
              }
            ).then((data: any) => {
              // console.log("api call --- >", data);
              if (data !== undefined) {
                if (data.success) {
                  getAll({
                    url: `support/bug-report/get-bug-report/${ticketId}`,
                  }).then((data: any) => {
                    // console.log("api call --- >", data);
                    if (data !== undefined) {
                      if (data.success) {
                        dispatch(setTicketDetails(data.data.bugReport));
                        setEdit(false);
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  };

  const handleResolved = () => {
    // console.log("function call");
    patch(
      { updatedStatus: "RESOLVED", resolvingDate: new Date() },
      {
        url: `support/bug-report/update-status/${ticketId}`,
      }
    ).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
        }
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          setTimeout(() => {
            Swal.fire({
              text: `${data.message}`,
              icon: "success",
              timer: 2000,
            });
          }, 2000);
          getAll({
            url: `support/bug-report/get-bug-report/${ticketId}`,
          }).then((data: any) => {
            // console.log("api call --- >", data);
            if (data !== undefined) {
              if (data.success) {
                dispatch(setTicketDetails(data.data.bugReport));
              }
            }
          });
        }
      }
    });
  };

  const { priorityStatuses, statuses } = useSelector(
    (state: any) => state.support
  );
  // console.log(priorityStatuses);
  const [priorityStatusesList, setPriorityStatusesList] = useState([]);
  const [statusesList, setStatusesList] = useState([]);
  const tempPriorityStatusesList: any = [];
  const tempStatusesList: any = [];

  useEffect(() => {
    getAll({ url: "support/bug-report/get-priorty-status-types" }).then(
      (data: any) => {
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            // console.log("hhg");
            dispatch(
              setPriorityStatuses(data.data.bugReportPriortyStatusTypes)
            );
            priorityStatuses?.map((item: any, index: any) => {
              tempPriorityStatusesList.push({
                value: `${item.value}`,
                label: `${item.title}`,
              });
            });
            setPriorityStatusesList(tempPriorityStatusesList);
          }
        }
      }
    );
  }, [priorityStatuses]);

  useEffect(() => {
    getAll({ url: "support/bug-report/get-status-types" }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setStatuses(data.data.bugReportStatusTypes));
          statuses?.forEach((item: any) => {
            if (item.value !== "RESOLVED") {
              tempStatusesList.push({
                value: `${item.value}`,
                label: `${item.title}`,
              });
            }
          });
          setStatusesList(tempStatusesList);
        }
      }
    });
  }, [statuses]);

  return (
    <>
      <Breadcrumbs
        mainTitle="Ticket Details"
        parent={support}
        title="Ticket Details"
      />
      <Container fluid>
        <Card>
          <Row>
            <Col sm={9} md={9} lg={9} xl={9} xxl={7}>
              <div
                style={{
                  padding: "0px 20px",
                }}
              >
                {!loading && (
                  <CommonHeader
                    title={`${ticketDetails.name.slice(0, 75)}
                ${ticketDetails.name.length > 75 ? "..." : ""}`}
                  />
                )}
              </div>
            </Col>
          </Row>

          {!loading ? (
            <CardBody>
              <Row>
                <Col sm={12} md={12} lg={12} xl={12} xxl={9}>
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
                      {ticketDetails.user.fullName} -&nbsp;
                      {formatUnderscoredString(ticketDetails.user.role)}
                    </div>
                    <div
                      style={{
                        color: `${
                          userPersonalizationData !== null &&
                          userPersonalizationData?.buttonsAndBarsColor !== null
                            ? userPersonalizationData?.buttonsAndBarsColor
                            : "#35bfbf"
                        }`,
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
                          {full
                            ? ticketDetails.description
                            : ticketDetails.description.slice(0, 500)}{" "}
                          {ticketDetails.description.length > 500 && "...."}
                          {ticketDetails.description.length > 500 && (
                            <div
                              style={{
                                color: "#35bfbf",
                                cursor: "pointer",
                                fontWeight: "bold",
                              }}
                              // className="btn-primary"
                              onClick={() => {
                                setFull(!full);
                              }}
                            >
                              {full ? "Show Less" : "Show More"}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col
                        md={3}
                        style={{
                          color: `${
                            userPersonalizationData !== null &&
                            userPersonalizationData?.buttonsAndBarsColor !== null
                              ? userPersonalizationData?.buttonsAndBarsColor
                              : "#35bfbf"
                          }`,
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
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {ticketImages.map((image, imageIndex) => (
                        <div
                          style={{
                            position: "relative",
                            marginRight: "20px",
                            marginBottom: "20px",
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
                            height={200}
                            width={300}
                            style={{
                              borderRadius: "10px",
                              border: "0.5px solid lightgray",
                            }}
                          />
                          {isHovered && index === imageIndex && (
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
                        size="lg"
                        centered
                      >
                        <ModalBody>
                          <div>
                            <div className="modal-header"></div>
                            <img
                              src={imageUrl}
                              alt=""
                              height={500}
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
                          marginLeft: "10%",
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
                              color: `${
                                userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor !== null
                                  ? userPersonalizationData?.buttonsAndBarsColor
                                  : "#35bfbf"
                              }`,
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
                            style={{
                              color: `${
                                userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor !== null
                                  ? userPersonalizationData?.buttonsAndBarsColor
                                  : "#35bfbf"
                              }`,
                              fontSize: "20px",
                            }}
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
                        if (showMore) {
                          return (
                            <div
                              style={{
                                backgroundColor:
                                  getUserId() === reply.user._id
                                    ? "#def4fb"
                                    : "whitesmoke",
                                padding: "15px",
                                marginLeft:
                                  getUserId() === reply.user._id
                                    ? "40%"
                                    : "0px",
                                marginRight:
                                  getUserId() === reply.user._id
                                    ? "0px"
                                    : "40%",
                                borderRadius: "10px",
                                marginBottom: `${
                                  index === 2 &&
                                  index === ticketDetails.messages.length - 1
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
                                        {reply.user.fullName
                                          .slice(0, 1)
                                          .toUpperCase()}
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
                        } else {
                          if (index < 2) {
                            return (
                              <div
                                style={{
                                  backgroundColor:
                                    getUserId() === reply.user._id
                                      ? "#def4fb"
                                      : "whitesmoke",
                                  marginLeft:
                                    getUserId() === reply.user._id
                                      ? "40%"
                                      : "0px",
                                  marginRight:
                                    getUserId() === reply.user._id
                                      ? "0px"
                                      : "40%",
                                  padding: "15px",
                                  borderRadius: "10px",
                                  marginBottom: `${
                                    index === 2 &&
                                    index === ticketDetails.messages.length - 1
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
                                          {reply.user.fullName
                                            .slice(0, 1)
                                            .toUpperCase()}
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
                        }
                      })}
                    </div>

                    {ticketDetails.messages.length > 2 && (
                      <div
                        style={{
                          display: "flex",
                          color: "#35bfbf",
                          fontSize: "18px",
                          justifyContent: "end",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                        onClick={() => {
                          setShowMore(!showMore);
                          // if (itemsLength === 2) {
                          //   setItemsLength(ticketDetails.messages.length);
                          //   setShowMore(true);
                          // } else {
                          //   setItemsLength(2);
                          //   setShowMore(false);
                          // }
                        }}
                      >
                        {showMore ? "Show Less.." : "Show More.."}
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
                        {formatUnderscoredString(ticketDetails.status) !==
                          "Resolved" && (
                          <div
                            style={{
                              border: "1px solid lightgray",
                            }}
                          >
                            <textarea
                              ref={textareaRef}
                              onChange={handleChange}
                              value={replyText}
                              className="form-control replyText"
                              placeholder="Reply Here..."
                              rows={3} // Minimum number of visible lines
                              style={{
                                maxHeight: "100px", // Maximum height for 5 lines of text
                                resize: "vertical", // Allow vertical resizing within the specified range
                                borderRadius: "0px",
                                fontSize: "20px",
                                overflowY: "auto",
                                WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
                                scrollbarWidth: "thin", // Specify scrollbar width
                                WebkitBorderRadius: "5px !important", // For WebKit browsers (Chrome, Safari)
                                MozBorderRadius: "5px !important", // For Mozilla Firefox
                                scrollbarColor: "lightgray transparent", // Specify scrollbar color
                                outline: "0px",
                                border: "0px",
                              }}
                            />
                            <style>
                              {`
    .replyText::placeholder {
      font-size: 18px;
  }`}
                            </style>
                            <div
                              style={{
                                backgroundColor: "whitesmoke",
                                padding: "20px",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div></div>
                              <div style={{ display: "flex" }}>
                                {getUserRole() === ROLES.SUPER_ADMIN && (
                                  <button
                                    className={`btn ${
                                      userPersonalizationData?.buttonsAndBarsColor ==
                                      null
                                        ? "btn-primary"
                                        : ""
                                    }`}
                                    disabled={
                                      formatUnderscoredString(
                                        ticketDetails.status
                                      ) === "Resolved"
                                    }
                                    style={{
                                      color: "white",
                                      backgroundColor: `${
                                        userPersonalizationData !== null &&
                                        userPersonalizationData?.buttonsAndBarsColor
                                      }`,
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
                                    onClick={() => {
                                      Swal.fire({
                                        title: "Complete Alert",
                                        text: "Are you sure , you want to complete this ticket",
                                        icon: "warning",
                                        showCancelButton: true,
                                      }).then(async (result) => {
                                        if (result.isConfirmed) {
                                          try {
                                            Swal.fire({
                                              text: "Loading...",
                                              icon: "info",
                                              // timer: 2000,
                                              showCancelButton: false,
                                              showConfirmButton: false,
                                            });
                                            handleResolved();
                                            // Handle successful post creation (e.g., show a success message, redirect, etc.)
                                          } catch (error) {
                                            // Handle error (e.g., show an error message)
                                            // console.error(
                                            //   "Error creating post:",
                                            //   error
                                            // );
                                            // loading false
                                          }
                                        }
                                      });
                                    }}
                                  >
                                    {formatUnderscoredString(
                                      ticketDetails.status
                                    ) === "Resolved"
                                      ? "Completed"
                                      : "Complete"}
                                  </button>
                                )}
                                <button
                                  className={`btn ${
                                    userPersonalizationData?.buttonsAndBarsColor ==
                                    null
                                      ? "btn-primary"
                                      : ""
                                  }`}
                                  style={{
                                    color: "white",
                                    backgroundColor: `${
                                      userPersonalizationData !== null &&
                                      userPersonalizationData?.buttonsAndBarsColor
                                    }`,
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
                        )}
                      </Col>
                    </div>
                  </div>
                </Col>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  xxl={3}
                  style={{
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        backgroundColor: `${
                          userPersonalizationData !== null &&
                          userPersonalizationData?.buttonsAndBarsColor !== null
                            ? userPersonalizationData?.buttonsAndBarsColor
                            : "#35bfbf"
                        }`,
                        color: "white",
                        fontWeight: "bold",
                        padding: "20px",
                        fontSize: "25px",
                      }}
                      // className="btn-primary"
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
                          {ticketDetails.ticketId}
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
                          {ticketDetails.name.slice(0, 16)}
                          {ticketDetails.name.length > 16 && "...."}
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
                        {isEdit ? (
                          <Select
                            defaultValue={ticketDetails.priorty}
                            showSearch
                            style={{ width: 200, height: 36 }}
                            placeholder="Select Priority"
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                              (option?.label ?? "").includes(input)
                            }
                            filterSort={(optionA: any, optionB: any) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
                            }
                            onChange={(e) => {
                              // console.log(e);
                              setChangePriortyStatus(e);
                            }}
                            options={priorityStatusesList}
                          />
                        ) : (
                          <div
                            style={{
                              fontSize: "20px",
                              color:
                                ticketDetails.priorty === "LOW"
                                  ? "green"
                                  : ticketDetails.priorty === "HIGH"
                                  ? "red"
                                  : "orange",
                              fontWeight: "bold",
                            }}
                          >
                            {formatUnderscoredString(ticketDetails.priorty)}
                          </div>
                        )}
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
                          Status
                        </div>
                        {isEdit ? (
                          <Select
                            defaultValue={ticketDetails.status}
                            showSearch
                            style={{ width: 200, height: 36 }}
                            placeholder="Select Status"
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                              (option?.label ?? "").includes(input)
                            }
                            filterSort={(optionA: any, optionB: any) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
                            }
                            onChange={(e) => {
                              // console.log(e);
                              setChangeStatus(e);
                            }}
                            options={statusesList}
                          />
                        ) : (
                          <div
                            style={{
                              fontSize: "20px",
                              color:
                                ticketDetails.status === "NEW"
                                  ? "blue"
                                  : ticketDetails.status === "IN_PROGRESS"
                                  ? "orange"
                                  : ticketDetails.status === "PENDING"
                                  ? "red"
                                  : "green",
                              fontWeight: "bold",
                            }}
                          >
                            {formatUnderscoredString(ticketDetails.status)}
                          </div>
                        )}
                      </div>
                      {ticketDetails.resolvingDate !== null && (
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
                            Resolving Date
                          </div>
                          <div
                            style={{
                              fontSize: "20px",
                              color: "black",
                            }}
                          >
                            {ticketDetails.resolvingDate
                              .toString()
                              .slice(0, 10)}
                          </div>
                        </div>
                      )}
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
                            fontWeight: "bold",
                          }}
                        >
                          {ticketDetails.messages.length >= 1
                            ? calculateTimeAgo(
                                ticketDetails.messages[
                                  ticketDetails.messages.length - 1
                                ].updatedAt
                              )
                            : "N/A"}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {formatUnderscoredString(ticketDetails.status) !==
                          "Resolved" && (
                          <button
                            className={`btn ${
                              userPersonalizationData?.buttonsAndBarsColor == null
                                ? "btn-primary"
                                : ""
                            }`}
                            style={{
                              color: "white",
                              backgroundColor: `${
                                userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor
                              }`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "5px 0px",
                              margin: "0px 0px",
                              height: "50px",
                              width: "130px",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                            onClick={handleGoToReply}
                          >
                            Go to Reply
                          </button>
                        )}
                        {getUserRole() === ROLES.SUPER_ADMIN &&
                          formatUnderscoredString(ticketDetails.status) !==
                            "Resolved" && (
                            <button
                              className={`btn ${
                                userPersonalizationData?.buttonsAndBarsColor == null
                                  ? "btn-primary"
                                  : ""
                              }`}
                              style={{
                                color: "white",
                                backgroundColor: `${
                                  userPersonalizationData !== null &&
                                  userPersonalizationData?.buttonsAndBarsColor
                                }`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "5px 0px",
                                margin: "0px 0px",
                                height: "50px",
                                width: "130px",
                                fontSize: "18px",
                                fontWeight: "bold",
                              }}
                              onClick={handleEdit}
                            >
                              {isEdit ? "Save" : "Edit"}
                            </button>
                          )}
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
