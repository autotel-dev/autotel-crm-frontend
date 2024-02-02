import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
const markers = [
  {
    id: 1,
    name: "Qobustan",
    position: { lat: 40.0709493, lng: 49.3694411 },
  },
  {
    id: 2,
    name: "Sumqayit",
    position: { lat: 40.5788843, lng: 49.5485073 },
  },
  {
    id: 3,
    name: "Baku",
    position: { lat: 40.3947365, lng: 49.6898045 },
  },
];

const GoogleMap = (props: any) => {
  return (
    <Map
      google={props.google}
      zoom={14}
      initialCenter={{ lat: 24.8607, lng: 67.0011 }}
    ></Map>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(GoogleMap);

// const Map = () => {
//     const { isLoaded } = useLoadScript({
//         id: "google-map-script",
//         googleMapsApiKey:
//           "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
//     });

// //   const [activeMarker, setActiveMarker] = useState(null);

// //   const handleActiveMarker = (marker) => {
// //     if (marker === activeMarker) {
// //       return;
// //     }
// //     setActiveMarker(marker);
// //   };
//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       {isLoaded ? (
//         <GoogleMap
//           center={{ lat: 37.7749, lng: -122.4194 }}
//           zoom={10}
//           mapContainerStyle={{ width: "100%", height: "100vh" }}
//         >
//           {/* Markers Here */}
//           {/* <MarkerF position={{ lat: 37.7749, lng: -122.4194 }}></MarkerF> */}
//         </GoogleMap>
//       ) : "loading aa sahb"}
//     </div>
//   );
// };

// export default Map;
