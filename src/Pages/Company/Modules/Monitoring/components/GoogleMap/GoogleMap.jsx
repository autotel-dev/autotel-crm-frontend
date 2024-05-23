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
//     // console.log("UseEffect Called");
//     // console.log("ExpandedDevice", expandedDevice);
//     if (expandedDevice !== null) {
//       zoomToMarker(expandedDevice);
//       // console.log("ExpandedDevice", expandedDevice);
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
//     // console.log("markerRotations", markerRotations);
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
import {
  Map,
  Marker,
  GoogleApiWrapper,
  Circle,
  Polyline,
} from "google-maps-react";
import { useDispatch, useSelector } from "react-redux";
import "./googleMap.css";
import { itemsName } from "../../../../../../Data/Forms/FormsLayout/FormWizardData";
import { setItem } from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";

const GoogleMap = (props) => {
  const dispatch = useDispatch();
  const {
    serverDevices,
    selectedDevices,
    expandedDevice,
    devices,
    item,
    devicesDetailData,
  } = useSelector((state) => state.monitoring);

  const [rotation, setRotation] = useState(-270);
  const [zoom, setZoom] = useState(12); // State to manage zoom level
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

  const zoomIn = () => {
    if (mapRef.current) {
      setZoom(zoom + 1); // Increase zoom level by 1
    }
  };

  // Function to handle zoom out
  const zoomOut = () => {
    if (mapRef.current) {
      setZoom(zoom - 1); // Decrease zoom level by 1
    }
  };
  useEffect(() => {
    if (expandedDevice !== null) {
      zoomToMarker(expandedDevice.position);
    }
  }, [expandedDevice]);

  useEffect(() => {
    // Array to store references to created markers
    const createdMarkers = [];

    // Loop through devices and their items
    devices?.forEach((marker) => {
      marker.items.forEach((item) => {
        // Check if item is checked
        if (item.checked) {
          // Create marker only if item is checked
          const iconUrl = `${item.server.url}/${item.icon.path}`;
          const img = new Image();
          img.crossOrigin = "Anonymous"; // Set crossOrigin attribute on the image
          img.src = iconUrl;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            // Calculate canvas dimensions to accommodate rotated image
            const canvasWidth = Math.max(img.width, img.height);
            const canvasHeight = canvasWidth;

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Rotate and draw image
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate((item.course * Math.PI) / 180);
            context.drawImage(
              img,
              -img.width / 2,
              -img.height / 2,
              img.width,
              img.height
            );

            // Convert canvas to data URL
            const rotatedIconUrl = canvas.toDataURL();

            // Create the marker
            const markerInstance = new window.google.maps.Marker({
              position: {
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lng),
              },
              icon: {
                url: rotatedIconUrl,
                scaledSize: new window.google.maps.Size(
                  canvasWidth,
                  canvasHeight
                ),
              },
              map: mapRef.current.map,
            });

            // Create info window
            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div>
              <h3>Device Info</h3>
              <br />
              <p>
                <span style={{ fontWeight: "bold" }}>Device ID: </span>
                <span> ${item.id}</span>
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}>Device Name: </span>
                <span>${item.name}</span>
              </p>
              <p>
              <span style={{ fontWeight: "bold" }}>LatLng: </span>
              <a href="https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}" target="_blank">${item.lat},${item.lng}</a>
            </p>
            </div>`, // You can customize this content as needed
            });

            // Open info window when marker is clicked
            markerInstance.addListener("click", () => {
              infoWindow.open(mapRef.current.map, markerInstance);
            });

            // Store the marker instance and item in createdMarkers
            createdMarkers.push({ markerInstance, item, id: item.id });
          };
        }
      });
    });

    // Clean up: Remove markers for unchecked items
    return () => {
      // console.log("Cleaning up markers...");
      createdMarkers.forEach(({ markerInstance, markerItem, id }) => {
        // If item is unchecked, remove its corresponding marker from the map
        markerInstance.setMap(null);
      });
    };
  }, [props.google, devices]);

  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

  return (
    <Map
      google={props.google}
      zoom={zoom}
      initialCenter={{ lat: 24.8607, lng: 67.0011 }}
      disableDefaultUI={true} // Enable default UI controls
      ref={mapRef}
    >
      {expandedDevice !== null && (
        <Polyline
          path={expandedDevice.tail.map(({ lat, lng }) => ({
            lat: parseFloat(lat),
            lng: parseFloat(lng),
          }))}
          options={{
            strokeColor: "blue",
            strokeOpacity: 1.0,
            strokeWeight: 10,
          }}
        />
      )}
      {/* Custom Zoom Control */}
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

// ---------------------------------------------------------------

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(GoogleMap);

// ------------------------------------------------------------

// Item.course value

// if (item.course < 90) {
//   context.rotate((item.course * Math.PI) / 90);
// } else if (item.course < 180) {
//   context.rotate((item.course * Math.PI) / -360);
// } else if (item.course < 270) {
//   context.rotate((item.course * Math.PI) / -360);
// } else {
//   context.rotate((item.course * Math.PI) / 360);
// }

{
  /* Render tail for each item */
}

{
  /* {devices?.map((marker) =>
        marker.items.map((item) => (
          <Polyline
            path={item.tail.map(({ lat, lng }) => ({
              lat: parseFloat(lat),
              lng: parseFloat(lng),
            }))}
            options={{
              strokeColor: "blue",
              strokeOpacity: 1.0,
              strokeWeight: 5,
            }}
          />
        ))
      )} */
}

// For only zoomed device below code

{
  /* {expandedDevice !== null && (
        <Polyline
          path={expandedDevice.tail.map(({ lat, lng }) => ({
            lat: parseFloat(lat),
            lng: parseFloat(lng),
          }))}
          options={{
            strokeColor: "blue",
            strokeOpacity: 1.0,
            strokeWeight: 5,
          }}
        />
      )} */
}

{
  /* {devices.map((marker) =>
        marker.items
          .filter((item) => item.checked) // Filter items where checked is true
          .map((item) => {
            // console.log("item", item);
            const icon = {
              url: `${item.server.url}/${item.icon.path}`,
              scaledSize: new window.google.maps.Size(22, 40),
            };

            return (
              <div key={item.id} style={{ position: "relative" }}>
                <Marker
                  name={item.title}
                  position={{
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lng),
                  }}
                  icon={icon}
                />
              </div>
            );
          })
      )} */
}

{
  /* {selectedDevices.map((marker) => {
        const icon = {
          url: `${marker.server.url}/${marker.icon.path}`,
          scaledSize: new window.google.maps.Size(22, 40),
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
            // rotation={170}
            style={{
              transform: "rotate(45deg)",
            }}
          />
        );
      })} */
} // using instead of devices when we use alternate approach

// useEffect(() => {
//   const tempMarkers = [];
//   devices.forEach((marker) => {
//     marker.items.forEach((item) => {
//       // Check if item is checked
//       if (item.checked) {
//         const iconUrl = `${item.server.url}/${item.icon.path}`;
//         const img = new Image();
//         img.crossOrigin = "Anonymous"; // Set crossOrigin attribute on the image
//         img.src = iconUrl;

//         img.onload = () => {
//           const canvas = document.createElement("canvas");
//           const context = canvas.getContext("2d");

//           // Calculate canvas dimensions to accommodate rotated image
//           const canvasWidth = Math.max(img.width, img.height); // Set canvas width to the larger dimension
//           const canvasHeight = canvasWidth; // Set canvas height to match canvasWidth for square canvas

//           canvas.width = canvasWidth;
//           canvas.height = canvasHeight;

//           // Clear canvas
//           context.clearRect(0, 0, canvas.width, canvas.height);

//           // Rotate and draw image
//           context.translate(canvas.width / 2, canvas.height / 2);
//           context.rotate((item.course * Math.PI) / 180); // Convert degrees to radians
//           context.drawImage(
//             img,
//             -img.width / 2,
//             -img.height / 2,
//             img.width,
//             img.height
//           );

//           // Convert canvas to data URL
//           const rotatedIconUrl = canvas.toDataURL();

//           // Create the marker
//           const markerInstance = new window.google.maps.Marker({
//             position: {
//               lat: parseFloat(item.lat),
//               lng: parseFloat(item.lng),
//             },
//             icon: {
//               url: rotatedIconUrl,
//               scaledSize: new window.google.maps.Size(
//                 canvasWidth,
//                 canvasHeight
//               ), // Use canvas dimensions
//             },
//             map: mapRef.current.map,
//           });

//           // Create info window
//           const infoWindow = new window.google.maps.InfoWindow({
//             content: `<div>
//           <h3>Device Info</h3>
//           <br />
//           <p>
//             <span style={{ fontWeight: "bold" }}>Device ID: </span>
//             <span> ${item.id}</span>
//           </p>
//           <p>
//             <span style={{ fontWeight: "bold" }}>Alert: </span>
//             <span>${item.name}</span>
//           </p>
//           <p>
//             <span style={{ fontWeight: "bold" }}>Latitude: </span>
//             <span> ${item.lat}</span>
//           </p>
//           <p>
//             <span style={{ fontWeight: "bold" }}>Longitude: </span>
//             <span> ${item.lng}</span>
//           </p>

//         </div>`, // You can customize this content as needed
//           });

//           // Open info window when marker is clicked
//           markerInstance.addListener("click", () => {
//             infoWindow.open(mapRef.current.map, markerInstance);
//           });

//           // Store the marker instance and item in createdMarkers
//           createdMarkers?.map((marker) => {
//             if (marker.id !== item.id) {
//               tempMarkers.push({
//                 markerInstance,
//                 checked: true,
//                 id: item.id,
//               });
//               setCreatedMarkers(tempMarkers);
//             }
//           });

//           // return createdMarkers;
//         };
//       } else {
//         // Remove the marker from the map if item.checked is false
//         tempMarkers?.map((marker) => {
//           if (marker.id == item.id) {
//             return {
//               ...marker,
//               checked: false,
//             };
//           }
//         });
//         setCreatedMarkers(tempMarkers);
//       }
//     });
//   });

//   // Clean up: Remove all markers not corresponding to checked items
//   return () => {
//     createdMarkers?.forEach(({ markerInstance, checked, id }) => {
//       if (!checked) {
//         markerInstance.setMap(null);
//       }
//     });
//   };
// }, [props.google, devices, createdMarkers]);

// marker running animation

// useEffect(() => {
//   const animateMarkers = () => {
//     devices.forEach((device) => {
//       device.items.forEach((item) => {
//         const path = item.tail;
//         console.log("path", { name: item.name, tail: item.tail });
//         if (path.length == 0) return; // Skip empty paths
//         let index = 0;

//         // const animateMarker = () => {
//         const currentPosition = path[index];
//         const nextPosition = path[index + 1];

//         if (!currentPosition || !nextPosition) return;

//         const duration = 1000; // Adjust duration as needed
//         const framesPerSecond = 30;
//         const distanceLat =
//           (nextPosition.lat - currentPosition.lat) /
//           ((duration / 1000) * framesPerSecond);
//         const distanceLng =
//           (nextPosition.lng - currentPosition.lng) /
//           ((duration / 1000) * framesPerSecond);

//         let currentLat = currentPosition.lat;
//         let currentLng = currentPosition.lng;

//         const moveMarker = () => {
//           currentLat += distanceLat;
//           currentLng += distanceLng;
//           const newPosition = { lat: currentLat, lng: currentLng };

//           // Update the position of the marker
//           if (mapRef.current) {
//             const marker = mapRef.current.map.markers[index];
//             marker.setPosition(newPosition);
//           }

//           // Update the position in redux state if needed
//           device.position = newPosition;

//           // Move to the next position or end the animation if reached the end of the path
//           if (currentPosition === nextPosition) {
//             index++;
//             if (index < path.length - 1) {
//               setTimeout(moveMarker, 1000 / framesPerSecond);
//             }
//           }
//           // };

//           // Start the animation
//           moveMarker();
//         };

//         // // // Start the animation for each device item
//         // animateMarker();
//       });
//     });
//   };

//   animateMarkers();
// }, [devices]);

// const [createdMarkers, setCreatedMarkers] = useState([]);

// Render markers with rotation

// const [markerPosition, setMarkerPosition] = useState(null);
// // Function to update marker position based on polyline's tail
// useEffect(() => {
//   if (expandedDevice !== null) {
//     const tail = expandedDevice.tail;
//     if (tail.length > 0) {
//       const lastPoint = tail[tail.length - 1];
//       setMarkerPosition({
//         lat: parseFloat(lastPoint.lat),
//         lng: parseFloat(lastPoint.lng),
//       });
//     }
//   }
// }, [expandedDevice]);
