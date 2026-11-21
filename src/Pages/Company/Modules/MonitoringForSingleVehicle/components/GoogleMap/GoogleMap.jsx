import React, { useEffect, useRef, useState } from "react";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { GOOGLE_MAPS_OPTIONS } from "../../../../../../utils/googleMapsOptions";
import { useSelector } from "react-redux";
import "./googleMap.css";
import carIconOnline from "../../../monitoring-assets/online-icon.png";
import carIconStop from "../../../monitoring-assets/stop-icon.png";
import carIconIdle from "../../../monitoring-assets/idle-icon.png";
import carIcon from "../../../monitoring-assets/deviceLocationArrow.png";
import CustomMarker from "./customMarker/CustomMarker";

const GoogleMap = (props) => {
  const { selectedSingleDevice } = useSelector((state) => state.monitoring);
  const [zoom, setZoom] = useState(15);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [address, setAddress] = useState("Loading address...");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const mapRef = useRef(null);

  const position = {
    lat: selectedSingleDevice?.latestPosition?.latitude || 30.3753,
    lng: selectedSingleDevice?.latestPosition?.longitude || 69.3451
  };

  // Fetch address from Nominatim API
  const fetchAddress = async (lat, lng) => {
    if (!lat || !lng) return "Address not available";

    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "AutotelCRM/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch address");
      }

      const data = await response.json();
      const displayAddress = data.display_name || "Address not found";
      setAddress(displayAddress);
      setIsLoadingAddress(false);
      return displayAddress;
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Unable to load address");
      setIsLoadingAddress(false);
      return "Unable to load address";
    }
  };

  const getStatusIcon = () => {
    switch (selectedSingleDevice?.mainVehicleStatus?.toLowerCase()) {
      case "moving":
        return carIconOnline;
      case "stopped":
        return carIconStop;
      case "idle":
        return carIconIdle;
      default:
        return carIcon;
    }
  };

  const getStatusColor = () => {
    switch (selectedSingleDevice?.mainVehicleStatus?.toLowerCase()) {
      case "moving":
        return "#28a745";
      case "stopped":
        return "#dc3545";
      case "idle":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  const handleMarkerClick = () => {
    setShowingInfoWindow(true);
    fetchAddress(position.lat, position.lng);
  };

  // Center map on device when position changes
  useEffect(() => {
    if (selectedSingleDevice?.latestPosition && mapRef.current?.map) {
      mapRef.current.map.panTo(position);
      if (showingInfoWindow) {
        fetchAddress(position.lat, position.lng);
      }
    }
  }, [position.lat, position.lng]);

  if (!props.google) {
    return <div>Loading Map...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Map
        google={props.google}
        zoom={zoom}
        initialCenter={position}
        ref={mapRef}
        gestureHandling="greedy"
        disableDefaultUI={true}
        onZoomChanged={(m, map) => setZoom(map.zoom)}
      >
        <CustomMarker
          map={mapRef.current?.map}
          google={props.google}
          position={position}
          icon={getStatusIcon()}
          rotation={selectedSingleDevice?.latestPosition?.course || 0}
          label={selectedSingleDevice?.registrationNo}
          showLabel={!showingInfoWindow}
          statusColor={getStatusColor()}
          onClick={handleMarkerClick}
        />

        <InfoWindow
          position={position}
          visible={showingInfoWindow}
          onClose={() => setShowingInfoWindow(false)}
          options={{
            disableAutoPan: false,
            pixelOffset: new props.google.maps.Size(0, -40),
            disableClose: true,
            closeBoxMargin: "0",
            closeBoxURL: "",
            maxWidth: 300,
          }}
        >
          <div
            className="elegant-infowindow"
            style={{
              minWidth: "280px",
              maxWidth: "280px",
              overflow: "hidden",
            }}
          >
            {/* 🎨 Compact Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #6dbfb8 0%, #5aa9a2 100%)",
                padding: "8px 12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    padding: "4px 8px",
                    borderRadius: "5px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {selectedSingleDevice?.registrationNo || "N/A"}
                </div>
              </div>
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "9px",
                  backgroundColor:
                    selectedSingleDevice?.latestPosition?.speed > 0
                      ? "rgba(76, 175, 80, 0.9)"
                      : "rgba(255, 87, 34, 0.9)",
                  padding: "4px 8px",
                  borderRadius: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                }}
              >
                {selectedSingleDevice?.latestPosition?.speed > 0 ? "Moving" : "Stopped"}
              </span>
            </div>

            {/* 📊 Compact Main Info Section */}
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "#f8fafa",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "4px",
                }}
              >
                {[
                  {
                    label: "IMEI",
                    value: selectedSingleDevice?.imei || "N/A",
                    icon: "🔧",
                  },
                  {
                    label: "Location & Time",
                    value: address,
                    subValue: selectedSingleDevice?.latestPosition?.deviceTime
                      ? new Date(
                          selectedSingleDevice.latestPosition.deviceTime,
                        ).toLocaleString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })
                      : "N/A",
                    icon: "📍",
                    isLoading: isLoadingAddress,
                  },
                  {
                    label: "Speed",
                    value: `${
                      selectedSingleDevice?.latestPosition?.speed?.toFixed(2) || 0
                    } km/h`,
                    icon: "🚗",
                    highlight: true,
                  },
                  {
                    label: "Ignition",
                    value: selectedSingleDevice?.latestPosition?.attributes?.ignition
                      ? "ON"
                      : "OFF",
                    icon: "🔑",
                    status: selectedSingleDevice?.latestPosition?.attributes?.ignition,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="info-row-hover"
                    style={{
                      backgroundColor: "white",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: item.subValue ? "flex-start" : "center",
                      gap: "8px",
                      borderLeft: item.highlight
                        ? "3px solid #6dbfb8"
                        : "3px solid transparent",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <span style={{ fontSize: "14px", paddingTop: item.subValue ? "2px" : "0" }}>
                      {item.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "9px", color: "#666", marginBottom: "1px", fontWeight: "500" }}>
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color:
                            item.status !== undefined
                              ? item.status
                                ? "#4CAF50"
                                : "#FF5722"
                              : "#333",
                          wordBreak: "break-word",
                          lineHeight: "1.3",
                        }}
                      >
                        {item.isLoading ? "Loading..." : item.value}
                      </div>
                      {item.subValue && (
                        <div style={{ fontSize: "9px", color: "#888", marginTop: "2px", fontWeight: "500" }}>
                          ⏰ {item.subValue}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 📈 Compact Stats Cards Section */}
            <div
              style={{
                padding: "6px 12px",
                paddingTop: "4px",
                backgroundColor: "#f8fafa",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  overflowX: "auto",
                  paddingBottom: "4px",
                }}
              >
                {[
                  {
                    label: "Direction",
                    value: `${selectedSingleDevice?.latestPosition?.course || 0}°`,
                    color: "#4CAF50",
                  },
                  {
                    label: "Power",
                    value: `${
                      selectedSingleDevice?.latestPosition?.attributes?.power?.toFixed(2) || 0
                    }%`,
                    color: "#4CAF50",
                  },
                  {
                    label: "Satellites",
                    value: selectedSingleDevice?.latestPosition?.attributes?.sat || "0",
                    color: "#2196F3",
                  },
                  {
                    label: "Altitude",
                    value: `${selectedSingleDevice?.latestPosition?.altitude || 0}m`,
                    color: "#FF9800",
                  },
                  {
                    label: "Distance",
                    value: `${
                      selectedSingleDevice?.latestPosition?.attributes?.distance?.toFixed(2) || 0
                    } km`,
                    color: "#9C27B0",
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="stat-card-hover"
                    style={{
                      minWidth: "60px",
                      backgroundColor: "white",
                      borderRadius: "6px",
                      padding: "5px 4px",
                      textAlign: "center",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
                      border: `1.5px solid ${stat.color}20`,
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: "bold", color: stat.color, marginBottom: "1px" }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "8px", color: "#666", fontWeight: "500" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
};

export default GoogleApiWrapper(GOOGLE_MAPS_OPTIONS)(GoogleMap);
