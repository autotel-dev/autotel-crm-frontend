import React, { useEffect, useMemo, useState } from "react";
import { Label, Input, Modal, ModalBody, Button, Row, Col, FormGroup, Form } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { ImClock } from "react-icons/im";
import { motion } from "framer-motion"; // ✅ Import Framer Motion
import GoogleMap from "./components/GoogleMap/GoogleMap";
import DevicesSidebar from "./components/DevicesSidebar/DevicesSidebar";
import {
  setDevices,
  setIsConnected,
  setSelectedSingleDevice,
  setAlertsEnabled,
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAll } from "../../../../Utilities/api";
import { GET_PARSER_DEVICES } from "../../../../Utilities/api/apiEndpoints";
import Swal from "sweetalert2";
import { TbSettingsPlus } from "react-icons/tb";
import { LuLayoutDashboard } from "react-icons/lu";
import { ImStatsBars2 } from "react-icons/im";
import { SlArrowRight } from "react-icons/sl";
import { PiMapPinLineBold } from "react-icons/pi";
import { MdOutlineCameraAlt } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { GrHostMaintenance } from "react-icons/gr";
import { MdAddCall } from "react-icons/md";
import { FiSettings } from "react-icons/fi";

import { MdAdd } from "react-icons/md";
import { GrFormSubtract } from "react-icons/gr";
import { FaLocationArrow } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { FaTrafficLight } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaRegMap } from "react-icons/fa6";

// Single Device Detail
import { FaUserAlt, FaUserPlus } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { MdOutlineSensors } from "react-icons/md";
import { HiDeviceMobile } from "react-icons/hi";
import { FaPlay } from "react-icons/fa6";
import { BsSendArrowUpFill } from "react-icons/bs";
import { HiChartBar } from "react-icons/hi";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import VehicleInfo from "./components/SingleVehiceDetail/VehicleInfo/VehicleInfo";
import DeviceInfo from "./components/SingleVehiceDetail/DeviceInfo/DeviceInfo";
import SensorInfo from "./components/SingleVehiceDetail/SensorInfo/SensorInfo";
import CustomerInfo from "./components/SingleVehiceDetail/CustomerInfo/CustomerInfo";
import Analytics from "./components/SingleVehiceDetail/Analytics/Analytics";
import PlaybackModal from "./components/SingleVehiceDetail/PlaybackModal/PlaybackModal";
import { Tooltip } from "react-tooltip";
import SendCommand from "../ControlRoom copy/Analytics/components/SendCommand";
import { AddDeviceModal } from "./components/AddDeviceModal";
import CreateNewCustomer from "../SAIO/components/Sales/components/Customer/CreateNewCustomer/CreateNewCustomer";

import "./MonitoringLatest.css";
import { socketConnection } from "../../../../sockets/socket";
import GlassToast from "../../../../components/ui/GlassToast";
import Toast from "../../../../Utilities/toasts/Toast";
import { formatUnderscoredString } from "../../../../Utilities/globals/globals";

const MonitoringLatest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { devices, selectedSingleDevice, alertsEnabled } = useSelector(
    (state: any) => state.monitoring,
  );
  const { userData } = useSelector((state: any) => state.user);
  // console.log("userData", userData);

  const updatesBufferRef = React.useRef<any[]>([]);

  const [open, setOpen] = useState(true); // ✅ control paper open/close (true = hidden, false = visible)
  const [isCollapsed, setIsCollapsed] = useState(true); // ✅ control collapsed/expanded state
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null); // null = show all

  const [openModal, setOpenModal] = useState(false);
  const [sendCommandModal, setSendCommandModal] = useState(false);
  const [selectedDeviceForCommand, setSelectedDeviceForCommand] = useState<any>("");
  const toggleSendCommandModal = (item: any = "") => {
    setSelectedDeviceForCommand(item);
    setSendCommandModal(!sendCommandModal);
  };

  const [addNewDeviceModal, setAddNewDeviceModal] = useState(false);
  const [addNewCustomerModal, setAddNewCustomerModal] = useState(false);

  useEffect(() => {
    dispatch(setIsConnected(false));
    document.body.style.overflow = "hidden";
    // if (!devices.length) fetchDevices();
    fetchDevices();
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Track previous selected device to detect when a NEW device is selected
  const prevSelectedDeviceIdRef = React.useRef<string | null>(null);

  // Handle selectedSingleDevice changes
  useEffect(() => {
    if (selectedSingleDevice) {
      // Check if the selected device is still checked
      const device = devices.find(
        (d: any) => d._id === selectedSingleDevice._id,
      );

      if (device && device.checked) {
        // Show the panel
        setOpen(false);

        // Only collapse if this is a NEW device selection (not just a device update)
        if (prevSelectedDeviceIdRef.current !== selectedSingleDevice._id) {
          setIsCollapsed(true);
          prevSelectedDeviceIdRef.current = selectedSingleDevice._id;
        }
      } else {
        // Hide the panel if device is unchecked
        setOpen(true);
        prevSelectedDeviceIdRef.current = null;
      }
    } else {
      // No device selected, hide the panel
      setOpen(true);
      prevSelectedDeviceIdRef.current = null;
    }
  }, [selectedSingleDevice, devices]);

  // useEffect(() => {
  //   console.log("selectedSingleDevice", selectedSingleDevice);
  //   console.log("devices", devices);
  // }, [devices]);

  const now: any = new Date();

  const {
    expiredCount,
    notConnectedCount,
    inactiveCount,
    movingCount,
    idleCount,
    stoppedCount,
    offlineCount,
  } = useMemo(() => {
    // Get inactive time limit from userData (in minutes), default to 24 hours (1440 minutes) if not set
    const inactiveTimeLimitMinutes = userData?.inactiveTimeLimit || 1440;

    // Step 1: Find expired devices
    const expiredDevices = devices.filter((d: any) => {
      const renewalDate = d?.vehicle?.serviceRenewalDate
        ? new Date(d.vehicle.serviceRenewalDate)
        : null;

      if (!renewalDate) return false;

      return renewalDate < now; // expired if renewal date is before now
    });

    const nonExpiredDevices = devices.filter(
      (d: any) => !expiredDevices.includes(d),
    );

    // Step 2: Classify not connected devices (from non-expired)
    const notConnectedDevices = nonExpiredDevices.filter((d: any) => {
      return !d?.latestPosition?.deviceTime; // No deviceTime at all
    });

    // Offline — backend flagged the device as inactive (has a deviceTime but
    // mainVehicleStatus === "inactive"). Checked before the time-based inactive.
    const offlineDevices = nonExpiredDevices.filter((d: any) => {
      return (
        !!d?.latestPosition?.deviceTime &&
        d.mainVehicleStatus?.toLowerCase() === "inactive"
      );
    });

    const inactiveDevices = nonExpiredDevices.filter((d: any) => {
      const deviceTime: any = d?.latestPosition?.deviceTime
        ? new Date(d.latestPosition.deviceTime)
        : null;

      if (!deviceTime) return false; // handled by notConnectedDevices
      if (offlineDevices.includes(d)) return false; // handled by offlineDevices

      // Calculate difference in minutes
      const diffMinutes = (now - deviceTime) / (1000 * 60);

      // Inactive if older than the configured inactive time limit (in minutes)
      return diffMinutes > inactiveTimeLimitMinutes;
    });

    // Step 3: From remaining (active & non-expired) — check statuses
    const activeDevices = nonExpiredDevices.filter(
      (d: any) =>
        !inactiveDevices.includes(d) &&
        !notConnectedDevices.includes(d) &&
        !offlineDevices.includes(d),
    );

    const movingCount = activeDevices.filter(
      (d: any) => d.mainVehicleStatus?.toLowerCase() === "moving",
    ).length;

    const idleCount = activeDevices.filter(
      (d: any) => d.mainVehicleStatus?.toLowerCase() === "idle",
    ).length;

    const stoppedCount = activeDevices.filter(
      (d: any) =>
        d.mainVehicleStatus?.toLowerCase() === "stopped" ||
        d.mainVehicleStatus?.toLowerCase() === "stop",
    ).length;

    return {
      expiredCount: expiredDevices.length,
      notConnectedCount: notConnectedDevices.length,
      inactiveCount: inactiveDevices.length,
      movingCount,
      idleCount,
      stoppedCount,
      offlineCount: offlineDevices.length,
    };
  }, [devices, userData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (updatesBufferRef.current.length > 0) {
        // Copy buffer and clear
        const updates = [...updatesBufferRef.current];
        updatesBufferRef.current = [];

        // Build updated devices array
        const updatedDevices = devices.map((device: any) => {
          const update = updates.find((u) => u.id === device._id);
          if (update) {
            return {
              ...device,
              latestPosition: update.latestPosition,
              mainVehicleStatus: update.vehicleStatus,
            };
          }
          return device;
        });

        // Dispatch once every 5 sec
        dispatch(setDevices(updatedDevices));
        // console.log("✅ Devices state updated with buffered changes");
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [devices, dispatch]);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data: any = await getAll({ url: GET_PARSER_DEVICES });
      if (data?.data) {
        const updatedDevices = data.data.map((device: any) => ({
          ...device,
          checked: true,
        }));
        dispatch(setDevices(updatedDevices));
      } else {
        Swal.fire({
          text: "Data not found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

  function getVehicleStatus(packet: any) {
    if (!packet || !packet.attributes) {
      return "unknown";
    }

    const { ignition } = packet.attributes;
    const speed = packet.speed || 0;

    // Rule 1: Moving
    if (ignition === true && speed > 5) {
      return "moving";
    }

    // Rule 2: Idle
    if (ignition === true && speed <= 5) {
      return "idle";
    }

    // Rule 3: Stopped
    if (ignition === false && speed < 5) {
      return "stopped";
    }

    if (packet.outdated === true || packet.valid === false) {
      return "inactive";
    }

    if (packet.attributes.expired === true) {
      return "expired";
    }

    return "unknown";
  }

  const sidebarMenus = [
    // {
    //   icon: TbSettingsPlus,
    //   tooltipName: "Admin",
    // },
    {
      icon: LuLayoutDashboard,
      tooltipName: "Dashboard",
      path: `${process.env.PUBLIC_URL}/dashboard`,
    },
    {
      icon: ImStatsBars2,
      tooltipName: "Reports",
      path: `${process.env.PUBLIC_URL}/company/reports`,
    },
    {
      icon: SlArrowRight,
      tooltipName: "Send Command",
    },
    {
      icon: MdAdd,
      tooltipName: "Add New Device",
    },
    {
      icon: FaUserPlus,
      tooltipName: "Add New Customer",
    },
    // {
    //   icon: PiMapPinLineBold,
    //   tooltipName: "Show Point",
    // },
    // {
    //   icon: MdOutlineCameraAlt,
    //   tooltipName: "Camera",
    // },
    // {
    //   icon: FaTasks,
    //   tooltipName: "Tasks",
    // },
    // {
    //   icon: GrHostMaintenance,
    //   tooltipName: "Maintenance",
    // },
    // {
    //   icon: FiSettings,
    //   tooltipName: "Setup",
    // },
    // {
    //   icon: MdAddCall,
    //   tooltipName: "Call Actions",
    // },
  ];

  const StatusBox = ({
    count,
    label,
    color,
    background,
    onClick,
    isSelected,
  }: any) => {
    return (
      <div
        style={{
          width: "58px",
          height: "100%",
          borderRadius: "8px",
          background: isSelected ? color : background,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          border: isSelected ? `2px solid ${color}` : "2px solid transparent",
          transform: isSelected ? "scale(1.05)" : "scale(1)",
        }}
        onClick={onClick}
      >
        <p
          style={{
            margin: "0px",
            fontSize: "13px",
            fontWeight: "bold",
            color: isSelected ? "white" : "black",
          }}
        >
          {count}
        </p>
        <p
          style={{
            margin: "0px",
            fontSize: "9px",
            fontWeight: "bold",
            marginTop: "-4px",
            color: isSelected ? "white" : color,
          }}
        >
          {label}
        </p>
      </div>
    );
  };

  // Tooltip component
  const TooltipButton = ({ onClick, children, tooltip, style }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          position: "relative",
          display: "inline-block",
          // margin: "5px 0", // Added margin between buttons
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={onClick}
          className="zoom-button tooltip-button"
          style={style}
        >
          {children}
        </button>
        {isHovered && <div className="tooltip-text">{tooltip}</div>}
      </div>
    );
  };

  const TooltipButtonForSingleVehicle = ({
    onClick,
    children,
    tooltip,
    style,
  }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          position: "relative",
          display: "inline-block",
          // margin: "5px 0", // Added margin between buttons
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={onClick}
          className="zoom-button tooltip-button"
          style={style}
        >
          {children}
        </button>
        {isHovered && (
          <div className="tooltip-text-for-single-device">{tooltip}</div>
        )}
      </div>
    );
  };

  // Filter devices based on selected status
  const filteredDevices = useMemo(() => {
    if (!selectedStatus) return devices; // null means show all

    const now: any = new Date();
    const inactiveTimeLimitMinutes = userData?.inactiveTimeLimit || 1440;

    return devices.filter((device: any) => {
      // Check if expired
      const renewalDate = device?.vehicle?.serviceRenewalDate
        ? new Date(device.vehicle.serviceRenewalDate)
        : null;
      const isExpired = renewalDate && renewalDate < now;

      // Check if not connected
      const hasDeviceTime = device?.latestPosition?.deviceTime;

      // Check if inactive
      const deviceTime: any = device?.latestPosition?.deviceTime
        ? new Date(device.latestPosition.deviceTime)
        : null;
      const diffMinutes = deviceTime ? (now - deviceTime) / (1000 * 60) : 0;
      const isInactive = deviceTime && diffMinutes > inactiveTimeLimitMinutes;

      // Check main vehicle status
      const mainStatus = device.mainVehicleStatus?.toLowerCase();

      // Match the selected status
      switch (selectedStatus) {
        case "moving":
          return (
            !isExpired &&
            hasDeviceTime &&
            !isInactive &&
            mainStatus === "moving"
          );
        case "stopped":
          return (
            !isExpired &&
            hasDeviceTime &&
            !isInactive &&
            (mainStatus === "stopped" ||
              mainStatus === "stop" ||
              mainStatus === "unknown")
          );
        case "idle":
          return (
            !isExpired && hasDeviceTime && !isInactive && mainStatus === "idle"
          );
        case "offline":
          return (
            !isExpired && hasDeviceTime && mainStatus === "inactive"
          );
        case "inactive":
          return !isExpired && isInactive && mainStatus !== "inactive";
        case "not_connected":
          return !isExpired && !hasDeviceTime;
        case "expired":
          return isExpired;
        case "total":
          return true; // Show all
        default:
          return true;
      }
    });
  }, [devices, selectedStatus, userData]);

  const handleStatusClick = (status: string | null) => {
    setSelectedStatus(status);
  };

  const [selectedComponentIndex, setSelectedComponentIndex] = useState(0);

  const sidebarMenusForSingleVehicle = [
    {
      icon: HiChartBar,
      tooltipName: "Analytics",
    },
    {
      icon: FaCar,
      tooltipName: "Vehicle Info",
    },
    {
      icon: HiDeviceMobile,
      tooltipName: "Device Info",
    },
    {
      icon: MdOutlineSensors,
      tooltipName: "Sensor Info",
    },
    {
      icon: FaUserAlt,
      tooltipName: "Customer Info",
    },

    {
      icon: FaPlay,
      tooltipName: "Playback",
    },
    {
      icon: BsSendArrowUpFill,
      tooltipName: "Send Command",
    },
  ];

  useEffect(() => {
    // 🔹 Check immediately (may be false if still connecting)
    // console.log("Initial connected state:", socketConnection.connected);

    socketConnection.on("vehicle:updated", (payload) => {
      const { id, changes, vehicleStatus } = payload;

      // get latestPosition update
      const latestPosition = changes?.updatedFields?.latestPosition;
      // console.log("update payload", payload);

      if (!latestPosition) return; // no position update
      // Push into buffer (not Redux yet)
      updatesBufferRef.current.push({ id, latestPosition, vehicleStatus });
    });

    socketConnection.on("vehicle:created", (payload) => {
      const { id, changes, vehicleStatus } = payload;

      // get latestPosition update
      const latestPosition = changes?.updatedFields?.latestPosition;
      // console.log("payload", payload);

      if (!latestPosition) return; // no position update
      // Push into buffer (not Redux yet)
      updatesBufferRef.current.push({ id, latestPosition, vehicleStatus });

      // const updatedDevices = devices.map((device: any) =>
      //   device._id === id ? { ...device, latestPosition } : device
      // );

      // dispatch(setDevices(updatedDevices));
    });

    socketConnection.on("vehicle:deleted", (payload) => {
      const { id, changes, vehicleStatus } = payload;

      // get latestPosition update
      const latestPosition = changes?.updatedFields?.latestPosition;
      // console.log("payload", payload);

      if (!latestPosition) return; // no position update
      // Push into buffer (not Redux yet)
      updatesBufferRef.current.push({ id, latestPosition, vehicleStatus });
    });

    socketConnection.on("new_alert_event", (payload) => {
      // console.log("new_alert_event payload", payload);

      const { actualAlert } = payload || {};
      const { formattedAlert } = payload || {};
      if (!actualAlert) return;
      if (!formattedAlert) return;

      const { alertType, message } = actualAlert;
      const { vehicle } = formattedAlert;

      // Only show toast if alerts are enabled
      if (alertsEnabled) {
        Toast({
          title: formatUnderscoredString(alertType),
          text: message,
          icon: alertType, // handles IGNITION_ON / IGNITION_OFF color & icon
          duration: 3000,
          registrationNo: vehicle?.registration,
        });
      }
    });

    return () => {
      socketConnection.off("vehicle:updated");
      socketConnection.off("vehicle:created");
      socketConnection.off("vehicle:deleted");
      socketConnection.off("new_alert_event");
    };
  }, [alertsEnabled]);

  return (
    <div
      style={{
        marginLeft: "-25px",
        marginRight: "-25px",
        marginTop: "100px",
        display: "flex",
        height: "89vh",
        justifyContent: "space-between",
        overflowY: "hidden",
        overflowX: "hidden",
      }}
    >
      {/* Left icons column */}
      <div
        style={{
          maxWidth: "5%",
          minWidth: "5%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          paddingTop: "20px",
        }}
      >
        {sidebarMenus.map((menu, i: any) => {
          return (
            <TooltipButton
              key={i}
              onClick={() => {
                if (menu.path) {
                  navigate(menu.path);
                } else if (menu.tooltipName === "Send Command") {
                  toggleSendCommandModal("");
                } else if (menu.tooltipName === "Add New Device") {
                  setAddNewDeviceModal(true);
                } else if (menu.tooltipName === "Add New Customer") {
                  setAddNewCustomerModal(true);
                }
              }}
              tooltip={menu.tooltipName}
              style={{
                width: "45px",
                height: "45px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                cursor: "pointer",
                // these actions are not "tabs" - never show a selected highlight
                backgroundColor: "transparent",
                transition: "all 0.2s ease-in-out",
                border: "none",
              }}
            >
              <menu.icon size={19} color="black" />
            </TooltipButton>
          );
        })}
      </div>

      {/* Google Map container with animation */}
      <div style={{ maxWidth: "67%", minWidth: "67%", position: "relative" }}>
        <motion.div
          initial={{ height: "87vh", opacity: 1 }}
          animate={{ height: "87vh" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{
            maxWidth: "100%",
            minWidth: "100%",
            background: "white",
            borderRadius: "10px",
            padding: "10px",
            width: "100%",
            position: "relative",
            overflow: "hidden", // ✅ Prevents map overflow
            boxShadow: "0 4px 15px rgba(109, 191, 184, 0.4)", // ✅ Shadow
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "100%",
              position: "relative",
              height: "100%",
              borderRadius: "8px", // keeps rounded corners overflow: "hidden",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                height: "60px",
                width: "100%",
                maxWidth: "100%",
                background: "#F8F8F8",
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                gap: "10px",
              }}
            >
              {/* Status row */}
              <StatusBox
                count={movingCount}
                label="Moving"
                color="green"
                background="rgba(0, 255, 0, 0.1)"
                onClick={() => handleStatusClick("moving")}
                isSelected={selectedStatus === "moving"}
              />
              <StatusBox
                count={stoppedCount}
                label="Stopped"
                color="red"
                background="rgba(255, 0, 0, 0.1)"
                onClick={() => handleStatusClick("stopped")}
                isSelected={selectedStatus === "stopped"}
              />
              <StatusBox
                count={idleCount}
                label="Idle"
                color="orange"
                background="rgba(255, 165, 0, 0.1)"
                onClick={() => handleStatusClick("idle")}
                isSelected={selectedStatus === "idle"}
              />
              <StatusBox
                count={offlineCount}
                label="Offline"
                color="black"
                background="rgba(0, 0, 0, 0.08)"
                onClick={() => handleStatusClick("offline")}
                isSelected={selectedStatus === "offline"}
              />
              <StatusBox
                count={inactiveCount}
                label="Inactive"
                color="purple"
                background="rgba(128, 0, 128, 0.1)"
                onClick={() => handleStatusClick("inactive")}
                isSelected={selectedStatus === "inactive"}
              />

              <StatusBox
                count={notConnectedCount}
                label="Not Conn."
                color="purple"
                background="rgba(0, 0, 255, 0.3)"
                onClick={() => handleStatusClick("not_connected")}
                isSelected={selectedStatus === "not_connected"}
              />
              <StatusBox
                count={expiredCount}
                label="Expired"
                color="gray"
                background="rgba(128, 128, 128, 0.2)"
                onClick={() => handleStatusClick("expired")}
                isSelected={selectedStatus === "expired"}
              />

              <StatusBox
                count={devices.length}
                label="Total"
                color="blue"
                background="rgba(0, 0, 255, 0.1)"
                onClick={() => handleStatusClick(null)}
                isSelected={selectedStatus === null}
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginLeft: "auto", // ✅ pushes this box to the far right
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    margin: "0px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Alerts
                </p>
                <Label className="switch mb-0">
                  <Input
                    type="checkbox"
                    checked={alertsEnabled}
                    onChange={() => {
                      dispatch(setAlertsEnabled(!alertsEnabled));
                    }}
                  />
                  <span
                    className="switch-state"
                    style={{ backgroundColor: alertsEnabled ? "green" : "red" }}
                  />
                </Label>
              </div>
            </div>
            <GoogleMap />
          </div>
        </motion.div>
        {/* Single detail window - Overlay on map with bottom-to-top opening, top-to-bottom closing */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{
            y: open ? "100%" : isCollapsed ? "calc(100% - 50px)" : "0%",
            opacity: open ? 0 : 1,
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "35px",
            left: "20px",
            right: "20px",
            height: "45%",
            background: "white",
            borderRadius: "10px",
            overflow: isCollapsed ? "visible" : "hidden",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
            padding: "10px",
            display: open ? "none" : "flex",
            flexDirection: "column",
            gap: "20px",
            fontSize: "24px",
            fontWeight: "semibold",
            zIndex: 10,
            pointerEvents: open ? "none" : "auto",
          }}
        >
          {/* Collapse/Expand Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 20px",
              background: "white",
              borderRadius: "10px 10px 0 0",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              height: "50px",
            }}
          >
            <div
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                flex: 1,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                {selectedSingleDevice?.vehicle?.registrationNo ||
                  "Vehicle Details"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isCollapsed ? (
                  <FaChevronUp size={18} color="#6dbfb8" />
                ) : (
                  <FaChevronDown size={18} color="#6dbfb8" />
                )}
              </button>
              <button
                onClick={() => {
                  setOpen(true);
                  setIsCollapsed(true);
                  dispatch(setSelectedSingleDevice(null));
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "24px",
                  color: "#666",
                  cursor: "pointer",
                  fontWeight: "bold",
                  padding: "0 5px",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Panel Content - Only visible when expanded */}
          <div
            style={{
              marginTop: "50px",
              display: isCollapsed ? "none" : "flex",
              gap: "20px",
              flex: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                maxHeight: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "4px",
                overflowY: "auto",
                overflowX: "hidden",
                borderRight: "1px solid gray",
              }}
              className="scrollbar-hide"
            >
              <div style={{ height: "5px" }}></div>
              {sidebarMenusForSingleVehicle.map((menu, i: any) => {
                return (
                  <>
                    <button
                      data-tooltip-id={`tooltip-${i}`} // Use unique ID for each button
                      data-tooltip-content={menu.tooltipName}
                      onClick={() => {
                        if (i == 5) {
                          setOpenModal(true);
                        } else if (menu.tooltipName === "Send Command") {
                          const mappedDevice = {
                            ...selectedSingleDevice,
                            id:
                              selectedSingleDevice?.traccarDeviceId ||
                              selectedSingleDevice?.deviceId,
                            value: selectedSingleDevice?._id,
                            name:
                              selectedSingleDevice?.vehicle?.registrationNo ||
                              selectedSingleDevice?.registrationNo,
                          };
                          toggleSendCommandModal(mappedDevice);
                        } else {
                          setSelectedComponentIndex(i);
                        }
                      }}
                      style={{
                        backgroundColor:
                          selectedComponentIndex == i
                            ? "#6dbfb8"
                            : "transparent",
                        color:
                          selectedComponentIndex == i ? "white" : "#6dbfb8",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: "32px",
                        minHeight: "32px",
                        maxWidth: "32px",
                        maxHeight: "32px",
                        margin: "4px",
                        marginRight: "8px",
                        border: "2px solid #6dbfb8",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <menu.icon
                        size={18}
                        color={
                          selectedComponentIndex == i ? "white" : "#6dbfb8"
                        }
                      />
                    </button>

                    <Tooltip
                      id={`tooltip-${i}`}
                      place="right" // Position on the right
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#333",
                        color: "white",
                      }}
                    />
                  </>
                );
              })}
            </div>
            {selectedComponentIndex == 0 && <Analytics />}
            {selectedComponentIndex == 1 && <VehicleInfo />}
            {selectedComponentIndex == 2 && <DeviceInfo />}
            {selectedComponentIndex == 3 && <SensorInfo />}
            {selectedComponentIndex == 4 && <CustomerInfo />}
          </div>

          {/* Single Device Data */}
        </motion.div>
      </div>

      {/* Sidebar */}
      <div
        style={{
          maxWidth: "26%",
          minWidth: "26%",
          // maxHeight: "87vh",
          // height: "87vh",
        }}
      >
        <DevicesSidebar
          setOpen={setOpen}
          open={open}
          filteredDevices={filteredDevices}
          onDeviceUpdated={fetchDevices}
        />
      </div>

      {openModal && (
        <PlaybackModal isVisible={openModal} setIsVisible={setOpenModal} />
      )}
      {sendCommandModal && (
        <SendCommand
          addModal={sendCommandModal}
          setAddModal={toggleSendCommandModal}
          prevItem={selectedDeviceForCommand}
        />
      )}
      {addNewDeviceModal && (
        <AddDeviceModal
          isOpen={addNewDeviceModal}
          toggle={() => setAddNewDeviceModal(false)}
          onDeviceAdded={fetchDevices}
        />
      )}
      {addNewCustomerModal && (
        <Modal
          isOpen={addNewCustomerModal}
          toggle={() => setAddNewCustomerModal(false)}
          size="xl"
          centered
        >
          <div style={{ background: "#f8f9fa", padding: "15px", borderBottom: "1px solid #dee2e6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0 }}>Add New Customer</h4>
            <button onClick={() => setAddNewCustomerModal(false)} style={{ background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
          </div>
          <ModalBody style={{ padding: "10px", maxHeight: "80vh", overflowY: "auto", overflowX: "hidden" }}>
            <CreateNewCustomer isModal={true} isNew={true} onClose={() => setAddNewCustomerModal(false)} />
          </ModalBody>
        </Modal>
      )}
    </div>
  );
};

export default MonitoringLatest;

