import React, { useState } from "react";
import { Button, Col, Form, Row } from "reactstrap";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTripContext } from "../../TripContext";
import { P } from "../../../../../../../../../AbstractElements";

interface ReviewProps {
  callbackActive: (tab: number | undefined) => void;
}

const Review: React.FC<ReviewProps> = ({ callbackActive }) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const navigate = useNavigate();
  const { tripData } = useTripContext();

  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    callbackActive(3);
  };

  const handleEdit = (step: number) => {
    callbackActive(step);
  };

  const handleCreate = () => {
    setLoading(true);

    // Here you would integrate with API to create the trip
    console.log("Creating trip with data:", tripData);

    Swal.fire({
      text: "Trip created successfully! (API integration pending)",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      setLoading(false);
      navigate(
        `${process.env.PUBLIC_URL}/company/modules/trip-management/trips`
      );
    }, 2000);
  };

  const formatDateTime = (datetime: string) => {
    if (!datetime) return "-";
    const date = new Date(datetime);
    return date.toLocaleString();
  };

  return (
    <Form
      onSubmit={(event) => event.preventDefault()}
      className="needs-validation"
      noValidate
    >
      <Row className="g-3">
        <Col xs={12}>
          <p style={{ color: "#6c757d", marginBottom: "20px" }}>
            Review all information before creating the trip
          </p>
        </Col>

        {/* Trip Details Section */}
        <Col xs={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
              paddingBottom: "10px",
              borderBottom: "1px solid #e9ecef",
            }}
          >
            <h6 style={{ margin: 0, fontWeight: "600" }}>Trip Details</h6>
            <Button
              color="link"
              size="sm"
              onClick={() => handleEdit(1)}
              style={{ textDecoration: "none", padding: "0" }}
            >
              Edit
            </Button>
          </div>
        </Col>

        <Col md={4} xs={12}>
          <P style={{ marginBottom: "5px", fontWeight: "600", fontSize: "12px", color: "#6c757d" }}>
            Trip Name
          </P>
          <p style={{ marginBottom: "15px" }}>{tripData.tripName || "-"}</p>
        </Col>
        <Col md={4} xs={12}>
          <P style={{ marginBottom: "5px", fontWeight: "600", fontSize: "12px", color: "#6c757d" }}>
            Trip Type
          </P>
          <p style={{ marginBottom: "15px" }}>{tripData.tripType || "-"}</p>
        </Col>
        <Col md={4} xs={12}>
          <P style={{ marginBottom: "5px", fontWeight: "600", fontSize: "12px", color: "#6c757d" }}>
            Vehicle ID
          </P>
          <p style={{ marginBottom: "15px" }}>{tripData.vehicleId || "-"}</p>
        </Col>
        <Col md={4} xs={12}>
          <P style={{ marginBottom: "5px", fontWeight: "600", fontSize: "12px", color: "#6c757d" }}>
            Driver ID
          </P>
          <p style={{ marginBottom: "15px" }}>{tripData.driverId || "-"}</p>
        </Col>
        <Col md={12} xs={12}>
          <P style={{ marginBottom: "5px", fontWeight: "600", fontSize: "12px", color: "#6c757d" }}>
            Notes
          </P>
          <p style={{ marginBottom: "15px" }}>{tripData.notes || "-"}</p>
        </Col>

        {/* Checkpoints Section */}
        <Col xs={12} style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
              paddingBottom: "10px",
              borderBottom: "1px solid #e9ecef",
            }}
          >
            <h6 style={{ margin: 0, fontWeight: "600" }}>Route Checkpoints</h6>
            <Button
              color="link"
              size="sm"
              onClick={() => handleEdit(2)}
              style={{ textDecoration: "none", padding: "0" }}
            >
              Edit
            </Button>
          </div>
        </Col>

        {tripData.checkpoints.length > 0 ? (
          tripData.checkpoints.map((checkpoint, index) => (
            <React.Fragment key={checkpoint.id}>
              <Col xs={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ fontWeight: "600", fontSize: "14px" }}>
                    {index + 1}.
                  </span>
                  <span style={{ fontWeight: "600", fontSize: "14px" }}>
                    {checkpoint.checkpointName || `Point ${index + 1}`}
                  </span>
                  {checkpoint.type === "origin" && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#28a745",
                        backgroundColor: "#d4edda",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Start
                    </span>
                  )}
                  {checkpoint.type === "destination" && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#dc3545",
                        backgroundColor: "#f8d7da",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Destination
                    </span>
                  )}
                  {checkpoint.type === "waypoint" && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#007bff",
                        backgroundColor: "#cfe2ff",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Waypoint
                    </span>
                  )}
                </div>
              </Col>

              <Col md={6} xs={12}>
                <P style={{ marginBottom: "5px", fontWeight: "600", fontSize: "12px", color: "#6c757d" }}>
                  Geofence
                </P>
                <p style={{ marginBottom: "15px" }}>{checkpoint.geofenceName || "-"}</p>
              </Col>
              <Col md={6} xs={12}>
                <P style={{ marginBottom: "5px", fontWeight: "600", fontSize: "12px", color: "#6c757d" }}>
                  Type
                </P>
                <p style={{ marginBottom: "15px", textTransform: "capitalize" }}>
                  {checkpoint.type === "origin"
                    ? "Start"
                    : checkpoint.type === "destination"
                    ? "Destination"
                    : checkpoint.type}
                </p>
              </Col>
            </React.Fragment>
          ))
        ) : (
          <Col xs={12}>
            <p style={{ textAlign: "center", color: "#6c757d" }}>
              No checkpoints added
            </p>
          </Col>
        )}

        {/* Time Schedules Section */}
        <Col xs={12} style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
              paddingBottom: "10px",
              borderBottom: "1px solid #e9ecef",
            }}
          >
            <h6 style={{ margin: 0, fontWeight: "600" }}>Time Schedules</h6>
            <Button
              color="link"
              size="sm"
              onClick={() => handleEdit(3)}
              style={{ textDecoration: "none", padding: "0" }}
            >
              Edit
            </Button>
          </div>
        </Col>

        {tripData.checkpoints.length > 0 ? (
          tripData.checkpoints.map((checkpoint, index) => (
            <React.Fragment key={checkpoint.id}>
              <Col xs={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                    marginTop: index > 0 ? "15px" : "0px",
                  }}
                >
                  <span style={{ fontWeight: "600", fontSize: "14px" }}>
                    {checkpoint.checkpointName || `Point ${index + 1}`}
                  </span>
                  {checkpoint.type === "origin" && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#28a745",
                        backgroundColor: "#d4edda",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Start
                    </span>
                  )}
                  {checkpoint.type === "destination" && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#dc3545",
                        backgroundColor: "#f8d7da",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Destination
                    </span>
                  )}
                  {checkpoint.type === "waypoint" && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#007bff",
                        backgroundColor: "#cfe2ff",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Waypoint
                    </span>
                  )}
                </div>
              </Col>

              <Col md={3} xs={12}>
                <P style={{ marginBottom: "5px", fontWeight: "600", fontSize: "12px", color: "#6c757d" }}>
                  Arrival Time
                </P>
                <p style={{ marginBottom: "15px" }}>
                  {formatDateTime(checkpoint.plannedArrival || "")}
                </p>
              </Col>
              <Col md={3} xs={12}>
                <P style={{ marginBottom: "5px", fontWeight: "600", fontSize: "12px", color: "#6c757d" }}>
                  Stay Time (min)
                </P>
                <p style={{ marginBottom: "15px" }}>{checkpoint.stayTime || "-"}</p>
              </Col>
              <Col md={3} xs={12}>
                <P style={{ marginBottom: "5px", fontWeight: "600", fontSize: "12px", color: "#6c757d" }}>
                  Departure Time
                </P>
                <p style={{ marginBottom: "15px" }}>
                  {formatDateTime(checkpoint.plannedDeparture || "")}
                </p>
              </Col>
              <Col md={3} xs={12}>
                <P style={{ marginBottom: "5px", fontWeight: "600", fontSize: "12px", color: "#6c757d" }}>
                  Overstay Buffer (min)
                </P>
                <p style={{ marginBottom: "15px" }}>{checkpoint.overstayBuffer || "-"}</p>
              </Col>
              {index < tripData.checkpoints.length - 1 && (
                <Col md={3} xs={12}>
                  <P style={{ marginBottom: "5px", fontWeight: "600", fontSize: "12px", color: "#6c757d" }}>
                    Travel Time to Next (min)
                  </P>
                  <p style={{ marginBottom: "15px" }}>{checkpoint.travelTimeToNext || "-"}</p>
                </Col>
              )}
            </React.Fragment>
          ))
        ) : (
          <Col xs={12}>
            <p style={{ textAlign: "center", color: "#6c757d" }}>
              No schedules configured
            </p>
          </Col>
        )}

        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button color="secondary" disabled={loading} onClick={handleBack}>
            Back
          </Button>
          <Button
            color="secondary"
            disabled={loading}
            onClick={() => {
              navigate(
                `${process.env.PUBLIC_URL}/company/modules/trip-management/trips`
              );
            }}
          >
            Cancel
          </Button>
          <Button color="primary" disabled={loading} onClick={handleCreate}>
            {loading ? "Creating..." : "Create Trip"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Review;
