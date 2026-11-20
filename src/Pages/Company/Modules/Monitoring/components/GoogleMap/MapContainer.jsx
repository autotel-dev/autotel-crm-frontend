import React from "react";
import GoogleMap from "./GoogleMap";
function MapContainer() {
  const apiKey = (process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "");

  return (
    <div>
      <GoogleMap />
    </div>
  );
}

export default MapContainer;
