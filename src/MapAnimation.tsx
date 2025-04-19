// import React, { useState, useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Fix for default marker icons in Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// // Custom car icon
// const carIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744515.png",
//   iconSize: [32, 32],
//   iconAnchor: [16, 16],
// });

// const MapWithMultipleCars = () => {
//   // Define different routes for each car
//   const routes = [
//     [
//       { lat: 51.505, lng: -0.09 },
//       { lat: 51.515, lng: -0.1 },
//       { lat: 51.525, lng: -0.11 },
//       { lat: 51.535, lng: -0.12 },
//     ],
//     [
//       { lat: 51.505, lng: -0.08 },
//       { lat: 51.515, lng: -0.09 },
//       { lat: 51.525, lng: -0.1 },
//       { lat: 51.535, lng: -0.11 },
//     ],
//     [
//       { lat: 51.495, lng: -0.1 },
//       { lat: 51.505, lng: -0.11 },
//       { lat: 51.515, lng: -0.12 },
//       { lat: 51.525, lng: -0.13 },
//     ],
//     [
//       { lat: 51.485, lng: -0.11 },
//       { lat: 51.495, lng: -0.12 },
//       { lat: 51.505, lng: -0.13 },
//       { lat: 51.515, lng: -0.14 },
//     ],
//   ];

//   // State for car positions
//   const [positions, setPositions] = useState(routes.map((route) => route[0]));
//   const [currentIndices, setCurrentIndices] = useState(routes.map(() => 0));

//   // Interpolate between points for smoother animation
//   const interpolatePoints = (start, end, steps) => {
//     const points = [];
//     for (let i = 0; i <= steps; i++) {
//       const ratio = i / steps;
//       points.push({
//         lat: start.lat + (end.lat - start.lat) * ratio,
//         lng: start.lng + (end.lng - start.lng) * ratio,
//       });
//     }
//     return points;
//   };

//   // Simulate car movement along the routes
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndices((prevIndices) => {
//         return prevIndices.map((index, carIndex) => {
//           const route = routes[carIndex];
//           return (index + 1) % route.length;
//         });
//       });
//     }, 2000); // Move every 2 seconds

//     return () => clearInterval(interval);
//   }, []);

//   // Update positions with smooth transitions
//   useEffect(() => {
//     const animationDuration = 2000; // 2 seconds
//     const steps = 20;

//     const animations = routes.map((route, carIndex) => {
//       const currentIndex = currentIndices[carIndex];
//       const nextIndex = (currentIndex + 1) % route.length;
//       const start = route[currentIndex];
//       const end = route[nextIndex];
//       const interpolated = interpolatePoints(start, end, steps);

//       let step = 0;
//       const interval = setInterval(() => {
//         if (step < steps) {
//           setPositions((prev) => {
//             const newPositions = [...prev];
//             newPositions[carIndex] = interpolated[step];
//             return newPositions;
//           });
//           step++;
//         } else {
//           clearInterval(interval);
//         }
//       }, animationDuration / steps);

//       return interval;
//     });

//     return () => animations.forEach((interval) => clearInterval(interval));
//   }, [currentIndices]);

//   return (
//     <div style={{ height: "100vh", width: "100%", position: "relative" }}>
//       <MapContainer
//         center={positions[0]}
//         zoom={13}
//         style={{ height: "100%", width: "100%" }}
//         whenCreated={(map) => {
//           setTimeout(() => {
//             map.invalidateSize();
//           }, 0);
//         }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />

//         {/* Show routes as polylines */}
//         {routes.map((route, i) => (
//           <Polyline
//             key={`route-${i}`}
//             positions={route}
//             color={getColor(i)}
//             weight={2}
//           />
//         ))}

//         {/* Car Markers */}
//         {positions.map((position, i) => (
//           <Marker key={`car-${i}`} position={position} icon={carIcon}>
//             <Popup>Car {i + 1}</Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// };

// // Helper function to get different colors for each route
// const getColor = (index) => {
//   const colors = ["red", "blue", "green", "orange"];
//   return colors[index % colors.length];
// };

// export default MapWithMultipleCars;

// npm install react-leaflet leaflet react-spring

import React from "react";

const MapAnimation = () => {
  return <div></div>;
};

export default MapAnimation;
