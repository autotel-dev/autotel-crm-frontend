import "./SensorInfo.css";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MdOutlineSensors } from "react-icons/md";
import { FaTachometerAlt, FaBolt } from "react-icons/fa";

const SensorInfo = () => {
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
          src="https://static.thenounproject.com/png/sensor-icon-126475-512.png"
          alt="Sensor"
          style={{
            width: "70%",
            height: "70%",
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
            Sensor Information
          </h3>
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              fontWeight: "500",
            }}
          >
            Ignition: {selectedSingleDevice?.latestPosition?.attributes?.ignition === false ? "Off" : "On"} - Motion: {selectedSingleDevice?.latestPosition?.attributes?.motion === false ? "No" : "Yes"}
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
          {/* Distance & Odometer Card */}
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
              <FaTachometerAlt size={20} color="#1976d2" />
              <h4 style={{ margin: 0, fontSize: "14px", color: "#1976d2", fontWeight: "600" }}>
                Distance & Speed
              </h4>
            </div>
            <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Odometer:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {Number(selectedSingleDevice?.latestPosition?.attributes?.odometer).toFixed(2) || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Distance:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {Number(selectedSingleDevice?.latestPosition?.attributes?.totalDistance).toFixed(2) || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Hours:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedSingleDevice?.latestPosition?.attributes?.hours || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Power & Signal Card */}
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
              <FaBolt size={20} color="#c2185b" />
              <h4 style={{ margin: 0, fontSize: "14px", color: "#c2185b", fontWeight: "600" }}>
                Power & Signal
              </h4>
            </div>
            <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Power:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedSingleDevice?.latestPosition?.attributes?.power || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>RSSI:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {Number(selectedSingleDevice?.latestPosition?.attributes?.rssi).toFixed(6) || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>ADC:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {Number(selectedSingleDevice?.latestPosition?.attributes?.adc1).toFixed(2) || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Status Card */}
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
              <MdOutlineSensors size={20} color="#388e3c" />
              <h4 style={{ margin: 0, fontSize: "14px", color: "#388e3c", fontWeight: "600" }}>
                Sensor Status
              </h4>
            </div>
            <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Ignition:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedSingleDevice?.latestPosition?.attributes?.ignition === false ? "Off" : "On"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Motion:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedSingleDevice?.latestPosition?.attributes?.motion === false ? "No" : "Yes"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Status:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedSingleDevice?.status || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SensorInfo;
