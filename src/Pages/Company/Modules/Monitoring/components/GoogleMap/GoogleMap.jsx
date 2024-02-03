import React from "react";
import { Map, Marker, GoogleApiWrapper, Circle } from "google-maps-react";
import { useSelector } from "react-redux";
const markers = [
  {
    id: 1,
    name: "Ocean Mall",
    position: { lat: 24.8239, lng: 67.0356 },
  },
  {
    id: 2,
    name: "Atrium Mall",
    position: { lat: 24.8561, lng: 67.0303 },
  },
  {
    id: 3,
    name: "MindFlare Technologies",
    position: { lat: 24.8511, lng: 67.0168 },
  },
];
const GoogleMap = (props) => {
  const { devices, serverDevices } = useSelector((state) => state.monitoring);
  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }
  var points = [
    { lat: 24.8561, lng: 67.0303 },
    { lat: 24.8239, lng: 67.0356 },
    { lat: 24.8511, lng: 67.0168 },
  ];

  var bounds = new props.google.maps.LatLngBounds();
  for (var i = 0; i < points.length; i++) {
    bounds.extend(points[i]);
  }

  return (
    <Map
      google={props.google}
      zoom={12}
      initialCenter={{ lat: 24.8607, lng: 67.0011 }}
      bounds={bounds}
      disableDefaultUI={false} // Enable default UI controls
      streetViewControl={true} // Enable street view control
      mapTypeControl={true} // Enable map type control
      fullscreenControl={true} // Enable fullscreen control
      zoomControl={true} // Enable zoom control
    >

{serverDevices.map((marker) => (
        <Marker
          key={marker.id}
          name={marker.title}
          position={{lat: marker.lat, lng:marker.lng}}
          icon={{
            url: `https://track.autotel.pk/images/device_icons/6458fc3c197fd8.82606871_offline.png`, // Specify the URL of your custom marker image
            scaledSize: new window.google.maps.Size(25, 40), // Adjust the size of the marker image as needed
          }}
        />
      ))}

      {/* {devices.map((item, index) => (
         <div key={index}>
          {markers.map((markerItem, markerIndex) => {
            console.log({
              lat: markerItem.lat,
              lng: markerItem.lng,
              path: markerItem.icon.path,
            });

             return <Marker
              key={markerIndex}
              name={markerItem.name}
              position={markerItem.position}
              icon={{
                url: `https://track.autotel.pk/${markerItem.icon.path}`, // Specify the URL of your custom marker image
                scaledSize: new window.google.maps.Size(100, 100), // Adjust the size of the marker image as needed
              }}
            />;

          })}


        </div>
      ))} */}
    </Map>
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
