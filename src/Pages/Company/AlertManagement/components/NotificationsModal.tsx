import { Button, FormGroup, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../../../utils/Constant";
import { H4, P } from "../../../../AbstractElements";
import { useState, useMemo, useEffect } from "react";

import { Select } from "antd";

import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import "./styles.css";

interface NotificationsModalProps {
  isVisible: any;
  setIsVisible: any;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
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
        <H4 className="modal-title">Assign Notifications</H4>
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
              <P>Select Alert</P>
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
          <Row className="mb-3">
            {/* Send Notification */}
            <FormGroup
              check
              className="col-12 mb-2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <input
                type="checkbox"
                id="sendNotification"
                className="custom-checkbox me-2"
              />
              <label
                htmlFor="sendNotification"
                style={{ margin: "0px", padding: "0px" }}
              >
                Send notification
              </label>
            </FormGroup>

            {/* Auto Hide Popup */}
            <FormGroup
              check
              className="col-12 mb-2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <input
                type="checkbox"
                id="autoHidePopup"
                className="custom-checkbox me-2"
              />
              <label
                htmlFor="autoHidePopup"
                style={{ margin: "0px", padding: "0px" }}
              >
                Auto Hide Popup
              </label>
            </FormGroup>

            {/* Push Notification */}
            <FormGroup
              check
              className="col-12 mb-2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <input
                type="checkbox"
                id="pushNotifications"
                className="custom-checkbox me-2"
              />
              <label
                htmlFor="pushNotifications"
                style={{ margin: "0px", padding: "0px" }}
              >
                Push Notification
              </label>
            </FormGroup>

            {/* Email Notification with Input */}
            <FormGroup
              check
              className="col-12 mb-3"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  id="emailNotification"
                  className="custom-checkbox me-2"
                />
                <label htmlFor="emailNotification">Email Notification</label>
              </div>
              <input
                className="form-control mt-1"
                type="text"
                placeholder="Enter email address"
              />
            </FormGroup>

            {/* SMS Notification with Input */}
            <FormGroup
              check
              className="col-12 mb-3"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  id="smsNotification"
                  className="custom-checkbox me-2"
                />
                <label htmlFor="smsNotification">SMS Notification</label>
              </div>
              <input
                className="form-control mt-1"
                type="text"
                placeholder="Enter phone number"
              />
            </FormGroup>

            {/* Webhook Notification with Input */}
            <FormGroup
              check
              className="col-12 mb-3"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  id="webhookNotification"
                  className="custom-checkbox me-2"
                />
                <label htmlFor="webhookNotification">
                  Webhook Notification
                </label>
              </div>
              <input
                className="form-control mt-1"
                type="text"
                placeholder="Enter webhook URL"
              />
            </FormGroup>

            <FormGroup
              check
              className="col-12 mb-3"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  id="emailNotificationViaLink"
                  className="custom-checkbox me-2"
                />
                <label htmlFor="emailNotificationViaLink">
                  Email Notification with sharing link
                </label>
              </div>
              <input
                className="form-control mt-1"
                type="text"
                placeholder="Enter Link URL"
              />
            </FormGroup>

            <FormGroup
              check
              className="col-12 mb-3"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  id="smsNotificationViaLink"
                  className="custom-checkbox me-2"
                />
                <label htmlFor="smsNotificationViaLink">
                  SMS Notification with sharing link
                </label>
              </div>
              <input
                className="form-control mt-1"
                type="text"
                placeholder="Enter Link URL"
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

export default NotificationsModal;
