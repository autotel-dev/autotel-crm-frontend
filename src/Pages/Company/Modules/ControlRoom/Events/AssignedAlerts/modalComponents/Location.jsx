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

import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Location = (props) => {
  const { modalData } = useSelector((state) => state.alerts);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

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

  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

  return (
    <div className="map-container">
      <Map
        google={props.google}
        zoom={14}
        initialCenter={{
          lat: modalData.alertEvent.latitude,
          lng: modalData.alertEvent.longitude,
        }}
        disableDefaultUI={false} // Enable default UI controls
        style={{ height: "88%", width: "97%", overflow: "unset" }}
      >
        <Marker
          key={modalData.alertEvent._id}
          name={"markerName"}
          position={{
            lat: modalData.alertEvent.latitude,
            lng: modalData.alertEvent.longitude,
          }}
          onClick={handleMarkerClick}
        />
        <InfoWindow
          marker={activeMarker}
          visible={showInfoWindow}
          onClose={() => setShowInfoWindow(false)}
        >
          <div>
            <h3>Device Info</h3>
            <br />
            <p>
              <span style={{ fontWeight: "bold" }}>Device Name: </span>
              <span> {modalData.alertEvent.deviceName}</span>
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Alert: </span>
              <span> {modalData.alertEvent.message}</span>
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Latitude: </span>
              <span> {modalData.alertEvent.latitude}</span>
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Longitude: </span>
              <span> {modalData.alertEvent.longitude}</span>
            </p>
            {/* Add more device details here */}
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(Location);
