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

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var dashboard = userPermissions.find(
    (item: any) => item.title === "Dashboard"
  );

  const { devices } = useSelector((state: any) => state.monitoring);

  const [loading, setLoading] = useState<boolean>(true);

  const [alertsOverviewloading, setAlertsOverviewLoading] =
    useState<boolean>(true);

  // Simulating data fetching with a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Simulate completion of data fetching after 2 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, []);
  // // console.log("Dashboard", dashboard);

  useEffect(() => {
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

  const groups: any = [];
  const groupDevicesObj: any = {};
  const initialGroupDevices: any = [];

  const statuses: any = [];
  const statusDevicesObj: any = {};
  var initialGroupDevicesStatuses: any = [];

  const [groupdevices, setgroupdevices]: any = useState([]);
  const [groupdevicesStatuses, setgroupdevicesStatuses]: any = useState([]);

  useEffect(() => {
    if (devices.length === 0) {
      getAll({ url: "company/devices" }).then((data: any) => {
        if (data !== undefined) {
          if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
            dispatch(setIsConnected(true));
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }

          if (data.success) {
            // // console.log("api call --- >", data);
            // // console.log("length --- >", data.data.length);

            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i].title;
              if (!groups.includes(element)) {
                groups.push(element);
              }
            }

            groups.forEach((title: any) => {
              groupDevicesObj[title] = data.data
                .filter((obj: any) => obj.title === title)
                .map((item: any) => ({ ...item, checked: false }));
            });

            // Convert groupDevicesObj to initialGroupDevices array format
            Object.keys(groupDevicesObj).forEach((title: any) => {
              initialGroupDevices.push({
                title,
                checked: false,
                items: groupDevicesObj[title],
              });
            });

            // Update state with initialGroupDevices
            setgroupdevices(initialGroupDevices);
            // // console.log("groups", groups);
            // // console.log("groupDevices", groupdevices);
            dispatch(setDevices(initialGroupDevices));

            // ---------------------- For device status-----------------------------------

            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i].online;
              if (!statuses.includes(element)) {
                statuses.push(element);
                // setMyArray((prevArray) => [...prevArray, element]);
              }
            }
            statuses.forEach((online: any) => {
              statusDevicesObj[online] = data.data
                .filter((obj: any) => obj.online === online)
                .map((item: any) => ({ ...item, checked: false }));
            });

            // Convert groupDevicesObj to initialGroupDevices array format
            Object.keys(statusDevicesObj).forEach((online: any) => {
              initialGroupDevicesStatuses.push({
                online,
                items: statusDevicesObj[online],
              });
            });

            const expiredDevices = [];
            const notConnectedDevices = [];
            const currentDate = new Date(); // Get the current date and time

            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i];
              if (
                element.expiration_date != null &&
                element.expiration_date !== ""
              ) {
                const expirationDate = new Date(element.expiration_date); // Convert expiration date string to Date object
                if (expirationDate < currentDate) {
                  // Compare expiration date with current date
                  expiredDevices.push({ ...element, checked: false });
                }
              }
              if (i === data.data.length - 1) {
                // // console.log("expiredDevices", expiredDevices);
                initialGroupDevicesStatuses.push({
                  online: "Expired",
                  items: expiredDevices,
                });
              }
            }

            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i];
              if (
                element.time == null ||
                element.time === "" ||
                element.time == undefined
              ) {
                notConnectedDevices.push({ ...element, checked: false });
              }
              if (i === data.data.length - 1) {
                // // console.log("notConnectedDevices", notConnectedDevices);
                initialGroupDevicesStatuses.push({
                  online: "Not Connected",
                  items: notConnectedDevices,
                });
              }
            }

            // Update state with initialGroupDevicesStatuses
            setgroupdevicesStatuses(initialGroupDevicesStatuses);
            // // console.log("statuses", statuses);
            // // console.log("groupDevicesStatuses", initialGroupDevicesStatuses);
            dispatch(setDevicesStatuses(initialGroupDevicesStatuses));
          }
        }
      });
    }
  }, []);

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
