import React from "react";

const Events = () => {
  // Sample data (replace with actual API data or props)
  const tableData = [
    {
      id: 1,
      event: "Idle 1",
      time: "2025-05-13 12:00 PM",
      address:
        "5.54 km from مدینہ مسجد، Mangiani, Las Bela, Balochistan, Pakistan (NE)",
      driver: "No Driver Found",
    },
    {
      id: 2,
      event: "Idle 1",
      time: "2025-05-13 12:00 PM",
      address:
        "5.54 km from مدینہ مسجد، Mangiani, Las Bela, Balochistan, Pakistan (NE)",
      driver: "No Driver Found",
    },
    {
      id: 3,
      event: "Idle 1",
      time: "2025-05-13 12:00 PM",
      address:
        "5.54 km from مدینہ مسجد، Mangiani, Las Bela, Balochistan, Pakistan (NE)",
      driver: "No Driver Found",
    },
  ];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "start",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr
            style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0 }}
          >
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "135px",
              }}
            >
              Event
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "120px",
              }}
            >
              Time
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "300px",
              }}
            >
              Address
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "150px",
              }}
            >
              Driver
            </th>
          </tr>
        </thead>
        <tbody
          style={{
            fontSize: "11px",
            // overflowY: "scroll",
            // msOverflowStyle: "none", // IE and Edge overflowY: "scroll",
            // overflowX: "auto",
            // maxHeight: "100px",
            // WebkitOverflowScrolling: "touch", // Smooth scrolling on mobile
            // scrollbarWidth: "none", // Firefox
          }}
          //   className="hide-scrollbar"
        >
          {tableData.map((row) => (
            <tr key={row.id}>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "135px",
                }}
              >
                {row.event}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "120px",
                }}
              >
                {row.time}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "300px",
                }}
              >
                {row.address}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "150px",
                }}
              >
                {row.driver}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Events;
