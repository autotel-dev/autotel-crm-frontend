// One set of Google Maps loader options for every map in the app.
// google-maps-react caches the Maps script by its URL, so when every map asks
// for the same key and libraries the script is loaded once per visit. Different
// options per map (or the old keyless <script> in public/index.html) made the
// browser load Google Maps twice, which crashed Trip Planning and logged
// "You have included the Google Maps JavaScript API multiple times".
export const GOOGLE_MAPS_OPTIONS = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  libraries: ["drawing"],
};
