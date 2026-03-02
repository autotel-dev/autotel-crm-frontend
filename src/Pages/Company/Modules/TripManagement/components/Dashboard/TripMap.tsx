import React, { useState, useEffect, useRef } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import "../../../MonitoringLatest/components/GoogleMap/googleMap.css";

interface TripMapProps {
  google: any;
  activeViolations?: any[];
  selectedViolation?: any;
  onMarkerClose?: () => void;
}

const TripMap = ({ google, activeViolations = [], selectedViolation, onMarkerClose }: TripMapProps) => {
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [activeMarker, setActiveMarker] = useState<any>(null);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [address, setAddress] = useState("Loading address...");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const mapRef = useRef<any>(null);
  const markerRefs = useRef<any>({});

  const fetchAddress = async (lat: number, lng: number) => {
    if (!lat || !lng) return;
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "User-Agent": "AutotelCRM/1.0" } }
      );
      if (response.ok) {
        const data = await response.json();
        setAddress(data.display_name || "Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const onMarkerClick = (props: any, marker: any) => {
    setSelectedPlace(props);
    setActiveMarker(marker);
    setShowingInfoWindow(true);
    if (props.position) {
      fetchAddress(props.position.lat, props.position.lng);
    }
  };

  const onMapClicked = () => {
    if (showingInfoWindow) {
      setShowingInfoWindow(false);
      setActiveMarker(null);
      if (onMarkerClose) onMarkerClose();
    }
  };

  useEffect(() => {
    if (selectedViolation && selectedViolation.location && mapRef.current?.map) {
      const lat = selectedViolation.location[1];
      const lng = selectedViolation.location[0];
      const latLng = { lat, lng };

      mapRef.current.map.panTo(latLng);
      mapRef.current.map.setZoom(18);

      const markerKey = `${selectedViolation.registrationNo}-${selectedViolation.time}`;
      const marker = markerRefs.current[markerKey];

      const props = {
        name: selectedViolation.violation,
        registrationNo: selectedViolation.registrationNo,
        tripTitle: selectedViolation.tripTitle,
        position: latLng,
        time: selectedViolation.time
      };

      if (marker) {
        setTimeout(() => {
          onMarkerClick(props, marker);
        }, 100);
      } else {
        setSelectedPlace(props);
        setShowingInfoWindow(true);
        fetchAddress(lat, lng);
      }
    }
  }, [selectedViolation, google]);

  if (!google) {
    return <div>Loading map...</div>;
  }

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
      ref={mapRef}
      style={{
        width: "96%",
        height: "84%",
        position: "relative",
        borderRadius: "10px",
      }}
      initialCenter={center}
    >
      {activeViolations.map((violation, index) => {
        if (violation.location && violation.location.length === 2) {
          const markerKey = `${violation.registrationNo}-${violation.time}`;
          return (
            <MarkerComponent
              key={index}
              ref={(ref: any) => { if (ref) markerRefs.current[markerKey] = ref.marker; }}
              position={{
                lat: violation.location[1],
                lng: violation.location[0],
              }}
              name={violation.violation}
              registrationNo={violation.registrationNo}
              tripTitle={violation.tripTitle}
              time={violation.time}
              onClick={onMarkerClick}
            />
          );
        }
        return null;
      })}

      <InfoWindowComponent
        marker={activeMarker}
        visible={showingInfoWindow}
        onClose={() => {
          setShowingInfoWindow(false);
          if (onMarkerClose) onMarkerClose();
        }}
      >
        <div
          className="elegant-infowindow"
          style={{
            width: "280px",
            overflow: "hidden",
            margin: "-10px",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(109, 191, 184, 0.2)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}
        >
          <div style={{
            background: "linear-gradient(135deg, #6dbfb8 0%, #5aa9a2 100%)",
            padding: "8px 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ backgroundColor: "rgba(255, 255, 255, 0.25)", padding: "4px 8px", borderRadius: "5px", fontSize: "14px", fontWeight: "bold" }}>
                {selectedPlace?.registrationNo || "N/A"}
              </div>
              <span style={{ fontSize: "10px", fontWeight: "500", backgroundColor: "rgba(255, 255, 255, 0.2)", padding: "2px 6px", borderRadius: "8px" }}>Violation</span>
            </div>
            <span style={{ fontWeight: "600", fontSize: "9px", backgroundColor: "rgba(255, 87, 34, 0.9)", padding: "4px 8px", borderRadius: "10px", textTransform: "uppercase" }}>Active</span>
          </div>

          <div style={{ padding: "8px 12px", backgroundColor: "#f8fafa" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "4px" }}>
              <div className="info-row-hover" style={{ backgroundColor: "white", padding: "6px 10px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px", borderLeft: "3px solid #F44336", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)" }}>
                <span style={{ fontSize: "14px" }}>🔧</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "9px", color: "#666", fontWeight: "500" }}>TYPE</div>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: "#F44336" }}>{selectedPlace?.name}</div>
                </div>
              </div>
              <div className="info-row-hover" style={{ backgroundColor: "white", padding: "6px 10px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px", borderLeft: "3px solid #6dbfb8", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)" }}>
                <span style={{ fontSize: "14px" }}>🚗</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "9px", color: "#666", fontWeight: "500" }}>TRIP</div>
                  <div style={{ fontSize: "11px", fontWeight: "600" }}>{selectedPlace?.tripTitle}</div>
                </div>
              </div>
              <div className="info-row-hover" style={{ backgroundColor: "white", padding: "6px 10px", borderRadius: "6px", display: "flex", alignItems: "flex-start", gap: "8px", borderLeft: "3px solid #FF9800", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)" }}>
                <span style={{ fontSize: "14px", paddingTop: "2px" }}>📍</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "11px", fontWeight: "600", lineHeight: "1.3" }}>{isLoadingAddress ? "Loading..." : address}</div>
                  <div style={{ fontSize: "9px", color: "#888", marginTop: "2px" }}>⏰ {selectedPlace?.time ? new Date(selectedPlace.time).toLocaleString() : "N/A"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </InfoWindowComponent>
    </MapComponent>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(TripMap);
