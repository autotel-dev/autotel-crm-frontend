import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";
import { FaTimes } from "react-icons/fa";

function Alerts() {
  // Hardcoded vehicle data
  const vehicleData = [
    { id: 1, name: "Vehicle 1", status: "Active" },
    { id: 2, name: "Vehicle 2", status: "Inactive" },
    { id: 3, name: "Vehicle 3", status: "Active" },
    { id: 4, name: "Vehicle 4", status: "Maintenance" },
    { id: 5, name: "Vehicle 5", status: "Active" },
    { id: 6, name: "Vehicle 6", status: "Inactive" },
    { id: 7, name: "Vehicle 7", status: "Active" },
    { id: 8, name: "Vehicle 8", status: "Inactive" },
    { id: 9, name: "Vehicle 9", status: "Active" },
    { id: 10, name: "Vehicle 10", status: "Inactive" },
  ];

  const sampleAlerts = [
    { message: "Ignition On", type: "green" },
    { message: "Crossed 100 Speed", type: "red" },
    { message: "Low Fuel", type: "blue" },
    { message: "Engine Temperature High", type: "red" },
    { message: "Maintenance Due", type: "blue" },
  ];

  // Generate random alerts for vehicles
  const randomAlerts = vehicleData.map((vehicle) => {
    const randomAlert =
      sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
    return {
      id: vehicle.id,
      name: vehicle.name,
      message: randomAlert.message,
      type: randomAlert.type,
    };
  });

  // Define alert background colors
  const alertColors = {
    green: "#eaffea",
    blue: "#e7f3ff",
    red: "#ffe7e7",
  };

  return (
    <Card
      style={{
        borderRadius: "5px",
        minWidth: "100%",
        maxWidth: "100%",
        backgroundColor: "#99A6A7",
      }}
    >
      <CardHeader style={{ padding: "2px 8px" }}>
        <h4
          style={{
            margin: "10px 0px",
            fontWeight: "bold",
            fontSize: "17px",
            backgroundColor: "#99A6A7",
          }}
        >
          Alerts
        </h4>
      </CardHeader>
      <CardBody
        style={{
          height: "262px",
          overflowY: "auto",
          padding: "0",
          scrollbarWidth: "none",
          backgroundColor: "#99A6A7",
        }}
      >
        <ListGroup flush>
          {randomAlerts.slice(0, 9).map((alert) => (
            <ListGroupItem
              key={alert.id}
              style={{
                // backgroundColor: alertColors[alert.type],
                backgroundColor: "transparent",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 10px",
                borderRadius: "5px",
                marginBottom: "5px",
              }}
            >
              <div>
                <strong>{alert.name}:</strong> {alert.message}
              </div>
              <Button color="link" size="sm">
                <FaTimes color="black" />
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>
      </CardBody>
    </Card>
  );
}

export default Alerts;
