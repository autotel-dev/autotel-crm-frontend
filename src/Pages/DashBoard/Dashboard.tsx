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

const Dashboard = () => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var dashboard = userPermissions.find(
    (item: any) => item.title === "Dashboard"
  );
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
            <General />
            <Col xl="12" lg="12" md="12" sm="12">
              <Row>
                <AlertsOverview />
                <KilledVehicles />
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
