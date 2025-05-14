import React, { useState } from "react";
import { FaPencilAlt } from "react-icons/fa"; // Importing pencil icon
import PlaybackModal from "../PlaybackModal/PlaybackModal";

const Header = () => {
  const carName = "AGS-234";
  const startTime = "11:47:01 AM 12-05-2025";
  const endTime = "12:30:55 PM 12-05-2025";

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
