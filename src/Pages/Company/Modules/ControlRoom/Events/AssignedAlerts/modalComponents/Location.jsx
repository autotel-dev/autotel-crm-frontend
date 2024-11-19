// import { Map, Marker, GoogleApiWrapper, Circle } from "google-maps-react";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";

// const Location = (props) => {
//   const { modalData } = useSelector((state) => state.alerts);
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     // Re-enable scrolling when the component unmounts

//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, []);
//   if (!props.google) {
//     return <div>Error: Google Maps API failed to load.</div>;
//   }

//   return (
//     <div className="map-container">
//       <Map
//         google={props.google}
//         zoom={14}
//         initialCenter={{
//           lat: modalData.alertEvent.latitude,
//           lng: modalData.alertEvent.longitude,
//         }}
//         disableDefaultUI={false} // Enable default UI controls
//         style={{ height: "88%", width: "97%", overflow: "unset" }}
//       >
//         <Marker
//           key={modalData.alertEvent._id}
//           name={"markerName"}
//           position={{
//             lat: modalData.alertEvent.latitude,
//             lng: modalData.alertEvent.longitude,
//           }}
//         />
//       </Map>
//     </div>
//   );
// };

// // ---------------------------------------------------------------

// export default GoogleApiWrapper({
//   apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
// })(Location);

// ------------------------------------------------------------

import {
  Map,
  Marker,
  GoogleApiWrapper,
  InfoWindow,
  Polygon,
} from "google-maps-react";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import LocationArrow from "../../../../../../../assets/deviceLocationArrow.png";

const Location = (props) => {
  const { modalData } = useSelector((state) => state.alerts);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const mapRef = useRef(null);
  const polygonRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleMarkerClick = (props, marker) => {
    // console.log("marker", marker);
    setActiveMarker(marker);
    setShowInfoWindow(true);
  };

  useEffect(() => {
    if (modalData && modalData.alertEvent) {
      handleMarkerClick();
    }
  }, [modalData]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Load the static image
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = LocationArrow;

    img.onload = () => {
      // Calculate canvas dimensions to accommodate rotated image
      const canvasWidth = Math.max(img.width, img.height);
      const canvasHeight = canvasWidth;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Rotate and draw image
      context.translate(canvas.width / 2, canvas.height / 2);

      context.rotate((modalData.alertEvent.course * Math.PI) / 180);
      context.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );

      // Convert canvas to data URL
      const rotatedIconUrl = canvas.toDataURL();

      const markerInstance = new window.google.maps.Marker({
        position: {
          lat: parseFloat(modalData.alertEvent.latitude),
          lng: parseFloat(modalData.alertEvent.longitude),
        },
        map: mapRef.current.map,
        icon: {
          url: rotatedIconUrl,
          scaledSize: new window.google.maps.Size(canvasWidth, canvasHeight),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div>
        <h3>Device Info</h3>
        <br />
        <p>
          <span style={{ fontWeight: "bold" }}>Device ID: </span>
          <span> ${modalData.alertEvent.deviceId}</span>
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Device Name: </span>
          <span>${modalData.alertEvent.deviceName}</span>
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>LatLng: </span>
          <a href="https://www.google.com/maps/search/?api=1&query=${
            modalData.alertEvent.latitude
          },${modalData.alertEvent.longitude}" target="_blank">${parseFloat(
          modalData.alertEvent.latitude
        ).toFixed(6)},${parseFloat(modalData.alertEvent.longitude).toFixed(
          6
        )}</a>
        </p>
      </div>`,
      });

      markerInstance.addListener("click", () => {
        infoWindow.open(mapRef.current.map, markerInstance);
      });
    };
  }, [modalData, props.google]);

  // if (!props.google) {
  //   return <div>Error: Google Maps API failed to load.</div>;
  // }

  if (!props.google || !modalData || !modalData.alertEvent) {
    return (
      <div>Error: Google Maps API failed to load or no data available.</div>
    );
  }

  const renderGeofences = () => {};

  return (
    <div className="map-container">
      <Map
        google={props.google}
        zoom={14}
        initialCenter={{
          lat: parseFloat(modalData.alertEvent.latitude),
          lng: parseFloat(modalData.alertEvent.longitude),
        }}
        disableDefaultUI={false} // Enable default UI controls
        style={{ height: "88%", width: "97%", overflow: "unset" }}
        ref={mapRef} // Set ref for the map
      >
        {modalData.geofenceCoordinates.length !== 0 &&
          modalData.geofenceInfo !== null && (
            <Polygon
              ref={polygonRef}
              paths={modalData.geofenceCoordinates}
              options={{
                strokeColor: `${modalData.geofenceInfo.polygon_color}`,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: `${modalData.geofenceInfo.polygon_color}`,
                fillOpacity: 0.35,
              }}
              // onClick={handlePolygonEdit}
            />
          )}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(Location);

// ------------------------------------------

// if (modalData.alertEvent.course < 90) {
//   context.rotate((modalData.alertEvent.course * Math.PI) / 90);
// } else if (modalData.alertEvent.course < 180) {
//   context.rotate((modalData.alertEvent.course * Math.PI) / -360);
// } else if (modalData.alertEvent.course < 270) {
//   context.rotate((modalData.alertEvent.course * Math.PI) / -360);
// } else {
//   context.rotate((modalData.alertEvent.course * Math.PI) / 360);
// }
