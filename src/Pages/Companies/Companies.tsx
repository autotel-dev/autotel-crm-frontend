import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { Href, UserCards, Users } from "../../utils/Constant";
import { H5, Image } from "../../AbstractElements";
import { dynamicImage } from "../../Service";
import SVG from "../../utils/CommonSvgIcon/SVG";
import { Link } from "react-router-dom";
import CompaniesCardsFooter from "./CompaniesCardsFooter";
import SocialMediaIcons from "./SocialMediaIcons";
import { compainesCardData } from "./Data/CompaniesCardData";
import CompaniesListNav from "./CompaniesListNav";

const Companies = () => {
  return (
    <>
      <Breadcrumbs title="" mainTitle="Companies" parent="Companies" />
      <Container fluid>
        <Col md={12} className="project-list">
          <CompaniesListNav />
        </Col>
        <Row className="user-cards-items user-card-wrapper">
          {compainesCardData.map((item) => (
            <Col
              xl={3}
              sm={6}
              xxl={3}
              className="col-ed-4 box-col-4"
              key={item.id}
            >
              <Card className="social-profile">
                <CardBody>
                  <div className="social-img-wrap">
                    <div className="social-img">
                      <Image
                        width={68}
                        height={68}
                        src={dynamicImage(item.avatar)}
                        className="img-fluid"
                        alt="user"
                      />
                    </div>
                    <div className="edit-icon">
                      <SVG iconId="profile-check" />
                    </div>
                  </div>
                  <div className="social-details">
                    <H5 className="mb-1">
                      <Link to="#">{item.name}</Link>
                    </H5>
                    <span className="f-light">{item.email}</span>
                    <SocialMediaIcons listClassName="card-social" />
                    <CompaniesCardsFooter item={item} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Companies;
