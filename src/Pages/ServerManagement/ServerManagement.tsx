import { Container, Row } from "reactstrap";
import {
  Dashboard,
  Default,
  ShoppingPlaceDashboard,
} from "../../utils/Constant";
import NewProduct from "./NewProduct/NewProduct";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import ServerHealthStatistics from "./ServerHealthStatistics/ServerHealthStatistics";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../Api";
import {
  setIsConnected,
  setServerManagement,
  setServerManagementEnd,
  setServerManagementStart,
  setTime,
} from "../../ReaduxToolkit/Reducer/ServerManagementSlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import RecentLogs from "./RecentOrders/RecentLogs";
import NoInternetConnection from "../NoInternetConnection/NoInternetConnection";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";

const ServerManagement = () => {
  const { isConnected } = useSelector((state: any) => state.serverManagement);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  useEffect(() => {
    setLoading(true);
    dispatch(setServerManagementStart());
    const startTime = new Date().getTime();
    getAll({ url: "server-management/get-server-health-statistics" }).then(
      (data: any) => {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const startTime = new Date().toISOString();
        // console.log("startTime: ", startTime);
        dispatch(setTime(startTime.toString().slice(0, 10)));
        // console.log("api call --- >", data);

        if (data !== undefined) {
          dispatch(setNoDataFound(data.message));
          if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
            dispatch(setIsConnected(true));
            setLoading(false);
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
          }
          if (data.success) {
            // console.log("hhg");
            dispatch(setServerManagement(data.data.serverHealthStatistics));
            setLoading(false);
          }
        }
        dispatch(setServerManagementEnd());
      }
    );
  }, []);
  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "80vh",
                backgroundColor: "white",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Loader />
              </div>
            </div>
          ) : (
            <div>
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
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ServerManagement;
