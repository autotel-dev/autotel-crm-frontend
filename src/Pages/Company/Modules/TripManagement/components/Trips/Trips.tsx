import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { Outlet } from "react-router-dom";

const Trips = () => {
  return (
    <div>
      <div
        style={{
          margin: "-10px 30px 0px 15px",
        }}
      >
        <Breadcrumbs
          mainTitle="Trips"
          parent="Trip Management"
          title="Trips"
        />
      </div>
      <Container fluid>
        <Row
          style={{
            width: "100%",
          }}
        >
          <Col sm={12}>
            <Card>
              <CardBody>
                <Outlet />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Trips;
