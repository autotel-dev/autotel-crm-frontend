import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import { H3 } from "../../../../../../../../AbstractElements";
import PurchaseTable from "./components/purchaseTable/PurchaseTable";
import PurchaseSummary from "./components/purchaseSummary/PurchaseSummary";

const Purchases = () => {
  return (
    <Row>
      <Col xxl="6" xl="6" md="12">
        <Card className="invoice-card">
          <CardHeader className="pb-0">
            <H3>Total Purchases</H3>
          </CardHeader>
          <CardBody className="transaction-card">
            <PurchaseTable />
          </CardBody>
        </Card>
      </Col>
      <Col xxl="6" xl="4" md="12">
        <Card>
          <CardHeader>
            <H3 className="m-0">Purchase Summary</H3>
          </CardHeader>
          <CardBody className="p-0">
            <PurchaseSummary />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Purchases;
