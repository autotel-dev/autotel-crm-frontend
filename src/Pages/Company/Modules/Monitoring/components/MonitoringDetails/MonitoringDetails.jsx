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
        <div
          style={{
            borderRadius: "5px",
            width: "98%",
            paddingLeft: "15px",
            paddingBottom: "20px",
          }}
        >
          <Topbar />
        </div>

        <Row>
          <div
            style={{
              display: "flex",
              gap: "15px",
              minWidth: "100%",
              padding: "0px 28px",
              marginTop: "-35px",
            }}
          >
            <div style={{ minWidth: "43%" }}>
              <SidebarMonitoring />
            </div>
            <div style={{ minWidth: "55%", maxWidth: "55%" }}>
              <div style={{}}>
                {selectedSingleDevice == null ? (
                  <VehicleStatusPieChart />
                ) : (
                  <Vehicle3dImageDetails />
                )}
              </div>
              <div style={{ marginTop: "-20px" }}>
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
