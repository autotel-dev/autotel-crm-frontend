import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdTaskAlt,
  MdNotificationsActive,
  MdAssessment,
} from "react-icons/md";
import { TbRoute } from "react-icons/tb";

interface SidebarProps {
  dashboard: boolean;
  setDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  trips: boolean;
  setTrips: React.Dispatch<React.SetStateAction<boolean>>;
  planning: boolean;
  setPlanning: React.Dispatch<React.SetStateAction<boolean>>;
  alerts: boolean;
  setAlerts: React.Dispatch<React.SetStateAction<boolean>>;
  reports: boolean;
  setReports: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  dashboard,
  setDashboard,
  trips,
  setTrips,
  planning,
  setPlanning,
  alerts,
  setAlerts,
  reports,
  setReports,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-detect active menu based on URL
  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/dashboard")) {
      setDashboard(true);
      setTrips(false);
      setPlanning(false);
      setAlerts(false);
      setReports(false);
    } else if (path.includes("/trips")) {
      setDashboard(false);
      setTrips(true);
      setPlanning(false);
      setAlerts(false);
      setReports(false);
    } else if (path.includes("/planning")) {
      setDashboard(false);
      setTrips(false);
      setPlanning(true);
      setAlerts(false);
      setReports(false);
    } else if (path.includes("/alerts")) {
      setDashboard(false);
      setTrips(false);
      setPlanning(false);
      setAlerts(true);
      setReports(false);
    } else if (path.includes("/reports")) {
      setDashboard(false);
      setTrips(false);
      setPlanning(false);
      setAlerts(false);
      setReports(true);
    }
  }, [location.pathname]);

  const handleNavigation = (menu: string) => {
    navigate(
      `${process.env.PUBLIC_URL}/company/modules/trip-management/${menu}`
    );
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <MdDashboard size={28} />,
      isActive: dashboard,
      onClick: () => handleNavigation("dashboard"),
    },
    {
      id: "trips",
      label: "Trips",
      icon: <TbRoute size={28} />,
      isActive: trips,
      onClick: () => handleNavigation("trips"),
    },
    {
      id: "planning",
      label: "Planning",
      icon: <MdTaskAlt size={28} />,
      isActive: planning,
      onClick: () => handleNavigation("planning"),
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: <MdNotificationsActive size={28} />,
      isActive: alerts,
      onClick: () => handleNavigation("alerts"),
    },
    {
      id: "reports",
      label: "Reports",
      icon: <MdAssessment size={28} />,
      isActive: reports,
      onClick: () => handleNavigation("reports"),
    },
  ];

  return (
    <div
      style={{
        // Floating panel beside the app's icon rail (redesign Phase 1).
        width: "90px",
        height: "calc(100vh - var(--at-chrome-h, 104px))",
        backgroundColor: "var(--at-rail)",
        borderRadius: "var(--at-radius, 20px)",
        border: "1px solid var(--at-line)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
        marginTop: 0,
        gap: "10px",
        position: "fixed",
        left: "96px",
        top: "88px",
        zIndex: 100,
        overflowY: "auto",
      }}
    >
      {menuItems.map((item) => (
        <div
          key={item.id}
          onClick={item.onClick}
          style={{
            width: "70px",
            height: "70px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            cursor: "pointer",
            borderRadius: "8px",
            backgroundColor: item.isActive ? "#35bfbf" : "transparent",
            color: item.isActive ? "#fff" : "#a8b3c1",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (!item.isActive) {
              e.currentTarget.style.backgroundColor = "rgba(53, 191, 191, 0.2)";
              e.currentTarget.style.color = "#35bfbf";
            }
          }}
          onMouseLeave={(e) => {
            if (!item.isActive) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#a8b3c1";
            }
          }}
        >
          {item.icon}
          <span
            style={{
              fontSize: "10px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
