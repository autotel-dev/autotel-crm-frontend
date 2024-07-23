import { Container, Row } from "reactstrap";
import {
  Dashboard,
  Default,
  ShoppingPlaceDashboard,
} from "../../../utils/Constant";
import NewProduct from "./NewProduct/NewProduct";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import ServerHealthStatistics from "./ServerHealthStatistics/ServerHealthStatistics";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsConnected,
  setServerManagement,
  setServerManagementEnd,
  setServerManagementStart,
  setTime,
  setRecentLogs
} from "../../../ReaduxToolkit/Reducer/ServerManagementSlice";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import RecentLogs from "./RecentOrders/RecentLogs";
import Swal from "sweetalert2";
import { getAll } from "../../../Utilities/api";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import { GET_ALL_SYSTEM_LOG, GET_SERVER_HEALTH_STATISTICS } from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

const ServerManagement = () => {
  const { isConnected, } = useSelector((state: any) => state.serverManagement);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  useEffect(() => {
    setLoading(true);
    dispatch(setServerManagementStart());
    const startTime = new Date().getTime();
    getAll({ url: GET_SERVER_HEALTH_STATISTICS }).then(
      (data: any) => {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const startTime = new Date().toISOString();
        // console.log("startTime: ", startTime);
        dispatch(setTime(startTime.toString().slice(0, 10)));
        // console.log("api call --- >", data);

        if (data !== undefined) {
          dispatch(setNoDataFound(data.message));
          if (!data.success && data.message === ERROR_MESSAGE) {
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
            
          }
        }
        dispatch(setServerManagementEnd());
      }
    );
  }, []);

  useEffect(() => {
    getAll({ url: GET_ALL_SYSTEM_LOG }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setRecentLogs(data.data));
          setLoading(false);
        }
      }
    });
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
                // display: "flex",
                // justifyContent: "center",
                // height: "80vh",
                // backgroundColor: "white",
                // alignItems: "center",
                // margin:"20px 0px",
              }}
            >
              <div
                style={{ textAlign: "center", paddingTop: "80px", }}
              >
                {/* <Loader /> */}
                <>
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingBottom: "35px",

                  }}>
                    <Skeleton height="140px" width="32%" borderRadius="10px" />
                    <Skeleton height="140px" width="32%" borderRadius="10px" marginLeft="20px" />
                    <Skeleton height="140px" width="32%" borderRadius="10px" marginLeft="20px" />
                  </div>
                  <Skeleton height="100px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                  <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                  <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                  <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                  <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                </>
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
