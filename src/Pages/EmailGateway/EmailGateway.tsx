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
  Row,
} from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { P } from "../../AbstractElements";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TestEmailModal from "./modals/TestEmailModal";
import { create, getAll, update } from "../../Api";
import Swal from "sweetalert2";
import {
  setEmailGatewayData,
  setIsConnected,
} from "../../ReaduxToolkit/Reducer/EmailGatewaySlice";
import Loader from "../Loader/Loader";

const EmailGateway = () => {
  const { emailGatewayData } = useSelector((state: any) => state.emailGateway);
  const dispatch = useDispatch();

  const [authentication, setAuthentication] = useState("Yes");
  const SMTPServerList: any = [
    { value: "Yes", label: `Yes` },
    { value: "No", label: `No` },
  ];

  const SMTPAuthenticationList: any = [
    { value: "Yes", label: `Yes` },
    { value: "No", label: `No` },
  ];

  const SMTPSecurityList: any = [
    { value: `No`, label: `No` },
    { value: `SSL`, label: `SSL` },
    { value: `TLS`, label: `TLS` },
  ];

  const [isVisible, setIsVisible] = useState(false);

  const [loading, setLoading] = useState<any>(true);
  const [emailGatewayCreationloading, setEmailGatewayCreationloading] =
    useState<any>(false);
  const [undefinedData, setUndefinedData] = useState<any>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [fromName, setFromName] = useState<string>(
    emailGatewayData !== null ? emailGatewayData.fromName : ""
  );
  const [noReplyEmailAddress, setNoReplyEmailAddress] = useState<string>(
    emailGatewayData !== null ? emailGatewayData.noReplyEmailAddress : ""
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
  const [useServerSmtp, setUseServerSmtp] = useState<boolean>(
    emailGatewayData !== null ? emailGatewayData.useServerSmtp : true
  );
  const [smtpSecurity, setSmtpSecurity] = useState<string>(
    emailGatewayData !== null ? emailGatewayData.smtpSecurity : ""
  );
  const [useSmtpAuthentication, setUseSmtpAuthentication] = useState<boolean>(
    emailGatewayData !== null ? emailGatewayData.useSmtpAuthentication : true
  );
  const [signature, setSignature] = useState<string>(
    emailGatewayData !== null ? emailGatewayData.signature : ""
  );

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  useEffect(() => {
    getAll({
      url: "gateway/email-gateway/get-gateway",
    }).then((parentData: any) => {
      console.log("api call --- >", parentData);

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
          setUndefinedData(false);
          dispatch(setEmailGatewayData(null));
        }
        if (parentData.success) {
          dispatch(setEmailGatewayData(parentData.data.emailGateway));
          setUndefinedData(false);
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
      noReplyEmailAddress: noReplyEmailAddress,
      smtpServerHost: smtpServerHost,
      smtpServerPort: Number(smtpServerPort),
      smtpUsername: smtpUsername,
      smtpPassword: smtpPassword,
      useServerSmtp: useServerSmtp,
      smtpSecurity: smtpSecurity,
      useSmtpAuthentication: useSmtpAuthentication,
      signature: signature,
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
              setIsEdit(!isEdit);
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
                    dispatch(setEmailGatewayData(parentData.data));
                    setEmailGatewayCreationloading(false);
                    setIsEdit(!isEdit);
                  }
                  if (!parentData.success) {
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        height: "80vh",
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
                          <P>Use SMTP Server</P>
                          <Select
                            defaultValue={
                              emailGatewayData !== null
                                ? useServerSmtp == false
                                  ? "No"
                                  : "Yes"
                                : "Yes"
                            }
                            value={
                              emailGatewayData !== null
                                ? useServerSmtp == false
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
                              console.log(typeof e);

                              setUseServerSmtp(e === "Yes"); // Convert string value to boolean
                            }}
                            options={SMTPServerList}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <P>No Reply Email Address</P>
                          <Input
                            type="text"
                            placeholder="Enter Email Address here"
                            defaultValue={noReplyEmailAddress}
                            value={noReplyEmailAddress}
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
                      <Col md={6}>
                        <FormGroup>
                          <P>Signature</P>
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
                        <FormGroup></FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <P>SMTP Security</P>
                          <Select
                            defaultValue={
                              emailGatewayData !== null ? smtpSecurity : "No"
                            }
                            value={
                              emailGatewayData !== null ? smtpSecurity : "No"
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
                              setSmtpSecurity(e);
                            }}
                            options={SMTPSecurityList}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup></FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <P>SMTP Authentication</P>
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
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup></FormGroup>
                      </Col>
                      {
                        <Col md={6}>
                          <FormGroup>
                            <P>SMTP Username</P>
                            <Input
                              type="text"
                              placeholder="Enter Username here"
                              defaultValue={smtpUsername}
                              value={smtpUsername}
                              disabled={authentication == "No"}
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
                              disabled={authentication == "No"}
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
                        <Button
                          color="primary"
                          type="submit"
                          disabled={emailGatewayCreationloading}
                          onClick={(e) => {
                            if (isEdit === false && emailGatewayData !== null) {
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
