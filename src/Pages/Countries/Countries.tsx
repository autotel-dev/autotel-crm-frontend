import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../utils/Constant";
import CountriesListNav from "./CountriesListNav";
import CountriesList from "./CountriesList";

const Countries = () => {
  return (
    <>
      <Breadcrumbs
        mainTitle="Countries List"
        parent={setup}
        title="Countries List"
      />
      <Container fluid>
        <Row className="project-card">
          <Col md={12} className="project-list">
            <CountriesListNav />
          </Col>
          <Col sm={12}>
            <CountriesList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Countries;
