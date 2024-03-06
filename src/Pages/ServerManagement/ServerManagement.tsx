import { Container, Row } from "reactstrap";
import {
  Dashboard,
  Default,
  ShoppingPlaceDashboard,
} from "../../utils/Constant";
import NewProduct from "./NewProduct/NewProduct";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import ServerHealthStatistics from "./ServerHealthStatistics/ServerHealthStatistics";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAll } from "../../Api";
import {
  setServerManagement,
  setServerManagementEnd,
  setServerManagementStart,
  setTime,
} from "../../ReaduxToolkit/Reducer/ServerManagementSlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import RecentLogs from "./RecentOrders/RecentLogs";

const ServerManagement = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setServerManagementStart());
    const startTime = new Date().getTime();
    getAll({ url: "server-management/get-server-health-statistics" }).then(
      (data: any) => {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const startTime = new Date().toISOString();
        console.log("startTime: ", startTime);
        dispatch(setTime(startTime.toString().slice(0, 10)));
        console.log("api call --- >", data);
        dispatch(setServerManagementEnd());
        if (data !== undefined) {
          dispatch(setNoDataFound(data.message));
          if (data.success) {
            console.log("hhg");
            dispatch(setServerManagement(data.data.serverHealthStatistics));
          }
        }
      }
    );
  }, []);
  return (
    <Container fluid className="dashboard_default">
      <Row className="widget-grid">
        <Breadcrumbs
          mainTitle="Server Management"
          parent="Server Management"
          title=""
        />
        {/* <TotalEarning /> */}

        <ServerHealthStatistics />
        <RecentLogs />
        {/* <NewProduct /> */}
      </Row>
    </Container>
  );
};

export default ServerManagement;
