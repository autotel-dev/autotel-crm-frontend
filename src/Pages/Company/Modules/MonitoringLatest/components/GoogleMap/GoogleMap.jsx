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
import carBlue from "../../../monitoring-assets/car_blue.png";
import carGreen from "../../../monitoring-assets/car_green.png";
import carRed from "../../../monitoring-assets/car_red.png";
import carYellow from "../../../monitoring-assets/car_yellow.png";
import carGray from "../../../monitoring-assets/car_gray.png";
import carPurple from "../../../monitoring-assets/car_purple.png";
import carBlack from "../../../monitoring-assets/car_black.png";

import { MdAdd } from "react-icons/md";
import { GrFormSubtract } from "react-icons/gr";
import { FaLocationArrow } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { FaTrafficLight } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaRegMap } from "react-icons/fa6";

import { setExpandedDevice } from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { IMAGE_BASE_URL } from "../../../../../../Utilities/api/apiEndpoints";
import CustomMarker from "./customMarker/CustomMarker";

// Build a usable src from an uploaded icon object ({ url: "vehicleIcons/..." }).
// Returns null when no icon is set so callers can fall back to a default asset.
const apiIconUrl = (iconObj) => {
  const url = iconObj?.url;
  if (!url) return null;
  return /^https?:\/\//i.test(url)
    ? url
    : `${IMAGE_BASE_URL}/${url}`.replace(/([^:]\/)\/+/g, "$1");
};

const GoogleMap = (props) => {
  const { devicesDetailData, devices, selectedSingleDevice } = useSelector(
    (state) => state.monitoring,
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
  const markerClickedRef = useRef(false);
  const [clusters, setClusters] = useState([]);
  const [map, setMap] = useState(null);

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

  const handleMarkerClick = (device) => {
    markerClickedRef.current = true; // Set flag to prevent map click from closing

    // Only allow opening info window for checked devices
    if (!device.checked) {
      markerClickedRef.current = false;
      return;
    }

    // Toggle info window if clicking the same marker
    if (selectedDevice?._id === device._id && infoWindowVisible) {
      setInfoWindowVisible(false);
      setSelectedDevice(null);
      markerClickedRef.current = false;
      return;
    }

    setSelectedDevice(device);
    setInfoWindowPosition({
      lat: device?.latestPosition?.latitude,
      lng: device?.latestPosition?.longitude,
    });
    // Don't automatically open the SingleVehicleDetail panel
    // dispatch(setExpandedDevice(true));
    setInfoWindowVisible(true); // Open info window on marker click

    // Fetch address when marker is clicked
    if (device?.latestPosition?.latitude && device?.latestPosition?.longitude) {
      fetchAddress(
        device.latestPosition.latitude,
        device.latestPosition.longitude,
      );
    }

    // Reset flag after a short delay
    setTimeout(() => {
      markerClickedRef.current = false;
    }, 100);
  };

  const closeInfoWindow = () => {
    setInfoWindowVisible(false);
    setSelectedDevice(null);
    dispatch(setExpandedDevice(false));
  };

  const toggleGeofences = () => {
    setShowGeofences(!showGeofences);
  };

  // Get status color based on device status
  const getStatusColor = (device) => {
    const now = new Date();
    const userData = { inactiveTimeLimit: 1440 }; // Default 24 hours

    // Check if expired
    const renewalDate = device?.vehicle?.serviceRenewalDate
      ? new Date(device.vehicle.serviceRenewalDate)
      : null;
    const isExpired = renewalDate && renewalDate < now;

    if (isExpired) return "gray";

    // Check if not connected
    const hasDeviceTime = device?.latestPosition?.deviceTime;
    if (!hasDeviceTime) return "blue";

    // Offline — backend flagged the device as inactive (checked before the
    // time-based inactive heuristic so these devices are shown as offline)
    const mainStatus = device.mainVehicleStatus?.toLowerCase();
    if (mainStatus === "inactive") return "black";

    // Check if inactive (time-based)
    const deviceTime = new Date(device.latestPosition.deviceTime);
    const diffMinutes = (now - deviceTime) / (1000 * 60);
    const isInactive = diffMinutes > userData.inactiveTimeLimit;

    if (isInactive) return "purple";

    // Check main vehicle status
    switch (mainStatus) {
      case "moving":
        return "green";
      case "stopped":
        return "red";
      case "stop":
        return "red";
      case "idle":
        return "orange";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (device) => {
    const statusColor = getStatusColor(device);
    const v = device?.vehicle || {};

    // Prefer the icon uploaded via the API (if its url is present) for the
    // relevant status, otherwise fall back to the default color image.
    switch (statusColor) {
      case "green": // moving
        return (
          apiIconUrl(v?.vehicleIconMoving) ||
          apiIconUrl(v?.vehicleIconOnline) || // legacy
          carGreen
        );

      case "red": // stopped
        return apiIconUrl(v?.vehicleIconStopped) || carRed;

      case "orange": // idle
        return apiIconUrl(v?.vehicleIconIdle) || carYellow;

      case "gray": // expired
        return apiIconUrl(v?.vehicleIconExpired) || carGray;

      case "purple": // inactive (time-based)
        return apiIconUrl(v?.vehicleIconInactive) || carPurple;

      case "blue": // not connected
        return apiIconUrl(v?.vehicleIconNotConnected) || carPurple;

      case "black": // offline (mainVehicleStatus === "inactive")
        return apiIconUrl(v?.vehicleIconOffline) || carBlack;

      default: // anything else
        return apiIconUrl(v?.vehicleIconOffline) || carBlue;
    }
  };

  // Update selected device data in real-time without blinking
  useEffect(() => {
    if (selectedDevice && infoWindowVisible) {
      // Find the updated device from devices array
      const updatedDevice = devices?.find((d) => d._id === selectedDevice._id);

      // If device is unchecked or not found, close the info window
      if (!updatedDevice || !updatedDevice.checked) {
        closeInfoWindow();
        return;
      }

      // If device is still checked, update it
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
            updatedDevice.latestPosition.longitude,
          );
        }
      }
    }
  }, [devices, devicesDetailData]);

  // Manual Grid-based clustering logic
  useEffect(() => {
    if (!devices || devices.length === 0) {
      setClusters([]);
      return;
    }

    const checkedDevices = devices.filter((d) => d.checked && d.latestPosition);

    // If zoomed in far enough, don't cluster at all
    if (zoom >= 16) {
      setClusters(checkedDevices.map(d => ({ isCluster: false, device: d, id: d._id })));
      return;
    }

    // Grid size depends on zoom - larger grid when zoomed out for better "chunking"
    const gridSize = zoom < 5 ? 120 : zoom < 10 ? 90 : 70;
    const worldSize = 256 * Math.pow(2, zoom);

    const latRad = (lat) => {
      const sin = Math.sin((lat * Math.PI) / 180);
      const rad = Math.log((1 + sin) / (1 - sin)) / 2;
      return Math.max(Math.min(rad, Math.PI), -Math.PI) / 2;
    };

    const latToY = (lat) => 0.5 - latRad(lat) / Math.PI;
    const lngToX = (lng) => lng / 360 + 0.5;

    const grid = {};

    checkedDevices.forEach((device) => {
      const lat = device.latestPosition.latitude;
      const lng = device.latestPosition.longitude;

      const px = lngToX(lng) * worldSize;
      const py = latToY(lat) * worldSize;

      const gx = Math.floor(px / gridSize);
      const gy = Math.floor(py / gridSize);
      const key = `${gx}-${gy}`;

      if (!grid[key]) {
        grid[key] = [];
      }
      grid[key].push(device);
    });

    const newClusters = [];
    Object.values(grid).forEach((group) => {
      if (group.length === 1) {
        newClusters.push({
          isCluster: false,
          device: group[0],
          id: group[0]._id,
        });
      } else {
        // Calculate average position for the cluster
        const avgLat = group.reduce((sum, d) => sum + d.latestPosition.latitude, 0) / group.length;
        const avgLng = group.reduce((sum, d) => sum + d.latestPosition.longitude, 0) / group.length;

        newClusters.push({
          isCluster: true,
          count: group.length,
          position: { lat: avgLat, lng: avgLng },
          id: `cluster-${group[0]._id}-${group.length}`,
          devices: group,
        });
      }
    });

    setClusters(newClusters);
  }, [devices, zoom]);

  // Handle zooming to selected device
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
      setZoom(16); // Zoom in closer when selecting a specific device to break clusters

      if (selectedSingleDevice.checked) {
        setSelectedDevice(selectedSingleDevice);
        setInfoWindowPosition(latLng);
        setInfoWindowVisible(true);
        fetchAddress(latLng.lat, latLng.lng);
      }
    }
  }, [selectedSingleDevice]);

  // Add map click listener to close info window
  useEffect(() => {
    if (!mapRef.current?.map || !props.google) return;

    const mapClickListener = mapRef.current.map.addListener("click", (e) => {
      // Only close if clicking on the map itself, not on markers
      // Check the flag to see if a marker was just clicked
      if (infoWindowVisible && !markerClickedRef.current) {
        closeInfoWindow();
      }
    });

    return () => {
      if (mapClickListener) {
        props.google.maps.event.removeListener(mapClickListener);
      }
    };
  }, [mapRef.current?.map, props.google, infoWindowVisible]);

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
          device.vehicle.geofences.length > 0,
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
      }),
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
      onReady={(mapProps, mapInstance) => {
        setMap(mapInstance);
      }}
      onZoomChanged={(mapProps, mapInstance) => {
        setZoom(mapInstance.getZoom());
      }}
    >
      {map && clusters.map((item) =>
        item.isCluster ? (
          <CustomMarker
            key={item.id}
            map={map}
            google={props.google}
            position={item.position}
            isCluster={true}
            count={item.count}
            onClick={() => {
              setZoom(zoom + 2);
              map.panTo(item.position);
            }}
          />
        ) : (
          <CustomMarker
            key={item.id}
            map={map}
            google={props.google}
            position={{
              lat: item.device?.latestPosition?.latitude,
              lng: item.device?.latestPosition?.longitude,
            }}
            icon={getStatusIcon(item.device)}
            rotation={item.device?.latestPosition?.course}
            onClick={() => handleMarkerClick(item.device)}
            label={item.device?.vehicle?.registrationNo || "N/A"}
            showLabel={
              !(infoWindowVisible && selectedDevice?._id === item.device?._id)
            }
            statusColor={getStatusColor(item.device)}
          />
        ),
      )}

      {/* Render geofences */}
      {renderGeofences()}

      {/* ✨ COMPACT INFOWINDOW WITH REAL-TIME UPDATES ✨ */}
      <InfoWindow
        position={infoWindowPosition}
        visible={infoWindowVisible}
        onClose={closeInfoWindow}
        options={{
          disableAutoPan: false,
          pixelOffset: new props.google.maps.Size(0, -30),
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
                      selectedDevice.latestPosition.deviceTime,
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
                  value: `${selectedDevice?.latestPosition?.speed?.toFixed(2) || 0
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
                  value: `${selectedDevice?.latestPosition?.attributes?.power?.toFixed(
                    2,
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
                  value: `${selectedDevice?.latestPosition?.attributes?.distance?.toFixed(
                    2,
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
        className="custom-zoom-controll"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
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
