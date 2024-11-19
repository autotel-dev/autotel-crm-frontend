import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import { H3 } from "../../../../../../../../AbstractElements";
import ProductsTable from "./components/productsTable/ProductsTable";
import ProductSummary from "./components/productSummary/ProductSummary";

const Inventory = () => {
  return (
    <Row>
      <Col xxl="7" xl="7" md="12">
        <Card className="invoice-card">
          <CardHeader className="pb-0">
            <H3>Products</H3>
          </CardHeader>
          <CardBody className="transaction-card">
            <ProductsTable />
          </CardBody>
        </Card>
      </Col>
      <Col xl="5" md="5" sm="12" className="box-col-4 order-xl-1">
        <Card className="product-chart">
          <CardHeader className="pb-0">
            <div className="header-top">
              <H3 className="m-0">Product Sales</H3>
            </div>
          </CardHeader>
          <CardBody className="pb-0">
            <div className="d-flex">
              <H3 className="me-2">$12,000</H3>
              {/* <span>(15,080 To Goal)</span> */}
            </div>
            <ProductSummary />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Inventory;
