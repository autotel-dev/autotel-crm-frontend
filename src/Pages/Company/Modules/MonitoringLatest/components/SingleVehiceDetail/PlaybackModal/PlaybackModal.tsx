import { Col } from "reactstrap";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, FormGroup, Modal, ModalBody, Row } from "reactstrap";
import { H4, P } from "../../../../../../../AbstractElements";
import { useLocation, useNavigate } from "react-router-dom";
import { Select } from "antd";
import { getAll } from "../../../../../../../Utilities/api";
import { GET_VEHICLE_HISTORY } from "../../../../../../../Utilities/api/apiEndpoints";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  setVehicleHistoryData,
  setVehicleHistoryDateRange,
} from "../../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { useSelector } from "react-redux";

interface PlaybackModalProps {
  isVisible: any;
  setIsVisible: any;
}

const PlaybackModal: React.FC<PlaybackModalProps> = ({
  isVisible,
  setIsVisible = () => {},
}: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // Add this hook

  // Now you can get the current URL pathname
  console.log("Current URL:", location.pathname);
  const [loading, setLoading] = useState(false);
  const {
    register,
    formState: { errors },
  } = useForm<any>();

  // useEffect(() => {
  //   dispatch(setVehicleHistoryData(null));
  // }, []);

  const { selectedSingleDevice, vehicleHistoryDateRange } = useSelector(
    (state: any) => state.monitoring
  );
  console.log("vehicleHistoryDateRange", vehicleHistoryDateRange);

  // Initialize filter based on saved date range
  const [selectedFilter, setSelectedFilter] = useState<string>("Today");

  function filterHistoryData(history: any[]) {
    if (!Array.isArray(history)) return [];

    const filtered: any[] = [];
    let prevLat: number | null = null;
    let prevLng: number | null = null;
    let prevAltitude: number | null = null;
    let prevSpeed: number | null = null;
    let prevCourse: number | null = null;

    for (const packet of history) {
      const { latitude, longitude, altitude, speed, course } = packet;

      if (
        latitude !== prevLat ||
        longitude !== prevLng ||
        altitude !== prevAltitude ||
        speed !== prevSpeed ||
        course !== prevCourse
      ) {
        filtered.push(packet);
        prevLat = latitude;
        prevLng = longitude;
        prevAltitude = altitude;
        prevSpeed = speed;
        prevCourse = course;
      }
    }

    return filtered;
  }

  // ✅ New states
  const [fromDateTime, setFromDateTime] = useState<string>("");
  const [toDateTime, setToDateTime] = useState<string>("");

  const daysFilter = [
    { label: "Today", value: "Today" },
    { label: "Yesterday", value: "Yesterday" },
    { label: "1 Week", value: "1 Week" },
    { label: "Custom", value: "Custom" },
  ];

  // ✅ Helper function to check if date range matches a preset filter
  const getFilterTypeFromDates = (start: string, end: string) => {
    if (!start || !end) return "Today";

    const startDate = new Date(start);
    const endDate = new Date(end);
    const now = new Date();

    // Calculate the time difference in hours
    const timeDiffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    // Check if it's approximately 24 hours (Today or Yesterday)
    if (timeDiffHours >= 23 && timeDiffHours <= 25) {
      // Check if end date is close to now (within a few hours) = "Today"
      const hoursDiffFromNow = Math.abs((endDate.getTime() - now.getTime()) / (1000 * 60 * 60));

      if (hoursDiffFromNow < 2) {
        // End date is very close to now = "Today" (last 24 hours)
        return "Today";
      }

      // Check if end date is close to yesterday
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const hoursDiffFromYesterday = Math.abs((endDate.getTime() - yesterday.getTime()) / (1000 * 60 * 60));

      if (hoursDiffFromYesterday < 2) {
        // End date is close to yesterday = "Yesterday"
        return "Yesterday";
      }
    }

    // Check if it's approximately 7 days (1 Week)
    const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff >= 6.5 && daysDiff <= 7.5) {
      return "1 Week";
    }

    // Otherwise it's custom
    return "Custom";
  };

  // ✅ Initialize state from Redux when modal opens
  useEffect(() => {
    if (isVisible && vehicleHistoryDateRange !== null) {
      const filterType = getFilterTypeFromDates(
        vehicleHistoryDateRange.start,
        vehicleHistoryDateRange.end
      );
      setSelectedFilter(filterType);

      if (filterType === "Custom") {
        setFromDateTime(vehicleHistoryDateRange.start);
        setToDateTime(vehicleHistoryDateRange.end);
      }
    } else if (isVisible && location.pathname !== "/company/modules/monitoring") {
      // If reopening from playback page without saved dates, default to Today
      setSelectedFilter("Today");
    }
  }, [isVisible]);

  // ✅ Update fromDateTime & toDateTime whenever filter changes
  useEffect(() => {
    const now = new Date();

    if (selectedFilter === "Today") {
      // Today = Last 24 hours (Yesterday's current time → Today's current time)
      const endDate = new Date(now);
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 1); // Go back 1 day (24 hours)

      setFromDateTime(startDate.toISOString().slice(0, 16));
      setToDateTime(endDate.toISOString().slice(0, 16));
    } else if (selectedFilter === "Yesterday") {
      // Yesterday = 24 hours before that (2 days ago → Yesterday's current time)
      const endDate = new Date(now);
      endDate.setDate(now.getDate() - 1); // Yesterday's current time

      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 2); // 2 days ago (48 hours back)

      setFromDateTime(startDate.toISOString().slice(0, 16));
      setToDateTime(endDate.toISOString().slice(0, 16));
    } else if (selectedFilter === "1 Week") {
      // 1 Week = Last 7 days (7 days ago → Now)
      const endDate = new Date(now);
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);

      setFromDateTime(startDate.toISOString().slice(0, 16));
      setToDateTime(endDate.toISOString().slice(0, 16));
    } else if (selectedFilter === "Custom") {
      // Custom: Use saved dates from Redux if available
      if (vehicleHistoryDateRange !== null) {
        setFromDateTime(vehicleHistoryDateRange.start);
        setToDateTime(vehicleHistoryDateRange.end);
      } else if (fromDateTime === "" && toDateTime === "") {
        // If no saved dates and fields are empty, set a default
        const endDate = new Date(now);
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);

        setFromDateTime(startDate.toISOString().slice(0, 16));
        setToDateTime(endDate.toISOString().slice(0, 16));
      }
      // If dates already manually entered, keep them
    }
  }, [selectedFilter]);

  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
    }
  };

  const fetchVehicleHistoryData = async () => {
    setLoading(true);
    dispatch(setVehicleHistoryData(null));
    try {
      const data: any = await getAll({
        url: `${GET_VEHICLE_HISTORY}/${selectedSingleDevice?.id}?fromDateTime=${fromDateTime}&toDateTime=${toDateTime}`,
      });
      if (data) {
        const filteredHistory = filterHistoryData(data?.data?.history);
        dispatch(setVehicleHistoryData(filteredHistory));
        dispatch(
          setVehicleHistoryDateRange({ start: fromDateTime, end: toDateTime })
        );
        if (location.pathname == "/company/modules/monitoring") {
          navigate(
            `${process.env.PUBLIC_URL}/company/modules/monitoring/playback`
          );
        } else {
          addToggle();
        }
      } else {
        Swal.fire({
          text: "Data not found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname == "/company/modules/monitoring") {
      setSelectedFilter("Today");
    }
  }, []);

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">Playback History</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form className="form-bookmark needs-validation">
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Start Timeframe</P>
                  <Select
                    value={selectedFilter !== "" ? selectedFilter : null}
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select Timeframe"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "").includes(input)
                    }
                    onChange={(e) => {
                      setSelectedFilter(e);
                    }}
                    options={daysFilter}
                  />
                </FormGroup>
              </Row>
              {/* Custom Date Selection */}
              {selectedFilter === "Custom" && (
                <>
                  <Row>
                    <FormGroup className="col-md-12 create-group">
                      <P>Start Date & Time</P>
                      <input
                        className="form-control"
                        type="datetime-local"
                        value={fromDateTime}
                        onChange={(e) => setFromDateTime(e.target.value)}
                      />
                      <span style={{ color: "red" }}>
                        {errors.startDateTime &&
                          "Start Date & Time is required"}
                      </span>
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup
                      className="col-md-12 create-group"
                      style={{ marginTop: "-20px" }}
                    >
                      <P>End Date & Time</P>
                      <input
                        className="form-control"
                        type="datetime-local"
                        value={toDateTime}
                        onChange={(e) => setToDateTime(e.target.value)}
                      />
                      <span style={{ color: "red" }}>
                        {errors.endDateTime && "End Date & Time is required"}
                      </span>
                    </FormGroup>
                  </Row>
                </>
              )}
              <Button
                color="primary"
                className="me-1"
                onClick={() => {
                  fetchVehicleHistoryData();
                  // console.log("From:", fromDateTime, "To:", toDateTime);
                }}
              >
                {loading ? "Loading ..." : `Start`}
              </Button>
              &nbsp;&nbsp;
              <Button
                disabled={loading ? true : false}
                color="secondary"
                onClick={addToggle}
              >
                Cancel
              </Button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default PlaybackModal;
