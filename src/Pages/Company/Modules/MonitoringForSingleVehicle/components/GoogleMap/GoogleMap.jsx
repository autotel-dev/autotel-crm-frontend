// import { useEffect, useRef, useState } from "react";
// import {
//   Map,
//   Marker,
//   GoogleApiWrapper,
//   InfoWindow,
//   Polyline,
// } from "google-maps-react";
// import { useDispatch, useSelector } from "react-redux";
// import "./googleMap.css";
// import { setExpandedDevice } from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";

// const GoogleMap = (props) => {
//   const dispatch = useDispatch();
//   const { devicesDetailData, devices } = useSelector(
//     (state) => state.monitoring
//   );

//   const [zoom, setZoom] = useState(8);
//   const [selectedDevice, setSelectedDevice] = useState(null);
//   const [infoWindowPosition, setInfoWindowPosition] = useState(null);
//   const [infoWindowVisible, setInfoWindowVisible] = useState(false);
//   const [carPosition, setCarPosition] = useState({
//     lat: 24.9461,
//     lng: 67.1301,
//   });

//   const mapRef = useRef(null);
//   const requestRef = useRef();
//   const progressRef = useRef(0);
//   const lastTimeRef = useRef(null);

//   const dummyCarIcon = "https://cdn-icons-png.flaticon.com/512/744/744465.png";

//   const superHighwayPath = [
//     { lat: 24.9461, lng: 67.1301 },
//     { lat: 24.95, lng: 67.135 },
//     { lat: 24.96, lng: 67.145 },
//     { lat: 24.98, lng: 67.16 },
//     { lat: 25.0, lng: 67.18 },
//     { lat: 25.05, lng: 67.2 },
//     { lat: 25.1, lng: 67.22 },
//     { lat: 25.15, lng: 67.25 },
//     { lat: 25.2, lng: 67.28 },
//     { lat: 25.25, lng: 67.3 },
//     { lat: 25.3, lng: 67.32 },
//     { lat: 25.35, lng: 67.35 },
//     { lat: 25.4, lng: 67.38 },
//     { lat: 25.45, lng: 67.4 },
//     { lat: 25.5, lng: 67.42 },
//     { lat: 25.55, lng: 67.45 },
//     { lat: 25.6, lng: 67.48 },
//     { lat: 25.65, lng: 67.5 },
//     { lat: 25.7, lng: 67.52 },
//     { lat: 25.75, lng: 67.55 },
//     { lat: 25.8, lng: 67.58 },
//     { lat: 25.85, lng: 67.6 },
//     { lat: 25.9, lng: 67.62 },
//     { lat: 25.95, lng: 67.65 },
//     { lat: 25.9876, lng: 68.0 },
//     { lat: 25.99, lng: 68.02 },
//   ];

//   const zoomIn = () => setZoom((prevZoom) => prevZoom + 1);
//   const zoomOut = () => setZoom((prevZoom) => prevZoom - 1);

//   const handleMarkerClick = (device) => {
//     setInfoWindowVisible(true);
//     setSelectedDevice(device);
//     setInfoWindowPosition({ lat: device?.latitude, lng: device?.longitude });
//     dispatch(setExpandedDevice(true));
//   };

//   const closeInfoWindow = () => {
//     setInfoWindowVisible(false);
//     dispatch(setExpandedDevice(false));
//   };

//   // Linear interpolation between two points
//   const lerp = (start, end, t) => start + (end - start) * t;

//   const animateCar = (time) => {
//     if (!lastTimeRef.current) lastTimeRef.current = time;
//     const delta = time - lastTimeRef.current;
//     lastTimeRef.current = time;

//     const speed = 0.0005; // Smaller = slower
//     progressRef.current += speed * delta;

//     if (progressRef.current >= superHighwayPath.length - 1) {
//       progressRef.current = 0; // Loop
//     }

//     const index = Math.floor(progressRef.current);
//     const t = progressRef.current - index;

//     const currentPoint = superHighwayPath[index];
//     const nextPoint = superHighwayPath[index + 1] || currentPoint;

//     const lat = lerp(currentPoint.lat, nextPoint.lat, t);
//     const lng = lerp(currentPoint.lng, nextPoint.lng, t);

//     setCarPosition({ lat, lng });

//     requestRef.current = requestAnimationFrame(animateCar);
//   };

//   useEffect(() => {
//     requestRef.current = requestAnimationFrame(animateCar);
//     return () => cancelAnimationFrame(requestRef.current);
//   }, []);

//   if (!props.google) {
//     return <div>Error: Google Maps API failed to load.</div>;
//   }

//   return (
//     <Map
//       google={props.google}
//       zoom={zoom}
//       initialCenter={superHighwayPath[0]}
//       ref={mapRef}
//       gestureHandling="greedy"
//       disableDefaultUI={true}
//     >
//       <Polyline
//         path={superHighwayPath}
//         strokeColor="#FF0000"
//         strokeOpacity={0.8}
//         strokeWeight={4}
//       />

//       <Marker
//         position={carPosition}
//         icon={{
//           url: dummyCarIcon,
//           scaledSize: new props.google.maps.Size(40, 40),
//         }}
//       />

//       <InfoWindow
//         position={infoWindowPosition}
//         visible={infoWindowVisible}
//         onClose={closeInfoWindow}
//       >
//         <div>
//           <h4>Device Details</h4>
//           <p>
//             <strong>Device ID:</strong> {selectedDevice?.deviceId}
//           </p>
//           <p>
//             <strong>Speed:</strong> {selectedDevice?.speed} km/h
//           </p>
//           <p>
//             <strong>Ignition:</strong>{" "}
//             {selectedDevice?.basicInfo?.ignition === false ? "OFF" : "ON"}
//           </p>
//           <p>
//             <strong>Direction:</strong> {selectedDevice?.direction}
//           </p>
//           <p>
//             <strong>Sleep Mode:</strong>{" "}
//             {selectedDevice?.sensor?.sleepMode === false ? "OFF" : "ON"}
//           </p>
//           <p>
//             <strong>Odometer:</strong>{" "}
//             {(selectedDevice?.basicInfo?.odometer || 0).toFixed(2)}
//           </p>
//           <h4>Vehicle Details</h4>
//           <p>
//             <strong>Vehicle Name:</strong> {selectedDevice?.vehicle?.title}
//           </p>
//           <p>
//             <strong>Color:</strong> {selectedDevice?.vehicle?.color}
//           </p>
//           <p>
//             <strong>Engine Number:</strong>{" "}
//             {selectedDevice?.vehicle?.engineNumber}
//           </p>
//           <p>
//             <strong>Registration Number:</strong>{" "}
//             {selectedDevice?.vehicle?.registrationNumber}
//           </p>
//         </div>
//       </InfoWindow>

//       <div className="custom-zoom-control">
//         <button onClick={zoomIn} className="zoom-button">
//           +
//         </button>
//         <button onClick={zoomOut} className="zoom-button">
//           -
//         </button>
//       </div>
//     </Map>
//   );
// };

// export default GoogleApiWrapper({
//   apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
// })(GoogleMap);

import { useEffect, useRef, useState } from "react";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { useDispatch, useSelector } from "react-redux";
import "./googleMap.css";
import carIcon from "../../../monitoring-assets/car-icon.png";

import { IMAGE_BASE_URL_RENTAL } from "../../../../../../Utilities/api/apiEndpoints";
import { setExpandedDevice } from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";

const GoogleMap = (props) => {
  const { devicesDetailData, devices } = useSelector(
    (state) => state.monitoring
  );
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState(8);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const [infoWindowVisible, setInfoWindowVisible] = useState(false);
  const mapRef = useRef(null);

  const [deviceData, setDeviceData] = useState({ lat: 30.3753, lng: 69.3451 });

  // useEffect(() => {
  //   if (devices?.length > 0) {
  //     setDeviceData({
  //       lat: devicesDetailData[0]?.latitude,
  //       lng: devicesDetailData[0]?.longitude,
  //     });
  //   }
  // }, [devicesDetailData]);

  const devicesArray = devicesDetailData || [];

  const zoomIn = () => setZoom((prevZoom) => prevZoom + 1);
  const zoomOut = () => setZoom((prevZoom) => prevZoom - 1);

  const handleMarkerClick = (device) => {
    setInfoWindowVisible(true);
    setSelectedDevice(device);
    setInfoWindowPosition({ lat: device?.latitude, lng: device?.longitude });
    dispatch(setExpandedDevice(true));
  };

  const closeInfoWindow = () => {
    setInfoWindowVisible(false);
    dispatch(setExpandedDevice(false));
  };

  const getMarkerIcon = (dev) => {
    const { device, vehicle } = dev;
    const { vehicleIcon } = vehicle;

    if (vehicleIcon?.type === "STATIC") {
      return vehicleIcon?.vehicleImage?.staticImage || carIcon;
    } else if (vehicleIcon?.type === "DYNAMIC") {
      switch (device?.currentStatus) {
        case "STOP":
          return (
            vehicleIcon.vehicleImage?.dynamicImages?.stop ||
            "/vehicleIcon/stop.png"
          );
        case "MOVING":
          return (
            vehicleIcon.vehicleImage?.dynamicImages?.moving ||
            "/vehicleIcon/moving.png"
          );
        case "OFFLINE":
          return (
            vehicleIcon.vehicleImage?.dynamicImages?.offline ||
            "/vehicleIcon/offline.png"
          );
        case "IDLE":
          return (
            vehicleIcon.vehicleImage?.dynamicImages?.idle ||
            "/vehicleIcon/idle.png"
          );
        default:
          return carIcon;
      }
    } else {
      return carIcon;
    }
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
      {/* {devices?.map(
        (device) =>
          device.checked && (
            <Marker
              key={device._id}
              position={{
                lat: device.device.latitude,
                lng: device.device.longitude,
              }}
              icon={{
                url: `${IMAGE_BASE_URL_RENTAL}${getMarkerIcon(device)}`,
                scaledSize: new props.google.maps.Size(40, 40),
              }}
              onClick={() => handleMarkerClick(device)}
            />
          )
      )} */}

      <InfoWindow
        position={infoWindowPosition}
        visible={infoWindowVisible}
        onClose={closeInfoWindow}
      >
        <div>
          <h4>Device Details</h4>
          <p>
            <strong>Device ID:</strong> {selectedDevice?.deviceId}
          </p>
          <p>
            <strong>Speed:</strong> {selectedDevice?.speed} km/h
          </p>
          <p>
            <strong>Ignition:</strong>{" "}
            {selectedDevice?.basicInfo?.ignition === false ? "OFF" : "ON"}
          </p>
          <p>
            <strong>Direction:</strong> {selectedDevice?.direction}
          </p>
          <p>
            <strong>Sleep Mode:</strong>{" "}
            {selectedDevice?.sensor?.sleepMode === false ? "OFF" : "ON"}
          </p>
          <p>
            <strong>Odometer:</strong>{" "}
            {(selectedDevice?.basicInfo?.odometer || 0).toFixed(2)}
          </p>
          <h4>Vehicle Details</h4>
          <p>
            <strong>Vehicle Name:</strong> {selectedDevice?.vehicle?.title}
          </p>
          <p>
            <strong>Color:</strong> {selectedDevice?.vehicle?.color}
          </p>
          <p>
            <strong>Engine Number:</strong>{" "}
            {selectedDevice?.vehicle?.engineNumber}
          </p>
          <p>
            <strong>Registration Number:</strong>{" "}
            {selectedDevice?.vehicle?.registrationNumber}
          </p>
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

// const superHighwayPath = [
//   // Karachi Start Point (Near Sohrab Goth)
//   { lat: 24.9575, lng: 67.0986 },
//   { lat: 24.9589, lng: 67.1034 },
//   { lat: 24.9602, lng: 67.1082 },
//   { lat: 24.9615, lng: 67.113 },
//   { lat: 24.9628, lng: 67.1178 },
//   { lat: 24.9641, lng: 67.1226 },
//   { lat: 24.9654, lng: 67.1274 },
//   { lat: 24.9667, lng: 67.1322 },
//   { lat: 24.968, lng: 67.137 },
//   { lat: 24.9693, lng: 67.1418 },
//   { lat: 24.9706, lng: 67.1466 },
//   { lat: 24.9719, lng: 67.1514 },
//   { lat: 24.9732, lng: 67.1562 },
//   { lat: 24.9745, lng: 67.161 },
//   { lat: 24.9758, lng: 67.1658 },
//   { lat: 24.9771, lng: 67.1706 },
//   { lat: 24.9784, lng: 67.1754 },
//   { lat: 24.9797, lng: 67.1802 },
//   { lat: 24.981, lng: 67.185 },
//   { lat: 24.9823, lng: 67.1898 },
//   { lat: 24.9836, lng: 67.1946 },
//   { lat: 24.9849, lng: 67.1994 },
//   { lat: 24.9862, lng: 67.2042 },
//   { lat: 24.9875, lng: 67.209 },
//   { lat: 24.9888, lng: 67.2138 },
//   { lat: 24.9901, lng: 67.2186 },
//   { lat: 24.9914, lng: 67.2234 },
//   { lat: 24.9927, lng: 67.2282 },
//   { lat: 24.994, lng: 67.233 },
//   { lat: 24.9953, lng: 67.2378 },
//   { lat: 24.9966, lng: 67.2426 },
//   { lat: 24.9979, lng: 67.2474 },
//   { lat: 24.9992, lng: 67.2522 },
//   { lat: 25.0005, lng: 67.257 },
//   { lat: 25.0018, lng: 67.2618 },
//   { lat: 25.0031, lng: 67.2666 },
//   { lat: 25.0044, lng: 67.2714 },
//   { lat: 25.0057, lng: 67.2762 },
//   { lat: 25.007, lng: 67.281 },
//   { lat: 25.0083, lng: 67.2858 },
//   { lat: 25.0096, lng: 67.2906 },
//   { lat: 25.0109, lng: 67.2954 },
//   { lat: 25.0122, lng: 67.3002 },
//   { lat: 25.0135, lng: 67.305 },
//   { lat: 25.0148, lng: 67.3098 },
//   { lat: 25.0161, lng: 67.3146 },
//   { lat: 25.0174, lng: 67.3194 },
//   { lat: 25.0187, lng: 67.3242 },
//   { lat: 25.02, lng: 67.329 },
//   { lat: 25.0213, lng: 67.3338 },
//   { lat: 25.0226, lng: 67.3386 },
//   { lat: 25.0239, lng: 67.3434 },
//   { lat: 25.0252, lng: 67.3482 },
//   { lat: 25.0265, lng: 67.353 },
//   { lat: 25.0278, lng: 67.3578 },
//   { lat: 25.0291, lng: 67.3626 },
//   { lat: 25.0304, lng: 67.3674 },
//   { lat: 25.0317, lng: 67.3722 },
//   { lat: 25.033, lng: 67.377 },
//   { lat: 25.0343, lng: 67.3818 },
//   { lat: 25.0356, lng: 67.3866 },
//   { lat: 25.0369, lng: 67.3914 },
//   { lat: 25.0382, lng: 67.3962 },
//   { lat: 25.0395, lng: 67.401 },
//   { lat: 25.0408, lng: 67.4058 },
//   { lat: 25.0421, lng: 67.4106 },
//   { lat: 25.0434, lng: 67.4154 },
//   { lat: 25.0447, lng: 67.4202 },
//   { lat: 25.046, lng: 67.425 },
//   { lat: 25.0473, lng: 67.4298 },
//   { lat: 25.0486, lng: 67.4346 },
//   { lat: 25.0499, lng: 67.4394 },
//   { lat: 25.0512, lng: 67.4442 },
//   { lat: 25.0525, lng: 67.449 },
//   { lat: 25.0538, lng: 67.4538 },
//   { lat: 25.0551, lng: 67.4586 },
//   { lat: 25.0564, lng: 67.4634 },
//   { lat: 25.0577, lng: 67.4682 },
//   { lat: 25.059, lng: 67.473 },
//   { lat: 25.0603, lng: 67.4778 },
//   { lat: 25.0616, lng: 67.4826 },
//   { lat: 25.0629, lng: 67.4874 },
//   { lat: 25.0642, lng: 67.4922 },
//   { lat: 25.0655, lng: 67.497 },
//   { lat: 25.0668, lng: 67.5018 },
//   { lat: 25.0681, lng: 67.5066 },
//   { lat: 25.0694, lng: 67.5114 },
//   { lat: 25.0707, lng: 67.5162 },
//   { lat: 25.072, lng: 67.521 },
//   { lat: 25.0733, lng: 67.5258 },
//   { lat: 25.0746, lng: 67.5306 },
//   { lat: 25.0759, lng: 67.5354 },
//   { lat: 25.0772, lng: 67.5402 },
//   { lat: 25.0785, lng: 67.545 },
//   { lat: 25.0798, lng: 67.5498 },
//   { lat: 25.0811, lng: 67.5546 },
//   { lat: 25.0824, lng: 67.5594 },
//   { lat: 25.0837, lng: 67.5642 },
//   { lat: 25.085, lng: 67.569 },
//   { lat: 25.0863, lng: 67.5738 },
//   { lat: 25.0876, lng: 67.5786 },
//   { lat: 25.0889, lng: 67.5834 },
//   { lat: 25.0902, lng: 67.5882 },
//   { lat: 25.0915, lng: 67.593 },
//   { lat: 25.0928, lng: 67.5978 },
//   { lat: 25.0941, lng: 67.6026 },
//   { lat: 25.0954, lng: 67.6074 },
//   { lat: 25.0967, lng: 67.6122 },
//   { lat: 25.098, lng: 67.617 },
//   { lat: 25.0993, lng: 67.6218 },
//   { lat: 25.1006, lng: 67.6266 },
//   { lat: 25.1019, lng: 67.6314 },
//   { lat: 25.1032, lng: 67.6362 },
//   { lat: 25.1045, lng: 67.641 },
//   { lat: 25.1058, lng: 67.6458 },
//   { lat: 25.1071, lng: 67.6506 },
//   { lat: 25.1084, lng: 67.6554 },
//   { lat: 25.1097, lng: 67.6602 },
//   { lat: 25.111, lng: 67.665 },
//   { lat: 25.1123, lng: 67.6698 },
//   { lat: 25.1136, lng: 67.6746 },
//   { lat: 25.1149, lng: 67.6794 },
//   { lat: 25.1162, lng: 67.6842 },
//   { lat: 25.1175, lng: 67.689 },
//   { lat: 25.1188, lng: 67.6938 },
//   { lat: 25.1201, lng: 67.6986 },
//   { lat: 25.1214, lng: 67.7034 },
//   { lat: 25.1227, lng: 67.7082 },
//   { lat: 25.124, lng: 67.713 },
//   { lat: 25.1253, lng: 67.7178 },
//   { lat: 25.1266, lng: 67.7226 },
//   { lat: 25.1279, lng: 67.7274 },
//   { lat: 25.1292, lng: 67.7322 },
//   { lat: 25.1305, lng: 67.737 },
//   { lat: 25.1318, lng: 67.7418 },
//   { lat: 25.1331, lng: 67.7466 },
//   { lat: 25.1344, lng: 67.7514 },
//   { lat: 25.1357, lng: 67.7562 },
//   { lat: 25.137, lng: 67.761 },
//   { lat: 25.1383, lng: 67.7658 },
//   { lat: 25.1396, lng: 67.7706 },
//   { lat: 25.1409, lng: 67.7754 },
//   { lat: 25.1422, lng: 67.7802 },
//   { lat: 25.1435, lng: 67.785 },
//   { lat: 25.1448, lng: 67.7898 },
//   { lat: 25.1461, lng: 67.7946 },
//   { lat: 25.1474, lng: 67.7994 },
//   { lat: 25.1487, lng: 67.8042 },
//   { lat: 25.15, lng: 67.809 },
//   { lat: 25.1513, lng: 67.8138 },
//   { lat: 25.1526, lng: 67.8186 },
//   { lat: 25.1539, lng: 67.8234 },
//   { lat: 25.1552, lng: 67.8282 },
//   { lat: 25.1565, lng: 67.833 },
//   { lat: 25.1578, lng: 67.8378 },
//   { lat: 25.1591, lng: 67.8426 },
//   { lat: 25.1604, lng: 67.8474 },
//   { lat: 25.1617, lng: 67.8522 },
//   { lat: 25.163, lng: 67.857 },
//   { lat: 25.1643, lng: 67.8618 },
//   { lat: 25.1656, lng: 67.8666 },
//   { lat: 25.1669, lng: 67.8714 },
//   { lat: 25.1682, lng: 67.8762 },
//   { lat: 25.1695, lng: 67.881 },
//   { lat: 25.1708, lng: 67.8858 },
//   { lat: 25.1721, lng: 67.8906 },
//   { lat: 25.1734, lng: 67.8954 },
//   { lat: 25.1747, lng: 67.9002 },
//   { lat: 25.176, lng: 67.905 },
//   { lat: 25.1773, lng: 67.9098 },
//   { lat: 25.1786, lng: 67.9146 },
//   { lat: 25.1799, lng: 67.9194 },
//   { lat: 25.1812, lng: 67.9242 },
//   { lat: 25.1825, lng: 67.929 },
//   { lat: 25.1838, lng: 67.9338 },
//   { lat: 25.1851, lng: 67.9386 },
//   { lat: 25.1864, lng: 67.9434 },
//   { lat: 25.1877, lng: 67.9482 },
//   { lat: 25.189, lng: 67.953 },
//   { lat: 25.1903, lng: 67.9578 },
//   { lat: 25.1916, lng: 67.9626 },
//   { lat: 25.1929, lng: 67.9674 },
//   { lat: 25.1942, lng: 67.9722 },
//   { lat: 25.1955, lng: 67.977 },
//   { lat: 25.1968, lng: 67.9818 },
//   { lat: 25.1981, lng: 67.9866 },
//   { lat: 25.1994, lng: 67.9914 },
//   { lat: 25.2007, lng: 67.9962 },
//   { lat: 25.202, lng: 68.001 },
//   { lat: 25.2033, lng: 68.0058 },
//   { lat: 25.2046, lng: 68.0106 },
//   { lat: 25.2059, lng: 68.0154 },
//   { lat: 25.2072, lng: 68.0202 },
//   { lat: 25.2085, lng: 68.025 },
//   { lat: 25.2098, lng: 68.0298 },
//   { lat: 25.2111, lng: 68.0346 },
//   { lat: 25.2124, lng: 68.0394 },
//   { lat: 25.2137, lng: 68.0442 },
//   { lat: 25.215, lng: 68.049 },
//   { lat: 25.2163, lng: 68.0538 },
//   { lat: 25.2176, lng: 68.0586 },
//   { lat: 25.2189, lng: 68.0634 },
//   { lat: 25.2202, lng: 68.0682 },
//   { lat: 25.2215, lng: 68.073 },
//   { lat: 25.2228, lng: 68.0778 },
//   { lat: 25.2241, lng: 68.0826 },
//   { lat: 25.2254, lng: 68.0874 },
//   { lat: 25.2267, lng: 68.0922 },
//   { lat: 25.228, lng: 68.097 },
//   { lat: 25.2293, lng: 68.1018 },
//   { lat: 25.2306, lng: 68.1066 },
//   { lat: 25.2319, lng: 68.1114 },
//   { lat: 25.2332, lng: 68.1162 },
//   { lat: 25.2345, lng: 68.121 },
//   { lat: 25.2358, lng: 68.1258 },
//   { lat: 25.2371, lng: 68.1306 },
//   { lat: 25.2384, lng: 68.1354 },
//   { lat: 25.2397, lng: 68.1402 },
//   { lat: 25.241, lng: 68.145 },
//   { lat: 25.2423, lng: 68.1498 },
//   { lat: 25.2436, lng: 68.1546 },
//   { lat: 25.2449, lng: 68.1594 },
//   { lat: 25.2462, lng: 68.1642 },
//   { lat: 25.2475, lng: 68.169 },
//   { lat: 25.2488, lng: 68.1738 },
//   { lat: 25.2501, lng: 68.1786 },
//   { lat: 25.2514, lng: 68.1834 },
//   { lat: 25.2527, lng: 68.1882 },
//   { lat: 25.254, lng: 68.193 },
//   { lat: 25.2553, lng: 68.1978 },
//   { lat: 25.2566, lng: 68.2026 },
//   { lat: 25.2579, lng: 68.2074 },
//   { lat: 25.2592, lng: 68.2122 },
//   { lat: 25.2605, lng: 68.217 },
//   { lat: 25.2618, lng: 68.2218 },
//   { lat: 25.2631, lng: 68.2266 },
//   { lat: 25.2644, lng: 68.2314 },
//   { lat: 25.2657, lng: 68.2362 },
//   { lat: 25.267, lng: 68.241 },
//   { lat: 25.2683, lng: 68.2458 },
//   { lat: 25.2696, lng: 68.2506 },
//   { lat: 25.2709, lng: 68.2554 },
//   { lat: 25.2722, lng: 68.2602 },
//   { lat: 25.2735, lng: 68.265 },
//   { lat: 25.2748, lng: 68.2698 },
//   { lat: 25.2761, lng: 68.2746 },
//   { lat: 25.2774, lng: 68.2794 },
//   { lat: 25.2787, lng: 68.2842 },
//   { lat: 25.28, lng: 68.289 },
//   { lat: 25.2813, lng: 68.2938 },
//   { lat: 25.2826, lng: 68.2986 },
//   { lat: 25.2839, lng: 68.3034 },
//   { lat: 25.2852, lng: 68.3082 },
//   { lat: 25.2865, lng: 68.313 },
//   { lat: 25.2878, lng: 68.3178 },
//   { lat: 25.2891, lng: 68.3226 },
//   { lat: 25.2904, lng: 68.3274 },
//   { lat: 25.2917, lng: 68.3322 },
//   { lat: 25.293, lng: 68.337 },
//   { lat: 25.2943, lng: 68.3418 },
//   { lat: 25.2956, lng: 68.3466 },
//   { lat: 25.2969, lng: 68.3514 },
//   { lat: 25.2982, lng: 68.3562 },
//   { lat: 25.2995, lng: 68.361 },
//   { lat: 25.3008, lng: 68.3658 },
//   { lat: 25.3021, lng: 68.3706 },
//   { lat: 25.3034, lng: 68.3754 },
//   { lat: 25.3047, lng: 68.3802 },
//   { lat: 25.306, lng: 68.385 },
//   { lat: 25.3073, lng: 68.3898 },
//   { lat: 25.3086, lng: 68.3946 },
//   { lat: 25.3099, lng: 68.3994 },
//   { lat: 25.3112, lng: 68.4042 },
//   { lat: 25.3125, lng: 68.409 },
//   { lat: 25.3138, lng: 68.4138 },
//   { lat: 25.3151, lng: 68.4186 },
//   { lat: 25.3164, lng: 68.4234 },
//   { lat: 25.3177, lng: 68.4282 },
//   { lat: 25.319, lng: 68.433 },
//   { lat: 25.3203, lng: 68.4378 },
//   { lat: 25.3216, lng: 68.4426 },
//   { lat: 25.3229, lng: 68.4474 },
//   { lat: 25.3242, lng: 68.4522 },
//   { lat: 25.3255, lng: 68.457 },
//   { lat: 25.3268, lng: 68.4618 },
//   { lat: 25.3281, lng: 68.4666 },
//   { lat: 25.3294, lng: 68.4714 },
//   { lat: 25.3307, lng: 68.4762 },
//   { lat: 25.332, lng: 68.481 },
//   { lat: 25.3333, lng: 68.4858 },
//   { lat: 25.3346, lng: 68.4906 },
//   { lat: 25.3359, lng: 68.4954 },
//   { lat: 25.3372, lng: 68.5002 },
//   { lat: 25.3385, lng: 68.505 },
//   { lat: 25.3398, lng: 68.5098 },
//   { lat: 25.3411, lng: 68.5146 },
//   { lat: 25.3424, lng: 68.5194 },
//   { lat: 25.3437, lng: 68.5242 },
//   { lat: 25.345, lng: 68.529 },
//   { lat: 25.3463, lng: 68.5338 },
//   { lat: 25.3476, lng: 68.5386 },
//   { lat: 25.3489, lng: 68.5434 },
//   { lat: 25.3502, lng: 68.5482 },
//   { lat: 25.3515, lng: 68.553 },
//   { lat: 25.3528, lng: 68.5578 },
//   { lat: 25.3541, lng: 68.5626 },
//   { lat: 25.3554, lng: 68.5674 },
//   { lat: 25.3567, lng: 68.5722 },
//   { lat: 25.358, lng: 68.577 },
//   { lat: 25.3593, lng: 68.5818 },
//   { lat: 25.3606, lng: 68.5866 },
//   { lat: 25.3619, lng: 68.5914 },
//   { lat: 25.3632, lng: 68.5962 },
//   { lat: 25.3645, lng: 68.601 },
//   { lat: 25.3658, lng: 68.6058 },
//   { lat: 25.3671, lng: 68.6106 },
//   { lat: 25.3684, lng: 68.6154 },
//   { lat: 25.3697, lng: 68.6202 },
//   { lat: 25.371, lng: 68.625 },
//   { lat: 25.3723, lng: 68.6298 },
//   { lat: 25.3736, lng: 68.6346 },
//   { lat: 25.3749, lng: 68.6394 },
//   { lat: 25.3762, lng: 68.6442 },
//   { lat: 25.3775, lng: 68.649 },
//   { lat: 25.3788, lng: 68.6538 },
//   { lat: 25.3801, lng: 68.6586 },
//   { lat: 25.3814, lng: 68.6634 },
//   { lat: 25.3827, lng: 68.6682 },
//   { lat: 25.384, lng: 68.673 },
//   { lat: 25.3853, lng: 68.6778 },
//   { lat: 25.3866, lng: 68.6826 },
//   { lat: 25.3879, lng: 68.6874 },
//   { lat: 25.3892, lng: 68.6922 },
//   { lat: 25.3905, lng: 68.697 },
//   { lat: 25.3918, lng: 68.7018 },
//   { lat: 25.3931, lng: 68.7066 },
//   { lat: 25.3944, lng: 68.7114 },
//   { lat: 25.3957, lng: 68.7162 },
//   { lat: 25.397, lng: 68.721 },
//   { lat: 25.3983, lng: 68.7258 },
//   { lat: 25.3996, lng: 68.7306 },
//   { lat: 25.4009, lng: 68.7354 },
//   { lat: 25.4022, lng: 68.7402 },
//   { lat: 25.4035, lng: 68.745 },
//   { lat: 25.4048, lng: 68.7498 },
//   { lat: 25.4061, lng: 68.7546 },
//   { lat: 25.4074, lng: 68.7594 },
//   { lat: 25.4087, lng: 68.7642 },
//   { lat: 25.41, lng: 68.769 },
//   { lat: 25.4113, lng: 68.7738 },
//   { lat: 25.4126, lng: 68.7786 },
//   { lat: 25.4139, lng: 68.7834 },
//   { lat: 25.4152, lng: 68.7882 },
//   { lat: 25.4165, lng: 68.793 },
//   { lat: 25.4178, lng: 68.7978 },
//   { lat: 25.4191, lng: 68.8026 },
//   { lat: 25.4204, lng: 68.8074 },
//   { lat: 25.4217, lng: 68.8122 },
//   { lat: 25.423, lng: 68.817 },
//   { lat: 25.4243, lng: 68.8218 },
//   { lat: 25.4256, lng: 68.8266 },
//   { lat: 25.4269, lng: 68.8314 },
//   { lat: 25.4282, lng: 68.8362 },
//   { lat: 25.4295, lng: 68.841 },
//   { lat: 25.4308, lng: 68.8458 },
//   { lat: 25.4321, lng: 68.8506 },
//   { lat: 25.4334, lng: 68.8554 },
//   { lat: 25.4347, lng: 68.8602 },
//   { lat: 25.436, lng: 68.865 },
//   { lat: 25.4373, lng: 68.8698 },
//   { lat: 25.4386, lng: 68.8746 },
//   { lat: 25.4399, lng: 68.8794 },
//   { lat: 25.4412, lng: 68.8842 },
//   { lat: 25.4425, lng: 68.889 },
//   { lat: 25.4438, lng: 68.8938 },
//   { lat: 25.4451, lng: 68.8986 },
//   { lat: 25.4464, lng: 68.9034 },
//   { lat: 25.4477, lng: 68.9082 },
//   { lat: 25.449, lng: 68.913 },
//   { lat: 25.4503, lng: 68.9178 },
//   { lat: 25.4516, lng: 68.9226 },
//   { lat: 25.4529, lng: 68.9274 },
//   { lat: 25.4542, lng: 68.9322 },
//   { lat: 25.4555, lng: 68.937 },
//   { lat: 25.4568, lng: 68.9418 },
//   { lat: 25.4581, lng: 68.9466 },
//   { lat: 25.4594, lng: 68.9514 },
//   { lat: 25.4607, lng: 68.9562 },
//   { lat: 25.462, lng: 68.961 },
//   { lat: 25.4633, lng: 68.9658 },
//   { lat: 25.4646, lng: 68.9706 },
//   { lat: 25.4659, lng: 68.9754 },
//   { lat: 25.4672, lng: 68.9802 },
//   { lat: 25.4685, lng: 68.985 },
//   { lat: 25.4698, lng: 68.9898 },
//   { lat: 25.4711, lng: 68.9946 },
//   { lat: 25.4724, lng: 68.9994 },
//   { lat: 25.4737, lng: 69.0042 },
//   { lat: 25.475, lng: 69.009 },
//   { lat: 25.4763, lng: 69.0138 },
//   { lat: 25.4776, lng: 69.0186 },
//   { lat: 25.4789, lng: 69.0234 },
//   { lat: 25.4802, lng: 69.0282 },
//   { lat: 25.4815, lng: 69.033 },
//   { lat: 25.4828, lng: 69.0378 },
//   { lat: 25.4841, lng: 69.0426 },
//   { lat: 25.4854, lng: 69.0474 },
//   { lat: 25.4867, lng: 69.0522 },
//   { lat: 25.488, lng: 69.057 },
//   { lat: 25.4893, lng: 69.0618 },
//   { lat: 25.4906, lng: 69.0666 },
//   { lat: 25.4919, lng: 69.0714 },
//   { lat: 25.4932, lng: 69.0762 },
//   { lat: 25.4945, lng: 69.081 },
//   { lat: 25.4958, lng: 69.0858 },
//   { lat: 25.4971, lng: 69.0906 },
//   { lat: 25.4984, lng: 69.0954 },
//   { lat: 25.4997, lng: 69.1002 },
//   { lat: 25.501, lng: 69.105 },
//   { lat: 25.5023, lng: 69.1098 },
//   { lat: 25.5036, lng: 69.1146 },
//   { lat: 25.5049, lng: 69.1194 },
//   { lat: 25.5062, lng: 69.1242 },
//   { lat: 25.5075, lng: 69.129 },
//   { lat: 25.5088, lng: 69.1338 },
//   { lat: 25.5101, lng: 69.1386 },
//   { lat: 25.5114, lng: 69.1434 },
// ];


