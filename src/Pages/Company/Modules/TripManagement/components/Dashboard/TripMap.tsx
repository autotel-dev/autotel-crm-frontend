import React, { useState } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";

interface TripMapProps {
  google: any;
  activeViolations?: any[];
}

const TripMap = ({ google, activeViolations = [] }: TripMapProps) => {
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [activeMarker, setActiveMarker] = useState<any>(null);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);

  const onMarkerClick = (props: any, marker: any) => {
    setSelectedPlace(props);
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };

  const onMapClicked = () => {
    if (showingInfoWindow) {
      setShowingInfoWindow(false);
      setActiveMarker(null);
    }
  };

  if (!google) {
    return <div>Loading map...</div>;
  }

  // Calculate center based on violations or default to Islamabad
  const center =
    activeViolations.length > 0 && activeViolations[0].location
      ? {
        lat: activeViolations[0].location[1],
        lng: activeViolations[0].location[0],
      }
      : {
        lat: 33.6844,
        lng: 73.0479,
      };

  const MapComponent = Map as any;
  const MarkerComponent = Marker as any;
  const InfoWindowComponent = InfoWindow as any;

  return (
    <MapComponent
      google={google}
      zoom={12}
      onClick={onMapClicked}
      style={{
        width: "96%",
        height: "84%",
        position: "relative",
        borderRadius: "10px",
      }}
      initialCenter={center}
      center={center}
    >
      {activeViolations.map((violation, index) => {
        if (violation.location && violation.location.length === 2) {
          return (
            <MarkerComponent
              key={index}
              position={{
                lat: violation.location[1],
                lng: violation.location[0],
              }}
              name={violation.violation}
              registrationNo={violation.registrationNo}
              tripTitle={violation.tripTitle}
              onClick={onMarkerClick}
            />
          );
        }
        return null;
      })}

      <InfoWindowComponent
        marker={activeMarker}
        visible={showingInfoWindow}
        onClose={() => setShowingInfoWindow(false)}
      >
        <div style={{ padding: "5px" }}>
          <h6 style={{ marginBottom: "5px", color: "#F44336" }}>{selectedPlace?.name}</h6>
          <p style={{ margin: 0, fontSize: "12px" }}>
            <strong>Vehicle:</strong> {selectedPlace?.registrationNo}
          </p>
          <p style={{ margin: 0, fontSize: "12px" }}>
            <strong>Trip:</strong> {selectedPlace?.tripTitle}
          </p>
        </div>
      </InfoWindowComponent>
    </MapComponent>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(TripMap);
