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

// import { MapContainer } from "react-leaflet";

const Monitoring = () => {
  const dispatch = useDispatch();
  const { devices, selectedSingleDevice } = useSelector(
    (state) => state.monitoring
  );

  const [loading, setLoading] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(true); // State to toggle MonitoringDetails visibility

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
            (d) => d._id === selectedSingleDevice._id
          );
          dispatch(setSelectedSingleDevice(singleSelectedDevice));
        }
      }
    } catch (error) {
      console.error("Error fetching updated devices:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "92vh",
        top: "2vh",
        marginLeft: "-35px",
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
          backgroundColor: "#F0B832",
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

            // color: "#333",
            transition: "transform 0.7s ease-in-out", // Smooth rotation of the arrow
          }}
        >
          {isDetailsVisible ? (
            <Label
              style={{ fontSize: "25px", cursor: "pointer", width: "40px" }}
              onClick={() => setIsDetailsVisible(!isDetailsVisible)} // Toggle visibility
            >
              <FaArrowAltCircleRight color="black" />
            </Label> // Arrow to open
          ) : (
            <Label
              onClick={() => setIsDetailsVisible(!isDetailsVisible)} // Toggle visibility
              style={{ fontSize: "25px", cursor: "pointer", width: "40px" }}
            >
              <FaArrowAltCircleLeft color="black" />
            </Label> // Arrow to close
          )}

          {isDetailsVisible && (
            <div
              style={{
                width: "full",
                marginRight: "6px",
                display: "flex",
                gap: "20px",
                marginBottom: "10px",
              }}
            >
              <button
                style={{
                  outline: "none",
                  backgroundColor: "#e5e5e5",
                  border: "none",
                  padding: "6px 15px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  // border: "2px solid #35bfbf",
                }}
              >
                Alerts
              </button>
              <button
                style={{
                  outline: "none",
                  // backgroundColor: "white",
                  backgroundColor: "#e5e5e5",
                  border: "none",
                  padding: "6px 15px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  // border: "2px solid #35bfbf",
                }}
              >
                Geofence
              </button>
              <button
                style={{
                  outline: "none",
                  // backgroundColor: "white",
                  backgroundColor: "#e5e5e5",
                  border: "none",
                  padding: "6px 15px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  // border: "2px solid #35bfbf",
                }}
              >
                POI
              </button>
              <button
                style={{
                  outline: "none",
                  // backgroundColor: "white",
                  backgroundColor: "#e5e5e5",
                  border: "none",
                  padding: "6px 15px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  // border: "2px solid #35bfbf",
                }}
              >
                Reports
              </button>
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
