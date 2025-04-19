import {
  Card,
  CardBody,
  Col,
  Container,
  Modal,
  ModalBody,
  Row,
  Spinner,
} from "reactstrap";

import { support } from "../../../../utils/Constant";
import CommonHeader from "../../../../Common/CommonHeader";
import ticketImage from "../../assets/ticketImage.png";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, getImage, patch } from "../../../../Utilities/api";
import Loader from "../../../Utilities/Loader/Loader";
import "./ComplainDetails.css";

import { Select } from "antd";
import {
  formatUnderscoredString,
  getUserId,
  getUserRole,
} from "../../../../Utilities/globals/globals";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ROLES } from "../../../../constants/roles";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import {
  setComplainDetails,
  setComplainPriorityTypes,
  setComplainStatusTypes,
} from "../../../../ReaduxToolkit/Reducer/ComplainCenterSlice";
import {
  GET_COMPLAINT_CENTER_PRIORITY_STATUS,
  GET_COMPLAINT_CENTER_STATUS_TYPES,
  GET_INTERNAL_COMPLAIN_BY_ID,
  SEND_INTERNAL_COMPLAINT_MESSAGE,
  UPDATE_INTERNAL_COMPLAINT,
} from "../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../Utilities/constants/constants";

const ComplainDetails = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { complaintId } = useParams();
  const [itemsLength, setItemsLength] = useState(2);
  const [showMore, setShowMore] = useState(false);
  const [full, setFull] = useState(false);

  const { tableRow, complainDetails } = useSelector(
    (state: any) => state.complainCenter
  );
  const [changeStatus, setChangeStatus] = useState("");
  const [changePriortyStatus, setChangePriortyStatus] = useState("");
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

  // useEffect(() => {
  //   setLoading(true);
  //   if (tableRow?.status === "NEW") {
  //     // console.log("IF");
  //     patch(
  //       {
  //         updatedStatus: "IN_PROGRESS",
  //         updatedPriortyStatus: changePriortyStatus,
  //         resolvingDate: null,
  //       },
  //       {
  //         url: `${UPDATE_INTERNAL_COMPLAINT}/${complaintId}`,
  //       }
  //     ).then((data: any) => {
  //       // console.log("api call --- >", data);
  //       if (data !== undefined) {
  //         if (data.success) {
  //           getAll({
  //             url: `${GET_INTERNAL_COMPLAIN_BY_ID}/${complaintId}`,
  //           }).then((data: any) => {
  //             // console.log("api call --- >", data);
  //             if (data !== undefined) {
  //               if (data.success) {
  //                 dispatch(setComplainDetails(data.data.internalComplaint));
  //                 setLoading(false);
  //               }
  //             }
  //           });
  //         }
  //       }
  //     });
  //   } else {
  //     // console.log("Else");
  //     getAll({
  //       url: `${GET_INTERNAL_COMPLAIN_BY_ID}/${complaintId}`,
  //     }).then((data: any) => {
  //       // console.log("api call --- >", data);
  //       if (data !== undefined) {
  //         if (data.success) {
  //           dispatch(setComplainDetails(data.data.internalComplaint));
  //           setChangeStatus(complainDetails?.status);
  //           setChangePriortyStatus(complainDetails?.priorty);
  //           setLoading(false);
  //         }
  //       }
  //     });
  //   }
  // }, []);

  const [isUpdate, setIsUpdate] = useState("");
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    // Send the initial state to other tabs when UserDetail mounts
    window.opener.postMessage(isUpdate, window.location.origin);
  }, [isUpdate]);

  const handleChangeUpdatedStatus = (newValue: any) => {
    setIsUpdate(newValue);
    // Send the updated state to other tabs

    window.opener.postMessage(newValue, window.location.origin);
  };

  useEffect(() => {
    setLoading(true);
    getAll({
      url: `${GET_INTERNAL_COMPLAIN_BY_ID}/${complaintId}`,
    }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          dispatch(setComplainDetails(data.data.internalComplaint));
          setChangeStatus(data.data.internalComplaint.status);
          setChangePriortyStatus(data.data.internalComplaint.priorty);
          setLoading(false);
          // console.log("data.data.internalComplaint.status", data.data.internalComplaint.status);
        }
      }
    });
  }, []);
  useEffect(() => {
    if (complainDetails?.status == "NEW") {
      // console.log("complainDetails?.status == NEW");

      // console.log("IF");
      patch(
        {
          updatedStatus: "IN_PROGRESS",
          updatedPriortyStatus: complainDetails?.priorty,
          resolvingDate: null,
        },
        {
          url: `${UPDATE_INTERNAL_COMPLAINT}/${complaintId}`,
        }
      ).then((data: any) => {
        handleChangeUpdatedStatus("updated");
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            getAll({
              url: `${GET_INTERNAL_COMPLAIN_BY_ID}/${complaintId}`,
            }).then((data: any) => {
              // console.log("api call --- >", data);
              if (data !== undefined) {
                if (data.success) {
                  dispatch(setComplainDetails(data?.data?.internalComplaint));
                  setChangeStatus(data?.data?.internalComplaint?.status);
                  setChangePriortyStatus(
                    data?.data?.internalComplaint?.priorty
                  );
                  setStatusLoading(false);
                }
              }
            });
          }
        }
      });
    } else {
      setStatusLoading(false);
    }
  }, [complainDetails]);

  const convertDateString = (dateString: string) => {
    const currentTime = new Date(dateString);
    // const options = { timeZone: timezone };
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(currentTime);

    return formattedDate;
  };

  const convertDateForComplainInfo = (dateString: string) => {
    const currentTime = new Date(dateString);
    // const options = { timeZone: timezone };
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(currentTime);

    return formattedDate;
  };
  const convertTimeForComplainInfo = (dateString: string) => {
    const currentTime = new Date(dateString);
    // const options = { timeZone: timezone };
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(currentTime);

    return formattedDate;
  };

  // const convertDateString = (dateString: string): string => {
  //   // // console.log(dateString);

  //   var date = new Date(dateString);
  //   // // console.log("date", date.toUTCString());
  //   date = new Date(date.toUTCString());

  //   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //   const day = days[date.getUTCDay()];
  //   let hours = date.getHours();
  //   const minutes = date.getMinutes();
  //   const amOrPm = hours >= 12 ? "PM" : "AM";

  //   // Convert to 12-hour format
  //   if (hours > 12) {
  //     hours -= 12;
  //   } else if (hours === 0) {
  //     hours = 12;
  //   }

  //   return `${day}, ${hours}:${minutes < 10 ? "0" + minutes : minutes
  //     } ${amOrPm}`;
  // };
  // const convertDateString = (dateString: string): string => {
  //   const date = new Date(dateString);
  //   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //   const monthValues = [
  //     "Jan",
  //     "Feb",
  //     "Mar",
  //     "Apr",
  //     "May",
  //     "Jun",
  //     "July",
  //     "Aug",
  //     "Sept",
  //     "Oct",
  //     "Nov",
  //     "Dec",
  //   ];
  //   const day = date.getDate();
  //   const month = monthValues[date.getMonth()];
  //   let hours = date.getHours();
  //   const minutes = date.getMinutes();
  //   const amOrPm = hours >= 12 ? "PM" : "AM";

  //   // Convert to 12-hour format
  //   if (hours > 12) {
  //     hours -= 12;
  //   } else if (hours === 0) {
  //     hours = 12;
  //   }

  //   return `${day}${
  //     day > 4 ? "th" : day == 1 ? "st" : day == 2 ? "nd" : day == 3 && "rd"
  //   } ${month} , ${hours}:${minutes < 10 ? "0" + minutes : minutes} ${amOrPm}`;
  // };

  const [sendMessageLoading, setSendMessageLoading] = useState(false);

  const sendMessage = () => {
    if (replyText.length > 0) {
      patch(
        { message: replyText },
        {
          url: `${SEND_INTERNAL_COMPLAINT_MESSAGE}/${complaintId}/send-message`,
        }
      ).then((data: any) => {
        // setSendMessageLoading(false);
        // console.log("api call --- >", data);
        setReplyText("");
        if (data !== undefined) {
          if (data.success) {
            setTimeout(() => {
              setSendMessageLoading(false);
            }, 1000);
            getAll({
              url: `${GET_INTERNAL_COMPLAIN_BY_ID}/${complaintId}`,
            }).then((data: any) => {
              // console.log("api call --- >", data);
              if (data !== undefined) {
                if (data.success) {
                  dispatch(setComplainDetails(data?.data?.internalComplaint));
                  if (data?.data?.internalComplaint?.messages.length > 2) {
                    setItemsLength(
                      data?.data?.internalComplaint?.messages?.length
                    );
                  }
                }
              }
            });
          }
        }
      });
    } else {
      setSendMessageLoading(false);
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
        {
          updatedStatus:
            changeStatus == "" ? complainDetails?.status : changeStatus,
          updatedPriortyStatus:
            changePriortyStatus == ""
              ? complainDetails?.priorty
              : changePriortyStatus,
          resolvingDate: null,
        },
        {
          url: `${UPDATE_INTERNAL_COMPLAINT}/${complaintId}`,
        }
      ).then((data: any) => {
        handleChangeUpdatedStatus("updated");
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (!data.success && data.message === ERROR_MESSAGE) {
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
            getAll({
              url: `${GET_INTERNAL_COMPLAIN_BY_ID}/${complaintId}`,
            }).then((data: any) => {
              // console.log("api call --- >", data);
              if (data !== undefined) {
                if (data.success) {
                  dispatch(setComplainDetails(data?.data?.internalComplaint));
                  setEdit(false);
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
      {
        updatedStatus: "RESOLVED",
        updatedPriortyStatus:
          changePriortyStatus == ""
            ? complainDetails?.priorty
            : changePriortyStatus,
        resolvingDate: new Date(),
      },
      {
        url: `${UPDATE_INTERNAL_COMPLAINT}/${complaintId}`,
      }
    ).then((data: any) => {
      handleChangeUpdatedStatus("updated");
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
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
            url: `${GET_INTERNAL_COMPLAIN_BY_ID}/${complaintId}`,
          }).then((data: any) => {
            // console.log("api call --- >", data);
            if (data !== undefined) {
              if (data.success) {
                dispatch(setComplainDetails(data.data.internalComplaint));
              }
            }
          });
        }
      }
    });
  };

  const { complainPriorityTypes, complainStatusTypes } = useSelector(
    (state: any) => state.complainCenter
  );
  // console.log(priorityStatuses);
  const [priorityStatusesList, setPriorityStatusesList] = useState([]);
  const [statusesList, setStatusesList] = useState([]);
  const tempPriorityStatusesList: any = [];
  const tempStatusesList: any = [];

  useEffect(() => {
    // console.log("called get-priorty-status-types");

    getAll({ url: GET_COMPLAINT_CENTER_PRIORITY_STATUS }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(
            setComplainPriorityTypes(
              data.data.internalComplaintPriortyStatusTypes
            )
          );
          data.data.internalComplaintPriortyStatusTypes?.map(
            (item: any, index: any) => {
              tempPriorityStatusesList.push({
                value: `${item.value}`,
                label: `${item.title}`,
              });
            }
          );
          setPriorityStatusesList(tempPriorityStatusesList);
        }
      }
    });
  }, []);

  useEffect(() => {
    // console.log("called get-status-types");
    getAll({ url: GET_COMPLAINT_CENTER_STATUS_TYPES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(
            setComplainStatusTypes(data.data.internalComplaintStatusTypes)
          );
          data.data.internalComplaintStatusTypes?.forEach((item: any) => {
            if (item.value !== "RESOLVED" && item.value !== "NEW") {
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
  }, []);

  return (
    <>
      <Breadcrumbs
        mainTitle="Complaint Details"
        parent="Complaint Center"
        title="Complaint Details"
      />
      <Container fluid>
        <Card>
          <Row>
            <Col sm={9} md={9} lg={9} xl={9} xxl={7}>
              <div
                style={{
                  padding: "20px 25px",
                }}
              >
                <div
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "24px",
                  }}
                >
                  Device Name -&nbsp;
                  <span
                    style={{
                      color: `${
                        userPersonalizationData !== null &&
                        userPersonalizationData?.buttonsAndBarsColor !== null
                          ? userPersonalizationData?.buttonsAndBarsColor
                          : "#35bfbf"
                      }`,
                    }}
                  >
                    {complainDetails?.deviceName}
                  </span>
                </div>
              </div>
            </Col>
          </Row>

          {!loading ? (
            <CardBody>
              <Row>
                <Col sm={12} md={12} lg={12} xl={12} xxl={9}>
                  <div
                    style={{
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "24px",
                      }}
                    >
                      {complainDetails?.createdBy?.fullName} -&nbsp;
                      {formatUnderscoredString(
                        complainDetails?.createdBy?.role
                      )}
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
                        fontSize: "16px",
                        marginBottom: "5px",
                      }}
                    >
                      {complainDetails.createdBy.emailAddress}
                    </div>
                    <Row>
                      <Col md={9}>
                        <div
                          style={{
                            fontSize: "20px",
                            margin: "15px 0px",
                          }}
                        >
                          {full
                            ? complainDetails.description
                            : complainDetails.description.slice(0, 500)}{" "}
                          {complainDetails.description.length > 500 && "...."}
                          {complainDetails.description.length > 500 && (
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
                            userPersonalizationData?.buttonsAndBarsColor !==
                              null
                              ? userPersonalizationData?.buttonsAndBarsColor
                              : "#35bfbf"
                          }`,
                          margin: "25px 0px",
                          fontSize: "14px",
                        }}
                      >
                        {convertDateString(complainDetails?.createdAt)}
                      </Col>
                    </Row>
                    <div
                      style={{
                        margin: "5px 0px",
                      }}
                    >
                      <hr />
                    </div>

                    {complainDetails?.messages?.length >= 1 && (
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
                                margin: "15px 0px",
                              }}
                            >
                              {
                                complainDetails?.messages[
                                  complainDetails?.messages?.length - 1
                                ]?.messageText
                              }
                            </div>
                          </Col>

                          <Col
                            md={3}
                            style={{
                              color: `${
                                userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor !==
                                  null
                                  ? userPersonalizationData?.buttonsAndBarsColor
                                  : "#35bfbf"
                              }`,
                              margin: "2px 0px",
                              fontSize: "12px",
                            }}
                          >
                            {convertDateString(
                              complainDetails?.messages[
                                complainDetails?.messages?.length - 1
                              ]?.createdAt
                            )}
                          </Col>
                        </Row>
                        <div
                          style={{
                            color: "gray",
                            fontWeight: "bold",
                            fontSize: "12px",
                            margin: "2px 0px",
                          }}
                        >
                          Regards
                        </div>
                        <div
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "12px",
                            margin: "2px 0px",
                          }}
                        >
                          {
                            complainDetails?.messages[
                              complainDetails.messages?.length - 1
                            ]?.user?.fullName
                          }
                        </div>
                        <div
                          style={{
                            color: "blue",
                            fontWeight: "normal",
                            fontSize: "12px",
                            marginBottom: "2px",
                          }}
                        >
                          <a
                            href="#"
                            style={{
                              color: `${
                                userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor !==
                                  null
                                  ? userPersonalizationData?.buttonsAndBarsColor
                                  : "#35bfbf"
                              }`,
                              fontSize: "16px",
                            }}
                          >
                            {
                              complainDetails.messages[
                                complainDetails.messages.length - 1
                              ].user.emailAddress
                            }
                          </a>
                        </div>
                      </div>
                    )}

                    {complainDetails.messages.length >= 1 && (
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
                      {complainDetails.messages.map(
                        (reply: any, index: any) => {
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
                                    index ===
                                      complainDetails.messages.length - 1
                                      ? "50px"
                                      : "20px"
                                  }`,
                                  marginTop: "10px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "18px",
                                    margin: "10px 0px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      width: "100%",
                                      justifyContent: "space-between",
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
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%",
                                          }}
                                        >
                                          <div
                                            style={{
                                              color: "black",
                                              fontWeight: "bold",
                                              fontSize: "18px",
                                              marginTop: "-3px",
                                              width: "320px",
                                            }}
                                          >
                                            {reply.user.fullName}
                                          </div>
                                          <div
                                            style={{
                                              color: "black",
                                              fontSize: "12px",
                                            }}
                                          >
                                            {convertDateString(reply.createdAt)}
                                          </div>
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
                                </div>
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
                                      index ===
                                        complainDetails.messages.length - 1
                                        ? "50px"
                                        : "20px"
                                    }`,
                                    marginTop: "10px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "18px",
                                      margin: "10px 0px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "space-between",
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
                                              display: "flex",
                                              justifyContent: "space-between",
                                              width: "100%",
                                            }}
                                          >
                                            <div
                                              style={{
                                                color: "black",
                                                fontWeight: "bold",
                                                fontSize: "18px",
                                                marginTop: "-3px",
                                                width: "320px",
                                              }}
                                            >
                                              {reply.user.fullName}
                                            </div>
                                            <div
                                              style={{
                                                color: "black",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {convertDateString(
                                                reply.createdAt
                                              )}
                                            </div>
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
                                  </div>
                                </div>
                              );
                            }
                          }
                        }
                      )}
                    </div>

                    {complainDetails.messages.length > 2 && (
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
                          //   setItemsLength(complainDetails.messages.length);
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
                        {formatUnderscoredString(complainDetails.status) !==
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
                                <button
                                  className={`btn ${
                                    userPersonalizationData?.buttonsAndBarsColor ==
                                    null
                                      ? "btn-primary"
                                      : ""
                                  }`}
                                  disabled={replyText.length == 0}
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
                                      title: "Complete Complain",
                                      text: "Are you sure , you want to complete this complain",
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
                                    complainDetails?.status
                                  ) === "Resolved"
                                    ? "Completed"
                                    : "Complete"}
                                </button>
                                {/* <button
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
                                  onClick={() => {
                                    setSendMessageLoading(true);
                                    sendMessage();
                                  }}
                                  disabled={replyText.length == 0}
                                >
                                  <div style={{ marginRight: "10px" }}>
                                    <IoSend color="white" />
                                  </div>
                                  {sendMessageLoading ? "Loading.." : "Send"}
                                </button> */}
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
                                  onClick={() => {
                                    setSendMessageLoading(true);
                                    sendMessage();
                                  }}
                                  disabled={replyText.length == 0}
                                >
                                  {sendMessageLoading ? (
                                    <>
                                      <Spinner
                                        color="light"
                                        size="sm"
                                        style={{ marginRight: "10px" }}
                                      />
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      <div style={{ marginRight: "10px" }}>
                                        <IoSend color="white" />
                                      </div>
                                      Send
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Col>
                    </div>
                  </div>
                </Col>
                {statusLoading ? (
                  <>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      xxl={3}
                      style={{
                        marginBottom: "20px",
                        // marginRight: "20px",
                      }}
                    >
                      <Col
                        xl="12"
                        lg="12"
                        md="12"
                        sm="12"
                        style={{
                          marginBottom: "20px",
                        }}
                        className="skeletons"
                      ></Col>
                      <Col
                        xl="12"
                        lg="12"
                        md="12"
                        sm="12"
                        className="skeletons"
                      ></Col>
                    </Col>
                  </>
                ) : (
                  <>
                    {" "}
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
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              backgroundColor: `${
                                userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor !==
                                  null
                                  ? userPersonalizationData?.buttonsAndBarsColor
                                  : "#35bfbf"
                              }`,
                              color: "white",
                              fontWeight: "bold",
                              padding: "10px",
                              fontSize: "18px",
                            }}
                            // className="btn-primary"
                          >
                            Vehicle Info
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
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Customer Name
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "black",
                                }}
                              >
                                {complainDetails.deviceInfo.customerName == ""
                                  ? "N/A"
                                  : complainDetails.deviceInfo.customerName}
                              </div>
                            </div>
                            <div
                              style={{
                                borderBottom: "1px solid #e1e1e1",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Mobile No 1
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "black",
                                }}
                              >
                                {complainDetails.deviceInfo.mobileNo1 == ""
                                  ? "N/A"
                                  : complainDetails.deviceInfo.mobileNo1}
                              </div>
                            </div>
                            <div
                              style={{
                                borderBottom: "1px solid #e1e1e1",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Mobile No 2
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "black",
                                }}
                              >
                                {complainDetails.deviceInfo.mobileNo2 == ""
                                  ? "N/A"
                                  : complainDetails.deviceInfo.mobileNo2}
                              </div>
                            </div>
                            <div
                              style={{
                                borderBottom: "1px solid #e1e1e1",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Vehcile Name
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "black",
                                }}
                              >
                                {complainDetails.deviceInfo.vehicleName == ""
                                  ? "N/A"
                                  : complainDetails.deviceInfo.vehicleName}
                              </div>
                            </div>
                            <div
                              style={{
                                borderBottom: "1px solid #e1e1e1",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Sim Number
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "black",
                                }}
                              >
                                {complainDetails.deviceInfo.simNumber == ""
                                  ? "N/A"
                                  : complainDetails.deviceInfo.simNumber}
                              </div>
                            </div>

                            <div
                              style={{
                                borderBottom: "1px solid #e1e1e1",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                IMEI
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "black",
                                }}
                              >
                                {complainDetails.deviceInfo.imei == ""
                                  ? "N/A"
                                  : complainDetails.deviceInfo.imei}
                              </div>
                            </div>
                            <div
                              style={{
                                borderBottom: "1px solid #e1e1e1",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Device Model
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "black",
                                }}
                              >
                                {complainDetails.deviceInfo.deviceModel == ""
                                  ? "N/A"
                                  : complainDetails.deviceInfo.deviceModel}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* -----------------------------------Vehicle Info-------------------- */}

                        <div>
                          <div
                            style={{
                              backgroundColor: `${
                                userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor !==
                                  null
                                  ? userPersonalizationData?.buttonsAndBarsColor
                                  : "#35bfbf"
                              }`,
                              color: "white",
                              fontWeight: "bold",
                              padding: "10px",
                              marginTop: "10px",
                              fontSize: "18px",
                            }}
                            // className="btn-primary"
                          >
                            Complain Info
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
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Complain Id
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "black",
                                }}
                              >
                                {complainDetails.complaintId}
                              </div>
                            </div>

                            <div
                              style={{
                                borderBottom: "1px solid #e1e1e1",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Date
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "black",
                                }}
                              >
                                {convertDateForComplainInfo(
                                  complainDetails.createdAt
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                borderBottom: "1px solid #e1e1e1",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Time
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "black",
                                }}
                              >
                                {convertTimeForComplainInfo(
                                  complainDetails.createdAt
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                borderBottom: "1px solid #e1e1e1",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Type
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "black",
                                }}
                              >
                                {complainDetails.type.title}
                              </div>
                            </div>
                            <div
                              style={{
                                borderBottom: "1px solid #e1e1e1",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Priority
                              </div>
                              {isEdit ? (
                                <Select
                                  defaultValue={complainDetails?.priorty}
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
                                    fontSize: "16px",
                                    color:
                                      complainDetails.priorty === "LOW"
                                        ? "green"
                                        : complainDetails.priorty === "HIGH"
                                        ? "red"
                                        : "orange",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {formatUnderscoredString(
                                    complainDetails.priorty
                                  )}
                                </div>
                              )}
                            </div>

                            <div
                              style={{
                                borderBottom: "1px solid #e1e1e1",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Status
                              </div>
                              {isEdit ? (
                                <Select
                                  defaultValue={complainDetails?.status}
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
                                    fontSize: "16px",
                                    color:
                                      complainDetails.status === "NEW"
                                        ? "blue"
                                        : complainDetails.status ===
                                          "IN_PROGRESS"
                                        ? "orange"
                                        : complainDetails.status === "PENDING"
                                        ? "red"
                                        : "green",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {formatUnderscoredString(
                                    complainDetails.status
                                  )}
                                </div>
                              )}
                            </div>
                            {complainDetails.resolvingDate !== null && (
                              <div
                                style={{
                                  borderBottom: "1px solid #e1e1e1",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "8px 0px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "16px",
                                    color: "gray",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Resolving Date
                                </div>
                                <div
                                  style={{
                                    fontSize: "16px",
                                    color: "black",
                                  }}
                                >
                                  {complainDetails.resolvingDate
                                    .toString()
                                    .slice(0, 10)}
                                </div>
                              </div>
                            )}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0px",
                                marginBottom: "10px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "gray",
                                  fontWeight: "bold",
                                }}
                              >
                                Response
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "green",
                                  fontWeight: "bold",
                                }}
                              >
                                {complainDetails.messages.length >= 1
                                  ? calculateTimeAgo(
                                      complainDetails.messages[
                                        complainDetails.messages.length - 1
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
                              {formatUnderscoredString(
                                complainDetails.status
                              ) !== "Resolved" && (
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
                                    padding: "2px 0px",
                                    margin: "0px 0px",
                                    height: "50px",
                                    width: "130px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                  onClick={handleGoToReply}
                                >
                                  Go to Reply
                                </button>
                              )}
                              {formatUnderscoredString(
                                complainDetails.status
                              ) !== "Resolved" && (
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
                                    padding: "2px 0px",
                                    margin: "0px 0px",
                                    height: "50px",
                                    width: "130px",
                                    fontSize: "16px",
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
                      </div>
                    </Col>
                  </>
                )}
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

export default ComplainDetails;
