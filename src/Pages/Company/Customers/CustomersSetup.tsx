import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import CustomersListNav from "./CustomersListNav";
import CustomersList from "./CustomersList";

const CustomersSetup = () => {
  return (
    <div>
      <Breadcrumbs
        mainTitle="Customers List"
        parent={setup}
        title="Customers List"
      />
      <Container fluid>
        <Row className="project-card">
          <Col md={12} className="project-list">
            <Card>
              <CustomersListNav />
            </Card>
          </Col>
          <Col sm={12}>
            <CustomersList />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CustomersSetup;
