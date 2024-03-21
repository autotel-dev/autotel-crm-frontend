import { H2, Image } from "../../../AbstractElements";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import ShowError from "../CreateServerForm/ShowError";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  InputGroup,
  Input,
  Label,
  Row,
  Container,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { create, getAll, update } from "../../../Api";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setServersStart,
  setServers,
  setServersEnd,
  setFilterServers,
  setInActiveActiveServers,
} from "../../../ReaduxToolkit/Reducer/ServerDetailsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface PropsTypes {
  location: any;
}
const UpdateServerForm = () => {
  const { server } = useSelector((state: any) => state.serverDetails);
  // const [server, setServer] = useState(location.state || {});
  // const { server } = location?.state;
  // console.log("server", server);

  const [formData, setFormData]: any = useState({
    companyName: server.companyName,
    serviceProvider: server.serviceProvider,
    ipAddress: server.ipAddress,
    multiCloudWebLogin: server.multiCloudWebLogin,
    loginUserSoftware: server.loginUserSoftware,
    loginPasswordSoftware: server.loginPasswordSoftware,
    operatingSystem: server.operatingSystem,
    loginUserServer: server.loginUserServer,
    sshPort: server.sshPort,
    serverSpecifications: server.serverSpecifications,
    googleAccount: {
      emailAddress: server.googleAccount.emailAddress,
      password: server.googleAccount.password,
    },
    firebaseAccount: {
      emailAddress: server.firebaseAccount.emailAddress,
      password: server.firebaseAccount.password,
    },
    googleMapApiKey: server.googleMapApiKey,
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Function to update the formData

  // Function to update nested values in formData
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

  const updateFormData = (field: any, value: any) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData, // Copy the existing state
      [field]: value, // Update the specific field
    }));

    // console.log("formData-->", formData);
  };
  const updateNestedValue = (parentField: any, childField: any, value: any) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [parentField]: {
        ...prevFormData[parentField],
        [childField]: value,
      },
    }));
    // console.log("formData-->", formData);
  };

  const updateServerSubmitted = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // console.log("updatedFormData", formData);

    try {
      await update(formData, {
        url: `server-management/update-server/${server._id}`,
      }).then((data: any) => {
        // console.log("update Server form updated");

        setLoading(false);

        if (data.success) {
          // console.log(data);
          setLoading(false);
          dispatch(setServersStart());
          getAll({ url: "server-management/get-all-servers" }).then(
            (data: any) => {
              // console.log("api call --- >", data);
              // if (data == undefined) {
              //   Swal.fire({
              //     text: "Failed to fetch due to connection refused",
              //     icon: "error",
              //     timer: 2000,
              //     showConfirmButton: false,
              //   });
              //   dispatch(setInActiveActiveServers("All"));
              //   dispatch(setServers([]));
              //   dispatch(setFilterServers([]));
              //   dispatch(setServersEnd());
              //   return;
              // }
              // ----------------------

              if (data !== undefined) {
                dispatch(setNoDataFound(data.message));
                if (
                  !data.success &&
                  data.message == "ERROR_INTERNET_DISCONNECTED"
                ) {
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
                  // console.log("hhg");
                  dispatch(setServers(data.data.allServers));
                  dispatch(setFilterServers(data.data.allServers));
                  navigate(`${process.env.PUBLIC_URL}/setup/server_details`);
                }
              }
              dispatch(setServersEnd());
            }
          );
        }
      });
      // Handle successful post creation (e.g., show a success message, redirect, etc.)
    } catch (error: any) {
      // Handle error (e.g., show an error message)
      // console.error("Error creating post:", error);

      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumbs
        mainTitle="Update Server Details"
        parent="Update Server Details"
        title=""
      />
      <Container fluid>
        <Row>
          <Col sm={12}>
            <Card>
              <CardBody>
                <div className="form-completed">
                  <Form>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "30px",
                      }}
                    >
                      <H2>Server Info</H2>
                      <Row>
                        <Col
                          xs={9}
                          className="text-end d-flex justify-content-end gap-2 align-center"
                        ></Col>
                      </Row>
                    </div>

                    <Row
                      className="g-3"
                      style={{ marginBottom: "65px", marginTop: "20px" }}
                    >
                      <Col xl={4} sm={6}>
                        <Label>
                          Company Name
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter Company Name"
                          defaultValue={formData.companyName}
                          name="companyName"
                          onChange={(e) =>
                            updateFormData("companyName", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} sm={6}>
                        <Label>
                          Service Provider
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter Service Provider"
                          defaultValue={formData.serviceProvider}
                          name="serviceProvider"
                          onChange={(e) =>
                            updateFormData("serviceProvider", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} xs={12}>
                        <Label>
                          IP Address
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          id="ipAddress"
                          type="text"
                          placeholder="IP Address"
                          defaultValue={formData.ipAddress}
                          name="ipAddress"
                          onChange={(e) =>
                            updateFormData("ipAddress", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} sm={6}>
                        <Label>
                          Server URL
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter Server URL"
                          defaultValue={server.url}
                          disabled
                          name="url"
                          onChange={(e) =>
                            updateFormData("url", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} sm={6}>
                        <Label>
                          Login User Software
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter Login User Software"
                          defaultValue={formData.loginUserSoftware}
                          name="loginUserSoftware"
                          onChange={(e) =>
                            updateFormData("loginUserSoftware", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} xs={12}>
                        <Label>
                          Operating System
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          id="operatingSystem"
                          type="text"
                          placeholder="Enter Operating System"
                          defaultValue={formData.operatingSystem}
                          name="operatingSystem"
                          onChange={(e) =>
                            updateFormData("operatingSystem", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} xs={12}>
                        <Label>
                          Login User Server
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          id="loginUserServer"
                          type="text"
                          placeholder="Enter Login User Server"
                          defaultValue={formData.loginUserServer}
                          name="loginUserServer"
                          onChange={(e) =>
                            updateFormData("loginUserServer", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} xs={12}>
                        <Label>
                          SSH Port
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          id="sshPort"
                          type="text"
                          placeholder="Enter SSH Port"
                          defaultValue={formData.sshPort}
                          name="sshPort"
                          onChange={(e) =>
                            updateFormData("sshPort", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} xs={12}>
                        <Label>
                          Server Specifications
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          id="serverSpecifications"
                          type="text"
                          placeholder="Enter Server Specifications"
                          defaultValue={formData.serverSpecifications}
                          name="serverSpecifications"
                          onChange={(e) =>
                            updateFormData(
                              "serverSpecifications",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                    </Row>

                    {/*  */}

                    <H2>Server Credentials</H2>

                    <Row
                      className="g-3"
                      style={{ marginBottom: "65px", marginTop: "20px" }}
                    >
                      <Col sm={6}>
                        <Label>
                          Multi Cloud Web Login
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          defaultValue={formData.multiCloudWebLogin}
                          name="multiCloudWebLogin"
                          type="email"
                          placeholder="Enter Multi Cloud Web Login Email"
                          onChange={(e) =>
                            updateFormData("multiCloudWebLogin", e.target.value)
                          }
                        />
                      </Col>
                      <Col sm={6}>
                        <Label>
                          Login Password Software
                          <span className="txt-danger">*</span>
                        </Label>

                        <InputGroup>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Login Password Software"
                            defaultValue={formData.loginPasswordSoftware}
                            name="loginPasswordSoftware"
                            onChange={(e) =>
                              updateFormData(
                                "loginPasswordSoftware",
                                e.target.value
                              )
                            }
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

                    <H2>Google Account Credentials</H2>

                    <Row
                      className="g-3"
                      style={{ marginBottom: "65px", marginTop: "20px" }}
                    >
                      <Col sm={6}>
                        <Label>
                          Email Address
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          defaultValue={formData.googleAccount.emailAddress}
                          name="emailAddress"
                          type="email"
                          placeholder="Enter Enter Email Address"
                          onChange={(e) =>
                            updateNestedValue(
                              "googleAccount",
                              "emailAddress",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                      <Col sm={6}>
                        <Label>
                          Password
                          <span className="txt-danger">*</span>
                        </Label>

                        <InputGroup>
                          <Input
                            defaultValue={formData.googleAccount.password}
                            name="password"
                            type={googleShowPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={(e) =>
                              updateNestedValue(
                                "googleAccount",
                                "password",
                                e.target.value
                              )
                            }
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

                    <H2>Firebase Account credentials</H2>

                    <Row
                      className="g-3"
                      style={{ marginBottom: "65px", marginTop: "20px" }}
                    >
                      <Col sm={6}>
                        <Label>
                          Email Address
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          defaultValue={formData.firebaseAccount.emailAddress}
                          name="emailAddress"
                          type="email"
                          placeholder="Enter Enter Email Address"
                          onChange={(e) =>
                            updateNestedValue(
                              "firebaseAccount",
                              "emailAddress",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                      <Col sm={6}>
                        <Label>
                          Password
                          <span className="txt-danger">*</span>
                        </Label>
                        <InputGroup>
                          <Input
                            defaultValue={formData.firebaseAccount.password}
                            name="password"
                            type={firebaseShowPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={(e) =>
                              updateNestedValue(
                                "firebaseAccount",
                                "password",
                                e.target.value
                              )
                            }
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

                    <H2>API Keys</H2>

                    <Row
                      className="g-3"
                      style={{ marginBottom: "65px", marginTop: "20px" }}
                    >
                      <Col sm={6}>
                        <Label>
                          Google Maps API Key
                          <span className="txt-danger">*</span>
                        </Label>
                        <Input
                          defaultValue={formData.googleMapApiKey}
                          name="googleMapApiKey"
                          type="text"
                          placeholder="Enter Google Maps API Key"
                          onChange={(e) =>
                            updateFormData("googleMapApiKey", e.target.value)
                          }
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
                        onClick={(e) => {
                          updateServerSubmitted(e);
                        }}
                      >
                        {loading ? "Loading..." : "Submit"}
                      </Button>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UpdateServerForm;
