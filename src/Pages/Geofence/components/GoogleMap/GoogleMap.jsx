// import { useEffect, useRef, useState } from "react";
// import {
//   Map,
//   Marker,
//   GoogleApiWrapper,
//   Circle,
//   Polyline,
// } from "google-maps-react";
// import { useDispatch, useSelector } from "react-redux";
// import "./googleMap.css";
// import { itemsName } from "../../../../Data/Forms/FormsLayout/FormWizardData";
// import { setItem } from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";

// const GoogleMap = (props) => {
//   const dispatch = useDispatch();

//   const [rotation, setRotation] = useState(-270);
//   const [zoom, setZoom] = useState(12); // State to manage zoom level
//   const mapRef = useRef(null);
//   const zoomToMarker = (latLng) => {
//     if (mapRef.current) {
//       const map = mapRef.current.map;
//       map.setZoom(16);
//       map.panTo(latLng);
//       map.setZoom(16);
//       map.setCenter(latLng);
//     }
//   };

//   const zoomIn = () => {
//     if (mapRef.current) {
//       setZoom(zoom + 1); // Increase zoom level by 1
//     }
//   };

//   // Function to handle zoom out
//   const zoomOut = () => {
//     if (mapRef.current) {
//       setZoom(zoom - 1); // Decrease zoom level by 1
//     }
//   };



//   if (!props.google) {
//     return <div>Error: Google Maps API failed to load.</div>;
//   }

//   return (
//     <Map
//       google={props.google}
//       zoom={zoom}
//       initialCenter={{ lat: 24.8607, lng: 67.0011 }}
//       disableDefaultUI={true} // Enable default UI controls
//       ref={mapRef}
//     >

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

// // ---------------------------------------------------------------

// export default GoogleApiWrapper({
//   apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
// })(GoogleMap);



import { useEffect, useRef, useState, useCallback } from "react";
import { Map, GoogleApiWrapper, Circle, Rectangle, Polygon } from "google-maps-react";
import { useDispatch, useSelector } from "react-redux";
import "./googleMap.css";
import { setCircle, setPolygon, setRectangle } from "../../../../ReaduxToolkit/Reducer/GeofenceSlice";

const GoogleMap = (props) => {
  const { circle, rectangle, polygon, type } = useSelector((state) => state.geofence);
  const dispatch = useDispatch();
  const [rotation, setRotation] = useState(-270);
  const [zoom, setZoom] = useState(12); // State to manage zoom level
  const mapRef = useRef(null);
  const circleRef = useRef(null);

  // const [circle, setCircle] = useState({
  //   center: { lat: 24.8607, lng: 67.0011 },
  //   radius: 1000, // Initial radius in meters
  // });

  // const [rectangle, setRectangle] = useState({
  //   bounds: {
  //     north: 24.8707,
  //     south: 24.8507,
  //     east: 67.0211,
  //     west: 67.0011,
  //   },
  // });

  // // Polygon state with initial coordinates
  // const [polygon, setPolygon] = useState([
  //   { lat: 24.8607, lng: 67.0011 },
  //   { lat: 24.8617, lng: 67.0021 },
  //   { lat: 24.8627, lng: 67.0031 },
  //   { lat: 24.8637, lng: 67.0041 },
  // ]);

  const zoomIn = () => {
    setZoom((prevZoom) => prevZoom + 1); // Increase zoom level by 1
  };

  const zoomOut = () => {
    setZoom((prevZoom) => prevZoom - 1); // Decrease zoom level by 1
  };

  const handleCircleChanged = () => {
    if (circleRef.current) {
      const circleInstance = circleRef.current.circle;
      const newCenter = {
        lat: circleInstance.getCenter().lat(),
        lng: circleInstance.getCenter().lng(),
      };
      const newRadius = circleInstance.getRadius();
      dispatch(setCircle({ center: newCenter, radius: newRadius }));
      // setCircle({ center: newCenter, radius: newRadius });
      console.log("Circle center updated:", newCenter);
      console.log("Circle radius updated:", newRadius);
    }
  };

  const rectangleRef = useRef(null);
  const handleRectangleChanged = useCallback(() => {
    if (rectangleRef.current) {
      const rectangleInstance = rectangleRef.current.rectangle;
      const newBounds = rectangleInstance.getBounds().toJSON();
      dispatch(setRectangle({ bounds: newBounds }))
      // setRectangle({ bounds: newBounds });
      console.log("Rectangle bounds updated:", newBounds);
    }
  }, []);

  const polygonRef = useRef(null);
  // const handlePolygonEdit = useCallback(() => {
  //   if (polygonRef.current) {
  //     const polygonInstance = polygonRef.current.getPath ? polygonRef.current.getPath() : polygonRef.current.getPolygon().getPath();
  //     const newPath = polygonInstance.getArray().map(latlng => ({
  //       lat: latlng.lat(),
  //       lng: latlng.lng(),
  //     }));
  //     dispatch(setPolygon(newPath))
  //     // setPolygon(newPath);
  //     console.log("Polygon path updated:", newPath);
  //   }
  // }, []);

  const handlePolygonEdit = useCallback(() => {
    if (polygonRef.current && polygonRef.current.polygon) {
      const polygonInstance = polygonRef.current.polygon;
      const newPath = polygonInstance.getPath().getArray().map(latlng => ({
        lat: latlng.lat(),
        lng: latlng.lng(),
      }));
      dispatch(setPolygon(newPath));
      console.log("Polygon path updated:", newPath);
    }
  }, []);

  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

  return (
    <Map
      google={props.google}
      zoom={zoom}
      initialCenter={{ lat: 24.8607, lng: 67.0011 }}
      disableDefaultUI={true} // Disable default UI controls
      ref={mapRef}
    >
      {/* Circular Geofence */}
      {type == "CIRCLE" &&
        <Circle
          ref={circleRef}
          center={circle.center}
          radius={circle.radius}
          editable={true}
          draggable={true}
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


      }
      <Circle
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
      />

      {/* Rectangular Geofence */}
      {type == "RECTANGLE" && <Rectangle
        ref={rectangleRef}
        bounds={rectangle.bounds}
        editable={true}
        draggable={true}
        onBoundsChanged={handleRectangleChanged}
        onClick={handleRectangleChanged}
        options={{
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "red",
          fillOpacity: 0.35,
        }}
      />}

      <Rectangle
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
      />

      {/* Polygon Geofence */}
      {type == "POLYGON" && <Polygon
        ref={polygonRef}
        paths={polygon}
        editable={true}
        draggable={true}
        onMouseUp={handlePolygonEdit}  // Triggers when editing is done
        options={{
          strokeColor: "blue",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "blue",
          fillOpacity: 0.35,
        }}
      // onClick={handlePolygonEdit}
      />}

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

