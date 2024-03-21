import { Container, Row } from "reactstrap";
import {
  Dashboard,
  Default,
  ShoppingPlaceDashboard,
} from "../../../utils/Constant";
import TotalEarning from "../ShoppingPlace/TotalEarning/TotalEarning";
import RecentOrders from "../ShoppingPlace/RecentOrders/RecentOrders";
import TopSeller from "../ShoppingPlace/TopSeller/TopSeller";
import NewProduct from "../ShoppingPlace/NewProduct/NewProduct";
import TopCountries from "../ShoppingPlace/TopCountries/TopCountries";
import ActivityTimeline from "../ShoppingPlace/ActivityTimeline/ActivityTimeline";
import SalesSummary from "../ShoppingPlace/SalesSummary/SalesSummary";
import WeekendSale from "../ShoppingPlace/WeekendSale/WeekendSale";
import Invoice from "../ShoppingPlace/Invoice/Invoice";
import ProductSales from "../ShoppingPlace/ProductSales/ProductSales";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { useSelector } from "react-redux";

const ShoppingPlace = () => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var dashboard = userPermissions.find(
    (item: any) => item.title === "Dashboard"
  );
  // console.log("Dashboard", dashboard);
  return (
    <>
      <Breadcrumbs mainTitle="Dashboard" parent="Dashboard" title="Dashboard" />
      {dashboard !== undefined && dashboard?.read ? (
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
          <div>Welcome to the Autotel Private Limited</div>
        </div>
      )}
    </>
  );
};

export default ShoppingPlace;
