import { Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target, PlusCircle } from "react-feather";
import { all, active, inactive } from "../../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";
import { setCustomer } from "../../../ReaduxToolkit/Reducer/SalesSlice";
import { useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import CreateNewCustomer from "../Modules/SAIO/components/Sales/components/Customer/CreateNewCustomer/CreateNewCustomer";
import { useSelector } from "react-redux";

const CustomersListNav = () => {
  const { activeTab } = useAppSelector((state: any) => state.project);
  const dispatch = useAppDispatch();
  const [addModal, setAddModal] = useState(false);

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const addToggle = () => {
    dispatch(setCustomer(null));
    setAddModal(!addModal);
  };

  return (
    <Row>
      <Col md={6}>
        <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => dispatch(setActiveTab("1"))}
            >
              <Target />
              {all}
            </NavLink>
          </NavItem>
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => dispatch(setActiveTab("2"))}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem>
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "3" ? "active" : ""}
              onClick={() => dispatch(setActiveTab("3"))}
            >
              <Info /> {inactive}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <Col md={6}>
        <div className="text-end">
          <button
            className={`btn ${
              userPersonalizationData?.buttonsAndBarsColor == null
                ? "btn-primary"
                : ""
            }`}
            style={{
              color: "white",
              backgroundColor: `${
                userPersonalizationData !== null &&
                userPersonalizationData?.buttonsAndBarsColor
                  ? userPersonalizationData.buttonsAndBarsColor
                  : ""
              }`,
            }}
            onClick={addToggle}
          >
            <PlusCircle />
            Create New Customer
          </button>
          <Modal isOpen={addModal} toggle={addToggle} size="xl" centered>
            <div style={{ background: "#f8f9fa", padding: "15px", borderBottom: "1px solid #dee2e6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ margin: 0 }}>Add Customer</h4>
              <button onClick={addToggle} style={{ background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
            </div>
            <ModalBody style={{ padding: "10px", maxHeight: "80vh", overflowY: "auto", overflowX: "hidden" }}>
              <CreateNewCustomer isModal={true} onClose={() => setAddModal(false)} />
            </ModalBody>
          </Modal>
        </div>
      </Col>
    </Row>
  );
};

export default CustomersListNav;
