import React, { useEffect, useRef } from "react";

const CustomMarker = ({ map, google, position, icon, rotation, onClick }) => {
  const markerRef = useRef(null);
  const divRef = useRef(null);
  const currentLatLngRef = useRef(position);

  useEffect(() => {
    if (!map || !google) return;

    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = "40px";
    div.style.height = "40px";
    div.style.transform = `rotate(${rotation}deg)`;
    div.style.transformOrigin = "center";
    div.innerHTML = `<img src="${icon}" width="25" height="45" style="position: absolute" />`;

    if (onClick) {
      div.style.cursor = "pointer";
      div.addEventListener("click", onClick);
    }

    const overlay = new google.maps.OverlayView();
    overlay.onAdd = function () {
      const panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(div);
    };

    overlay.draw = function () {
      const projection = this.getProjection();
      if (!projection) return;

      const point = projection.fromLatLngToDivPixel(
        new google.maps.LatLng(
          currentLatLngRef.current.lat,
          currentLatLngRef.current.lng
        )
      );

      if (point) {
        div.style.left = `${point.x - 20}px`;
        div.style.top = `${point.y - 20}px`;
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
  }, [map, google, icon, rotation, onClick]);

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

// import React, { useEffect, useRef } from "react";

// const CustomMarker = ({ map, google, position, icon, rotation, onClick }) => {
//   const markerRef = useRef(null);

//   useEffect(() => {
//     if (!map || !google) return;

//     // Create a div for custom marker
//     const div = document.createElement("div");
//     div.style.position = "absolute";
//     div.style.width = "40px";
//     div.style.height = "40px";
//     div.style.transform = `rotate(${rotation}deg)`;
//     div.style.transformOrigin = "center";
//     div.innerHTML = `<img src="${icon}" width="25" height="45" style="position: absolute" />`;

//     // Click event handler
//     if (onClick) {
//       div.style.cursor = "pointer";
//       div.addEventListener("click", onClick);
//     }

//     // Create custom overlay
//     const overlay = new google.maps.OverlayView();
//     overlay.onAdd = function () {
//       const panes = this.getPanes();
//       panes.overlayMouseTarget.appendChild(div);
//     };

//     overlay.draw = function () {
//       const projection = this.getProjection();
//       if (!projection) return;

//       const point = projection.fromLatLngToDivPixel(
//         new google.maps.LatLng(position.lat, position.lng)
//       );

//       if (point) {
//         div.style.left = `${point.x - 20}px`;
//         div.style.top = `${point.y - 20}px`;
//       }
//     };

//     overlay.onRemove = function () {
//       div.parentNode?.removeChild(div);
//     };

//     overlay.setMap(map);
//     markerRef.current = overlay;

//     return () => {
//       overlay.setMap(null);
//     };
//   }, [map, google, position, icon, rotation, onClick]);

//   return null;
// };

// export default CustomMarker;

// -------------------------------------------------------------

// import React, { useEffect, useRef } from "react";

// const CustomMarker = ({ map, google, position, icon, rotation, onClick }) => {
//   const markerRef = useRef(null);

//   useEffect(() => {
//     if (!map || !google) return;

//     // Create a div for custom marker
//     const div = document.createElement("div");
//     div.style.position = "absolute";
//     div.style.width = "40px";
//     div.style.height = "40px";
//     div.style.transform = `rotate(${rotation + 30}deg)`;
//     div.style.transformOrigin = "center";
//     div.innerHTML = `<img src="${icon}" width="25" height="40" style="position: absolute; transform: rotate(${
//       rotation + 30
//     }deg);" />`;

//     // Create custom overlay
//     const overlay = new google.maps.OverlayView();
//     overlay.onAdd = function () {
//       const panes = this.getPanes();
//       panes.overlayMouseTarget.appendChild(div);
//     };

//     overlay.draw = function () {
//       const projection = this.getProjection();
//       if (!projection) return;

//       const point = projection.fromLatLngToDivPixel(
//         new google.maps.LatLng(position.lat, position.lng)
//       );

//       if (point) {
//         div.style.left = `${point.x - 20}px`;
//         div.style.top = `${point.y - 20}px`;
//       }
//     };

//     overlay.onRemove = function () {
//       div.parentNode.removeChild(div);
//     };

//     overlay.setMap(map);
//     markerRef.current = overlay;

//     return () => {
//       overlay.setMap(null);
//     };
//   }, [map, google, position, icon, rotation]);

//   return null;
// };

// export default CustomMarker;
