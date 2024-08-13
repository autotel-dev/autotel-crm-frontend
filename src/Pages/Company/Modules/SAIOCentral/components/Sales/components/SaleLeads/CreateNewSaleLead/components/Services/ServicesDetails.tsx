
import { ChangeEvent, useState } from "react";
import ShowError from "../../ShowError";
import {
    Button,
    Col,
    Form,
    FormGroup,
    Input,
    InputGroup,
    Label,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { BusinessFormCommonProps } from "../../../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import { H4 } from "../../../../../../../../../../../AbstractElements";


const ServicesDetails = ({ callbackActive }: BusinessFormCommonProps) => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const { services } = useSelector((state: any) => state.sales);
    const dispatch = useDispatch();

    const [vehicleServicesOptional, setVehicleServicesOptional] = useState(services.map((item: any) => ({
        ...item,
        checked: false
    })))
    // const [vehicleServicesDefault, setVehicleServicesDefault] = useState([{ title: "Self", value: "SELF", checked: true }, { title: "Control Room", value: "CONTROL ROOM", checked: false }])

    const handleCheckboxChange = (index: number) => {
        const updatedServices = vehicleServicesOptional.map((service: any, i: number) =>
            i === index ? { ...service, checked: !service.checked } : service
        );
        setVehicleServicesOptional(updatedServices);
    };

    const [selection, setSelection] = useState("Self"); // Added state for selection

    const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelection(e.target.value);
    };

    return (
        <Form
            onSubmit={(event) => event.preventDefault()}
            className="needs-validation"
            noValidate
        >
            <Row className="g-3">
                <Row style={{ display: "flex", flexWrap: "wrap" }}>
                    <H4>Default</H4>
                    <div style={{
                        height: "20px"
                    }}>  </div>
                    <Row>
                        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", marginBottom: "25px" }}>
                            <Input
                                type="radio"
                                name="selection"
                                value="Self"
                                checked={selection === "Self"}
                                onChange={handleSelectionChange}
                                style={{ display: 'none' }}
                                id="Self"
                            />
                            <label
                                htmlFor="Self"
                                style={{
                                    position: 'relative',
                                    paddingLeft: '25px',
                                    marginRight: '50px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    color: '#333'
                                }}
                            >
                                Self
                                <span
                                    style={{
                                        content: '',
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        width: '18px',
                                        height: '18px',
                                        border: '2px solid black',
                                        borderRadius: '50%',
                                        background: 'white'
                                    }}
                                />
                                {selection === 'Self' && (
                                    <span
                                        style={{
                                            content: '',
                                            position: 'absolute',
                                            left: '5px',
                                            top: '5px',
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: 'green'
                                        }}
                                    />
                                )}
                            </label>
                            <Input
                                type="radio"
                                name="selection"
                                value="Control Room"
                                checked={selection === "Control Room"}
                                onChange={handleSelectionChange}
                                style={{ display: 'none' }}
                                id="Control Room"
                            />
                            <label
                                htmlFor="Control Room"
                                style={{
                                    position: 'relative',
                                    paddingLeft: '25px',
                                    marginRight: '20px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    color: '#333'
                                }}
                            >
                                Control Room
                                <span
                                    style={{
                                        content: '',
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        width: '18px',
                                        height: '18px',
                                        border: '2px solid black',
                                        borderRadius: '50%',
                                        background: 'white'
                                    }}
                                />
                                {selection === 'Control Room' && (
                                    <span
                                        style={{
                                            content: '',
                                            position: 'absolute',
                                            left: '5px',
                                            top: '5px',
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: 'green'
                                        }}
                                    />
                                )}
                            </label>
                        </div>
                    </Row>
                    <H4>Optional</H4>
                    <div style={{
                        height: "20px"
                    }}>

                    </div>
                    {services?.map((item: any, index: any) => {
                        return (
                            <>
                                <Col sm={3}>
                                    <label
                                        style={{
                                            display: "inline-flex", // Use flexbox
                                            alignItems: "center", // Center items vertically
                                            position: "relative",
                                            cursor: "pointer",
                                            marginRight: "25px",
                                            fontSize: "18px",
                                            marginBottom: "15px" // Add some space between rows
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <input
                                            type="checkbox"
                                            name="key"
                                            value={item.value}
                                            checked={item.checked}
                                            onChange={() => handleCheckboxChange(index)}
                                            style={{ display: "none" }}

                                        />
                                        <span
                                            onClick={(e) => e.stopPropagation()}
                                            className="green"
                                        ></span>
                                        <span style={{ marginTop: "5px" }}>{item.title}</span>
                                    </label></Col>
                            </>
                        );
                    })}
                </Row>

                <Col
                    xs={12}
                    className="text-end d-flex justify-content-end gap-2 align-center"
                >
                    <Button color="primary" onClick={() => callbackActive(3)}>
                        Previous
                    </Button>
                    <Button color="primary" onClick={() => callbackActive(5)}>
                        Continue
                    </Button>
                </Col>
            </Row>

        </Form >
    );
};

export default ServicesDetails;






