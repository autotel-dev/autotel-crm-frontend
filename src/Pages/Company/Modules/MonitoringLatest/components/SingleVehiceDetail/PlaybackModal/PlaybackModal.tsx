import { Col } from "reactstrap";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, FormGroup, Modal, ModalBody, Row } from "reactstrap";
import { H4, P } from "../../../../../../../AbstractElements";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import { getAll } from "../../../../../../../Utilities/api";
import { GET_VEHICLE_HISTORY } from "../../../../../../../Utilities/api/apiEndpoints";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setVehicleHistoryData } from "../../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
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
  const [loading, setLoading] = useState(false);
  const {
    register,
    formState: { errors },
  } = useForm<any>();

  useEffect(() => {
    dispatch(setVehicleHistoryData(null));
  }, []);

  const [selectedFilter, setSelectedFilter] = useState("Today");

  const { selectedSingleDevice, vehicleHistoryData } = useSelector(
    (state: any) => state.monitoring
  );

  function filterHistoryData(history: any[]) {
    if (!Array.isArray(history)) return [];

    const filtered: any[] = [];
    let prevLat: number | null = null;
    let prevLng: number | null = null;

    for (const packet of history) {
      const { latitude, longitude } = packet;

      if (latitude !== prevLat || longitude !== prevLng) {
        filtered.push(packet);
        prevLat = latitude;
        prevLng = longitude;
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

  // ✅ Update fromDateTime & toDateTime whenever filter changes
  useEffect(() => {
    const now = new Date();
    const currentTime = now.toISOString().slice(11, 16); // HH:mm

    if (selectedFilter === "Today") {
      const today = new Date();
      const start = new Date(today);
      start.setHours(now.getHours(), now.getMinutes(), 0, 0);
      setFromDateTime(start.toISOString().slice(0, 16));
      setToDateTime(today.toISOString().slice(0, 16));
    } else if (selectedFilter === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      yesterday.setHours(now.getHours(), now.getMinutes(), 0, 0);

      const end = new Date(yesterday);
      end.setHours(now.getHours(), now.getMinutes(), 0, 0);

      setFromDateTime(yesterday.toISOString().slice(0, 16));
      setToDateTime(end.toISOString().slice(0, 16));
    } else if (selectedFilter === "1 Week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      weekAgo.setHours(now.getHours(), now.getMinutes(), 0, 0);

      const today = new Date();
      today.setHours(now.getHours(), now.getMinutes(), 0, 0);

      setFromDateTime(weekAgo.toISOString().slice(0, 16));
      setToDateTime(today.toISOString().slice(0, 16));
    } else if (selectedFilter === "Custom") {
      setFromDateTime("");
      setToDateTime("");
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

        navigate(
          `${process.env.PUBLIC_URL}/company/modules/monitoring/playback`
        );
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
