import { Container, Row } from "reactstrap";
import {
  Dashboard,
  Default,
  ShoppingPlaceDashboard,
} from "../../utils/Constant";
import TotalEarning from "./TotalEarning/TotalEarning";
import RecentOrders from "./RecentOrders/RecentOrders";
import NewProduct from "./NewProduct/NewProduct";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";

const ServerManagement = () => {
  return (
    <Container fluid className="dashboard_default">
      <Row className="widget-grid">
        <Breadcrumbs
          mainTitle={ShoppingPlaceDashboard}
          parent={Dashboard}
          title={Default}
        />
        <TotalEarning />
        <RecentOrders />
        <NewProduct />
      </Row>
    </Container>
  );
};

export default ServerManagement;
