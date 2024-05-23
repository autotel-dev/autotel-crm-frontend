import React, { useState } from "react";
import { useSelector } from "react-redux";

const DeviceDetailsBar: React.FC = () => {
  const { devicesDetailData } = useSelector((state: any) => state.monitoring);
//   console.log("devicesDetailData", devicesDetailData);
  //   const numbers: number[] = [1, 2, 3, 4, 5];
  const colors = [
    "rgba(0, 0, 0, 0.5)",
    // "rgba(0, 255, 0, 0.5)",
    // "rgba(0, 0, 255, 0.5)",
  ];
  const [showAll, setShowAll] = useState(false);

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

  return (
    <div
      style={{
        backgroundColor: "transparent",
        scrollbarWidth:"none",
        width: "280px",
        color: "black",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        overflowY: "auto",
        maxHeight: "85vh", // Adjust this value based on your layout requirements
      }}
    >
      {devicesDetailData
        .slice(0, showAll ? devicesDetailData.length : 5)
        .map((device: any, index: number) => (
          <div
            key={index}
            style={{
              backgroundColor: "#f9f9f9",
              width: "250px",
              height: "90px",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "4px",
              boxShadow: `0 2px 4px ${colors[index % colors.length]}`,
              textAlign: "center",
            }}
          >
            <div>ID : {device.id}</div>
            <div>Name : {device.name}</div>
            <div>IMEI : {device.imei}</div>
          </div>
        ))}
      {!showAll && devicesDetailData.length > 3 ? (
        <button
          onClick={handleShowMore}
          style={{
            display: "block",
            margin: "20px auto",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            left:"0px",
          }}
        >
          Show More
        </button>
      ) : (
        devicesDetailData.length > 3 && (
          <button
            onClick={handleShowLess}
            style={{
              display: "block",
              margin: "20px auto",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              left:"20px",
            }}
          >
            Show Less
          </button>
        )
      )}
    </div>
  );
};

export default DeviceDetailsBar;
