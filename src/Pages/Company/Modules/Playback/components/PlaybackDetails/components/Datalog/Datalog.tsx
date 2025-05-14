import React from "react";

const Datalog = () => {
  // Sample data (replace with actual API data or props)
  const tableData = [
    {
      id: 1,
      status: "Idle",
      time: "2025-05-13 12:00 PM",
      latitude: "25.1352511",
      longitude: "66.9197006",
      distance: "49.5",
      blocked: false,
      engineHours: "465498",
      ignition: false,
      speed: "13",
      address:
        "5.55 km from مدینہ مسجد، Mangiani, Las Bela, Balochistan, Pakistan (NE)",
      driver: "No Driver Found",
      batterVoltage: "100",
    },
    {
      id: 2,
      status: "Running",
      time: "2025-05-13 12:00 PM",
      latitude: "25.1352511",
      longitude: "66.9197006",
      distance: "49.5",
      blocked: false,
      engineHours: "465498",
      ignition: false,
      speed: "13",
      address:
        "5.55 km from مدینہ مسجد، Mangiani, Las Bela, Balochistan, Pakistan (NE)",
      driver: "No Driver Found",
      batterVoltage: "100",
    },
    {
      id: 3,
      status: "Running",
      time: "2025-05-13 12:00 PM",
      latitude: "25.1352511",
      longitude: "66.9197006",
      distance: "49.5",
      blocked: false,
      engineHours: "465498",
      ignition: false,
      speed: "13",
      address:
        "5.55 km from مدینہ مسجد، Mangiani, Las Bela, Balochistan, Pakistan (NE)",
      driver: "No Driver Found",
      batterVoltage: "100",
    },
    {
      id: 4,
      status: "Idle",
      time: "2025-05-13 12:00 PM",
      latitude: "25.1352511",
      longitude: "66.9197006",
      distance: "49.5",
      blocked: false,
      engineHours: "465498",
      ignition: false,
      speed: "13",
      address:
        "5.55 km from مدینہ مسجد، Mangiani, Las Bela, Balochistan, Pakistan (NE)",
      driver: "No Driver Found",
      batterVoltage: "100",
    },
    {
      id: 5,
      status: "Idle",
      time: "2025-05-13 12:00 PM",
      latitude: "25.1352511",
      longitude: "66.9197006",
      distance: "49.5",
      blocked: false,
      engineHours: "465498",
      ignition: false,
      speed: "13",
      address:
        "5.55 km from مدینہ مسجد، Mangiani, Las Bela, Balochistan, Pakistan (NE)",
      driver: "No Driver Found",
      batterVoltage: "100",
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
                width: "70px",
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "90px",
              }}
            >
              Time
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "80px",
              }}
            >
              Latitude
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "80px",
              }}
            >
              Longitude
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "60px",
              }}
            >
              Speed
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "60px",
              }}
            >
              Distance
            </th>
            {/* <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "60px",
              }}
            >
              Blocked
            </th> */}
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "70px",
              }}
            >
              Engine Hours
            </th>
            {/* <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "60px",
              }}
            >
              Ignition
            </th> */}
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "240px",
              }}
            >
              Address
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "80px",
              }}
            >
              Driver
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "80px",
              }}
            >
              Battery (V)
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
                  width: "70px",
                }}
              >
                {row.status}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "90px",
                }}
              >
                {row.time}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "80px",
                }}
              >
                {row.latitude}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "80px",
                }}
              >
                {row.longitude}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "60px",
                }}
              >
                {row.speed}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "60px",
                }}
              >
                {row.distance}
              </td>
              {/* <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "60px",
                }}
              >
                {row.blocked}
              </td> */}
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "70px",
                }}
              >
                {row.engineHours}
              </td>
              {/* <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "60px",
                }}
              >
                {row.ignition}
              </td> */}
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "240px",
                }}
              >
                {row.address}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "80px",
                }}
              >
                {row.driver}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "80px",
                }}
              >
                {row.batterVoltage}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Datalog;
