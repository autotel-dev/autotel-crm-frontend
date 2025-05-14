import React from "react";

const Trips = () => {
  // Sample data (replace with actual API data or props)
  const tableData = [
    {
      id: 1,
      startTime: "2025-05-13 10:00 AM",
      startLocation: "New York",
      endTime: "2025-05-13 12:00 PM",
      endLocation: "Boston",
      running: "03:53",
      distance: "49.5",
      averageSPeed: "13",
      alerts: "0",
      driver: "No Driver Found",
      tripStatus: "Unclassified",
    },
    {
      id: 2,
      startTime: "2025-05-14 09:00 AM",
      startLocation: "Chicago",
      endTime: "2025-05-14 11:30 AM",
      endLocation: "Detroit",
      running: "03:53",
      distance: "49.5",
      averageSPeed: "13",
      alerts: "0",
      driver: "No Driver Found",
      tripStatus: "Unclassified",
    },
    {
      id: 3,
      startTime: "2025-05-13 10:00 AM",
      startLocation: "New York",
      endTime: "2025-05-13 12:00 PM",
      endLocation: "Boston",
      running: "03:53",
      distance: "49.5",
      averageSPeed: "13",
      alerts: "0",
      driver: "No Driver Found",
      tripStatus: "Unclassified",
    },
    {
      id: 4,
      startTime: "2025-05-14 09:00 AM",
      startLocation: "Chicago",
      endTime: "2025-05-14 11:30 AM",
      endLocation: "Detroit",
      running: "03:53",
      distance: "49.5",
      averageSPeed: "13",
      alerts: "0",
      driver: "No Driver Found",
      tripStatus: "Unclassified",
    },
    {
      id: 5,
      startTime: "2025-05-13 10:00 AM",
      startLocation: "New York",
      endTime: "2025-05-13 12:00 PM",
      endLocation: "Boston",
      running: "03:53",
      distance: "49.5",
      averageSPeed: "13",
      alerts: "0",
      driver: "No Driver Found",
      tripStatus: "Unclassified",
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
                width: "100px",
              }}
            >
              Start Time
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "145px",
              }}
            >
              Start Location
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "100px",
              }}
            >
              End Time
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "145px",
              }}
            >
              End Location
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "60px",
              }}
            >
              Running
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
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "90px",
              }}
            >
              Average Speed
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "80px",
              }}
            >
              Alerts
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "100px",
              }}
            >
              Driver
            </th>
            <th
              style={{
                padding: "3px 15px 5px 10px",
                borderBottom: "2px solid #dee2e6",
                textAlign: "start",
                width: "100px",
              }}
            >
              Trip Status
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
                  width: "100px",
                }}
              >
                {row.startTime}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "145px",
                }}
              >
                {row.startLocation}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "100px",
                }}
              >
                {row.endTime}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "145px",
                }}
              >
                {row.endLocation}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "60px",
                }}
              >
                {row.running}
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
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "90px",
                }}
              >
                {row.averageSPeed}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "80px",
                }}
              >
                {row.alerts}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "100px",
                }}
              >
                {row.driver}
              </td>
              <td
                style={{
                  padding: "3px 15px 5px 10px",
                  borderTop: "1px solid #dee2e6",
                  textAlign: "start",
                  width: "100px",
                }}
              >
                {row.tripStatus}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Trips;
