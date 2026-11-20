import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Map, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import "../GoogleMap/googleMap.css";
import { Card, Button } from "reactstrap";
import { FaArrowLeft, FaMapMarkerAlt, FaCar, FaClock, FaTachometerAlt } from "react-icons/fa";
import carIconOnline from "../../../monitoring-assets/online-icon.png";
import carIconStop from "../../../monitoring-assets/stop-icon.png";
import carIconIdle from "../../../monitoring-assets/idle-icon.png";
import carIcon from "../../../monitoring-assets/deviceLocationArrow.png";
import CustomMarker from "../GoogleMap/customMarker/CustomMarker";

const LiveVehicleMonitoring = ({ google }: any) => {
    const { registration } = useParams();
    const navigate = useNavigate();
    const { devices } = useSelector((state: any) => state.monitoring);
    const mapRef = useRef<any>(null);

    const [address, setAddress] = useState("Loading location address...");
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [showingInfoWindow, setShowingInfoWindow] = useState(true);

    const device = useMemo(() => {
        return devices.find((d: any) => d?.vehicle?.registrationNo === registration);
    }, [devices, registration]);

    // Format address from coordinates
    const fetchAddress = async (lat: number, lng: number) => {
        if (!lat || !lng) return;
        setIsLoadingAddress(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                { headers: { "User-Agent": "AutotelCRM/1.0" } }
            );
            if (response.ok) {
                const data = await response.json();
                setAddress(data.display_name || "Address not found");
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            setAddress("Unable to fetch address");
        } finally {
            setIsLoadingAddress(false);
        }
    };

    useEffect(() => {
        if (device?.latestPosition?.latitude && device?.latestPosition?.longitude) {
            fetchAddress(device.latestPosition.latitude, device.latestPosition.longitude);
        }
    }, [device?.latestPosition?.latitude, device?.latestPosition?.longitude]);

    if (!device) {
        return (
            <div style={{ padding: "100px", textAlign: "center", marginTop: "50px" }}>
                <Card style={{ maxWidth: "500px", margin: "0 auto", padding: "40px", boxShadow: "0 4px 15px rgba(109, 191, 184, 0.4)" }}>
                    <FaCar size={50} color="#6dbfb8" style={{ marginBottom: "20px" }} />
                    <h3>Vehicle Not Found</h3>
                    <p>The vehicle with registration <strong>{registration}</strong> could not be located in the current monitoring session.</p>
                    <Button color="primary" onClick={() => navigate(-1)} style={{ backgroundColor: "#6dbfb8", border: "none" }}>
                        Go Back
                    </Button>
                </Card>
            </div>
        );
    }

    // Precise coordinates matching system structure
    const position = {
        lat: device.latestPosition?.latitude || 33.6844,
        lng: device.latestPosition?.longitude || 73.0479
    };

    const getStatusIcon = () => {
        switch (device.mainVehicleStatus?.toLowerCase()) {
            case "moving": return carIconOnline;
            case "stopped": return carIconStop;
            case "idle": return carIconIdle;
            default: return carIcon;
        }
    };

    // Cast components for TS compatibility
    const MapComp = Map as any;
    const InfoWindowComp = InfoWindow as any;
    const CustomMarkerComp = CustomMarker as any;

    return (
        <div style={{ height: "100vh", width: "100%", position: "fixed", top: 0, left: 0, zIndex: 1050, backgroundColor: "#f8fafa", display: "flex", flexDirection: "column" }}>
            {/* Professional Header matching system theme */}
            <div style={{
                height: "80px",
                background: "linear-gradient(135deg, #6dbfb8 0%, #5aa9a2 100%)",
                display: "flex",
                alignItems: "center",
                padding: "0 25px",
                color: "white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                justifyContent: "space-between"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "10px", borderRadius: "50%", display: "flex", cursor: "pointer" }}
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "bold", letterSpacing: "1px" }}>{device.vehicle?.registrationNo}</h2>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", opacity: 0.9 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <FaMapMarkerAlt /> {isLoadingAddress ? "Loading..." : address.split(',').slice(0, 3).join(',')}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "30px" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "10px", opacity: 0.8, textTransform: "uppercase" }}>Status</div>
                        <div style={{ fontWeight: "bold", textTransform: "capitalize" }}>{device.mainVehicleStatus || "N/A"}</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "10px", opacity: 0.8, textTransform: "uppercase" }}>Speed</div>
                        <div style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                            <FaTachometerAlt size={12} /> {Number(device.latestPosition?.speed || 0).toFixed(1)} km/h
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "10px", opacity: 0.8, textTransform: "uppercase" }}>Last Update</div>
                        <div style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                            <FaClock size={12} /> {device.latestPosition?.deviceTime ? new Date(device.latestPosition.deviceTime).toLocaleTimeString() : "N/A"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Full screen Map with rotated custom marker */}
            <div style={{ flex: 1, position: "relative" }}>
                <MapComp
                    google={google}
                    zoom={17}
                    initialCenter={position}
                    center={position}
                    ref={mapRef}
                    style={{ width: "100%", height: "100%" }}
                    containerStyle={{ width: "100%", height: "100%" }}
                    gestureHandling="greedy"
                >
                    <CustomMarkerComp
                        google={google}
                        map={mapRef.current?.map}
                        position={position}
                        icon={getStatusIcon()}
                        rotation={device.latestPosition?.course || 0}
                        label={device.vehicle?.registrationNo}
                        showLabel={true}
                        onClick={() => setShowingInfoWindow(!showingInfoWindow)}
                        statusColor={device.mainVehicleStatus?.toLowerCase() === "moving" ? "green" : "red"}
                    />

                    <InfoWindowComp
                        position={position}
                        visible={showingInfoWindow}
                        onClose={() => setShowingInfoWindow(false)}
                    >
                        <div style={{ padding: "10px", minWidth: "220px", fontFamily: "inherit" }}>
                            <h5 style={{ color: "#6dbfb8", marginBottom: "8px", fontWeight: "bold" }}>{device.vehicle?.registrationNo}</h5>
                            <div style={{ fontSize: "13px", color: "#666", display: "flex", flexDirection: "column", gap: "6px" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                    <FaMapMarkerAlt color="#6dbfb8" style={{ marginTop: "3px" }} />
                                    <span style={{ lineHeight: "1.4" }}>{address}</span>
                                </div>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "5px",
                                    borderTop: "1px solid #eee",
                                    paddingTop: "8px"
                                }}>
                                    <span><strong>Speed:</strong> {Number(device.latestPosition?.speed || 0).toFixed(1)} km/h</span>
                                    <span><strong>Direction:</strong> {Math.round(device.latestPosition?.course || 0)}°</span>
                                </div>
                                <div style={{ fontSize: "11px", color: "#999" }}>
                                    <strong>Updated:</strong> {device.latestPosition?.deviceTime ? new Date(device.latestPosition.deviceTime).toLocaleString() : "N/A"}
                                </div>
                            </div>
                        </div>
                    </InfoWindowComp>
                </MapComp>
            </div>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""),
})(LiveVehicleMonitoring);
