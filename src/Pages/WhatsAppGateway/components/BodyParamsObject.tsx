import { ChangeEvent } from "react";
import { Button, Col, Form, Input, Row } from "reactstrap";
interface PropTypes {
    data: any;
    isEdit: any;
    isActive: any;
    param: any;
    onChange: any;
    onDelete: any
}

const BodyParamsObject: React.FC<PropTypes> = ({ data, isEdit, isActive, param, onChange, onDelete }) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        onChange({ ...param, [name]: value });
    };

    return (
        <Form onSubmit={(event) => event.preventDefault()} className="needs-validation" noValidate>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <Row style={{ width: "93%" }}>
                    <Col sm={6}>
                        <Input
                            value={param.payloadKey}
                            name="payloadKey"
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Key"
                            disabled={
                                data !== null && !isEdit
                                    ? true
                                    : false
                            }
                        />
                    </Col>
                    <Col sm={6}>
                        <Input
                            type="text"
                            placeholder="Value"
                            value={param.payloadValue}
                            name="payloadValue"
                            onChange={handleInputChange}
                            disabled={
                                data !== null && !isEdit
                                    ? true
                                    : false
                            }
                        />
                    </Col>
                </Row>
                <div>
                    <Button style={{
                        // width: "7%"
                        paddingLeft: "20px",
                        paddingRight: "20px"
                    }} color="secondary" onClick={onDelete} disabled={
                        data !== null && !isEdit
                            ? true
                            : false
                    }>
                        Delete
                    </Button>
                </div>
            </div>
        </Form>
    );
};

export default BodyParamsObject;
