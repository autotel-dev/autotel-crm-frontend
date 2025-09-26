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
import carIcon from "../../../monitoring-assets/deviceLocationArrow.png";

import {
  setDevices,
  setSelectedSingleDevice,
} from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { motion } from "framer-motion";

const DevicesSidebar = ({ setOpen, open }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState(new Set());
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
  };

  // Expand all groups initially
  useEffect(() => {
    const allGroupIds = Object.keys(groupedDevices);
    setExpandedGroups(new Set(allGroupIds));
  }, [Object.keys(groupedDevices).length]);

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
                        input.indeterminate = isGroupPartiallyChecked(groupId);
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
                          background: `${
                            item?.latestPosition?.attributes?.ignition === true
                              ? "rgba(0,255,0,0.1)"
                              : "rgba(255,0,0,0.1)"
                          }`,
                          paddingLeft: "8px",
                          paddingRight: "8px",
                          borderRadius: "10px",
                        }}
                        onClick={() => {
                          setOpen(!open);
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
                                  {/* -
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      color: "gray",
                                      fontWeight: "semibold",
                                    }}
                                  >
                                    {item?.vehicle?.model?.name || "N/A"}
                                  </span> */}
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
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <IoMdWifi color="red" size={16} />
                                  <div style={{ fontSize: "9px" }}>GPS</div>
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
  );
};

export default DevicesSidebar;
