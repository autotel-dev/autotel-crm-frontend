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
import { setCreateComplainModalData } from "../../../../ReaduxToolkit/Reducer/ComplainCenterSlice";
import Loader from "../../../Utilities/Loader/Loader";
import Location from "./CreateComplainModalComponents/Location";
import CustomerInfo from "./CreateComplainModalComponents/CustomerInfo";
import VehicleInfo from "./CreateComplainModalComponents/VehicleInfo";
import ComplainHistory from "./CreateComplainModalComponents/ComplainHistory";
import ResponseForm from "./CreateComplainModalComponents/Response";
import { H4 } from "../../../../AbstractElements";
import { setNRReport } from "../../../../ReaduxToolkit/Reducer/NRSlice";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  isDeviceSelectedModalVisible: any;
  setIsDeviceSelectedModalVisible: any;
  selectedItems: any;
  tab: string;
  onCreated?: () => void;
}

const CreateComplainModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  isDeviceSelectedModalVisible,
  setIsDeviceSelectedModalVisible = () => {},
  selectedItems,
  tab,
  onCreated,
}) => {
  const { report } = useSelector((state: any) => state.nrReport);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [basicTab, setBasicTab] = useState(tab);
  const { createComplainModalData } = useSelector(
    (state: any) => state.complainCenter
  );
  useEffect(() => {
    if (selectedItems.length > 0) {
      const updatedReport = report.map((item: any) => {
        // Check if the item matches the selected item by ID
        if (item.id === selectedItems[0].id) {
          // Return a new object with the updated status
          return {
            ...item,
            status: "IN PROGRESS", // Update the status to 'PENDING'
          };
        }
        // Return the item unchanged if no match is found
        return item;
      });

      // Dispatch the updated report
      dispatch(setNRReport(updatedReport));
    }
  }, [selectedItems]);

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
      element: <VehicleInfo />,
    },
    {
      id: "4",
      element: <ComplainHistory />,
    },
    {
      id: "5",
      element: (
        <ResponseForm
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          isDeviceSelectedModalVisible={isDeviceSelectedModalVisible}
          setIsDeviceSelectedModalVisible={setIsDeviceSelectedModalVisible}
          selectedItems={selectedItems}
          setBasicTab={setBasicTab}
          onCreated={onCreated}
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
        dispatch(setCreateComplainModalData(null));
        setBasicTab("1");
      }}
      size="xl"
      className="at-modal at-modal--complaint"
      onClosed={() => {
        // setValue("")
        setIsVisible(false);
        dispatch(setCreateComplainModalData(null));
        setBasicTab("1");
      }}
    >
      <div className="modal-header">
        <H4 className="modal-title">
          New complaint
          <span className="at-modal__sub">Device {selectedItems[0].name}</span>
        </H4>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
            dispatch(setCreateComplainModalData(null));
            setBasicTab("1");
          }}
        ></Button>
      </div>
      <ModalBody>
        <>
          {createComplainModalData == null ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "70vh",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Loader />
              </div>
            </div>
          ) : createComplainModalData == undefined ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "70vh",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                No Data Found
              </div>
            </div>
          ) : (
            <div>
              <Nav className="at-tabs" role="tablist">
                {modalTabs.map((item, index) => (
                  <NavItem key={index}>
                    <NavLink
                      className={basicTab === item.id ? "active" : ""}
                      role="tab"
                      aria-selected={basicTab === item.id}
                      onClick={() => setBasicTab(item.id)}
                    >
                      {item.id === "1"
                        ? "Location"
                        : item.id === "2"
                        ? "Customer Info"
                        : item.id === "3"
                        ? "Vehicle Info"
                        : item.id === "4"
                        ? "Complain History"
                        : "Response"}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
              <TabContent
                activeTab={basicTab}
                className="at-tabs__body"
                style={{ height: "68vh", overflowY: "auto", overflowX: "hidden" }}
              >
                {modalTabs &&
                  modalTabs.map((item, index) => (
                    <TabPane
                      className="fade show"
                      tabId={item.id}
                      key={index}
                      style={{ height: "100%" }}
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

export default CreateComplainModal;
