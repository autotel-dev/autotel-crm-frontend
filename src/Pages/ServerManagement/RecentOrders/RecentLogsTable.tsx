import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import { H4 } from "../../../AbstractElements";
import { Href } from "../../../utils/Constant";
import { useSelector } from "react-redux";
import { formatUnderscoredString } from "../../../Api/globals";
import { useState } from "react";

const RecentLogsTable = () => {
  const { recentLogs } = useSelector((state: any) => state.serverManagement);
  const recentLogsHeader = [
    "ID",
    "IP Address",
    "Date & Time",
    "Activity",
    "Username",
    "Role",
  ];
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  function hexToRgb(hex: any) {
    // Remove the hash sign if present
    hex = hex?.replace(/^#/, "");
    // Parse the hex values to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  // Usage
  const hexColor = "#ff0000"; // Example hex color
  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor); // Convert hex to RGB
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");

  return (
    <div className="">
      <Table className="display order-wrapper" id="recent-order">
        <thead>
          <tr>
            {recentLogsHeader.map((data, index) => (
              <th key={index} style={{ width: data == "Activity" ? "15%" : "10%", fontWeight: "bold" }}>
                {data}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentLogs.map((data: any, index: any) => {
            if (index < 6) {
              return (
                <tr key={index}
                onMouseEnter={() => {
                  setIsHovered(true);
                  setIdd(index);
                }}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  backgroundColor:
                    isHovered && idd == index
                      ? userPersonalizationData == null
                        ? "#D6EEEE"
                        : `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`
                      : "transparent",
                  transition: "background-color 0.3s",
                }}>
                  <td style={{ width: "10%" }}>{data.systemLogID}</td>
                  <td style={{ width: "10%" }}>
                    <div className="d-flex">
                      <div className="flex-grow-1 ms-2">
                        <Link to={Href}>
                          <H4>{data.IP}</H4>
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td style={{ width: "10%" }}>
                    {new Date(data.createdAt)
                      .toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                      .toString()}
                  </td>
                  <td style={{ width: "15%" }} className={`txt-primary`}>
                    {formatUnderscoredString(data.activity)}
                  </td>
                  <td style={{ width: "10%" }}>
                    {data.user?.fullName == null ? "N/A" : data.user?.fullName}
                  </td>
                  <td style={{ width: "10%" }}>
                    {formatUnderscoredString(data.role)}
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default RecentLogsTable;
