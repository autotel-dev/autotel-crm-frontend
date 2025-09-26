import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { H4, P } from "../../../../../../../AbstractElements";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";

interface PlaybackModalProps {
  isVisible: any;
  setIsVisible: any;
}

const PlaybackModal: React.FC<PlaybackModalProps> = ({
  isVisible,
  setIsVisible = () => {},
}: any) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();
  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
    }
  };

  const [selectedFilter, setSelectedFilter] = useState("Today");

  const daysFilter = [
    { label: "Today", value: "Today" },
    { label: "Yesterday", value: "Yesterday" },
    { label: "1 Week", value: "1 Week" },
    { label: "Custom", value: "Custom" },
  ];

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
            <form
              className="form-bookmark needs-validation"
              //   onSubmit={handleSubmit(addBranch)}
            >
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
              {selectedFilter == "Custom" && (
                <Row>
                  <FormGroup className="col-md-12 create-group">
                    <P>Start Date & Time</P>
                    <input
                      className="form-control"
                      type="datetime-local"
                      {...register("startDateTime", { required: true })}
                    />
                    <span style={{ color: "red" }}>
                      {errors.startDateTime && "Start Date & Time is required"}
                    </span>
                  </FormGroup>
                </Row>
              )}
              {selectedFilter == "Custom" && (
                <Row>
                  <FormGroup
                    className="col-md-12 create-group"
                    style={{ marginTop: "-20px" }}
                  >
                    <P>End Date & Time</P>
                    <input
                      className="form-control"
                      type="datetime-local"
                      {...register("endDateTime", { required: true })}
                    />
                    <span style={{ color: "red" }}>
                      {errors.endDateTime && "End Date & Time is required"}
                    </span>
                  </FormGroup>
                </Row>
              )}
              <Button
                color="primary"
                className="me-1"
                onClick={() => {
                  navigate(
                    `${process.env.PUBLIC_URL}/company/modules/monitoring/playback`
                  );
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
