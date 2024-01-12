import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { provinceList, setup } from "../../utils/Constant";
import ProvinceListNav from "./ProvinceListNav";
import ProvinceList from "./ProvinceList";

const Province = () => {
  return (
    <>
      <Breadcrumbs
        mainTitle={provinceList}
        parent={setup}
        title={provinceList}
      />
      <Container fluid>
        <Row className="project-card">
          <Col md={12} className="project-list">
            <ProvinceListNav />
          </Col>
          <Col sm={12}>
            <ProvinceList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Province;
