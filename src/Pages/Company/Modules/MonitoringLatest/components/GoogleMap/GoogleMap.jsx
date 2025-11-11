import { useEffect, useRef, useState } from "react";
import {
  Map,
  GoogleApiWrapper,
  InfoWindow,
  Circle,
  Rectangle,
  Polygon,
} from "google-maps-react";
import { useDispatch, useSelector } from "react-redux";
import "./googleMap.css";
import carIcon from "../../../monitoring-assets/deviceLocationArrow.png";

import { MdAdd } from "react-icons/md";
import { GrFormSubtract } from "react-icons/gr";
import { FaLocationArrow } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { FaTrafficLight } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaRegMap } from "react-icons/fa6";

import { setExpandedDevice } from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import CustomMarker from "./customMarker/CustomMarker";

const GoogleMap = (props) => {
  const { devicesDetailData, devices, selectedSingleDevice } = useSelector(
    (state) => state.monitoring
  );
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState(8);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const [infoWindowVisible, setInfoWindowVisible] = useState(false);
  const [showGeofences, setShowGeofences] = useState(false);
  const mapRef = useRef(null);

  const [deviceData, setDeviceData] = useState({ lat: 30.3753, lng: 69.3451 });

  const devicesArray = devicesDetailData || [];

  const zoomIn = () => setZoom((prevZoom) => prevZoom + 1);
  const zoomOut = () => setZoom((prevZoom) => prevZoom - 1);

  const handleMarkerClick = (device) => {
    setSelectedDevice(device);
    setInfoWindowPosition({
      lat: device?.latestPosition?.latitude,
      lng: device?.latestPosition?.longitude,
    });
    dispatch(setExpandedDevice(true));
    setInfoWindowVisible(!infoWindowVisible);
  };

  const closeInfoWindow = () => {
    setInfoWindowVisible(false);
    dispatch(setExpandedDevice(false));
  };

  const toggleGeofences = () => {
    setShowGeofences(!showGeofences);
  };

  useEffect(() => {
    if (
      selectedSingleDevice &&
      selectedSingleDevice.latestPosition?.latitude &&
      selectedSingleDevice.latestPosition?.longitude &&
      mapRef.current?.map
    ) {
      const latLng = {
        lat: selectedSingleDevice.latestPosition.latitude,
        lng: selectedSingleDevice.latestPosition.longitude,
      };
      mapRef.current.map.panTo(latLng);
      setZoom(14);
    }
  }, [selectedSingleDevice]);

  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

  // Get all devices that have geofences
  const getDevicesWithGeofences = () => {
    return (
      devices?.filter(
        (device) =>
          device.checked &&
          device.vehicle?.geofences &&
          device.vehicle.geofences.length > 0
      ) || []
    );
  };

  // Render geofences for all devices
  const renderGeofences = () => {
    if (!showGeofences) return null;

    const devicesWithGeofences = getDevicesWithGeofences();

    return devicesWithGeofences.map((device) =>
      device.vehicle.geofences.map((geofence, index) => {
        const key = `${device._id}-${geofence._id}-${index}`;

        if (geofence.type === "circle") {
          return (
            <Circle
              key={key}
              center={geofence.geofencePositions.center}
              radius={geofence.geofencePositions.radius}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                clickable: false,
              }}
            />
          );
        } else if (geofence.type === "rectangle") {
          // For rectangle, we need to convert bounds to proper format
          const bounds = {
            north:
              geofence.geofencePositions.bounds?.north ||
              geofence.geofencePositions.bounds?.northeast?.lat,
            south:
              geofence.geofencePositions.bounds?.south ||
              geofence.geofencePositions.bounds?.southwest?.lat,
            east:
              geofence.geofencePositions.bounds?.east ||
              geofence.geofencePositions.bounds?.northeast?.lng,
            west:
              geofence.geofencePositions.bounds?.west ||
              geofence.geofencePositions.bounds?.southwest?.lng,
          };

          return (
            <Rectangle
              key={key}
              bounds={bounds}
              options={{
                strokeColor: "#0000FF",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#0000FF",
                fillOpacity: 0.35,
                clickable: false,
              }}
            />
          );
        } else if (geofence.type === "polygon") {
          // For polygon, ensure paths are in correct format
          const paths =
            geofence.geofencePositions.bounds ||
            geofence.geofencePositions.paths ||
            [];

          return (
            <Polygon
              key={key}
              paths={paths}
              options={{
                strokeColor: "#00FF00",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#00FF00",
                fillOpacity: 0.35,
                clickable: false,
              }}
            />
          );
        }

        return null;
      })
    );
  };

  // Tooltip component
  const TooltipButton = ({
    onClick,
    children,
    tooltip,
    style,
    isActive = false,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          position: "relative",
          display: "inline-block",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={onClick}
          className="zoom-button tooltip-button"
          style={{
            ...style,
            backgroundColor: isActive ? "red" : "#6dbfb8",
            border: isActive ? "2px solid white" : "none",
          }}
        >
          {children}
        </button>
        {isHovered && <div className="tooltip-text">{tooltip}</div>}
      </div>
    );
  };

  return (
    <Map
      google={props.google}
      zoom={zoom}
      initialCenter={deviceData}
      ref={mapRef}
      gestureHandling="greedy"
      disableDefaultUI={true}
    >
      {devices?.map(
        (device) =>
          device.checked && (
            <CustomMarker
              key={device?._id}
              map={mapRef.current?.map}
              google={props.google}
              position={{
                lat: device?.latestPosition?.latitude,
                lng: device?.latestPosition?.longitude,
              }}
              icon={carIcon}
              rotation={device?.latestPosition?.course}
              onClick={() => handleMarkerClick(device)}
            />
          )
      )}

      {/* Render geofences */}
      {renderGeofences()}

      {/* OLD COMMENTED INFOWINDOW - KEPT FOR REFERENCE
      <InfoWindow
        position={infoWindowPosition}
        visible={infoWindowVisible}
        onClose={closeInfoWindow}
        options={{
          disableAutoPan: false,
          pixelOffset: new props.google.maps.Size(0, -40),
          disableClose: true,
          closeBoxMargin: "0",
          closeBoxURL: "",
          maxWidth: 400,
        }}
      >
        <div
          style={{
            minWidth: "400px",
            overflow: "hidden !important",
            margin: "0px !important",
            padding: "0px !important",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 25px",
              borderBottom: "1px solid lightgray",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <h2>VB 4285 </h2>
              <span
                style={{
                  marginLeft: "16px",
                  color: "gray",
                  fontWeight: "bold",
                }}
              >
                Van
              </span>
            </div>
            <span style={{ fontWeight: "bold", color: "red" }}>on route</span>
          </div>

          <div
            style={{
              padding: "10px 25px",
              borderBottom: "0.5px solid lightgray",
            }}
          >
            <div
              style={{
                marginTop: "10px",
                marginBottom: "5px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Device ID:</strong>{" "}
              {selectedDevice?.id}
            </div>
            <div
              style={{
                marginBottom: "5px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Address:</strong>{" "}
              {selectedDevice?.latestPosition?.speed} Makran Coastal Highway,
              Lota Bazaar, Kund Malir, Liari Tehsil.
            </div>
            <div
              style={{
                marginBottom: "5px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Time:</strong>{" "}
              {selectedDevice?.latestPosition?.speed} 07-05-2025 11:53:56 AM
            </div>

            <div
              style={{
                marginBottom: "5px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Stop Duration:</strong>{" "}
              {selectedSingleDevice?.latestPosition?.speed} 1h 31min 6s
            </div>
            <div
              style={{
                marginBottom: "5px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Speed:</strong>{" "}
              {selectedSingleDevice?.latestPosition?.speed == 0
                ? "0"
                : selectedSingleDevice?.latestPosition?.speed}{" "}
              km/h
            </div>
            <div
              style={{
                marginBottom: "15px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Ignition:</strong>{" "}
              {selectedSingleDevice?.latestPosition?.attributes?.ignition ===
              false
                ? "OFF"
                : "ON"}
            </div>
          </div>

          <div
            style={{
              padding: "0px 25px",
              paddingBottom: "15px",
              paddingTop: "20px",
              display: "flex",
              overflowX: "auto",
              gap: "5px",
              borderBottom: "0.5px solid lightgray",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <div
              style={{
                border: "0.5px solid lightgray",
                borderRadius: "5px",
                padding: "12px 0px",
                fontWeight: "400",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "2px",
                minWidth: "170px",
                maxWidth: "170px",
                flexShrink: 0,
              }}
              className="info-box"
            >
              <div style={{ color: "gray" }}>Vehicle Condition</div>
              <div style={{ color: "red" }}>Critical</div>
            </div>
            <div
              style={{
                border: "0.5px solid lightgray",
                borderRadius: "5px",
                padding: "12px 0",
                fontWeight: "400",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "2px",
                minWidth: "170px",
                maxWidth: "170px",
                flexShrink: 0,
              }}
              className="info-box"
            >
              <div style={{ color: "gray" }}>Number of Errors</div>
              <div style={{ color: "red" }}>1</div>
            </div>
            <div
              style={{
                border: "0.5px solid lightgray",
                borderRadius: "5px",
                padding: "12px 0",
                fontWeight: "400",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "2px",
                minWidth: "170px",
                maxWidth: "170px",
                flexShrink: 0,
              }}
              className="info-box"
            >
              <div style={{ color: "gray" }}>Average Speed</div>
              <div style={{ color: "black", fontSize: "13px" }}>62.5 MPH</div>
            </div>
            <div
              style={{
                border: "0.5px solid lightgray",
                borderRadius: "5px",
                padding: "12px 0px",
                fontWeight: "400",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "2px",
                minWidth: "170px",
                maxWidth: "170px",
                flexShrink: 0,
              }}
              className="info-box"
            >
              <div style={{ color: "gray" }}>Fuel Consumption</div>
              <div style={{ color: "black", fontSize: "13px" }}>5.99 MPG</div>
            </div>
          </div>

          <div
            style={{
              padding: "15px 25px",
              paddingBottom: "15px",
              display: "flex",
              justifyContent: "space-between",
              gap: "5px",
            }}
          >
            <button
              style={{
                minWidth: "170px",
                maxWidth: "170px",
                border: "none",
                outline: "none",
                backgroundColor: "lightgray",
                fontWeight: "600",
                color: "black",
                textAlign: "center",
                padding: "15px",
                borderRadius: "5px",
              }}
            >
              ALL EVENTS
            </button>
            <button
              style={{
                minWidth: "170px",
                maxWidth: "170px",
                border: "none",
                outline: "none",
                backgroundColor: "lightgray",
                fontWeight: "600",
                color: "black",
                textAlign: "center",
                padding: "15px",
                borderRadius: "5px",
              }}
            >
              TRIP
            </button>
          </div>
        </div>
      </InfoWindow>
      END OF OLD COMMENTED INFOWINDOW */}

      {/* ✨ NEW BEAUTIFUL ANIMATED INFOWINDOW ✨ */}
      <InfoWindow
        position={infoWindowPosition}
        visible={infoWindowVisible}
        onClose={closeInfoWindow}
        options={{
          disableAutoPan: false,
          pixelOffset: new props.google.maps.Size(0, -40),
          disableClose: true,
          closeBoxMargin: "0",
          closeBoxURL: "",
          maxWidth: 380,
        }}
      >
        <div
          className="elegant-infowindow"
          style={{
            minWidth: "360px",
            maxWidth: "360px",
            overflow: "hidden",
            margin: "0px",
            padding: "0px",
            borderRadius: "10px",
            boxShadow: "0 6px 20px rgba(109, 191, 184, 0.2)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          {/* 🎨 Header with gradient background */}
          <div
            style={{
              background: "linear-gradient(135deg, #6dbfb8 0%, #5aa9a2 100%)",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "150px",
                height: "150px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
              }}
            ></div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", zIndex: 1 }}>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  backdropFilter: "blur(10px)",
                }}
              >
                {selectedDevice?.vehicle?.registrationNo || "N/A"}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  padding: "3px 8px",
                  borderRadius: "10px",
                }}
              >
                {selectedDevice?.vehicle?.vehicleType || "Vehicle"}
              </span>
            </div>
            <span
              style={{
                fontWeight: "600",
                fontSize: "11px",
                backgroundColor: selectedDevice?.latestPosition?.speed > 0 ? "rgba(76, 175, 80, 0.9)" : "rgba(255, 87, 34, 0.9)",
                padding: "5px 10px",
                borderRadius: "12px",
                zIndex: 1,
                textTransform: "uppercase",
                letterSpacing: "0.3px",
              }}
            >
              {selectedDevice?.latestPosition?.speed > 0 ? "Moving" : "Stopped"}
            </span>
          </div>

          {/* 📊 Main Info Section with modern cards */}
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#f8fafa",
            }}
          >
            {/* Info Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "6px",
              }}
            >
              {[
                { label: "Device ID", value: selectedDevice?.id || "N/A", icon: "🔧" },
                { label: "Address", value: selectedDevice?.latestPosition?.address || "Loading address...", icon: "📍" },
                {
                  label: "Time",
                  value: selectedDevice?.latestPosition?.deviceTime
                    ? new Date(selectedDevice.latestPosition.deviceTime).toLocaleString()
                    : "N/A",
                  icon: "⏰"
                },
                {
                  label: "Speed",
                  value: `${selectedDevice?.latestPosition?.speed || 0} km/h`,
                  icon: "🚗",
                  highlight: true
                },
                {
                  label: "Ignition",
                  value: selectedDevice?.latestPosition?.attributes?.ignition ? "ON" : "OFF",
                  icon: "🔑",
                  status: selectedDevice?.latestPosition?.attributes?.ignition
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "white",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    borderLeft: item.highlight ? "3px solid #6dbfb8" : "3px solid transparent",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
                    transition: "all 0.3s ease",
                    cursor: "default",
                  }}
                  className="info-row-hover"
                >
                  <span style={{ fontSize: "16px", filter: "grayscale(0.2)" }}>
                    {item.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "10px", color: "#666", marginBottom: "1px", fontWeight: "500" }}>
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: item.status !== undefined
                          ? (item.status ? "#4CAF50" : "#FF5722")
                          : "#333",
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 📈 Stats Cards Section */}
          <div
            style={{
              padding: "12px 16px",
              paddingTop: "0px",
              backgroundColor: "#f8fafa",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "6px",
                overflowX: "auto",
                paddingBottom: "8px",
                scrollbarWidth: "thin",
                scrollbarColor: "#6dbfb8 #f0f0f0",
              }}
            >
              {[
                { label: "Battery", value: `${selectedDevice?.latestPosition?.attributes?.battery || 0}%`, color: "#4CAF50" },
                { label: "Satellites", value: selectedDevice?.latestPosition?.attributes?.sat || "0", color: "#2196F3" },
                { label: "Altitude", value: `${selectedDevice?.latestPosition?.altitude || 0}m`, color: "#FF9800" },
                { label: "Distance", value: `${selectedDevice?.latestPosition?.attributes?.distance || 0} km`, color: "#9C27B0" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    minWidth: "78px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "8px 6px",
                    textAlign: "center",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
                    border: `2px solid ${stat.color}20`,
                    flexShrink: 0,
                    transition: "all 0.3s ease",
                  }}
                  className="stat-card-hover"
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: stat.color,
                      marginBottom: "2px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "9px", color: "#666", fontWeight: "500" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🎯 Action Buttons */}
          <div
            style={{
              padding: "10px 16px",
              display: "flex",
              gap: "8px",
              backgroundColor: "white",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <button
              style={{
                flex: 1,
                border: "2px solid #6dbfb8",
                outline: "none",
                backgroundColor: "white",
                fontWeight: "600",
                color: "#6dbfb8",
                textAlign: "center",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "11px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
              }}
              className="action-button-outline"
            >
              Events
            </button>
            <button
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "linear-gradient(135deg, #6dbfb8 0%, #5aa9a2 100%)",
                fontWeight: "600",
                color: "white",
                textAlign: "center",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "11px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 3px 8px rgba(109, 191, 184, 0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
              }}
              className="action-button-filled"
            >
              Trip
            </button>
          </div>
        </div>
      </InfoWindow>

      <div
        className="custom-zoom-control"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <div style={{ height: "5px" }}></div>
        <TooltipButton
          onClick={zoomIn}
          tooltip="Zoom In"
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MdAdd size={20} />
        </TooltipButton>

        <TooltipButton
          onClick={zoomOut}
          tooltip="Zoom Out"
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GrFormSubtract size={20} />
        </TooltipButton>

        <TooltipButton
          onClick={() => {}}
          tooltip="Alternate Maps"
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaRegMap size={20} />
        </TooltipButton>

        <TooltipButton
          onClick={() => {}}
          tooltip="Objects"
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaLocationArrow size={20} />
        </TooltipButton>

        <TooltipButton
          onClick={toggleGeofences}
          tooltip="Geofence"
          isActive={showGeofences}
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GrMapLocation size={20} />
        </TooltipButton>

        <TooltipButton
          onClick={() => {}}
          tooltip="Routes"
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaTrafficLight size={20} />
        </TooltipButton>

        <TooltipButton
          onClick={() => {}}
          tooltip="POI"
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MdLocationOn size={20} />
        </TooltipButton>

        <TooltipButton
          onClick={() => {}}
          tooltip="Tail"
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaArrowTrendDown size={20} />
        </TooltipButton>
      </div>
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
  libraries: ["drawing"],
})(GoogleMap);
