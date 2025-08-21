import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const OpenStreetMapView = ({
  center,
  zoom,
  devices,
  onMarkerClick,
  selectedDevice,
  infoWindowVisible,
  onCloseInfoWindow,
  InfoWindowContent,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const popupRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [center.lat, center.lng],
        zoom
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update zoom
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [zoom]);

  // Custom icon for vehicles
  const createCustomIcon = (rotation = 0) => {
    return L.divIcon({
      className: "custom-vehicle-marker",
      html: `
        <div style="
          transform: rotate(${rotation}deg);
          transform-origin: center;
          width: 25px;
          height: 45px;
          background: url('data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="45" viewBox="0 0 25 45">
              <path d="M12.5 0L0 35h25L12.5 0z" fill="#FF4444" stroke="#000" stroke-width="1"/>
              <circle cx="12.5" cy="25" r="5" fill="#FFF"/>
            </svg>
          `)}') no-repeat center;
          background-size: contain;
        ">
        </div>
      `,
      iconSize: [25, 45],
      iconAnchor: [12.5, 45],
    });
  };

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !devices) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = {};

    // Add new markers
    devices.forEach((device) => {
      if (
        device.checked &&
        device.latestPosition?.latitude &&
        device.latestPosition?.longitude
      ) {
        const marker = L.marker(
          [device.latestPosition.latitude, device.latestPosition.longitude],
          {
            icon: createCustomIcon(device.latestPosition?.course || 0),
            device: device, // Store device data in marker
          }
        );

        marker.on("click", () => {
          onMarkerClick(device);
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current[device._id] = marker;
      }
    });
  }, [devices, onMarkerClick]);

  // Handle info window (popup)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (popupRef.current) {
      mapInstanceRef.current.removeLayer(popupRef.current);
      popupRef.current = null;
    }

    if (
      infoWindowVisible &&
      selectedDevice &&
      selectedDevice.latestPosition?.latitude &&
      selectedDevice.latestPosition?.longitude
    ) {
      // Create a custom popup div
      const popupDiv = document.createElement("div");
      popupDiv.style.cssText = `
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 420px;
        position: relative;
      `;

      // Close button
      const closeButton = document.createElement("button");
      closeButton.innerHTML = "×";
      closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        z-index: 1000;
      `;
      closeButton.onclick = onCloseInfoWindow;

      popupDiv.appendChild(closeButton);

      // Add the InfoWindowContent
      const contentDiv = document.createElement("div");
      // We'll render the React component content as HTML
      // This is a simplified version - in a real app, you might want to use ReactDOM.render
      contentDiv.innerHTML = `
        <div style="min-width: 400px; overflow: hidden; margin: 0; padding: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 25px; border-bottom: 1px solid lightgray;">
            <div style="display: flex; align-items: center;">
              <h2>VB 4285</h2>
              <span style="margin-left: 16px; color: gray; font-weight: bold;">Van</span>
            </div>
            <span style="font-weight: bold; color: red;">on route</span>
          </div>
          <div style="padding: 10px 25px; border-bottom: 0.5px solid lightgray;">
            <div style="margin-top: 10px; margin-bottom: 5px; font-size: 15px;">
              <strong>Device ID:</strong> ${selectedDevice?.id || "N/A"}
            </div>
            <div style="margin-bottom: 5px; font-size: 15px;">
              <strong>Address:</strong> Makran Coastal Highway, Lota Bazaar, Kund Malir, Liari Tehsil.
            </div>
            <div style="margin-bottom: 5px; font-size: 15px;">
              <strong>Time:</strong> 07-05-2025 11:53:56 AM
            </div>
            <div style="margin-bottom: 5px; font-size: 15px;">
              <strong>Stop Duration:</strong> 1h 31min 6s
            </div>
            <div style="margin-bottom: 5px; font-size: 15px;">
              <strong>Speed:</strong> ${
                selectedDevice?.latestPosition?.speed || 0
              } km/h
            </div>
            <div style="margin-bottom: 15px; font-size: 15px;">
              <strong>Ignition:</strong> ${
                selectedDevice?.latestPosition?.attributes?.ignition === false
                  ? "OFF"
                  : "ON"
              }
            </div>
          </div>
          <div style="padding: 0px 25px 15px 25px; padding-top: 20px; display: flex; overflow-x: auto; gap: 5px; border-bottom: 0.5px solid lightgray;">
            <div style="border: 0.5px solid lightgray; border-radius: 5px; padding: 12px 0px; font-weight: 400; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2px; min-width: 170px; max-width: 170px; flex-shrink: 0;">
              <div style="color: gray;">Vehicle Condition</div>
              <div style="color: red;">Critical</div>
            </div>
            <div style="border: 0.5px solid lightgray; border-radius: 5px; padding: 12px 0; font-weight: 400; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2px; min-width: 170px; max-width: 170px; flex-shrink: 0;">
              <div style="color: gray;">Number of Errors</div>
              <div style="color: red;">1</div>
            </div>
            <div style="border: 0.5px solid lightgray; border-radius: 5px; padding: 12px 0; font-weight: 400; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2px; min-width: 170px; max-width: 170px; flex-shrink: 0;">
              <div style="color: gray;">Average Speed</div>
              <div style="color: black; font-size: 13px;">62.5 MPH</div>
            </div>
            <div style="border: 0.5px solid lightgray; border-radius: 5px; padding: 12px 0px; font-weight: 400; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2px; min-width: 170px; max-width: 170px; flex-shrink: 0;">
              <div style="color: gray;">Fuel Consumption</div>
              <div style="color: black; font-size: 13px;">5.99 MPG</div>
            </div>
          </div>
          <div style="padding: 15px 25px; display: flex; justify-content: space-between; gap: 5px;">
            <button style="min-width: 170px; max-width: 170px; border: none; outline: none; background-color: lightgray; font-weight: 600; color: black; text-align: center; padding: 15px; border-radius: 5px;">
              ALL EVENTS
            </button>
            <button style="min-width: 170px; max-width: 170px; border: none; outline: none; background-color: lightgray; font-weight: 600; color: black; text-align: center; padding: 15px; border-radius: 5px;">
              TRIP
            </button>
          </div>
        </div>
      `;

      popupDiv.appendChild(contentDiv);

      const popup = L.popup({
        closeButton: false,
        autoClose: false,
        closeOnEscapeKey: true,
        closeOnClick: false,
        maxWidth: 450,
        minWidth: 420,
      })
        .setLatLng([
          selectedDevice.latestPosition.latitude,
          selectedDevice.latestPosition.longitude,
        ])
        .setContent(popupDiv)
        .addTo(mapInstanceRef.current);

      popupRef.current = popup;
    }
  }, [infoWindowVisible, selectedDevice, onCloseInfoWindow]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
      }}
    />
  );
};

export default OpenStreetMapView;
