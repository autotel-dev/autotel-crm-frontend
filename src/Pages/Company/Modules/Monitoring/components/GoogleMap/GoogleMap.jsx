import React, { useEffect, useRef } from "react";
import { Map, Marker, GoogleApiWrapper, Circle } from "google-maps-react";
import { useSelector } from "react-redux";
import "./googleMap.css";

const GoogleMap = (props) => {
  const { serverDevices, selectedDevices, expandedDevice } = useSelector(
    (state) => state.monitoring
  );
  const mapRef = useRef(null);
  const directionsService = new window.google.maps.DirectionsService();
  const directionsRenderer = new window.google.maps.DirectionsRenderer();

  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

  const zoomToMarker = (latLng) => {
    if (mapRef.current) {
      mapRef.current.map.panTo(latLng);
    }
  };

  const calculateAndDisplayRoute = (start, end) => {
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setMap(mapRef.current.map);
          directionsRenderer.setDirections(response);
        } else {
          console.error("Directions request failed due to " + status);
        }
      }
    );
  };

  useEffect(() => {
    zoomToMarker(expandedDevice);
    if (selectedDevices.length > 0) {
      const startLatLng = {
        lat: selectedDevices.tail[0].lat,
        lng: selectedDevices.tail[0].lng,
      };
      const endLatLng = {
        lat: selectedDevices.tail[selectedDevices.tail.length - 1].lat,
        lng: selectedDevices.tail[selectedDevices.tail.length - 1].lng,
      };
      calculateAndDisplayRoute(startLatLng, endLatLng);
    }
  }, [expandedDevice, selectedDevices]);

  return (
    <Map
      google={props.google}
      zoom={12}
      initialCenter={{ lat: 24.8607, lng: 67.0011 }}
      disableDefaultUI={true} // Enable default UI controls
      ref={mapRef}
    >
      {selectedDevices.length > 0 &&
        selectedDevices.map((marker) => (
          <Marker
            key={marker.id}
            name={marker.title}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: `${marker.server.url}/${marker.icon.path}`, // Specify the URL of your custom marker image
              scaledSize: new window.google.maps.Size(22, 40), // Adjust the size of the marker image as needed
            }}
          />
        ))}

      {/* Custom Zoom Control */}
      <div className="custom-zoom-control">
        <button onClick={() => props.zoomIn()} className="zoom-button">
          +
        </button>
        <button onClick={() => props.zoomOut()} className="zoom-button">
          -
        </button>
      </div>

      {/* {devices.map((item, index) => (
         <div key={index}>
          {markers.map((markerItem, markerIndex) => {
            console.log({
              lat: markerItem.lat,
              lng: markerItem.lng,
              path: markerItem.icon.path,
            });

             return <Marker
              key={markerIndex}
              name={markerItem.name}
              position={markerItem.position}
              icon={{
                url: `https://track.autotel.pk/${markerItem.icon.path}`, // Specify the URL of your custom marker image
                scaledSize: new window.google.maps.Size(100, 100), // Adjust the size of the marker image as needed
              }}
            />;

          })}


        </div>
      ))} */}
    </Map>
  );
};

// ---------------------------------------------------------------

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(GoogleMap);
