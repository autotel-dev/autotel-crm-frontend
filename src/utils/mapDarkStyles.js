// Google Maps style for the dark (C4 Midnight) theme. Shared by Control Room
// and the complaint pop-up. Loading background colour: #1b1a2e.
export const DARK_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#1b1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#b4b4d4" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a12" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#34315c" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4a4590" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1a3a" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];
export const isDarkTheme = () => document.body.classList.contains("at-dark");
