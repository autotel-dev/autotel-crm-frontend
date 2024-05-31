import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { P } from "../../../AbstractElements";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import TestEmailModal from "./modals/TestEmailModal";
import { create, getAll, patch, update } from "../../../Utilities/api";
import Swal from "sweetalert2";
import {
  setEmailGatewayData,
  setIsConnected,
} from "../../../ReaduxToolkit/Reducer/EmailGatewaySlice";
import Loader from "../../Utilities/Loader/Loader";

const EmailGateway = () => {
  const { emailGatewayData } = useSelector((state: any) => state.emailGateway);
  const dispatch = useDispatch();

  const [authentication, setAuthentication] = useState("Yes");

  const SMTPSecurityList: any = [
    { value: `NO`, label: `No` },
    { value: `SSL`, label: `SSL` },
    { value: `TLS`, label: `TLS` },
  ];

  const [loading, setLoading] = useState<any>(true);
  const [emailGatewayCreationloading, setEmailGatewayCreationloading] =
    useState<any>(false);

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(setEmailGatewayData(null));
    dispatch(setIsConnected(false));
  }, []);
  const [fromName, setFromName] = useState<string>();
  const [replyToEmailAddress, setNoReplyEmailAddress] = useState<string>(
    emailGatewayData !== null ? emailGatewayData.replyToEmailAddress : ""
  );
  const [smtpServerHost, setSmtpServerHost] = useState<string>(
    emailGatewayData !== null ? emailGatewayData.smtpServerHost : ""
  );
  const [smtpServerPort, setSmtpServerPort] = useState<string>(
    emailGatewayData !== null ? emailGatewayData.smtpServerPort : ""
  );
  const [smtpUsername, setSmtpUsername] = useState<string>(
    emailGatewayData !== null ? emailGatewayData.smtpUsername : ""
  );
  const [smtpPassword, setSmtpPassword] = useState<string>(
    emailGatewayData !== null ? emailGatewayData.smtpPassword : ""
  );
  // const [useServerSmtp, setUseServerSmtp] = useState<boolean>(
  //   emailGatewayData !== null ? emailGatewayData.useServerSmtp : true
  // );
  const [smtpSecurity, setSmtpSecurity] = useState<string>(
    emailGatewayData !== null ? emailGatewayData.smtpSecurity : "NO"
  );

  // const [signature, setSignature] = useState<string>(
  //   emailGatewayData !== null ? emailGatewayData.signature : ""
  // );
  const [isActive, setisActive] = useState<boolean>(
    emailGatewayData !== null ? emailGatewayData.isActive : false
  );

  useEffect(() => {
    setFromName(emailGatewayData !== null ? emailGatewayData.fromName : "");
    setNoReplyEmailAddress(
      emailGatewayData !== null ? emailGatewayData.replyToEmailAddress : ""
    );
    setSmtpServerHost(
      emailGatewayData !== null ? emailGatewayData.smtpServerHost : ""
    );
    setSmtpServerPort(
      emailGatewayData !== null ? emailGatewayData.smtpServerPort : ""
    );
    setSmtpSecurity(
      emailGatewayData !== null ? emailGatewayData.smtpSecurity : "NO"
    );
    setSmtpUsername(
      emailGatewayData !== null ? emailGatewayData.smtpUsername : ""
    );
    setSmtpPassword(
      emailGatewayData !== null ? emailGatewayData.smtpPassword : ""
    );
    // setUseServerSmtp(
    //   emailGatewayData !== null ? emailGatewayData.useServerSmtp : true
    // );
    // setSignature(emailGatewayData !== null ? emailGatewayData.signature : "");
    setisActive(emailGatewayData !== null ? emailGatewayData.isActive : false);
  }, [emailGatewayData]);
  useEffect(() => {
    getAll({
      url: "gateway/email-gateway/get-gateway",
    }).then((parentData: any) => {
      // console.log("api call --- >", parentData);

      if (parentData !== undefined) {
        if (
          !parentData.success &&
          parentData.message === "ERROR_INTERNET_DISCONNECTED"
        ) {
          dispatch(setIsConnected(true));
        }
        if (!parentData.success) {
          Swal.fire({
            text: `${parentData.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
          dispatch(setEmailGatewayData(null));
        }
        if (parentData.success) {
          dispatch(setEmailGatewayData(parentData.data.emailGateway));

          setLoading(false);
        }
      }
    });
  }, []);

  const createAndUpdateEmailGateway = (e: any) => {
    e.preventDefault();
    setEmailGatewayCreationloading(true);
    const emailGatewayFormData = {
      fromName: fromName,
      replyToEmailAddress: replyToEmailAddress,
      smtpServerHost: smtpServerHost,
      smtpServerPort: Number(smtpServerPort),
      smtpUsername: smtpUsername,
      smtpPassword: smtpPassword,
      // useServerSmtp: useServerSmtp,
      smtpSecurity: smtpSecurity,
      // useSmtpAuthentication: true,
      // signature: signature,
    };

    if (isEdit && emailGatewayData !== null) {
      update(emailGatewayFormData, {
        url: `gateway/email-gateway/update-gateway/${emailGatewayData._id}`,
      })
        .then((data: any) => {
          // console.log("api call --- >", data);
          if (data == undefined) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setEmailGatewayCreationloading(false);
            // setIsEdit(!isEdit);
          }
          if (data !== undefined) {
            if (
              !data.success &&
              data.message === "ERROR_INTERNET_DISCONNECTED"
            ) {
              setEmailGatewayCreationloading(false);
              setIsEdit(!isEdit);
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setEmailGatewayCreationloading(false);
              // setIsEdit(!isEdit);
            }
            if (data.success) {
              getAll({
                url: "gateway/email-gateway/get-gateway",
              }).then((parentData: any) => {
                // console.log("api call --- >", parentData);
                if (parentData == undefined) {
                  Swal.fire({
                    text: "Failed to Fetch",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  setEmailGatewayCreationloading(false);
                  setIsEdit(false);
                  dispatch(setEmailGatewayData(null));
                }

                if (parentData !== undefined) {
                  if (parentData.success) {
                    setIsEdit(false);
                    dispatch(setEmailGatewayData(parentData.data.emailGateway));
                    setEmailGatewayCreationloading(false);
                  }
                  if (!parentData.success) {
                    setIsEdit(false);
                    setEmailGatewayCreationloading(false);
                    dispatch(setEmailGatewayData(null));
                  }
                }
              });
            }
          }
        })
        .catch((err: any) => {
          // console.log("catch data", err);
          setLoading(false);
        });
    } else {
      create(emailGatewayFormData, {
        url: `gateway/email-gateway/create-gateway`,
      })
        .then((data: any) => {
          // console.log("api call --- >", data);
          if (data == undefined) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setEmailGatewayCreationloading(false);
            // setIsEdit(!isEdit);
          }
          if (data !== undefined) {
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setEmailGatewayCreationloading(false);
              //   setIsEdit(!isEdit);
            }
            if (data.success) {
              getAll({
                url: "gateway/email-gateway/get-gateway",
              }).then((parentData: any) => {
                // console.log("api call --- >", parentData);
                if (parentData == undefined) {
                  Swal.fire({
                    text: "Failed to Fetch",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  setEmailGatewayCreationloading(false);
                  dispatch(setEmailGatewayData(null));
                }

                if (parentData !== undefined) {
                  if (parentData.success) {
                    dispatch(setEmailGatewayData(parentData.data.emailGateway));
                    setEmailGatewayCreationloading(false);
                    // setIsEdit(!isEdit);
                  }
                  if (!parentData.success) {
                    setEmailGatewayCreationloading(false);
                    // dispatch(setEmailGatewayData(null));
                  }
                }
              });
            }
          }
        })
        .catch((err: any) => {
          // console.log("catch data", err);
          setEmailGatewayCreationloading(false);
        });
    }
  };

  return (
    <>
      <div>
        <Breadcrumbs
          title="Email Gateway"
          mainTitle="Email Gateway"
          parent="Setup"
        />
        <Container fluid>
          <Col md={12}>
            <Form onSubmit={createAndUpdateEmailGateway}>
              <Card>
                <CardBody>
                  {loading ? (
                    <div
                    // style={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   height: "80vh",
                    //   backgroundColor: "white",
                    //   alignItems: "center",
                    // }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          display: "flex",
                          height: "75vh",
                          // alignItems: "center",
                        }}
                      >
                        {/* <Loader /> */}

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "50%"
                          }}
                        >
                          <Skeleton
                            height="40px"
                            width="100%"
                            marginTop="10px"
                            marginBottom="20px"
                            borderRadius="10px"
                          // marginRight="20px"
                          />
                          <Skeleton
                            height="40px"
                            width="100%"
                            marginTop="10px"
                            marginBottom="20px"
                            borderRadius="10px"
                          // marginRight="20px"
                          />

                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "50%",
                            marginLeft: "20px"
                          }}
                        >
                          <Skeleton
                            height="40px"
                            width="100%"
                            marginTop="10px"
                            marginBottom="20px"
                            borderRadius="10px"
                          // marginRight="20px"
                          />
                          <Skeleton
                            height="40px"
                            width="100%"
                            marginTop="10px"
                            marginBottom="20px"
                            borderRadius="10px"
                          // marginRight="20px"
                          />
                          <Skeleton
                            height="40px"
                            width="100%"
                            marginTop="10px"
                            marginBottom="20px"
                            borderRadius="10px"
                          // marginRight="20px"
                          />
                          <Skeleton
                            height="40px"
                            width="100%"
                            marginTop="10px"
                            marginBottom="20px"
                            borderRadius="10px"
                          // marginRight="20px"
                          />
                          <Skeleton
                            height="40px"
                            width="100%"
                            marginTop="10px"
                            marginBottom="20px"
                            borderRadius="10px"
                          // marginRight="20px"
                          />
                          <Skeleton
                            height="40px"
                            width="100%"
                            marginTop="10px"
                            marginBottom="20px"
                            borderRadius="10px"
                          // marginRight="20px"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Row>
                      {emailGatewayData !== null && (
                        <Col md={12}>
                          <div
                            className="d-flex"
                            style={{ justifyContent: "end" }}
                          >
                            <div
                              className={`text-end flex-shrink-0 icon-state 
                            }`}
                            >
                              <Label className="switch mb-0">
                                <Input
                                  type="checkbox"
                                  defaultChecked={emailGatewayData.isActive}
                                  // value={
                                  //   emailGatewayData.isActive == true
                                  //     ? "on"
                                  //     : "off"
                                  // }
                                  onChange={async (e: any) => {
                                    //  --------------------------
                                    const changeStatus = {
                                      isActive: !isActive,
                                    };

                                    try {
                                      await patch(changeStatus, {
                                        url: `gateway/email-gateway/change-gateway-activation-status/${emailGatewayData._id}`,
                                      }).then((data: any) => {
                                        if (data.success) {
                                          // // console.log(data);

                                          getAll({
                                            url: "gateway/email-gateway/get-gateway",
                                          }).then((parentData: any) => {
                                            // console.log("api call --- >", parentData);

                                            if (parentData !== undefined) {
                                              if (
                                                !parentData.success &&
                                                parentData.message ===
                                                "ERROR_INTERNET_DISCONNECTED"
                                              ) {
                                                dispatch(setIsConnected(true));
                                              }
                                              if (!parentData.success) {
                                                Swal.fire({
                                                  text: `${parentData.message}`,
                                                  icon: "error",
                                                  timer: 2000,
                                                  showConfirmButton: false,
                                                });

                                                dispatch(
                                                  setEmailGatewayData(null)
                                                );
                                              }
                                              if (parentData.success) {
                                                dispatch(
                                                  setEmailGatewayData(
                                                    parentData.data.emailGateway
                                                  )
                                                );
                                              }
                                            }
                                          });
                                        }
                                      });
                                      // Handle successful post creation (e.g., show a success message, redirect, etc.)
                                    } catch (error) {
                                      // Handle error (e.g., show an error message)
                                      // // console.error("Error creating post:", error);
                                    }
                                  }}
                                />
                                <span
                                  className={`switch-state ${isActive ? "bg-primary" : "bg-secondary"
                                    }`}
                                />
                              </Label>
                            </div>
                          </div>
                        </Col>
                      )}
                      <Col md={6}>
                        <FormGroup>
                          <P>From Name</P>
                          <Input
                            type="text"
                            placeholder="Enter Name here"
                            defaultValue={fromName}
                            value={fromName}
                            disabled={
                              emailGatewayData !== null && !isEdit
                                ? true
                                : false
                            }
                            onChange={(e) => setFromName(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <P>SMTP Server Host</P>
                          <Input
                            type="text"
                            placeholder="Enter Server Host here"
                            defaultValue={smtpServerHost}
                            value={smtpServerHost}
                            disabled={
                              emailGatewayData !== null && !isEdit
                                ? true
                                : false
                            }
                            onChange={(e) => setSmtpServerHost(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      {/* <Col md={6}>
                        <FormGroup> */}
                      {/* <P>Use SMTP Server</P>
                          <Select
                            defaultValue={
                              emailGatewayData !== null
                                ? useServerSmtp == false
                                  ? "No"
                                  : "Yes"
                                : "Yes"
                            }
                            disabled={
                              emailGatewayData !== null && !isEdit
                                ? true
                                : false
                            }
                            value={
                              emailGatewayData !== null
                                ? useServerSmtp == false
                                  ? "No"
                                  : "Yes"
                                : "Yes"
                            }
                            showSearch
                            style={{ width: "100%", height: 36}}
                            placeholder="Select Role"
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                              (option?.label ?? "").includes(input)
                            }
                            filterSort={(optionA: any, optionB: any) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
                            }
                            onChange={(e, options) => {
                              console.log(typeof e);

                              setUseServerSmtp(e === "Yes"); // Convert string value to boolean
                            }}
                            options={SMTPServerList}
                          /> */}
                      {/* </FormGroup>
                      </Col> */}
                      <Col md={6}>
                        <FormGroup>
                          <P>Reply To Email Address</P>
                          <Input
                            type="text"
                            placeholder="Enter Email Address here"
                            defaultValue={replyToEmailAddress}
                            value={replyToEmailAddress}
                            disabled={
                              emailGatewayData !== null && !isEdit
                                ? true
                                : false
                            }
                            onChange={(e) =>
                              setNoReplyEmailAddress(e.target.value)
                            }
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <P>SMTP Server Port</P>
                          <Input
                            type="text"
                            placeholder="Enter Server Port here"
                            defaultValue={smtpServerPort}
                            value={smtpServerPort}
                            disabled={
                              emailGatewayData !== null && !isEdit
                                ? true
                                : false
                            }
                            onChange={(e) => setSmtpServerPort(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          {/* <P>Signature</P>
                          <Input
                            type="text"
                            placeholder="Enter Signature here"
                            defaultValue={signature}
                            value={signature}
                            disabled={
                              emailGatewayData !== null && !isEdit
                                ? true
                                : false
                            }
                            onChange={(e) => setSignature(e.target.value)}
                          /> */}
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <P>SMTP Security</P>
                          <Select
                            // defaultValue={
                            //   emailGatewayData !== null ? smtpSecurity : "No"
                            // }
                            value={
                              smtpSecurity
                            }
                            showSearch
                            style={{ width: "100%", height: 36 }}
                            placeholder="Select SMTP Security"
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                              (option?.label ?? "").includes(input)
                            }
                            filterSort={(optionA: any, optionB: any) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
                            }
                            disabled={
                              emailGatewayData !== null && !isEdit
                                ? true
                                : false
                            }
                            onChange={(e, options) => {
                              setSmtpSecurity(e);
                              console.log(e);

                            }}
                            options={SMTPSecurityList}
                          />
                        </FormGroup>
                      </Col>
                      {/* <Col md={6}>
                        <FormGroup></FormGroup>
                      </Col> */}
                      {/* <Col md={6}>
                        <FormGroup></FormGroup>
                      </Col> */}
                      <Col md={6}>
                        <FormGroup>
                          {/* <P>SMTP Authentication</P>
                          <Select
                            defaultValue={
                              emailGatewayData !== null
                                ? useSmtpAuthentication == false
                                  ? "No"
                                  : "Yes"
                                : "Yes"
                            }
                            value={
                              emailGatewayData !== null
                                ? useSmtpAuthentication == false
                                  ? "No"
                                  : "Yes"
                                : "Yes"
                            }
                            showSearch
                            style={{ width: "100%", height: 36 }}
                            placeholder="Select Role"
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                              (option?.label ?? "").includes(input)
                            }
                            filterSort={(optionA: any, optionB: any) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
                            }
                            onChange={(e, options) => {
                              setUseSmtpAuthentication(e === "Yes");
                            }}
                            options={SMTPAuthenticationList}
                          /> */}
                        </FormGroup>
                      </Col>
                      {/* <Col md={6}>
                        <FormGroup></FormGroup>
                      </Col> */}
                      {
                        <Col md={6}>
                          <FormGroup>
                            <P>SMTP Username</P>
                            <Input
                              type="text"
                              placeholder="Enter Username here"
                              defaultValue={smtpUsername}
                              value={smtpUsername}
                              // disabled={authentication == "No"}
                              disabled={
                                emailGatewayData !== null && !isEdit
                                  ? true
                                  : false
                              }
                              onChange={(e) => setSmtpUsername(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      }
                      <Col md={6}>
                        <FormGroup></FormGroup>
                      </Col>
                      {
                        <Col md={6}>
                          <FormGroup>
                            <P>SMTP Password</P>
                            <Input
                              type="text"
                              placeholder="Enter Password here"
                              defaultValue={smtpPassword}
                              value={smtpPassword}
                              // disabled={authentication == "No"}
                              disabled={
                                emailGatewayData !== null && !isEdit
                                  ? true
                                  : false
                              }
                              onChange={(e) => setSmtpPassword(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      }

                      <CardFooter
                        style={{
                          display: "flex",

                          justifyContent: "end",
                        }}
                      >
                        {/* <Button
                                                color="primary"
                                                type="submit"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsVisible(true);
                                                }}
                                                style={{
                                                    marginRight: "10px",
                                                }}
                                            >
                                                Test Email
                                            </Button> */}
                        {isEdit && (
                          <Button
                            color="primary"
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsEdit(!isEdit);
                            }}
                            style={{
                              marginRight: "10px",
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                        {emailGatewayData == null ||
                          (emailGatewayData !== null && isActive) ? (
                          <Button
                            color="primary"
                            type="submit"
                            disabled={emailGatewayCreationloading}
                            onClick={(e) => {
                              if (
                                isEdit === false &&
                                emailGatewayData !== null
                              ) {
                                e.preventDefault();
                                setIsEdit(true);
                              }
                            }}
                          >
                            {emailGatewayCreationloading
                              ? "Loading..."
                              : emailGatewayData == null
                                ? "Create"
                                : isEdit
                                  ? "Save"
                                  : "Edit"}
                          </Button>
                        ) : (
                          <></>
                        )}
                      </CardFooter>
                    </Row>
                  )}

                  {/* <TestEmailModal isVisible={isVisible} setIsVisible={setIsVisible} /> */}
                </CardBody>
              </Card>
            </Form>
          </Col>
        </Container>
      </div>
    </>
  );
};

export default EmailGateway;
