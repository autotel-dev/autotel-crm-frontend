import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import Trips from "./components/Trips/Trips";
import Events from "./components/Events/Events";
import Datalog from "./components/Datalog/Datalog";
import Speed from "./components/Speed/Speed";

const PlaybackDetails = () => {
  const [activeTab, setActiveTab] = useState("Trips");
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    "Trips",
    "Events",
    "Datalog",
    "Speed",
    "Fuel",
    "Temperature",
    "Gallery",
  ];

  // Sample data (replace with actual API data or props)
  const tableData = [
    {
      id: 1,
      startTime: "2025-05-13 10:00 AM",
      startLocation: "New York",
      endTime: "2025-05-13 12:00 PM",
      endLocation: "Boston",
    },
    {
      id: 2,
      startTime: "2025-05-14 09:00 AM",
      startLocation: "Chicago",
      endTime: "2025-05-14 11:30 AM",
      endLocation: "Detroit",
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "white",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease-in-out",
        transform: isExpanded
          ? "translateY(0)"
          : "translateY(calc(100% - 40px))",
        borderTop: "1px solid #ddd",
        zIndex: 1000,
      }}
    >
      {/* Nav Bar with Toggle Arrow */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          padding: "10px 20px",
        }}
      >
        <div style={{ display: "flex" }}>
          {navItems.map((item) => (
            <div
              key={item}
              onClick={() => setActiveTab(item)}
              style={{
                padding: "0 15px",
                cursor: "pointer",
                borderBottom: activeTab === item ? "3px solid #35bfbf" : "none",
                fontWeight: activeTab === item ? "bold" : "bold",
                color: activeTab === item ? "#35bfbf" : "black",
                // transition: "all 0.2s",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Arrow Icon Toggle */}
        <div
          onClick={() => setIsExpanded((prev) => !prev)}
          style={{ cursor: "pointer", fontSize: "18px", color: "#35bfbf" }}
        >
          {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
        </div>
      </div>

      {/* Content Section (hidden if collapsed) */}
      <div
        style={{
          minHeight: isExpanded ? "30vh" : 0,
          maxHeight: isExpanded ? "30vh" : 0,
          maxWidth: "100%",
          overflowX: "scroll",
          overflowY: "hidden",
          msOverflowStyle: "none", // IE and Edge overflowY: "scroll",
          WebkitOverflowScrolling: "touch", // Smooth scrolling on mobile
          scrollbarWidth: "none", // Firefox
          transition: "min-height 0.3s ease-in-out",
        }}
        className="hide-scrollbar"
      >
        {/* <h3>{activeTab}</h3> */}
        {activeTab == "Trips" ? (
          <Trips />
        ) : activeTab == "Events" ? (
          <Events />
        ) : activeTab == "Datalog" ? (
          <Datalog />
        ) : activeTab == "Speed" ? (
          <Speed />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PlaybackDetails;
