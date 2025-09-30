import React, { useEffect, useState } from "react";
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

const MonitoringLatest = () => {
  const dispatch = useDispatch();
  const { devices, selectedSingleDevice } = useSelector(
    (state: any) => state.monitoring
  );

  console.log("selectedSingleDevice", selectedSingleDevice);
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
  //   const interval = setInterval(fetchUpdatedDevices, 6000);
  //   return () => clearInterval(interval);
  // }, [devices]);

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
            };
          }
          return device;
        });

        // Dispatch once every 5 sec
        dispatch(setDevices(updatedDevices));
        console.log("✅ Devices state updated with buffered changes");
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
          // checked: false,
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
      const { id, changes } = payload;

      // get latestPosition update
      const latestPosition = changes?.updatedFields?.latestPosition;
      // console.log("payload", payload);

      if (!latestPosition) return; // no position update
      // Push into buffer (not Redux yet)
      updatesBufferRef.current.push({ id, latestPosition });

      // const updatedDevices = devices.map((device: any) =>
      //   device._id === id ? { ...device, latestPosition } : device
      // );

      // dispatch(setDevices(updatedDevices));
    });

    socketConnection.on("vehicle:created", (payload) => {
      const { id, changes } = payload;

      // get latestPosition update
      const latestPosition = changes?.updatedFields?.latestPosition;
      // console.log("payload", payload);

      if (!latestPosition) return; // no position update
      // Push into buffer (not Redux yet)
      updatesBufferRef.current.push({ id, latestPosition });

      // const updatedDevices = devices.map((device: any) =>
      //   device._id === id ? { ...device, latestPosition } : device
      // );

      // dispatch(setDevices(updatedDevices));
    });

    socketConnection.on("vehicle:deleted", (payload) => {
      const { id, changes } = payload;

      // get latestPosition update
      const latestPosition = changes?.updatedFields?.latestPosition;
      // console.log("payload", payload);

      if (!latestPosition) return; // no position update
      // Push into buffer (not Redux yet)
      updatesBufferRef.current.push({ id, latestPosition });

      // const updatedDevices = devices.map((device: any) =>
      //   device._id === id ? { ...device, latestPosition } : device
      // );

      // dispatch(setDevices(updatedDevices));
    });

    // cleanup listeners on unmount
    return () => {
      socketConnection.off("vehicle:updated");
      socketConnection.off("vehicle:created");
      socketConnection.off("vehicle:deleted");
    };
  }, []);

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
                count={118}
                label="Moving"
                color="green"
                background="rgba(0, 255, 0, 0.1)"
              />
              <StatusBox
                count={118}
                label="Stopped"
                color="red"
                background="rgba(255, 0, 0, 0.1)"
              />
              <StatusBox
                count={118}
                label="Idle"
                color="orange"
                background="rgba(255, 165, 0, 0.1)"
              />
              <StatusBox
                count={118}
                label="Inactive"
                color="purple"
                background="rgba(128, 0, 128, 0.1)"
              />
              <StatusBox
                count={118}
                label="Expired"
                color="gray"
                background="rgba(128, 128, 128, 0.2)"
              />
              <StatusBox
                count={118}
                label="Not Conn."
                color="gray"
                background="rgba(128, 128, 128, 0.2)"
              />
              <StatusBox
                count={118}
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

// const fetchUpdatedDevices = async () => {
//   try {
//     const data: any = await getAll({ url: GET_PARSER_DEVICES });
//     if (data?.data) {
//       const updatedDevices = data.data.map((device: any) => {
//         const prevDevice = devices.find((d: any) => d._id === device._id);
//         return {
//           ...device,
//           checked: prevDevice ? prevDevice.checked : false,
//         };
//       });
//       dispatch(setDevices(updatedDevices));
//       if (selectedSingleDevice !== null) {
//         const singleSelectedDevice = updatedDevices.find(
//           (d: any) => d._id == selectedSingleDevice._id
//         );

//         dispatch(setSelectedSingleDevice(singleSelectedDevice));
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching updated devices:", error);
//   }
// };

// APP_NAME = Suthra Punjab Scheduling
// NODE_ENV = DEVELOPMENT
// #NODE_ENV = PRODUCTION
// JWT_SECRET = 31fe6586dbfa72e390bf430f5a0218282880bc40e571e83f8bcaf2f5be3e4707
// MONGO_DB_URI_DEV = mongodb://192.168.18.122:27017/AutotelControlRoomDB
// MONGO_DB_URI_PROD = mongodb://127.0.0.1:27017/AutotelControlRoomDB
// PORT = 8083
// MONGO_DB_URI_CLOUD = mongodb+srv://sandesh:sandesh123@autotel-crm-cluster.4dqcl.mongodb.net/CrmServiceDB
// LOAD_BALANCER = false
// CONCOX_GPS_PORT = 8082
// KINGWU_GPS_PORT = 8083
// WORK_SPACE = REMOTE
// MONGO_DB_URI_CRM_SERVICE_CLOUD = mongodb+srv://sandesh:sandesh123@autotel-crm-cluster.4dqcl.mongodb.net/CrmServiceDB
// MONGO_DB_URI_TESTING = mongodb://127.0.0.1:27017/suthra-punjab-testing

// import { ENVIRONMENTS, WORK_SPACES } from "../constants/basic.js";
// import { ERROR_MESSAGES } from "../constants/errors.js";
// import {
//   STATUS_CODE,
//   STATUS_MESSAGES,
//   SUCCESS_MESSAGES,
// } from "../constants/response.js";
// import SuccessResponse from "./classes/successResponse.js";

// export const getCurrentRunningEnvironment = () => {
//   return process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT
//     ? ENVIRONMENTS.DEVELOPMENT
//     : ENVIRONMENTS.PRODUCTION;
// };

// export const validateRequiredFields = (body, requiredFields) => {
//   return new Promise((resolve, reject) => {
//     const missingFields = requiredFields.filter((field) => !body[field]);

//     if (missingFields.length > 0) {
//       resolve(
//         SuccessResponse.custom(
//           false,
//           STATUS_MESSAGES.ERROR,
//           STATUS_CODE.BAD_REQUEST,
//           ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS,
//           { missingFields }
//         )
//       );
//     } else {
//       resolve(
//         SuccessResponse.custom(
//           true,
//           STATUS_MESSAGES.SUCCESS,
//           STATUS_CODE.OK,
//           SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
//           null
//         )
//       );
//     }
//   });
// };

// export const getAppName = () => {
//   return `${process.env.APP_NAME}`;
// };

// export function getDatabaseURI() {
//   const NODE_ENV = getCurrentRunningEnvironment();
//   const WORK_SPACE = process.env.WORK_SPACE;

//   // return NODE_ENV === ENVIRONMENTS.DEVELOPMENT
//   //   ? WORK_SPACE === WORK_SPACES.REMOTE
//   //     ? process.env.MONGO_DB_URI_CLOUD
//   //     : process.env.MONGO_DB_URI_DEV
//   //   : process.env.MONGO_DB_URI_PROD;

//   return NODE_ENV === ENVIRONMENTS.DEVELOPMENT
//     ? WORK_SPACE === WORK_SPACES.REMOTE
//       ? process.env.MONGO_DB_URI_TESTING
//       : process.env.MONGO_DB_URI_DEV
//     : process.env.MONGO_DB_URI_PROD;
// }

// export function restructureArray(data) {
//   if (!Array.isArray(data)) {
//     throw new Error("Input must be an array.");
//   }

//   const result = [];

//   data.forEach((group) => {
//     console.log("group : ", group.title);

//     const { id: groupId, title: groupName, items } = group;
//     if (!Array.isArray(items)) {
//       throw new Error(`Items for group with id ${groupId} must be an array.`);
//     }

//     items.forEach((vehicle) => {
//       result.push({
//         ...vehicle,
//         groupId,
//         groupName,
//       });
//     });
//   });

//   return result;
// }

// // export const formatDuration = (durationMs) => {
// //   const minutes = Math.floor(durationMs / 60000);
// //   const seconds = Math.floor((durationMs % 60000) / 1000);
// //   const milliseconds = Math.floor(durationMs % 1000);
// //   return `${minutes} minute(s), ${seconds} second(s), and ${milliseconds} ms`;
// // };

// export const formatDuration = (durationMs) => {
//   const hours = Math.floor(durationMs / 3600000);
//   const minutes = Math.floor((durationMs % 3600000) / 60000);
//   const seconds = Math.floor((durationMs % 60000) / 1000);
//   const milliseconds = Math.floor(durationMs % 1000);
//   return `${hours} hour(s), ${minutes} minute(s), ${seconds} second(s), and ${milliseconds} ms`;
// };

// export const formatSeconds = (totalSeconds) => {
//   const hours = Math.floor(totalSeconds / 3600); // Calculate total hours
//   const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining minutes
//   const seconds = totalSeconds % 60; // Remaining seconds
//   return `${hours} hour(s), ${minutes} minute(s), and ${seconds} second(s)`;
// };

// export function formatTimestamp(milliseconds) {
//   const date = new Date(milliseconds);

//   // Helper to ensure two-digit formatting
//   const pad = (num) => (num < 10 ? `0${num}` : num);

//   const year = date.getFullYear();
//   const month = pad(date.getMonth() + 1); // Months are zero-based
//   const day = pad(date.getDate());
//   const hours = pad(date.getHours());
//   const minutes = pad(date.getMinutes());
//   const seconds = pad(date.getSeconds());

//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }

// export function convertToStandardFormat(input) {
//   // Split the input into date and time components
//   const [datePart, timePart, meridian] = input.split(/[\s]+/);

//   // Extract month, day, and year from the date
//   const [month, day, year] = datePart.split("-");

//   // Extract hours, minutes, and seconds from the time
//   let [hours, minutes, seconds] = timePart.split(":");

//   // Convert 12-hour time to 24-hour time
//   if (meridian === "PM" && hours !== "12") {
//     hours = String(Number(hours) + 12);
//   } else if (meridian === "AM" && hours === "12") {
//     hours = "00";
//   }

//   // Construct and return the new format
//   return `${
//     year >= "2036" ? "2025" : year
//   }-${day}-${month} ${hours}:${minutes}:${seconds}`;
// }

// export const convertSecondsToDecimalMinutes = (seconds) => {
//   if (typeof seconds !== "number" || seconds < 0) {
//     throw new Error("Input must be a non-negative number.");
//   }

//   return (seconds / 60).toFixed(2); // Convert to minutes and round to 2 decimal places
// };

// export function getKeyByColor(iconColor, iconColors) {
//   for (const [key, value] of Object.entries(iconColors)) {
//     if (value === iconColor) {
//       return key; // Return the first matching key
//     }
//   }
//   return null; // Return null if no match is found
// }

// export function filterTodayAndYesterday(arr) {
//   const now = new Date();

//   // Get today's date at midnight
//   const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   // Get tomorrow's date at midnight
//   const tomorrowStart = new Date(todayStart);
//   tomorrowStart.setDate(todayStart.getDate() + 1);
//   // Get yesterday's date at midnight
//   const yesterdayStart = new Date(todayStart);
//   yesterdayStart.setDate(todayStart.getDate() - 1);

//   return arr.filter((item) => {
//     const ts = new Date(item.timestamp);
//     return ts >= yesterdayStart && ts < tomorrowStart;
//   });
// }

// export function filterBeforeYesterday(arr) {
//   const now = new Date();

//   // Get today's date at midnight
//   const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   // Get yesterday's date at midnight
//   const yesterdayStart = new Date(todayStart);
//   yesterdayStart.setDate(todayStart.getDate() - 1);

//   return arr
//     .filter((item) => {
//       const ts = new Date(item.timestamp);
//       return ts < yesterdayStart; // strictly before yesterday
//     })
//     .map((item) => item); // return only names
// }
