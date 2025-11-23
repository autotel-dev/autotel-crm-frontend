import React from "react";
import "./VehicleInfo.css";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FaCar, FaShieldAlt, FaWrench } from "react-icons/fa";
import { setSelectedSingleDevice } from "../../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";

const VehicleInfo = () => {
  const dispatch = useDispatch();
  const { selectedSingleDevice } = useSelector(
    (state: any) => state.monitoring
  );

  const vehicle = selectedSingleDevice?.vehicle;

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
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop"
          alt="Vehicle"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </motion.div>
      {/* Left Side - Content */}
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
          {/* Registration Number */}
          <h3
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "3px",
            }}
          >
            {vehicle?.registrationNo || "N/A"}
          </h3>

          {/* Make - Model - Color - Year */}
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              fontWeight: "500",
            }}
          >
            {vehicle?.make?.name || "N/A"} - {vehicle?.model?.name || "N/A"} -{" "}
            {vehicle?.color || "N/A"} - {vehicle?.year || "N/A"}
          </div>
        </div>

        {/* Cards Section */}
        <div
          style={{
            padding: "20px 0px",
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            overflowY: "auto",
          }}
        >
          {/* Basic Info Card */}
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
              <FaCar size={20} color="#1976d2" />
              <h4 style={{ margin: 0, fontSize: "14px", color: "#1976d2", fontWeight: "600" }}>
                Basic Info
              </h4>
            </div>
            <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Engine No:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {vehicle?.engineNo || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Chassis No:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {vehicle?.chasisNo || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Group:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {vehicle?.group?.name || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Technical Info Card */}
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
              <FaWrench size={20} color="#c2185b" />
              <h4 style={{ margin: 0, fontSize: "14px", color: "#c2185b", fontWeight: "600" }}>
                Technical Info
              </h4>
            </div>
            <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Fuel Type:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {vehicle?.fuelType || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Transmission:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {vehicle?.transmissionType || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Service Charges:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {vehicle?.servicePackageCharges || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Insurance Card */}
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
              <FaShieldAlt size={20} color="#388e3c" />
              <h4 style={{ margin: 0, fontSize: "14px", color: "#388e3c", fontWeight: "600" }}>
                Insurance
              </h4>
            </div>
            <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Provider:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {vehicle?.insurance?.name || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Bank:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {vehicle?.bank?.name || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px" }}>
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Renewal Date:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {vehicle?.serviceRenewalDate
                    ? new Date(vehicle.serviceRenewalDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Vehicle Image */}
    </div>
  );
};

export default VehicleInfo;
