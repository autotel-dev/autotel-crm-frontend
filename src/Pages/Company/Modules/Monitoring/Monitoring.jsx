import { useDispatch, useSelector } from "react-redux";
// import GoogleMap from "./components/GoogleMap/GoogleMap";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import MonitoringDetails from "./components/MonitoringDetails/MonitoringDetails";
import MapContainer from "./components/GoogleMap/MapContainer";
import { Label } from "reactstrap";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import { getAll } from "../../../../Utilities/api";
import {
  setDevices,
  setIsConnected,
  setSelectedSingleDevice,
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { GET_PARSER_DEVICES } from "../../../../Utilities/api/apiEndpoints";
import AlertsModal from "./components/Alerts/AlertsModal";
import { socketConnection } from "../../../../sockets/socket";

// import { MapContainer } from "react-leaflet";

const Monitoring = () => {
  const dispatch = useDispatch();
  const { devices, selectedSingleDevice } = useSelector(
    (state) => state.monitoring
  );
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(true); // State to toggle MonitoringDetails visibility

  const [openAlertsModal, setOpenAlertsModal] = useState(false);

  useEffect(() => {
    dispatch(setIsConnected(false));
    document.body.style.overflow = "hidden";
    if (!devices.length) fetchDevices();
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchUpdatedDevices, 6000);
    return () => clearInterval(interval);
  }, [devices]);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data = await getAll({ url: GET_PARSER_DEVICES });
      if (data?.data) {
        const updatedDevices = data.data.map((device) => ({
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

  const fetchUpdatedDevices = async () => {
    try {
      const data = await getAll({ url: GET_PARSER_DEVICES });
      if (data?.data) {
        const updatedDevices = data.data.map((device) => {
          const prevDevice = devices.find((d) => d._id === device._id);
          return {
            ...device,
            checked: prevDevice ? prevDevice.checked : false,
          };
        });
        dispatch(setDevices(updatedDevices));
        if (selectedSingleDevice !== null) {
          const singleSelectedDevice = updatedDevices.find(
            (d) => d._id == selectedSingleDevice._id
          );
          console.log("singleSelectedDevice up : ", singleSelectedDevice);

          dispatch(setSelectedSingleDevice(singleSelectedDevice));
        }
      }
    } catch (error) {
      console.error("Error fetching updated devices:", error);
    }
  };

  // useEffect(() => {
  //   // 🔹 Check immediately (may be false if still connecting)
  //   console.log("Initial connected state:", socketConnection.connected);

  //   // 🔹 Listen for successful connection
  //   socketConnection.on("connect", () => {
  //     console.log("✅ Connected to server with ID:", socketConnection.id);
  //     dispatch(setIsConnected(true));
  //   });

  //   // 🔹 Listen for disconnection
  //   socketConnection.on("disconnect", (reason) => {
  //     console.log("❌ Disconnected from server. Reason:", reason);
  //     dispatch(setIsConnected(false));
  //   });

  //   // 🔹 Listen for connection errors
  //   socketConnection.on("connect_error", (err) => {
  //     console.error("⚠️ Connection failed:", err.message);
  //     dispatch(setIsConnected(false));
  //   });

  //   // 🔹 Your custom events
  //   socketConnection.on("vehicle:updated", (data) => {
  //     console.log("📩 vehicle:updated:", data);
  //   });

  //   socketConnection.on("vehicle:created", (data) => {
  //     console.log("📩 vehicle:created:", data);
  //   });

  //   socketConnection.on("vehicle:deleted", (data) => {
  //     console.log("📩 vehicle:deleted:", data);
  //   });

  //   // cleanup listeners on unmount
  //   return () => {
  //     socketConnection.off("connect");
  //     socketConnection.off("disconnect");
  //     socketConnection.off("connect_error");
  //     socketConnection.off("vehicle:updated");
  //     socketConnection.off("vehicle:created");
  //     socketConnection.off("vehicle:deleted");
  //   };
  // }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "calc(100vh - var(--at-chrome-h, 104px))",
        top: 0,
        marginLeft: 0,
        position: "absolute",
        overflowY: "hidden",
        overflowX: "hidden",
      }}
    >
      {/* MapContainer */}

      <div
        style={{
          width: isDetailsVisible ? "50%" : "100%", // Adjust width when details are hidden
          height: "100%",
          position: "relative",
          transition: "width 0.3s ease-in-out", // Smooth transition for width changes
        }}
      >
        <MapContainer />
      </div>

      {/* MonitoringDetails */}
      <div
        style={{
          width: isDetailsVisible ? "50%" : "40px", // Show a small sidebar for the arrow when hidden
          paddingLeft: "0px",
          // backgroundColor: "#000000",
          // backgroundColor: "#3c4044",
          // backgroundColor: "rgb(240,184,50,0.4)",
          // backgroundColor: "#F0B832",
          backgroundColor: "#1E2329",
          // overflow: "hidden",
          transition: "width 0.7s ease-in-out", // Smooth transition for width changes
        }}
      >
        {/* Toggle Button */}
        <div
          style={{
            // position: "absolute",
            // right: "0px",
            paddingTop: "5px",
            paddingLeft: "6px",

            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            // color: "#333",
            transition: "transform 0.7s ease-in-out", // Smooth rotation of the arrow
          }}
        >
          {isDetailsVisible ? (
            <Label
              style={{ fontSize: "25px", cursor: "pointer", width: "40px" }}
              onClick={() => setIsDetailsVisible(!isDetailsVisible)} // Toggle visibility
            >
              <FaArrowAltCircleRight color="white" />
            </Label> // Arrow to open
          ) : (
            <Label
              onClick={() => setIsDetailsVisible(!isDetailsVisible)} // Toggle visibility
              style={{ fontSize: "25px", cursor: "pointer", width: "40px" }}
            >
              <FaArrowAltCircleLeft color="white" />
            </Label> // Arrow to close
          )}

          {isDetailsVisible && (
            <div
              style={{
                width: "full",
                marginRight: "15px",
                display: "flex",
                gap: "15px",
                marginBottom: "15px",
                marginTop: "10px",
                // justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  outline: "none",
                  backgroundColor: "#21262C",
                  border: "none",
                  padding: "6px 15px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  color: "white",
                  border: "1px solid black",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                }}
                onClick={() => {
                  setOpenAlertsModal(true);
                }}
              >
                Alerts
              </button>

              <button
                style={{
                  outline: "none",
                  // backgroundColor: "white",
                  backgroundColor: "#21262C",
                  border: "none",
                  padding: "6px 15px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  color: "white",
                  border: "1px solid black",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                }}
              >
                Geofence
              </button>
              <button
                style={{
                  outline: "none",
                  // backgroundColor: "white",
                  backgroundColor: "#21262C",
                  border: "none",
                  padding: "6px 15px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  color: "white",
                  border: "1px solid black",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                }}
              >
                POI
              </button>
              <button
                style={{
                  outline: "none",
                  // backgroundColor: "white",
                  backgroundColor: "#21262C",

                  border: "none",
                  padding: "6px 15px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  color: "white",
                  border: "1px solid black",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                }}
                onClick={() => {
                  navigate(`${process.env.PUBLIC_URL}/company/trip-reports`);
                }}
              >
                Reports
              </button>
              {openAlertsModal && (
                <AlertsModal
                  isVisible={openAlertsModal}
                  setIsVisible={setOpenAlertsModal}
                />
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {isDetailsVisible && <MonitoringDetails />}
      </div>
    </div>
  );
};

export default Monitoring;
