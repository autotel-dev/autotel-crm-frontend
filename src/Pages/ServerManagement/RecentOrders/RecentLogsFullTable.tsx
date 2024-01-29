import { Container, Row, Table } from "reactstrap";
import { Button } from "reactstrap";
import { recentOrdersBody } from "../../../Data/Dashboard/ShoppingPlace/RecentOrders";
import { H2, H3, H4, Image } from "../../../AbstractElements";
import { dynamicImage } from "../../../Service";
import { Link } from "react-router-dom";
import { Href } from "../../../utils/Constant";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import { useSelector } from "react-redux";

const RecentLogsFullTable = () => {
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
    <Container fluid>
      <Row className="project-card">
        <Card className="invoice-card">
          <CardHeader className="pb-0">
            <H2>Recent logs</H2>
          </CardHeader>
          <CardBody className="transaction-card">
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
                  })}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Row>
    </Container>
  );
};

export default RecentLogsFullTable;
