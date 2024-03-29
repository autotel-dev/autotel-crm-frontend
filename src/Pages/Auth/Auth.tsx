import { Col, Container, Row } from "reactstrap";
import CommonForm from "./Form";
import BcakgroundImage from "../../assets/Background Image.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IMAGE_BASE_URL, getAll } from "../../Api";
import Swal from "sweetalert2";
import { setUserPersonalizationData } from "../../ReaduxToolkit/Reducer/PersonalizationSlice";
import Loader from "../Loader/Loader";
const LoginForm = () => {
  const [loading, setLoading] = useState<any>(true);
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();


  useEffect(() => {
    const userId = localStorage.getItem("userId");
    // console.log(userId);

    getAll({
      url:
        userId === null && userId === undefined
          ? "super-admin/get-personalization"
          : `company/get-personalization/${userId}`,

      // url: "super-admin/get-personalization",
    })
      .then((parentData: any) => {
        // console.log("api call --- >", parentData);
        // console.log("undenid");
        if (parentData === undefined) {
          Swal.fire({
            text: "Failed to Fetch the personalization",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
          dispatch(setUserPersonalizationData(null));
        }

        if (parentData !== undefined) {
          if (parentData.success) {
            dispatch(setUserPersonalizationData(parentData.data));
            setLoading(false);
          }
          if (!parentData.success) {
            setLoading(false);
            dispatch(setUserPersonalizationData(null));
          }
        }
      })
      .catch((error) => {
        // console.log("error== >", error);
      });
  }, []);
  return (
    <Container fluid>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Loader />
          </div>
        </div>
      ) : (
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
                userPersonalizationData &&
                userPersonalizationData.backgroundColor
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
                  ? `${IMAGE_BASE_URL}/${userPersonalizationData.backgroundImage.url}`
                  : BcakgroundImage
              }
              alt=""
              width={360}
              height={320}
            />
          </Col>
          <Col xl={7} className="p-0">
            <CommonForm alignLogo="text-start" />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default LoginForm;
