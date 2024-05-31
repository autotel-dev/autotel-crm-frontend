import { Button, Card, CardBody, CardFooter, Col, Container, Form, FormGroup, Input, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { P } from "../../../AbstractElements";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TestSMSMessageModal from "./modals/TestSMSModal";


const SMSGateway = () => {
    const dispatch = useDispatch();
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );

    const [authentication, setAuthentication] = useState("Yes")
    const requestsMthodsList: any = [{ value: `GET`, label: `Get` },
    { value: `POST`, label: `Post` }, { value: `SMS GATEWAY APP`, label: `SMS Gateway App` }, { value: `PILVO`, label: `Pilvo` }
    ];

    const encodingList: any = [{ value: `NO`, label: `No` },
    { value: `JSON`, label: `JSON` }
    ];

    const AuthenticationLIst: any = [{ value: `Yes`, label: `Yes` },
    { value: `No`, label: `No` },
    ];

    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            <div>
                <Breadcrumbs title="SMS Gateway" mainTitle="SMS Gateway" parent="Setup" />
                <Container fluid style={{
                    backgroundColor: `${userPersonalizationData !== null &&
                        userPersonalizationData?.backgroundColor !== null
                        ? userPersonalizationData?.backgroundColor
                        : ""
                        }`,
                }}>
                    <Col md={12}>
                        <Form
                        // onSubmit={createPersonalization}
                        >
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col md={12}>
                                            <FormGroup>
                                                <P>Request Method</P>
                                                <Select
                                                    defaultValue="Yes"
                                                    showSearch
                                                    style={{ width: "100%", height: 36 }}
                                                    placeholder="Select Role"
                                                    optionFilterProp="children"
                                                    filterOption={(input: any, option: any) =>
                                                        (option?.label ?? "").includes(input)
                                                    }
                                                    // filterSort={(optionA: any, optionB: any) =>
                                                    //     (optionA?.label ?? "")
                                                    //         .toLowerCase()
                                                    //         .localeCompare((optionB?.label ?? "").toLowerCase())
                                                    // }
                                                    onChange={(e, options) => {
                                                        // setRole(e);
                                                    }}
                                                    options={requestsMthodsList}
                                                />

                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <P>Encoding</P>
                                                <Select
                                                    defaultValue="Yes"
                                                    showSearch
                                                    style={{ width: "100%", height: 36 }}
                                                    placeholder="Select Role"
                                                    optionFilterProp="children"
                                                    filterOption={(input: any, option: any) =>
                                                        (option?.label ?? "").includes(input)
                                                    }
                                                    // filterSort={(optionA: any, optionB: any) =>
                                                    //     (optionA?.label ?? "")
                                                    //         .toLowerCase()
                                                    //         .localeCompare((optionB?.label ?? "").toLowerCase())
                                                    // }
                                                    onChange={(e, options) => {
                                                        // setRole(e);
                                                    }}
                                                    options={encodingList}
                                                />

                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <P>Authentication</P>
                                                <Select
                                                    defaultValue="Yes"
                                                    showSearch
                                                    style={{ width: "100%", height: 36 }}
                                                    placeholder="Select Role"
                                                    optionFilterProp="children"
                                                    filterOption={(input: any, option: any) =>
                                                        (option?.label ?? "").includes(input)
                                                    }
                                                    // filterSort={(optionA: any, optionB: any) =>
                                                    //     (optionA?.label ?? "")
                                                    //         .toLowerCase()
                                                    //         .localeCompare((optionB?.label ?? "").toLowerCase())
                                                    // }
                                                    onChange={(e, options) => {
                                                        // setRole(e);
                                                    }}
                                                    options={AuthenticationLIst}
                                                />

                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <P>SMS Gaeway Headers</P>
                                                <textarea
                                                    className="form-control"
                                                    rows={3} // Minimum number of visible lines
                                                    style={{
                                                        maxHeight: "100px", // Maximum height for 5 lines of text
                                                        resize: "vertical", // Allow vertical resizing within the specified range
                                                        overflow: "auto"
                                                    }}
                                                // {...register("response", { required: true })}
                                                />
                                                <p>(e.g. Accept: text/plain; Accept-Language: en-US;)</p>
                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <P>SMS Gateway URL</P>
                                                <textarea
                                                    className="form-control"
                                                    rows={3} // Minimum number of visible lines
                                                    style={{
                                                        maxHeight: "100px", // Maximum height for 5 lines of text
                                                        resize: "vertical", // Allow vertical resizing within the specified range
                                                        overflow: "auto"
                                                    }}
                                                    defaultValue="https://nusagateway.com/api/send-message.php?phone=%NUMBER%&type=text&message=%MESSAGE%&token=XxRSOwkK5XJBjwR9Mdnictjrh7hgQZkqAjKtReyElikoZyM9st"
                                                // {...register("response", { required: true })}
                                                />

                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <div style={{
                                                padding: "20px",
                                                backgroundColor: "lightblue"
                                            }}>

                                                <p style={{
                                                    margin: "5px 0px"
                                                }}>SMS gateway, which can send messages via HTTP GET should be used.</p>
                                                <p style={{
                                                    margin: "5px 0px"
                                                }}>Variables: %NUMBER%, %MESSAGE%.</p>
                                                <p style={{
                                                    margin: "5px 0px"
                                                }}>SMS gateway URL example: http://SMS_GATEWAY/sendsms.php?username=USER&password=PASSWORD&number=%NUMBER%&message=%MESSAGE%</p>
                                            </div>
                                        </Col>



                                        <CardFooter
                                            style={{
                                                display: "flex",
                                                justifyContent: "end",
                                            }}
                                        >
                                            <Button
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
                                                Send Test SMS
                                            </Button>
                                            <Button
                                                color="secondary"
                                                type="submit"
                                                onClick={(e) => {

                                                }}
                                                style={{
                                                    marginRight: "10px",
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                color="primary"
                                                type="submit"
                                                onClick={(e) => {

                                                }}
                                            >
                                                Save
                                            </Button>
                                        </CardFooter>
                                    </Row>
                                    <TestSMSMessageModal isVisible={isVisible} setIsVisible={setIsVisible} />
                                </CardBody>
                            </Card>
                        </Form>
                    </Col>
                </Container>
            </div>
        </>
    );
};

export default SMSGateway;
