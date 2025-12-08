import "./CustomerInfo.css";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaUserAlt, FaEnvelope, FaPhone } from "react-icons/fa";

const CustomerInfo = () => {
  const { selectedSingleDevice } = useSelector(
    (state: any) => state.monitoring
  );

  const customer = selectedSingleDevice?.vehicle?.customer;

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
          src="https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
          alt="Customer"
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
            {customer?.fullName || "N/A"}
          </h3>
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              fontWeight: "500",
            }}
          >
            Customer Details
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
          {/* Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              flex: "1 1 100%",
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
              <FaUserAlt size={20} color="#1976d2" />
              <h4 style={{ margin: 0, fontSize: "14px", color: "#1976d2", fontWeight: "600" }}>
                Contact Information
              </h4>
            </div>
            <div style={{ fontSize: "11px", lineHeight: "1.6", display: "flex", gap: "30px", flexWrap: "wrap" }}>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px", alignItems: "center" }}>
                <FaPhone size={14} color="#666" />
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Phone:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {customer?.phoneNo || "N/A"}
                </span>
              </div>
              <div style={{ marginBottom: "6px", display: "flex", gap: "4px", alignItems: "center" }}>
                <FaEnvelope size={14} color="#666" />
                <span style={{ color: "#666", whiteSpace: "nowrap" }}>Email:</span>
                <span style={{ color: "#000", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {customer?.emailAddress || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
