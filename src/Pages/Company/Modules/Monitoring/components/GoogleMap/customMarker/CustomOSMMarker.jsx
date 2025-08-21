import React, { useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const CustomOSMMarker = ({ position, icon, rotation, onClick }) => {
  const markerRef = useRef(null);
  const prevPositionRef = useRef(position);
  const iconRef = useRef(null);

  useEffect(() => {
    if (!iconRef.current) {
      iconRef.current = L.divIcon({
        html: `<img src="${icon}" width="25" height="45" style="transform: rotate(${rotation}deg); transform-origin: center;" />`,
        className: "custom-marker",
        iconSize: [25, 45],
        iconAnchor: [12.5, 45],
      });
    } else {
      iconRef.current.options.html = `<img src="${icon}" width="25" height="45" style="transform: rotate(${rotation}deg); transform-origin: center;" />`;
      if (markerRef.current) {
        markerRef.current.setIcon(iconRef.current);
      }
    }
  }, [icon, rotation]);

  useEffect(() => {
    if (markerRef.current && position) {
      const startLatLng = L.latLng(prevPositionRef.current);
      const endLatLng = L.latLng(position);
      prevPositionRef.current = position;

      let startTime;
      const duration = 1000; // 1 second animation

      const animateMarker = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const lat =
          startLatLng.lat + (endLatLng.lat - startLatLng.lat) * progress;
        const lng =
          startLatLng.lng + (endLatLng.lng - startLatLng.lng) * progress;

        markerRef.current.setLatLng([lat, lng]);

        if (progress < 1) {
          requestAnimationFrame(animateMarker);
        }
      };

      requestAnimationFrame(animateMarker);
    }
  }, [position]);

  return (
    <Marker
      position={position}
      icon={iconRef.current}
      ref={markerRef}
      eventHandlers={{
        click: () => onClick(),
      }}
    />
  );
};

export default CustomOSMMarker;
