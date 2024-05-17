import { ChangeEvent } from "react";
import { Button, Col, Form, Input, Row } from "reactstrap";
interface PropTypes {
    param: any;
    onChange: any;
    onDelete: any
}

const BodyParamsObject: React.FC<PropTypes> = ({ param, onChange, onDelete }) => {
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
                            value={param.key}
                            name="key"
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Key"
                        />
                    </Col>
                    <Col sm={6}>
                        <Input
                            type="text"
                            placeholder="Value"
                            value={param.value}
                            name="value"
                            onChange={handleInputChange}
                        />
                    </Col>
                </Row>
                <div>
                    <Button color="secondary" onClick={onDelete}>
                        Delete
                    </Button>
                </div>
            </div>
        </Form>
    );
};

export default BodyParamsObject;
