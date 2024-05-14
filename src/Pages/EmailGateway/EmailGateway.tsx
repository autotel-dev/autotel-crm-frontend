import { Button, Card, CardBody, CardFooter, Col, Container, Form, FormGroup, Input, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { P } from "../../AbstractElements";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TestEmailModal from "./modals/TestEmailModal";


const EmailGateway = () => {


    const dispatch = useDispatch();

    const [authentication, setAuthentication] = useState("Yes")
    const SMTPServerList: any = [{ value: `Yes`, label: `Yes` },
    { value: `No`, label: `No` }
    ];

    const SMTPAuthenticationList: any = [{ value: `Yes`, label: `Yes` },
    { value: `No`, label: `No` }
    ];

    const SMTPSecurityList: any = [{ value: `No`, label: `No` },
    { value: `SSL`, label: `SSL` }, { value: `TLS`, label: `TLS` }
    ];

    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            <div>
                <Breadcrumbs title="Email Gateway" mainTitle="Email Gateway" parent="Setup" />
                <Container fluid>
                    <Col md={12}>
                        <Form
                        // onSubmit={createPersonalization}
                        >
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <P>From Name</P>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Header Text here"
                                                // defaultValue={headerText}
                                                // value={headerText}
                                                // disabled={
                                                //     userPersonalizationData !== null && !isEdit ? true : false
                                                // }
                                                // onChange={(e) => setheaderText(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <P>Use SMTP Server</P>
                                                <Select
                                                    defaultValue="Yes"
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
                                                            .localeCompare((optionB?.label ?? "").toLowerCase())
                                                    }
                                                    onChange={(e, options) => {
                                                        // setRole(e);
                                                    }}
                                                    options={SMTPServerList}
                                                />
                                                {/* <Input
                                                    type="text"
                                                    placeholder="Enter Sub Text here"
                                                defaultValue={subHeaderText}
                                                value={subHeaderText}
                                                disabled={
                                                    userPersonalizationData !== null && !isEdit ? true : false
                                                }
                                                onChange={(e) => setsubHeaderText(e.target.value)}
                                                /> */}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <P>No Reply email Address</P>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Header Text here"
                                                // defaultValue={headerText}
                                                // value={headerText}
                                                // disabled={
                                                //     userPersonalizationData !== null && !isEdit ? true : false
                                                // }
                                                // onChange={(e) => setheaderText(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <P>SMTP Server Host</P>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Sub Text here"
                                                // defaultValue={subHeaderText}
                                                // value={subHeaderText}
                                                // disabled={
                                                //     userPersonalizationData !== null && !isEdit ? true : false
                                                // }
                                                // onChange={(e) => setsubHeaderText(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <P>Signature</P>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Header Text here"
                                                // defaultValue={headerText}
                                                // value={headerText}
                                                // disabled={
                                                //     userPersonalizationData !== null && !isEdit ? true : false
                                                // }
                                                // onChange={(e) => setheaderText(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <P>SMTP Server Port</P>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Sub Text here"
                                                // defaultValue={subHeaderText}
                                                // value={subHeaderText}
                                                // disabled={
                                                //     userPersonalizationData !== null && !isEdit ? true : false
                                                // }
                                                // onChange={(e) => setsubHeaderText(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>

                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <P>SMTP Security</P>
                                                <Select
                                                    defaultValue="No"
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
                                                            .localeCompare((optionB?.label ?? "").toLowerCase())
                                                    }
                                                    onChange={(e, options) => {
                                                        // setRole(e);
                                                    }}
                                                    options={SMTPSecurityList}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>

                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <P>SMTP Authentication</P>
                                                <Select
                                                    defaultValue="Yes"
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
                                                            .localeCompare((optionB?.label ?? "").toLowerCase())
                                                    }
                                                    onChange={(e, options) => {
                                                        setAuthentication(e);
                                                    }}
                                                    options={SMTPAuthenticationList}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>

                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <P>SMTP Username</P>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Sub Text here"
                                                    // defaultValue={subHeaderText}
                                                    // value={subHeaderText}
                                                    disabled={
                                                        authentication == "No"
                                                    }
                                                // onChange={(e) => setsubHeaderText(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>

                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <P>SMTP Password</P>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Sub Text here"
                                                    // defaultValue={subHeaderText}
                                                    // value={subHeaderText}
                                                    disabled={
                                                        authentication == "No"
                                                    }
                                                // onChange={(e) => setsubHeaderText(e.target.value)}
                                                />
                                            </FormGroup>
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
                                                Test Email
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
                                    <TestEmailModal isVisible={isVisible} setIsVisible={setIsVisible} />
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
