import React from "react";
import Topbar from "../Topbar/Topbar";
import SidebarMonitoring from "../Sidebar/SidebarMonitoring";
import { Col, Container, Row } from "reactstrap";
import { Label } from "reactstrap";
import Vehicle3dImageDetails from "../SingleVehicleComponents/Vehicle3dImageDetails";
import SingleVehicleDetails from "../SingleVehicleComponents/SingleVehicleDetails";
import VehicleStatusPieChart from "../VehiclesCharts/VehicleStatusPieChart";
import Alerts from "../VehicleAlerts/Alerts";
import { useSelector } from "react-redux";

function MonitoringDetails() {
  const { selectedSingleDevice } = useSelector((state) => state.monitoring);

  // console.log("selectedSingleDevice", selectedSingleDevice);

  return (
    <Container fluid={12}>
      <div>
        {/* <div
          style={{
            paddingTop: "5px",
            paddingLeft: "5px",
            paddingBottom: "5px",
          }}
          className="typography"
        >
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              borderRight: "2px solid black",
              padding: "5px 8px",
              cursor: "pointer", // Add pointer for button behavior
              fontWeight: "bold",
            }}
          >
            Vehicles
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              borderRight: "2px solid black",
              padding: "5px 8px",
              cursor: "pointer", // Add pointer for button behavior
              fontWeight: "bold",
            }}
          >
            Drivers
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              borderRight: "2px solid black",
              padding: "5px 8px",
              cursor: "pointer", // Add pointer for button behavior
              fontWeight: "bold",
            }}
          >
            Alerts
          </button>
        </div> */}
        <div
          style={{
            borderRadius: "5px",
            width: "99%",
            paddingLeft: "5px",
            paddingBottom: "20px",
          }}
        >
          <Topbar />
        </div>

        <Row>
          <div
            style={{
              display: "flex",
              gap: "8px",
              minWidth: "100%",
              padding: "0px 20px",
              marginTop: "-40px",
            }}
          >
            <div style={{ minWidth: "42%" }}>
              <SidebarMonitoring />
            </div>
            <div style={{ minWidth: "57%", maxWidth: "57%" }}>
              <div style={{}}>
                {selectedSingleDevice == null ? (
                  <VehicleStatusPieChart />
                ) : (
                  <Vehicle3dImageDetails />
                )}
              </div>
              <div style={{ marginTop: "-22px" }}>
                {selectedSingleDevice == null ? (
                  <Alerts />
                ) : (
                  <SingleVehicleDetails />
                )}
              </div>
            </div>
          </div>
        </Row>
      </div>
    </Container>
  );
}

export default MonitoringDetails;
