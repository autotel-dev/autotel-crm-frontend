import { Table } from "reactstrap";
import { Button } from "reactstrap";
import { recentOrdersBody } from "../../../Data/Dashboard/ShoppingPlace/RecentOrders";
import { H4, Image } from "../../../AbstractElements";
import { dynamicImage } from "../../../Service";
import { Link } from "react-router-dom";
import { Href } from "../../../utils/Constant";
import { useSelector } from "react-redux";

const RecentLogsTable = () => {
  const { recentLogs } = useSelector((state: any) => state.serverManagement);
  const recentLogsHeader = [
    "Log ID",
    "IP Address",
    "Date & Time",
    "Activity",
    "Username",
    "Role",
  ];

  return (
    <div className="table-responsive theme-scrollbar recent-wrapper">
      <Table className="display order-wrapper" id="recent-order">
        <thead>
          <tr>
            {recentLogsHeader.map((data, index) => (
              <th key={index}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentLogs.map((data: any, index: any) => {
            if (index < 6) {
              return (
                <tr key={index}>
                  <td>{data._id}</td>
                  <td>
                    <div className="d-flex">
                      <div className="flex-grow-1 ms-2">
                        <Link to={Href}>
                          <H4>{data.IP}</H4>
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td>
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
                  <td className={`txt-primary`}>{data.activity}</td>
                  <td>{data.user.fullName}</td>
                  <td>{data.role}</td>
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
