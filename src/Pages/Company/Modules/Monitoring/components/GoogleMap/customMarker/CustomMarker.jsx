import React, { useEffect, useRef } from "react";

const CustomMarker = ({ map, google, position, icon, rotation, onClick }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !google) return;

    // Create a div for custom marker
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = "40px";
    div.style.height = "40px";
    div.style.transform = `rotate(${rotation + 30}deg)`;
    div.style.transformOrigin = "center";
    div.innerHTML = `<img src="${icon}" width="40" height="40" style="position: absolute; transform: rotate(${
      rotation + 30
    }deg);" />`;

    // Create custom overlay
    const overlay = new google.maps.OverlayView();
    overlay.onAdd = function () {
      const panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(div);
    };

    overlay.draw = function () {
      const projection = this.getProjection();
      if (!projection) return;

      const point = projection.fromLatLngToDivPixel(
        new google.maps.LatLng(position.lat, position.lng)
      );

      if (point) {
        div.style.left = `${point.x - 20}px`;
        div.style.top = `${point.y - 20}px`;
      }
    };

    overlay.onRemove = function () {
      div.parentNode.removeChild(div);
    };

    overlay.setMap(map);
    markerRef.current = overlay;

    return () => {
      overlay.setMap(null);
    };
  }, [map, google, position, icon, rotation]);

  return null;
};

export default CustomMarker;
