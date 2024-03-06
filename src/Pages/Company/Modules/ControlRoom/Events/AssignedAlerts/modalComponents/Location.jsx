import { Map, Marker, GoogleApiWrapper, Circle } from "google-maps-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Location = (props) => {
  const { modalData } = useSelector((state) => state.alerts);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when the component unmounts

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
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
