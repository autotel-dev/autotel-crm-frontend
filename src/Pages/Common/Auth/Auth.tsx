import { Col, Container, Row } from "reactstrap";
import CommonForm from "./Form";
import BcakgroundImage from "../../../assets/Background Image.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { IMAGE_BASE_URL, getAll } from "../../../Utilities/api";
import Loader from "../../Utilities/Loader/Loader";
import { setUserPersonalizationData } from "../../../ReaduxToolkit/Reducer/PersonalizationSlice";
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
        userId == null && userId == undefined
          ? "super-admin/get-personalization"
          : `company/get-personalization/${userId}`,

      // url: "super-admin/get-personalization",
    })
      .then((parentData: any) => {
        // console.log("api call --- >", parentData);
        // console.log("undenid");
        if (parentData == undefined) {
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

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typing) {
        setText((prevText) =>
          prevText.length < userPersonalizationData?.subHeaderText.length
            ? userPersonalizationData?.subHeaderText.slice(
              0,
              prevText.length + 1
            )
            : prevText
        );

        if (text === userPersonalizationData?.subHeaderText) {
          setTyping(false);
        }
      } else {
        // setText((prevText) =>
        //   prevText.length > 0 ? prevText.slice(0, prevText.length - 1) : ""
        // );

        // if (text === "") {
        //   setTyping(true);
        // }
        setText((prevText) => {
          const remainingChars = prevText.length > 3 ? prevText.slice(0, prevText.length - 1) : userPersonalizationData?.subHeaderText.slice(0, 3);
          return remainingChars;
        });

        if (text === userPersonalizationData?.subHeaderText.slice(0, 3)) {
          setTyping(true);
        }
      }
    }, 70);

    return () => clearInterval(interval);
  }, [typing, text, userPersonalizationData?.subHeaderText]);
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
        <Row
          style={{
            backgroundColor: `${userPersonalizationData !== null &&
              userPersonalizationData.loginPageBackgroundType == "SOLID" &&
              userPersonalizationData &&
              userPersonalizationData.backgroundColor
              }`,
            backgroundImage: `${userPersonalizationData !== null &&
              userPersonalizationData.loginPageBackgroundType == "GRADIENT" &&
              `linear-gradient(to ${JSON.parse(userPersonalizationData.gradient).direction
              }, ${JSON.parse(userPersonalizationData.gradient).color1
              }, ${JSON.parse(userPersonalizationData.gradient).color2
              })`
              }`,
          }}
        >
          <Col
            xl={5}
            className="b-center bg-size p-0"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: `${
              //   userPersonalizationData &&
              //   userPersonalizationData.backgroundColor
              // }`,
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
                    ? `${userPersonalizationData.loginPageTextColor1}`
                    : "black",
              }}
              className="lilita-one-regular"
            >
              {userPersonalizationData !== null
                ? userPersonalizationData.headerText
                : "Welcome To the Autotel"}
            </div>
            <div
              style={{
                width: "80%",
                // fontWeight: "bold",
                fontSize: "20px",
                textAlign: "center",
                marginBottom: "60px",
                color:
                  userPersonalizationData !== null
                    ? `${userPersonalizationData.loginPageTextColor2}`
                    : "black",
              }}
              className="pacifico-regular"
            >
              {userPersonalizationData !== null
                ? text
                : "The best tracking platform in the tracking industry"}
              {/* {userPersonalizationData !== null
                ? userPersonalizationData.subHeaderText
                : "The best tracking platform in the tracking industry"} */}
            </div>

            <img
              src={
                userPersonalizationData !== null && userPersonalizationData.loginPageLogo.url !== ""
                  ? `${IMAGE_BASE_URL}/${userPersonalizationData.loginPageLogo.url}`
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
