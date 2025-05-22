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
  // const handleTodayActivity = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await getAll({
  //       url: `${TODAY_VEHICLE_ACTIVITY}/${selectedSingleDevice?.device?.deviceId}`,
  //     });
  //     if (!response || !response.success) {
  //       Swal.fire({
  //         text: response?.message || "No activity found",
  //         icon: "error",
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });
  //       return;
  //     }
  //     const todayActivityData = response.data;
  //     setCurrentData(todayActivityData);
  //   } catch (error) {
  //     Swal.fire({
  //       text: "Error fetching activity data",
  //       icon: "error",
  //       timer: 2000,
  //       showConfirmButton: false,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // Trigger Today Activity API only if the button is active
    // if (selectedSingleDevice && activeButton === "todayActivity") {
    //   handleTodayActivity();
    // }
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
        minWidth: "100%",
        maxWidth: "100%",
        backgroundColor: "#99A6A7",
      }}
    >
      <CardHeader
        style={{
          padding: "0px 0px 0px 2px",
          margin: "0px",
          borderRadius: "5px",
          backgroundColor: "#99A6A7",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "11px",
            width: "99%",
            overflowX: "scroll",
            borderBottom: "2px solid black",
            WebkitOverflowScrolling: "touch", // Smooth scrolling on mobile
            scrollbarWidth: "none", // Firefox
            paddingTop: "5px",
            paddingBottom: "5px",
            backgroundColor: "#99A6A7",
          }}
          className="hide-scrollbar"
        >
          <button
            onClick={() => setActiveButton("vehicleInfo")}
            className={`custom-button ${
              activeButton === "vehicleInfo" ? "active" : ""
            }`}
          >
            Vehicle Info
          </button>
          <button
            onClick={() => setActiveButton("customerInfo")}
            className={`custom-button ${
              activeButton === "customerInfo" ? "active" : ""
            }`}
          >
            Customer Info
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
              // handleTodayActivity();
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
          maxHeight: "36.5vh",
          minHeight: "36.5vh",
          overflowY: "auto",
          padding: "0",
          scrollbarWidth: "none",
          borderRadius: "5px",
          backgroundColor: "#99A6A7",
        }}
      >
        {loading ? (
          <div className="loader-box">
            <div className="loader-19"></div>
          </div>
        ) : activeButton === "todayActivity" && currentData ? (
          <ListGroup flush style={{ backgroundColor: "#99A6A7" }}>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Average Speed:</strong>
              <span>{currentData.avgSpeed?.toFixed(2) || 0} km/h</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                backgroundColor: "#99A6A7",
                borderBottom: "1px solid gray",
              }}
            >
              <strong>Maximum Speed:</strong>
              <span>{currentData.maxSpeed || 0} km/h</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                backgroundColor: "#99A6A7",
              }}
            >
              <strong>Status Durations:</strong>
              <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                {currentData.statusDurations?.map((status, index) => (
                  <li
                    key={index}
                    style={{ fontSize: "11px", marginBottom: "5px" }}
                  >
                    <strong>{status.status}:</strong>{" "}
                    {status.timeInHours.toFixed(2)} hours
                  </li>
                ))}
              </ul>
            </ListGroupItem>
          </ListGroup>
        ) : activeButton === "vehicleInfo" ? (
          <ListGroup flush style={{ backgroundColor: "#99A6A7" }}>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong> Registration Number</strong>
              <span>{selectedSingleDevice?.vehicleInfo?.registrationNo}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Vehicle Model</strong>
              <span>{selectedSingleDevice?.vehicleInfo?.model?.name}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Vehicle Make</strong>
              <span>{selectedSingleDevice?.vehicleInfo?.make?.name}</span>
            </ListGroupItem>

            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Year</strong>
              <span>{selectedSingleDevice?.vehicleInfo?.year}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Package Price</strong>
              <span>
                {
                  selectedSingleDevice?.vehicleInfo
                    ?.servicePackageDiscountedCharges
                }
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Color</strong>
              <span>{selectedSingleDevice?.vehicleInfo?.color}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>IMEI Number</strong>
              <span>{selectedSingleDevice?.vehicleInfo?.imei}</span>
            </ListGroupItem>

            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Chasis Number</strong>
              <span>{selectedSingleDevice?.vehicleInfo?.chasisNo}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Engine Number</strong>
              <span>{selectedSingleDevice?.vehicleInfo?.engineNo}</span>
            </ListGroupItem>
          </ListGroup>
        ) : activeButton === "customerInfo" ? (
          <ListGroup flush style={{ backgroundColor: "#99A6A7" }}>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong> Name</strong>
              <span>
                {selectedSingleDevice?.vehicleInfo?.customer?.fullName}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong> Email Address</strong>
              <span>
                {selectedSingleDevice?.vehicleInfo?.customer?.emailAddress}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong> Phone Number</strong>
              <span>
                {selectedSingleDevice?.vehicleInfo?.customer?.phoneNo}
              </span>
            </ListGroupItem>
          </ListGroup>
        ) : activeButton === "trackerInfo" ? (
          <ListGroup flush>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Direction</strong>
              <span>{selectedSingleDevice?.direction}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Latitude</strong>
              <span>
                {selectedSingleDevice?.latitude !== null
                  ? selectedSingleDevice?.latitude
                  : "N/A"}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Longitude</strong>
              <span>
                {selectedSingleDevice?.longitude !== null
                  ? selectedSingleDevice?.longitude
                  : "N/A"}
              </span>
            </ListGroupItem>

            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Protocol Type</strong>
              <span>{selectedSingleDevice?.deviceType}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Server Time</strong>
              <span>
                {selectedSingleDevice?.serverTime !== null
                  ? formatDateTime(selectedSingleDevice?.serverTime)
                  : "N/A"}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Time stamp</strong>
              <span>
                {selectedSingleDevice?.timestamp !== null
                  ? formatDateTime(selectedSingleDevice?.timestamp)
                  : "N/A"}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Speed</strong>
              <span>{Number(selectedSingleDevice?.speed).toFixed(2)} km/h</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Current Status</strong>
              <span>{selectedSingleDevice?.currentStatus}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Protocol Number</strong>
              <span>{selectedSingleDevice?.protocolNumber}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Ignition</strong>
              <span>
                {selectedSingleDevice?.basicInfo?.ignition == false
                  ? "Off"
                  : "On"}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Satellite Count</strong>
              <span>{selectedSingleDevice?.basicInfo?.satelliteCount}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#99A6A7",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <strong>Odometer</strong>
              <span>
                {Number(selectedSingleDevice?.basicInfo?.odometer).toFixed(0)}
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
