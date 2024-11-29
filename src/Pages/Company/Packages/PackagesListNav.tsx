import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { useAppSelector } from "../../../ReaduxToolkit/Hooks";

import CreateNewDepartment from "./CreateNewPackage";

const PackagesListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);

  return (
    <Row>
      {/* style={{ display: "flex", justifyContent: "end", }} */}
      <Col md={6}>
        <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {}}
            >
              <Target />
              All
            </NavLink>
          </NavItem>
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "3" ? "active" : ""}
              onClick={() => {}}
            >
              <Info /> Inactive
            </NavLink>
          </NavItem>
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => {}}
            >
              <CheckCircle />
              Active
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewDepartment />
    </Row>
  );
};

export default PackagesListNav;
