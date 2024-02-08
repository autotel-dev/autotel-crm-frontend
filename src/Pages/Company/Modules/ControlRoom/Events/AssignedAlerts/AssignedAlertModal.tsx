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

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
}

const AssignedAlertModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [basicTab, setBasicTab] = useState("1");
  const modalTabs = [
    {
      id: "1",
      element: (
        <div
          style={{
            height: "100%",
            width: "%",
            display: "flex",
            overflow: "unset",
          }}
        >
          <Location />,
        </div>
      ),
    },
    {
      id: "2",
      element: <CompletedAlerts />,
    },
    {
      id: "3",
      element: <CompletedAlerts />,
    },
    {
      id: "4",
      element: <CompletedAlerts />,
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
            <NavItem
              style={{
                width: "25%",
                height: "50px",
                textAlign: "center",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              <NavLink
                className={` ${basicTab === "1" ? "active" : ""}`}
                style={{ color: `${basicTab === "1" ? "#63d5be" : "white"}` }}
                onClick={() => setBasicTab("1")}
              >
                Location
              </NavLink>
            </NavItem>
            <NavItem
              style={{
                width: "25%",
                height: "50px",
                textAlign: "center",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              <NavLink
                className={` ${basicTab === "2" ? "active" : ""}`}
                style={{ color: `${basicTab === "2" ? "#63d5be" : "white"}` }}
                onClick={() => setBasicTab("2")}
              >
                Customer Info
              </NavLink>
            </NavItem>
            <NavItem
              style={{
                width: "25%",
                height: "50px",
                textAlign: "center",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              <NavLink
                className={` ${basicTab === "3" ? "active" : ""}`}
                style={{ color: `${basicTab === "3" ? "#63d5be" : "white"}` }}
                onClick={() => setBasicTab("3")}
              >
                Previous Alerts
              </NavLink>
            </NavItem>
            <NavItem
              style={{
                width: "25%",
                height: "50px",
                textAlign: "center",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              <NavLink
                className={` ${basicTab === "4" ? "active" : ""}`}
                style={{ color: `${basicTab === "4" ? "#63d5be" : "white"}` }}
                onClick={() => setBasicTab("4")}
              >
                Response
              </NavLink>
            </NavItem>
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
