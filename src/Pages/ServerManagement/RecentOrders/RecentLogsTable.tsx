import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import { H4 } from "../../../AbstractElements";
import { Href } from "../../../utils/Constant";
import { useSelector } from "react-redux";
import { formatUnderscoredString } from "../../../Api/globals";

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
                <tr key={index}>
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
