import { H4, Image, P } from "../../../AbstractElements";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  setCreateServer,
  setServersStart,
  setServers,
  setServersEnd,
  setFilterServers,
  setServerInfo,
  setServerCredentials,
  setGoogleAccountCreadentials,
  setFirebaseAccountCredentials,
  setApiKeys,
  setInActiveActiveServers,
} from "../../../ReaduxToolkit/Reducer/ServerDetailsSlice";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { create, getAll } from "../../../Api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const SuccessfullyFormSubmitted = ({
  callbackActive,
}: BusinessFormCommonProps) => {
  const {
    createServer,
    serverInfo,
    serverCredentials,
    googleAccountCreadentials,
    firebaseAccountCredentials,
    apiKeys,
  } = useSelector((state: any) => state.serverDetails);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [firebaseShowPassword, setFireaseShowPassword] = useState(false);
  const [googleShowPassword, setGoogleShowPassword] = useState(false);
  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const toggleFirebasePasswordVisibility = (e: any) => {
    e.preventDefault();
    setFireaseShowPassword(!firebaseShowPassword);
  };
  const toggleGooglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setGoogleShowPassword(!googleShowPassword);
  };

  const createServerSubmitted = async () => {
    // console.log("createServerRedux", createServer);

    try {
      await create(createServer, {
        url: "server-management/create-server",
      }).then((data: any) => {
        if (data !== undefined) {
          if (!data.success && data.message == "ERROR_INTERNET_DISCONNECTED") {
            setLoading(false);
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
          }

          if (data.success) {
            // console.log(data);
            setLoading(false);
            dispatch(setServersStart());
            getAll({ url: "server-management/get-all-servers" }).then(
              (data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  Swal.fire({
                    text: "Failed to fetch due to connection refused",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  dispatch(setInActiveActiveServers("All"));
                  dispatch(setServers([]));
                  dispatch(setFilterServers([]));
                  dispatch(setServersEnd());
                  return;
                }
                dispatch(setServerInfo({}));
                dispatch(setServerCredentials({}));
                dispatch(setGoogleAccountCreadentials({}));
                dispatch(setFirebaseAccountCredentials({}));
                dispatch(setApiKeys(""));
                dispatch(setCreateServer({}));
                // ----------------------
                dispatch(setServersEnd());
                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setServers(data.data.allServers));
                    dispatch(setFilterServers(data.data.allServers));
                    navigate(
                      `${process.env.PUBLIC_URL}/super-admin/setup/server_details`
                    );
                  }
                }
              }
            );
          }
        }
      });
      // Handle successful post creation (e.g., show a success message, redirect, etc.)
    } catch (error: any) {
      // Handle error (e.g., show an error message)
      // console.error("Error creating post:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // setFormData({
    //   ...formData,
    //   ...serverInfo,
    //   ...serverCredentials,
    //   googleMapApiKey: apiKeys,
    //   googleAccount: googleAccountCreadentials,
    //   firebaseAccount: firebaseAccountCredentials,
    // });
    dispatch(
      setCreateServer({
        ...createServer,
      })
    );
    // console.log("createServerRedux --- UseEffect -- >", createServer);
  }, [
    apiKeys,
    serverInfo,
    serverCredentials,
    googleAccountCreadentials,
    firebaseAccountCredentials,
    apiKeys,
    apiKeys,
  ]);

  return (
    <div className="form-completed">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <H4>Server Info</H4>
        <Row>
          <Col
            xs={9}
            className="text-end d-flex justify-content-end gap-2 align-center"
          >
            <Button color="primary" onClick={() => callbackActive(1)}>
              Edit
            </Button>
          </Col>
        </Row>
      </div>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <Col xl={4} sm={6}>
            <P>
              Company Name
              <span className="txt-danger">*</span>
            </P>
            <Input
              type="text"
              placeholder="Enter Company Name"
              defaultValue={serverInfo.companyName}
              disabled
              name="companyName"
            />
          </Col>
          <Col xl={4} sm={6}>
            <P>
              Service Provider
              <span className="txt-danger">*</span>
            </P>
            <Input
              type="text"
              placeholder="Enter Service Provider"
              defaultValue={serverInfo.serviceProvider}
              disabled
              name="serviceProvider"
            />
          </Col>
          <Col xl={4} xs={12}>
            <P>
              IP Address
              <span className="txt-danger">*</span>
            </P>
            <Input
              id="ipAddress"
              type="text"
              placeholder="IP Address"
              defaultValue={serverInfo.ipAddress}
              disabled
              name="ipAddress"
            />
          </Col>
          <Col xl={4} sm={6}>
            <P>
              Server URL
              <span className="txt-danger">*</span>
            </P>
            <Input
              type="text"
              placeholder="Enter Server URL"
              defaultValue={serverInfo.url}
              disabled
              name="url"
            />
          </Col>
          <Col xl={4} sm={6}>
            <P>
              Login User Software
              <span className="txt-danger">*</span>
            </P>
            <Input
              type="text"
              placeholder="Enter Login User Software"
              defaultValue={serverInfo.loginUserSoftware}
              disabled
              name="loginUserSoftware"
            />
          </Col>
          <Col xl={4} xs={12}>
            <P>
              Operating System
              <span className="txt-danger">*</span>
            </P>
            <Input
              id="operatingSystem"
              type="text"
              placeholder="Enter Operating System"
              defaultValue={serverInfo.operatingSystem}
              disabled
              name="operatingSystem"
            />
          </Col>
          <Col xl={4} xs={12}>
            <P>
              Login User Server
              <span className="txt-danger">*</span>
            </P>
            <Input
              id="loginUserServer"
              type="text"
              placeholder="Enter Login User Server"
              defaultValue={serverInfo.loginUserServer}
              disabled
              name="loginUserServer"
            />
          </Col>
          <Col xl={4} xs={12}>
            <P>
              SSH Port
              <span className="txt-danger">*</span>
            </P>
            <Input
              id="sshPort"
              type="text"
              placeholder="Enter SSH Port"
              defaultValue={serverInfo.sshPort}
              disabled
              name="sshPort"
            />
          </Col>
          <Col xl={4} xs={12}>
            <P>
              Server Specifications
              <span className="txt-danger">*</span>
            </P>
            <Input
              id="serverSpecifications"
              type="text"
              placeholder="Enter Server Specifications"
              defaultValue={serverInfo.serverSpecifications}
              disabled
              name="serverSpecifications"
            />
          </Col>
        </Row>
      </Form>
      {/*  */}

      <H4>Server Credentials</H4>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <Col sm={6}>
            <P>
              Multi Cloud Web Login
              <span className="txt-danger">*</span>
            </P>
            <Input
              defaultValue={serverCredentials.multiCloudWebLogin}
              disabled
              name="multiCloudWebLogin"
              type="email"
              placeholder="Enter Multi Cloud Web Login Email"
            />
          </Col>
          <Col sm={6}>
            <P>
              Login Password Software
              <span className="txt-danger">*</span>
            </P>

            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Login Password Software"
                defaultValue={serverCredentials.loginPasswordSoftware}
                disabled
                name="loginPasswordSoftware"
              />
              <Button
                color="white"
                // className="bg-transparent"
                onClick={togglePasswordVisibility}
                style={{
                  backgroundColor: "transparent",
                  width: "80px",
                  border: "1px solid #dee2e6",
                }}
              >
                <FontAwesomeIcon
                  // color="secondary"
                  style={{
                    color: "green",
                    fontSize: "20px",
                    marginRight: "20px",
                  }}
                  icon={showPassword ? faEye : faEyeSlash}
                />
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Form>

      <H4>Google Account Credentials</H4>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <Col sm={6}>
            <P>
              Email Address
              <span className="txt-danger">*</span>
            </P>
            <Input
              defaultValue={googleAccountCreadentials.emailAddress}
              disabled
              name="emailAddress"
              type="email"
              placeholder="Enter Enter Email Address"
            />
          </Col>
          <Col sm={6}>
            <P>
              Password
              <span className="txt-danger">*</span>
            </P>

            <InputGroup>
              <Input
                defaultValue={googleAccountCreadentials.password}
                disabled
                name="password"
                type={googleShowPassword ? "text" : "password"}
                placeholder="Enter Password"
              />
              <Button
                color="white"
                // className="bg-transparent"
                onClick={toggleGooglePasswordVisibility}
                style={{
                  backgroundColor: "transparent",
                  width: "80px",
                  border: "1px solid #dee2e6",
                }}
              >
                <FontAwesomeIcon
                  // color="secondary"
                  style={{
                    color: "green",
                    fontSize: "20px",
                    marginRight: "20px",
                  }}
                  icon={googleShowPassword ? faEye : faEyeSlash}
                />
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Form>

      <H4>Firebase Account credentials</H4>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <Col sm={6}>
            <P>
              Email Address
              <span className="txt-danger">*</span>
            </P>
            <Input
              defaultValue={firebaseAccountCredentials.emailAddress}
              disabled
              name="emailAddress"
              type="email"
              placeholder="Enter Enter Email Address"
            />
          </Col>
          <Col sm={6}>
            <P>
              Password
              <span className="txt-danger">*</span>
            </P>
            <InputGroup>
              <Input
                defaultValue={firebaseAccountCredentials.password}
                disabled
                name="password"
                type={firebaseShowPassword ? "text" : "password"}
                placeholder="Enter Password"
              />
              <Button
                color="white"
                // className="bg-transparent"
                onClick={toggleFirebasePasswordVisibility}
                style={{
                  backgroundColor: "transparent",
                  width: "80px",
                  border: "1px solid #dee2e6",
                }}
              >
                <FontAwesomeIcon
                  // color="secondary"
                  style={{
                    color: "green",
                    fontSize: "20px",
                    marginRight: "20px",
                  }}
                  icon={firebaseShowPassword ? faEye : faEyeSlash}
                />
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Form>

      <H4>API Keys</H4>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <Col sm={6}>
            <P>
              Google Maps API Key
              <span className="txt-danger">*</span>
            </P>
            <Input
              defaultValue={apiKeys}
              disabled
              name="googleMapApiKey"
              type="text"
              placeholder="Enter Google Maps API Key"
            />
          </Col>
        </Row>
      </Form>

      <Row>
        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button color="primary">Print</Button>
          <Button
            color="primary"
            onClick={() => {
              createServerSubmitted();
            }}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SuccessfullyFormSubmitted;
