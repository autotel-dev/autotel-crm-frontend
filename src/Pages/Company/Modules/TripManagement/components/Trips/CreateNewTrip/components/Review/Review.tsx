import React, { useState } from "react";
import { Button, Col, Form, Row } from "reactstrap";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTripContext } from "../../TripContext";
import { P } from "../../../../../../../../../AbstractElements";

import { CREATE_TRIP } from "../../../../../../../../../Utilities/api/apiEndpoints";
import { create } from "../../../../../../../../../Utilities/api";

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

    // Helper function to convert datetime-local to ISO format
    const convertToISOFormat = (datetimeLocal: string): string => {
      if (!datetimeLocal) return "";
      const date = new Date(datetimeLocal);
      return date.toISOString();
    };

    // Map checkpoint type to stopType
    const mapStopType = (type: string): string => {
      switch (type) {
        case "origin":
          return "START";
        case "waypoint":
          return "WAYPOINT";
        case "destination":
          return "DESTINATION";
        default:
          return "WAYPOINT";
      }
    };

    // Build the payload according to API requirements
    const payload = {
      title: tripData.tripName,
      triptype: tripData.tripType,
      vehicleId: tripData.vehicleId,
      driverId: tripData.driverId,
      stops: tripData.checkpoints.map((checkpoint) => ({
        stopName: checkpoint.checkpointName,
        geofenceId: checkpoint.geofenceId,
        stopType: mapStopType(checkpoint.type),
        scheduledArrivalTime: convertToISOFormat(
          checkpoint.plannedArrival || ""
        ),
        stayTimeMin: checkpoint.stayTime || 0,
        overstayBufferMin: checkpoint.overstayBuffer || 0,
        travelTimeToNextMin: checkpoint.travelTimeToNext || 0,
      })),
    };

    // Make API call to create trip
    create(payload, { url: CREATE_TRIP })
      .then((data: any) => {
        setLoading(false);

        if (data === undefined) {
          Swal.fire({
            text: "Failed to create trip due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          return;
        }

        if (data.success) {
          Swal.fire({
            text: "Trip created successfully!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          setTimeout(() => {
            navigate(
              `${process.env.PUBLIC_URL}/company/modules/trip-management/trips`
            );
          }, 2000);
        } else {
          Swal.fire({
            text: data.message || "Failed to create trip",
            icon: "error",
            timer: 2000,
            showConfirmButton: true,
          });
        }
      })
      .catch((error: any) => {
        console.error("Error creating trip:", error);
        setLoading(false);
        Swal.fire({
          text: "An error occurred while creating the trip",
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
            <h6 style={{ margin: 0, fontWeight: "700", fontSize: "18px" }}>
              Trip Details
            </h6>
            <Button
              color="link"
              size="lg"
              onClick={() => handleEdit(1)}
              style={{
                textDecoration: "none",
                padding: "0",
                fontWeight: "bold",
              }}
            >
              Edit
            </Button>
          </div>
        </Col>

        <Col md={4} xs={12}>
          <p
            style={{
              marginBottom: "5px",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            Trip Name
          </p>
          <p style={{ marginBottom: "15px" }}>{tripData.tripName || "-"}</p>
        </Col>
        <Col md={4} xs={12}>
          <p
            style={{
              marginBottom: "5px",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            Trip Type
          </p>
          <p style={{ marginBottom: "15px" }}>{tripData.tripType || "-"}</p>
        </Col>
        <Col md={4} xs={12}>
          <p
            style={{
              marginBottom: "5px",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            Vehicle
          </p>
          <p style={{ marginBottom: "15px" }}>{tripData.vehicleName || "-"}</p>
        </Col>
        <Col md={4} xs={12}>
          <p
            style={{
              marginBottom: "5px",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            Driver
          </p>
          <p style={{ marginBottom: "15px" }}>{tripData.driverName || "-"}</p>
        </Col>
        <Col md={12} xs={12}>
          <p
            style={{
              marginBottom: "5px",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            Notes
          </p>
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
            <h6 style={{ margin: 0, fontWeight: "700", fontSize: "18px" }}>
              Route Checkpoints
            </h6>
            <Button
              color="link"
              size="lg"
              onClick={() => handleEdit(2)}
              style={{
                textDecoration: "none",
                padding: "0",
                fontWeight: "bold",
              }}
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
                  <span
                    style={{
                      marginBottom: "5px",
                      fontWeight: "700",
                      fontSize: "16px",
                    }}
                  >
                    {index + 1}.
                  </span>
                  <span
                    style={{
                      marginBottom: "5px",
                      fontWeight: "700",
                      fontSize: "16px",
                    }}
                  >
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
                <p
                  style={{
                    marginBottom: "5px",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  Geofence
                </p>
                <p style={{ marginBottom: "15px" }}>
                  {checkpoint.geofenceName || "-"}
                </p>
              </Col>
              <Col md={6} xs={12}>
                <p
                  style={{
                    marginBottom: "5px",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  Type
                </p>
                <p
                  style={{ marginBottom: "15px", textTransform: "capitalize" }}
                >
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
            <h6 style={{ margin: 0, fontWeight: "700", fontSize: "18px" }}>
              Time Schedules
            </h6>
            <Button
              color="link"
              size="lg"
              onClick={() => handleEdit(3)}
              style={{
                textDecoration: "none",
                padding: "0",
                fontWeight: "bold",
              }}
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
                  <span style={{ fontWeight: "700", fontSize: "16px" }}>
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
                <p
                  style={{
                    marginBottom: "5px",
                    fontWeight: "700",
                    fontSize: "14px",
                    // color: "#6c757d",
                  }}
                >
                  Arrival Time
                </p>
                <p style={{ marginBottom: "15px" }}>
                  {formatDateTime(checkpoint.plannedArrival || "")}
                </p>
              </Col>
              <Col md={3} xs={12}>
                <p
                  style={{
                    marginBottom: "5px",
                    fontWeight: "700",
                    fontSize: "14px",
                    // color: "#6c757d",
                  }}
                >
                  Stay Time (min)
                </p>
                <p style={{ marginBottom: "15px" }}>
                  {checkpoint.stayTime || "-"}
                </p>
              </Col>
              <Col md={3} xs={12}>
                <p
                  style={{
                    marginBottom: "5px",
                    fontWeight: "700",
                    fontSize: "14px",
                    // color: "#6c757d",
                  }}
                >
                  Departure Time
                </p>
                <p style={{ marginBottom: "15px" }}>
                  {formatDateTime(checkpoint.plannedDeparture || "")}
                </p>
              </Col>
              <Col md={3} xs={12}>
                <p
                  style={{
                    marginBottom: "5px",
                    fontWeight: "700",
                    fontSize: "14px",
                    // color: "#6c757d",
                  }}
                >
                  Overstay Buffer (min)
                </p>
                <p style={{ marginBottom: "15px" }}>
                  {checkpoint.overstayBuffer || "-"}
                </p>
              </Col>
              {index < tripData.checkpoints.length - 1 && (
                <Col md={3} xs={12}>
                  <p
                    style={{
                      marginBottom: "5px",
                      fontWeight: "700",
                      fontSize: "14px",
                      // color: "#6c757d",
                    }}
                  >
                    Travel Time to Next (min)
                  </p>
                  <p style={{ marginBottom: "15px" }}>
                    {checkpoint.travelTimeToNext || "-"}
                  </p>
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
