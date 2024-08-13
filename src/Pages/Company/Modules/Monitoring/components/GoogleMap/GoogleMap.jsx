// import React, { useEffect, useRef, useState } from "react";
// import {
//   GoogleMap,
//   LoadScript,
//   Marker,
//   Polyline,
// } from "@react-google-maps/api";
// import { useDispatch, useSelector } from "react-redux";
// import "./googleMap.css";

// const GoogleMapComponent = () => {
//   const dispatch = useDispatch();
//   const {
//     expandedDevice,
//     devices,
//   } = useSelector((state) => state.monitoring);

//   const [zoom, setZoom] = useState(12);
//   const mapRef = useRef(null);

//   const zoomToMarker = (latLng) => {
//     if (mapRef.current) {
//       const map = mapRef.current;
//       map.setZoom(16);
//       map.panTo(latLng);
//       map.setCenter(latLng);
//     }
//   };

//   const zoomIn = () => {
//     if (mapRef.current) {
//       setZoom(zoom + 1);
//     }
//   };

//   const zoomOut = () => {
//     if (mapRef.current) {
//       setZoom(zoom - 1);
//     }
//   };

//   useEffect(() => {
//     if (expandedDevice !== null) {
//       zoomToMarker(expandedDevice.position);
//     }
//   }, [expandedDevice]);

//   const rotateImage = (url, rotation, callback) => {
//     const img = new Image();
//     img.crossOrigin = "Anonymous";
//     img.src = url;
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");
//       const size = Math.max(img.width, img.height);
//       canvas.width = size;
//       canvas.height = size;
//       context.translate(size / 2, size / 2);
//       context.rotate((rotation * Math.PI) / 180);
//       context.drawImage(img, -img.width / 2, -img.height / 2);
//       callback(canvas.toDataURL());
//     };
//   };

//   const containerStyle = {
//     width: '100%',
//     height: '100%'
//   };

//   const center = {
//     lat: 24.8607,
//     lng: 67.0011
//   };

//   return (
//     <LoadScript googleMapsApiKey="AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34">
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={zoom}
//         onLoad={map => mapRef.current = map}
//         options={{ disableDefaultUI: true }}
//       >


//         {devices.map((marker) =>
//           marker.items
//             .filter((item) => item.checked) // Filter items where checked is true
//             .map((item) => {
//               // console.log("item", item);
//               const icon = {
//                 url: `${item.server.url}/${item.icon.path}`,
//                 scaledSize: new window.google.maps.Size(22, 40),

//               };

//               return (
//                 <div key={item.id} style={{ position: "relative" }}>
//                   <Marker
//                     name={item.title}
//                     position={{
//                       lat: parseFloat(item.lat),
//                       lng: parseFloat(item.lng),
//                     }}
//                     icon={icon}
//                   />
//                 </div>
//               );
//             })
//         )}

//         {expandedDevice !== null && (
//           <Polyline
//             path={expandedDevice.tail.map(({ lat, lng }) => ({
//               lat: parseFloat(lat),
//               lng: parseFloat(lng),
//             }))}
//             options={{
//               strokeColor: "blue",
//               strokeOpacity: 1.0,
//               strokeWeight: 10,
//             }}
//           />
//         )}

//         <div className="custom-zoom-control">
//           <button onClick={zoomIn} className="zoom-button">+</button>
//           <button onClick={zoomOut} className="zoom-button">-</button>
//         </div>
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default GoogleMapComponent;




// ----------------------------------------------------






// Leaflet Maps-------------------------------


// import React, { useEffect, useRef, useState } from "react";
// import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-draw/dist/leaflet.draw.css";
// import L from "leaflet";
// import { useDispatch, useSelector } from "react-redux";

// // Utility function to create a rotated icon
// const createRotatedIcon = (url, rotation) => {
//   const icon = L.icon({
//     iconUrl: url,
//     iconSize: [25, 35],
//     className: "rotated-icon",
//     rotation: rotation
//   });

//   const rotatedIcon = L.divIcon({
//     html: `<div style="transform: rotate(${rotation}deg);">${icon.createIcon().outerHTML}</div>`,
//     className: "leaflet-marker-icon",
//     iconSize: icon.options.iconSize,
//   });

//   return rotatedIcon;
// };

// const ZoomToMarker = ({ position }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (position) {
//       map.setView(position, 12);
//     }
//   }, [position, map]);
//   return null;
// };

// const LeafletMapComponent = () => {
//   const dispatch = useDispatch();
//   const { expandedDevice, devices } = useSelector((state) => state.monitoring);

//   const [zoom, setZoom] = useState(12);
//   const mapRef = useRef(null);

//   const zoomToMarker = (latLng) => {
//     if (mapRef.current) {
//       const map = mapRef.current;
//       map.setView(latLng, 16);
//     }
//   };

//   const zoomIn = () => {
//     if (mapRef.current) {
//       mapRef.current.setZoom(mapRef.current.getZoom() + 1);
//     }
//   };

//   const zoomOut = () => {
//     if (mapRef.current) {
//       mapRef.current.setZoom(mapRef.current.getZoom() - 1);
//     }
//   };

//   useEffect(() => {
//     if (expandedDevice !== null) {
//       zoomToMarker(expandedDevice.position);
//     }
//   }, [expandedDevice]);

//   const center = [24.8607, 67.0011];

//   return (

//     <MapContainer
//       style={{ height: "92.5vh", width: "100%", marginLeft: "40px" }}
//       center={[24.8607, 67.0011]}
//       zoom={13}
//       scrollWheelZoom={true}
//       ref={mapRef}
//       whenCreated={(mapInstance) => {
//         mapRef.current = mapInstance;
//       }}
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       {devices.map((marker) =>
//         marker.items
//           .filter((item) => item.checked) // Filter items where checked is true
//           .map((item) => {
//             const icon = createRotatedIcon(`${item.server.url}/${item.icon.path}`, item.course || 0);
//             return (
//               <Marker
//                 key={item.id}
//                 position={[parseFloat(item.lat), parseFloat(item.lng)]}
//                 icon={icon}
//               />
//             );
//           })
//       )}
//     </MapContainer>

//   );
// };

// export default LeafletMapComponent;













// ---------------------------------------------------















import { useEffect, useRef, useState } from "react";
import {
  Map,
  Marker,
  GoogleApiWrapper,
  Polyline,
} from "google-maps-react";
import { useDispatch, useSelector } from "react-redux";
import "./googleMap.css";



const GoogleMap = (props) => {
  const dispatch = useDispatch();
  const {
    expandedDevice,
    devices,
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

