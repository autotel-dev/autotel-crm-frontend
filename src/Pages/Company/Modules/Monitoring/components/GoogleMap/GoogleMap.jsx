// import React, { useEffect, useRef, useState } from "react";
// import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
// import { useSelector } from "react-redux";
// import "./googleMap.css";

// const MapContainer = () => {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
//   });

//   const { serverDevices, selectedDevices, expandedDevice } = useSelector(
//     (state) => state.monitoring
//   );
//   const [markerRotations, setMarkerRotations] = useState([]);
//   const mapRef = useRef(null);

//   const zoomToMarker = (latLng) => {
//     if (mapRef.current) {
//       const map = mapRef.current;
//       map.setZoom(16);
//       map.panTo(latLng);
//       map.setZoom(16);
//       map.setCenter(latLng);
//     }
//   };

//   const calculateBearing = (pointA, pointB) => {
//     const lat1 = parseFloat(pointA.lat);
//     const lon1 = parseFloat(pointA.lng);
//     const lat2 = parseFloat(pointB.lat);
//     const lon2 = parseFloat(pointB.lng);

//     const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
//     const x =
//       Math.cos(lat1) * Math.sin(lat2) -
//       Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
//     let brng = Math.atan2(y, x);
//     brng = (brng * 180) / Math.PI;
//     brng = (brng + 360) % 360;

//     return brng;
//   };

//   useEffect(() => {
//     console.log("UseEffect Called");
//     console.log("ExpandedDevice", expandedDevice);
//     if (expandedDevice !== null) {
//       zoomToMarker(expandedDevice);
//       console.log("ExpandedDevice", expandedDevice);
//     }
//   }, [expandedDevice]);

//   useEffect(() => {
//     // Calculate and store rotation for each selected device
//     const rotations = selectedDevices.map((marker) => {
//       const tail = marker.tail;
//       if (tail.length < 2) return 0; // Skip if there are less than 2 points

//       const start = tail[tail.length - 2]; // Second-to-last point
//       const end = tail[tail.length - 1]; // Last point
//       return calculateBearing(start, end) || 0;
//     });
//     setMarkerRotations(rotations);
//     console.log("markerRotations", markerRotations);
//   }, [selectedDevices]);

//   if (!isLoaded) {
//     return <div>Error: Google Maps API failed to load.</div>;
//   }

//   return (
//     <GoogleMap
//       id="map"
//       mapContainerStyle={{
//         width: "100%",
//         height: "100%",
//       }}
//       zoom={12}
//       center={{ lat: 24.8607, lng: 67.0011 }}
//       onLoad={(map) => (mapRef.current = map)}
//       options={{ disableDefaultUI: true }}
//     >
//       {selectedDevices.map((marker, index) => {
//         const tail = marker.tail;
//         if (tail.length < 2) return null; // Skip if there are less than 2 points
//         const rotation =
//           (markerRotations[index] >= 0
//             ? markerRotations[index]
//             : 360 + markerRotations[index]) % 360;
//         const icon = {
//           url: `${marker.server.url}/${marker.icon.path}`,
//           scaledSize: new window.google.maps.Size(22, 40),
//           rotation: rotation,
//         };
//         return (
//           <Marker
//             key={marker.id}
//             title={marker.title}
//             position={{
//               lat: parseFloat(marker.lat),
//               lng: parseFloat(marker.lng),
//             }}
//             icon={icon}
//           />
//         );
//       })}

//       {/* Custom Zoom Control */}
//       <div className="custom-zoom-control">
//         <button
//           onClick={() => mapRef.current.setZoom(mapRef.current.getZoom() + 1)}
//           className="zoom-button"
//         >
//           +
//         </button>
//         <button
//           onClick={() => mapRef.current.setZoom(mapRef.current.getZoom() - 1)}
//           className="zoom-button"
//         >
//           -
//         </button>
//       </div>
//     </GoogleMap>
//   );
// };

// export default MapContainer;

import { useEffect, useRef, useState } from "react";
import { Map, Marker, GoogleApiWrapper, Circle } from "google-maps-react";
import { useSelector } from "react-redux";
import "./googleMap.css";

const GoogleMap = (props) => {
  const { serverDevices, selectedDevices, expandedDevice } = useSelector(
    (state) => state.monitoring
  );
  const [rotation, setRotation] = useState(-270);
  const mapRef = useRef(null);
  const zoomToMarker = (latLng) => {
    if (mapRef.current) {
      const map = mapRef.current.map;
      map.setZoom(16);
      map.panTo(latLng);
      map.setZoom(16);
      map.setCenter(latLng);
    }
  };
  const calculateBearing = (pointA, pointB) => {
    const lat1 = parseFloat(pointA.lat);
    const lon1 = parseFloat(pointA.lng);
    const lat2 = parseFloat(pointB.lat);
    const lon2 = parseFloat(pointB.lng);

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    let brng = Math.atan2(y, x);
    brng = (brng * 180) / Math.PI;
    brng = (brng + 360) % 360;

    return brng;
  };

  useEffect(() => {
    console.log("UseEffect Called");
    console.log("ExpandedDevice", expandedDevice);
    if (expandedDevice !== null) {
      zoomToMarker(expandedDevice);
      console.log("ExpandedDevice", expandedDevice);
    }
  }, [expandedDevice]);

  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

  return (
    <Map
      google={props.google}
      zoom={12}
      initialCenter={{ lat: 24.8607, lng: 67.0011 }}
      disableDefaultUI={true} // Enable default UI controls
      ref={mapRef}
    >
      {selectedDevices.map((marker) => {
        const tail = marker.tail;
        if (tail.length < 2) return null; // Skip if there are less than 2 points

        const start = tail[tail.length - 2]; // Second-to-last point
        const end = tail[tail.length - 1]; // Last point
        const bearing = calculateBearing(start, end) || 0;
        console.log("Marker Bearing:", bearing); // Log the bearing

        const icon = {
          url: `${marker.server.url}/${marker.icon.path}`,
          scaledSize: new window.google.maps.Size(22, 40),
          rotation: bearing,
        };
        return (
          <Marker
            key={marker.id}
            name={marker.title}
            position={{
              lat: parseFloat(marker.lat),
              lng: parseFloat(marker.lng),
            }}
            icon={icon}
          />
        );
      })}

      {/* Custom Zoom Control */}
      <div className="custom-zoom-control">
        <button onClick={() => props.zoomIn()} className="zoom-button">
          +
        </button>
        <button onClick={() => props.zoomOut()} className="zoom-button">
          -
        </button>
      </div>
    </Map>
  );
};

// ---------------------------------------------------------------

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(GoogleMap);

// ------------------------------------------------------------
