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

  const vehicleData = [
    {
      id: 1,
      name: "Vehicle 1",
      status: "Active",
    },
    {
      id: 2,
      name: "Vehicle 2",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Vehicle 3",
      status: "Active",
    },
    {
      id: 4,
      name: "Vehicle 4",
      status: "Maintenance",
    },
    {
      id: 5,
      name: "Vehicle 5",
      status: "Active",
    },
    ...Array.from({ length: 15 }, (_, i) => ({
      id: i + 6,
      name: `Vehicle ${i + 6}`,
      status: i % 3 === 0 ? "Active" : "Inactive",
    })),
  ];
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
            width: "98%",
            paddingLeft: "5px",
            // paddingTop: "5px",
            paddingBottom: "20px",
          }}
        >
          <Topbar />
        </div>

        <div
          style={{
            display: "flex",
            gap: "30px",
          }}
        >
          <Col xl="5" lg="12" md="5" style={{ paddingLeft: "2.5%" }}>
            <div>
              <Row>
                <SidebarMonitoring vehicleData={vehicleData} />
              </Row>
            </div>
          </Col>
          <Col xl="6" lg="12" md="6">
            {/* <div>
              <Row>
                {selectedSingleDevice === null ? (
                  <VehicleStatusPieChart vehicleData={vehicleData} />
                ) : (
                  <Vehicle3dImageDetails />
                )}
              </Row>
            </div> */}
            <div>
              {/* abc */}
              <Row>
                <div>
                  {selectedSingleDevice === null ? (
                    <Alerts />
                  ) : (
                    <SingleVehicleDetails />
                  )}
                </div>
              </Row>
            </div>
          </Col>
        </div>
      </div>
    </Container>
  );
}

export default MonitoringDetails;
