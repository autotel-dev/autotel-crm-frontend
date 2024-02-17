import { useState, useEffect } from "react";
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
import Location from "./modalComponents/Location";
import PreviousAlerts from "./modalComponents/PreviousAlerts";
import ResponseForm from "./modalComponents/Response";
import CustomerInfo from "./modalComponents/CustomerInfo";
import Loader from "../../../../../Loader/Loader";
import { setModalData } from "../../../../../../ReaduxToolkit/Reducer/AlertsSlice";

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
  const { modalData } = useSelector((state: any) => state.alerts);

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
        <ResponseForm
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          setBasicTab={setBasicTab}
        />
      ),
    },
  ];

  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={() => {
        setIsVisible(!isVisible);
        dispatch(setModalData(null));
        setBasicTab("1");
      }}
      size="xl"
      onClosed={() => {
        // setValue("")
        setIsVisible(false);
        dispatch(setModalData(null));
        setBasicTab("1");
      }}
    >
      <div className="modal-header">
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
            dispatch(setModalData(null));
            setBasicTab("1");
          }}
        ></Button>
      </div>
      <ModalBody>
        <>
          {modalData === null ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "70vh",
                backgroundColor: "white",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Loader />
              </div>
            </div>
          ) : (
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
                      height: "55px",
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
                        ? "History"
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
          )}
        </>
      </ModalBody>
    </Modal>
  );
};

export default AssignedAlertModal;
