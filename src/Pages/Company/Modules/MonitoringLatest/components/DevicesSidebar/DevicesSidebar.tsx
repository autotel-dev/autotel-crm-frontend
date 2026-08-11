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
import { useNavigate } from "react-router-dom";
import "./DevicesSidebar.css";

import { IoMdWifi } from "react-icons/io";
import { IoKey } from "react-icons/io5";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import carBlue from "../../../monitoring-assets/car_blue.png";
import carGreen from "../../../monitoring-assets/car_green.png";
import carRed from "../../../monitoring-assets/car_red.png";
import carYellow from "../../../monitoring-assets/car_yellow.png";
import carGray from "../../../monitoring-assets/car_gray.png";
import carPurple from "../../../monitoring-assets/car_purple.png";
import carBlack from "../../../monitoring-assets/car_black.png";
import delayIcon from "../../../../../../assets/delay-icon.png";

import { motion } from "framer-motion";
import CustomerDetailsModal from "./CustomerDetailsModal";
import PlaybackModal from "../SingleVehiceDetail/PlaybackModal/PlaybackModal";
import { EditDeviceModal } from "../EditDeviceModal";
import { EditDeviceIconsModal } from "../EditDeviceIconsModal";
import { getAll, create } from "../../../../../../Utilities/api";
import {
  GET_ALERT_EVENTS_V2,
  GET_DEVICE_ANALYTICS,
  GET_SINGLE_VEHICLE_START,
  IMAGE_BASE_URL,
} from "../../../../../../Utilities/api/apiEndpoints";
import {
  setInvoiceData,
  setIsInvoiceRenwed,
} from "../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import {
  setDevices,
  setSelectedSingleDevice,
  setVehicleHistoryDateRange,
  setDeviceAnalytics,
  setMonitoringSession,
} from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";

// Build a usable src from an uploaded icon object ({ url: "vehicleIcons/..." }).
// Returns null when no icon is set so callers can fall back to a default asset.
const apiIconUrl = (iconObj: any): string | null => {
  const url = iconObj?.url;
  if (!url) return null;
  return /^https?:\/\//i.test(url)
    ? url
    : `${IMAGE_BASE_URL}/${url}`.replace(/([^:]\/)\/+/g, "$1");
};

const DevicesSidebar = ({ setOpen, open, filteredDevices, onDeviceUpdated }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [customerDetailsModal, setCustomerDetailsModal] = useState(false);
  const [playbackModal, setPlaybackModal] = useState(false);
  const [editDeviceModalOpen, setEditDeviceModalOpen] = useState(false);
  const [editIconsModalOpen, setEditIconsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [historyType, setHistoryType] = useState<"today" | "yesterday" | null>(
    null,
  );
  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const { devices } = useSelector((state: any) => state.monitoring);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use filteredDevices from props if available, otherwise fall back to all devices
  const displayDevices = filteredDevices || devices;

  // ✅ Group devices
  const groupedDevices = useMemo(() => {
    if (!displayDevices || displayDevices.length === 0) return {};

    const filtered = displayDevices.filter(
      (item: any) =>
        item.vehicle?.model?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.vehicle?.make?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.vehicle?.model == null ||
        item.vehicle?.registrationNo
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.vehicle?.customer?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.vehicle?.imei?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicle?.chasisNo
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.vehicle?.engineNo
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.vehicle?.customer?.phoneNo
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.vehicle?.customer?.emailAddress
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
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
  }, [displayDevices, searchTerm]);

  // ✅ Handle single checkbox
  const handleCheckboxClick = (e: any, item: any) => {
    e.stopPropagation();
    const updatedDevices = devices.map((d: any) =>
      d._id === item._id ? { ...d, checked: e.target.checked } : d,
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

  // ✅ Handle Total checkbox - select/unselect all vehicles
  const handleTotalCheckboxClick = (e: any) => {
    e.stopPropagation();
    const isChecked = e.target.checked;

    const updatedDevices = devices.map((d: any) => ({
      ...d,
      checked: isChecked,
    }));

    dispatch(setDevices(updatedDevices || []));
  };

  // Check if all vehicles are checked
  const isAllChecked = () => {
    return devices.length > 0 && devices.every((device: any) => device.checked);
  };

  // Check if some vehicles are checked (for indeterminate state)
  const isSomeChecked = () => {
    const checkedCount = devices.filter((device: any) => device.checked).length;
    return checkedCount > 0 && checkedCount < devices.length;
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
      (device: any) => device.checked,
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

  const handleDeviceClick = async (device: any) => {
    dispatch(setSelectedSingleDevice(device));
    // Open the window when clicking device in sidebar (manual action by user)
    setOpen(false); // false = window is visible

    const zeroAnalytics = {
      vehicleId: device?._id,
      date: new Date().toISOString(),
      movingDuration: "0h 0m",
      idleDuration: "0h 0m",
      stoppedDuration: "0h 0m",
      inactiveDuration: "0h 0m",
      distanceForDay: "0 km",
      avgSpeed: "0 km/h",
      maxSpeed: "0 km/h",
      raw: {
        movingDurationMs: 0,
        idleDurationMs: 0,
        stopDurationMs: 0,
        inactiveDurationMs: 0,
        distanceMeters: 0,
        avgSpeedKmH: 0,
        maxSpeedKmH: 0,
      },
    };

    try {
      const response: any = await getAll({
        url: `${GET_DEVICE_ANALYTICS}?vehicleId=${device?._id}`,
      });
      if (response && response.success && response.data) {
        dispatch(setDeviceAnalytics(response.data));
      } else {
        dispatch(setDeviceAnalytics(zeroAnalytics));
      }
    } catch (error) {
      // console.error("Error fetching device analytics:", error);
      dispatch(setDeviceAnalytics(zeroAnalytics));
    }
  };

  const toggleMenu = (e: React.MouseEvent, deviceId: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === deviceId ? null : deviceId);
  };

  const handleMenuAction = (
    e: React.MouseEvent,
    action: string,
    device: any,
  ) => {
    e.stopPropagation();
    setOpenMenuId(null);

    // console.log("Menu action triggered:", action, device);

    switch (action) {
      case "edit-device":
        setSelectedDevice(device);
        dispatch(setSelectedSingleDevice(device));
        setEditDeviceModalOpen(true);
        break;

      case "edit-device-icons":
        setSelectedDevice(device);
        dispatch(setSelectedSingleDevice(device));
        setEditIconsModalOpen(true);
        break;

      case "renewal-expiry":
        const updatedData = {
          vehicles: [device?.vehicle?.registrationNo],
          ...device?.vehicle,
        };

        dispatch(setInvoiceData(updatedData));
        dispatch(setIsInvoiceRenwed(true));
        navigate(
          `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/invoices/create-invoice`,
        );
        break;

      case "customer-details":
        // console.log("Opening customer details modal");
        // Open customer details modal
        setSelectedDevice(device);
        dispatch(setSelectedSingleDevice(device));
        setCustomerDetailsModal(true);
        break;

      case "history-today":
        // console.log("Opening history today modal");
        // Open playback modal with Today filter
        setSelectedDevice(device);
        dispatch(setSelectedSingleDevice(device));
        setHistoryType("today");
        // Clear previous date range so modal shows "Today"
        dispatch(setVehicleHistoryDateRange(null));
        setPlaybackModal(true);
        break;

      case "history-yesterday":
        // console.log("Opening history yesterday modal");
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
        // console.log("Send command for device:", device);
        break;

      case "alerts":
        // TODO: Implement alerts functionality
        // console.log("Show alerts for device:", device);
        break;

      case "live-monitoring":
        const startMonitoring = async () => {
          try {
            const vehicleId = device?.vehicle?._id;
            const res: any = await create(
              { vehicleId },
              { url: GET_SINGLE_VEHICLE_START },
            );
            if (res?.success && res?.data) {
              const activeData = res.data;
              dispatch(setMonitoringSession(activeData.session));
              dispatch(
                setSelectedSingleDevice({
                  ...activeData.vehicle,
                  traccarDevice: activeData.traccarDevice,
                  latestPosition: activeData.latestPosition,
                  mainVehicleStatus: activeData.vehicleStatus,
                }),
              );
            }
          } catch (error) {
            console.error("Error starting live monitoring:", error);
          } finally {
            const url = `${window.location.origin}${process.env.PUBLIC_URL}/company/modules/monitoring-for-single-vehicle/${device?.vehicle?._id}`;
            window.open(url, "_blank");
          }
        };
        startMonitoring();
        break;

      default:
      // console.log(`Unknown action: ${action}`, device);
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
    // console.log("Modal States:", {
    //   customerDetailsModal,
    //   playbackModal,
    //   selectedDevice: selectedDevice ? "Device present" : "No device",
    //   historyType,
    // });
  }, [customerDetailsModal, playbackModal, selectedDevice, historyType]);

  const [selectedNav, setSelectedNav] = useState("Vehicles");

  // Fetch live alerts on component mount and every 10 seconds
  useEffect(() => {
    const fetchLiveAlerts = async () => {
      try {
        setAlertsLoading(true);
        const response: any = await getAll({
          url: `${GET_ALERT_EVENTS_V2}?page=1&limit=50`,
        });

        if (response && response.success && response.data) {
          setLiveAlerts(response.data?.rows || []);
        } else {
          setLiveAlerts([]);
        }
      } catch (error) {
        console.error("Error fetching live alerts:", error);
        setLiveAlerts([]);
      } finally {
        setAlertsLoading(false);
      }
    };

    // Fetch immediately on mount
    fetchLiveAlerts();

    // Set up interval to fetch every 10 seconds
    const interval = setInterval(fetchLiveAlerts, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Handle alert click - redirect to control room
  const handleAlertClick = (alert: any) => {
    navigate(`${process.env.PUBLIC_URL}/company/modules/control-room`);
  };

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
    const timeDifferenceInMinutes =
      (currentDate.getTime() - deviceDate.getTime()) / (1000 * 60);
    return timeDifferenceInMinutes >= 15;
  };

  const speechIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [text] = useState(
    "This device BLS-123 is zone out from Karachi to Islamabad",
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
              v.name.toLowerCase().includes("karen"), // Common female voice on macOS
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

  const highlightMatch = (text: string, term: string) => {
    if (!term || !text) return text;
    const parts = text.split(
      new RegExp(`(${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi"),
    );
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <strong key={index} style={{ color: "#000" }}>
          {part}
        </strong>
      ) : (
        part
      ),
    );
  };

  const getMatchedFields = (item: any, term: string) => {
    if (!term) return [];
    const lowerTerm = term.toLowerCase();
    const fields = [
      { label: "Make", value: item.vehicle?.make?.name },
      { label: "Model", value: item.vehicle?.model?.name },
      { label: "Reg No", value: item.vehicle?.registrationNo },
      { label: "Customer", value: item.vehicle?.customer?.fullName },
      { label: "IMEI", value: item.vehicle?.imei },
      { label: "Chasis No", value: item.vehicle?.chasisNo },
      { label: "Engine No", value: item.vehicle?.engineNo },
      { label: "Phone No", value: item.vehicle?.customer?.phoneNo },
      { label: "Email", value: item.vehicle?.customer?.emailAddress },
    ].filter((f) => f.value && typeof f.value === "string");

    return fields.filter((f) => f.value.toLowerCase().includes(lowerTerm));
  };

  const getVehicleVisualState = (item: any) => {
    const v = item?.vehicle || {};
    const renewalDate = item?.vehicle?.serviceRenewalDate
      ? new Date(item.vehicle.serviceRenewalDate)
      : null;

    const deviceTime = item?.latestPosition?.deviceTime
      ? new Date(item.latestPosition.deviceTime)
      : null;

    const now = new Date();

    // 🚫 Expired
    if (renewalDate && renewalDate < now) {
      return {
        background: "rgba(128, 128, 128, 0.2)",
        icon: apiIconUrl(v.vehicleIconExpired) || carGray, // ⚪ expired
      };
    }

    // 🔵 Not connected
    if (!deviceTime) {
      return {
        background: "rgba(0, 0, 255, 0.3)",
        icon: apiIconUrl(v.vehicleIconNotConnected) || carPurple, // 🟣 not connected
      };
    }

    // ⚫ Offline — backend flagged the device as inactive (checked before the
    // time-based inactive heuristic so these devices are shown as offline)
    if (item?.mainVehicleStatus?.toLowerCase() === "inactive") {
      return {
        background: "rgba(0, 0, 0, 0.08)",
        icon: apiIconUrl(v.vehicleIconOffline) || carBlack, // ⚫ offline
      };
    }

    // 🟣 Inactive (24+ hours)
    if ((now.getTime() - deviceTime.getTime()) / (1000 * 60 * 60) > 24) {
      return {
        background: "rgba(128, 0, 128, 0.1)",
        icon: apiIconUrl(v.vehicleIconInactive) || carPurple, // 🟣 inactive
      };
    }

    // 🚗 Status-based
    switch (item?.mainVehicleStatus?.toLowerCase()) {
      case "moving":
        return {
          background: "rgba(0, 255, 0, 0.1)",
          icon:
            apiIconUrl(v.vehicleIconMoving) ||
            apiIconUrl(v.vehicleIconOnline) || // legacy
            carGreen, // ✅ moving
        };

      case "stopped":
        return {
          background: "rgba(255, 0, 0, 0.1)",
          icon: apiIconUrl(v.vehicleIconStopped) || carRed, // ⛔ stopped
        };
      case "unknown":
        return {
          background: "rgba(255, 0, 0, 0.1)",
          icon: apiIconUrl(v.vehicleIconStopped) || carRed, // ⛔ stopped
        };
      case "stop":
        return {
          background: "rgba(255, 0, 0, 0.1)",
          icon: apiIconUrl(v.vehicleIconStopped) || carRed, // ⛔ stopped
        };

      case "idle":
        return {
          background: "rgba(255, 165, 0, 0.1)",
          icon: apiIconUrl(v.vehicleIconIdle) || carYellow, // 🟠 idle
        };

      case "inactive":
        return {
          background: "rgba(0, 0, 0, 0.08)",
          icon: apiIconUrl(v.vehicleIconOffline) || carBlack, // ⚫ offline
        };

      default:
        return {
          background: "rgba(255, 0, 0, 0.1)",
          icon: apiIconUrl(v.vehicleIconOffline) || carBlue, // 🔵 anything else
        };
    }
  };

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
            alertsLoading && liveAlerts.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                Loading alerts...
              </div>
            ) : liveAlerts.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                No live alerts available
              </div>
            ) : (
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05, // delay between items
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
                {liveAlerts.map((alert, index) => (
                  <motion.li
                    key={alert._id || index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleAlertClick(alert)}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: "2px solid #F8F8F8",
                      backgroundColor:
                        alert.alertType === "OVER_SPEEDING" ||
                        alert.alertType === "GEOFENCE_EXIT"
                          ? "rgba(255,0,0,0.1)"
                          : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e: any) => {
                      // e.currentTarget.style.backgroundColor = "#f0f8ff";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.backgroundColor =
                        alert.alertType === "OVER_SPEEDING" ||
                        alert.alertType === "GEOFENCE_EXIT"
                          ? "rgba(255,0,0,0.1)"
                          : "transparent";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: "#333",
                        }}
                      >
                        {alert?.vehicle?.registrationNo ||
                          alert.deviceId ||
                          "Unknown Device"}
                      </div>
                      <div
                        style={{
                          fontWeight: "500",
                          fontSize: "11px",
                          color: "#999",
                        }}
                      >
                        {new Date(
                          alert.createdAt || alert.time,
                        ).toLocaleTimeString()}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "13px",
                        color:
                          alert.alertType === "OVER_SPEEDING" ||
                          alert.alertType === "GEOFENCE_EXIT"
                            ? "#d32f2f"
                            : "#666",
                        fontWeight:
                          alert.type === "critical" ? "600" : "normal",
                      }}
                    >
                      {alert.alert?.name || alert.message || "Alert triggered"}
                    </div>

                    {alert.address && (
                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: "12px",
                          color: "#888",
                          fontStyle: "italic",
                        }}
                      >
                        📍 {alert.address}
                      </div>
                    )}
                  </motion.li>
                ))}
              </motion.ul>
            )
          ) : Object.keys(groupedDevices).length > 0 ? (
            <>
              {/* Total Checkbox */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#6dbfb8",
                  padding: "10px",
                  borderRadius: "6px",
                  marginBottom: "15px",
                  cursor: "pointer",
                }}
                onClick={handleTotalCheckboxClick}
              >
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    height: "18px",
                    width: "18px",
                    padding: "0px",
                  }}
                  checked={isAllChecked()}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = isSomeChecked();
                    }
                  }}
                  onChange={handleTotalCheckboxClick}
                  onClick={(e) => e.stopPropagation()}
                />
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                    flex: 1,
                  }}
                >
                  Total ({devices.length})
                </span>
              </div>

              {/* Groups (Ungrouped pinned to the top when present) */}
              {Object.entries(groupedDevices)
                .sort(([a]: [string, any], [b]: [string, any]) =>
                  a === "ungrouped" ? -1 : b === "ungrouped" ? 1 : 0
                )
                .map(
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

                              // background: (() => {
                              //   const visualState = getVehicleVisualState(item);

                              //   const renewalDate = item?.vehicle
                              //     ?.serviceRenewalDate
                              //     ? new Date(item.vehicle.serviceRenewalDate)
                              //     : null;
                              //   const deviceTime: any = item?.latestPosition
                              //     ?.deviceTime
                              //     ? new Date(item.latestPosition.deviceTime)
                              //     : null;
                              //   const now: any = new Date();

                              //   if (renewalDate && renewalDate < now) {
                              //     return "rgba(128, 128, 128, 0.2)"; // Expired
                              //   }
                              //   if (!deviceTime) {
                              //     return "rgba(0, 0, 255, 0.3)"; // Not COnn.
                              //   }
                              //   if (
                              //     (now - deviceTime) / (1000 * 60 * 60) >
                              //     24
                              //   ) {
                              //     return "rgba(128, 0, 128, 0.1)"; // Inactive
                              //   }

                              //   switch (
                              //     item?.mainVehicleStatus?.toLowerCase()
                              //   ) {
                              //     case "moving":
                              //       return "rgba(0, 255, 0, 0.1)";
                              //     case "stopped":
                              //       return "rgba(255, 0, 0, 0.1)";
                              //     case "idle":
                              //       return "rgba(255, 165, 0, 0.1)";
                              //     default:
                              //       return "rgba(240,240,240,0.4)";
                              //   }
                              // })(),
                              background:
                                getVehicleVisualState(item).background,

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
                                        width: "14px",
                                        height: "25px",
                                      }}
                                      src={getVehicleVisualState(item).icon}
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
                                          item?.latestPosition?.deviceTime,
                                        ) == "Invalid Date"
                                          ? "Not Connected"
                                          : formatDateTime(
                                              item?.latestPosition?.deviceTime,
                                            )}
                                        {isDeviceTimeDelayed(
                                          item?.latestPosition?.deviceTime,
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
                                              item?.latestPosition?.speed,
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
                                              label: "Edit Device",
                                              action: "edit-device",
                                            },
                                            {
                                              label: "Edit Device Icons",
                                              action: "edit-device-icons",
                                            },
                                            {
                                              label: "Renewal Expiry",
                                              action: "renewal-expiry",
                                            },
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
                                            // {
                                            //   label: "Send Command",
                                            //   action: "send-command",
                                            // },
                                            // {
                                            //   label: "Alerts",
                                            //   action: "alerts",
                                            // },
                                            {
                                              label: "Live Monitoring",
                                              action: "live-monitoring",
                                            },
                                          ]
                                            .filter((menuItem) => {
                                              if (
                                                menuItem.action ===
                                                "renewal-expiry"
                                              ) {
                                                const renewalDate = item
                                                  ?.vehicle?.serviceRenewalDate
                                                  ? new Date(
                                                      item.vehicle
                                                        .serviceRenewalDate,
                                                    )
                                                  : null;
                                                const now = new Date();
                                                return (
                                                  renewalDate &&
                                                  renewalDate < now
                                                );
                                              }
                                              return true;
                                            })
                                            .map((menuItem, idx) => (
                                              <div
                                                key={idx}
                                                onClick={(e) =>
                                                  handleMenuAction(
                                                    e,
                                                    menuItem.action,
                                                    item,
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

                                {searchTerm && (
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      marginTop: "10px",
                                      marginLeft: "20px",
                                      color: "#555",
                                      padding: "4px 8px",
                                      backgroundColor: "rgba(255,255,255,0.5)",
                                      borderRadius: "4px",
                                      // border: "1px dashed rgba(0,0,0,0.1)"
                                    }}
                                  >
                                    {getMatchedFields(item, searchTerm).map(
                                      (field, idx) => (
                                        <div
                                          key={idx}
                                          style={{ marginBottom: "2px" }}
                                        >
                                          <span
                                            style={{
                                              fontWeight: "bold",
                                              color: "#333",
                                            }}
                                          >
                                            {field.label} :{" "}
                                          </span>
                                          &nbsp;
                                          {highlightMatch(
                                            field.value,
                                            searchTerm,
                                          )}
                                        </div>
                                      ),
                                    )}
                                  </div>
                                )}
                              </Media>
                            </Media>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              )}
            </>
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
      {/* Edit Device Modal */}
      {editDeviceModalOpen && selectedDevice && (
        <EditDeviceModal
          isOpen={editDeviceModalOpen}
          toggle={() => setEditDeviceModalOpen(!editDeviceModalOpen)}
          device={selectedDevice}
          onDeviceUpdated={onDeviceUpdated}
        />
      )}
      {/* Edit Device Icons Modal */}
      {editIconsModalOpen && selectedDevice && (
        <EditDeviceIconsModal
          isOpen={editIconsModalOpen}
          toggle={() => setEditIconsModalOpen(!editIconsModalOpen)}
          device={selectedDevice}
          onIconsUpdated={onDeviceUpdated}
        />
      )}
    </>
  );
};

export default DevicesSidebar;
