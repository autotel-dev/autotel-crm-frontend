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
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { GET_DEVICES_PARSER_RENTAL } from "../../../../Utilities/api/apiEndpoints";

// import { MapContainer } from "react-leaflet";

const Monitoring = () => {
  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.monitoring);

  const [loading, setLoading] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(true); // State to toggle MonitoringDetails visibility

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);

  const [da, setDa] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (devices?.length === 0) {
      getData();
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const [decodedToken, setDecodedToken] = useState("");

  // useEffect(() => {
  //   const fetchInterval = setInterval(() => {
  //     getData();
  //   }, 500000);

  //   return () => {
  //     clearInterval(fetchInterval);
  //   };
  // }, []);

  const navigate = useNavigate();

  const getData = () => {
    setLoading(true);
    getAll({ url: GET_DEVICES_PARSER_RENTAL }).then((data) => {
      if (data !== undefined) {
        console.log("dataa - ", data);

        // const devicess = data?.data.map((dev, ind) => ({
        //   ...dev,
        //   checked: false,
        // }));

        dispatch(
          setDevices(
            data?.data?.map((dev, ind) => ({
              ...dev,
              checked: false,
            })) || []
          )
        );

        setLoading(false);
      } else {
        Swal.fire({
          text: `Data not found`,
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
      }
    });
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
            paddingLeft: "10px",

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
              <FaArrowAltCircleRight />
            </Label> // Arrow to open
          ) : (
            <Label
              onClick={() => setIsDetailsVisible(!isDetailsVisible)} // Toggle visibility
              style={{ fontSize: "25px", cursor: "pointer", width: "40px" }}
            >
              <FaArrowAltCircleLeft />
            </Label> // Arrow to close
          )}

          <div
            style={{
              width: "full",
              marginRight: "18px",
              display: "flex",
              gap: "20px",
              marginBottom: "10px",
            }}
          >
            <button
              style={{
                outline: "none",
                backgroundColor: "white",
                border: "none",
                padding: "6px 15px",
                fontWeight: "bold",
                borderRadius: "5px",
                border: "2px solid #35bfbf",
              }}
            >
              Alerts
            </button>
            <button
              style={{
                outline: "none",
                backgroundColor: "white",
                border: "none",
                padding: "6px 15px",
                fontWeight: "bold",
                borderRadius: "5px",
                border: "2px solid #35bfbf",
              }}
            >
              Geofence
            </button>
            <button
              style={{
                outline: "none",
                backgroundColor: "white",
                border: "none",
                padding: "6px 15px",
                fontWeight: "bold",
                borderRadius: "5px",
                border: "2px solid #35bfbf",
              }}
            >
              POI
            </button>
            <button
              style={{
                outline: "none",
                backgroundColor: "white",
                border: "none",
                padding: "6px 15px",
                fontWeight: "bold",
                borderRadius: "5px",
                border: "2px solid #35bfbf",
              }}
            >
              Reports
            </button>
          </div>
        </div>

        {/* Content */}
        {isDetailsVisible && <MonitoringDetails />}
      </div>
    </div>
  );
};

export default Monitoring;
