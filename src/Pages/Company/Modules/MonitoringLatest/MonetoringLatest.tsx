import React, { useEffect, useMemo, useState } from "react";
import { ImClock } from "react-icons/im";
import { motion } from "framer-motion"; // ✅ Import Framer Motion
import GoogleMap from "./components/GoogleMap/GoogleMap";
import DevicesSidebar from "./components/DevicesSidebar/DevicesSidebar";
import {
  setDevices,
  setIsConnected,
  setSelectedSingleDevice,
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
import { FaUserAlt } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { MdOutlineSensors } from "react-icons/md";
import { HiDeviceMobile } from "react-icons/hi";
import { FaPlay } from "react-icons/fa6";
import { BsSendArrowUpFill } from "react-icons/bs";
import VehicleInfo from "./components/SingleVehiceDetail/VehicleInfo/VehicleInfo";
import DeviceInfo from "./components/SingleVehiceDetail/DeviceInfo/DeviceInfo";
import SensorInfo from "./components/SingleVehiceDetail/SensorInfo/SensorInfo";
import CustomerInfo from "./components/SingleVehiceDetail/CustomerInfo/CustomerInfo";
import PlaybackModal from "./components/SingleVehiceDetail/PlaybackModal/PlaybackModal";
import { Tooltip } from "react-tooltip";

import "./MonitoringLatest.css";
import { socketConnection } from "../../../../sockets/socket";
import GlassToast from "../../../../components/ui/GlassToast";
import Toast from "../../../../Utilities/toasts/Toast";

const MonitoringLatest = () => {
  const dispatch = useDispatch();
  const { devices, selectedSingleDevice } = useSelector(
    (state: any) => state.monitoring
  );

  const updatesBufferRef = React.useRef<any[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(true); // ✅ control paper open/close
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(setIsConnected(false));
    document.body.style.overflow = "hidden";
    // if (!devices.length) fetchDevices();
    fetchDevices();
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // useEffect(() => {
  //   console.log("selectedSingleDevice", selectedSingleDevice);
  //   console.log("devices", devices);
  // }, [devices]);

  const now: any = new Date();

  const { expiredCount, inactiveCount, movingCount, idleCount, stoppedCount } =
    useMemo(() => {
      // Step 1: Find expired devices
      const expiredDevices = devices.filter((d: any) => {
        const renewalDate = d?.vehicle?.serviceRenewalDate
          ? new Date(d.vehicle.serviceRenewalDate)
          : null;

        if (!renewalDate) return false;

        return renewalDate < now; // expired if renewal date is before now
      });

      const nonExpiredDevices = devices.filter(
        (d: any) => !expiredDevices.includes(d)
      );

      // Step 2: Find inactive devices (from non-expired)
      const inactiveDevices = nonExpiredDevices.filter((d: any) => {
        const deviceTime: any = d?.latestPosition?.deviceTime
          ? new Date(d.latestPosition.deviceTime)
          : null;

        // No deviceTime = inactive
        if (!deviceTime) return true;

        const diffHours = (now - deviceTime) / (1000 * 60 * 60);

        // Inactive if older than 24h
        return diffHours > 24;
      });

      const activeDevices = nonExpiredDevices.filter(
        (d: any) => !inactiveDevices.includes(d)
      );

      // Step 3: From remaining (active & non-expired) — check statuses
      const movingCount = activeDevices.filter(
        (d: any) => d.mainVehicleStatus?.toLowerCase() === "moving"
      ).length;

      const idleCount = activeDevices.filter(
        (d: any) => d.mainVehicleStatus?.toLowerCase() === "idle"
      ).length;

      const stoppedCount = activeDevices.filter(
        (d: any) => d.mainVehicleStatus?.toLowerCase() === "stopped"
      ).length;

      return {
        expiredCount: expiredDevices.length,
        inactiveCount: inactiveDevices.length,
        movingCount,
        idleCount,
        stoppedCount,
      };
    }, [devices]);

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
    {
      icon: TbSettingsPlus,
      tooltipName: "Admin",
    },
    {
      icon: LuLayoutDashboard,
      tooltipName: "Dashboard",
    },
    {
      icon: ImStatsBars2,
      tooltipName: "Reports",
    },
    {
      icon: SlArrowRight,
      tooltipName: "Send Command",
    },
    {
      icon: PiMapPinLineBold,
      tooltipName: "Show Point",
    },
    {
      icon: MdOutlineCameraAlt,
      tooltipName: "Camera",
    },
    {
      icon: FaTasks,
      tooltipName: "Tasks",
    },
    {
      icon: GrHostMaintenance,
      tooltipName: "Maintenance",
    },
    {
      icon: FiSettings,
      tooltipName: "Setup",
    },
    {
      icon: MdAddCall,
      tooltipName: "Call Actions",
    },
  ];

  const StatusBox = ({ count, label, color, background }: any) => {
    return (
      <div
        style={{
          width: "80px",
          height: "100%",
          borderRadius: "8px",
          background: background,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            margin: "0px",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {count}
        </p>
        <p
          style={{
            margin: "0px",
            fontSize: "10px",
            fontWeight: "bold",
            marginTop: "-6px",
            color: color,
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

  const [selectedComponentIndex, setSelectedComponentIndex] = useState(0);

  const sidebarMenusForSingleVehicle = [
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
    console.log("Initial connected state:", socketConnection.connected);

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
      console.log("new_alert_event payload", payload);

      const { actualAlert } = payload || {};
      if (!actualAlert) return;

      const { alertType, message } = actualAlert;

      Toast({
        title: alertType,
        text: message,
        icon: alertType, // handles IGNITION_ON / IGNITION_OFF color & icon
        duration: 3000,
      });
    });

    return () => {
      socketConnection.off("vehicle:updated");
      socketConnection.off("vehicle:created");
      socketConnection.off("vehicle:deleted");
      socketConnection.off("new_alert_event");
    };
  }, []);

  // useEffect(() => {
  //   Toast({
  //     title: "IGNITION_ON",
  //     text: "IGNITION_ON",
  //     icon: "IGNITION_ON", // handles IGNITION_ON / IGNITION_OFF color & icon
  //     duration: 2000,
  //   });
  // }, []);

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
          gap: "5px",
          paddingTop: "20px",
        }}
      >
        {sidebarMenus.map((menu, i: any) => {
          const isSelected = selectedIndex === i;
          return (
            <TooltipButton
              key={i}
              onClick={() => setSelectedIndex(i)}
              tooltip={menu.tooltipName}
              style={{
                width: "45px",
                height: "45px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: isSelected
                  ? "rgba(109, 191, 184, 0.3)"
                  : "transparent",
                transition: "all 0.2s ease-in-out",
                border: "none",
              }}
            >
              <menu.icon size={19} color={isSelected ? "#6dbfb8" : "black"} />
            </TooltipButton>
          );
        })}
      </div>

      {/* Google Map container with animation */}
      <div style={{ maxWidth: "67%", minWidth: "67%" }}>
        <motion.div
          initial={{ height: "87vh", opacity: 1 }}
          // animate={{ height: open ? "87vh" : "75vh", opacity: open ? 1 : 0 }}
          animate={{ height: open ? "87vh" : "55vh" }}
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
              />
              <StatusBox
                count={stoppedCount}
                label="Stopped"
                color="red"
                background="rgba(255, 0, 0, 0.1)"
              />
              <StatusBox
                count={idleCount}
                label="Idle"
                color="orange"
                background="rgba(255, 165, 0, 0.1)"
              />
              <StatusBox
                count={inactiveCount}
                label="Inactive"
                color="purple"
                background="rgba(128, 0, 128, 0.1)"
              />
              <StatusBox
                count={expiredCount}
                label="Expired"
                color="gray"
                background="rgba(128, 128, 128, 0.2)"
              />

              <StatusBox
                count={devices.length}
                label="Total"
                color="blue"
                background="rgba(0, 0, 255, 0.1)"
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginLeft: "auto", // ✅ pushes this box to the far right
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "100%",
                    borderRadius: "8px",
                    background: "rgba(0, 0, 0, 0.1)", // ⚫ Gray with 0.4 alpha
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "auto", // ✅ pushes this box to the far right
                  }}
                >
                  <p
                    style={{
                      margin: "0px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "Gray",
                    }}
                  >
                    Button 1
                  </p>
                </div>

                <div
                  style={{
                    width: "80px",
                    height: "100%",
                    borderRadius: "8px",
                    background: "rgba(0, 0, 0, 0.1)", // ⚫ Gray with 0.4 alpha
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "auto", // ✅ pushes this box to the far right
                  }}
                >
                  <p
                    style={{
                      margin: "0px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "Gray",
                    }}
                  >
                    Button 2
                  </p>
                </div>
              </div>
            </div>
            <GoogleMap />
          </div>
        </motion.div>

        <motion.div
          initial={{ height: "0vh", opacity: 1 }}
          // animate={{ height: open ? "87vh" : "75vh", opacity: open ? 1 : 0 }}
          animate={{ height: open ? "0vh" : "30vh" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{
            maxWidth: "100%",
            minWidth: "100%",
            background: "white",
            borderRadius: "10px",
            // padding: "10px",
            width: "100%",
            position: "relative",
            overflow: "visible", // ✅ Prevents map overflow
            boxShadow: "0 4px 15px rgba(109, 191, 184, 0.4)", // ✅ Shadow
            padding: open ? "0px" : "10px",
            marginTop: "8px",
            display: "flex",
            gap: "20px",
            fontSize: "24px",
            fontWeight: "semibold",
          }}
        >
          <div
            style={{
              // backgroundColor: "rgba(0, 0, 0, 0.6)",
              // width: "90px",
              maxHeight: "27vh",
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
                      if (i == 4) {
                        setOpenModal(true);
                      } else {
                        setSelectedComponentIndex(i);
                      }
                    }}
                    style={{
                      backgroundColor:
                        selectedComponentIndex == i ? "#6dbfb8" : "transparent",
                      color: selectedComponentIndex == i ? "white" : "#6dbfb8",
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
                      color={selectedComponentIndex == i ? "white" : "#6dbfb8"}
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
          {selectedComponentIndex == 0 && <VehicleInfo />}
          {selectedComponentIndex == 1 && <DeviceInfo />}
          {selectedComponentIndex == 2 && <SensorInfo />}
          {selectedComponentIndex == 3 && <CustomerInfo />}

          <div
            style={{
              position: "absolute",
              top: "5px",
              right: "15px",
              color: "green",
              cursor: "pointer",
            }}
            onClick={() => {
              setOpen(!open);
            }}
          >
            x
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
        <DevicesSidebar setOpen={setOpen} open={open} />
      </div>

      {openModal && (
        <PlaybackModal isVisible={openModal} setIsVisible={setOpenModal} />
      )}
    </div>
  );
};

export default MonitoringLatest;

//

{
  /* <StatusBox
                count={118}
                label="Not Conn."
                color="gray"
                background="rgba(128, 128, 128, 0.2)"
              /> */
}
