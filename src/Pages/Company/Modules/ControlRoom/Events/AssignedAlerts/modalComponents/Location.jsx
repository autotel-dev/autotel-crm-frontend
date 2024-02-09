import { Map, Marker, GoogleApiWrapper, Circle } from "google-maps-react";

const Location = (props) => {
  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

  return (
    <div className="map-container">
      <Map
        google={props.google}
        zoom={12}
        initialCenter={{ lat: 24.8607, lng: 67.0011 }}
        disableDefaultUI={false} // Enable default UI controls
        style={{ height: "88%", width: "97%" }}
      >
        <Marker
          key={3222}
          name={"markerName"}
          position={{ lat: 24.8607, lng: 67.0011 }}
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
