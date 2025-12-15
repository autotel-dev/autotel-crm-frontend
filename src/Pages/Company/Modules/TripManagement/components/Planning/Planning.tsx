import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import Breadcrumbs from "../../../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { useSelector } from "react-redux";
import GeofenceTab from "./components/GeofenceTab";
import DriversTab from "./components/DriversTab";
import AlertManagementTab from "./components/AlertManagementTab";

const Planning = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const [activeTab, setActiveTab] = useState("1");

  const tabs = [
    { id: "1", label: "Geofence", component: <GeofenceTab /> },
    { id: "2", label: "Drivers", component: <DriversTab /> },
    { id: "3", label: "Alert Management", component: <AlertManagementTab /> },
  ];

  return (
    <>
      <Container fluid className="dashboard_default">
        <Row className="widget-grid">
          <Breadcrumbs
            mainTitle="Planning"
            parent="Trip Management"
            title="Module / Planning"
          />
        </Row>

        <Row>
          <Col>
            <div style={{ backgroundColor: "white", borderRadius: "10px" }}>
              <Nav
                tabs
                className="simple-wrapper"
                style={{
                  backgroundColor: `${
                    userPersonalizationData !== null &&
                    userPersonalizationData?.buttonsAndBarsColor !== null
                      ? userPersonalizationData?.buttonsAndBarsColor
                      : "#63d5be"
                  }`,
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  padding: "10px",
                }}
              >
                {tabs.map((tab) => (
                  <NavItem
                    key={tab.id}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <NavLink
                      className={` ${activeTab === tab.id ? "active" : ""}`}
                      style={{
                        color: `${
                          activeTab === tab.id
                            ? userPersonalizationData !== null &&
                              userPersonalizationData?.buttonsAndBarsColor !==
                                null
                              ? userPersonalizationData?.buttonsAndBarsColor
                              : "#63d5be"
                            : "white"
                        }`,
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
              <TabContent activeTab={activeTab}>
                {tabs.map((tab) => (
                  <TabPane className="fade show" tabId={tab.id} key={tab.id}>
                    {tab.component}
                  </TabPane>
                ))}
              </TabContent>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Planning;
