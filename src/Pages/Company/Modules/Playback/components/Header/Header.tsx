import React, { useState } from "react";
import { FaPencilAlt } from "react-icons/fa"; // Importing pencil icon

import { useSelector } from "react-redux";
import PlaybackModal from "../../../MonitoringLatest/components/SingleVehiceDetail/PlaybackModal/PlaybackModal";

const Header = () => {
  const { selectedSingleDevice, vehicleHistoryDateRange } = useSelector(
    (state: any) => state.monitoring
  );

  const carName = selectedSingleDevice?.vehicle?.registrationNo;

  const { userData } = useSelector((state: any) => state.user);

  // Date and time both shown in the user's timezone (was: +5 h added, then the
  // date read in UTC but the time in local time, so the date could be a day off).
  function formatDateWithOffset(dateString: any) {
    if (!dateString) return "Invalid date";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    const timeZone = userData?.timezone || undefined;
    try {
      const datePart = new Intl.DateTimeFormat("en-CA", {
        timeZone, year: "numeric", month: "2-digit", day: "2-digit",
      }).format(date);
      const timePart = new Intl.DateTimeFormat("en-US", {
        timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
      }).format(date).toLowerCase();
      return `${datePart}, ${timePart}`;
    } catch (e) {
      return date.toLocaleString();
    }
  }

  const startTime = vehicleHistoryDateRange
    ? formatDateWithOffset(vehicleHistoryDateRange.start)
    : "N/A";
  const endTime = vehicleHistoryDateRange
    ? formatDateWithOffset(vehicleHistoryDateRange.end)
    : "N/A";

  const [openModal, setOpenModal] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "#35bfbf",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "white",
        fontFamily: "Segoe UI, sans-serif",
        fontWeight: "500",
        fontSize: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>{carName}</div>
      <div style={{ fontSize: "14px", display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "30px", color: "#fff", minWidth: "200px" }}>
          <strong>Start : </strong> {startTime}
        </span>
        <span style={{ color: "#fff", minWidth: "200px" }}>
          <strong>End : </strong> {endTime}
        </span>
        <div style={{ marginLeft: "30px" }}>
          <FaPencilAlt
            style={{
              marginLeft: "8px",
              cursor: "pointer",
              fontSize: "16px",
              color: "#fff",
            }}
            title="Edit End Time"
            onClick={() => {
              setOpenModal(true);
            }}
          />
        </div>
        {openModal && (
          <PlaybackModal isVisible={openModal} setIsVisible={setOpenModal} />
        )}
      </div>
    </div>
  );
};

export default Header;
