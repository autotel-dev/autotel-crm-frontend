import { Button, FormGroup, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../../../utils/Constant";
import { H4, P } from "../../../../AbstractElements";
import { useState, useMemo, useEffect } from "react";

import { Select } from "antd";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

interface SendCommandModalProps {
  isVisible: any;
  setIsVisible: any;
}

const SendCommandModal: React.FC<SendCommandModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();
  const { devices } = useSelector((state: any) => state.monitoring);

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");

  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
    }
  };

  return (
    <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
      <div className="modal-header">
        <H4 className="modal-title">Send Command</H4>
        <Button
          color="transprant"
          className="btn-close"
          onClick={addToggle}
        ></Button>
      </div>
      <ModalBody>
        <form>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Name</P>
              <input
                className="form-control"
                type="text"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span style={{ color: "red" }}>Alert name is required</span>
              )}
            </FormGroup>
          </Row>

          <Row>
            <FormGroup
              check
              className="col-12 mb-3"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "-7px",
                }}
              >
                <input
                  type="checkbox"
                  id="active"
                  className="custom-checkbox me-2"
                />
                <label htmlFor="active" style={{ paddingTop: "7px" }}>
                  Active
                </label>
              </div>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Select Type</P>
              <Select
                value={type || null}
                style={{ width: "100%", height: 36 }}
                placeholder="Select Type"
                onChange={(e) => setType(e)}
                options={[
                  { value: "OVERSPEED", label: "Overspeed (kph)" },
                  { value: "ZONE OUT", label: "Zone Out" },
                  { value: "ZONE IN", label: "Zone In" },
                  { value: "IGNITION ON", label: "Ignition On" },
                  { value: "IGNITION OUT", label: "Ignition Out" },
                ]}
              />
            </FormGroup>
          </Row>

          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Save`}
          </Button>
          <Button disabled={loading} color="secondary" onClick={addToggle}>
            {Cancel}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default SendCommandModal;
