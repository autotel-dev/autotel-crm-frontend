import { useEffect, useRef, useState } from "react";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { useDispatch, useSelector } from "react-redux";
import "./googleMap.css";
import carIcon from "../../../monitoring-assets/carIcon.png";

import { IMAGE_BASE_URL_RENTAL } from "../../../../../../Utilities/api/apiEndpoints";
import { setExpandedDevice } from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import CustomMarker from "./customMarker/CustomMarker";

const GoogleMap = (props) => {
  const { devicesDetailData, devices, singleSelectedDevice } = useSelector(
    (state) => state.monitoring
  );
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState(8);
  // const [singleSelectedDevice, setSelectedDevice] = useState(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const [infoWindowVisible, setInfoWindowVisible] = useState(false);
  const mapRef = useRef(null);

  const [deviceData, setDeviceData] = useState({ lat: 30.3753, lng: 69.3451 });

  const devicesArray = devicesDetailData || [];

  const zoomIn = () => setZoom((prevZoom) => prevZoom + 1);
  const zoomOut = () => setZoom((prevZoom) => prevZoom - 1);

  const handleMarkerClick = (device) => {
    setInfoWindowVisible(!infoWindowVisible);
    // setSelectedDevice(device);
    // if(infoWindowVisible == true){

    // }
    // setInfoWindowPosition({ lat: device?.latitude, lng: device?.longitude });
    dispatch(setExpandedDevice(true));
  };

  const closeInfoWindow = () => {
    setInfoWindowVisible(false);
    dispatch(setExpandedDevice(false));
  };

  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

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
                lat: device?.latitude,
                lng: device?.longitude,
              }}
              icon={carIcon}
              rotation={
                // device?.direction == 0 ? 0 + 45 : device?.direction + 45
                // device?.direction - 15
                device?.direction
              }
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
              {singleSelectedDevice?.deviceId} 20
            </div>
            <div
              style={{
                // marginTop: "20px",
                marginBottom: "5px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Address:</strong>{" "}
              {singleSelectedDevice?.speed} Makran Coastal Highway, Lota Bazaar,
              Kund Malir, Liari Tehsil.
            </div>
            <div
              style={{
                // marginTop: "20px",
                marginBottom: "5px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Time:</strong>{" "}
              {singleSelectedDevice?.speed} 07-05-2025 11:53:56 AM
            </div>
            {/* <div
                style={{
                  // marginTop: "20px",
                  marginBottom: "5px",
                  fontSize: "15px",
                }}
              >
                <strong>Speed:</strong> {singleSelectedDevice?.speed} 35 km/h
              </div>
              <div
                style={{
                  // marginTop: "20px",
                  marginBottom: "5px",
                  fontSize: "15px",
                }}
              >
                <strong>Speed:</strong> {singleSelectedDevice?.speed} 35 km/h
              </div> */}
            <div
              style={{
                // marginTop: "20px",
                marginBottom: "5px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Stop Duration:</strong>{" "}
              {singleSelectedDevice?.speed} 1h 31min 6s
            </div>
            <div
              style={{
                // marginTop: "20px",
                marginBottom: "5px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Speed:</strong>{" "}
              {singleSelectedDevice?.speed} 35 km/h
            </div>
            <div
              style={{
                // marginTop: "20px",
                marginBottom: "15px",
                fontSize: "15px",
              }}
            >
              <strong style={{ width: "110px" }}>Ignition:</strong>{" "}
              {singleSelectedDevice?.basicInfo?.ignition === false
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
                flexShrink: 0, // Prevent boxes from shrinking
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

          {/* <div
              style={{
                padding: "0px 25px",
                paddingBottom: "10px",
                paddingTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                gap: "5px",
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
                }}
                className="info-box"
              >
                <div style={{ color: "gray" }}>Number of Errors</div>
                <div style={{ color: "red" }}>1</div>
              </div>
            </div>
            <div
              style={{
                padding: "0px 25px",
                paddingBottom: "15px",
                display: "flex",
                justifyContent: "space-between",
                gap: "5px",
                borderBottom: "0.5px solid lightgray",
              }}
            >
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
                }}
                className="info-box"
              >
                <div style={{ color: "gray" }}>Fuel Consumption</div>
                <div style={{ color: "black", fontSize: "13px" }}>5.99 MPG</div>
              </div>
            </div> */}

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

      <div className="custom-zoom-control">
        <button onClick={zoomIn} className="zoom-button">
          +
        </button>
        <button onClick={zoomOut} className="zoom-button">
          -
        </button>
      </div>
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(GoogleMap);

// -------------------------------------

// import { useEffect, useRef, useState } from "react";
// import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
// import { useDispatch, useSelector } from "react-redux";
// import "./googleMap.css";
// import carIcon from "../../../monitoring-assets/car-icon.png";

// import { IMAGE_BASE_URL_RENTAL } from "../../../../../../Utilities/api/apiEndpoints";
// import { setExpandedDevice } from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";

// const GoogleMap = (props) => {
//   const { devicesDetailData, devices } = useSelector(
//     (state) => state.monitoring
//   );
//   const dispatch = useDispatch();
//   const [zoom, setZoom] = useState(8);
//   const [singleSelectedDevice, setSelectedDevice] = useState(null);
//   const [infoWindowPosition, setInfoWindowPosition] = useState(null);
//   const [infoWindowVisible, setInfoWindowVisible] = useState(false);
//   const mapRef = useRef(null);

//   const [deviceData, setDeviceData] = useState({ lat: 30.3753, lng: 69.3451 });

//   const devicesArray = devicesDetailData || [];

//   const zoomIn = () => setZoom((prevZoom) => prevZoom + 1);
//   const zoomOut = () => setZoom((prevZoom) => prevZoom - 1);

//   const lahoreCoords = { lat: 31.5204, lng: 74.3587 };

//   const handleMarkerClick = () => {
//     if (
//       infoWindowVisible &&
//       infoWindowPosition?.lat === lahoreCoords.lat &&
//       infoWindowPosition?.lng === lahoreCoords.lng
//     ) {
//       setInfoWindowVisible(false);
//     } else {
//       setInfoWindowPosition(lahoreCoords);
//       setInfoWindowVisible(true);
//     }
//   };

//   const closeInfoWindow = () => {
//     setInfoWindowVisible(false);
//   };

//   const handleMapClick = () => {
//     setInfoWindowVisible(false);
//   };

//   if (!props.google) {
//     return <div>Error: Google Maps API failed to load.</div>;
//   }

//   return (
//     <div style={{ width: "300px", height: "300px", overflow: "hidden" }}>
//       <Map
//         google={props.google}
//         zoom={zoom}
//         initialCenter={deviceData}
//         ref={mapRef}
//         gestureHandling="greedy"
//         disableDefaultUI={true}
//         onClick={handleMapClick}
//       >
//         <Marker
//           position={lahoreCoords}
//           onClick={handleMarkerClick}
//           icon={{
//             url: carIcon,
//             scaledSize: new props.google.maps.Size(40, 40),
//           }}
//         />

// <InfoWindow
//   position={infoWindowPosition}
//   visible={infoWindowVisible}
//   onClose={closeInfoWindow}
//   options={{
//     disableAutoPan: false,
//     pixelOffset: new props.google.maps.Size(0, -40),
//     disableClose: true,
//     closeBoxMargin: "0",
//     closeBoxURL: "",
//     maxWidth: 400, // Set a maxWidth but not maxHeight
//   }}
// >
//   <div
//     style={{
//       minWidth: "400px",
//       overflow: "hidden !important",
//       margin: "0px !important",
//       padding: "0px !important",
//     }}
//   >
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "10px 25px",
//         borderBottom: "1px solid lightgray",
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <h2>VB 4285 </h2>
//         <span
//           style={{
//             marginLeft: "16px",
//             color: "gray",
//             fontWeight: "bold",
//           }}
//         >
//           Van
//         </span>
//       </div>
//       <span style={{ fontWeight: "bold", color: "red" }}>on route</span>
//     </div>

//     <div
//       style={{
//         padding: "10px 25px",
//         borderBottom: "0.5px solid lightgray",
//       }}
//     >
//       <div
//         style={{
//           marginTop: "10px",
//           marginBottom: "5px",
//           fontSize: "15px",
//         }}
//       >
//         <strong style={{ width: "110px" }}>Device ID:</strong>{" "}
//         {singleSelectedDevice?.deviceId} 20
//       </div>
//       <div
//         style={{
//           // marginTop: "20px",
//           marginBottom: "5px",
//           fontSize: "15px",
//         }}
//       >
//         <strong style={{ width: "110px" }}>Address:</strong>{" "}
//         {singleSelectedDevice?.speed} Makran Coastal Highway, Lota Bazaar,
//         Kund Malir, Liari Tehsil.
//       </div>
//       <div
//         style={{
//           // marginTop: "20px",
//           marginBottom: "5px",
//           fontSize: "15px",
//         }}
//       >
//         <strong style={{ width: "110px" }}>Time:</strong>{" "}
//         {singleSelectedDevice?.speed} 07-05-2025 11:53:56 AM
//       </div>
//       {/* <div
//         style={{
//           // marginTop: "20px",
//           marginBottom: "5px",
//           fontSize: "15px",
//         }}
//       >
//         <strong>Speed:</strong> {singleSelectedDevice?.speed} 35 km/h
//       </div>
//       <div
//         style={{
//           // marginTop: "20px",
//           marginBottom: "5px",
//           fontSize: "15px",
//         }}
//       >
//         <strong>Speed:</strong> {singleSelectedDevice?.speed} 35 km/h
//       </div> */}
//       <div
//         style={{
//           // marginTop: "20px",
//           marginBottom: "5px",
//           fontSize: "15px",
//         }}
//       >
//         <strong style={{ width: "110px" }}>Stop Duration:</strong>{" "}
//         {singleSelectedDevice?.speed} 1h 31min 6s
//       </div>
//       <div
//         style={{
//           // marginTop: "20px",
//           marginBottom: "5px",
//           fontSize: "15px",
//         }}
//       >
//         <strong style={{ width: "110px" }}>Speed:</strong>{" "}
//         {singleSelectedDevice?.speed} 35 km/h
//       </div>
//       <div
//         style={{
//           // marginTop: "20px",
//           marginBottom: "15px",
//           fontSize: "15px",
//         }}
//       >
//         <strong style={{ width: "110px" }}>Ignition:</strong>{" "}
//         {singleSelectedDevice?.basicInfo?.ignition === false ? "OFF" : "ON"}
//       </div>
//     </div>

//     <div
//       style={{
//         padding: "0px 25px",
//         paddingBottom: "15px",
//         paddingTop: "20px",
//         display: "flex",
//         overflowX: "auto", // Enable horizontal scrolling
//         gap: "5px",
//         borderBottom: "0.5px solid lightgray",
//         scrollbarWidth: "none", // Hide scrollbar in Firefox
//         msOverflowStyle: "none", // Hide scrollbar in IE
//         "&::-webkit-scrollbar": {
//           // Hide scrollbar in WebKit browsers
//           display: "none",
//         },
//       }}
//     >
//       <div
//         style={{
//           border: "0.5px solid lightgray",
//           borderRadius: "5px",
//           padding: "12px 0px",
//           fontWeight: "400",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: "2px",
//           minWidth: "170px",
//           maxWidth: "170px",
//           flexShrink: 0, // Prevent boxes from shrinking
//         }}
//         className="info-box"
//       >
//         <div style={{ color: "gray" }}>Vehicle Condition</div>
//         <div style={{ color: "red" }}>Critical</div>
//       </div>
//       <div
//         style={{
//           border: "0.5px solid lightgray",
//           borderRadius: "5px",
//           padding: "12px 0",
//           fontWeight: "400",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: "2px",
//           minWidth: "170px",
//           maxWidth: "170px",
//           flexShrink: 0,
//         }}
//         className="info-box"
//       >
//         <div style={{ color: "gray" }}>Number of Errors</div>
//         <div style={{ color: "red" }}>1</div>
//       </div>
//       <div
//         style={{
//           border: "0.5px solid lightgray",
//           borderRadius: "5px",
//           padding: "12px 0",
//           fontWeight: "400",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: "2px",
//           minWidth: "170px",
//           maxWidth: "170px",
//           flexShrink: 0,
//         }}
//         className="info-box"
//       >
//         <div style={{ color: "gray" }}>Average Speed</div>
//         <div style={{ color: "black", fontSize: "13px" }}>62.5 MPH</div>
//       </div>
//       <div
//         style={{
//           border: "0.5px solid lightgray",
//           borderRadius: "5px",
//           padding: "12px 0px",
//           fontWeight: "400",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: "2px",
//           minWidth: "170px",
//           maxWidth: "170px",
//           flexShrink: 0,
//         }}
//         className="info-box"
//       >
//         <div style={{ color: "gray" }}>Fuel Consumption</div>
//         <div style={{ color: "black", fontSize: "13px" }}>5.99 MPG</div>
//       </div>
//     </div>

//     {/* <div
//       style={{
//         padding: "0px 25px",
//         paddingBottom: "10px",
//         paddingTop: "20px",
//         display: "flex",
//         justifyContent: "space-between",
//         gap: "5px",
//       }}
//     >
//       <div
//         style={{
//           border: "0.5px solid lightgray",
//           borderRadius: "5px",
//           padding: "12px 0px",
//           fontWeight: "400",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: "2px",
//           minWidth: "170px",
//           maxWidth: "170px",
//         }}
//         className="info-box"
//       >
//         <div style={{ color: "gray" }}>Vehicle Condition</div>
//         <div style={{ color: "red" }}>Critical</div>
//       </div>
//       <div
//         style={{
//           border: "0.5px solid lightgray",
//           borderRadius: "5px",
//           padding: "12px 0",
//           fontWeight: "400",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: "2px",
//           minWidth: "170px",
//           maxWidth: "170px",
//         }}
//         className="info-box"
//       >
//         <div style={{ color: "gray" }}>Number of Errors</div>
//         <div style={{ color: "red" }}>1</div>
//       </div>
//     </div>
//     <div
//       style={{
//         padding: "0px 25px",
//         paddingBottom: "15px",
//         display: "flex",
//         justifyContent: "space-between",
//         gap: "5px",
//         borderBottom: "0.5px solid lightgray",
//       }}
//     >
//       <div
//         style={{
//           border: "0.5px solid lightgray",
//           borderRadius: "5px",
//           padding: "12px 0",
//           fontWeight: "400",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: "2px",
//           minWidth: "170px",
//           maxWidth: "170px",
//         }}
//         className="info-box"
//       >
//         <div style={{ color: "gray" }}>Average Speed</div>
//         <div style={{ color: "black", fontSize: "13px" }}>62.5 MPH</div>
//       </div>
//       <div
//         style={{
//           border: "0.5px solid lightgray",
//           borderRadius: "5px",
//           padding: "12px 0px",
//           fontWeight: "400",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: "2px",
//           minWidth: "170px",
//           maxWidth: "170px",
//         }}
//         className="info-box"
//       >
//         <div style={{ color: "gray" }}>Fuel Consumption</div>
//         <div style={{ color: "black", fontSize: "13px" }}>5.99 MPG</div>
//       </div>
//     </div> */}

//     <div
//       style={{
//         padding: "15px 25px",
//         paddingBottom: "15px",
//         display: "flex",
//         justifyContent: "space-between",
//         gap: "5px",
//       }}
//     >
//       <button
//         style={{
//           minWidth: "170px",
//           maxWidth: "170px",
//           border: "none",
//           outline: "none",
//           backgroundColor: "lightgray",
//           fontWeight: "600",
//           color: "black",
//           textAlign: "center",
//           padding: "15px",
//           borderRadius: "5px",
//         }}
//       >
//         ALL EVENTS
//       </button>
//       <button
//         style={{
//           minWidth: "170px",
//           maxWidth: "170px",
//           border: "none",
//           outline: "none",
//           backgroundColor: "lightgray",
//           fontWeight: "600",
//           color: "black",
//           textAlign: "center",
//           padding: "15px",
//           borderRadius: "5px",
//         }}
//       >
//         TRIP
//       </button>
//     </div>
//   </div>
// </InfoWindow>

//         <div className="custom-zoom-control">
//           <button onClick={zoomIn} className="zoom-button">
//             +
//           </button>
//           <button onClick={zoomOut} className="zoom-button">
//             -
//           </button>
//         </div>
//       </Map>
//     </div>
//   );
// };

// export default GoogleApiWrapper({
//   apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
// })(GoogleMap);
