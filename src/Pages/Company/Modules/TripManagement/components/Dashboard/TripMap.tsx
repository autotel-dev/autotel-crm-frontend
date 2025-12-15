import React, { Component } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";

interface TripMapProps {
  google: any;
}

interface TripMapState {
  markers: Array<{
    lat: number;
    lng: number;
    name: string;
  }>;
}

class TripMap extends Component<TripMapProps, TripMapState> {
  constructor(props: TripMapProps) {
    super(props);
    this.state = {
      markers: [
        // Default marker for Islamabad, Pakistan
        {
          lat: 33.6844,
          lng: 73.0479,
          name: "Islamabad",
        },
      ],
    };
  }

  render() {
    const { google } = this.props;

    if (!google) {
      return <div>Loading map...</div>;
    }

    return (
      <Map
        google={google}
        zoom={12}
        style={{
          width: "96%",
          height: "84%",
          position: "relative",
          borderRadius: "10px",
        }}
        initialCenter={{
          lat: 33.6844,
          lng: 73.0479,
        }}
        center={{
          lat: 33.6844,
          lng: 73.0479,
        }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34",
})(TripMap);
