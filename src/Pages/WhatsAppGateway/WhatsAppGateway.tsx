import { Button, Card, CardBody, CardFooter, Col, Container, Form, FormGroup, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { P } from "../../AbstractElements";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TestWhatsAppMessageModal from "./modals/TestWhatsAppModal";
import { setIsConnected, setWhatsAppGatewayDataData } from "../../ReaduxToolkit/Reducer/WhatsAppGatewaySlice";
import { getAll } from "../../Api";
import Swal from "sweetalert2";
import BodyParamsObject from "./components/BodyParamsObject";

const WhatsAppGateway = () => {
    const dispatch = useDispatch();
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );

    const [authentication, setAuthentication] = useState("Yes")
    const requestsMthodsList: any = [{ value: `GET`, label: `Get` },
    { value: `POST`, label: `Post` }
    ];

    const encodingList: any = [{ value: `NO`, label: `No` },
    { value: `JSON`, label: `JSON` }
    ];

    const AuthenticationLIst: any = [{ value: `Yes`, label: `Yes` },
    { value: `No`, label: `No` },
    ];
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [requestMethod, setRequestMethod] = useState("GET");
    const [encoding, setEncoding] = useState("NO");

    // State to manage list of body parameters
    const [bodyParams, setBodyParams] = useState<{ key: string; value: string }[]>([]);

    useEffect(() => {
        dispatch(setIsConnected(false));
    }, []);

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
                dispatch(setWhatsAppGatewayDataData(null));
            }

            if (parentData !== undefined) {
                if (!parentData.success && parentData.message === "ERROR_INTERNET_DISCONNECTED") {
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
                    dispatch(setWhatsAppGatewayDataData(null));
                }
                if (parentData.success) {
                    dispatch(setWhatsAppGatewayDataData(parentData.data));
                    setLoading(false);
                }
            }
        });
    }, []);

    // Function to add a new body parameter
    const addBodyParam = () => {
        setBodyParams([...bodyParams, { key: "", value: "" }]);
    };

    // Function to delete a body parameter
    const deleteBodyParam = (index: number) => {
        const updatedParams = bodyParams.filter((_, i) => i !== index);
        setBodyParams(updatedParams);
    };

    // Function to handle body parameter changes
    const handleBodyParamChange = (index: number, newParam: { key: string; value: string }) => {
        const updatedParams = bodyParams.map((param, i) => (i === index ? newParam : param));
        setBodyParams(updatedParams);
    };

    return (
        <>
            <div>
                <Breadcrumbs title="WhatsApp Gateway" mainTitle="WhatsApp Gateway" parent="Setup" />
                <Container fluid>
                    <Col md={12}>
                        <Form>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col md={12}>
                                            <FormGroup>
                                                <P>Request Method</P>
                                                <Select
                                                    defaultValue={requestMethod}
                                                    value={requestMethod}
                                                    showSearch
                                                    style={{ width: "100%", height: 36 }}
                                                    placeholder="Select Role"
                                                    optionFilterProp="children"
                                                    filterOption={(input: any, option: any) =>
                                                        (option?.label ?? "").includes(input)
                                                    }
                                                    onChange={(e) => {
                                                        setRequestMethod(e);
                                                    }}
                                                    options={requestsMthodsList}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <P>Encoding</P>
                                                <Select
                                                    defaultValue={encoding}
                                                    value={encoding}
                                                    showSearch
                                                    style={{ width: "100%", height: 36 }}
                                                    placeholder="Select Role"
                                                    optionFilterProp="children"
                                                    filterOption={(input: any, option: any) =>
                                                        (option?.label ?? "").includes(input)
                                                    }
                                                    onChange={(e) => {
                                                        setEncoding(e);
                                                    }}
                                                    options={encodingList}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <P>SMS Gateway Headers</P>
                                                <textarea
                                                    className="form-control"
                                                    rows={3}
                                                    style={{
                                                        maxHeight: "100px",
                                                        resize: "vertical",
                                                        overflow: "auto"
                                                    }}
                                                />
                                                <p>(e.g. Accept: text/plain; Accept-Language: en-US;)</p>
                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <P>SMS Gateway URL</P>
                                                <textarea
                                                    className="form-control"
                                                    rows={3}
                                                    style={{
                                                        maxHeight: "100px",
                                                        resize: "vertical",
                                                        overflow: "auto"
                                                    }}
                                                    placeholder={`https://nusagateway.com/api/send-message.php${requestMethod === "GET" ? "?phone={{phoneNo}}&type=text&message={{message}}&token=XxRSOwkK5XJBjwR9Mdnictjrh7hgQZkqAjKtReyElikoZyM9st" : ""}`}
                                                />
                                            </FormGroup>
                                        </Col>
                                        {requestMethod === "POST" && (
                                            <Col md={12} style={{ marginBottom: "20px" }}>
                                                <div style={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}>
                                                    <Button color="primary" type="button" onClick={addBodyParam}>
                                                        Add
                                                    </Button>
                                                </div>

                                                <FormGroup>
                                                    <P>Body</P>
                                                    {bodyParams.map((param, index) => (
                                                        <BodyParamsObject
                                                            key={index}
                                                            param={param}
                                                            onChange={(newParam: any) => handleBodyParamChange(index, newParam)}
                                                            onDelete={() => deleteBodyParam(index)}
                                                        />
                                                    ))}
                                                </FormGroup>

                                            </Col>
                                        )}
                                        {requestMethod === "POST" && <hr />}
                                        <Col md={12}>
                                            <div style={{ padding: "20px", marginTop: "20px", backgroundColor: "lightblue" }}>
                                                <p style={{ margin: "5px 0px" }}>SMS gateway, which can send messages via HTTP GET/POST should be used.</p>
                                                <p style={{ margin: "5px 0px" }}>Variables: {`{{phoneNo}}`}, {`{{message}}`}.</p>
                                            </div>
                                        </Col>
                                        <CardFooter style={{ display: "flex", justifyContent: "end" }}>
                                            <Button color="secondary" type="button" style={{ marginRight: "10px" }}>
                                                Cancel
                                            </Button>
                                            <Button color="primary" type="submit">
                                                Save
                                            </Button>
                                        </CardFooter>
                                    </Row>
                                    <TestWhatsAppMessageModal isVisible={isVisible} setIsVisible={setIsVisible} />
                                </CardBody>
                            </Card>
                        </Form>
                    </Col>
                </Container>
            </div>
        </>
    );
};

export default WhatsAppGateway;
