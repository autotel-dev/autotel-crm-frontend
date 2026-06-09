import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import DevicesList from "./DevicesList";

const DevicesSetup = () => {
  return (
    <div>
      <Breadcrumbs
        mainTitle="Devices List"
        parent={setup}
        title="Devices List"
      />
      <Container fluid>
        <Row className="project-card">
          <Col sm={12}>
            <DevicesList />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DevicesSetup;
