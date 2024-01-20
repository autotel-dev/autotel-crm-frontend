import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { provinceList, setup } from "../../utils/Constant";
import ServersListNav from "./ServersListNav";
import ServersList from "./ServersList";

const Servers = () => {
  return (
    <>
      <Breadcrumbs
        mainTitle="Servers List"
        parent={setup}
        title="Servers List"
      />
      <Container fluid>
        <Row className="project-card">
          <Col md={12} className="project-list">
            <ServersListNav />
          </Col>
          <Col sm={12}>
            <ServersList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Servers;
