import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { packageList, setup } from "../../utils/Constant";
import PackageList from "./PackageList";
import PackageListNav from "./PackageListNav";

const Package = () => {
  return (
    <>
      <Breadcrumbs mainTitle={packageList} parent={setup} title={packageList} />
      <Container fluid>
        <Row className="project-card">
          <Col md={12} className="project-list">
            <PackageListNav />
          </Col>
          <Col sm={12}>
            <PackageList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Package;
