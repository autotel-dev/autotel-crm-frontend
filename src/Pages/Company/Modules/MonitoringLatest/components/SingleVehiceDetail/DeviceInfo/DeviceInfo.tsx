import "./DeviceInfo.css";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiDeviceMobile } from "react-icons/hi";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { formatKmh } from "../../../../../../../utils/speed";

const DeviceInfo = () => {
  const { selectedSingleDevice } = useSelector(
    (state: any) => state.monitoring
  );

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        gap: "20px",
      }}
    >
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          width: "220px",
          height: "100%",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <img
          src="https://img.pikbest.com/png-images/20241201/gps-tracker-device-3d-illustration-isolated-on-transparent-background-_11154739.png!w700wp"
          alt="Device"
          style={{
            width: "80%",
            height: "80%",
            objectFit: "contain",
          }}
        />
      </motion.div>

      {/* Right Side - Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            padding: "10px 0px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "3px",
            }}
          >
            {selectedSingleDevice?.vehicle?.imei || "N/A"}
          </h3>
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              fontWeight: "500",
            }}
          >
            {selectedSingleDevice?.latestPosition?.protocol || "N/A"} - Status: {selectedSingleDevice?.status || "N/A"}
          </div>
        </div>

        {/* Cards Section */}
        <div
          style={{
            padding: "20px 0px",
            display: "flex",
            gap: "15px",
            flexWrap: "nowrap",
            overflowY: "auto",
          }}
        >
          {/* Location Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              flex: "1 1 calc(33.333% - 10px)",
              minWidth: "180px",
              backgroundColor: "#e3f2fd",
              borderRadius: "10px",
              padding: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <FaMapMarkerAlt size={20} color="#1976d2" />
              <h4 style={{ margin: 0, fontSize: "14px", color: "#1976d2", fontWeight: "600" }}>
                Location Info
              </h4>
            </div>
            <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Latitude:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {Number(selectedSingleDevice?.latestPosition?.latitude).toFixed(6) || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Longitude:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {Number(selectedSingleDevice?.latestPosition?.longitude).toFixed(6) || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Altitude:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedSingleDevice?.latestPosition?.altitude || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Course:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedSingleDevice?.latestPosition?.course || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Speed & Motion Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              flex: "1 1 calc(33.333% - 10px)",
              minWidth: "180px",
              backgroundColor: "#fce4ec",
              borderRadius: "10px",
              padding: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <HiDeviceMobile size={20} color="#c2185b" />
              <h4 style={{ margin: 0, fontSize: "14px", color: "#c2185b", fontWeight: "600" }}>
                Device Status
              </h4>
            </div>
            <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Speed:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {formatKmh(selectedSingleDevice?.latestPosition?.speed)} km/h
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Protocol:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedSingleDevice?.latestPosition?.protocol || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Time Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              flex: "1 1 calc(33.333% - 10px)",
              minWidth: "180px",
              backgroundColor: "#e8f5e9",
              borderRadius: "10px",
              padding: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <FaClock size={20} color="#388e3c" />
              <h4 style={{ margin: 0, fontSize: "14px", color: "#388e3c", fontWeight: "600" }}>
                Time Information
              </h4>
            </div>
            <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Device Time:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedSingleDevice?.latestPosition?.deviceTime || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Server Time:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedSingleDevice?.latestPosition?.serverTime || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfo;
