import { Card, CardBody, CardHeader, Col } from "reactstrap";
import { RecentOrder } from "../../../utils/Constant";
import { H3, H4 } from "../../../AbstractElements";
import RecentLogsTable from "./RecentLogsTable";
import { Link } from "react-router-dom";
import { getAll } from "../../../Api";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setRecentLogs } from "../../../ReaduxToolkit/Reducer/ServerManagementSlice";

const RecentLogs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getAll({ url: "system-logs/get-all-system-logs" }).then((data: any) => {
      console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          console.log("hhg");
          dispatch(setRecentLogs(data.data));
        }
      }
    });
  }, []);
  return (
    <Card className="invoice-card">
      <CardHeader className="pb-0">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <H3>Recent logs</H3>
          <Link
            to={`${process.env.PUBLIC_URL}/setup/server_management/AllLogs`}
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
