// src/components/DevicesSidebar.tsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Media,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import "./DevicesSidebar.css";

import { IoMdWifi } from "react-icons/io";
import { IoKey } from "react-icons/io5";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import carIcon from "../../../monitoring-assets/deviceLocationArrow.png";
import delayIcon from "../../../../../../assets/delay-icon.png";

import {
  setDevices,
  setSelectedSingleDevice,
  setVehicleHistoryDateRange,
} from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { motion } from "framer-motion";
import CustomerDetailsModal from "./CustomerDetailsModal";
import PlaybackModal from "../SingleVehiceDetail/PlaybackModal/PlaybackModal";

const DevicesSidebar = ({ setOpen, open }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [customerDetailsModal, setCustomerDetailsModal] = useState(false);
  const [playbackModal, setPlaybackModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [historyType, setHistoryType] = useState<"today" | "yesterday" | null>(
    null
  );
  const { devices } = useSelector((state: any) => state.monitoring);
  const dispatch = useDispatch();

  // ✅ Group devices
  const groupedDevices = useMemo(() => {
    if (!devices || devices.length === 0) return {};

    const filtered = devices.filter(
      (item: any) =>
        item.vehicle?.model?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.vehicle?.model == null ||
        item.vehicle?.registrationNo
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    return filtered.reduce((groups: any, device: any) => {
      const groupName = device.vehicle?.group?.name || "Ungrouped";
      const groupId = device.vehicle?.group?._id || "ungrouped";

      if (!groups[groupId]) {
        groups[groupId] = {
          name: groupName,
          devices: [],
        };
      }

      groups[groupId].devices.push(device);
      return groups;
    }, {});
  }, [devices, searchTerm]);

  // ✅ Handle single checkbox
  const handleCheckboxClick = (e: any, item: any) => {
    e.stopPropagation();
    const updatedDevices = devices.map((d: any) =>
      d._id === item._id ? { ...d, checked: e.target.checked } : d
    );
    dispatch(setDevices(updatedDevices || []));
  };

  // ✅ Handle group checkbox
  const handleGroupCheckboxClick = (e: any, groupId: string) => {
    e.stopPropagation();
    const isChecked = e.target.checked;

    const updatedDevices = devices.map((d: any) => {
      const deviceGroupId = d.vehicle?.group?._id || "ungrouped";
      if (deviceGroupId === groupId) {
        return { ...d, checked: isChecked };
      }
      return d;
    });

    dispatch(setDevices(updatedDevices || []));
  };

  const isGroupFullyChecked = (groupId: string) => {
    const groupDevices = groupedDevices[groupId]?.devices || [];
    return (
      groupDevices.length > 0 &&
      groupDevices.every((device: any) => device.checked)
    );
  };

  const isGroupPartiallyChecked = (groupId: string) => {
    const groupDevices = groupedDevices[groupId]?.devices || [];
    const checkedCount = groupDevices.filter(
      (device: any) => device.checked
    ).length;
    return checkedCount > 0 && checkedCount < groupDevices.length;
  };

  const toggleGroupExpansion = (groupId: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupId)) {
      newExpandedGroups.delete(groupId);
    } else {
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };

  const handleDeviceClick = (device: any) => {
    dispatch(setSelectedSingleDevice(device));
    setOpen(false); // Always open the window (false = window is visible)
  };

  const toggleMenu = (e: React.MouseEvent, deviceId: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === deviceId ? null : deviceId);
  };

  const handleMenuAction = (
    e: React.MouseEvent,
    action: string,
    device: any
  ) => {
    e.stopPropagation();
    setOpenMenuId(null);

    console.log("Menu action triggered:", action, device);

    switch (action) {
      case "customer-details":
        console.log("Opening customer details modal");
        // Open customer details modal
        setSelectedDevice(device);
        dispatch(setSelectedSingleDevice(device));
        setCustomerDetailsModal(true);
        break;

      case "history-today":
        console.log("Opening history today modal");
        // Open playback modal with Today filter
        setSelectedDevice(device);
        dispatch(setSelectedSingleDevice(device));
        setHistoryType("today");
        // Clear previous date range so modal shows "Today"
        dispatch(setVehicleHistoryDateRange(null));
        setPlaybackModal(true);
        break;

      case "history-yesterday":
        console.log("Opening history yesterday modal");
        // Open playback modal with Yesterday filter
        setSelectedDevice(device);
        dispatch(setSelectedSingleDevice(device));
        setHistoryType("yesterday");
        // Clear previous date range so modal shows "Yesterday"
        dispatch(setVehicleHistoryDateRange(null));
        setPlaybackModal(true);
        break;

      case "send-command":
        // TODO: Implement send command functionality
        console.log("Send command for device:", device);
        break;

      case "alerts":
        // TODO: Implement alerts functionality
        console.log("Show alerts for device:", device);
        break;

      default:
        console.log(`Unknown action: ${action}`, device);
    }
  };

  // Expand all groups initially
  useEffect(() => {
    const allGroupIds = Object.keys(groupedDevices);
    setExpandedGroups(new Set(allGroupIds));
  }, [Object.keys(groupedDevices).length]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  // Reset history type when playback modal closes
  useEffect(() => {
    if (!playbackModal) {
      setHistoryType(null);
    }
  }, [playbackModal]);

  // Debug modal states
  useEffect(() => {
    console.log("Modal States:", {
      customerDetailsModal,
      playbackModal,
      selectedDevice: selectedDevice ? "Device present" : "No device",
      historyType,
    });
  }, [customerDetailsModal, playbackModal, selectedDevice, historyType]);

  const [selectedNav, setSelectedNav] = useState("Vehicles");

  const alerts = [
    {
      device: "BIL-876",
      message: "This device is zone in",
      time: "2025-08-29T11:20:17.000Z",
    },
    {
      device: "BIL-876",
      message: "This device is zone in",
      time: "2025-08-29T11:20:17.000Z",
    },
    {
      device: "BIL-876",
      message: "This device is zone out",
      time: "2025-08-29T11:20:17.000Z",
    },
    {
      device: "BIL-876",
      message: "This device is zone in",
      time: "2025-08-29T11:20:17.000Z",
    },
    {
      device: "BIL-876",
      message: "This device is zone in",
      time: "2025-08-29T11:20:17.000Z",
    },
    {
      device: "BIL-876",
      message: "This device is zone in",
      time: "2025-08-29T11:20:17.000Z",
    },
    {
      device: "BIL-876",
      message: "This device is zone out",
      time: "2025-08-29T11:20:17.000Z",
    },
    {
      device: "BIL-876",
      message: "This device is zone in",
      time: "2025-08-29T11:20:17.000Z",
    },
  ];

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Check if device time is 15 minutes or more older than current time
  const isDeviceTimeDelayed = (deviceTime: string) => {
    if (!deviceTime) return false;
    const deviceDate = new Date(deviceTime);
    const currentDate = new Date();
    const timeDifferenceInMinutes = (currentDate.getTime() - deviceDate.getTime()) / (1000 * 60);
    return timeDifferenceInMinutes >= 15;
  };

  const speechIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [text] = useState(
    "This device BLS-123 is zone out from Karachi to Islamabad"
  );

  const speakAfterDelay = () => {
    if (!text || !window.speechSynthesis) return;

    // Clear any existing speech
    window.speechSynthesis.cancel();

    const speakMessage = () => {
      for (let i = 0; i < 2; i++) {
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text);

          // Get voices and try to find a female voice
          const voices = window.speechSynthesis.getVoices();
          const femaleVoice = voices.find(
            (v) =>
              v.name.toLowerCase().includes("female") ||
              v.name.toLowerCase().includes("woman") ||
              v.name.toLowerCase().includes("zira") || // Common female voice on Windows
              v.name.toLowerCase().includes("samantha") || // Common female voice on macOS
              v.name.toLowerCase().includes("karen") // Common female voice on macOS
          );

          if (femaleVoice) {
            utterance.voice = femaleVoice;
          } else if (voices.length > 0) {
            // Fallback to first available voice
            utterance.voice = voices[0];
          }

          utterance.pitch = 1; // normal pitch
          utterance.rate = 0.9; // ✅ slightly slow

          window.speechSynthesis.speak(utterance);
        }, i * 2000); // gap of 2 sec between the 2 calls
      }
    };

    // ✅ Call first time immediately
    speakMessage();
  };

  // useEffect(() => {
  //   // Set up the interval for speaking
  //   speakAfterDelay();
  //   speechIntervalRef.current = setInterval(() => {
  //     speakAfterDelay();
  //   }, 20000); // Repeat every 20 sec

  //   // Clean up on component unmount
  //   return () => {
  //     if (speechIntervalRef.current) {
  //       clearInterval(speechIntervalRef.current);
  //     }
  //     if (window.speechSynthesis) {
  //       window.speechSynthesis.cancel();
  //     }
  //   };
  // }, []); // Empty dependency array ensures this runs only on mount/unmount

  return (
    <>
      <Card
        style={{
          borderRadius: "10px",
          backgroundColor: "white",
          // border: "1px solid black",
          boxShadow: "0 4px 15px rgba(109, 191, 184, 0.8)", // ✅ Shadow
          // overflowY: "hidden",
        }}
      >
        <CardHeader style={{ padding: "0px 12px", backgroundColor: "white" }}>
          <div
            style={{
              display: "flex",
              // gap: "15px",
              justifyContent: "space-between",
              margin: "20px 0px",
              marginBottom: "30px",
            }}
          >
            <button
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                border: "none",
                outline: "none",
                boxShadow: "0 4px 15px rgba(109, 191, 184, 1)",
                borderRadius: "5px",
                padding: "10px 20px",
                cursor: "pointer",
                background: `${`${
                  selectedNav == "Vehicles" ? "#6dbfb8" : "transparent"
                }`}`,
                color: `${`${selectedNav == "Vehicles" ? "white" : "black"}`}`,
                width: "47%",
              }}
              onClick={() => {
                setSelectedNav("Vehicles");
              }}
            >
              Vehicles
            </button>
            <button
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                border: "none",
                outline: "none",
                boxShadow: "0 4px 15px rgba(109, 191, 184, 1)",
                borderRadius: "5px",
                padding: "10px 20px",
                cursor: "pointer",
                background: `${`${
                  selectedNav == "Alerts" ? "#6dbfb8" : "transparent"
                }`}`,
                color: `${`${selectedNav == "Alerts" ? "white" : "black"}`}`,
                width: "47%",
              }}
              onClick={() => {
                setSelectedNav("Alerts");
              }}
            >
              Alerts
            </button>
          </div>

          <Form>
            <FormGroup>
              <Input
                style={{
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  height: "40px",
                  background: "#F8F8F8",
                  // backgroundColor: "#21262C",
                  // border: "1px solid black",
                  // boxShadow: "inset 0 4px 10px rgba(0, 0, 0, 0.5)",
                  // color: "white",
                }}
                className="form-control-plaintext gray-placeholder"
                type="search"
                placeholder="Search Vehicles.."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FormGroup>
          </Form>
        </CardHeader>
        <CardBody
          className="social-status filter-cards-view"
          style={{
            height: "66.5vh",
            minHeight: "66.5vh",
            overflowY: "auto",
            scrollbarWidth: "none",
            margin: "0px",
            padding: "0px 12px",
          }}
        >
          {selectedNav == "Alerts" ? (
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2, // delay between items
                  },
                },
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {alerts.map((alertt, index) => (
                <motion.li
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    // border: "2px solid gray",
                    border: "2px solid #F8F8F8",
                    backgroundColor: `${
                      alertt.message == "This device is zone out"
                        ? "rgba(255,0,0,0.7)"
                        : "transparent"
                    }`,
                    color: `${
                      alertt.message == "This device is zone out"
                        ? "white"
                        : "black"
                    }`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                      {alertt.device}
                    </div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "12px",

                        color: `${
                          alertt.message == "This device is zone out"
                            ? "white"
                            : "gray"
                        }`,
                      }}
                    >
                      {formatDateTime(alertt.time)}
                    </div>
                  </div>

                  <div>{alertt.message}</div>
                </motion.li>
              ))}
            </motion.ul>
          ) : Object.keys(groupedDevices).length > 0 ? (
            Object.entries(groupedDevices).map(
              ([groupId, group]: [string, any]) => (
                <div key={groupId} style={{ marginBottom: "10px" }}>
                  {/* Group Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      // backgroundColor: "#2a2f35",
                      background: "#F8F8F8",
                      padding: "8px",
                      borderRadius: "4px",
                      marginBottom: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleGroupExpansion(groupId)}
                  >
                    <input
                      type="checkbox"
                      style={{
                        marginRight: "10px",
                        height: "16px",
                        width: "16px",
                        padding: "0px",
                      }}
                      checked={isGroupFullyChecked(groupId)}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate =
                            isGroupPartiallyChecked(groupId);
                        }
                      }}
                      onChange={(e) => handleGroupCheckboxClick(e, groupId)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "16px",
                        flex: 1,
                      }}
                    >
                      {group.name} ({group.devices.length})
                    </span>
                    {expandedGroups.has(groupId) ? (
                      <MdExpandLess color="black" size={20} />
                    ) : (
                      <MdExpandMore color="black" size={20} />
                    )}
                  </div>

                  {/* Group Vehicles */}
                  {expandedGroups.has(groupId) && (
                    <div
                      style={{
                        paddingLeft: "10px",
                        paddingRight: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        margin: "10px 0px",
                      }}
                    >
                      {group.devices.map((item: any) => (
                        <div
                          key={item._id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            // background: `${
                            //   item?.latestPosition?.attributes?.ignition === true
                            //     ? "rgba(0,255,0,0.1)"
                            //     : "rgba(255,0,0,0.1)"
                            // }`,

                            background: (() => {
                              const renewalDate = item?.vehicle
                                ?.serviceRenewalDate
                                ? new Date(item.vehicle.serviceRenewalDate)
                                : null;
                              const deviceTime: any = item?.latestPosition
                                ?.deviceTime
                                ? new Date(item.latestPosition.deviceTime)
                                : null;
                              const now: any = new Date();

                              if (renewalDate && renewalDate < now) {
                                return "rgba(128, 128, 128, 0.2)"; // Expired
                              }
                              if (!deviceTime) {
                                return "rgba(0, 0, 255, 0.3)"; // Not COnn.
                              }
                              if ((now - deviceTime) / (1000 * 60 * 60) > 24) {
                                return "rgba(128, 0, 128, 0.1)"; // Inactive
                              }

                              switch (item?.mainVehicleStatus?.toLowerCase()) {
                                case "moving":
                                  return "rgba(0, 255, 0, 0.1)";
                                case "stopped":
                                  return "rgba(255, 0, 0, 0.1)";
                                case "idle":
                                  return "rgba(255, 165, 0, 0.1)";
                                default:
                                  return "rgba(240,240,240,0.4)";
                              }
                            })(),

                            paddingLeft: "8px",
                            paddingRight: "8px",
                            borderRadius: "10px",
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{
                              marginRight: "10px",
                              height: "15px",
                              width: "15px",
                              padding: "0px",
                            }}
                            checked={item.checked || false}
                            onChange={(e) => handleCheckboxClick(e, item)}
                          />
                          <Media
                            style={{
                              margin: "2px 0px",
                              padding: "5px 0px",
                              width: "100%",
                              // borderBottom: "2px solid lightGray",
                              cursor: "pointer",
                              transition: "background-color 0.3s",
                            }}
                            onClick={() => handleDeviceClick(item)}
                          >
                            <Media>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      width: "15px",
                                      height: "25px",
                                    }}
                                    src={carIcon}
                                    alt="Vehicle"
                                  />
                                  <div>
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        color: "black",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {item?.vehicle?.registrationNo || "N/A"}
                                    </span>

                                    <div
                                      className="d-block"
                                      style={{
                                        fontSize: "10px",
                                        fontWeight: "bold",
                                        color: "gray",
                                      }}
                                    >
                                      {formatDateTime(
                                        item?.latestPosition?.deviceTime
                                      )}
                                      {isDeviceTimeDelayed(
                                        item?.latestPosition?.deviceTime
                                      ) && (
                                        <img
                                          src={delayIcon}
                                          alt="Delay Icon"
                                          height={15}
                                          width={15}
                                          style={{
                                            marginLeft: "10px",
                                          }}
                                        />
                                      )}
                                      {/* {item?.latestPosition?.deviceTime || "N/A"} */}
                                    </div>
                                  </div>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "11.5px",
                                        color: "black",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {item?.latestPosition?.speed > 0
                                        ? Number(
                                            item?.latestPosition?.speed
                                          ).toFixed(2)
                                        : item?.latestPosition?.speed}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "9px",
                                        color: "black",
                                      }}
                                    >
                                      km/h
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                    }}
                                  >
                                    {item?.latestPosition?.attributes
                                      ?.ignition === true ? (
                                      <IoKey color="green" size={16} />
                                    ) : (
                                      <IoKey color="red" size={16} />
                                    )}
                                    <div style={{ fontSize: "9px" }}>IGN</div>
                                  </div>
                                  <div
                                    style={{
                                      position: "relative",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <button
                                      onClick={(e) => toggleMenu(e, item._id)}
                                      style={{
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "4px",
                                        transition: "all 0.2s",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                          "#6dbfb8";
                                        e.currentTarget.style.transform =
                                          "scale(1.1)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                          "transparent";
                                        e.currentTarget.style.transform =
                                          "scale(1)";
                                      }}
                                    >
                                      <BsThreeDotsVertical
                                        color="black"
                                        size={18}
                                      />
                                    </button>

                                    {openMenuId === item._id && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          right: "100%",
                                          top: "0%",
                                          transform: "translateY(-0%)",
                                          marginRight: "8px",
                                          backgroundColor: "white",
                                          borderRadius: "8px",
                                          boxShadow:
                                            "0 4px 15px rgba(109, 191, 184, 0.8)",
                                          zIndex: 1000,
                                          minWidth: "200px",
                                          overflow: "hidden",
                                          border: "1px solid #6dbfb8",
                                        }}
                                      >
                                        {[
                                          {
                                            label: "Customer Details",
                                            action: "customer-details",
                                          },
                                          {
                                            label: "Show History (Yesterday)",
                                            action: "history-yesterday",
                                          },
                                          {
                                            label: "Show History (Today)",
                                            action: "history-today",
                                          },
                                          {
                                            label: "Send Command",
                                            action: "send-command",
                                          },
                                          { label: "Alerts", action: "alerts" },
                                        ].map((menuItem, idx) => (
                                          <div
                                            key={idx}
                                            onClick={(e) =>
                                              handleMenuAction(
                                                e,
                                                menuItem.action,
                                                item
                                              )
                                            }
                                            style={{
                                              padding: "12px 16px",
                                              cursor: "pointer",
                                              fontSize: "13px",
                                              fontWeight: "500",
                                              color: "#333",
                                              transition: "all 0.2s",
                                              borderBottom:
                                                idx < 4
                                                  ? "1px solid #f0f0f0"
                                                  : "none",
                                            }}
                                            onMouseEnter={(e) => {
                                              e.currentTarget.style.backgroundColor =
                                                "#6dbfb8";
                                              e.currentTarget.style.color =
                                                "white";
                                            }}
                                            onMouseLeave={(e) => {
                                              e.currentTarget.style.backgroundColor =
                                                "transparent";
                                              e.currentTarget.style.color =
                                                "#333";
                                            }}
                                          >
                                            {menuItem.label}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Media>
                          </Media>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )
          ) : (
            <p
              style={{
                color: "black",
                padding: "0px 5px",
                textAlign: "center",
                fontSize: "16px",
              }}
            >
              No devices found.
            </p>
          )}
        </CardBody>
      </Card>

      {/* Customer Details Modal */}
      {customerDetailsModal && selectedDevice && (
        <CustomerDetailsModal
          isVisible={customerDetailsModal}
          setIsVisible={setCustomerDetailsModal}
          device={selectedDevice}
        />
      )}

      {/* Playback Modal for History */}
      {playbackModal && selectedDevice && (
        <PlaybackModal
          isVisible={playbackModal}
          setIsVisible={setPlaybackModal}
          initialFilter={
            historyType === "today"
              ? "Today"
              : historyType === "yesterday"
              ? "Yesterday"
              : undefined
          }
        />
      )}
    </>
  );
};

export default DevicesSidebar;
