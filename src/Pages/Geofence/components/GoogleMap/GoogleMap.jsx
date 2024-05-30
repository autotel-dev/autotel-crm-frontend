

// import { useEffect, useRef, useState, useCallback } from "react";
// import { Map, GoogleApiWrapper, Circle, Rectangle, Polygon } from "google-maps-react";
// import { useDispatch, useSelector } from "react-redux";
// import "./googleMap.css";
// import { setCircle, setPolygon, setRectangle } from "../../../../ReaduxToolkit/Reducer/GeofenceSlice";

// const GoogleMap = (props) => {
//   const { type } = useSelector((state) => state.geofence);
//   const dispatch = useDispatch();
//   const [rotation, setRotation] = useState(-270);
//   const [zoom, setZoom] = useState(12); // State to manage zoom level
//   const mapRef = useRef(null);
// const circleRef = useRef(null);

// const [circle, setCircle] = useState({
//   center: { lat: 24.8607, lng: 67.0011 },
//   radius: 1000, // Initial radius in meters
// });

//   const [rectangle, setRectangle] = useState({
//     bounds: {
//       north: 24.8707,
//       south: 24.8507,
//       east: 67.0211,
//       west: 67.0011,
//     },
//   });

//   // Polygon state with initial coordinates
//   const [polygon, setPolygon] = useState([
//     { lat: 24.8607, lng: 67.0011 },
//     { lat: 24.8617, lng: 67.0021 },
//     { lat: 24.8627, lng: 67.0031 },
//     { lat: 24.8637, lng: 67.0041 },
//   ]);

//   const zoomIn = () => {
//     setZoom((prevZoom) => prevZoom + 1); // Increase zoom level by 1
//   };

//   const zoomOut = () => {
//     setZoom((prevZoom) => prevZoom - 1); // Decrease zoom level by 1
//   };

//   const handleCircleChanged = () => {
//     if (circleRef.current) {
//       const circleInstance = circleRef.current.circle;
//       const newCenter = {
//         lat: circleInstance.getCenter().lat(),
//         lng: circleInstance.getCenter().lng(),
//       };
//       const newRadius = circleInstance.getRadius();
//       // dispatch(setCircle({ center: newCenter, radius: newRadius }));
//       setCircle({ center: newCenter, radius: newRadius });
//       console.log("Circle center updated:", newCenter);
//       console.log("Circle radius updated:", newRadius);
//     }
//   };

//   const rectangleRef = useRef(null);
//   const handleRectangleChanged = useCallback(() => {
//     if (rectangleRef.current) {
//       const rectangleInstance = rectangleRef.current.rectangle;
//       const newBounds = rectangleInstance.getBounds().toJSON();
//       // dispatch(setRectangle({ bounds: newBounds }))
//       setRectangle({ bounds: newBounds });
//       console.log("Rectangle bounds updated:", newBounds);
//     }
//   }, []);

//   const polygonRef = useRef(null);
//   // const handlePolygonEdit = useCallback(() => {
//   //   if (polygonRef.current) {
//   //     const polygonInstance = polygonRef.current.getPath ? polygonRef.current.getPath() : polygonRef.current.getPolygon().getPath();
//   //     const newPath = polygonInstance.getArray().map(latlng => ({
//   //       lat: latlng.lat(),
//   //       lng: latlng.lng(),
//   //     }));
//   //     dispatch(setPolygon(newPath))
//   //     // setPolygon(newPath);
//   //     console.log("Polygon path updated:", newPath);
//   //   }
//   // }, []);

//   const handlePolygonEdit = useCallback(() => {
//     if (polygonRef.current && polygonRef.current.polygon) {
//       const polygonInstance = polygonRef.current.polygon;
//       const newPath = polygonInstance.getPath().getArray().map(latlng => ({
//         lat: latlng.lat(),
//         lng: latlng.lng(),
//       }));
//       // dispatch(setPolygon(newPath));
//       setPolygon(newPath)
//       console.log("Polygon path updated:", newPath);
//     }
//   }, []);

//   if (!props.google) {
//     return <div>Error: Google Maps API failed to load.</div>;
//   }

//   return (
//     <Map
//       google={props.google}
//       zoom={zoom}
//       initialCenter={{ lat: 24.8607, lng: 67.0011 }}
//       disableDefaultUI={true} // Disable default UI controls
//       ref={mapRef}
//     >
//       {/* Circular Geofence */}
//       {type == "CIRCLE" &&
// <Circle
//   ref={circleRef}
//   center={circle.center}
//   radius={circle.radius}
//   editable={true}
//   draggable={true}
//   onCenterChanged={handleCircleChanged}
//   onRadiusChanged={handleCircleChanged}
//   // onClick={handleCircleChanged}
//   options={{
//     strokeColor: "black",
//     strokeOpacity: 0.8,
//     strokeWeight: 2,
//     fillColor: "black",
//     fillOpacity: 0.35,
//   }}
// />


//       }


//       {/* Rectangular Geofence */}
// {type == "RECTANGLE" && <Rectangle
//   ref={rectangleRef}
//   bounds={rectangle.bounds}
//   editable={true}
//   draggable={true}
//   onBoundsChanged={handleRectangleChanged}
//   onClick={handleRectangleChanged}
//   options={{
//     strokeColor: "red",
//     strokeOpacity: 0.8,
//     strokeWeight: 2,
//     fillColor: "red",
//     fillOpacity: 0.35,
//   }}
// />}



//       {/* Polygon Geofence */}
// {type == "POLYGON" && <Polygon
//   ref={polygonRef}
//   paths={polygon}
//   editable={true}
//   draggable={true}
//   onMouseUp={handlePolygonEdit}  // Triggers when editing is done
//   options={{
//     strokeColor: "blue",
//     strokeOpacity: 0.8,
//     strokeWeight: 2,
//     fillColor: "blue",
//     fillOpacity: 0.35,
//   }}
// // onClick={handlePolygonEdit}
// />}

//       {/* Custom Zoom Control */}
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


// ---------------------------------------------------------------

// export default GoogleApiWrapper({
//   apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
// })(GoogleMap);
// ----- well code---------------//

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { Map, GoogleApiWrapper } from "google-maps-react";
// import { useDispatch, useSelector } from "react-redux";
// import { setCircle, setPolygon, setRectangle } from "../../../../ReaduxToolkit/Reducer/GeofenceSlice";
// import "./googleMap.css";

// const GoogleMap = (props) => {
//   const { type } = useSelector((state) => state.geofence);
//   const dispatch = useDispatch();
//   const [zoom, setZoom] = useState(12); // State to manage zoom level
//   const mapRef = useRef(null);
//   const drawingManagerRef = useRef(null);

//   const [circle, setCircleState] = useState(null);
//   const [rectangle, setRectangleState] = useState(null);
//   const [polygon, setPolygonState] = useState([]);

//   const zoomIn = () => {
//     setZoom((prevZoom) => prevZoom + 1); // Increase zoom level by 1
//   };

//   const zoomOut = () => {
//     setZoom((prevZoom) => prevZoom - 1); // Decrease zoom level by 1
//   };

//   useEffect(() => {
//     if (props.google && mapRef.current) {
//       const google = props.google;

//       const drawingManager = new google.maps.drawing.DrawingManager({
//         drawingMode: null,
//         drawingControl: true,
//         drawingControlOptions: {
//           position: google.maps.ControlPosition.TOP_CENTER,
//           drawingModes: ['circle', 'rectangle', 'polygon'],
//         },
//         circleOptions: {
//           editable: true,
//           draggable: true,
//           strokeColor: 'black',
//           strokeOpacity: 0.8,
//           strokeWeight: 2,
//           fillColor: 'black',
//           fillOpacity: 0.35,
//         },
//         rectangleOptions: {
//           editable: true,
//           draggable: true,
//           strokeColor: 'red',
//           strokeOpacity: 0.8,
//           strokeWeight: 2,
//           fillColor: 'red',
//           fillOpacity: 0.35,
//         },
//         polygonOptions: {
//           editable: true,
//           draggable: true,
//           strokeColor: 'blue',
//           strokeOpacity: 0.8,
//           strokeWeight: 2,
//           fillColor: 'blue',
//           fillOpacity: 0.35,
//         },
//       });

//       drawingManager.setMap(mapRef.current.map);
//       drawingManagerRef.current = drawingManager;

//       google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
//         drawingManager.setDrawingMode(null); // Stop drawing mode after shape creation

//         if (event.type === 'circle') {
//           const newCircle = {
//             center: { lat: event.overlay.getCenter().lat(), lng: event.overlay.getCenter().lng() },
//             radius: event.overlay.getRadius(),
//           };
//           setCircleState(newCircle);
//           dispatch(setCircle(newCircle));
//           console.log("Circle created:", newCircle);
//         } else if (event.type === 'rectangle') {
//           const newBounds = event.overlay.getBounds().toJSON();
//           setRectangleState({ bounds: newBounds });
//           dispatch(setRectangle({ bounds: newBounds }));
//           console.log("Rectangle created:", newBounds);
//         } else if (event.type === 'polygon') {
//           const newPath = event.overlay.getPath().getArray().map(latlng => ({
//             lat: latlng.lat(),
//             lng: latlng.lng(),
//           }));
//           setPolygonState(newPath);
//           dispatch(setPolygon(newPath));
//           console.log("Polygon created:", newPath);
//         }

//         // Allow re-enabling the drawing mode for new shapes
//         // google.maps.event.addListener(event.overlay, 'click', () => {
//         //   drawingManager.setDrawingMode(event.type); // Re-enable drawing mode
//         // });
//       });
//     }
//   }, [props.google, dispatch]);




//   if (!props.google) {
//     return <div>Error: Google Maps API failed to load.</div>;
//   }

//   return (
//     <div>
//       <Map
//         google={props.google}
//         zoom={zoom}
//         initialCenter={{ lat: 24.8607, lng: 67.0011 }}
//         disableDefaultUI={true} // Disable default UI controls
//         ref={mapRef}

//       >
//         {/* Custom Zoom Control */}
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
//   libraries: ['drawing'],
// })(GoogleMap);





// ------------------------------------------------------------

import React, { useEffect, useRef, useState } from "react";
import { Map, GoogleApiWrapper, Circle, Rectangle, Polygon } from "google-maps-react";
import { useDispatch, useSelector } from "react-redux";
import { setCircle, setPolygon, setRectangle, setType } from "../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import "./googleMap.css";

const GoogleMap = (props) => {
  const { type, geofences } = useSelector((state) => state.geofence);
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState(12); // State to manage zoom level
  const [drawingMode, setDrawingMode] = useState(null); // State to manage drawing mode
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const overlaysRef = useRef([]);

  useEffect(() => {
    setDrawingMode(type);
  }, [type]);

  const zoomIn = () => {
    setZoom((prevZoom) => prevZoom + 1); // Increase zoom level by 1
  };

  const zoomOut = () => {
    setZoom((prevZoom) => prevZoom - 1); // Decrease zoom level by 1
  };

  useEffect(() => {
    if (props.google && props.google.maps && mapRef.current) {
      const google = props.google;

      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: drawingMode,
        drawingControl: false, // Disable default drawing control
        circleOptions: {
          editable: true,
          draggable: true,
          strokeColor: 'black',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'black',
          fillOpacity: 0.35,
        },
        rectangleOptions: {
          editable: true,
          draggable: true,
          strokeColor: 'red',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'red',
          fillOpacity: 0.35,
        },
        polygonOptions: {
          editable: true,
          draggable: true,
          strokeColor: 'blue',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'blue',
          fillOpacity: 0.35,
        },
      });

      drawingManager.setMap(mapRef.current.map);
      drawingManagerRef.current = drawingManager;

      google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
        drawingManager.setDrawingMode(null); // Stop drawing mode after shape creation

        const overlay = event.overlay;
        overlaysRef.current.push(overlay);

        const handleOverlayEdit = () => {
          if (event.type === 'circle') {
            const updatedCircle = {
              center: { lat: overlay.getCenter().lat(), lng: overlay.getCenter().lng() },
              radius: overlay.getRadius(),
            };
            dispatch(setCircle(updatedCircle));
            console.log("Circle updated:", updatedCircle);
          } else if (event.type === 'rectangle') {
            const updatedBounds = overlay.getBounds().toJSON();
            dispatch(setRectangle({ bounds: updatedBounds }));
            console.log("Rectangle updated:", updatedBounds);
          } else if (event.type === 'polygon') {
            const updatedPath = overlay.getPath().getArray().map(latlng => ({
              lat: latlng.lat(),
              lng: latlng.lng(),
            }));
            dispatch(setPolygon(updatedPath));
            console.log("Polygon updated:", updatedPath);
          }
        };

        // Add event listeners for editing the shapes
        if (event.type === 'circle' || event.type === 'rectangle' || event.type === 'polygon') {
          google.maps.event.addListener(overlay, 'radius_changed', handleOverlayEdit);
          google.maps.event.addListener(overlay, 'bounds_changed', handleOverlayEdit);
          google.maps.event.addListener(overlay, 'dragend', handleOverlayEdit);
          google.maps.event.addListener(overlay, 'set_at', handleOverlayEdit);
          google.maps.event.addListener(overlay, 'insert_at', handleOverlayEdit);
        }

        if (event.type === 'circle') {
          const newCircle = {
            center: { lat: overlay.getCenter().lat(), lng: overlay.getCenter().lng() },
            radius: overlay.getRadius(),
          };
          dispatch(setCircle(newCircle));
          console.log("Circle created:", newCircle);
        } else if (event.type === 'rectangle') {
          const newBounds = overlay.getBounds().toJSON();
          dispatch(setRectangle({ bounds: newBounds }));
          console.log("Rectangle created:", newBounds);
        } else if (event.type === 'polygon') {
          const newPath = overlay.getPath().getArray().map(latlng => ({
            lat: latlng.lat(),
            lng: latlng.lng(),
          }));
          dispatch(setPolygon(newPath));
          console.log("Polygon created:", newPath);
        }
      });
    }
  }, [props.google, dispatch, drawingMode]);

  useEffect(() => {
    const selectedMode = type;
    setDrawingMode(selectedMode === null ? null : selectedMode);

    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }

    // Clear all overlays from the map
    overlaysRef.current.forEach(overlay => overlay.setMap(null));
    overlaysRef.current = [];

  }, [type]);

  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

  return (
    <div>
      <Map
        google={props.google}
        zoom={zoom}
        initialCenter={{ lat: 24.8607, lng: 67.0011 }}
        disableDefaultUI={true} // Disable default UI controls
        ref={mapRef}
      >
        {
          geofences.map((item, index) => {
            return item.type === "circle" ? (
              <Circle
                key={index}
                center={item.bounds.center}
                radius={item.bounds.radius}
                options={{
                  strokeColor: "black",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "black",
                  fillOpacity: 0.35,
                }}
              />
            ) : item.type === "rectangle" ? (
              <Rectangle
                key={index}
                bounds={item.bounds.bounds}
                options={{
                  strokeColor: "red",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "red",
                  fillOpacity: 0.35,
                }}
              />
            ) : (
              <Polygon
                key={index}
                paths={item.bounds}
                options={{
                  strokeColor: "blue",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "blue",
                  fillOpacity: 0.35,
                }}
              />
            );
          })
        }
        {/* Custom Zoom Control */}
        <div className="custom-zoom-control">
          <button onClick={zoomIn} className="zoom-button">+</button>
          <button onClick={zoomOut} className="zoom-button">-</button>
        </div>
      </Map>
    </div>
  );
};



export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
  libraries: ["drawing"] // Include the drawing library
})(GoogleMap);













// --------------------------------Strret Map -----------------------------

// import React, { useEffect, useRef, useState } from "react";
// import { MapContainer, TileLayer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-draw/dist/leaflet.draw.css";
// import L from "leaflet";
// import "leaflet-draw";

// const OSMMap = () => {
//   const [display, setDisplay] = useState(false);
//   const mapRef = useRef(null);

//   useEffect(() => {
//     setDisplay(true);
//   }, []);

//   useEffect(() => {
//     if (display && mapRef.current) {
//       const map = mapRef.current;
//       const drawnItems = new L.FeatureGroup();
//       map.addLayer(drawnItems);

//       const drawControl = new L.Control.Draw({
//         edit: {
//           featureGroup: drawnItems,
//         },
//         draw: {
//           polygon: {
//             allowIntersection: false, // Restricts shapes to simple polygons
//             showArea: true, // Show area in the tooltip
//             shapeOptions: {
//               color: "#bada55"
//             }
//           },
//           circle: {
//             shapeOptions: {
//               color: "#662d91"
//             }
//           },
//           rectangle: {
//             shapeOptions: {
//               color: "#f06eaa"
//             }
//           },
//           marker: false, // Disable marker drawing
//           polyline: false // Disable polyline drawing
//         },
//       });

//       map.addControl(drawControl);

//       map.on(L.Draw.Event.CREATED, (e) => {
//         const layer = e.layer;
//         drawnItems.addLayer(layer);
//         console.log("Geofence created:", layer.toGeoJSON());
//       });

//       map.on(L.Draw.Event.EDITED, (e) => {
//         const layers = e.layers;
//         layers.eachLayer((layer) => {
//           console.log("Geofence edited:", layer.toGeoJSON());
//         });
//       });

//       map.on(L.Draw.Event.DELETED, (e) => {
//         const layers = e.layers;
//         layers.eachLayer((layer) => {
//           console.log("Geofence deleted:", layer.toGeoJSON());
//         });
//       });
//     }
//   }, [display]);

//   return (
//     <>
//       {display && (
//         <MapContainer
//           style={{ height: "92.5vh", width: "100%", marginLeft: "40px" }}
//           center={[24.8607, 67.0011]}
//           zoom={13}
//           scrollWheelZoom={true}
//           ref={mapRef}
//           whenCreated={(mapInstance) => {
//             mapRef.current = mapInstance;
//           }}
//         >
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         </MapContainer>
//       )}
//     </>
//   );
// };

// export default OSMMap;










{/* <Circle
ref={circleRef}
center={{ lat: 24.8960, lng: 67.0311 }}
radius={2000}
editable={false}
draggable={false}
onCenterChanged={handleCircleChanged}
onRadiusChanged={handleCircleChanged}
// onClick={handleCircleChanged}
options={{
  strokeColor: "black",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "black",
  fillOpacity: 0.35,
}}
/>
<Circle
ref={circleRef}
center={{ lat: 24.8660, lng: 67.2311 }}
radius={2550}
editable={false}
draggable={false}
onCenterChanged={handleCircleChanged}
onRadiusChanged={handleCircleChanged}
// onClick={handleCircleChanged}
options={{
  strokeColor: "black",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "black",
  fillOpacity: 0.35,
}}
/> */}



{/* <Rectangle
ref={rectangleRef}
bounds={{ south: 24.931049412292783, west: 67.12572615966798, north: 24.962241966819292, east: 67.20855422363283 }}
editable={false}
draggable={false}
onBoundsChanged={handleRectangleChanged}
// onClick={handleRectangleChanged}
options={{
  strokeColor: "red",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "red",
  fillOpacity: 0.35,
}}
/>
<Rectangle
ref={rectangleRef}
bounds={{ south: 24.79180623822459, west: 66.96402114257813, north: 24.845778870388713, east: 67.05646224365236 }}
editable={false}
draggable={false}
onBoundsChanged={handleRectangleChanged}
// onClick={handleRectangleChanged}
options={{
  strokeColor: "red",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "red",
  fillOpacity: 0.35,
}}
/> */}