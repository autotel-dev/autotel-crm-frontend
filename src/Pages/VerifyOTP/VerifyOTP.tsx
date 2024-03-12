import { Col, Container, Row } from "reactstrap";
import { Image } from "../../AbstractElements";
import { dynamicImage } from "../../Service";
import OTPForm from "./OTPForm";
import { useSelector } from "react-redux";
import BcakgroundImage from "../../assets/Background Image.png";

const VerifyOTP = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  return (
    <Container fluid>
      <Row>
        <Col
          xl={5}
          className="b-center bg-size p-0"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: `${
              userPersonalizationData && userPersonalizationData.backgroundColor
            }`,
          }}
        >
          {/* <Image
            className="bg-img-cover bg-center w-100 vh-100"
            src={dynamicImage("login/3.jpg")}
            alt="looginpage"
          /> */}

          <div
            style={{
              width: "80%",
              fontWeight: "bold",
              fontSize: "25px",
              textAlign: "center",
              color:
                userPersonalizationData !== null
                  ? `${userPersonalizationData.textColor}`
                  : "black",
            }}
          >
            {userPersonalizationData !== null
              ? userPersonalizationData.headerText
              : "Welcome To the Autotel"}
          </div>
          <div
            style={{
              width: "80%",
              fontWeight: "bold",
              fontSize: "20px",
              textAlign: "center",
              marginBottom: "60px",
              color:
                userPersonalizationData !== null
                  ? `${userPersonalizationData.textColor}`
                  : "black",
            }}
          >
            {userPersonalizationData !== null
              ? userPersonalizationData.subHeaderText
              : "The best tracking platform in the tracking industry"}
          </div>

          <img
            src={
              userPersonalizationData !== null
                ? `http://124.29.238.127:8080/${userPersonalizationData.backgroundImage.url}`
                : BcakgroundImage
            }
            alt=""
            width={360}
            height={320}
          />
        </Col>
        <Col xl={7} className="p-0">
          <OTPForm alignLogo="text-start" />
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyOTP;
