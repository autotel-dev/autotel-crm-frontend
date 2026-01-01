import React, { Component } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";

interface CheckpointMapProps {
  google: any;
  geofenceData: any;
}

interface CheckpointMapState {
  overlay: any;
}

class CheckpointMap extends Component<CheckpointMapProps, CheckpointMapState> {
  mapRef: any = null;
  overlays: any[] = [];

  constructor(props: CheckpointMapProps) {
    super(props);
    this.state = {
      overlay: null,
    };
  }

  componentDidUpdate(prevProps: CheckpointMapProps) {
    // Redraw overlay if geofenceData changes
    if (prevProps.geofenceData !== this.props.geofenceData) {
      this.clearOverlays();
      this.drawGeofence();
    }
  }

  componentWillUnmount() {
    this.clearOverlays();
  }

  clearOverlays = () => {
    this.overlays.forEach((overlay) => {
      if (overlay && overlay.setMap) {
        overlay.setMap(null);
      }
    });
    this.overlays = [];
  };

  onMapReady = (mapProps: any, map: any) => {
    this.mapRef = map;
    this.drawGeofence();
  };

  getGeofenceCenter = () => {
    const { geofenceData } = this.props;

    if (!geofenceData || !geofenceData.geofencePositions) {
      return { lat: 24.8607, lng: 67.0011 }; // Default: Karachi
    }

    if (geofenceData.type === "polygon") {
      const bounds = geofenceData.geofencePositions.bounds;
      if (!bounds || bounds.length === 0) {
        return { lat: 24.8607, lng: 67.0011 };
      }

      // Calculate center of polygon
      const latSum = bounds.reduce(
        (sum: number, point: any) => sum + point.lat,
        0
      );
      const lngSum = bounds.reduce(
        (sum: number, point: any) => sum + point.lng,
        0
      );

      return {
        lat: latSum / bounds.length,
        lng: lngSum / bounds.length,
      };
    } else if (geofenceData.type === "rectangle") {
      const bounds = geofenceData.geofencePositions.bounds;
      if (!bounds) {
        return { lat: 24.8607, lng: 67.0011 };
      }

      // Calculate center of rectangle
      return {
        lat: (bounds.north + bounds.south) / 2,
        lng: (bounds.east + bounds.west) / 2,
      };
    } else if (geofenceData.type === "circle") {
      const center = geofenceData.geofencePositions.center;
      if (!center) {
        return { lat: 24.8607, lng: 67.0011 };
      }

      // Return center of circle
      return {
        lat: center.lat,
        lng: center.lng,
      };
    }

    return { lat: 24.8607, lng: 67.0011 };
  };

  drawGeofence = () => {
    const { google, geofenceData } = this.props;

    if (
      !this.mapRef ||
      !google ||
      !geofenceData ||
      !geofenceData.geofencePositions
    ) {
      return;
    }

    this.clearOverlays();

    if (geofenceData.type === "polygon") {
      const paths = geofenceData.geofencePositions.bounds;
      if (!paths || paths.length === 0) return;

      const polygon = new google.maps.Polygon({
        paths: paths,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#0000FF",
        fillOpacity: 0.35,
      });

      polygon.setMap(this.mapRef);
      this.overlays.push(polygon);
    } else if (geofenceData.type === "rectangle") {
      const bounds = geofenceData.geofencePositions.bounds;
      if (!bounds) return;

      const rectangle = new google.maps.Rectangle({
        bounds: bounds,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#0000FF",
        fillOpacity: 0.35,
      });

      rectangle.setMap(this.mapRef);
      this.overlays.push(rectangle);
    } else if (geofenceData.type === "circle") {
      const center = geofenceData.geofencePositions.center;
      const radius = geofenceData.geofencePositions.radius;

      if (!center || !radius) return;

      const circle = new google.maps.Circle({
        center: center,
        radius: radius,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#0000FF",
        fillOpacity: 0.35,
      });

      circle.setMap(this.mapRef);
      this.overlays.push(circle);
    }
  };

  render() {
    const { google } = this.props;

    if (!google) {
      return (
        <div
          style={{
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          Loading map...
        </div>
      );
    }

    const center = this.getGeofenceCenter();

    return (
      <div style={{ position: "relative", height: "300px", width: "100%" }}>
        <Map
          google={google}
          zoom={16}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            borderRadius: "8px",
          }}
          initialCenter={center}
          center={center}
          onReady={this.onMapReady}
        />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(CheckpointMap);
