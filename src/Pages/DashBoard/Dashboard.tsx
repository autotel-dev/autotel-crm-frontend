import { Col, Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
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

const Dashboard = () => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var dashboard = userPermissions.find(
    (item: any) => item.title === "Dashboard"
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Simulating data fetching with a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Simulate completion of data fetching after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, []);
  // // console.log("Dashboard", dashboard);
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
            {loading ? (
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
                  <div
                    style={{
                      marginBottom: "20px",
                    }}
                  >
                    <Skeleton width={350} height={200} />
                  </div>
                  <div>
                    <Skeleton width={350} height={210} />
                  </div>
                </div>
                <div
                  style={{
                    marginBottom: "20px",
                    marginRight: "20px",
                  }}
                >
                  <Skeleton width={700} height={440} />
                </div>
                <div
                  style={{
                    marginBottom: "20px",
                    marginRight: "20px",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "20px",
                    }}
                  >
                    <Skeleton width={350} height={200} />
                  </div>
                  <div>
                    <Skeleton width={350} height={210} />
                  </div>
                </div>
                {/* Example for an avatar */}
                {/* <Skeleton count={3} height={20} /> Example for text */}
              </div>
            ) : (
              <General />
            )}

            <Col xl="12" lg="12" md="12" sm="12">
              <Row>
                {loading ? (
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
                    <KilledVehicles />
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
