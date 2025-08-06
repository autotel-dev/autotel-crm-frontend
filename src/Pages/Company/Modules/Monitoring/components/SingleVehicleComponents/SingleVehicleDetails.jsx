import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import "./SingleVehicleDetails.css";
import { useSelector } from "react-redux";

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
        backgroundColor: "#21262C",
        border: "1px solid black",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <CardHeader
        style={{
          padding: "0px 0px 0px 2px",
          margin: "0px",
          borderRadius: "5px",
          backgroundColor: "#21262C",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "11px",
            color: "white",
            width: "99%",
            overflowX: "scroll",
            borderBottom: "2px solid gray",
            WebkitOverflowScrolling: "touch", // Smooth scrolling on mobile
            scrollbarWidth: "none", // Firefox
            paddingTop: "5px",
            paddingBottom: "5px",
            backgroundColor: "#21262C",
          }}
          className="hide-scrollbar"
        >
          <button
            onClick={() => setActiveButton("vehicleInfo")}
            className={`custom-button ${
              activeButton === "vehicleInfo" ? "active" : ""
            }`}
            style={{ color: "white" }}
          >
            Vehicle Info
          </button>
          <button
            onClick={() => setActiveButton("customerInfo")}
            className={`custom-button ${
              activeButton === "customerInfo" ? "active" : ""
            }`}
            style={{ color: "white" }}
          >
            Customer Info
          </button>
          <button
            onClick={() => setActiveButton("trackerInfo")}
            className={`custom-button ${
              activeButton === "trackerInfo" ? "active" : ""
            }`}
            style={{ color: "white" }}
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
            style={{ color: "white" }}
          >
            Today Activity
          </button>
          <button
            onClick={() => setActiveButton("powerInfo")}
            className={`custom-button ${
              activeButton === "powerInfo" ? "active" : ""
            }`}
            style={{ color: "white" }}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveButton("sensorInfo")}
            className={`custom-button ${
              activeButton === "sensorInfo" ? "active" : ""
            }`}
            style={{ color: "white" }}
          >
            Reports
          </button>
        </div>
      </CardHeader>

      <CardBody
        style={{
          maxHeight: "31.5vh",
          minHeight: "31.5vh",
          overflowY: "auto",
          padding: "0",
          scrollbarWidth: "none",
          borderRadius: "5px",
          backgroundColor: "#21262C",
        }}
      >
        {loading ? (
          <div className="loader-box">
            <div className="loader-19"></div>
          </div>
        ) : activeButton === "todayActivity" && currentData ? (
          <ListGroup flush style={{ backgroundColor: "#21262C" }}>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
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
                color: "white",
                backgroundColor: "#21262C",
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
                color: "white",
                backgroundColor: "#21262C",
              }}
            >
              <strong>Status Durations:</strong>
              <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                {currentData.statusDurations?.map((status, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: "11px",
                      color: "white",
                      marginBottom: "5px",
                    }}
                  >
                    <strong>{status.status}:</strong>{" "}
                    {status.timeInHours.toFixed(2)} hours
                  </li>
                ))}
              </ul>
            </ListGroupItem>
          </ListGroup>
        ) : activeButton === "vehicleInfo" ? (
          <ListGroup flush style={{ backgroundColor: "#21262C" }}>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong> Registration Number</strong>
              <span>{selectedSingleDevice?.vehicle?.registrationNo}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Vehicle Model</strong>
              <span>{selectedSingleDevice?.vehicle?.model?.name}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Vehicle Make</strong>
              <span>{selectedSingleDevice?.vehicle?.make?.name}</span>
            </ListGroupItem>

            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Year</strong>
              <span>{selectedSingleDevice?.vehicle?.year}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Package Price</strong>
              <span>
                {selectedSingleDevice?.vehicle?.servicePackageDiscountedCharges}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Color</strong>
              <span>{selectedSingleDevice?.vehicle?.color}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>IMEI Number</strong>
              <span>{selectedSingleDevice?.vehicle?.imei}</span>
            </ListGroupItem>

            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Chasis Number</strong>
              <span>{selectedSingleDevice?.vehicle?.chasisNo}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Engine Number</strong>
              <span>{selectedSingleDevice?.vehicle?.engineNo}</span>
            </ListGroupItem>
          </ListGroup>
        ) : activeButton === "customerInfo" ? (
          <ListGroup flush style={{ backgroundColor: "#21262C" }}>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong> Name</strong>
              <span>{selectedSingleDevice?.vehicle?.customer?.fullName}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong> Email Address</strong>
              <span>
                {selectedSingleDevice?.vehicle?.customer?.emailAddress}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong> Phone Number</strong>
              <span>{selectedSingleDevice?.vehicle?.customer?.phoneNo}</span>
            </ListGroupItem>
          </ListGroup>
        ) : activeButton === "trackerInfo" ? (
          <ListGroup flush>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Direction</strong>
              <span>{selectedSingleDevice?.latestPosition?.course}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Latitude</strong>
              <span>
                {selectedSingleDevice?.latestPosition?.latitude !== null
                  ? selectedSingleDevice?.latestPosition?.latitude
                  : "N/A"}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Longitude</strong>
              <span>
                {selectedSingleDevice?.latestPosition?.longitude !== null
                  ? selectedSingleDevice?.latestPosition?.longitude
                  : "N/A"}
              </span>
            </ListGroupItem>

            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Protocol Type</strong>
              <span>{selectedSingleDevice?.latestPosition?.protocol}</span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Server Time</strong>
              <span>
                {selectedSingleDevice?.latestPosition?.serverTime !== null
                  ? formatDateTime(
                      selectedSingleDevice?.latestPosition?.serverTime
                    )
                  : "N/A"}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Device Time</strong>
              <span>
                {selectedSingleDevice?.latestPosition?.deviceTime !== null
                  ? formatDateTime(
                      selectedSingleDevice?.latestPosition?.deviceTime
                    )
                  : "N/A"}
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Speed</strong>
              <span>
                {Number(selectedSingleDevice?.latestPosition?.speed).toFixed(2)}{" "}
                km/h
              </span>
            </ListGroupItem>
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Current Status</strong>
              <span>{selectedSingleDevice?.status}</span>
            </ListGroupItem>
            {/* <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Protocol Number</strong>
              <span>{selectedSingleDevice?.protocolNumber}</span>
            </ListGroupItem> */}
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Ignition</strong>
              <span>
                {selectedSingleDevice?.latestPosition?.ignition == false
                  ? "Off"
                  : "On"}
              </span>
            </ListGroupItem>
            {/* <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Satellite Count</strong>
              <span>{selectedSingleDevice?.basicInfo?.satelliteCount}</span>
            </ListGroupItem> */}
            <ListGroupItem
              style={{
                borderBottom: "1px solid gray",
                backgroundColor: "#21262C",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "white",
              }}
            >
              <strong>Odometer</strong>
              <span>
                {Number(
                  selectedSingleDevice?.latestPosition?.attributes?.odometer
                ).toFixed(0)}
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
