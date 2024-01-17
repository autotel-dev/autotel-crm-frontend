import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../utils/Constant";
import CRMModuleListNav from "./CRMModuleListNav";
import CRMModuleList from "./CRMModuleList";

const CRMModule = () => {
  return (
    <>
      <Breadcrumbs
        mainTitle="CRM Module List"
        parent={setup}
        title="CRM Module List"
      />
      <Container fluid>
        <Row className="project-card">
          <Col md={12} className="project-list">
            <CRMModuleListNav />
          </Col>
          <Col sm={12}>
            <CRMModuleList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CRMModule;
