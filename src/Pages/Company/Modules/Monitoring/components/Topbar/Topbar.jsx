import React, { useState } from "react";
import { Card, Label } from "reactstrap";
import { useSelector } from "react-redux";
import { Divider } from "antd";
import { FaPlay } from "react-icons/fa";
import PlaybackModal from "../PlaybackModal/PlaybackModal";

const Topbar = () => {
  const { devices } = useSelector((state) => state.monitoring);

  // Ensure devices is an array
  const deviceArray = Array.isArray(devices) ? devices : [];

  const statusCounts = deviceArray?.reduce(
    (acc, item) => {
      const currentStatus = item?.currentStatus;
      if (currentStatus && acc.hasOwnProperty(currentStatus)) {
        acc[currentStatus] += 1;
      }
      acc.total += 1;
      return acc;
    },
    { STOP: 0, MOVING: 0, OFFLINE: 0, NODATA: 0, IDLE: 0, total: 0 }
  );

  const [openModal, setOpenModal] = useState(false);

  return (
    <Card
      style={{
        borderRadius: "4px",
        // backgroundColor: "#e5e5e5",
        // backgroundColor: "#99A6A7",
        backgroundColor: "#21262C",
        border: "1px solid black",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {/* Vehicle Stats */}
          <div>
            <ul
              style={{
                display: "flex",
                gap: "5px",
                alignItems: "center",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
            >
              <button style={{ background: "transparent", border: "none" }}>
                {vehicleStats("#848884", "gray", statusCounts.total, "Total")}
              </button>
              <div
                style={{
                  width: "1px",
                  height: "20px",
                  backgroundColor: "gray",
                  margin: "10px 0px",
                }}
              ></div>
              <button style={{ background: "transparent", border: "none" }}>
                {vehicleStats(
                  "transparent",
                  "orange",
                  statusCounts.IDLE,
                  "IDLE"
                )}
              </button>
              <div
                style={{
                  width: "1px",
                  height: "20px",
                  backgroundColor: "gray",
                  margin: "10px 0px",
                }}
              ></div>
              <button style={{ background: "transparent", border: "none" }}>
                {vehicleStats("#848884", "red", statusCounts.STOP, "STOP")}
              </button>
              <div
                style={{
                  width: "1px",
                  height: "20px",
                  backgroundColor: "gray",
                  margin: "10px 0px",
                }}
              ></div>
              <button style={{ background: "transparent", border: "none" }}>
                {vehicleStats(
                  "#848884",
                  "green",
                  statusCounts.MOVING,
                  "MOVING"
                )}
              </button>
              <div
                style={{
                  width: "1px",
                  height: "20px",
                  backgroundColor: "gray",
                  margin: "10px 0px",
                }}
              ></div>
              <button style={{ background: "transparent", border: "none" }}>
                {vehicleStats(
                  "#848884",
                  "blue",
                  statusCounts.OFFLINE,
                  "OFFLINE"
                )}
              </button>
              <div
                style={{
                  width: "1px",
                  height: "20px",
                  backgroundColor: "gray",
                  margin: "10px 0px",
                }}
              ></div>
              <button style={{ background: "transparent", border: "none" }}>
                {vehicleStats(
                  "#848884",
                  "crimson",
                  statusCounts.NODATA,
                  "NODATA"
                )}
              </button>
            </ul>
          </div>
        </div>
        <div>
          <FaPlay
            size={18}
            cursor="pointer"
            color="white"
            onClick={() => {
              setOpenModal(true);
            }}
          />
        </div>
      </div>
      {openModal && (
        <PlaybackModal isVisible={openModal} setIsVisible={setOpenModal} />
      )}
    </Card>
  );
};

export default Topbar;

function vehicleStats(bgColor, iconColor, totalCars, status) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0px 1px",
      }}
    >
      <div
        style={{
          gap: "5px",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          border: "0px 2px 0px 2px solid black",
        }}
      >
        <Label
          style={{
            color: iconColor,
            fontSize: "11px",
            fontWeight: "bold",
            margin: "0px 0px 0px",
          }}
        >
          {status}
        </Label>
        <div
          style={{
            width: "20px",
            fontSize: "11px",
            height: "15px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          <Label>{totalCars}</Label>
        </div>
      </div>
    </div>
  );
}
