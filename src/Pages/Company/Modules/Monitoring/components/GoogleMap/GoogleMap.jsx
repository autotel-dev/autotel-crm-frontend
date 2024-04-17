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
import { useSelector } from "react-redux";
import "./googleMap.css";

const GoogleMap = (props) => {
  const { serverDevices, selectedDevices, expandedDevice, devices } =
    useSelector((state) => state.monitoring);
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

  // const calculateBearing = (pointA, pointB) => {
  //   const lat1 = parseFloat(pointA.lat);
  //   const lon1 = parseFloat(pointA.lng);
  //   const lat2 = parseFloat(pointB.lat);
  //   const lon2 = parseFloat(pointB.lng);

  //   const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  //   const x =
  //     Math.cos(lat1) * Math.sin(lat2) -
  //     Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  //   let brng = Math.atan2(y, x);
  //   brng = (brng * 180) / Math.PI;
  //   brng = (brng + 360) % 360;

  //   return brng;
  // };

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
      zoomToMarker(expandedDevice);
    }
  }, [expandedDevice]);
  const [createdMarkers, setCreatedMarkers] = useState(); // Array to store references to created markers

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

  useEffect(() => {
    // Array to store references to created markers
    const createdMarkers = [];

    // Loop through devices and their items
    devices?.forEach((marker) => {
      marker.items.forEach((item) => {
        // Check if item is checked
        if (item.checked) {
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
      createdMarkers.forEach(({ markerInstance, item, id }) => {
        // Check if the item is unchecked
        if (id == item.id) {
          markerInstance.setMap(null); // Remove marker from the map
        }
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
      {/* {selectedDevices.map((marker) => {
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
      })} */}

      {/* {devices.map((marker) =>
        marker.items
          .filter((item) => item.checked) // Filter items where checked is true
          .map((item) => {
            // console.log("item", item);
            const icon = {
              url: `${item.server.url}/${item.icon.path}`,
              scaledSize: new window.google.maps.Size(22, 40),
              rotation: item.course, // Apply rotation directly to the icon if supported
            };

            return (
              <Marker
                key={item.id} // Use item id as key
                name={item.title}
                position={{
                  lat: parseFloat(item.lat),
                  lng: parseFloat(item.lng),
                }}
                icon={icon}
              />
            );
          })
      )} */}

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
