import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import Swal from "sweetalert2";
import "./SingleVehicleDetails.css";
import { useSelector } from "react-redux";
import { getAll } from "../../../../../../Utilities/api";
import { TODAY_VEHICLE_ACTIVITY } from "../../../../../../Utilities/api/apiEndpoints";

const SingleVehicleDetails = () => {
  const { selectedSingleDevice } = useSelector((state) => state.monitoring);

  const [activeButton, setActiveButton] = useState("vehicleInfo");
  const [currentData, setCurrentData] = useState({});
  const [loading, setLoading] = useState(false);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Handle Today Activity Button
  const handleTodayActivity = async () => {
    setLoading(true);
    try {
      const response = await getAll({
        url: `${TODAY_VEHICLE_ACTIVITY}/${selectedSingleDevice?.device?.deviceId}`,
      });
      if (!response || !response.success) {
        Swal.fire({
          text: response?.message || "No activity found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
      const todayActivityData = response.data;
      setCurrentData(todayActivityData);
    } catch (error) {
      Swal.fire({
        text: "Error fetching activity data",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Trigger Today Activity API only if the button is active
    if (selectedSingleDevice && activeButton === "todayActivity") {
      handleTodayActivity();
    }
  }, [selectedSingleDevice, activeButton]); // Dependency includes selectedSingleDevice and activeButton

  useEffect(() => {
    // Update the current data when the device changes
    if (selectedSingleDevice) {
      setCurrentData(selectedSingleDevice || {});
    }
  }, [selectedSingleDevice]);

  return (
    <Card
      style={{
        borderRadius: "5px",
        marginTop: "-35px",
        width: "400px",
        // marginLeft: "-12px",
      }}
    >
      <CardHeader
        style={{
          padding: "0px 0px 0px 2px",
          margin: "0px",
          borderRadius: "5px",
        }}
      >
        <div style={{ display: "flex", fontSize: "11px" }}>
          <button
            onClick={() => setActiveButton("vehicleInfo")}
            className={`custom-button ${
              activeButton === "vehicleInfo" ? "active" : ""
            }`}
          >
            Vehicle Info
          </button>
          <button
            onClick={() => setActiveButton("trackerInfo")}
            className={`custom-button ${
              activeButton === "trackerInfo" ? "active" : ""
            }`}
          >
            Tracker Info
          </button>
          <button
            onClick={() => {
              setActiveButton("todayActivity");
              handleTodayActivity();
            }}
            className={`custom-button ${
              activeButton === "todayActivity" ? "active" : ""
            }`}
          >
            Today Activity
          </button>
          <button
            onClick={() => setActiveButton("powerInfo")}
            className={`custom-button ${
              activeButton === "powerInfo" ? "active" : ""
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveButton("sensorInfo")}
            className={`custom-button ${
              activeButton === "sensorInfo" ? "active" : ""
            }`}
          >
            Reports
          </button>
        </div>
      </CardHeader>

      <CardBody
        style={{
          height: "262px",
          overflowY: "auto",
          padding: "0",
          scrollbarWidth: "none",
        }}
      >
        {loading ? (
          <div className="loader-box">
            <div className="loader-19"></div>
          </div>
        ) : activeButton === "todayActivity" && currentData ? (
          <ListGroup flush>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Average Speed:</strong>
              <span>{currentData.avgSpeed?.toFixed(2) || 0} km/h</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Maximum Speed:</strong>
              <span>{currentData.maxSpeed || 0} km/h</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Status Durations:</strong>
              <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                {currentData.statusDurations?.map((status, index) => (
                  <li
                    key={index}
                    style={{ fontSize: "12px", marginBottom: "5px" }}
                  >
                    <strong>{status.status}:</strong>{" "}
                    {status.timeInHours.toFixed(2)} hours
                  </li>
                ))}
              </ul>
            </ListGroupItem>
          </ListGroup>
        ) : activeButton === "vehicleInfo" ? (
          <ListGroup flush>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Vehicle Model</strong>
              <span>{selectedSingleDevice?.vehicle?.vehicleModel.name}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>OwnerShip name</strong>
              <span>{selectedSingleDevice?.vehicle?.ownershipName}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Protocol Type</strong>
              <span>{selectedSingleDevice?.vehicle?.deviceName}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Year</strong>
              <span>{selectedSingleDevice?.vehicle?.year}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Price</strong>
              <span>{selectedSingleDevice?.vehicle?.price}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Color</strong>
              <span>{selectedSingleDevice?.vehicle?.color}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>IMEI Number</strong>
              <span>{selectedSingleDevice?.vehicle?.imeiNumber}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Engine Number</strong>
              <span>{selectedSingleDevice?.vehicle?.engineNumber}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong> Registration Number</strong>
              <span>{selectedSingleDevice?.vehicle?.registrationNumber}</span>
            </ListGroupItem>
          </ListGroup>
        ) : activeButton === "trackerInfo" ? (
          <ListGroup flush>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Direction</strong>
              <span>{selectedSingleDevice?.device?.direction}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Longitude</strong>
              <span>{selectedSingleDevice?.device?.longitude}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Latitude</strong>
              <span>{selectedSingleDevice?.device?.latitude}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Packet Type</strong>
              <span>{selectedSingleDevice?.device?.packetType}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Server Time</strong>
              <span>
                {formatDateTime(selectedSingleDevice?.device?.serverTime)}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Time stamp</strong>
              <span>
                {formatDateTime(selectedSingleDevice?.device?.timestamp)}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>packet Length</strong>
              <span>{selectedSingleDevice?.device?.packetLength}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <strong>Satellite Count</strong>
              <span>
                {selectedSingleDevice?.device?.basicInfo?.satelliteCount}
              </span>
            </ListGroupItem>
          </ListGroup>
        ) : (
          ""
        )}
      </CardBody>
    </Card>
  );
};

export default SingleVehicleDetails;
