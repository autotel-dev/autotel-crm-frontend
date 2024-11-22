import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import { H3, H4 } from "../../../../../../../../AbstractElements";
import ProductsTable from "./components/productsTable/ProductsTable";
import LowInventory from "./components/lowInventory/LowInventory";
// import ProductSummary from "./components/productSummary/ProductSummary";

const Inventory = () => {
  return (
    <Row>
      <Col xxl="7" xl="7" lg="7" md="12">
        <Card className="invoice-card">
          <CardHeader className="pb-0">
            <H4>Products</H4>
          </CardHeader>
          <CardBody className="transaction-card">
            <ProductsTable />
          </CardBody>
        </Card>
      </Col>
      <Col xxl="5" xl="5" lg="5" md="12">
        <Card className="invoice-card">
          <CardHeader className="pb-0">
            <H4>Low Inventory</H4>
          </CardHeader>
          <CardBody className="transaction-card">
            <LowInventory />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Inventory;
