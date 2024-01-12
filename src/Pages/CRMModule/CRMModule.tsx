import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { crMmoduleList, setup } from "../../utils/Constant";
import CRMModuleList from "./CRMModuleList";
import CRMModuleListNav from "./CRMModuleListNav";

const CRMModule = () => {
  return (
    <>
      <Breadcrumbs
        mainTitle={crMmoduleList}
        parent={setup}
        title={crMmoduleList}
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
