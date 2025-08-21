import { useEffect, useRef, useState } from "react";
import { Map, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { useDispatch, useSelector } from "react-redux";
import "./googleMap.css";
// import carIcon from "../../../monitoring-assets/carIcon.png";
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
    // dispatch(setSelectedSingleDevice(device));
    dispatch(setExpandedDevice(true));
    setInfoWindowVisible(!infoWindowVisible);
  };

  const closeInfoWindow = () => {
    setInfoWindowVisible(false);
    dispatch(setExpandedDevice(false));
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
      setZoom(14); // Optional: adjust zoom level
    }
  }, [selectedSingleDevice]);

  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

  // Tooltip component
  const TooltipButton = ({ onClick, children, tooltip, style }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          position: "relative",
          display: "inline-block",
          // margin: "5px 0", // Added margin between buttons
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={onClick}
          className="zoom-button tooltip-button"
          style={style}
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
          maxWidth: 400, // Set a maxWidth but not maxHeight
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
                // marginTop: "20px",
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
                // marginTop: "20px",
                marginBottom: "5px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Time:</strong>{" "}
              {selectedDevice?.latestPosition?.speed} 07-05-2025 11:53:56 AM
            </div>

            <div
              style={{
                // marginTop: "20px",
                marginBottom: "5px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Stop Duration:</strong>{" "}
              {selectedSingleDevice?.latestPosition?.speed} 1h 31min 6s
            </div>
            <div
              style={{
                // marginTop: "20px",
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
                // marginTop: "20px",
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
              overflowX: "auto", // Enable horizontal scrolling
              gap: "5px",
              borderBottom: "0.5px solid lightgray",
              scrollbarWidth: "none", // Hide scrollbar in Firefox
              msOverflowStyle: "none", // Hide scrollbar in IE
              "&::-webkit-scrollbar": {
                // Hide scrollbar in WebKit browsers
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

      <div
        className="custom-zoom-control"
        style={{ backgroundColor: "#21262C" }}
      >
        <div style={{ height: "5px" }}></div>
        <TooltipButton
          onClick={zoomIn}
          tooltip="Zoom In"
          style={{
            backgroundColor: "#6dbfb8",
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
            backgroundColor: "#6dbfb8",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GrFormSubtract size={20} />
        </TooltipButton>

        <TooltipButton
          onClick={zoomOut}
          tooltip="Alternate Maps"
          style={{
            backgroundColor: "#6dbfb8",
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
            backgroundColor: "#6dbfb8",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaLocationArrow size={20} />
        </TooltipButton>

        <TooltipButton
          onClick={() => {}}
          tooltip="Geofence"
          style={{
            backgroundColor: "#6dbfb8",
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
            backgroundColor: "#6dbfb8",
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
            backgroundColor: "#6dbfb8",
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
            backgroundColor: "#6dbfb8",
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
})(GoogleMap);
