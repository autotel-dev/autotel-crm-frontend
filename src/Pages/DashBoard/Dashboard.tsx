import { Col, Container, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserRole } from "../../Api/globals";
import { ROLES } from "../../constants/roles";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import General from "./General/General";
import AlertsOverview from "./Control Room/AlertsOverview";
import TotalEarning from "./ShoppingPlace/TotalEarning/TotalEarning";
import RecentOrders from "./ShoppingPlace/RecentOrders/RecentOrders";
import TopSeller from "./ShoppingPlace/TopSeller/TopSeller";
import NewProduct from "./ShoppingPlace/NewProduct/NewProduct";
import TopCountries from "./ShoppingPlace/TopCountries/TopCountries";
import ActivityTimeline from "./ShoppingPlace/ActivityTimeline/ActivityTimeline";
import SalesSummary from "./ShoppingPlace/SalesSummary/SalesSummary";
import WeekendSale from "./ShoppingPlace/WeekendSale/WeekendSale";
import Invoice from "./ShoppingPlace/Invoice/Invoice";
import ProductSales from "./ShoppingPlace/ProductSales/ProductSales";
import KilledVehicles from "./Control Room/KilledVehicles";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getAll } from "../../Api";
import {
  setAssignedAlerts,
  setIsConnected,
  setKilledDevices,
  setLiveAlerts,
  setLiveAlertsData,
} from "../../ReaduxToolkit/Reducer/AlertsSlice";
import Swal from "sweetalert2";
import AlertsPending from "./Control Room/AlertsPending";
import {
  setAlertsOverview,
  setAlertsPending,
  setGeneralData,
  setOperatorPerformance,
} from "../../ReaduxToolkit/Reducer/DashboardSlice";
import {
  setDevices,
  setDevicesStatuses,
} from "../../ReaduxToolkit/Reducer/MonitoringSlice";
import { useNavigate } from "react-router-dom";
import { setErrorData } from "../../ReaduxToolkit/Reducer/UserSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loginData } = useSelector((state: any) => state.user);
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var dashboard = userPermissions.find(
    (item: any) => item.title === "Dashboard"
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [alertsOverviewloading, setAlertsOverviewLoading] =
    useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const showSwalAlerts = (errors: any, index: any) => {
      // Base case: If index is equal to the length of errors array, stop recursion
      if (index === errors.length) return;

      const server = errors[index].server;
      const serverError = errors[index].serverError;

      Swal.fire({
        title: `${server.companyName}`,
        text: `${serverError.message}`,
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Update Credentials", // Add "Update Credentials" button
      }).then((result) => {
        if (result.isConfirmed) {
          // User clicked "OK", recursively call showSwalAlerts with the next index
          showSwalAlerts(errors, index + 1);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // User clicked "Update Credentials", handle update logic here
          // You can add your update logic here or call a separate function
          dispatch(setErrorData(true));
          navigate(`${process.env.PUBLIC_URL}/users/account`);

          // console.log("Update Credentials clicked");
        }
      });
    };

    const timer = setTimeout(() => {
      const serverErrors = loginData?.data?.serverErrors;
      // If there are server errors, start showing alerts
      if (serverErrors && serverErrors.length !== 0) {
        showSwalAlerts(serverErrors, 0); // Start from index 0
      }
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, [loginData]);

  // Simulating data fetching with a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Simulate completion of data fetching after 2 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, []);
  // // console.log("Dashboard", dashboard);

  useEffect(() => {
    dispatch(setLiveAlerts([]));
    dispatch(setLiveAlertsData(null));

    getAll({ url: "company/alert-events?pageNo=1" }).then((data: any) => {
      if (data == undefined) {
        dispatch(setLiveAlerts([]));
        dispatch(setLiveAlertsData(null));
      }
      if (data !== undefined) {
        if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
          dispatch(setIsConnected(true));
        }
        if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          // // console.log("length --- >", data.data.allAlertEvents.length);

          dispatch(setLiveAlerts(data.data.allAlertEvents));
          dispatch(setLiveAlertsData(data.data));
        }
        if (!data.success) {
          // // console.log("length --- >", data.data.allAlertEvents.length);
          dispatch(setLiveAlerts([]));
          dispatch(setLiveAlertsData([]));
        }
      }
    });

    if (getUserRole() == ROLES.COMPANY) {
      getAll({ url: "company/dashboard/alerts-overview" }).then((data: any) => {
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
            dispatch(setIsConnected(true));
          }
          if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }
          if (data.success) {
            // // console.log("length --- >", data.data);
            dispatch(setAlertsOverview(data.data.alertsOverview));
            dispatch(setAlertsPending(data.data.allPendingAlerts));
            setAlertsOverviewLoading(false);
          }
          if (!data.success) {
            // // // console.log("length --- >", data.data);
            dispatch(setAlertsOverview(null));
            dispatch(setAlertsPending([]));
            setAlertsOverviewLoading(false);
          }
        }
      });

      getAll({ url: "control-room/get-all-killed-devices?type=all" }).then(
        (data: any) => {
          // // console.log("api call --- >", data);

          if (data !== undefined) {
            if (data.success) {
              // // console.log("length --- >", data.data);
              dispatch(setKilledDevices(data.data));
            }
            if (!data.success) {
              // // // console.log("length --- >", data.data);
              dispatch(setKilledDevices([]));
            }
          }
        }
      );
    }
  }, []);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const startDate = yesterday.toISOString();
  const endDate = new Date().toISOString();
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);

  // ----------------------------------

  return (
    <>
      <Breadcrumbs mainTitle="Dashboard" parent="Dashboard" title="Dashboard" />
      {getUserRole() === ROLES.SUPER_ADMIN ? (
        <Container fluid className="dashboard_default">
          <Row className="widget-grid">
            <TotalEarning />
            <RecentOrders />
            <TopSeller />
            <NewProduct />
            <TopCountries />
            <ActivityTimeline />
            <SalesSummary />
            <WeekendSale />
            <Invoice />
            <ProductSales />
          </Row>
        </Container>
      ) : dashboard !== undefined &&
        dashboard?.read &&
        getUserRole() === ROLES.COMPANY ? (
        <Container fluid className="crm_dashboard">
          <Row className="widget-grid">
            {/* Skeleton loading effect */}
            <General />

            <Col xl="12" lg="12" md="12" sm="12">
              <Row>
                {loading && alertsOverviewloading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "20px",
                        marginRight: "20px",
                      }}
                    >
                      <Skeleton width={700} height={450} />
                    </div>
                    <div
                      style={{
                        marginBottom: "20px",
                        marginRight: "20px",
                      }}
                    >
                      <Skeleton width={700} height={440} />
                    </div>
                  </div>
                ) : (
                  <>
                    <AlertsOverview />
                    <AlertsPending />
                    <KilledVehicles fromDate={fromDate} toDate={toDate} />
                  </>
                )}
              </Row>
            </Col>
          </Row>
        </Container>
      ) : (
        <div
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "85vh",
          }}
        >
          {/* <div>Welcome to the Autotel Private Limited</div> */}
          <div>Something better is Coming</div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
