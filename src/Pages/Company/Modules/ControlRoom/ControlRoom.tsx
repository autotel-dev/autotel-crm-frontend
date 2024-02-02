import {
  Col,
  Container,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import LiveAlerts from "./Events/LiveAlerts/LiveAlerts";
import AssignedAlerts from "./Events/AssignedAlerts/AssignedAlerts";
import { useState } from "react";
import CompletedAlerts from "./Events/CompletedAlerts/CompletedAlerts";

const ControlRoom = () => {
  const events = [
    {
      id: "1",
      element: <AssignedAlerts />,
    },
    {
      id: "2",
      element: <CompletedAlerts />,
    },
  ];
  const [basicTab, setBasicTab] = useState("1");
  return (
    <Container fluid className="dashboard_default">
      <Row className="widget-grid">
        <Breadcrumbs
          mainTitle="Control Room"
          parent="Company"
          title="Module / Control Room"
        />
      </Row>
      <Row>
        <Col xl="6">
          <LiveAlerts />
        </Col>
        <Col xl="6">
          <div style={{ backgroundColor: "white" }}>
            <Nav tabs className="simple-wrapper">
              <NavItem
                style={{ width: "50%", height: "50px", textAlign: "center" }}
              >
                <NavLink
                  className={`txt-primary ${basicTab === "1" ? "active" : ""}`}
                  onClick={() => setBasicTab("1")}
                >
                  Assigned Events
                </NavLink>
              </NavItem>
              <NavItem
                style={{ width: "50%", height: "50px", textAlign: "center" }}
              >
                <NavLink
                  className={`txt-primary ${basicTab === "2" ? "active" : ""}`}
                  onClick={() => setBasicTab("2")}
                >
                  Completed Events
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={basicTab}>
              {events &&
                events.map((item, index) => (
                  <TabPane className="fade show" tabId={item.id} key={index}>
                    {item.element}
                  </TabPane>
                ))}
            </TabContent>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ControlRoom;
