import { Card, CardBody, CardHeader, Col } from "reactstrap";
import { H3 } from "../../../AbstractElements";
import NewProductBody from "./NewProductBody";

const NewProduct = () => {
  return (
    // <Col xl="3" md="6" className="box-col-3">
    <Col xl="6">
      <Card className="invoice-card">
        <CardHeader className="pb-0">
          <H3>Recent logs</H3>
        </CardHeader>
        <CardBody className="transaction-card">
          <NewProductBody />
        </CardBody>
      </Card>
    </Col>
  );
};

export default NewProduct;
