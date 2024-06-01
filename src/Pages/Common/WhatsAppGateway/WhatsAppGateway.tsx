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
import TestWhatsAppMessageModal from "./modals/TestWhatsAppModal";
import {
  setIsConnected,
  setWhatsAppGatewayData,
} from "../../../ReaduxToolkit/Reducer/WhatsAppGatewaySlice";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import { create, getAll, patch, update } from "../../../Utilities/api";
import Swal from "sweetalert2";
import BodyParamsObject from "./components/BodyParamsObject";
import Loader from "../../Utilities/Loader/Loader";

const WhatsAppGateway = () => {
  const dispatch = useDispatch();
  const { whatsAppGatewayData } = useSelector(
    (state: any) => state.whatsAppGateway
  );

  // const [authentication, setAuthentication] = useState("Yes")
  const requestsMthodsList: any = [
    { value: `GET`, label: `Get` },
    { value: `POST`, label: `Post` },
  ];

  const encodingList: any = [
    { value: `NO`, label: `No` },
    { value: `JSON`, label: `JSON` },
  ];

  const AuthenticationLIst: any = [
    { value: `Yes`, label: `Yes` },
    { value: `No`, label: `No` },
  ];
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState<any>(true);
  const [whatsAppGatewayCreationloading, setWhatsAppGatewayCreationloading] =
    useState<any>(false);

  // State to manage list of body parameters
  const [bodyParams, setBodyParams] = useState<
    { payloadKey: string; payloadValue: string; isDynamicPayload?: boolean }[]
  >(whatsAppGatewayData !== null ? whatsAppGatewayData?.bodyParams : []);
  const [requestMethod, setRequestMethod] = useState(
    whatsAppGatewayData !== null ? whatsAppGatewayData?.requestMethod : "GET"
  );
  const [encoding, setEncoding] = useState(
    whatsAppGatewayData !== null ? whatsAppGatewayData?.encoding : "NO"
  );
  const [baseUrl, setBaseUrl] = useState(
    whatsAppGatewayData !== null ? whatsAppGatewayData?.baseUrl : ""
  );
  const [headers, setHeaders] = useState("");
  const [isActive, setisActive] = useState<boolean>(
    whatsAppGatewayData !== null ? whatsAppGatewayData?.isActive : false
  );

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(setWhatsAppGatewayData(null));
    dispatch(setIsConnected(false));
  }, []);

  // Function to add a new body parameter
  const addBodyParam = () => {
    setBodyParams([...bodyParams, { payloadKey: "", payloadValue: "" }]);
  };

  // Function to delete a body parameter
  const deleteBodyParam = (index: number) => {
    const updatedParams = bodyParams.filter((_, i) => i !== index);
    setBodyParams(updatedParams);
  };

  // Function to handle body parameter changes
  const handleBodyParamChange = (
    index: number,
    newParam: { payloadKey: string; payloadValue: string }
  ) => {
    const updatedParams = bodyParams.map((param, i) =>
      i === index ? newParam : param
    );
    setBodyParams(updatedParams);
  };

  useEffect(() => {
    setBodyParams(
      whatsAppGatewayData !== null ? whatsAppGatewayData?.bodyParams : []
    );
    setRequestMethod(
      whatsAppGatewayData !== null ? whatsAppGatewayData?.requestMethod : "GET"
    );
    setEncoding(
      whatsAppGatewayData !== null ? whatsAppGatewayData?.encoding : "NO"
    );
    setBaseUrl(
      whatsAppGatewayData !== null ? whatsAppGatewayData?.baseUrl : ""
    );
    setisActive(
      whatsAppGatewayData !== null ? whatsAppGatewayData?.isActive : false
    );
  }, [whatsAppGatewayData]);
  useEffect(() => {
    getAll({
      url: "gateway/whatsapp-gateway/get-gateway",
    }).then((parentData: any) => {
      if (parentData == undefined) {
        Swal.fire({
          text: "No WhatsApp Gateway found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
        dispatch(setWhatsAppGatewayData(null));
      }

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
          dispatch(setWhatsAppGatewayData(null));
        }
        if (parentData.success) {
          dispatch(setWhatsAppGatewayData(parentData.data.whatsappGateway));
          setLoading(false);
        }
      }
    });
  }, []);

  const createAndUpdateWhatsAppGateway = (e: any) => {
    e.preventDefault();
    setWhatsAppGatewayCreationloading(true);
    // bodyParams.forEach(param => {
    //     const value = param.payloadValue;
    //     param.isDynamicPayload = value.startsWith("{{") && value.endsWith("}}");
    // });

    const updatedBodyParams = bodyParams.map((param) => {
      const value = param.payloadValue;
      const firstCheck = value.slice(0, 2) == "{{";
      const lastCheck = value.slice(value.length - 2, value.length) == "}}";

      return {
        ...param,
        isDynamicPayload: firstCheck && lastCheck ? true : false,
      };
    });

    const whatsAppGatewayFormData = {
      requestMethod: requestMethod,
      encoding: encoding,
      headers: {},
      baseUrl: baseUrl,
      bodyParams: requestMethod == "GET" ? [] : [...updatedBodyParams],
    };

    if (isEdit && whatsAppGatewayData !== null) {
      update(whatsAppGatewayFormData, {
        url: `gateway/whatsapp-gateway/update-gateway/${whatsAppGatewayData._id}`,
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
            setWhatsAppGatewayCreationloading(false);
            // setIsEdit(!isEdit);
          }
          if (data !== undefined) {
            if (
              !data.success &&
              data.message === "ERROR_INTERNET_DISCONNECTED"
            ) {
              setWhatsAppGatewayCreationloading(false);
              setIsEdit(!isEdit);
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setWhatsAppGatewayCreationloading(false);
              setIsEdit(!isEdit);
            }
            if (data.success) {
              getAll({
                url: "gateway/whatsapp-gateway/get-gateway",
              }).then((parentData: any) => {
                // console.log("api call --- >", parentData);
                if (parentData == undefined) {
                  Swal.fire({
                    text: "Failed to Fetch",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  setWhatsAppGatewayCreationloading(false);
                  setIsEdit(false);
                  dispatch(setWhatsAppGatewayData(null));
                }

                if (parentData !== undefined) {
                  if (parentData.success) {
                    setIsEdit(false);
                    dispatch(
                      setWhatsAppGatewayData(parentData.data.whatsappGateway)
                    );
                    setWhatsAppGatewayCreationloading(false);
                  }
                  if (!parentData.success) {
                    setIsEdit(false);
                    setWhatsAppGatewayCreationloading(false);
                    dispatch(setWhatsAppGatewayData(null));
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
      create(whatsAppGatewayFormData, {
        url: `gateway/whatsapp-gateway/create-gateway`,
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
            setWhatsAppGatewayCreationloading(false);
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
              setWhatsAppGatewayCreationloading(false);
              //   setIsEdit(!isEdit);
            }
            if (data.success) {
              getAll({
                url: "gateway/whatsapp-gateway/get-gateway",
              }).then((parentData: any) => {
                // console.log("api call --- >", parentData);
                if (parentData == undefined) {
                  Swal.fire({
                    text: "Failed to Fetch",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  setWhatsAppGatewayCreationloading(false);
                  dispatch(setWhatsAppGatewayData(null));
                }

                if (parentData !== undefined) {
                  if (parentData.success) {
                    dispatch(
                      setWhatsAppGatewayData(parentData.data.whatsappGateway)
                    );
                    setWhatsAppGatewayCreationloading(false);
                    // setIsEdit(!isEdit);
                  }
                  if (!parentData.success) {
                    setWhatsAppGatewayCreationloading(false);
                    dispatch(setWhatsAppGatewayData(null));
                  }
                }
              });
            }
          }
        })
        .catch((err: any) => {
          // console.log("catch data", err);
          setWhatsAppGatewayCreationloading(false);
        });
    }
  };

  return (
    <>
      <div>
        <Breadcrumbs
          title="WhatsApp Gateway"
          mainTitle="WhatsApp Gateway"
          parent="Setup"
        />
        <Container fluid>
          <Col md={12}>
            <Form onSubmit={createAndUpdateWhatsAppGateway}>
              <Card>
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
                    <div style={{ textAlign: "center", margin:"20px" }}>
                      {/* <Loader /> */}
                      <>
                        <Skeleton
                          height="50px"
                          width="100%"
                          borderRadius="10px"
                          marginBottom="20px"
                         
                        />
                        <Skeleton
                          height="50px"
                          width="100%"
                          marginTop="10px"
                          marginBottom="20px"
                          borderRadius="10px"
                          
                        />
                        <Skeleton
                          height="100px"
                          width="100%"
                          marginTop="10px"
                          marginBottom="30px"
                          borderRadius="10px"
                          
                        />
                        <Skeleton
                          height="100px"
                          width="100%"
                          marginTop="10px"
                          marginBottom="30px"
                          borderRadius="10px"
                        />
                     
                      </>
                    </div>
                  </div>
                ) : (
                  <CardBody>
                    <Row>
                      {whatsAppGatewayData !== null && (
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
                                  defaultChecked={whatsAppGatewayData.isActive}
                                  // value={
                                  //   whatsAppGatewayData.isActive == true
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
                                        url: `gateway/whatsapp-gateway/change-gateway-activation-status/${whatsAppGatewayData._id}`,
                                      }).then((data: any) => {
                                        if (data.success) {
                                          // // console.log(data);

                                          getAll({
                                            url: "gateway/whatsapp-gateway/get-gateway",
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
                                                  setWhatsAppGatewayData(null)
                                                );
                                              }
                                              if (parentData.success) {
                                                dispatch(
                                                  setWhatsAppGatewayData(
                                                    parentData.data
                                                      .whatsappGateway
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
                                  className={`switch-state ${
                                    isActive ? "bg-primary" : "bg-secondary"
                                  }`}
                                />
                              </Label>
                            </div>
                          </div>
                        </Col>
                      )}
                      <Col md={12}>
                        <FormGroup>
                          <P>Request Method</P>
                          <Select
                            value={requestMethod}
                            showSearch
                            style={{ width: "100%", height: 36 }}
                            placeholder="Select Method"
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                              (option?.label ?? "").includes(input)
                            }
                            onChange={(e) => {
                              setRequestMethod(e);
                            }}
                            options={requestsMthodsList}
                            disabled={
                              whatsAppGatewayData !== null && !isEdit
                                ? true
                                : false
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md={12}>
                        <FormGroup>
                          <P>Encoding</P>
                          <Select
                            value={encoding}
                            showSearch
                            style={{ width: "100%", height: 36 }}
                            placeholder="Select Encoding"
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                              (option?.label ?? "").includes(input)
                            }
                            onChange={(e) => {
                              setEncoding(e);
                            }}
                            options={encodingList}
                            disabled={
                              whatsAppGatewayData !== null && !isEdit
                                ? true
                                : false
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md={12}>
                        <FormGroup>
                          <P>Headers</P>
                          <textarea
                            className="form-control"
                            rows={3}
                            style={{
                              maxHeight: "100px",
                              resize: "vertical",
                              overflow: "auto",
                            }}
                            value={headers}
                            onChange={(e) => setHeaders(e.target.value)}
                            disabled={
                              whatsAppGatewayData !== null && !isEdit
                                ? true
                                : false
                            }
                          />
                          <p>
                            (e.g. Accept: text/plain; Accept-Language: en-US;)
                          </p>
                        </FormGroup>
                      </Col>
                      <Col md={12}>
                        <FormGroup>
                          <P>URL</P>
                          <textarea
                            className="form-control"
                            rows={3}
                            style={{
                              maxHeight: "100px",
                              resize: "vertical",
                              overflow: "auto",
                            }}
                            disabled={
                              whatsAppGatewayData !== null && !isEdit
                                ? true
                                : false
                            }
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            placeholder={`https://nusagateway.com/api/send-message.php?${
                              requestMethod === "GET"
                                ? "phone={{phoneNo}}&type=text&message={{message}}&token=XxRSOwkK5XJBjwR9Mdnictjrh7hgQZkqAjKtReyElikoZyM9st"
                                : ""
                            }`}
                          />
                        </FormGroup>
                      </Col>
                      {requestMethod === "POST" && (
                        <Col md={12} style={{ marginBottom: "20px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "end",
                              marginBottom: "10px",
                            }}
                          >
                            <Button
                              color="primary"
                              type="button"
                              onClick={addBodyParam}
                              disabled={
                                whatsAppGatewayData !== null &&
                                !isEdit &&
                                !isActive
                                  ? true
                                  : false
                              }
                            >
                              Add
                            </Button>
                          </div>

                          <FormGroup>
                            <P>Body</P>
                            {bodyParams.map((param, index) => (
                              <BodyParamsObject
                                key={index}
                                data={whatsAppGatewayData}
                                isEdit={isEdit}
                                isActive={isActive}
                                param={param}
                                onChange={(newParam: any) =>
                                  handleBodyParamChange(index, newParam)
                                }
                                onDelete={() => deleteBodyParam(index)}
                              />
                            ))}
                          </FormGroup>
                        </Col>
                      )}
                      {requestMethod === "POST" && <hr />}
                      <Col md={12}>
                        <div
                          style={{
                            padding: "20px",
                            marginTop: "20px",
                            backgroundColor: "lightblue",
                          }}
                        >
                          <p style={{ margin: "5px 0px" }}>
                            SMS gateway, which can send messages via HTTP
                            GET/POST should be used.
                          </p>
                          <p style={{ margin: "5px 0px" }}>
                            Variables: {`{{phoneNo}}`}, {`{{message}}`}.
                          </p>
                        </div>
                      </Col>
                      <CardFooter
                        style={{ display: "flex", justifyContent: "end" }}
                      >
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
                        {whatsAppGatewayData == null ||
                        (whatsAppGatewayData !== null && isActive) ? (
                          <Button
                            color="primary"
                            type="submit"
                            disabled={whatsAppGatewayCreationloading}
                            onClick={(e) => {
                              if (
                                isEdit === false &&
                                whatsAppGatewayData !== null
                              ) {
                                e.preventDefault();
                                setIsEdit(true);
                              }
                            }}
                          >
                            {whatsAppGatewayCreationloading
                              ? "Loading..."
                              : whatsAppGatewayData == null
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
                    {/* <TestWhatsAppMessageModal isVisible={isVisible} setIsVisible={setIsVisible} /> */}
                  </CardBody>
                )}
              </Card>
            </Form>
          </Col>
        </Container>
      </div>
    </>
  );
};

export default WhatsAppGateway;
