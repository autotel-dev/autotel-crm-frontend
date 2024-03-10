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
import { useDispatch, useSelector } from "react-redux";
import {
  setLiveAlerts,
  setAssignedAlerts,
  setCompletedAlerts,
  setLiveAlertsData,
} from "../../../../ReaduxToolkit/Reducer/AlertsSlice";
import Swal from "sweetalert2";

const ControlRoom = () => {
  const { assignedAlerts, completedAlerts } = useSelector(
    (state: any) => state.alerts
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(setAssignedAlerts([]));
    dispatch(setLiveAlerts([]));
    dispatch(setLiveAlertsData(null));
    dispatch(setCompletedAlerts([]));
    getAll({ url: "company/alert-events?pageNo=1" }).then((data: any) => {
      console.log("api call --- >", data);
      setLoading(false);
      if (data == undefined) {
        dispatch(setLiveAlerts([]));
        dispatch(setLiveAlertsData(null));
      }
      if (data !== undefined) {
        if (data.success) {
          console.log("length --- >", data.data.allAlertEvents.length);
          dispatch(setLiveAlerts(data.data.allAlertEvents));
          dispatch(setLiveAlertsData(data.data));
        }
        if (!data.success) {
          Swal.fire({
            text: data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    });
    getAll({ url: "company/get-all-assigned-events" }).then((data: any) => {
      console.log("assigned --- >", data);
      // setLoading(false);
      if (data == undefined) {
        dispatch(setAssignedAlerts([]));
      }
      if (data !== undefined) {
        if (data.success) {
          console.log("length --- >", data.data.length);
          dispatch(setAssignedAlerts(data.data));
        }
      }
    });
    getAll({ url: "company/get-all-completed-events" }).then((data: any) => {
      console.log("completed --- >", data);
      // setLoading(false);
      if (data == undefined) {
        dispatch(setCompletedAlerts([]));
      }
      if (data !== undefined) {
        if (data.success) {
          console.log("length --- >", data.data.length);
          dispatch(setCompletedAlerts(data.data));
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
                    Assigned Events ({assignedAlerts.length})
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
                    Completed Events ({completedAlerts.length})
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
