import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalBody,
} from "reactstrap";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { H3 } from "../../../../../../AbstractElements";
import AssignedAlerts from "./AssignedAlerts";
import CompletedAlerts from "../CompletedAlerts/CompletedAlerts";
import Location from "./modalComponents/Location";
import PreviousAlerts from "./modalComponents/PreviousAlerts";
import ResponseForm from "./modalComponents/Response";
import CustomerInfo from "./modalComponents/CustomerInfo";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  tab: string;
}

const AssignedAlertModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  tab,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [basicTab, setBasicTab] = useState(tab);

  const modalTabs = [
    {
      id: "1",
      element: <Location />,
    },
    {
      id: "2",
      element: <CustomerInfo />,
    },
    {
      id: "3",
      element: <PreviousAlerts />,
    },
    {
      id: "4",
      element: (
        <ResponseForm isVisible={isVisible} setIsVisible={setIsVisible} />
      ),
    },
  ];
  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={() => {
        setIsVisible(!isVisible);
      }}
      size="xl"
      onClosed={() => {
        // setValue("")
        setIsVisible(false);
      }}
    >
      <div className="modal-header">
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
          }}
        ></Button>
      </div>
      <ModalBody>
        <div style={{ backgroundColor: "white" }}>
          <Nav
            tabs
            className="simple-wrapper"
            style={{
              backgroundColor: "#63d5be",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            {modalTabs.map((item, index) => (
              <NavItem
                key={index}
                style={{
                  width: "25%",
                  height: "50px",
                  textAlign: "center",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
              >
                <NavLink
                  className={` ${basicTab === item.id ? "active" : ""}`}
                  style={{
                    color: `${basicTab === item.id ? "#63d5be" : "white"}`,
                  }}
                  onClick={() => setBasicTab(item.id)}
                >
                  {item.id === "1"
                    ? "Location"
                    : item.id === "2"
                    ? "Customer Info"
                    : item.id === "3"
                    ? "Previous Alerts"
                    : "Response"}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={basicTab} style={{ height: "70vh" }}>
            {modalTabs &&
              modalTabs.map((item, index) => (
                <TabPane
                  className="fade show"
                  tabId={item.id}
                  key={index}
                  style={{ height: "70vh" }}
                >
                  {item.element}
                </TabPane>
              ))}
          </TabContent>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AssignedAlertModal;
