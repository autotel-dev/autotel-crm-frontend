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
import Loader from "../../../Loader/Loader";
import Location from "./CreateComplainModalComponents/Location";
import CustomerInfo from "./CreateComplainModalComponents/CustomerInfo";
import VehicleInfo from "./CreateComplainModalComponents/VehicleInfo";
import ComplainHistory from "./CreateComplainModalComponents/ComplainHistory";
import ResponseForm from "./CreateComplainModalComponents/Response";
import { H4 } from "../../../../AbstractElements";


interface PropsTypes {
    isVisible: boolean; // Change 'boolean' to the actual type of isVisible
    setIsVisible: any;
    isDeviceSelectedModalVisible: any;
    setIsDeviceSelectedModalVisible: any;
    selectedItems: any;
    tab: string;
}

const CreateComplainModal: React.FC<PropsTypes> = ({
    isVisible,
    setIsVisible = () => { },
    isDeviceSelectedModalVisible,
    setIsDeviceSelectedModalVisible = () => { },
    selectedItems,
    tab,
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [basicTab, setBasicTab] = useState(tab);
    const { createComplainModalData } = useSelector((state: any) => state.complainCenter);

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
            onClosed={() => {
                // setValue("")
                setIsVisible(false);
                dispatch(setCreateComplainModalData(null));
                setBasicTab("1");
            }}
        >
            <div className="modal-header">
                <H4 className="modal-title">Device Name : {selectedItems[0].name}</H4>
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
                                backgroundColor: "white",
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
                                backgroundColor: "white",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    textAlign: "center",
                                    fontSize: "25px",
                                    fontWeight: "bold",
                                }}
                            >
                                No Data Found
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
                                            width: "20%",
                                            height: "40px",
                                            textAlign: "center",
                                            fontSize: "18px",
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
                                style={{ height: "70vh", overflowY: "auto" }}
                            >
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

export default CreateComplainModal;
