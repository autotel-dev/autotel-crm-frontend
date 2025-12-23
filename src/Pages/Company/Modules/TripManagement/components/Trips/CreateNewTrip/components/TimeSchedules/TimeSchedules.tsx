import React, { useState, useEffect } from "react";
import { Button, Col, Form, Input, Row } from "reactstrap";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTripContext } from "../../TripContext";
import { P } from "../../../../../../../../../AbstractElements";

interface TimeSchedulesProps {
  callbackActive: (tab: number | undefined) => void;
}

const TimeSchedules: React.FC<TimeSchedulesProps> = ({ callbackActive }) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const navigate = useNavigate();
  const { tripData, setTripData } = useTripContext();

  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    // Initialize schedules from checkpoints
    const initialSchedules = tripData.checkpoints.map((checkpoint) => ({
      id: checkpoint.id,
      type: checkpoint.type,
      checkpointName: checkpoint.checkpointName,
      geofenceName: checkpoint.geofenceName,
      plannedArrival: checkpoint.plannedArrival || "",
      stayTime: checkpoint.stayTime || 0,
      plannedDeparture: checkpoint.plannedDeparture || "",
      travelTimeToNext: checkpoint.travelTimeToNext || 0,
      overstayBuffer: checkpoint.overstayBuffer || 15,
    }));
    setSchedules(initialSchedules);
  }, [tripData.checkpoints]);

  // Helper function to add minutes to a datetime string
  const addMinutesToDateTime = (
    datetimeStr: string,
    minutes: number
  ): string => {
    if (!datetimeStr) return "";
    const date = new Date(datetimeStr);
    date.setMinutes(date.getMinutes() + minutes);
    // Format as datetime-local string (YYYY-MM-DDTHH:mm)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const mins = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${mins}`;
  };

  const handleTimeChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value,
    };

    // Auto-calculate departure time when arrival or stay time changes
    if (field === "plannedArrival" || field === "stayTime") {
      const arrival = field === "plannedArrival" ? value as string : updatedSchedules[index].plannedArrival;
      const stayTime = field === "stayTime" ? value as number : updatedSchedules[index].stayTime;

      if (arrival && stayTime) {
        updatedSchedules[index].plannedDeparture = addMinutesToDateTime(
          arrival,
          stayTime
        );
      }
    }

    // Auto-calculate next checkpoint's arrival when departure or travel time changes
    if (
      (field === "stayTime" || field === "travelTimeToNext" || field === "plannedArrival") &&
      index < updatedSchedules.length - 1
    ) {
      const currentDeparture = updatedSchedules[index].plannedDeparture;
      const travelTime = updatedSchedules[index].travelTimeToNext;

      if (currentDeparture && travelTime) {
        updatedSchedules[index + 1].plannedArrival = addMinutesToDateTime(
          currentDeparture,
          travelTime
        );

        // Recalculate next checkpoint's departure as well
        const nextStayTime = updatedSchedules[index + 1].stayTime;
        if (nextStayTime) {
          updatedSchedules[index + 1].plannedDeparture = addMinutesToDateTime(
            updatedSchedules[index + 1].plannedArrival,
            nextStayTime
          );
        }

        // Continue the cascade for remaining checkpoints
        for (let i = index + 1; i < updatedSchedules.length - 1; i++) {
          const prevDeparture = updatedSchedules[i].plannedDeparture;
          const prevTravelTime = updatedSchedules[i].travelTimeToNext;

          if (prevDeparture && prevTravelTime) {
            updatedSchedules[i + 1].plannedArrival = addMinutesToDateTime(
              prevDeparture,
              prevTravelTime
            );

            const nextStayTime = updatedSchedules[i + 1].stayTime;
            if (nextStayTime) {
              updatedSchedules[i + 1].plannedDeparture = addMinutesToDateTime(
                updatedSchedules[i + 1].plannedArrival,
                nextStayTime
              );
            }
          }
        }
      }
    }

    setSchedules(updatedSchedules);
  };

  const handleBack = () => {
    callbackActive(2);
  };

  const handleNext = () => {
    setLoading(true);

    // Validate that all required fields are filled
    for (let i = 0; i < schedules.length; i++) {
      if (!schedules[i].plannedArrival) {
        Swal.fire({
          text: `Please enter arrival time for ${
            schedules[i].checkpointName || `checkpoint ${i + 1}`
          }!`,
          icon: "info",
          timer: 2000,
          showConfirmButton: true,
        });
        setLoading(false);
        return;
      }

      if (!schedules[i].stayTime || schedules[i].stayTime <= 0) {
        Swal.fire({
          text: `Please enter stay time for ${
            schedules[i].checkpointName || `checkpoint ${i + 1}`
          }!`,
          icon: "info",
          timer: 2000,
          showConfirmButton: true,
        });
        setLoading(false);
        return;
      }

      // Validate travel time to next for all except last checkpoint
      if (i < schedules.length - 1) {
        if (!schedules[i].travelTimeToNext || schedules[i].travelTimeToNext <= 0) {
          Swal.fire({
            text: `Please enter travel time to next checkpoint for ${
              schedules[i].checkpointName || `checkpoint ${i + 1}`
            }!`,
            icon: "info",
            timer: 2000,
            showConfirmButton: true,
          });
          setLoading(false);
          return;
        }
      }
    }

    // Save to context
    const updatedCheckpoints = tripData.checkpoints.map((checkpoint, index) => ({
      ...checkpoint,
      plannedArrival: schedules[index].plannedArrival,
      stayTime: schedules[index].stayTime,
      plannedDeparture: schedules[index].plannedDeparture,
      travelTimeToNext: schedules[index].travelTimeToNext,
      overstayBuffer: schedules[index].overstayBuffer,
    }));

    setTripData((prev) => ({ ...prev, checkpoints: updatedCheckpoints }));

    setLoading(false);
    // Move to next step
    callbackActive(4);
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
            Set planned times and tolerance thresholds for each waypoint
          </p>
        </Col>

        {schedules.map((schedule, index) => (
          <React.Fragment key={schedule.id}>
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
                <h6 style={{ margin: 0, fontWeight: "600" }}>
                  {schedule.checkpointName || `Point ${index + 1}`}
                </h6>
                {schedule.type === "origin" && (
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
                {schedule.type === "destination" && (
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
                {schedule.type === "waypoint" && (
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

            <Col xl={3} xs={12}>
              <P>
                Arrival Time
                <span className="txt-danger">*</span>
              </P>
              <Input
                type="datetime-local"
                value={schedule.plannedArrival}
                onChange={(e) =>
                  handleTimeChange(index, "plannedArrival", e.target.value)
                }
                disabled={index !== 0}
                style={{
                  backgroundColor: index !== 0 ? "#f0f0f0" : "white",
                }}
              />
            </Col>

            <Col xl={3} xs={12}>
              <P>
                Stay Time (min)
                <span className="txt-danger">*</span>
              </P>
              <Input
                type="number"
                placeholder="Enter stay time"
                value={schedule.stayTime}
                onChange={(e) =>
                  handleTimeChange(
                    index,
                    "stayTime",
                    parseInt(e.target.value) || 0
                  )
                }
                min={0}
              />
            </Col>

            <Col xl={3} xs={12}>
              <P>Departure Time</P>
              <Input
                type="datetime-local"
                value={schedule.plannedDeparture}
                disabled
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </Col>

            <Col xl={3} xs={12}>
              <P>Overstay Buffer (min)</P>
              <Input
                type="number"
                placeholder="Enter buffer"
                value={schedule.overstayBuffer}
                onChange={(e) =>
                  handleTimeChange(
                    index,
                    "overstayBuffer",
                    parseInt(e.target.value) || 0
                  )
                }
                min={0}
              />
            </Col>

            {index < schedules.length - 1 && (
              <Col xl={3} xs={12}>
                <P>
                  Travel Time to Next (min)
                  <span className="txt-danger">*</span>
                </P>
                <Input
                  type="number"
                  placeholder="Enter travel time"
                  value={schedule.travelTimeToNext}
                  onChange={(e) =>
                    handleTimeChange(
                      index,
                      "travelTimeToNext",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min={0}
                />
              </Col>
            )}
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

export default TimeSchedules;
