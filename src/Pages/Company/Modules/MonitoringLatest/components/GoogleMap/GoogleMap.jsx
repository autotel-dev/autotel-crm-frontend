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
  const [address, setAddress] = useState("Loading address...");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const [deviceData, setDeviceData] = useState({ lat: 30.3753, lng: 69.3451 });

  const devicesArray = devicesDetailData || [];

  const zoomIn = () => setZoom((prevZoom) => prevZoom + 1);
  const zoomOut = () => setZoom((prevZoom) => prevZoom - 1);

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
        }
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

  const handleMarkerClick = (device) => {
    setSelectedDevice(device);
    setInfoWindowPosition({
      lat: device?.latestPosition?.latitude,
      lng: device?.latestPosition?.longitude,
    });
    dispatch(setExpandedDevice(true));
    setInfoWindowVisible(!infoWindowVisible);

    // Fetch address when marker is clicked
    if (device?.latestPosition?.latitude && device?.latestPosition?.longitude) {
      fetchAddress(
        device.latestPosition.latitude,
        device.latestPosition.longitude
      );
    }
  };

  const closeInfoWindow = () => {
    setInfoWindowVisible(false);
    dispatch(setExpandedDevice(false));
  };

  const toggleGeofences = () => {
    setShowGeofences(!showGeofences);
  };

  // Update selected device data in real-time without blinking
  useEffect(() => {
    if (selectedDevice && infoWindowVisible) {
      // Find the updated device from devices array
      const updatedDevice = devices?.find((d) => d._id === selectedDevice._id);

      if (updatedDevice && updatedDevice.checked) {
        // Check if position has changed
        const hasPositionChanged =
          updatedDevice.latestPosition?.latitude !==
            selectedDevice.latestPosition?.latitude ||
          updatedDevice.latestPosition?.longitude !==
            selectedDevice.latestPosition?.longitude;

        // Update selected device with new data
        setSelectedDevice(updatedDevice);

        // Only fetch new address if position has changed
        if (
          hasPositionChanged &&
          updatedDevice.latestPosition?.latitude &&
          updatedDevice.latestPosition?.longitude
        ) {
          setInfoWindowPosition({
            lat: updatedDevice.latestPosition.latitude,
            lng: updatedDevice.latestPosition.longitude,
          });
          fetchAddress(
            updatedDevice.latestPosition.latitude,
            updatedDevice.latestPosition.longitude
          );
        }
      }
    }
  }, [devices, devicesDetailData]);

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
          className="zoom-buttonn tooltip-button"
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

      {/* ✨ COMPACT INFOWINDOW WITH REAL-TIME UPDATES ✨ */}
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
          maxWidth: 300,
        }}
      >
        <div
          className="elegant-infowindow"
          style={{
            minWidth: "280px",
            maxWidth: "280px",
            overflow: "hidden",
            margin: "0px",
            padding: "0px",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(109, 191, 184, 0.2)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
                {selectedDevice?.vehicle?.registrationNo || "N/A"}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  padding: "2px 6px",
                  borderRadius: "8px",
                }}
              >
                {selectedDevice?.vehicle?.vehicleType || "Vehicle"}
              </span>
            </div>
            <span
              style={{
                fontWeight: "600",
                fontSize: "9px",
                backgroundColor:
                  selectedDevice?.latestPosition?.speed > 0
                    ? "rgba(76, 175, 80, 0.9)"
                    : "rgba(255, 87, 34, 0.9)",
                padding: "4px 8px",
                borderRadius: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
              }}
            >
              {selectedDevice?.latestPosition?.speed > 0 ? "Moving" : "Stopped"}
            </span>
          </div>

          {/* 📊 Compact Main Info Section */}
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "#f8fafa",
            }}
          >
            {/* Info Grid */}
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
                  value: selectedDevice?.vehicle?.imei || "N/A",
                  icon: "🔧",
                },
                {
                  label: "Location & Time",
                  value: address,
                  subValue: selectedDevice?.latestPosition?.deviceTime
                    ? new Date(
                        selectedDevice.latestPosition.deviceTime
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
                    selectedDevice?.latestPosition?.speed?.toFixed(2) || 0
                  } km/h`,
                  icon: "🚗",
                  highlight: true,
                },
                {
                  label: "Ignition",
                  value: selectedDevice?.latestPosition?.attributes?.ignition
                    ? "ON"
                    : "OFF",
                  icon: "🔑",
                  status: selectedDevice?.latestPosition?.attributes?.ignition,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
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
                    transition: "all 0.3s ease",
                    cursor: "default",
                  }}
                  className="info-row-hover"
                >
                  <span
                    style={{
                      fontSize: "14px",
                      filter: "grayscale(0.2)",
                      paddingTop: item.subValue ? "2px" : "0",
                    }}
                  >
                    {item.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "9px",
                        color: "#666",
                        marginBottom: "1px",
                        fontWeight: "500",
                      }}
                    >
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
                      {item.isLoading ? (
                        <span style={{ color: "#999", fontStyle: "italic" }}>
                          Loading...
                        </span>
                      ) : (
                        item.value
                      )}
                    </div>
                    {item.subValue && (
                      <div
                        style={{
                          fontSize: "9px",
                          color: "#888",
                          marginTop: "2px",
                          fontWeight: "500",
                        }}
                      >
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
                scrollbarWidth: "thin",
                scrollbarColor: "#6dbfb8 #f0f0f0",
              }}
            >
              {[
                {
                  label: "Direction",
                  value: `${selectedDevice?.latestPosition?.course || 0}°`,
                  color: "#4CAF50",
                },
                {
                  label: "Power",
                  value: `${
                    selectedDevice?.latestPosition?.attributes?.power?.toFixed(
                      2
                    ) || 0
                  }%`,
                  color: "#4CAF50",
                },
                {
                  label: "Satellites",
                  value: selectedDevice?.latestPosition?.attributes?.sat || "0",
                  color: "#2196F3",
                },
                {
                  label: "Altitude",
                  value: `${selectedDevice?.latestPosition?.altitude || 0}m`,
                  color: "#FF9800",
                },
                {
                  label: "Distance",
                  value: `${
                    selectedDevice?.latestPosition?.attributes?.distance?.toFixed(
                      2
                    ) || 0
                  } km`,
                  color: "#9C27B0",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    minWidth: "60px",
                    backgroundColor: "white",
                    borderRadius: "6px",
                    padding: "5px 4px",
                    textAlign: "center",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
                    border: `1.5px solid ${stat.color}20`,
                    flexShrink: 0,
                    transition: "all 0.3s ease",
                  }}
                  className="stat-card-hover"
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "bold",
                      color: stat.color,
                      marginBottom: "1px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🎯 Compact Action Buttons */}
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
          <MdAdd size={16} />
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
          <GrFormSubtract size={16} />
        </TooltipButton>

        {/* <TooltipButton
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
        </TooltipButton> */}

        {/* <TooltipButton
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
        </TooltipButton> */}

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
          <GrMapLocation size={16} />
        </TooltipButton>
        <div style={{ height: "5px" }}></div>

        {/* <TooltipButton
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
        </TooltipButton> */}

        {/* <TooltipButton
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
        </TooltipButton> */}

        {/* <TooltipButton
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
        </TooltipButton> */}
      </div>
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
  libraries: ["drawing"],
})(GoogleMap);
