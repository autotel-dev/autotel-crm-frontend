import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";

const TripManagementLayout = () => {
  const [dashboard, setDashboard] = useState(false);
  const [trips, setTrips] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [alerts, setAlerts] = useState(false);
  const [reports, setReports] = useState(false);

  useEffect(() => {
    // Control body overflow when component mounts
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar - Fixed width */}
      <div style={{ width: "90px", flexShrink: 0 }}>
        <Sidebar
          dashboard={dashboard}
          setDashboard={setDashboard}
          trips={trips}
          setTrips={setTrips}
          planning={planning}
          setPlanning={setPlanning}
          alerts={alerts}
          setAlerts={setAlerts}
          reports={reports}
          setReports={setReports}
        />
      </div>

      {/* Main Content Area */}
      <div
        style={{
          marginTop: "1vh",
          height: "93vh",
          width: "100%",
          backgroundColor: "transparent",
          paddingTop: "20px",
          marginLeft: "0px",
          marginRight: "-15px",
          overflowX: "hidden",
          scrollbarWidth: "none",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default TripManagementLayout;
