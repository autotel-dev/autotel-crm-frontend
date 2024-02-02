import React from "react";
import { Map, Marker, GoogleApiWrapper, Circle } from "google-maps-react";
const markers = [
    {
      id: 1,
      name: "Ocean Mall",
      position: { lat: 24.8239, lng: 67.0356 },
    },
    {
      id: 2,
      name: "Atrium Mall",
      position: { lat: 24.8561, lng: 67.0303 },
    },
    {
      id: 3,
      name: "MindFlare Technologies",
      position: { lat: 24.8511, lng: 67.0168 },
    },
  ];
const GoogleMap = (props) => {
  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }
  var points = [
    { lat: 24.8561, lng: 67.0303 },
    { lat: 24.8239, lng: 67.0356 },
    { lat: 24.8511, lng: 67.0168 },
    
]

  var bounds = new props.google.maps.LatLngBounds();
for (var i = 0; i < points.length; i++) {
  bounds.extend(points[i]);
}

  return (
    <Map
      google={props.google}
      zoom={12}
      initialCenter={{ lat: 24.8607, lng: 67.0011 }}
      bounds={bounds}
    >

        
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          name={marker.name}
          position={marker.position}
        
        />
      ))}
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(GoogleMap);
