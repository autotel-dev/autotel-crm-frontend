import { useEffect, useRef } from "react";
import { Map, Marker, GoogleApiWrapper, Circle } from "google-maps-react";
import { useSelector } from "react-redux";
import "./googleMap.css";

const GoogleMap = (props) => {
  const { serverDevices, selectedDevices, expandedDevice } = useSelector(
    (state) => state.monitoring
  );
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

  useEffect(() => {
    console.log("UseEffect Called");
    console.log("ExpandedDevice", expandedDevice);
    if (expandedDevice !== null) {
      zoomToMarker(expandedDevice);
      console.log("ExpandedDevice", expandedDevice);
    }
  }, [expandedDevice]);

  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

  const calculateBearing = (pointA, pointB) => {
    const lat1 = parseFloat(pointA.lat);
    const lon1 = parseFloat(pointA.lng);
    const lat2 = parseFloat(pointB.lat);
    const lon2 = parseFloat(pointB.lng);

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    let brng = Math.atan2(y, x);
    brng = (brng * 180) / Math.PI;
    brng = (brng + 360) % 360;

    return brng;
  };

  return (
    <Map
      google={props.google}
      zoom={12}
      initialCenter={{ lat: 24.8607, lng: 67.0011 }}
      disableDefaultUI={true} // Enable default UI controls
      ref={mapRef}
    >
      {selectedDevices.map((marker) => {
        const tail = marker.tail;
        if (tail.length < 2) return null; // Skip if there are less than 2 points

        const start = tail[tail.length - 2]; // Second-to-last point
        const end = tail[tail.length - 1]; // Last point
        const bearing = calculateBearing(start, end);
        console.log("Marker Bearing:", bearing); // Log the bearing

        return (
          <Marker
            key={marker.id}
            name={marker.title}
            position={{
              lat: parseFloat(marker.lat),
              lng: parseFloat(marker.lng),
            }}
            icon={{
              anchor: new props.google.maps.Point(32, 32),
              url: `${marker.server.url}/${marker.icon.path}`,
              scaledSize: new window.google.maps.Size(22, 40),
              rotation: bearing, // Rotation angle
            }}
          />
        );
      })}

      {/* Custom Zoom Control */}
      <div className="custom-zoom-control">
        <button onClick={() => props.zoomIn()} className="zoom-button">
          +
        </button>
        <button onClick={() => props.zoomOut()} className="zoom-button">
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
