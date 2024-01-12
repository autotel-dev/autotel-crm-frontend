import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { citiesList, citiesListHeading, setup } from "../../utils/Constant";
import CitiesListNav from "./CitiesListNav";
import CitiesList from "./CitiesList";

const Cities = () => {
  return (
    <>
      <Breadcrumbs mainTitle={citiesList} parent={setup} title={citiesList} />
      <Container fluid>
        <Row className="project-card">
          <Col md={12} className="project-list">
            <CitiesListNav />
          </Col>
          <Col sm={12}>
            <CitiesList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Cities;
