import { Card, CardBody, CardHeader, Col } from "reactstrap";
import { RecentOrder } from "../../../../utils/Constant";
import { H3, H4 } from "../../../../AbstractElements";
import RecentLogsTable from "./RecentLogsTable";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setRecentLogs } from "../../../../ReaduxToolkit/Reducer/ServerManagementSlice";
import { getAll } from "../../../../Utilities/api";

const RecentLogs = () => {
  const dispatch = useDispatch();

  return (
    <Card className="invoice-card">
      <CardHeader className="pb-0">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <H4>Recent logs</H4>
          <Link
            to={`${process.env.PUBLIC_URL}/super-admin/setup/server_management/AllLogs`}
          >
            <h3 style={{ color: "#35bfbf", cursor: "pointer" }}>See All</h3>
          </Link>
        </div>
      </CardHeader>
      <CardBody className="transaction-card">
        <RecentLogsTable />
      </CardBody>
    </Card>
  );
};

export default RecentLogs;
