import { Map, Marker, GoogleApiWrapper, Circle } from "google-maps-react";
import { useSelector } from "react-redux";

const Location = (props) => {
  const { modalData } = useSelector((state) => state.alerts);
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
        style={{ height: "88%", width: "97%" }}
      >
        <Marker
          key={modalData.alertEvent._id}
          name={"markerName"}
          position={{
            lat: modalData.alertEvent.latitude,
            lng: modalData.alertEvent.longitude,
          }}
        />
      </Map>
    </div>
  );
};

// ---------------------------------------------------------------

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(Location);

// ------------------------------------------------------------
