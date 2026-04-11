import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Button, Row, Col } from "reactstrap";
import {
  FaCar,
  FaClock,
  FaTachometerAlt,
  FaKey,
  FaStopCircle,
  FaUser,
  FaMobileAlt,
  FaSatellite,
  FaBatteryHalf,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { create } from "../../../../../../Utilities/api";
import { GET_SINGLE_VEHICLE_STOP } from "../../../../../../Utilities/api/apiEndpoints";
import { setMonitoringSession } from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const VehicleDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedSingleDevice } = useSelector(
    (state: any) => state.monitoring,
  );
  const [stopping, setStopping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!selectedSingleDevice) return null;

  const {
    _id: vehicleId,
    registrationNo,
    latestPosition,
    mainVehicleStatus,
    customer,
    make,
    model,
    group,
    imei
  } = selectedSingleDevice;

  const handleStopMonitoring = async () => {
    const result = await Swal.fire({
      title: "Stop Monitoring?",
      text: "This will end the monitoring session for everyone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Stop it!",
    });

    if (result.isConfirmed) {
      setStopping(true);
      try {
        const res: any = await create(
          { vehicleId },
          { url: GET_SINGLE_VEHICLE_STOP },
        );
        if (res?.success) {
          dispatch(setMonitoringSession(null));
          Swal.fire(
            "Stopped",
            "Monitoring session has been closed.",
            "success",
          );
          navigate(-1);
        }
      } catch (err) {
        console.error("Stop error:", err);
      } finally {
        setStopping(false);
      }
    }
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const InfoRow = ({ icon, label, value, color = "#666", valueColor = "#333", boldValue = false }: any) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
      <span style={{ color, fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
        {icon} {label}
      </span>
      <span style={{ 
        fontWeight: boldValue ? "bold" : "500", 
        fontSize: "12px", 
        color: valueColor, 
        textAlign: "right",
        maxWidth: "140px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }}>
        {value || "N/A"}
      </span>
    </div>
  );

  return (
    <Card
      style={{
        width: "320px",
        margin: "15px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderRadius: "20px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
        border: "1px solid rgba(109, 191, 184, 0.4)",
        overflow: "hidden",
        pointerEvents: "auto",
        transition: "all 0.3s ease"
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #6dbfb8 0%, #5aa9a2 100%)",
          padding: "15px 20px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer"
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", padding: "8px", borderRadius: "10px" }}>
            <FaCar size={18} />
          </div>
          <div>
            <h6 style={{ margin: 0, fontWeight: "bold", fontSize: "16px", letterSpacing: "0.5px" }}>{registrationNo}</h6>
            <div style={{ fontSize: "10px", opacity: 0.9 }}>{make?.name} {model?.name}</div>
          </div>
        </div>
        {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
      </div>

      {isExpanded && (
        <CardBody style={{ padding: "18px" }}>
          {/* Main Status Badge */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: "18px" 
          }}>
            <div style={{
              backgroundColor: mainVehicleStatus === "moving" ? "rgba(40, 167, 69, 0.1)" : "rgba(220, 53, 69, 0.1)",
              color: mainVehicleStatus === "moving" ? "#28a745" : "#dc3545",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "bold",
              textTransform: "uppercase",
              border: `1px solid ${mainVehicleStatus === "moving" ? "#28a745" : "#dc3545"}`,
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <div style={{ 
                width: "8px", 
                height: "8px", 
                borderRadius: "50%", 
                backgroundColor: mainVehicleStatus === "moving" ? "#28a745" : "#dc3545",
                boxShadow: `0 0 10px ${mainVehicleStatus === "moving" ? "#28a745" : "#dc3545"}`
              }} />
              {mainVehicleStatus || "Status Unknown"}
            </div>
          </div>

          {/* Telemetry Section */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: "bold", color: "#999", marginBottom: "10px", textTransform: "uppercase" }}>Telemetry</div>
            <InfoRow 
              icon={<FaTachometerAlt color="#6dbfb8" />} 
              label="Current Speed" 
              value={`${Number(latestPosition?.speed || 0).toFixed(1)} km/h`} 
              boldValue={true}
              valueColor="#6dbfb8"
            />
            <InfoRow 
              icon={<FaKey color={latestPosition?.attributes?.ignition ? "#28a745" : "#dc3545"} />} 
              label="Ignition Status" 
              value={latestPosition?.attributes?.ignition ? "Engine ON" : "Engine OFF"}
              valueColor={latestPosition?.attributes?.ignition ? "#28a745" : "#dc3545"}
              boldValue={true}
            />
            <InfoRow 
              icon={<FaClock color="#6dbfb8" />} 
              label="Last Sync" 
              value={formatDateTime(latestPosition?.deviceTime)} 
            />
          </div>

          {/* Device & Attributes */}
          <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#f8fafa", borderRadius: "12px" }}>
             <Row>
               <Col xs="6">
                  <div style={{ fontSize: "9px", color: "#999", marginBottom: "2px" }}>SAT</div>
                  <div style={{ fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                    <FaSatellite color="#2196F3" size={12} /> {latestPosition?.attributes?.sat || 0}
                  </div>
               </Col>
               <Col xs="6">
                  <div style={{ fontSize: "9px", color: "#999", marginBottom: "2px" }}>BATTERY</div>
                  <div style={{ fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                    <FaBatteryHalf color="#FF9800" size={12} /> {Number(latestPosition?.attributes?.power || 0).toFixed(1)}V
                  </div>
               </Col>
             </Row>
          </div>

          {/* Vehicle Info */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: "bold", color: "#999", marginBottom: "10px", textTransform: "uppercase" }}>Vehicle Details</div>
            <InfoRow icon={<FaUser color="#6dbfb8" />} label="Customer" value={customer?.fullName} />
            <InfoRow icon={<FaMobileAlt color="#6dbfb8" />} label="IMEI" value={imei} />
            <InfoRow icon={<FaMapMarkerAlt color="#6dbfb8" />} label="Fleet Group" value={group?.name} />
          </div>

          {/* Actions */}
          <div style={{ borderTop: "1px solid #eee", paddingTop: "15px", textAlign: "center" }}>
            <Button
              color="danger"
              outline
              size="sm"
              disabled={stopping}
              onClick={handleStopMonitoring}
              style={{
                borderRadius: "20px",
                fontSize: "11px",
                padding: "8px 20px",
                transition: "all 0.2s ease",
                fontWeight: "600",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#dc3545";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#dc3545";
              }}
            >
              <FaStopCircle /> {stopping ? "Stopping..." : "End Live Session"}
            </Button>
          </div>
        </CardBody>
      )}
    </Card>
  );
};

export default VehicleDetails;
