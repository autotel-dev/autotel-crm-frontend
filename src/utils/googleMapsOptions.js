// One set of Google Maps loader options for every map in the app.
// google-maps-react caches the Maps script by its URL, so when every map asks
// for the same key and libraries the script is loaded once per visit. Different
// options per map (or the old keyless <script> in public/index.html) made the
// browser load Google Maps twice, which crashed Trip Planning and logged
// "You have included the Google Maps JavaScript API multiple times".
//
// Version is pinned to 3.64: Google removed the drawing tool (DrawingManager)
// from Maps 3.65 onwards, and Trip Planning and Geofence use it to draw shapes.
// Google will retire 3.64 eventually; the drawing code must then move to a
// replacement such as Terra Draw. Until then canUseDrawingManager() keeps those
// pages working (without drawing) instead of crashing.
export const GOOGLE_MAPS_OPTIONS = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  libraries: ["drawing"],
  version: "3.64",
};

let drawingSupported;
export const canUseDrawingManager = (google) => {
  if (drawingSupported !== undefined) return drawingSupported;
  try {
    new google.maps.drawing.DrawingManager({});
    drawingSupported = true;
  } catch (error) {
    console.warn("Google Maps drawing tools are not available:", error.message);
    drawingSupported = false;
  }
  return drawingSupported;
};
