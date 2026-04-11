import React, { useEffect, useRef } from "react";

const CustomMarker = ({
  map,
  google,
  position,
  icon,
  rotation,
  onClick,
  label,
  showLabel = true,
  statusColor = "green",
  isCluster = false,
  count = 0,
}) => {
  const markerRef = useRef(null);
  const divRef = useRef(null);
  const currentLatLngRef = useRef(position);

  useEffect(() => {
    if (!map || !google) return;

    const div = document.createElement("div");
    div.style.position = "absolute";

    // Style and content based on type (Marker vs Cluster)
    if (isCluster) {
      div.className = "cluster-marker";
      const size = Math.min(60, 45 + count * 0.5); // Scalable size
      div.style.width = `${size}px`;
      div.style.height = `${size}px`;
      div.style.transform = "none"; // No rotation for clusters
      div.innerHTML = `
        <div class="cluster-glow"></div>
        ${count}
      `;
    } else {
      div.style.transform = `rotate(${rotation}deg)`;
      div.style.transformOrigin = "center";

      let innerHTML = `<img src="${icon}" width="25" height="45" style="position: absolute" />`;
      if (showLabel && label) {
        innerHTML += `
          <div style="
            position: absolute;
            top: 50px;
            left: 40%;
            transform: translateX(-50%);
            background: ${statusColor};
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            white-space: nowrap;
            pointer-events: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            z-index: 1000;
          ">
            ${label}
          </div>
        `;
      }
      div.innerHTML = innerHTML;
    }

    if (onClick) {
      div.style.cursor = "pointer";
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        onClick(e);
      });
    }

    const overlay = new google.maps.OverlayView();
    overlay.onAdd = function () {
      const panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(div);
    };

    overlay.draw = function () {
      const projection = this.getProjection();
      if (!projection) return;

      const pos = currentLatLngRef.current;
      const point = projection.fromLatLngToDivPixel(
        new google.maps.LatLng(pos.lat, pos.lng)
      );

      if (point) {
        const offset = isCluster ? parseInt(div.style.width) / 2 : 20;
        div.style.left = `${point.x - offset}px`;
        div.style.top = `${point.y - offset}px`;
      }
    };

    overlay.onRemove = function () {
      div.parentNode?.removeChild(div);
    };

    overlay.setMap(map);
    markerRef.current = overlay;
    divRef.current = div;

    return () => {
      overlay.setMap(null);
    };
  }, [map, google, icon, rotation, onClick, label, showLabel, statusColor, isCluster, count]);

  // Animate position update
  useEffect(() => {
    let animationFrameId;
    const duration = 1000; // 1 second for smooth transition
    const startTime = performance.now();
    const startLatLng = currentLatLngRef.current;
    const endLatLng = position;

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const lat =
        startLatLng.lat + (endLatLng.lat - startLatLng.lat) * progress;
      const lng =
        startLatLng.lng + (endLatLng.lng - startLatLng.lng) * progress;

      currentLatLngRef.current = { lat, lng };

      if (markerRef.current) markerRef.current.draw();

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  return null;
};

export default CustomMarker;
