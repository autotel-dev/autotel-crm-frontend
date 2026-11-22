import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import MapContainer from "./components/GoogleMap/MapContainer";
import VehicleDetails from "./components/vehicleDetails/VehicleDetails";
import { 
  setIsConnected, 
  setMonitoringSession, 
  setSelectedSingleDevice 
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { getAll, create } from "../../../../Utilities/api";
import { 
  GET_SINGLE_VEHICLE_START, 
  GET_SINGLE_VEHICLE_STATUS 
} from "../../../../Utilities/api/apiEndpoints";
import { socketConnection } from "../../../../sockets/socket";
import Swal from "sweetalert2";

const MonitoringForSingleVehicle = () => {
  const { vehicleId } = useParams();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { monitoringSession, selectedSingleDevice } = useSelector((state) => state.monitoring);
  const [loading, setLoading] = useState(true);

  const initMonitoring = useCallback(async () => {
    // 1. Check if we already have the correct device data in Redux (pre-fetched by sidebar)
    if (selectedSingleDevice?._id === vehicleId && monitoringSession) {
      console.log("Using pre-fetched monitoring data from Redux.");
      setLoading(false);
      
      const joinPayload = { vehicleId };
      if (userData?.role === "super_admin") {
        joinPayload.companyId = monitoringSession.company;
      }
      console.log("Socket Emit >> vehicle:monitor:join (pre-fetched)", joinPayload);
      socketConnection.emit("vehicle:monitor:join", joinPayload);
      return;
    }

    setLoading(true);
    try {
      // 1. Check if session already active on server
      const statusUrl = GET_SINGLE_VEHICLE_STATUS.replace(":vehicleId", vehicleId);
      const sessionRes = await getAll({ url: statusUrl });

      let activeData = null;

      if (sessionRes?.success && sessionRes?.data?.session) {
        activeData = sessionRes.data;
      } else {
        // 2. If no active session, start one
        const startRes = await create(
          { vehicleId },
          { url: GET_SINGLE_VEHICLE_START },
        );
        if (startRes?.success && startRes?.data?.session) {
          activeData = startRes.data;
        }
      }

      if (activeData) {
        // Hydrate UI with initial data
        dispatch(setMonitoringSession(activeData.session));
        dispatch(setSelectedSingleDevice({
          ...activeData.vehicle,
          traccarDevice: activeData.traccarDevice,
          latestPosition: activeData.latestPosition,
          mainVehicleStatus: activeData.vehicleStatus
        }));

        // 3. Connect Socket and Join Room
        const joinPayload = { vehicleId };
        if (userData?.role === "super_admin") {
          joinPayload.companyId = activeData.session.company;
        }
        
        console.log("Socket Emit >> vehicle:monitor:join", joinPayload);
        socketConnection.emit("vehicle:monitor:join", joinPayload);
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to initialize vehicle monitoring.",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Monitoring Init Error:", error);
    } finally {
      setLoading(false);
    }
  }, [vehicleId, dispatch, userData]);

  useEffect(() => {
    dispatch(setIsConnected(false));
    document.body.style.overflow = "hidden";
    
    initMonitoring();

    // Socket Event Listeners
    const handleUpdate = (payload) => {
      console.log("Socket Listen << vehicle:monitor:update", payload);
      if (payload.ids.vehicleId === vehicleId) {
        dispatch(setSelectedSingleDevice({
          ...payload.vehicle,
          traccarDevice: payload.traccarDevice,
          latestPosition: payload.latestPosition,
          mainVehicleStatus: payload.vehicleStatus
        }));
      }
    };

    const handleStop = (payload) => {
      console.log("Socket Listen << vehicle:monitor:stop", payload);
      if (payload.vehicleId === vehicleId) {
        Swal.fire({
          title: "Monitoring Ended",
          text: "The monitoring session has been closed by the system.",
          icon: "info"
        });
        // Optionally redirect or show ended state
      }
    };

    socketConnection.on("vehicle:monitor:update", handleUpdate);
    socketConnection.on("vehicle:monitor:stop", handleStop);
    socketConnection.on("vehicle:monitor:joined", (data) => {
      console.log("Socket Listen << vehicle:monitor:joined", data);
      dispatch(setIsConnected(true));
    });

    return () => {
      document.body.style.overflow = "unset";
      // Cleanup: Leave Room
      console.log("Socket Emit >> vehicle:monitor:leave", { vehicleId });
      socketConnection.emit("vehicle:monitor:leave", { vehicleId });
      socketConnection.off("vehicle:monitor:update", handleUpdate);
      socketConnection.off("vehicle:monitor:stop", handleStop);
      socketConnection.off("vehicle:monitor:joined");
    };
  }, [vehicleId, dispatch, initMonitoring]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100%' }}>
        <h3>Loading Monitoring Session...</h3>
      </div>
    );
  }

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
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transition: "width 0.3s ease-in-out",
        }}
      >
        <MapContainer />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0
          }}
        >
          <VehicleDetails />
        </div>
      </div>
    </div>
  );
};

export default MonitoringForSingleVehicle;

