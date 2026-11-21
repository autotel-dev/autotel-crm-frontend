import React, { useCallback, useEffect, useRef, useState } from "react";
import { Map, GoogleApiWrapper, Circle, Polygon } from "google-maps-react";
import { GOOGLE_MAPS_OPTIONS } from "../../../../../../../../utils/googleMapsOptions";
import { useDispatch, useSelector } from "react-redux";
import {
  setCircle,
  setPolygon,
  setRectangle,
  setType,
} from "../../../../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import "./googleMapTrip.css";

const GoogleMapTrip = (props) => {
  const { type, circle, polygon, rectangle } = useSelector((state) => state.geofence);
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState(12);
  const [drawingMode, setDrawingMode] = useState(null);
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const overlaysRef = useRef([]);
  const rectangleOverlaysRef = useRef([]);

  // Get geofences from parent component
  const geofences = props.geofences || [];

  useEffect(() => {
    if (!props.google || !type) {
      setDrawingMode(null);
      return;
    }

    const google = props.google;
    let mode = null;

    if (type === "circle") {
      mode = google.maps.drawing.OverlayType.CIRCLE;
    } else if (type === "rectangle") {
      mode = google.maps.drawing.OverlayType.RECTANGLE;
    } else if (type === "polygon") {
      mode = google.maps.drawing.OverlayType.POLYGON;
    }

    setDrawingMode(mode);
  }, [type, props.google]);

  const zoomIn = () => {
    setZoom((prevZoom) => prevZoom + 1);
  };

  const zoomOut = () => {
    setZoom((prevZoom) => prevZoom - 1);
  };

  useEffect(() => {
    if (
      props.google &&
      props.google.maps &&
      props.google.maps.drawing &&
      mapRef.current
    ) {
      const google = props.google;

      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: drawingMode,
        drawingControl: false,
        circleOptions: {
          editable: true,
          draggable: true,
          strokeColor: "green",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "green",
          fillOpacity: 0.35,
        },
        rectangleOptions: {
          editable: true,
          draggable: true,
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "red",
          fillOpacity: 0.35,
        },
        polygonOptions: {
          editable: true,
          draggable: true,
          strokeColor: "blue",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "blue",
          fillOpacity: 0.35,
        },
      });

      drawingManager.setMap(mapRef.current.map);
      drawingManagerRef.current = drawingManager;

      google.maps.event.addListener(
        drawingManager,
        "overlaycomplete",
        (event) => {
          drawingManager.setDrawingMode(null);

          const overlay = event.overlay;
          overlaysRef.current.push(overlay);

          const handleOverlayEdit = () => {
            if (event.type === "circle") {
              const updatedCircle = {
                center: {
                  lat: overlay.getCenter().lat(),
                  lng: overlay.getCenter().lng(),
                },
                radius: overlay.getRadius(),
              };
              dispatch(setCircle(updatedCircle));
            } else if (event.type === "rectangle") {
              const bounds = overlay.getBounds();
              const ne = bounds.getNorthEast();
              const sw = bounds.getSouthWest();
              const updatedRectangle = {
                bounds: {
                  north: ne.lat(),
                  south: sw.lat(),
                  east: ne.lng(),
                  west: sw.lng(),
                },
              };
              dispatch(setRectangle(updatedRectangle));
            } else if (event.type === "polygon") {
              const updatedPath = overlay
                .getPath()
                .getArray()
                .map((latlng) => ({
                  lat: latlng.lat(),
                  lng: latlng.lng(),
                }));
              dispatch(setPolygon(updatedPath));
            }
          };

          // Add event listeners for editing the shapes
          if (event.type === "circle" || event.type === "rectangle" || event.type === "polygon") {
            google.maps.event.addListener(
              overlay,
              "radius_changed",
              handleOverlayEdit
            );
            google.maps.event.addListener(
              overlay,
              "bounds_changed",
              handleOverlayEdit
            );
            google.maps.event.addListener(
              overlay,
              "dragend",
              handleOverlayEdit
            );
            google.maps.event.addListener(overlay, "set_at", handleOverlayEdit);
            google.maps.event.addListener(
              overlay,
              "insert_at",
              handleOverlayEdit
            );
          }

          if (event.type === "circle") {
            const newCircle = {
              center: {
                lat: overlay.getCenter().lat(),
                lng: overlay.getCenter().lng(),
              },
              radius: overlay.getRadius(),
            };
            dispatch(setCircle(newCircle));
          } else if (event.type === "rectangle") {
            const bounds = overlay.getBounds();
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            const newRectangle = {
              bounds: {
                north: ne.lat(),
                south: sw.lat(),
                east: ne.lng(),
                west: sw.lng(),
              },
            };
            dispatch(setRectangle(newRectangle));
          } else if (event.type === "polygon") {
            const newPath = overlay
              .getPath()
              .getArray()
              .map((latlng) => ({
                lat: latlng.lat(),
                lng: latlng.lng(),
              }));
            dispatch(setPolygon(newPath));
          }
        }
      );
    }
  }, [props.google, dispatch, drawingMode]);

  useEffect(() => {
    if (drawingManagerRef.current && drawingMode !== undefined) {
      drawingManagerRef.current.setDrawingMode(drawingMode);
    }

    // Clear all overlays from the map when switching modes
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];
  }, [drawingMode]);

  const circleRef = useRef(null);
  const handleCircleChanged = useCallback(() => {
    if (circleRef.current) {
      const circleInstance = circleRef.current.circle;
      const newCenter = {
        lat: circleInstance.getCenter().lat(),
        lng: circleInstance.getCenter().lng(),
      };
      const newRadius = circleInstance.getRadius();
      dispatch(setCircle({ center: newCenter, radius: newRadius }));
    }
  }, [circleRef, dispatch]);

  const rectangleRef = useRef(null);
  const handleRectangleChanged = useCallback(() => {
    if (rectangleRef.current) {
      const rectangleInstance = rectangleRef.current;
      const bounds = rectangleInstance.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const newRectangle = {
        bounds: {
          north: ne.lat(),
          south: sw.lat(),
          east: ne.lng(),
          west: sw.lng(),
        },
      };
      dispatch(setRectangle(newRectangle));
    }
  }, [rectangleRef, dispatch]);

  const polygonRef = useRef(null);
  const handlePolygonEdit = useCallback(() => {
    if (polygonRef.current && polygonRef.current.polygon) {
      const polygonInstance = polygonRef.current.polygon;
      const newPath = polygonInstance
        .getPath()
        .getArray()
        .map((latlng) => ({
          lat: latlng.lat(),
          lng: latlng.lng(),
        }));
      dispatch(setPolygon(newPath));
    }
  }, [polygonRef, dispatch]);

  useEffect(() => {
    if (polygonRef.current && polygonRef.current.polygon) {
      const polygonInstance = polygonRef.current.polygon;

      // Add event listener for path changes
      window.google.maps.event.addListener(
        polygonInstance.getPath(),
        "set_at",
        handlePolygonEdit
      );

      window.google.maps.event.addListener(
        polygonInstance.getPath(),
        "insert_at",
        handlePolygonEdit
      );
      window.google.maps.event.addListener(
        polygonInstance.getPath(),
        "remove_at",
        handlePolygonEdit
      );
    }
  }, [polygonRef.current, handlePolygonEdit]);

  // Render rectangles imperatively since google-maps-react doesn't export Rectangle component
  useEffect(() => {
    if (!mapRef.current || !props.google) return;

    // Clear existing rectangle overlays
    rectangleOverlaysRef.current.forEach((rect) => rect.setMap(null));
    rectangleOverlaysRef.current = [];

    // Render checked rectangles
    const checkedRectangles = geofences.filter(
      (item) => item.checked && item.type === "rectangle"
    );

    checkedRectangles.forEach((geofenceItem) => {
      if (geofenceItem.geofencePositions?.bounds) {
        const rectangleInstance = new props.google.maps.Rectangle({
          bounds: geofenceItem.geofencePositions.bounds,
          editable: geofenceItem.edited,
          draggable: geofenceItem.edited,
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "red",
          fillOpacity: 0.35,
          map: mapRef.current.map,
        });

        rectangleOverlaysRef.current.push(rectangleInstance);

        if (geofenceItem.edited) {
          rectangleRef.current = rectangleInstance;

          props.google.maps.event.addListener(
            rectangleInstance,
            "bounds_changed",
            handleRectangleChanged
          );
          props.google.maps.event.addListener(
            rectangleInstance,
            "dragend",
            handleRectangleChanged
          );
        }
      }
    });

    return () => {
      rectangleOverlaysRef.current.forEach((rect) => rect.setMap(null));
      rectangleOverlaysRef.current = [];
    };
  }, [geofences, props.google, handleRectangleChanged]);

  if (!props.google) {
    return <div>Error: Google Maps API failed to load.</div>;
  }

  const renderGeofences = () => {
    return (
      type == null &&
      geofences
        ?.filter((item) => item.checked && item.type !== "rectangle") // Rectangles are rendered imperatively
        .map((geofenceItem, index) => {
          const key = `${geofenceItem._id}-${index}-${geofenceItem.edited}`;

          if (geofenceItem.type === "polygon") {
            return (
              <Polygon
                ref={polygonRef}
                key={key}
                paths={geofenceItem.geofencePositions.bounds}
                editable={geofenceItem.edited}
                draggable={geofenceItem.edited}
                options={{
                  strokeColor: "blue",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "blue",
                  fillOpacity: 0.35,
                }}
                onClick={handlePolygonEdit}
              />
            );
          } else if (geofenceItem.type === "circle") {
            return (
              <Circle
                ref={circleRef}
                key={key}
                center={geofenceItem.geofencePositions.center}
                radius={geofenceItem.geofencePositions.radius}
                editable={geofenceItem.edited}
                draggable={geofenceItem.edited}
                options={{
                  strokeColor: "black",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "black",
                  fillOpacity: 0.35,
                }}
                radius_changed={() => handleCircleChanged()}
                center_changed={() => handleCircleChanged()}
              />
            );
          }
          return null;
        })
    );
  };

  return (
    <div>
      {geofences && (
        <Map
          google={props.google}
          zoom={zoom}
          initialCenter={{ lat: 24.8607, lng: 67.0011 }}
          disableDefaultUI={true}
          ref={mapRef}
        >
          {renderGeofences()}

          {/* Custom Zoom Control */}
          {/* <div className="custom-zoom-control">
            <button onClick={zoomIn} className="zoom-button">
              +
            </button>
            <button onClick={zoomOut} className="zoom-button">
              -
            </button>
          </div> */}
        </Map>
      )}
    </div>
  );
};

export default GoogleApiWrapper(GOOGLE_MAPS_OPTIONS)(GoogleMapTrip);
