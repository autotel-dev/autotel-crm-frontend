import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import CommonHeader from "../../../../../Common/CommonHeader";
import { H1, H3, H4, H5, P } from "../../../../../AbstractElements";
import { useEffect, useState } from "react";
import { create, getAll, otpEnabled, patch } from "../../../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { setUserData } from "../../../../../ReaduxToolkit/Reducer/UserSlice";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";

const ServerCredentials = (notConnectedServers: any) => {
  // console.log("notConnectedServers", notConnectedServers);

  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var serverCredentialsPermissions = userPermissions.find(
    (item: any) => item.value === "SERVER_CREDENTIALS"
  );
  const { userData } = useSelector((state: any) => state.user);
  const [isEdit, setIsEdit] = useState(false);
  const [isEnabled, setIsEnabled] = useState(userData.isOtpEnabled);
  const [loading, setLoading] = useState(false);
  const [testConnectionLoading, setTestConnectionLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData]: any = useState({
    serverCredentials: userData.serverCredentials,
  });
  const [notConnectedServersID, setNotConnectedServersID]: any = useState(
    notConnectedServers.notConnectedServers
  );

  const handleServerCredentialChange = (index: any, field: any, value: any) => {
    const updatedCredentials = formData.serverCredentials.map(
      (credential: any, idx: any) => {
        if (idx === index) {
          // Create a new object with updated field
          return { ...credential, [field]: value };
        }
        return credential; // Return original object for other indices
      }
    );
    setFormData({ ...formData, serverCredentials: updatedCredentials });
  };


  const updateServerCredentials = async () => {
    const updatedCredentials = formData.serverCredentials.map(
      (credential: any) => ({
        emailAddress: credential.emailAddress,
        password: credential.password,
        hostUrl: credential.hostUrl,
        server: credential.server._id,
      })
    );
    setFormData({ ...formData, serverCredentials: updatedCredentials });

    // console.log("updatedServerCredentials", updatedCredentials);

    setLoading(true);
    try {
      await patch(formData, {
        url: "company/update-server-credentials",
      }).then((data: any) => {
        setLoading(false);
        setIsEdit(!isEdit);
        if (data.success) {
          // console.log(data);
          Swal.fire({
            title: `Congratulations`,
            text: `Server Credentials has been changed.Press OK to logout.`,
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "Logout",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              // User clicked "OK", recursively call showSwalAlerts with the next index
              localStorage.removeItem("token");
              navigate(
                `${process.env.PUBLIC_URL}/login/${localStorage.getItem(
                  "userId"
                )}`
              );
            }
          });
        } else {
          setLoading(false);
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
    <Col md={12}>
      <Card>
        <CardHeader className="pb-0">
          <H4>Server Credentials</H4>
        </CardHeader>
        <CardBody>
          <Row>
            <Form style={{ marginBottom: "20px" }}>
              {formData?.serverCredentials?.map((item: any, index: any) => {
                return (
                  <div
                    style={{
                      padding: "20px",
                      border: "1px solid black",
                      borderRadius: "10px",
                      margin: "20px 0px",
                    }}
                  >
                    <Row className="g-3">
                      <Col lg={12} sm={12}>
                        <CommonHeader
                          title={item?.server?.companyName}
                          headClass="pb-0"
                        />
                      </Col>
                      <Col sm={6}>
                        <P>
                          Email Address
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          value={item?.emailAddress}
                          name="emailAddress"
                          type="email"
                          placeholder="Enter Email Address"
                          disabled={isEdit ? false : true}
                          onChange={(e) =>
                            handleServerCredentialChange(
                              index,
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
                        <Input
                          value={item?.password}
                          name="password"
                          type="email"
                          placeholder="Enter Password"
                          disabled={isEdit ? false : true}
                          onChange={(e) =>
                            handleServerCredentialChange(
                              index,
                              "password",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                      <Col sm={6}>
                        <P>
                          Server Id
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="text"
                          placeholder="Enter Server"
                          value={item?.server?._id}
                          name="server"
                          disabled
                        />
                      </Col>
                      <Col sm={6}>
                        <P>
                          Host Url
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="text"
                          placeholder="Enter Host Url"
                          value={item.hostUrl}
                          name="hostUrl"
                          disabled
                        />
                      </Col>
                    </Row>
                    {notConnectedServersID?.includes(item?.server?._id) && (
                      <CardFooter
                        className="text-end"
                        style={{
                          margin: "0px -20px",
                        }}
                      >
                        {isEdit && (
                          <Button
                            color="primary"
                            type="submit"
                            disabled={loading}
                            onClick={async (e) => {
                              e.preventDefault();
                              const updatedCredentials = {
                                emailAddress: item?.emailAddress,
                                password: item?.password,
                                serverId: item.server._id,
                              };

                              // console.log("updatedServerCredentials", updatedCredentials);

                              setTestConnectionLoading(true);
                              try {
                                await create(updatedCredentials, {
                                  url: "company/server-credentials/test-connection",
                                }).then((data: any) => {
                                  if (data.success) {
                                    setTestConnectionLoading(false);
                                    console.log(data);
                                    if (data.statusCode == 200) {
                                      Swal.fire({
                                        title: `Congratulations`,
                                        text: `${data.message}`,
                                        icon: "success",
                                        confirmButtonText: "OK",
                                      });
                                      const notConnectedServers =
                                        notConnectedServersID.filter(
                                          (id: any) => id !== item.server._id
                                        );
                                      setNotConnectedServersID(
                                        notConnectedServers
                                      );
                                    }
                                  } else {
                                    Swal.fire({
                                      title: `Oops`,
                                      text: `${data.message}`,
                                      icon: "error",
                                      confirmButtonText: "OK",
                                    });
                                    setTestConnectionLoading(false);
                                  }
                                });
                                // Handle successful post creation (e.g., show a success message, redirect, etc.)
                              } catch (error: any) {
                                // console.log("error", error);

                                // Handle error (e.g., show an error message)
                                // console.error("Error creating post:", error);
                                setTestConnectionLoading(false);
                              }
                            }}
                          >
                            Test Connection
                            {/* {testConnectionLoading &&
                          notConnectedServersID?.includes(item?.server?._id)
                            ? "Loading"
                            : "Test Connection"} */}
                          </Button>
                        )}
                      </CardFooter>
                    )}
                  </div>
                );
              })}
            </Form>
            {serverCredentialsPermissions != undefined &&
              serverCredentialsPermissions?.edit ? (
              <CardFooter className="text-end">
                {isEdit && (
                  <Button
                    style={{ marginRight: "15px" }}
                    color="primary"
                    // type="submit"
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEdit(!isEdit);
                    }}
                  >
                    Cancel
                  </Button>
                )}

                {!isEdit && (
                  <Button
                    color="primary"
                    type="submit"
                    disabled={loading}
                    onClick={(e) => {
                      if (!isEdit) {
                        e.preventDefault();
                        setIsEdit(!isEdit);
                      }
                    }}
                  >
                    Edit
                  </Button>
                )}
                {isEdit && notConnectedServersID.length == 0 && (
                  <Button
                    color="primary"
                    type="submit"
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      updateServerCredentials();
                    }}
                  >
                    {loading ? "Loading..." : "Save"}
                  </Button>
                )}
              </CardFooter>
            ) : null}
            {/* <div
              className="form-footer"
              style={{ display: "flex", justifyContent: "end" }}
            >
              <Button
                color="primary"
                className="d-block"
                onClick={() => {
                  otpEnabledChange();
                }}
              >
                {loading ? "Loading..." : "Save"}
              </Button>
            </div> */}
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ServerCredentials;
