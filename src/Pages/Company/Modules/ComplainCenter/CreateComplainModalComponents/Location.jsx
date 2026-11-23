

import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { GOOGLE_MAPS_OPTIONS } from "../../../../../utils/googleMapsOptions";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import LocationArrow from "../../../../../assets/deviceLocationArrow.png";
import { DARK_MAP_STYLES, isDarkTheme } from "../../../../../utils/mapDarkStyles";

// A device that has never had a GPS fix reports 0,0 (middle of the Atlantic).
const validPosition = (info) => {
  const lat = parseFloat(info?.lat);
  const lng = parseFloat(info?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) < 0.0001 && Math.abs(lng) < 0.0001) return null;
  return { lat, lng };
};

const Location = (props) => {
  const { createComplainModalData } = useSelector((state) => state.complainCenter);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const mapRef = useRef(null);

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
    if (createComplainModalData && createComplainModalData.vehicleInfo) {
      handleMarkerClick();
    }
  }, [createComplainModalData]);

  const position = validPosition(createComplainModalData?.vehicleInfo);

  useEffect(() => {
    if (!position || !window.google) return;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Load the static image
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = LocationArrow;

    img.onload = () => {
      // Calculate canvas dimensions to accommodate rotated image
      const canvasWidth = Math.max(img.width, img.height);
      const canvasHeight = canvasWidth;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Rotate and draw image
      context.translate(canvas.width / 2, canvas.height / 2);

      context.rotate((createComplainModalData.vehicleInfo.course * Math.PI) / 180);
      context.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );

      // Convert canvas to data URL
      const rotatedIconUrl = canvas.toDataURL();

      if (!mapRef.current?.map) return;
      const markerInstance = new window.google.maps.Marker({
        position: {
          lat: parseFloat(createComplainModalData.vehicleInfo.lat),
          lng: parseFloat(createComplainModalData.vehicleInfo.lng),
        },
        map: mapRef.current.map,
        icon: {
          url: rotatedIconUrl,
          scaledSize: new window.google.maps.Size(canvasWidth, canvasHeight),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div>
        <h3>Device Info</h3>
        <br />
       
        <p>
          <span style={{ fontWeight: "bold" }}>Device Name: </span>
          <span>${createComplainModalData?.vehicleInfo?.deviceName}</span>
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>LatLng: </span>
          <a href="https://www.google.com/maps/search/?api=1&query=${createComplainModalData?.vehicleInfo?.lat},${createComplainModalData?.vehicleInfo?.lng}" target="_blank">${createComplainModalData?.vehicleInfo?.lat},${createComplainModalData?.vehicleInfo?.lng}</a>
        </p>
      </div>`,
      });

      markerInstance.addListener("click", () => {
        infoWindow.open(mapRef.current.map, markerInstance);
      });
    };
  }, [createComplainModalData, props.google]);

  // if (!props.google) {
  //   return <div>Error: Google Maps API failed to load.</div>;
  // }

  if (!props.google || !createComplainModalData || !createComplainModalData.vehicleInfo) {
    return (
      <div>Error: Google Maps API failed to load or no data available.</div>
    );
  }

  if (!position) {
    return (
      <div className="cc-loc-empty">
        <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /><path d="M4 4l16 16" /></svg>
        <strong>No location yet</strong>
        <span>This device hasn't sent a valid GPS position, so there is nothing to show on the map.</span>
      </div>
    );
  }

  const dark = isDarkTheme();
  return (
    <div className="cc-loc-map">
      <Map
        google={props.google}
        zoom={15}
        initialCenter={position}
        styles={dark ? DARK_MAP_STYLES : null}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl
        zoomControl
        containerStyle={{ position: "absolute", inset: 0 }}
        style={{ width: "100%", height: "100%" }}
        ref={mapRef}
      ></Map>
      <a
        className="cc-loc-link"
        href={`https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`}
        target="_blank"
        rel="noreferrer"
      >
        {position.lat.toFixed(5)}, {position.lng.toFixed(5)} · Open in Google Maps
      </a>
    </div>
  );
};

export default GoogleApiWrapper(GOOGLE_MAPS_OPTIONS)(Location);

// ------------------------------------------

// if (createComplainModalData.alertEvent.course < 90) {
//   context.rotate((createComplainModalData.alertEvent.course * Math.PI) / 90);
// } else if (createComplainModalData.alertEvent.course < 180) {
//   context.rotate((createComplainModalData.alertEvent.course * Math.PI) / -360);
// } else if (createComplainModalData.alertEvent.course < 270) {
//   context.rotate((createComplainModalData.alertEvent.course * Math.PI) / -360);
// } else {
//   context.rotate((createComplainModalData.alertEvent.course * Math.PI) / 360);
// }
