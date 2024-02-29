import { Col, Container, Row } from "reactstrap";
import CommonForm from "./Form";
import { Image } from "../../AbstractElements";
import { dynamicImage } from "../../Service";
import BcakgroundImage from "../../assets/Background Image.png";
const LoginForm = () => {
  return (
    <Container fluid>
      <Row>
        <Col
          xl={5}
          className="b-center bg-size p-0"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Image
            className="bg-img-cover bg-center w-100 vh-100"
            src={dynamicImage("login/3.jpg")}
            alt="looginpage"
          /> */}

          <img src={BcakgroundImage} alt="" width={450} height={400} />
        </Col>
        <Col xl={7} className="p-0">
          <CommonForm alignLogo="text-start" />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
