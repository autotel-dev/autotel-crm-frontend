import {
  Map,
  Marker,
  GoogleApiWrapper,
  InfoWindow,
  Polygon,
  Rectangle,
  Circle,
} from "google-maps-react";
import { GOOGLE_MAPS_OPTIONS } from "../../../../../../../utils/googleMapsOptions";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import LocationArrow from "../../../../../../../assets/deviceLocationArrow.png";

const Location = (props) => {
  const { modalData } = useSelector((state) => state.alerts);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const mapRef = useRef(null);
  const polygonRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleMarkerClick = (props, marker) => {
    // console.log("marker", marker);
    setActiveMarker(marker);
    setShowInfoWindow(true);
  };

  useEffect(() => {
    if (modalData && modalData.alertEvent) {
      handleMarkerClick();
    }
  }, [modalData]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Load the static image
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = LocationArrow;

    img.onload = () => {
      // Calculate canvas dimensions to accommodate rotated image
      const canvasWidth = Math.max(img.width, img.height);
      const canvasHeight = canvasWidth;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Rotate and draw image
      context.translate(canvas.width / 2, canvas.height / 2);

      context.rotate((modalData.alertEvent.course * Math.PI) / 180);
      context.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );

      // Convert canvas to data URL
      const rotatedIconUrl = canvas.toDataURL();

      const markerInstance = new window.google.maps.Marker({
        position: {
          lat: parseFloat(modalData.alertEvent.location.coordinates[0]),
          lng: parseFloat(modalData.alertEvent.location.coordinates[1]),
        },
        map: mapRef.current.map,
        icon: {
          url: rotatedIconUrl,
          scaledSize: new window.google.maps.Size(canvasWidth, canvasHeight),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div>
        <h3>Device Info</h3>
        <br />
       
        <p>
          <span style={{ fontWeight: "bold" }}>Device Name: </span>
          <span>${modalData.alertEvent.deviceName}</span>
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>LatLng: </span>
          <a href="https://www.google.com/maps/search/?api=1&query=${
            modalData?.alertEvent?.location?.coordinates[0]
          },${
          modalData?.alertEvent?.location?.coordinates[1]
        }" target="_blank">${parseFloat(
          modalData.alertEvent?.location?.coordinates[0]
        ).toFixed(6)},${parseFloat(
          modalData.alertEvent?.location?.coordinates[1]
        ).toFixed(6)}</a>
        </p>
      </div>`,
      });

      markerInstance.addListener("click", () => {
        infoWindow.open(mapRef.current.map, markerInstance);
      });
    };
  }, [modalData, props.google]);

  // if (!props.google) {
  //   return <div>Error: Google Maps API failed to load.</div>;
  // }

  if (!props.google || !modalData || !modalData.alertEvent) {
    return (
      <div>Error: Google Maps API failed to load or no data available.</div>
    );
  }

  const renderGeofences = () => {
    if (!modalData || !modalData.alertEvent) return null;

    const geofences = [];

    // If geofenceId is an object, push it into geofences array
    if (modalData.alertEvent.geofenceId) {
      geofences.push(modalData.alertEvent.geofenceId);
    }

    // If vehicle has geofences array, push them as well
    if (modalData.alertEvent.vehicle?.geofences?.length > 0) {
      geofences.push(...modalData.alertEvent.vehicle.geofences);
    }

    return geofences.map((geofence) => {
      const { type, geofencePositions, _id } = geofence;

      if (type === "circle") {
        return (
          <Circle
            key={_id}
            center={geofencePositions.center}
            radius={geofencePositions.radius}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: 0.35,
            }}
          />
        );
      }

      if (type === "polygon") {
        return (
          <Polygon
            key={_id}
            paths={geofencePositions.bounds}
            options={{
              strokeColor: "#0000FF",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#0000FF",
              fillOpacity: 0.35,
            }}
          />
        );
      }

      if (type === "rectangle") {
        const bounds = new window.google.maps.LatLngBounds(
          {
            lat: geofencePositions.bounds.south,
            lng: geofencePositions.bounds.west,
          },
          {
            lat: geofencePositions.bounds.north,
            lng: geofencePositions.bounds.east,
          }
        );

        return (
          <Rectangle
            key={_id}
            bounds={bounds}
            options={{
              strokeColor: "#00FF00",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#00FF00",
              fillOpacity: 0.35,
            }}
          />
        );
      }

      return null;
    });
  };

  return (
    <div className="map-container">
      <Map
        google={props.google}
        zoom={14}
        initialCenter={{
          lat: parseFloat(modalData.alertEvent.location.coordinates[0]),
          lng: parseFloat(modalData.alertEvent.location.coordinates[1]),
        }}
        disableDefaultUI={false}
        style={{ height: "88%", width: "97%", overflow: "unset" }}
        ref={mapRef}
      >
        {renderGeofences()}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper(GOOGLE_MAPS_OPTIONS)(Location);
