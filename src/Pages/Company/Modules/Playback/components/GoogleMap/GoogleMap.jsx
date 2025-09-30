// import { useEffect, useRef, useState, useMemo, useCallback } from "react";
// import { Map, GoogleApiWrapper, InfoWindow, Polyline } from "google-maps-react";
// import { useDispatch, useSelector } from "react-redux";
// import "./googleMap.css";
// import carIcon from "../../../monitoring-assets/deviceLocationArrow.png";

// import { dataPoints } from "./data.js";

// // Custom Animated Car Marker Component
// const AnimatedCarMarker = ({
//   map,
//   google,
//   position,
//   icon,
//   rotation,
//   onClick,
// }) => {
//   const markerRef = useRef(null);
//   const divRef = useRef(null);

//   useEffect(() => {
//     if (!map || !google) return;

//     const div = document.createElement("div");
//     div.style.position = "absolute";
//     div.style.width = "30px";
//     div.style.height = "30px";
//     div.style.transform = `rotate(${rotation}deg)`;
//     div.style.transformOrigin = "center";
//     div.style.transition = "transform 0.3s ease";
//     div.style.zIndex = "1000";
//     div.innerHTML = `<img src="${icon}" width="24" height="40" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);" />`;

//     if (onClick) {
//       div.style.cursor = "pointer";
//       div.addEventListener("click", onClick);
//     }

//     const overlay = new google.maps.OverlayView();
//     overlay.onAdd = function () {
//       const panes = this.getPanes();
//       panes.overlayMouseTarget.appendChild(div);
//     };

//     overlay.draw = function () {
//       const projection = this.getProjection();
//       if (!projection) return;

//       const point = projection.fromLatLngToDivPixel(
//         new google.maps.LatLng(position.lat, position.lng)
//       );

//       if (point) {
//         div.style.left = `${point.x - 15}px`;
//         div.style.top = `${point.y - 15}px`;
//       }
//     };

//     overlay.onRemove = function () {
//       if (div.parentNode) {
//         div.parentNode.removeChild(div);
//       }
//     };

//     overlay.setMap(map);
//     markerRef.current = overlay;
//     divRef.current = div;

//     return () => {
//       overlay.setMap(null);
//     };
//   }, [map, google, icon, onClick]);

//   // Update position and rotation smoothly
//   useEffect(() => {
//     if (divRef.current) {
//       divRef.current.style.transform = `rotate(${rotation}deg)`;
//     }
//     if (markerRef.current) {
//       markerRef.current.draw();
//     }
//   }, [position, rotation]);

//   return null;
// };

// const GoogleMap = (props) => {
//   const dispatch = useDispatch();
//   const [zoom, setZoom] = useState(12);
//   const [selectedPoint, setSelectedPoint] = useState(null);
//   const [infoWindowPosition, setInfoWindowPosition] = useState(null);
//   const [infoWindowVisible, setInfoWindowVisible] = useState(false);
//   const [showTrack, setShowTrack] = useState(true);
//   const [carPosition, setCarPosition] = useState(null);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [animationSpeed, setAnimationSpeed] = useState(70000); // milliseconds for complete journey
//   const [markersInitialized, setMarkersInitialized] = useState(false);
//   const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
//   const [animationProgress, setAnimationProgress] = useState(0);
//   const mapRef = useRef(null);
//   const animationRef = useRef(null);
//   const markersRef = useRef([]);

//   // Calculate center from dataPoints
//   const mapCenter = useMemo(() => {
//     if (dataPoints.length === 0) return { lat: 24.8607, lng: 67.0011 };

//     const sum = dataPoints.reduce(
//       (acc, point) => ({
//         lat: acc.lat + point.latitude,
//         lng: acc.lng + point.longitude,
//       }),
//       { lat: 0, lng: 0 }
//     );

//     return {
//       lat: sum.lat / dataPoints.length,
//       lng: sum.lng / dataPoints.length,
//     };
//   }, []);

//   // Create polyline path from dataPoints
//   const polylinePath = useMemo(() => {
//     return dataPoints.map((point) => ({
//       lat: point.latitude,
//       lng: point.longitude,
//     }));
//   }, []);

//   // Sort dataPoints by timestamp for proper track sequence
//   const sortedDataPoints = useMemo(() => {
//     return [...dataPoints].sort(
//       (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
//     );
//   }, []);

//   // Calculate bearing between two points for car rotation
//   const calculateBearing = useCallback((start, end) => {
//     const startLat = (start.latitude * Math.PI) / 180;
//     const startLng = (start.longitude * Math.PI) / 180;
//     const endLat = (end.latitude * Math.PI) / 180;
//     const endLng = (end.longitude * Math.PI) / 180;

//     const dLng = endLng - startLng;
//     const y = Math.sin(dLng) * Math.cos(endLat);
//     const x =
//       Math.cos(startLat) * Math.sin(endLat) -
//       Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

//     const bearing = (Math.atan2(y, x) * 180) / Math.PI;
//     return (bearing + 360) % 360;
//   }, []);

//   // Initialize static markers once
//   const initializeMarkers = useCallback(() => {
//     if (!mapRef.current?.map || !props.google || markersInitialized) return;

//     // Clear existing markers
//     markersRef.current.forEach((marker) => {
//       if (marker.setMap) marker.setMap(null);
//     });
//     markersRef.current = [];

//     // Create markers for each GPS point
//     sortedDataPoints.forEach((point, index) => {
//       if (index % 4 == 0) {
//         const marker = new props.google.maps.Marker({
//           position: { lat: point.latitude, lng: point.longitude },
//           map: mapRef.current.map,
//           icon: {
//             path: props.google.maps.SymbolPath.CIRCLE,
//             fillColor: point.speed && point.speed > 0 ? "#4285F4" : "#EA4335",
//             fillOpacity: 0.7,
//             strokeColor: "#FFFFFF",
//             strokeWeight: 1,
//             scale: 4,
//           },
//           title: `Point ${index + 1}: ${point.timestamp}`,
//         });

//         // Add click listener
//         marker.addListener("click", () => {
//           setSelectedPoint(point);
//           setInfoWindowPosition({
//             lat: point.latitude,
//             lng: point.longitude,
//           });
//           setInfoWindowVisible(true);
//         });

//         markersRef.current.push(marker);
//       }
//     });

//     setMarkersInitialized(true);
//   }, [sortedDataPoints, props.google, markersInitialized]);

//   // Initialize car at starting position
//   useEffect(() => {
//     if (sortedDataPoints.length > 0 && !carPosition) {
//       setCarPosition({
//         lat: sortedDataPoints[0].latitude,
//         lng: sortedDataPoints[0].longitude,
//         bearing: sortedDataPoints[0].bearing || 0,
//         pointData: sortedDataPoints[0],
//       });
//     }
//   }, [sortedDataPoints, carPosition]);

//   // Initialize markers when map is ready
//   useEffect(() => {
//     if (mapRef.current?.map && props.google && !markersInitialized) {
//       setTimeout(() => {
//         initializeMarkers();
//       }, 100);
//     }
//   }, [
//     mapRef.current?.map,
//     props.google,
//     initializeMarkers,
//     markersInitialized,
//   ]);

//   // Smooth continuous animation function
//   const animateCar = useCallback(() => {
//     if (sortedDataPoints.length <= 1) return;

//     const totalSegments = sortedDataPoints.length - 1;
//     const segmentDuration = animationSpeed / totalSegments;
//     let startTime = performance.now();
//     let currentSegment = 0;

//     const animate = (currentTime) => {
//       if (!isAnimating) return;

//       const elapsed = currentTime - startTime;
//       const segmentProgress = Math.min(elapsed / segmentDuration, 1);

//       // Current segment points
//       const startPoint = sortedDataPoints[currentSegment];
//       const endPoint = sortedDataPoints[currentSegment + 1];

//       if (startPoint && endPoint) {
//         // Smooth interpolation between points
//         const lat =
//           startPoint.latitude +
//           (endPoint.latitude - startPoint.latitude) * segmentProgress;
//         const lng =
//           startPoint.longitude +
//           (endPoint.longitude - startPoint.longitude) * segmentProgress;

//         // Calculate bearing for smooth rotation
//         const bearing = calculateBearing(startPoint, endPoint);

//         // Update car position
//         setCarPosition({
//           lat,
//           lng,
//           bearing,
//           pointData: segmentProgress > 0.5 ? endPoint : startPoint,
//         });

//         setCurrentSegmentIndex(currentSegment);
//         setAnimationProgress(
//           (currentSegment + segmentProgress) / totalSegments
//         );
//       }

//       // Move to next segment when current one completes
//       if (segmentProgress >= 1) {
//         currentSegment++;
//         startTime = currentTime;

//         // Check if animation is complete
//         if (currentSegment >= totalSegments) {
//           // Loop back to start
//           currentSegment = 0;
//           setCarPosition({
//             lat: sortedDataPoints[0].latitude,
//             lng: sortedDataPoints[0].longitude,
//             bearing: sortedDataPoints[0].bearing || 0,
//             pointData: sortedDataPoints[0],
//           });
//         }
//       }

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);
//   }, [sortedDataPoints, animationSpeed, calculateBearing, isAnimating]);

//   // Start animation
//   const startAnimation = useCallback(() => {
//     if (sortedDataPoints.length <= 1) return;
//     setIsAnimating(true);
//     setCurrentSegmentIndex(0);
//     setAnimationProgress(0);
//   }, [sortedDataPoints]);

//   // Stop animation
//   const stopAnimation = useCallback(() => {
//     setIsAnimating(false);
//     if (animationRef.current) {
//       cancelAnimationFrame(animationRef.current);
//       animationRef.current = null;
//     }
//   }, []);

//   // Reset animation
//   const resetAnimation = useCallback(() => {
//     stopAnimation();
//     setCurrentSegmentIndex(0);
//     setAnimationProgress(0);
//     if (sortedDataPoints.length > 0) {
//       setCarPosition({
//         lat: sortedDataPoints[0].latitude,
//         lng: sortedDataPoints[0].longitude,
//         bearing: sortedDataPoints[0].bearing || 0,
//         pointData: sortedDataPoints[0],
//       });
//     }
//   }, [stopAnimation, sortedDataPoints]);

//   // Handle speed change
//   const handleSpeedChange = useCallback((newSpeed) => {
//     setAnimationSpeed(newSpeed);
//   }, []);

//   // Start animation when isAnimating becomes true
//   useEffect(() => {
//     if (isAnimating) {
//       animateCar();
//     }
//   }, [isAnimating, animateCar]);

//   // Handle car marker click
//   const handleCarMarkerClick = useCallback(() => {
//     if (carPosition) {
//       setSelectedPoint(carPosition.pointData);
//       setInfoWindowPosition({
//         lat: carPosition.lat,
//         lng: carPosition.lng,
//       });
//       setInfoWindowVisible(true);
//     }
//   }, [carPosition]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//       // Clean up markers
//       markersRef.current.forEach((marker) => {
//         if (marker.setMap) marker.setMap(null);
//       });
//     };
//   }, []);

//   const zoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 1, 20));
//   const zoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 1, 1));

//   if (!props.google) {
//     return <div>Error: Google Maps API failed to load.</div>;
//   }

//   return (
//     <div>
//       {/* Animation Control Panel */}
//       <div
//         style={{
//           position: "absolute",
//           top: "25%",
//           left: "10px",
//           zIndex: 1000,
//           background: "white",
//           padding: "15px",
//           borderRadius: "8px",
//           boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//           minWidth: "320px",
//         }}
//       >
//         <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
//           Playback Controls
//         </h4>

//         {/* Video-style playback controls */}
//         <div
//           style={{
//             marginBottom: "15px",
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//           }}
//         >
//           {/* Play/Pause Button */}
//           <button
//             onClick={isAnimating ? stopAnimation : startAnimation}
//             style={{
//               width: "40px",
//               height: "40px",
//               backgroundColor: "#4CAF50",
//               color: "white",
//               border: "none",
//               borderRadius: "50%",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "16px",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//               transition: "all 0.2s ease",
//             }}
//             title={isAnimating ? "Pause" : "Play"}
//           >
//             {isAnimating ? (
//               // Pause icon
//               <div style={{ display: "flex", gap: "4px" }}>
//                 <div
//                   style={{
//                     width: "4px",
//                     height: "14px",
//                     backgroundColor: "white",
//                     borderRadius: "2px",
//                   }}
//                 ></div>
//                 <div
//                   style={{
//                     width: "4px",
//                     height: "14px",
//                     backgroundColor: "white",
//                     borderRadius: "2px",
//                   }}
//                 ></div>
//               </div>
//             ) : (
//               // Play icon
//               <div
//                 style={{
//                   width: 0,
//                   height: 0,
//                   borderLeft: "10px solid white",
//                   borderTop: "6px solid transparent",
//                   borderBottom: "6px solid transparent",
//                   marginLeft: "2px",
//                 }}
//               ></div>
//             )}
//           </button>

//           {/* Reset Button */}
//           <button
//             onClick={resetAnimation}
//             style={{
//               width: "40px",
//               height: "40px",
//               backgroundColor: "#607d8b",
//               color: "white",
//               border: "none",
//               borderRadius: "50%",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "14px",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//               transition: "all 0.2s ease",
//             }}
//             title="Reset"
//           >
//             {/* Reset/Restart icon */}
//             <svg
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <polyline points="23 4 23 10 17 10"></polyline>
//               <polyline points="1 20 1 14 7 14"></polyline>
//               <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
//             </svg>
//           </button>

//           {/* Speed Control Dropdown */}
//           <div style={{ marginLeft: "auto" }}>
//             <select
//               value={animationSpeed}
//               onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
//               style={{
//                 padding: "8px 12px",
//                 borderRadius: "20px",
//                 border: "1px solid #ddd",
//                 backgroundColor: "#f5f5f5",
//                 fontSize: "12px",
//                 fontWeight: "bold",
//                 cursor: "pointer",
//                 outline: "none",
//                 appearance: "none",
//                 backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "right 8px center",
//                 backgroundSize: "12px",
//                 paddingRight: "30px",
//               }}
//             >
//               <option value={140000}>0.5x</option>
//               <option value={112000}>0.75x</option>
//               <option value={70000}>1x</option>
//               <option value={35000}>2x</option>
//               <option value={23333}>3x</option>
//               <option value={17500}>4x</option>
//             </select>
//           </div>
//         </div>

//         {/* Video-style playback slider */}
//         <div style={{ marginBottom: "20px", marginTop: "15px" }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//               marginBottom: "8px",
//               marginTop: "8px",
//             }}
//           >
//             {/* <span style={{ fontSize: "11px", color: "#666", minWidth: "40px" }}>
//               {Math.floor(animationProgress * 100)}%
//             </span> */}

//             {/* Playback slider */}
//             <div
//               style={{
//                 flex: 1,
//                 height: "6px",
//                 backgroundColor: "#e0e0e0",
//                 borderRadius: "3px",
//                 position: "relative",
//                 cursor: "pointer",
//               }}
//               onClick={(e) => {
//                 const rect = e.currentTarget.getBoundingClientRect();
//                 const clickPosition = (e.clientX - rect.left) / rect.width;
//                 const newSegment = Math.floor(
//                   clickPosition * (sortedDataPoints.length - 1)
//                 );
//                 setCurrentSegmentIndex(newSegment);
//                 setAnimationProgress(clickPosition);

//                 // Calculate new position based on click
//                 if (sortedDataPoints.length > 1) {
//                   const segmentIndex = Math.min(
//                     Math.floor(clickPosition * (sortedDataPoints.length - 1)),
//                     sortedDataPoints.length - 2
//                   );
//                   const segmentProgress =
//                     clickPosition * (sortedDataPoints.length - 1) -
//                     segmentIndex;

//                   const startPoint = sortedDataPoints[segmentIndex];
//                   const endPoint = sortedDataPoints[segmentIndex + 1];

//                   if (startPoint && endPoint) {
//                     const lat =
//                       startPoint.latitude +
//                       (endPoint.latitude - startPoint.latitude) *
//                         segmentProgress;
//                     const lng =
//                       startPoint.longitude +
//                       (endPoint.longitude - startPoint.longitude) *
//                         segmentProgress;
//                     const bearing = calculateBearing(startPoint, endPoint);

//                     setCarPosition({
//                       lat,
//                       lng,
//                       bearing,
//                       pointData: segmentProgress > 0.5 ? endPoint : startPoint,
//                     });
//                   }
//                 }
//               }}
//             >
//               <div
//                 style={{
//                   width: `${animationProgress * 100}%`,
//                   height: "100%",
//                   backgroundColor: "#4CAF50",
//                   borderRadius: "3px",
//                   position: "relative",
//                 }}
//               >
//                 <div
//                   style={{
//                     position: "absolute",
//                     right: "-8px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     width: "16px",
//                     height: "16px",
//                     backgroundColor: "#4CAF50",
//                     borderRadius: "50%",
//                     boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
//                     border: "2px solid white",
//                   }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Status indicator */}
//         <div
//           style={{
//             marginBottom: "15px",
//             padding: "8px 12px",
//             backgroundColor: isAnimating ? "#e8f5e9" : "#f5f5f5",
//             borderRadius: "4px",
//             fontSize: "12px",
//             color: isAnimating ? "#2e7d32" : "#666",
//             fontWeight: "bold",
//             textAlign: "center",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "6px",
//           }}
//         >
//           {isAnimating ? (
//             <>
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="#2e7d32"
//                 stroke="none"
//               >
//                 <rect x="6" y="4" width="4" height="16" rx="1" />
//                 <rect x="14" y="4" width="4" height="16" rx="1" />
//               </svg>
//               PLAYING
//             </>
//           ) : (
//             <>
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="#666"
//                 stroke="none"
//               >
//                 <polygon points="5 3 19 12 5 21 5 3" />
//               </svg>
//               PAUSED
//             </>
//           )}
//         </div>

//         {/* Trip details */}
//         <div style={{ fontSize: "13px", color: "#666" }}>
//           <div
//             style={{
//               marginBottom: "5px",
//               display: "flex",
//               justifyContent: "space-between",
//             }}
//           >
//             <strong>Total Points:</strong>
//             <span>{sortedDataPoints.length}</span>
//           </div>
//           <div
//             style={{
//               marginBottom: "5px",
//               display: "flex",
//               justifyContent: "space-between",
//             }}
//           >
//             <strong>Current Segment:</strong> {currentSegmentIndex + 1}/
//             {Math.max(sortedDataPoints.length - 1, 1)}
//           </div>
//           {carPosition && (
//             <>
//               <div
//                 style={{
//                   marginBottom: "5px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <strong>Current Time:</strong> {carPosition.pointData.timestamp}
//               </div>
//               <div
//                 style={{
//                   marginBottom: "5px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <strong>Speed:</strong> {carPosition.pointData.speed || "N/A"}{" "}
//                 km/h
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <strong>Bearing:</strong> {Math.round(carPosition.bearing)}°
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       <Map
//         google={props.google}
//         zoom={zoom}
//         initialCenter={mapCenter}
//         center={mapCenter}
//         ref={mapRef}
//         gestureHandling="greedy"
//         disableDefaultUI={true}
//         style={{ width: "100%", height: "100vh" }}
//       >
//         {/* Draw the track polyline */}
//         {showTrack && polylinePath.length > 1 && (
//           <Polyline
//             path={polylinePath}
//             strokeColor="#FF0000"
//             strokeOpacity={0.8}
//             strokeWeight={3}
//           />
//         )}

//         {/* Animated Car Marker */}
//         {carPosition && (
//           <AnimatedCarMarker
//             map={mapRef.current?.map}
//             google={props.google}
//             position={{
//               lat: carPosition.lat,
//               lng: carPosition.lng,
//             }}
//             icon={carIcon}
//             rotation={carPosition.bearing || 0}
//             onClick={handleCarMarkerClick}
//           />
//         )}

//         {/* Info Window for selected point */}
//         <InfoWindow
//           position={infoWindowPosition}
//           visible={infoWindowVisible}
//           onClose={() => setInfoWindowVisible(false)}
//           options={{
//             disableAutoPan: false,
//             pixelOffset: new props.google.maps.Size(0, -40),
//             disableClose: true,
//             closeBoxMargin: "0",
//             closeBoxURL: "",
//             maxWidth: 400,
//           }}
//         >
//           <div
//             style={{
//               minWidth: "400px",
//               overflow: "hidden !important",
//               margin: "0px !important",
//               padding: "0px !important",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 padding: "10px 25px",
//                 borderBottom: "1px solid lightgray",
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <h2>VB 4285 </h2>
//                 <span
//                   style={{
//                     marginLeft: "16px",
//                     color: "gray",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Van
//                 </span>
//               </div>
//               <span style={{ fontWeight: "bold", color: "red" }}>
//                 {selectedPoint?.speed && selectedPoint?.speed > 0
//                   ? "Moving"
//                   : "Stationary"}
//               </span>
//             </div>

//             <div
//               style={{
//                 padding: "10px 25px",
//                 borderBottom: "0.5px solid lightgray",
//               }}
//             >
//               <div
//                 style={{
//                   marginTop: "10px",
//                   marginBottom: "5px",
//                   fontSize: "15px",
//                 }}
//               >
//                 <strong style={{ width: "110px" }}>Device ID:</strong>{" "}
//                 {selectedPoint?.id}
//               </div>
//               <div
//                 style={{
//                   marginBottom: "5px",
//                   fontSize: "15px",
//                 }}
//               >
//                 <strong style={{ width: "110px" }}>Coordinates:</strong>{" "}
//                 {selectedPoint?.latitude?.toFixed(6)},{" "}
//                 {selectedPoint?.longitude?.toFixed(6)}
//               </div>
//               <div
//                 style={{
//                   marginBottom: "5px",
//                   fontSize: "15px",
//                 }}
//               >
//                 <strong style={{ width: "110px" }}>Time:</strong>{" "}
//                 {selectedPoint?.timestamp}
//               </div>
//               <div
//                 style={{
//                   marginBottom: "5px",
//                   fontSize: "15px",
//                 }}
//               >
//                 <strong style={{ width: "110px" }}>Speed:</strong>{" "}
//                 {selectedPoint?.speed || 0} km/h
//               </div>
//               {selectedPoint?.bearing !== undefined && (
//                 <div
//                   style={{
//                     marginBottom: "15px",
//                     fontSize: "15px",
//                   }}
//                 >
//                   <strong style={{ width: "110px" }}>Bearing:</strong>{" "}
//                   {selectedPoint?.bearing}°
//                 </div>
//               )}
//             </div>

//             <div
//               style={{
//                 padding: "0px 25px",
//                 paddingBottom: "15px",
//                 paddingTop: "20px",
//                 display: "flex",
//                 overflowX: "auto",
//                 gap: "5px",
//                 borderBottom: "0.5px solid lightgray",
//                 scrollbarWidth: "none",
//                 msOverflowStyle: "none",
//               }}
//             >
//               <div
//                 style={{
//                   border: "0.5px solid lightgray",
//                   borderRadius: "5px",
//                   padding: "12px 0px",
//                   fontWeight: "400",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: "2px",
//                   minWidth: "170px",
//                   maxWidth: "170px",
//                   flexShrink: 0,
//                 }}
//               >
//                 <div style={{ color: "gray" }}>Vehicle Status</div>
//                 <div
//                   style={{
//                     color:
//                       selectedPoint?.speed && selectedPoint?.speed > 0
//                         ? "green"
//                         : "red",
//                   }}
//                 >
//                   {selectedPoint?.speed && selectedPoint?.speed > 0
//                     ? "Moving"
//                     : "Stopped"}
//                 </div>
//               </div>
//               <div
//                 style={{
//                   border: "0.5px solid lightgray",
//                   borderRadius: "5px",
//                   padding: "12px 0",
//                   fontWeight: "400",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: "2px",
//                   minWidth: "170px",
//                   maxWidth: "170px",
//                   flexShrink: 0,
//                 }}
//               >
//                 <div style={{ color: "gray" }}>Current Speed</div>
//                 <div style={{ color: "black" }}>
//                   {selectedPoint?.speed || 0} km/h
//                 </div>
//               </div>
//             </div>

//             <div
//               style={{
//                 padding: "15px 25px",
//                 paddingBottom: "15px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 gap: "5px",
//               }}
//             >
//               <button
//                 style={{
//                   minWidth: "170px",
//                   maxWidth: "170px",
//                   border: "none",
//                   outline: "none",
//                   backgroundColor: "lightgray",
//                   fontWeight: "600",
//                   color: "black",
//                   textAlign: "center",
//                   padding: "15px",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 ALL EVENTS
//               </button>
//               <button
//                 style={{
//                   minWidth: "170px",
//                   maxWidth: "170px",
//                   border: "none",
//                   outline: "none",
//                   backgroundColor: "lightgray",
//                   fontWeight: "600",
//                   color: "black",
//                   textAlign: "center",
//                   padding: "15px",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 TRIP
//               </button>
//             </div>
//           </div>
//         </InfoWindow>

//         {/* Custom zoom controls */}
//         <div
//           className="custom-zoom-control"
//           style={{
//             position: "absolute",
//             right: "10px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             display: "flex",
//             flexDirection: "column",
//             gap: "5px",
//           }}
//         >
//           <button
//             onClick={zoomIn}
//             className="zoom-button"
//             style={{
//               width: "40px",
//               height: "40px",
//               backgroundColor: "white",
//               border: "2px solid #ccc",
//               borderRadius: "4px",
//               cursor: "pointer",
//               fontSize: "18px",
//               fontWeight: "bold",
//             }}
//           >
//             +
//           </button>
//           <button
//             onClick={zoomOut}
//             className="zoom-button"
//             style={{
//               width: "40px",
//               height: "40px",
//               backgroundColor: "white",
//               border: "2px solid #ccc",
//               borderRadius: "4px",
//               cursor: "pointer",
//               fontSize: "18px",
//               fontWeight: "bold",
//             }}
//           >
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

// import { useEffect, useRef, useState, useMemo, useCallback } from "react";
// import { Map, GoogleApiWrapper, InfoWindow, Polyline } from "google-maps-react";
// import { useDispatch, useSelector } from "react-redux";
// import "./googleMap.css";
// import carIcon from "../../../monitoring-assets/deviceLocationArrow.png";

// import { dataPoints } from "./data.js";

// // Custom Animated Car Marker Component
// const AnimatedCarMarker = ({
//   map,
//   google,
//   position,
//   icon,
//   rotation,
//   onClick,
// }) => {
//   const markerRef = useRef(null);
//   const divRef = useRef(null);

//   useEffect(() => {
//     if (!map || !google) return;

//     const div = document.createElement("div");
//     div.style.position = "absolute";
//     div.style.width = "30px";
//     div.style.height = "30px";
//     div.style.transform = `rotate(${rotation}deg)`;
//     div.style.transformOrigin = "center";
//     div.style.transition = "transform 0.3s ease";
//     div.style.zIndex = "1000";
//     div.innerHTML = `<img src="${icon}" width="24" height="40" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);" />`;

//     if (onClick) {
//       div.style.cursor = "pointer";
//       div.addEventListener("click", onClick);
//     }

//     const overlay = new google.maps.OverlayView();
//     overlay.onAdd = function () {
//       const panes = this.getPanes();
//       panes.overlayMouseTarget.appendChild(div);
//     };

//     overlay.draw = function () {
//       const projection = this.getProjection();
//       if (!projection) return;

//       const point = projection.fromLatLngToDivPixel(
//         new google.maps.LatLng(position.lat, position.lng)
//       );

//       if (point) {
//         div.style.left = `${point.x - 15}px`;
//         div.style.top = `${point.y - 15}px`;
//       }
//     };

//     overlay.onRemove = function () {
//       if (div.parentNode) {
//         div.parentNode.removeChild(div);
//       }
//     };

//     overlay.setMap(map);
//     markerRef.current = overlay;
//     divRef.current = div;

//     return () => {
//       overlay.setMap(null);
//     };
//   }, [map, google, icon, onClick]);

//   // Update position and rotation smoothly
//   useEffect(() => {
//     if (divRef.current) {
//       divRef.current.style.transform = `rotate(${rotation}deg)`;
//     }
//     if (markerRef.current) {
//       markerRef.current.draw();
//     }
//   }, [position, rotation]);

//   return null;
// };

// const GoogleMap = (props) => {
//   const { selectedSingleDevice, vehicleHistoryData } = useSelector(
//     (state) => state.monitoring
//   );

//   console.log("vehicleHistoryData", vehicleHistoryData);

//   const dispatch = useDispatch();
//   const [zoom, setZoom] = useState(12);
//   const [selectedPoint, setSelectedPoint] = useState(null);
//   const [infoWindowPosition, setInfoWindowPosition] = useState(null);
//   const [infoWindowVisible, setInfoWindowVisible] = useState(false);
//   const [showTrack, setShowTrack] = useState(true);
//   const [carPosition, setCarPosition] = useState(null);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [animationSpeed, setAnimationSpeed] = useState(70000);
//   const [markersInitialized, setMarkersInitialized] = useState(false);
//   const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
//   const [animationProgress, setAnimationProgress] = useState(0);
//   const [mapCenter, setMapCenter] = useState({ lat: 24.8607, lng: 67.0011 });
//   const mapRef = useRef(null);
//   const animationRef = useRef(null);
//   const markersRef = useRef([]);

//   // Sort dataPoints by timestamp for proper track sequence
//   const sortedDataPoints = useMemo(() => {
//     return [...vehicleHistoryData].sort(
//       (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
//     );
//   }, [vehicleHistoryData]);

//   // Optimize points for large datasets (reduce points if > 3500)
//   const optimizedDataPoints = useMemo(() => {
//     if (sortedDataPoints.length <= 3500) {
//       return sortedDataPoints;
//     }

//     // If more than 3500 points, skip points (show every 4th point)
//     const reduced = [];
//     for (let i = 0; i < sortedDataPoints.length; i += 4) {
//       reduced.push(sortedDataPoints[i]);
//     }

//     // Always include the last point to complete the journey
//     if (
//       sortedDataPoints.length > 0 &&
//       reduced[reduced.length - 1] !==
//         sortedDataPoints[sortedDataPoints.length - 1]
//     ) {
//       reduced.push(sortedDataPoints[sortedDataPoints.length - 1]);
//     }

//     console.log(
//       `Optimized ${sortedDataPoints.length} points to ${reduced.length} points`
//     );
//     return reduced;
//   }, [sortedDataPoints]);

//   // Create polyline path from optimized dataPoints
//   const polylinePath = useMemo(() => {
//     return optimizedDataPoints.map((point) => ({
//       lat: point.latitude,
//       lng: point.longitude,
//     }));
//   }, [optimizedDataPoints]);

//   // Calculate bearing between two points for car rotation
//   const calculateBearing = useCallback((start, end) => {
//     const startLat = (start.latitude * Math.PI) / 180;
//     const startLng = (start.longitude * Math.PI) / 180;
//     const endLat = (end.latitude * Math.PI) / 180;
//     const endLng = (end.longitude * Math.PI) / 180;

//     const dLng = endLng - startLng;
//     const y = Math.sin(dLng) * Math.cos(endLat);
//     const x =
//       Math.cos(startLat) * Math.sin(endLat) -
//       Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

//     const bearing = (Math.atan2(y, x) * 180) / Math.PI;
//     return (bearing + 360) % 360;
//   }, []);

//   // Function to center map on a specific position
//   const centerMapOnPosition = useCallback((lat, lng) => {
//     if (mapRef.current?.map) {
//       mapRef.current.map.panTo({ lat, lng });
//     }
//   }, []);

//   // Initialize static markers once
//   const initializeMarkers = useCallback(() => {
//     if (!mapRef.current?.map || !props.google || markersInitialized) return;

//     // Clear existing markers
//     markersRef.current.forEach((marker) => {
//       if (marker.setMap) marker.setMap(null);
//     });
//     markersRef.current = [];

//     // Determine marker skip rate based on total points
//     let markerSkipRate = 3;
//     if (optimizedDataPoints.length > 1000) {
//       markerSkipRate = 6;
//     } else if (optimizedDataPoints.length > 500) {
//       markerSkipRate = 4;
//     }

//     // Create markers for GPS points (skip some for performance)
//     optimizedDataPoints.forEach((point, index) => {
//       if (index % markerSkipRate === 0) {
//         const marker = new props.google.maps.Marker({
//           position: { lat: point.latitude, lng: point.longitude },
//           map: mapRef.current.map,
//           icon: {
//             path: props.google.maps.SymbolPath.CIRCLE,
//             fillColor: point.speed && point.speed > 0 ? "#4285F4" : "#EA4335",
//             fillOpacity: 0.7,
//             strokeColor: "#FFFFFF",
//             strokeWeight: 1,
//             scale: 4,
//           },
//           title: `Point ${index + 1}: ${point.timestamp}`,
//         });

//         // Add click listener
//         marker.addListener("click", () => {
//           setSelectedPoint(point);
//           setInfoWindowPosition({
//             lat: point.latitude,
//             lng: point.longitude,
//           });
//           setInfoWindowVisible(true);
//         });

//         markersRef.current.push(marker);
//       }
//     });

//     setMarkersInitialized(true);
//   }, [optimizedDataPoints, props.google, markersInitialized]);

//   // Initialize car at starting position and center map
//   useEffect(() => {
//     if (optimizedDataPoints.length > 0 && !carPosition) {
//       const firstPoint = optimizedDataPoints[0];
//       setCarPosition({
//         lat: firstPoint.latitude,
//         lng: firstPoint.longitude,
//         bearing: firstPoint.course || 0,
//         pointData: firstPoint,
//       });

//       // Center map on first point
//       setMapCenter({
//         lat: firstPoint.latitude,
//         lng: firstPoint.longitude,
//       });

//       // Also pan to first point after a short delay to ensure map is loaded
//       setTimeout(() => {
//         centerMapOnPosition(firstPoint.latitude, firstPoint.longitude);
//       }, 500);
//     }
//   }, [optimizedDataPoints, carPosition, centerMapOnPosition]);

//   // Initialize markers when map is ready
//   useEffect(() => {
//     if (mapRef.current?.map && props.google && !markersInitialized) {
//       setTimeout(() => {
//         initializeMarkers();
//       }, 100);
//     }
//   }, [
//     mapRef.current?.map,
//     props.google,
//     initializeMarkers,
//     markersInitialized,
//   ]);

//   // Smooth continuous animation function with auto-centering
//   const animateCar = useCallback(() => {
//     if (optimizedDataPoints.length <= 1) return;

//     const totalSegments = optimizedDataPoints.length - 1;
//     const segmentDuration = animationSpeed / totalSegments;
//     let startTime = performance.now();
//     let currentSegment = 0;

//     const animate = (currentTime) => {
//       if (!isAnimating) return;

//       const elapsed = currentTime - startTime;
//       const segmentProgress = Math.min(elapsed / segmentDuration, 1);

//       // Current segment points
//       const startPoint = optimizedDataPoints[currentSegment];
//       const endPoint = optimizedDataPoints[currentSegment + 1];

//       if (startPoint && endPoint) {
//         // Smooth interpolation between points
//         const lat =
//           startPoint.latitude +
//           (endPoint.latitude - startPoint.latitude) * segmentProgress;
//         const lng =
//           startPoint.longitude +
//           (endPoint.longitude - startPoint.longitude) * segmentProgress;

//         // Calculate bearing for smooth rotation
//         const bearing = calculateBearing(startPoint, endPoint);

//         // Update car position
//         setCarPosition({
//           lat,
//           lng,
//           bearing,
//           pointData: segmentProgress > 0.5 ? endPoint : startPoint,
//         });

//         // Auto-center map on vehicle
//         centerMapOnPosition(lat, lng);

//         setCurrentSegmentIndex(currentSegment);
//         setAnimationProgress(
//           (currentSegment + segmentProgress) / totalSegments
//         );
//       }

//       // Move to next segment when current one completes
//       if (segmentProgress >= 1) {
//         currentSegment++;
//         startTime = currentTime;

//         // Check if animation is complete
//         if (currentSegment >= totalSegments) {
//           // Loop back to start
//           currentSegment = 0;
//           const firstPoint = optimizedDataPoints[0];
//           setCarPosition({
//             lat: firstPoint.latitude,
//             lng: firstPoint.longitude,
//             bearing: firstPoint.course || 0,
//             pointData: firstPoint,
//           });
//           // Center on first point when looping
//           centerMapOnPosition(firstPoint.latitude, firstPoint.longitude);
//         }
//       }

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);
//   }, [
//     optimizedDataPoints,
//     animationSpeed,
//     calculateBearing,
//     isAnimating,
//     centerMapOnPosition,
//   ]);

//   // Start animation
//   const startAnimation = useCallback(() => {
//     if (optimizedDataPoints.length <= 1) return;
//     setIsAnimating(true);
//     setCurrentSegmentIndex(0);
//     setAnimationProgress(0);
//   }, [optimizedDataPoints]);

//   // Stop animation
//   const stopAnimation = useCallback(() => {
//     setIsAnimating(false);
//     if (animationRef.current) {
//       cancelAnimationFrame(animationRef.current);
//       animationRef.current = null;
//     }
//   }, []);

//   // Reset animation
//   const resetAnimation = useCallback(() => {
//     stopAnimation();
//     setCurrentSegmentIndex(0);
//     setAnimationProgress(0);
//     if (optimizedDataPoints.length > 0) {
//       const firstPoint = optimizedDataPoints[0];
//       setCarPosition({
//         lat: firstPoint.latitude,
//         lng: firstPoint.longitude,
//         bearing: firstPoint.course || 0,
//         pointData: firstPoint,
//       });
//       // Center map on first point when resetting
//       centerMapOnPosition(firstPoint.latitude, firstPoint.longitude);
//     }
//   }, [stopAnimation, optimizedDataPoints, centerMapOnPosition]);

//   // Handle speed change
//   const handleSpeedChange = useCallback((newSpeed) => {
//     setAnimationSpeed(newSpeed);
//   }, []);

//   // Start animation when isAnimating becomes true
//   useEffect(() => {
//     if (isAnimating) {
//       animateCar();
//     }
//   }, [isAnimating, animateCar]);

//   // Handle car marker click
//   const handleCarMarkerClick = useCallback(() => {
//     if (carPosition) {
//       setSelectedPoint(carPosition.pointData);
//       setInfoWindowPosition({
//         lat: carPosition.lat,
//         lng: carPosition.lng,
//       });
//       setInfoWindowVisible(true);
//     }
//   }, [carPosition]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//       // Clean up markers
//       markersRef.current.forEach((marker) => {
//         if (marker.setMap) marker.setMap(null);
//       });
//     };
//   }, []);

//   const zoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 1, 20));
//   const zoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 1, 1));

//   if (!props.google) {
//     return <div>Error: Google Maps API failed to load.</div>;
//   }

//   return (
//     <div>
//       {/* Animation Control Panel */}
//       <div
//         style={{
//           position: "absolute",
//           top: "25%",
//           left: "10px",
//           zIndex: 1000,
//           background: "white",
//           padding: "15px",
//           borderRadius: "8px",
//           boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//           minWidth: "320px",
//         }}
//       >
//         <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
//           Playback Controls
//         </h4>

//         {/* Data optimization notice */}
//         {sortedDataPoints.length > 3500 && (
//           <div
//             style={{
//               marginBottom: "10px",
//               padding: "8px",
//               backgroundColor: "#fff3cd",
//               borderRadius: "4px",
//               fontSize: "11px",
//               color: "#856404",
//               border: "1px solid #ffeaa7",
//             }}
//           >
//             ⚡ Optimized: {sortedDataPoints.length} →{" "}
//             {optimizedDataPoints.length} points
//           </div>
//         )}

//         {/* Video-style playback controls */}
//         <div
//           style={{
//             marginBottom: "15px",
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//           }}
//         >
//           {/* Play/Pause Button */}
//           <button
//             onClick={isAnimating ? stopAnimation : startAnimation}
//             style={{
//               width: "40px",
//               height: "40px",
//               backgroundColor: "#4CAF50",
//               color: "white",
//               border: "none",
//               borderRadius: "50%",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "16px",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//               transition: "all 0.2s ease",
//             }}
//             title={isAnimating ? "Pause" : "Play"}
//           >
//             {isAnimating ? (
//               // Pause icon
//               <div style={{ display: "flex", gap: "4px" }}>
//                 <div
//                   style={{
//                     width: "4px",
//                     height: "14px",
//                     backgroundColor: "white",
//                     borderRadius: "2px",
//                   }}
//                 ></div>
//                 <div
//                   style={{
//                     width: "4px",
//                     height: "14px",
//                     backgroundColor: "white",
//                     borderRadius: "2px",
//                   }}
//                 ></div>
//               </div>
//             ) : (
//               // Play icon
//               <div
//                 style={{
//                   width: 0,
//                   height: 0,
//                   borderLeft: "10px solid white",
//                   borderTop: "6px solid transparent",
//                   borderBottom: "6px solid transparent",
//                   marginLeft: "2px",
//                 }}
//               ></div>
//             )}
//           </button>

//           {/* Reset Button */}
//           <button
//             onClick={resetAnimation}
//             style={{
//               width: "40px",
//               height: "40px",
//               backgroundColor: "#607d8b",
//               color: "white",
//               border: "none",
//               borderRadius: "50%",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "14px",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//               transition: "all 0.2s ease",
//             }}
//             title="Reset"
//           >
//             {/* Reset/Restart icon */}
//             <svg
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <polyline points="23 4 23 10 17 10"></polyline>
//               <polyline points="1 20 1 14 7 14"></polyline>
//               <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
//             </svg>
//           </button>

//           {/* Speed Control Dropdown */}
//           <div style={{ marginLeft: "auto" }}>
//             <select
//               value={animationSpeed}
//               onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
//               style={{
//                 padding: "8px 12px",
//                 borderRadius: "20px",
//                 border: "1px solid #ddd",
//                 backgroundColor: "#f5f5f5",
//                 fontSize: "12px",
//                 fontWeight: "bold",
//                 cursor: "pointer",
//                 outline: "none",
//                 appearance: "none",
//                 backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "right 8px center",
//                 backgroundSize: "12px",
//                 paddingRight: "30px",
//               }}
//             >
//               <option value={140000}>0.5x</option>
//               <option value={112000}>0.75x</option>
//               <option value={70000}>1x</option>
//               <option value={35000}>2x</option>
//               <option value={23333}>3x</option>
//               <option value={17500}>4x</option>
//             </select>
//           </div>
//         </div>

//         {/* Video-style playback slider */}
//         <div style={{ marginBottom: "20px", marginTop: "15px" }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//               marginBottom: "8px",
//               marginTop: "8px",
//             }}
//           >
//             {/* Playback slider */}
//             <div
//               style={{
//                 flex: 1,
//                 height: "6px",
//                 backgroundColor: "#e0e0e0",
//                 borderRadius: "3px",
//                 position: "relative",
//                 cursor: "pointer",
//               }}
//               onClick={(e) => {
//                 const rect = e.currentTarget.getBoundingClientRect();
//                 const clickPosition = (e.clientX - rect.left) / rect.width;
//                 const newSegment = Math.floor(
//                   clickPosition * (optimizedDataPoints.length - 1)
//                 );
//                 setCurrentSegmentIndex(newSegment);
//                 setAnimationProgress(clickPosition);

//                 // Calculate new position based on click
//                 if (optimizedDataPoints.length > 1) {
//                   const segmentIndex = Math.min(
//                     Math.floor(
//                       clickPosition * (optimizedDataPoints.length - 1)
//                     ),
//                     optimizedDataPoints.length - 2
//                   );
//                   const segmentProgress =
//                     clickPosition * (optimizedDataPoints.length - 1) -
//                     segmentIndex;

//                   const startPoint = optimizedDataPoints[segmentIndex];
//                   const endPoint = optimizedDataPoints[segmentIndex + 1];

//                   if (startPoint && endPoint) {
//                     const lat =
//                       startPoint.latitude +
//                       (endPoint.latitude - startPoint.latitude) *
//                         segmentProgress;
//                     const lng =
//                       startPoint.longitude +
//                       (endPoint.longitude - startPoint.longitude) *
//                         segmentProgress;
//                     const bearing = calculateBearing(startPoint, endPoint);

//                     setCarPosition({
//                       lat,
//                       lng,
//                       bearing,
//                       pointData: segmentProgress > 0.5 ? endPoint : startPoint,
//                     });

//                     // Center map on clicked position
//                     centerMapOnPosition(lat, lng);
//                   }
//                 }
//               }}
//             >
//               <div
//                 style={{
//                   width: `${animationProgress * 100}%`,
//                   height: "100%",
//                   backgroundColor: "#4CAF50",
//                   borderRadius: "3px",
//                   position: "relative",
//                 }}
//               >
//                 <div
//                   style={{
//                     position: "absolute",
//                     right: "-8px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     width: "16px",
//                     height: "16px",
//                     backgroundColor: "#4CAF50",
//                     borderRadius: "50%",
//                     boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
//                     border: "2px solid white",
//                   }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Status indicator */}
//         <div
//           style={{
//             marginBottom: "15px",
//             padding: "8px 12px",
//             backgroundColor: isAnimating ? "#e8f5e9" : "#f5f5f5",
//             borderRadius: "4px",
//             fontSize: "12px",
//             color: isAnimating ? "#2e7d32" : "#666",
//             fontWeight: "bold",
//             textAlign: "center",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "6px",
//           }}
//         >
//           {isAnimating ? (
//             <>
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="#2e7d32"
//                 stroke="none"
//               >
//                 <rect x="6" y="4" width="4" height="16" rx="1" />
//                 <rect x="14" y="4" width="4" height="16" rx="1" />
//               </svg>
//               PLAYING
//             </>
//           ) : (
//             <>
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="#666"
//                 stroke="none"
//               >
//                 <polygon points="5 3 19 12 5 21 5 3" />
//               </svg>
//               PAUSED
//             </>
//           )}
//         </div>

//         {/* Trip details */}
//         <div style={{ fontSize: "13px", color: "#666" }}>
//           <div
//             style={{
//               marginBottom: "5px",
//               display: "flex",
//               justifyContent: "space-between",
//             }}
//           >
//             <strong>Total Points:</strong>
//             <span>{optimizedDataPoints.length}</span>
//           </div>
//           <div
//             style={{
//               marginBottom: "5px",
//               display: "flex",
//               justifyContent: "space-between",
//             }}
//           >
//             <strong>Current Segment:</strong> {currentSegmentIndex + 1}/
//             {Math.max(optimizedDataPoints.length - 1, 1)}
//           </div>
//           {carPosition && (
//             <>
//               <div
//                 style={{
//                   marginBottom: "5px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <strong>Current Time:</strong> {carPosition.pointData.timestamp}
//               </div>
//               <div
//                 style={{
//                   marginBottom: "5px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <strong>Speed:</strong> {carPosition.pointData.speed || "N/A"}{" "}
//                 km/h
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <strong>Bearing:</strong> {Math.round(carPosition.bearing)}°
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       <Map
//         google={props.google}
//         zoom={zoom}
//         initialCenter={mapCenter}
//         center={mapCenter}
//         ref={mapRef}
//         gestureHandling="greedy"
//         disableDefaultUI={true}
//         style={{ width: "100%", height: "100vh" }}
//       >
//         {/* Draw the track polyline */}
//         {showTrack && polylinePath.length > 1 && (
//           <Polyline
//             path={polylinePath}
//             strokeColor="#FF0000"
//             strokeOpacity={0.8}
//             strokeWeight={3}
//           />
//         )}

//         {/* Animated Car Marker */}
//         {carPosition && (
//           <AnimatedCarMarker
//             map={mapRef.current?.map}
//             google={props.google}
//             position={{
//               lat: carPosition.lat,
//               lng: carPosition.lng,
//             }}
//             icon={carIcon}
//             rotation={carPosition.bearing || 0}
//             onClick={handleCarMarkerClick}
//           />
//         )}

//         {/* Info Window for selected point */}
//         <InfoWindow
//           position={infoWindowPosition}
//           visible={infoWindowVisible}
//           onClose={() => setInfoWindowVisible(false)}
//           options={{
//             disableAutoPan: false,
//             pixelOffset: new props.google.maps.Size(0, -40),
//             disableClose: true,
//             closeBoxMargin: "0",
//             closeBoxURL: "",
//             maxWidth: 400,
//           }}
//         >
//           <div
//             style={{
//               minWidth: "400px",
//               overflow: "hidden !important",
//               margin: "0px !important",
//               padding: "0px !important",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 padding: "10px 25px",
//                 borderBottom: "1px solid lightgray",
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <h2>VB 4285 </h2>
//                 <span
//                   style={{
//                     marginLeft: "16px",
//                     color: "gray",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Van
//                 </span>
//               </div>
//               <span style={{ fontWeight: "bold", color: "red" }}>
//                 {selectedPoint?.speed && selectedPoint?.speed > 0
//                   ? "Moving"
//                   : "Stationary"}
//               </span>
//             </div>

//             <div
//               style={{
//                 padding: "10px 25px",
//                 borderBottom: "0.5px solid lightgray",
//               }}
//             >
//               <div
//                 style={{
//                   marginTop: "10px",
//                   marginBottom: "5px",
//                   fontSize: "15px",
//                 }}
//               >
//                 <strong style={{ width: "110px" }}>Device ID:</strong>{" "}
//                 {selectedPoint?.id}
//               </div>
//               <div
//                 style={{
//                   marginBottom: "5px",
//                   fontSize: "15px",
//                 }}
//               >
//                 <strong style={{ width: "110px" }}>Coordinates:</strong>{" "}
//                 {selectedPoint?.latitude?.toFixed(6)},{" "}
//                 {selectedPoint?.longitude?.toFixed(6)}
//               </div>
//               <div
//                 style={{
//                   marginBottom: "5px",
//                   fontSize: "15px",
//                 }}
//               >
//                 <strong style={{ width: "110px" }}>Time:</strong>{" "}
//                 {selectedPoint?.timestamp}
//               </div>
//               <div
//                 style={{
//                   marginBottom: "5px",
//                   fontSize: "15px",
//                 }}
//               >
//                 <strong style={{ width: "110px" }}>Speed:</strong>{" "}
//                 {selectedPoint?.speed || 0} km/h
//               </div>
//               {selectedPoint?.bearing !== undefined && (
//                 <div
//                   style={{
//                     marginBottom: "15px",
//                     fontSize: "15px",
//                   }}
//                 >
//                   <strong style={{ width: "110px" }}>Bearing:</strong>{" "}
//                   {selectedPoint?.bearing}°
//                 </div>
//               )}
//             </div>

//             <div
//               style={{
//                 padding: "0px 25px",
//                 paddingBottom: "15px",
//                 paddingTop: "20px",
//                 display: "flex",
//                 overflowX: "auto",
//                 gap: "5px",
//                 borderBottom: "0.5px solid lightgray",
//                 scrollbarWidth: "none",
//                 msOverflowStyle: "none",
//               }}
//             >
//               <div
//                 style={{
//                   border: "0.5px solid lightgray",
//                   borderRadius: "5px",
//                   padding: "12px 0px",
//                   fontWeight: "400",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: "2px",
//                   minWidth: "170px",
//                   maxWidth: "170px",
//                   flexShrink: 0,
//                 }}
//               >
//                 <div style={{ color: "gray" }}>Vehicle Status</div>
//                 <div
//                   style={{
//                     color:
//                       selectedPoint?.speed && selectedPoint?.speed > 0
//                         ? "green"
//                         : "red",
//                   }}
//                 >
//                   {selectedPoint?.speed && selectedPoint?.speed > 0
//                     ? "Moving"
//                     : "Stopped"}
//                 </div>
//               </div>
//               <div
//                 style={{
//                   border: "0.5px solid lightgray",
//                   borderRadius: "5px",
//                   padding: "12px 0",
//                   fontWeight: "400",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: "2px",
//                   minWidth: "170px",
//                   maxWidth: "170px",
//                   flexShrink: 0,
//                 }}
//               >
//                 <div style={{ color: "gray" }}>Current Speed</div>
//                 <div style={{ color: "black" }}>
//                   {selectedPoint?.speed || 0} km/h
//                 </div>
//               </div>
//             </div>

//             <div
//               style={{
//                 padding: "15px 25px",
//                 paddingBottom: "15px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 gap: "5px",
//               }}
//             >
//               <button
//                 style={{
//                   minWidth: "170px",
//                   maxWidth: "170px",
//                   border: "none",
//                   outline: "none",
//                   backgroundColor: "lightgray",
//                   fontWeight: "600",
//                   color: "black",
//                   textAlign: "center",
//                   padding: "15px",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 ALL EVENTS
//               </button>
//               <button
//                 style={{
//                   minWidth: "170px",
//                   maxWidth: "170px",
//                   border: "none",
//                   outline: "none",
//                   backgroundColor: "lightgray",
//                   fontWeight: "600",
//                   color: "black",
//                   textAlign: "center",
//                   padding: "15px",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 TRIP
//               </button>
//             </div>
//           </div>
//         </InfoWindow>

//         {/* Custom zoom controls */}
//         <div
//           className="custom-zoom-control"
//           style={{
//             position: "absolute",
//             right: "10px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             display: "flex",
//             flexDirection: "column",
//             gap: "5px",
//           }}
//         >
//           <button
//             onClick={zoomIn}
//             className="zoom-button"
//             style={{
//               width: "40px",
//               height: "40px",
//               backgroundColor: "white",
//               border: "2px solid #ccc",
//               borderRadius: "4px",
//               cursor: "pointer",
//               fontSize: "18px",
//               fontWeight: "bold",
//             }}
//           >
//             +
//           </button>
//           <button
//             onClick={zoomOut}
//             className="zoom-button"
//             style={{
//               width: "40px",
//               height: "40px",
//               backgroundColor: "white",
//               border: "2px solid #ccc",
//               borderRadius: "4px",
//               cursor: "pointer",
//               fontSize: "18px",
//               fontWeight: "bold",
//             }}
//           >
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

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Map, GoogleApiWrapper, InfoWindow, Polyline } from "google-maps-react";
import { useDispatch, useSelector } from "react-redux";
import "./googleMap.css";
import carIcon from "../../../monitoring-assets/deviceLocationArrow.png";

import { dataPoints } from "./data.js";

// Custom Animated Car Marker Component (unchanged)
const AnimatedCarMarker = ({
  map,
  google,
  position,
  icon,
  rotation,
  onClick,
}) => {
  const markerRef = useRef(null);
  const divRef = useRef(null);

  useEffect(() => {
    if (!map || !google) return;

    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = "30px";
    div.style.height = "30px";
    div.style.transform = `rotate(${rotation}deg)`;
    div.style.transformOrigin = "center";
    div.style.transition = "transform 0.3s ease";
    div.style.zIndex = "1000";
    div.innerHTML = `<img src="${icon}" width="24" height="40" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);" />`;

    if (onClick) {
      div.style.cursor = "pointer";
      div.addEventListener("click", onClick);
    }

    const overlay = new google.maps.OverlayView();
    overlay.onAdd = function () {
      const panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(div);
    };

    overlay.draw = function () {
      const projection = this.getProjection();
      if (!projection) return;

      const point = projection.fromLatLngToDivPixel(
        new google.maps.LatLng(position.lat, position.lng)
      );

      if (point) {
        div.style.left = `${point.x - 15}px`;
        div.style.top = `${point.y - 15}px`;
      }
    };

    overlay.onRemove = function () {
      if (div.parentNode) {
        div.parentNode.removeChild(div);
      }
    };

    overlay.setMap(map);
    markerRef.current = overlay;
    divRef.current = div;

    return () => {
      overlay.setMap(null);
    };
  }, [map, google, icon, onClick]);

  // Update position and rotation smoothly
  useEffect(() => {
    if (divRef.current) {
      divRef.current.style.transform = `rotate(${rotation}deg)`;
    }
    if (markerRef.current) {
      markerRef.current.draw();
    }
  }, [position, rotation]);

  return null;
};

const GoogleMap = (props) => {
  const { selectedSingleDevice, vehicleHistoryData } = useSelector(
    (state) => state.monitoring
  );

  console.log("vehicleHistoryData", vehicleHistoryData);

  const dispatch = useDispatch();
  const [zoom, setZoom] = useState(12);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const [infoWindowVisible, setInfoWindowVisible] = useState(false);
  const [showTrack, setShowTrack] = useState(true);
  const [carPosition, setCarPosition] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(70000);
  const [markersInitialized, setMarkersInitialized] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [mapCenter, setMapCenter] = useState({ lat: 24.8607, lng: 67.0011 });
  const mapRef = useRef(null);

  // Use refs for animation state to avoid stale closures
  const animationRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const currentSegmentIndexRef = useRef(0);
  const animationProgressRef = useRef(0);
  const animationSpeedRef = useRef(70000);
  const startTimeRef = useRef(0);
  const segmentProgressRef = useRef(0);

  const markersRef = useRef([]);

  // Sort dataPoints by timestamp for proper track sequence
  const sortedDataPoints = useMemo(() => {
    return [...vehicleHistoryData].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  }, [vehicleHistoryData]);

  // Optimize points for large datasets (reduce points if > 3500)
  const optimizedDataPoints = useMemo(() => {
    if (sortedDataPoints.length <= 3500) {
      return sortedDataPoints;
    }

    // If more than 3500 points, skip points (show every 4th point)
    const reduced = [];
    for (let i = 0; i < sortedDataPoints.length; i += 4) {
      reduced.push(sortedDataPoints[i]);
    }

    // Always include the last point to complete the journey
    if (
      sortedDataPoints.length > 0 &&
      reduced[reduced.length - 1] !==
        sortedDataPoints[sortedDataPoints.length - 1]
    ) {
      reduced.push(sortedDataPoints[sortedDataPoints.length - 1]);
    }

    console.log(
      `Optimized ${sortedDataPoints.length} points to ${reduced.length} points`
    );
    return reduced;
  }, [sortedDataPoints]);

  // Create polyline path from optimized dataPoints
  const polylinePath = useMemo(() => {
    return optimizedDataPoints.map((point) => ({
      lat: point.latitude,
      lng: point.longitude,
    }));
  }, [optimizedDataPoints]);

  // Calculate bearing between two points for car rotation
  const calculateBearing = useCallback((start, end) => {
    const startLat = (start.latitude * Math.PI) / 180;
    const startLng = (start.longitude * Math.PI) / 180;
    const endLat = (end.latitude * Math.PI) / 180;
    const endLng = (end.longitude * Math.PI) / 180;

    const dLng = endLng - startLng;
    const y = Math.sin(dLng) * Math.cos(endLat);
    const x =
      Math.cos(startLat) * Math.sin(endLat) -
      Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

    const bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  }, []);

  // Function to center map on a specific position
  const centerMapOnPosition = useCallback((lat, lng) => {
    if (mapRef.current?.map) {
      mapRef.current.map.panTo({ lat, lng });
    }
  }, []);

  // Initialize static markers once
  const initializeMarkers = useCallback(() => {
    if (!mapRef.current?.map || !props.google || markersInitialized) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      if (marker.setMap) marker.setMap(null);
    });
    markersRef.current = [];

    // Determine marker skip rate based on total points
    let markerSkipRate = 3;
    if (optimizedDataPoints.length > 1000) {
      markerSkipRate = 6;
    } else if (optimizedDataPoints.length > 500) {
      markerSkipRate = 4;
    }

    // Create markers for GPS points (skip some for performance)
    optimizedDataPoints.forEach((point, index) => {
      if (index % markerSkipRate === 0) {
        const marker = new props.google.maps.Marker({
          position: { lat: point.latitude, lng: point.longitude },
          map: mapRef.current.map,
          icon: {
            path: props.google.maps.SymbolPath.CIRCLE,
            fillColor: point.speed && point.speed > 0 ? "#4285F4" : "#EA4335",
            fillOpacity: 0.7,
            strokeColor: "#FFFFFF",
            strokeWeight: 1,
            scale: 4,
          },
          title: `Point ${index + 1}: ${point.timestamp}`,
        });

        // Add click listener
        marker.addListener("click", () => {
          setSelectedPoint(point);
          setInfoWindowPosition({
            lat: point.latitude,
            lng: point.longitude,
          });
          setInfoWindowVisible(true);
        });

        markersRef.current.push(marker);
      }
    });

    setMarkersInitialized(true);
  }, [optimizedDataPoints, props.google, markersInitialized]);

  // Initialize car at starting position and center map
  useEffect(() => {
    if (optimizedDataPoints.length > 0 && !carPosition) {
      const firstPoint = optimizedDataPoints[0];
      setCarPosition({
        lat: firstPoint.latitude,
        lng: firstPoint.longitude,
        bearing: firstPoint.course || 0,
        pointData: firstPoint,
      });

      // Center map on first point
      setMapCenter({
        lat: firstPoint.latitude,
        lng: firstPoint.longitude,
      });

      // Also pan to first point after a short delay to ensure map is loaded
      setTimeout(() => {
        centerMapOnPosition(firstPoint.latitude, firstPoint.longitude);
      }, 500);
    }
  }, [optimizedDataPoints, carPosition, centerMapOnPosition]);

  // Initialize markers when map is ready
  useEffect(() => {
    if (mapRef.current?.map && props.google && !markersInitialized) {
      setTimeout(() => {
        initializeMarkers();
      }, 100);
    }
  }, [
    mapRef.current?.map,
    props.google,
    initializeMarkers,
    markersInitialized,
  ]);

  // Update refs when state changes
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    currentSegmentIndexRef.current = currentSegmentIndex;
  }, [currentSegmentIndex]);

  useEffect(() => {
    animationProgressRef.current = animationProgress;
  }, [animationProgress]);

  useEffect(() => {
    animationSpeedRef.current = animationSpeed;
  }, [animationSpeed]);

  // Smooth continuous animation function with proper pause/resume
  const animateCar = useCallback(() => {
    if (optimizedDataPoints.length <= 1) return;

    const totalSegments = optimizedDataPoints.length - 1;
    let currentSegment = currentSegmentIndexRef.current;
    let segmentProgress = segmentProgressRef.current;
    let startTime =
      performance.now() -
      segmentProgress * (animationSpeedRef.current / totalSegments);

    const animate = (currentTime) => {
      if (!isAnimatingRef.current) return;

      const elapsed = currentTime - startTime;
      const segmentDuration = animationSpeedRef.current / totalSegments;
      segmentProgress = Math.min(elapsed / segmentDuration, 1);

      // Current segment points
      const startPoint = optimizedDataPoints[currentSegment];
      const endPoint = optimizedDataPoints[currentSegment + 1];

      if (startPoint && endPoint) {
        // Smooth interpolation between points
        const lat =
          startPoint.latitude +
          (endPoint.latitude - startPoint.latitude) * segmentProgress;
        const lng =
          startPoint.longitude +
          (endPoint.longitude - startPoint.longitude) * segmentProgress;

        // Calculate bearing for smooth rotation
        const bearing = calculateBearing(startPoint, endPoint);

        // Update car position
        setCarPosition({
          lat,
          lng,
          bearing,
          pointData: segmentProgress > 0.5 ? endPoint : startPoint,
        });

        // Auto-center map on vehicle
        centerMapOnPosition(lat, lng);

        setCurrentSegmentIndex(currentSegment);
        setAnimationProgress(
          (currentSegment + segmentProgress) / totalSegments
        );

        // Update refs
        segmentProgressRef.current = segmentProgress;
      }

      // Move to next segment when current one completes
      if (segmentProgress >= 1) {
        currentSegment++;
        startTime = currentTime;
        segmentProgress = 0;
        segmentProgressRef.current = 0;

        // Check if animation is complete
        if (currentSegment >= totalSegments) {
          // Loop back to start
          currentSegment = 0;
          const firstPoint = optimizedDataPoints[0];
          setCarPosition({
            lat: firstPoint.latitude,
            lng: firstPoint.longitude,
            bearing: firstPoint.course || 0,
            pointData: firstPoint,
          });
          // Center on first point when looping
          centerMapOnPosition(firstPoint.latitude, firstPoint.longitude);
          setCurrentSegmentIndex(0);
          setAnimationProgress(0);
        } else {
          setCurrentSegmentIndex(currentSegment);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [optimizedDataPoints, calculateBearing, centerMapOnPosition]);

  // Start animation
  const startAnimation = useCallback(() => {
    if (optimizedDataPoints.length <= 1) return;
    setIsAnimating(true);
    // Don't reset segment index - resume from current position
  }, [optimizedDataPoints]);

  // Stop animation
  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Reset animation
  const resetAnimation = useCallback(() => {
    stopAnimation();
    setCurrentSegmentIndex(0);
    setAnimationProgress(0);
    segmentProgressRef.current = 0;
    if (optimizedDataPoints.length > 0) {
      const firstPoint = optimizedDataPoints[0];
      setCarPosition({
        lat: firstPoint.latitude,
        lng: firstPoint.longitude,
        bearing: firstPoint.course || 0,
        pointData: firstPoint,
      });
      // Center map on first point when resetting
      centerMapOnPosition(firstPoint.latitude, firstPoint.longitude);
    }
  }, [stopAnimation, optimizedDataPoints, centerMapOnPosition]);

  // Handle speed change - this will automatically adjust the ongoing animation
  const handleSpeedChange = useCallback((newSpeed) => {
    setAnimationSpeed(newSpeed);
    // No need to restart animation - the ref will be updated and used in next frame
  }, []);

  // Start/stop animation when isAnimating changes
  useEffect(() => {
    if (isAnimating) {
      animateCar();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, animateCar]);

  // Handle car marker click
  const handleCarMarkerClick = useCallback(() => {
    if (carPosition) {
      setSelectedPoint(carPosition.pointData);
      setInfoWindowPosition({
        lat: carPosition.lat,
        lng: carPosition.lng,
      });
      setInfoWindowVisible(true);
    }
  }, [carPosition]);

  // Handle slider click to jump to specific position
  const handleSliderClick = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const totalSegments = optimizedDataPoints.length - 1;
      const newSegment = Math.min(
        Math.floor(clickPosition * totalSegments),
        totalSegments - 1
      );
      const segmentProgress = clickPosition * totalSegments - newSegment;

      const startPoint = optimizedDataPoints[newSegment];
      const endPoint = optimizedDataPoints[newSegment + 1];

      if (startPoint && endPoint) {
        const lat =
          startPoint.latitude +
          (endPoint.latitude - startPoint.latitude) * segmentProgress;
        const lng =
          startPoint.longitude +
          (endPoint.longitude - startPoint.longitude) * segmentProgress;
        const bearing = calculateBearing(startPoint, endPoint);

        setCarPosition({
          lat,
          lng,
          bearing,
          pointData: segmentProgress > 0.5 ? endPoint : startPoint,
        });

        // Update animation state
        setCurrentSegmentIndex(newSegment);
        setAnimationProgress(clickPosition);
        segmentProgressRef.current = segmentProgress;

        // Center map on clicked position
        centerMapOnPosition(lat, lng);
      }
    },
    [optimizedDataPoints, calculateBearing, centerMapOnPosition]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Clean up markers
      markersRef.current.forEach((marker) => {
        if (marker.setMap) marker.setMap(null);
      });
    };
  }, []);

  const zoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 1, 20));
  const zoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 1, 1));

  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

  return (
    <div>
      {/* Animation Control Panel */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "10px",
          zIndex: 1000,
          background: "white",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          minWidth: "320px",
        }}
      >
        <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
          Playback Controls
        </h4>

        {/* Data optimization notice */}
        {sortedDataPoints.length > 3500 && (
          <div
            style={{
              marginBottom: "10px",
              padding: "8px",
              backgroundColor: "#fff3cd",
              borderRadius: "4px",
              fontSize: "11px",
              color: "#856404",
              border: "1px solid #ffeaa7",
            }}
          >
            ⚡ Optimized: {sortedDataPoints.length} →{" "}
            {optimizedDataPoints.length} points
          </div>
        )}

        {/* Video-style playback controls */}
        <div
          style={{
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {/* Play/Pause Button */}
          <button
            onClick={isAnimating ? stopAnimation : startAnimation}
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: isAnimating ? "#ff9800" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transition: "all 0.2s ease",
            }}
            title={isAnimating ? "Pause" : "Play"}
          >
            {isAnimating ? (
              // Pause icon
              <div style={{ display: "flex", gap: "4px" }}>
                <div
                  style={{
                    width: "4px",
                    height: "14px",
                    backgroundColor: "white",
                    borderRadius: "2px",
                  }}
                ></div>
                <div
                  style={{
                    width: "4px",
                    height: "14px",
                    backgroundColor: "white",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
            ) : (
              // Play icon
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid white",
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  marginLeft: "2px",
                }}
              ></div>
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={resetAnimation}
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#607d8b",
              color: "white",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transition: "all 0.2s ease",
            }}
            title="Reset"
          >
            {/* Reset/Restart icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>

          {/* Speed Control Dropdown */}
          <div style={{ marginLeft: "auto" }}>
            <select
              value={animationSpeed}
              onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
              style={{
                padding: "8px 12px",
                borderRadius: "20px",
                border: "1px solid #ddd",
                backgroundColor: "#f5f5f5",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                outline: "none",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                backgroundSize: "12px",
                paddingRight: "30px",
              }}
            >
              <option value={140000}>0.5x</option>
              <option value={112000}>0.75x</option>
              <option value={70000}>1x</option>
              <option value={35000}>2x</option>
              <option value={23333}>3x</option>
              <option value={17500}>4x</option>
            </select>
          </div>
        </div>

        {/* Video-style playback slider */}
        <div style={{ marginBottom: "20px", marginTop: "15px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
              marginTop: "8px",
            }}
          >
            {/* Playback slider */}
            <div
              style={{
                flex: 1,
                height: "6px",
                backgroundColor: "#e0e0e0",
                borderRadius: "3px",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={handleSliderClick}
            >
              <div
                style={{
                  width: `${animationProgress * 100}%`,
                  height: "100%",
                  backgroundColor: "#4CAF50",
                  borderRadius: "3px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: "-8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#4CAF50",
                    borderRadius: "50%",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    border: "2px solid white",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div
          style={{
            marginBottom: "15px",
            padding: "8px 12px",
            backgroundColor: isAnimating ? "#e8f5e9" : "#f5f5f5",
            borderRadius: "4px",
            fontSize: "12px",
            color: isAnimating ? "#2e7d32" : "#666",
            fontWeight: "bold",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          {isAnimating ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="#2e7d32"
                stroke="none"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              PLAYING
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="#666"
                stroke="none"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              PAUSED
            </>
          )}
        </div>

        {/* Trip details */}
        <div style={{ fontSize: "13px", color: "#666" }}>
          <div
            style={{
              marginBottom: "5px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <strong>Total Points:</strong>
            <span>{optimizedDataPoints.length}</span>
          </div>
          <div
            style={{
              marginBottom: "5px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <strong>Current Segment:</strong> {currentSegmentIndex + 1}/
            {Math.max(optimizedDataPoints.length - 1, 1)}
          </div>
          {carPosition && (
            <>
              <div
                style={{
                  marginBottom: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong>Current Time:</strong> {carPosition.pointData.timestamp}
              </div>
              <div
                style={{
                  marginBottom: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong>Speed:</strong> {carPosition.pointData.speed || "N/A"}{" "}
                km/h
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong>Bearing:</strong> {Math.round(carPosition.bearing)}°
              </div>
            </>
          )}
        </div>
      </div>

      {/* Rest of your Map component remains the same */}
      <Map
        google={props.google}
        zoom={zoom}
        initialCenter={mapCenter}
        center={mapCenter}
        ref={mapRef}
        gestureHandling="greedy"
        disableDefaultUI={true}
        style={{ width: "100%", height: "100vh" }}
      >
        {/* Draw the track polyline */}
        {showTrack && polylinePath.length > 1 && (
          <Polyline
            path={polylinePath}
            strokeColor="#FF0000"
            strokeOpacity={0.8}
            strokeWeight={3}
          />
        )}

        {/* Animated Car Marker */}
        {carPosition && (
          <AnimatedCarMarker
            map={mapRef.current?.map}
            google={props.google}
            position={{
              lat: carPosition.lat,
              lng: carPosition.lng,
            }}
            icon={carIcon}
            rotation={carPosition.bearing || 0}
            onClick={handleCarMarkerClick}
          />
        )}

        {/* Info Window for selected point */}
        <InfoWindow
          position={infoWindowPosition}
          visible={infoWindowVisible}
          onClose={() => setInfoWindowVisible(false)}
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
            {/* Your existing InfoWindow content */}
          </div>
        </InfoWindow>

        {/* Custom zoom controls */}
        <div
          className="custom-zoom-control"
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <button
            onClick={zoomIn}
            className="zoom-button"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "white",
              border: "2px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            +
          </button>
          <button
            onClick={zoomOut}
            className="zoom-button"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "white",
              border: "2px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            -
          </button>
        </div>
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(GoogleMap);
