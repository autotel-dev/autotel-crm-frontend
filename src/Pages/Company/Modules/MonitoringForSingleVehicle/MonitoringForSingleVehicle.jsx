import { useDispatch, useSelector } from "react-redux";
// import GoogleMap from "./components/GoogleMap/GoogleMap";
import { useEffect } from "react";

import MapContainer from "./components/GoogleMap/MapContainer";

import { setIsConnected } from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import VehicleDetails from "./components/vehicleDetails/VehicleDetails";

// import { MapContainer } from "react-leaflet";

const MonitoringForSingleVehicle = () => {
  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.monitoring);

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (devices?.length === 0) {
      //   getData();
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "90vh",
        top: "2vh",
        marginLeft: "-35px",
        position: "absolute",
        overflowY: "hidden",
      }}
    >
      {/* MapContainer */}
      <div
        style={{
          width: "100%", // Adjust width when details are hidden
          height: "100%",
          position: "relative",
          transition: "width 0.3s ease-in-out", // Smooth transition for width changes
        }}
      >
        <MapContainer />
        <div
          style={{
            position: "absolute",
            // overflowY: "scroll",
            right: 0,
          }}
        >
          <VehicleDetails />
        </div>
      </div>
    </div>
  );
};

export default MonitoringForSingleVehicle;
