import React from "react";

interface DatalogsProps {
  vehicleHistoryData: any[];
}

const Datalogs: React.FC<DatalogsProps> = ({ vehicleHistoryData }) => {
  // Map actual data from props
  const tableData =
    vehicleHistoryData?.map((item: any, index: number) => ({
      id: index + 1,
      status: item.motion ? "Moving" : "Stopped",
      time: new Date(item.timestamp).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      latitude: item.latitude?.toFixed(6),
      longitude: item.longitude?.toFixed(6),
      speed: Math.round(item.speed || 0),
      distance: item.distance || "0",
      blocked: false,
      engineHours: item.engineHours || "N/A",
      ignition: item.ignition,
      address: item.address || "N/A",
      driver: item.driverName || "N/A",
      batterVoltage: item.attributes?.battery || "N/A",
    })) || [];

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        maxHeight: "30vh",
        overflowY: "auto",
      }}
    >
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
          }}
        >
          {tableData.map((row: any) => (
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

export default Datalogs;
