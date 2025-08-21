import { Col } from "reactstrap";
import { useState } from "react";

import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import AlertsModal from "./components/AlertsModal";
import SchedulingModal from "./components/SchedulingModal";
import NotificationsModal from "./components/NotificationsModal";
import SendCommandModal from "./components/SendCommandModal";
import GeofenceModal from "./components/GeofenceModal";

const CreateNewAlertManagement = () => {
  const [addModalForAlert, setAddModalForAlert] = useState(false);
  const [addModalForScheduling, setAddModalForScheduling] = useState(false);
  const [addModalForNotifications, setAddModalForNotifications] =
    useState(false);
  const [addModalForSendCommand, setAddModalForSendCommand] = useState(false);
  const [addModalForGeofence, setAddModalForGeofence] = useState(false);

  const addToggleForAlertModal = () => {
    setAddModalForAlert(!addModalForAlert);
  };

  const addToggleForSchedulingModal = () => {
    setAddModalForScheduling(!addModalForScheduling);
  };

  const addToggleForNotificationsModal = () => {
    setAddModalForNotifications(!addModalForNotifications);
  };

  const addToggleForSendCommandModal = () => {
    setAddModalForSendCommand(!addModalForSendCommand);
  };

  const addToggleForGeofenceModal = () => {
    setAddModalForGeofence(!addModalForGeofence);
  };

  const items: MenuProps["items"] = [
    { label: "Alerts", key: "1" },
    { label: "Geofence", key: "2" },
    { label: "Notifications", key: "3" },
    { label: "Send Command", key: "4" },
    { label: "Schedule", key: "5" },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      addToggleForAlertModal();
    }

    if (e.key === "2") {
      addToggleForGeofenceModal();
    }

    if (e.key === "3") {
      addToggleForNotificationsModal();
    }
    if (e.key === "4") {
      addToggleForSendCommandModal();
    }
    if (e.key === "5") {
      addToggleForSchedulingModal();
    }
  };

  const menuProps = { items, onClick: handleMenuClick };

  return (
    <Col md={6}>
      <div className="text-end">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingLeft: "80%",
          }}
        >
          <Dropdown.Button
            menu={menuProps}
            type="primary"
            style={{ color: "black" }}
          >
            Select Option
          </Dropdown.Button>
        </div>

        {addModalForAlert && (
          <AlertsModal
            isVisible={addModalForAlert}
            setIsVisible={setAddModalForAlert}
          />
        )}

        {addModalForGeofence && (
          <GeofenceModal
            isVisible={addModalForGeofence}
            setIsVisible={setAddModalForGeofence}
          />
        )}

        {addModalForScheduling && (
          <SchedulingModal
            isVisible={addModalForScheduling}
            setIsVisible={setAddModalForScheduling}
          />
        )}

        {addModalForNotifications && (
          <NotificationsModal
            isVisible={addModalForNotifications}
            setIsVisible={setAddModalForNotifications}
          />
        )}

        {addModalForSendCommand && (
          <SendCommandModal
            isVisible={addModalForSendCommand}
            setIsVisible={setAddModalForSendCommand}
          />
        )}
      </div>
    </Col>
  );
};

export default CreateNewAlertManagement;
