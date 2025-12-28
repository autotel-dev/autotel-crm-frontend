import React, { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getAll } from "../../../../../../../Utilities/api";
import { VIEW_TRIP } from "../../../../../../../Utilities/api/apiEndpoints";
import { P } from "../../../../../../../AbstractElements";
import CheckpointMap from "./components/CheckpointMap";

const TripDetails: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<any>(null);

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = () => {
    setLoading(true);
    getAll({ url: `${VIEW_TRIP}/${tripId}` })
      .then((data: any) => {
        if (data === undefined) {
          Swal.fire({
            text: "Failed to fetch trip details due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
          return;
        }

        if (data.success) {
          setTripData(data.data);
        } else {
          Swal.fire({
            text: data.message || "Failed to fetch trip details",
            icon: "error",
            timer: 2000,
            showConfirmButton: true,
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trip details:", error);
        setLoading(false);
        Swal.fire({
          text: "An error occurred while fetching trip details",
          icon: "error",
          timer: 2000,
          showConfirmButton: true,
        });
      });
  };

  const formatDateTime = (datetime: string) => {
    if (!datetime) return "-";
    const date = new Date(datetime);
    return date.toLocaleString();
  };

  const handleBack = () => {
    navigate(
      `${process.env.PUBLIC_URL}/company/modules/trip-management/trips`
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Spinner
          color="primary"
          style={{ width: "3rem", height: "3rem" }}
        />
        <p style={{ color: "#6c757d", fontSize: "16px" }}>
          Loading trip details...
        </p>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <p style={{ color: "#6c757d", fontSize: "16px" }}>
          Trip details not found
        </p>
        <Button color="primary" onClick={handleBack}>
          Back to Trips
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Row className="g-3">
        <Col xs={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h4 style={{ margin: 0, fontWeight: "600" }}>Trip Details</h4>
            <Button color="secondary" onClick={handleBack}>
              Back to Trips
            </Button>
          </div>
        </Col>

        {/* Trip Details Section */}
        <Col xs={12}>
          <div
            style={{
              marginBottom: "15px",
              paddingBottom: "10px",
              borderBottom: "1px solid #e9ecef",
            }}
          >
            <h6 style={{ margin: 0, fontWeight: "600" }}>Trip Information</h6>
          </div>
        </Col>

        <Col md={4} xs={12}>
          <P
            style={{
              marginBottom: "5px",
              fontWeight: "600",
              fontSize: "12px",
              color: "#6c757d",
            }}
          >
            Trip Title
          </P>
          <p style={{ marginBottom: "15px" }}>{tripData.title || "-"}</p>
        </Col>
        <Col md={4} xs={12}>
          <P
            style={{
              marginBottom: "5px",
              fontWeight: "600",
              fontSize: "12px",
              color: "#6c757d",
            }}
          >
            Vehicle
          </P>
          <p style={{ marginBottom: "15px" }}>
            {tripData.vehicle?.registrationNo || "-"}
          </p>
        </Col>
        <Col md={4} xs={12}>
          <P
            style={{
              marginBottom: "5px",
              fontWeight: "600",
              fontSize: "12px",
              color: "#6c757d",
            }}
          >
            Driver
          </P>
          <p style={{ marginBottom: "15px" }}>
            {tripData.driver?.name || "-"}
          </p>
        </Col>
        <Col md={4} xs={12}>
          <P
            style={{
              marginBottom: "5px",
              fontWeight: "600",
              fontSize: "12px",
              color: "#6c757d",
            }}
          >
            Status
          </P>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "5px",
              color: "white",
              fontWeight: "600",
              backgroundColor:
                tripData.status === "COMPLETED"
                  ? "#28a745"
                  : tripData.status === "IN_PROGRESS"
                  ? "#007bff"
                  : tripData.status === "SCHEDULED"
                  ? "#ffc107"
                  : tripData.status === "CANCELLED"
                  ? "#dc3545"
                  : "#6c757d",
            }}
          >
            {tripData.status?.replace("_", " ")}
          </span>
        </Col>
        <Col md={4} xs={12}>
          <P
            style={{
              marginBottom: "5px",
              fontWeight: "600",
              fontSize: "12px",
              color: "#6c757d",
            }}
          >
            Created At
          </P>
          <p style={{ marginBottom: "15px" }}>
            {formatDateTime(tripData.createdAt)}
          </p>
        </Col>

        {/* Checkpoints Section */}
        <Col xs={12} style={{ marginTop: "30px" }}>
          <div
            style={{
              marginBottom: "15px",
              paddingBottom: "10px",
              borderBottom: "1px solid #e9ecef",
            }}
          >
            <h6 style={{ margin: 0, fontWeight: "600" }}>
              Trip Checkpoints ({tripData.checkPoints?.length || 0})
            </h6>
          </div>
        </Col>

        {tripData.checkPoints && tripData.checkPoints.length > 0 ? (
          tripData.checkPoints.map((checkpoint: any, index: number) => (
            <React.Fragment key={checkpoint._id}>
              <Col xs={12}>
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        fontSize: "16px",
                        color: "#495057",
                      }}
                    >
                      {index + 1}. {checkpoint.geofenceId?.title || "Unknown Location"}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "4px",
                        color: "white",
                        backgroundColor:
                          checkpoint.stopType === "START"
                            ? "#28a745"
                            : checkpoint.stopType === "DESTINATION"
                            ? "#dc3545"
                            : "#007bff",
                      }}
                    >
                      {checkpoint.stopType}
                    </span>
                  </div>

                  <Row>
                    <Col md={3} xs={12}>
                      <P
                        style={{
                          marginBottom: "5px",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: "#6c757d",
                        }}
                      >
                        Scheduled Arrival
                      </P>
                      <p style={{ marginBottom: "15px" }}>
                        {formatDateTime(checkpoint.scheduledArrivalTime)}
                      </p>
                    </Col>
                    <Col md={3} xs={12}>
                      <P
                        style={{
                          marginBottom: "5px",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: "#6c757d",
                        }}
                      >
                        Stay Time (min)
                      </P>
                      <p style={{ marginBottom: "15px" }}>
                        {checkpoint.stayTimeMin || 0} minutes
                      </p>
                    </Col>
                    <Col md={3} xs={12}>
                      <P
                        style={{
                          marginBottom: "5px",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: "#6c757d",
                        }}
                      >
                        Overstay Buffer (min)
                      </P>
                      <p style={{ marginBottom: "15px" }}>
                        {checkpoint.overstayBufferMin || 0} minutes
                      </p>
                    </Col>
                    {index < tripData.checkPoints.length - 1 && (
                      <Col md={3} xs={12}>
                        <P
                          style={{
                            marginBottom: "5px",
                            fontWeight: "600",
                            fontSize: "12px",
                            color: "#6c757d",
                          }}
                        >
                          Travel Time to Next (min)
                        </P>
                        <p style={{ marginBottom: "15px" }}>
                          {checkpoint.travelTimeToNextMin || 0} minutes
                        </p>
                      </Col>
                    )}
                  </Row>

                  {/* Checkpoint Map */}
                  <Row style={{ marginTop: "15px" }}>
                    <Col xs={12}>
                      <P
                        style={{
                          marginBottom: "10px",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: "#6c757d",
                        }}
                      >
                        Geofence Location
                      </P>
                      <CheckpointMap geofenceData={checkpoint.geofenceId} />
                    </Col>
                  </Row>
                </div>
              </Col>
            </React.Fragment>
          ))
        ) : (
          <Col xs={12}>
            <p style={{ textAlign: "center", color: "#6c757d" }}>
              No checkpoints found for this trip
            </p>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default TripDetails;
