import { H4, Image, P } from "../../../AbstractElements";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
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
const UpdateCompanyForm = () => {
  const { company } = useSelector((state: any) => state.companies);
  // const [server, setServer] = useState(location.state || {});
  // const { server } = location?.state;
  // console.log("server", server);

  const [formData, setFormData]: any = useState({
    fullName: company?.fullName,
    phoneNo: company?.phoneNo,
    packageExpirationDate: company?.packageExpirationDate,
    address: company?.address,
    contactPersonName: company?.contactPersonName,
    ntn: company?.ntn,
    gstNo: company?.gstNo,
    contactPersonPhoneNo: company?.contactPersonPhoneNo,
    cnicNumber: company?.cnicNumber,
    timezone: company?.timezone,
    package: company?.package,
    city: company?.city,
    // serverCredentials: [...company?.serverCredentials],
    // permissions: [...company?.permissions],
    // allowedModules: [...company?.allowedModules],
    // googleAccount: {
    //   emailAddress: server.googleAccount.emailAddress,
    //   password: server.googleAccount.password,
    // },
    // firebaseAccount: {
    //   emailAddress: server.firebaseAccount.emailAddress,
    //   password: server.firebaseAccount.password,
    // },
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

  //   const updateServerSubmitted = async (e: any) => {
  //     e.preventDefault();
  //     setLoading(true);
  //     // console.log("updatedFormData", formData);

  //     try {
  //       await update(formData, {
  //         url: `server-management/update-server/${server._id}`,
  //       }).then((data: any) => {
  //         // console.log("update Server form updated");

  //         setLoading(false);

  //         if (data.success) {
  //           // console.log(data);
  //           setLoading(false);
  //           dispatch(setServersStart());
  //           getAll({ url: "server-management/get-all-servers" }).then(
  //             (data: any) => {
  //               // console.log("api call --- >", data);
  //               // if (data === undefined) {
  //               //   Swal.fire({
  //               //     text: "Failed to fetch due to connection refused",
  //               //     icon: "error",
  //               //     timer: 2000,
  //               //     showConfirmButton: false,
  //               //   });
  //               //   dispatch(setInActiveActiveServers("All"));
  //               //   dispatch(setServers([]));
  //               //   dispatch(setFilterServers([]));
  //               //   dispatch(setServersEnd());
  //               //   return;
  //               // }
  //               // ----------------------

  //               if (data !== undefined) {
  //                 dispatch(setNoDataFound(data.message));
  //                 if (
  //                   !data.success &&
  //                   data.message === "ERROR_INTERNET_DISCONNECTED"
  //                 ) {
  //                   setLoading(false);
  //                 }
  //                 if (!data.success) {
  //                   Swal.fire({
  //                     text: `${data.message}`,
  //                     icon: "error",
  //                     timer: 2000,
  //                     showConfirmButton: false,
  //                   });
  //                   setLoading(false);
  //                 }
  //                 if (data.success) {
  //                   // console.log("hhg");
  //                   dispatch(setServers(data.data.allServers));
  //                   dispatch(setFilterServers(data.data.allServers));
  //                   navigate(`${process.env.PUBLIC_URL}/setup/server_details`);
  //                 }
  //               }
  //               dispatch(setServersEnd());
  //             }
  //           );
  //         }
  //       });
  //       // Handle successful post creation (e.g., show a success message, redirect, etc.)
  //     } catch (error: any) {
  //       // Handle error (e.g., show an error message)
  //       // console.error("Error creating post:", error);

  //       setLoading(false);
  //     }
  //   };

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
                      <H4>Company Info</H4>
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
                        <P>
                          Company Name
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="text"
                          placeholder="Enter Company Name"
                          defaultValue={formData.fullName}
                          name="fullName"
                          onChange={(e) =>
                            updateFormData("fullName", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} sm={6}>
                        <P>
                          Phone No
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="text"
                          placeholder="Enter Phone Number"
                          defaultValue={formData.phoneNo}
                          name="phoneNo"
                          onChange={(e) =>
                            updateFormData("phoneNo", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} xs={6}>
                        <P>
                          Address
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="text"
                          placeholder="Enter address"
                          defaultValue={formData.address}
                          name="address"
                          onChange={(e) =>
                            updateFormData("address", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} xs={6}>
                        <P>
                          Contact Person Name
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="text"
                          placeholder="Enter Contact Person Name"
                          defaultValue={formData.contactPersonName}
                          name="contactPersonName"
                          onChange={(e) =>
                            updateFormData("contactPersonName", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} sm={6}>
                        <P>
                          NTN
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="text"
                          placeholder="Enter NTN"
                          defaultValue={formData.ntn}
                          name="ntn"
                          onChange={(e) =>
                            updateFormData("ntn", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} sm={6}>
                        <P>
                          Gst No
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="text"
                          placeholder="Enter Gst Number"
                          defaultValue={formData.gstno}
                          name="gstno"
                          onChange={(e) =>
                            updateFormData("gstno", e.target.value)
                          }
                        />
                      </Col>
                      <Col xl={4} xs={6}>
                        <P>
                          Contact Person Number
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="text"
                          placeholder="Enter Contact Person Number"
                          defaultValue={formData.contactPersonPhoneNo}
                          name="contactPersonPhoneNo"
                          onChange={(e) =>
                            updateFormData(
                              "contactPersonPhoneNo",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                      <Col xl={4} xs={6}>
                        <P>
                          CNIC Number
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="text"
                          placeholder="Enter CNIC Number"
                          defaultValue={formData.cnicNumber}
                          name="cnicNumber"
                          onChange={(e) =>
                            updateFormData("cnicNumber", e.target.value)
                          }
                        />
                      </Col>
                      </Row> 
                      {/* Row commented if below will uncomment */}
                      {/*
                      <Col xl={4} xs={12}>
                        <P>
                          SSH Port
                          <span className="txt-danger">*</span>
                        </P>
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
                        <P>
                          Server Specifications
                          <span className="txt-danger">*</span>
                        </P>
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

                    

                    <H4>Server Credentials</H4>

                    <Row
                      className="g-3"
                      style={{ marginBottom: "65px", marginTop: "20px" }}
                    >
                      <Col sm={6}>
                        <P>
                          Multi Cloud Web Login
                          <span className="txt-danger">*</span>
                        </P>
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
                        <P>
                          Login Password Software
                          <span className="txt-danger">*</span>
                        </P>

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

                    <H4>Google Account Credentials</H4>

                    <Row
                      className="g-3"
                      style={{ marginBottom: "65px", marginTop: "20px" }}
                    >
                      <Col sm={6}>
                        <P>
                          Email Address
                          <span className="txt-danger">*</span>
                        </P>
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
                        <P>
                          Password
                          <span className="txt-danger">*</span>
                        </P>

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

                    <H4>Firebase Account credentials</H4>

                    <Row
                      className="g-3"
                      style={{ marginBottom: "65px", marginTop: "20px" }}
                    >
                      <Col sm={6}>
                        <P>
                          Email Address
                          <span className="txt-danger">*</span>
                        </P>
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
                        <P>
                          Password
                          <span className="txt-danger">*</span>
                        </P>
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

                    <H4>API Keys</H4>

                    <Row
                      className="g-3"
                      style={{ marginBottom: "65px", marginTop: "20px" }}
                    >
                      <Col sm={6}>
                        <P>
                          Google Maps API Key
                          <span className="txt-danger">*</span>
                        </P>
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
                     </Row> */}
                   
                  </Form>
                  <Row>
                    <Col
                      xs={12}
                      className="text-end d-flex justify-content-end gap-2 align-center"
                    >
                      {/* <Button color="primary">Print</Button> */}
                      <Button
                        color="primary"
                        onClick={(e) => {
                          //   updateServerSubmitted(e);
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

export default UpdateCompanyForm;
