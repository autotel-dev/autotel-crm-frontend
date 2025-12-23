import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Input } from "reactstrap";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getAll } from "../../../../../../../../../Utilities/api";
import { GET_ALL_TRIP_WAYPOINTS_DROPDOWN } from "../../../../../../../../../Utilities/api/apiEndpoints";
import { P } from "../../../../../../../../../AbstractElements";
import { useNavigate } from "react-router-dom";
import { useTripContext } from "../../TripContext";
import { Select } from "antd";
import { MdDelete } from "react-icons/md";

// Simple ID generator
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface CheckpointsProps {
  callbackActive: (tab: number | undefined) => void;
}

const Checkpoints: React.FC<CheckpointsProps> = ({ callbackActive }) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const navigate = useNavigate();
  const { tripData, setTripData } = useTripContext();

  const [loading, setLoading] = useState(false);
  const [geofences, setGeofences] = useState<any[]>([]);
  const [checkpoints, setCheckpoints] = useState<any[]>(
    tripData.checkpoints.length > 0
      ? tripData.checkpoints
      : [
          {
            id: generateId(),
            type: "origin",
            checkpointName: "",
            geofenceId: "",
            geofenceName: "",
          },
          {
            id: generateId(),
            type: "destination",
            checkpointName: "",
            geofenceId: "",
            geofenceName: "",
          },
        ]
  );

  // Fetch geofences from API
  useEffect(() => {
    fetchGeofences();
  }, []);

  const fetchGeofences = () => {
    getAll({ url: GET_ALL_TRIP_WAYPOINTS_DROPDOWN })
      .then((data: any) => {
        if (data === undefined) {
          Swal.fire({
            text: "Failed to fetch geofences due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setGeofences([]);
          return;
        }
        if (data.success) {
          setGeofences(data.data || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching geofences:", error);
        setGeofences([]);
      });
  };

  const handleCheckpointNameChange = (index: number, name: string) => {
    const updatedCheckpoints = [...checkpoints];
    updatedCheckpoints[index] = {
      ...updatedCheckpoints[index],
      checkpointName: name,
    };
    setCheckpoints(updatedCheckpoints);
  };

  const handleGeofenceChange = (index: number, geofenceId: string) => {
    const selectedGeofence = geofences.find((g) => g._id === geofenceId);
    const updatedCheckpoints = [...checkpoints];
    updatedCheckpoints[index] = {
      ...updatedCheckpoints[index],
      geofenceId,
      geofenceName: selectedGeofence?.name || "",
    };
    setCheckpoints(updatedCheckpoints);
  };

  const addWaypoint = () => {
    // Insert before the last checkpoint (destination)
    const newCheckpoint = {
      id: generateId(),
      type: "waypoint",
      checkpointName: "",
      geofenceId: "",
      geofenceName: "",
    };
    const updatedCheckpoints = [
      ...checkpoints.slice(0, -1),
      newCheckpoint,
      checkpoints[checkpoints.length - 1],
    ];
    setCheckpoints(updatedCheckpoints);
  };

  const removeWaypoint = (index: number) => {
    if (checkpoints[index].type === "waypoint") {
      const updatedCheckpoints = checkpoints.filter((_, i) => i !== index);
      setCheckpoints(updatedCheckpoints);
    }
  };

  const handleBack = () => {
    callbackActive(1);
  };

  const handleNext = () => {
    setLoading(true);

    // Validate that all checkpoints have names and geofences
    for (let i = 0; i < checkpoints.length; i++) {
      if (!checkpoints[i].checkpointName) {
        Swal.fire({
          text: `Please enter a name for ${
            checkpoints[i].type === "origin"
              ? "Start"
              : checkpoints[i].type === "destination"
              ? "Destination"
              : "checkpoint " + i
          }!`,
          icon: "info",
          timer: 2000,
          showConfirmButton: true,
        });
        setLoading(false);
        return;
      }

      if (!checkpoints[i].geofenceId) {
        Swal.fire({
          text: `Please select a geofence for ${
            checkpoints[i].type === "origin"
              ? "Start"
              : checkpoints[i].type === "destination"
              ? "Destination"
              : checkpoints[i].checkpointName
          }!`,
          icon: "info",
          timer: 2000,
          showConfirmButton: true,
        });
        setLoading(false);
        return;
      }
    }

    // Save to context
    setTripData((prev) => ({ ...prev, checkpoints }));

    setLoading(false);
    // Move to next step
    callbackActive(3);
  };

  return (
    <Form
      onSubmit={(event) => event.preventDefault()}
      className="needs-validation"
      noValidate
    >
      <Row className="g-3">
        <Col xs={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <p style={{ color: "#6c757d", margin: 0 }}>
              Add at least 2 waypoints (origin and destination)
            </p>
            <Button color="success" onClick={addWaypoint} size="sm">
              + Add Waypoint
            </Button>
          </div>
        </Col>

        {checkpoints.map((checkpoint, index) => (
          <React.Fragment key={checkpoint.id}>
            <Col xl={6} xs={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <P>
                  Checkpoint Name
                  <span className="txt-danger">*</span>
                </P>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {checkpoint.type === "origin" && (
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#28a745",
                      }}
                    >
                      Start
                    </span>
                  )}
                  {checkpoint.type === "destination" && (
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#dc3545",
                      }}
                    >
                      Destination
                    </span>
                  )}
                  {checkpoint.type === "waypoint" && (
                    <button
                      type="button"
                      style={{
                        border: "none",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        color: "#dc3545",
                      }}
                      onClick={() => removeWaypoint(index)}
                      title="Remove checkpoint"
                    >
                      <MdDelete size={20} />
                    </button>
                  )}
                </div>
              </div>
              <Input
                type="text"
                placeholder={
                  checkpoint.type === "origin"
                    ? "Enter start location name"
                    : checkpoint.type === "destination"
                    ? "Enter destination name"
                    : "Enter checkpoint name (e.g., Warehouse)"
                }
                value={checkpoint.checkpointName}
                onChange={(e) =>
                  handleCheckpointNameChange(index, e.target.value)
                }
              />
            </Col>

            <Col xl={6} xs={12}>
              <div>
                <P>
                  Location (Geofence)
                  <span className="txt-danger">*</span>
                </P>
              </div>
              <Select
                showSearch
                value={
                  checkpoint.geofenceId !== "" ? checkpoint.geofenceId : null
                }
                style={{ width: "100%", height: 36 }}
                placeholder="Select geofence..."
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(value) => handleGeofenceChange(index, value)}
                options={geofences.map((g) => ({
                  value: g._id,
                  label: g.name,
                }))}
              />
            </Col>
          </React.Fragment>
        ))}

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
          <Button color="primary" disabled={loading} onClick={handleNext}>
            {loading ? "Loading..." : "Next"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Checkpoints;
