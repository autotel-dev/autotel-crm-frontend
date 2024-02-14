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
import CompletedAlerts from "./Events/CompletedAlerts/CompletedAlerts";
import { useEffect, useState } from "react";
import { getAll } from "../../../../Api";
import Loader from "../../../Loader/Loader";
import { useDispatch } from "react-redux";
import { setLiveAlerts } from "../../../../ReaduxToolkit/Reducer/AlertsSlice";

const ControlRoom = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getAll({ url: "company/alert-events?pageNo=1" }).then((data: any) => {
      console.log("api call --- >", data);
      setLoading(false);
      if (data !== undefined) {
        if (data.success) {
          console.log("length --- >", data.data.allAlertEvents.length);
          dispatch(setLiveAlerts(data.data.allAlertEvents));
        }
      }
    });
  }, []);
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
      {!loading ? (
        <Row>
          <Col xl="6">
            <LiveAlerts />
          </Col>
          <Col xl="6">
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
                    width: "50%",
                    height: "50px",
                    textAlign: "center",
                    fontSize: "22px",
                    cursor: "pointer",
                  }}
                >
                  <NavLink
                    className={` ${basicTab === "1" ? "active" : ""}`}
                    style={{
                      color: `${basicTab === "1" ? "#63d5be" : "white"}`,
                    }}
                    onClick={() => setBasicTab("1")}
                  >
                    Assigned Events
                  </NavLink>
                </NavItem>
                <NavItem
                  style={{
                    width: "50%",
                    height: "50px",
                    textAlign: "center",
                    fontSize: "22px",
                    cursor: "pointer",
                  }}
                >
                  <NavLink
                    className={` ${basicTab === "2" ? "active" : ""}`}
                    style={{
                      color: `${basicTab === "2" ? "#63d5be" : "white"}`,
                    }}
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
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Loader />
          </div>
        </div>
      )}
    </Container>
  );
};

export default ControlRoom;
