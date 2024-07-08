
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { P } from "../../../../../../../../../../AbstractElements";
import { BusinessFormCommonProps } from "../../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import SelectBanksBox from "../VehicleDetails/components/SelectBanksBox";
import SelectInsuranceBox from "../VehicleDetails/components/SelectInsuranceBox";
import SelectGroupsBox from "../VehicleDetails/components/SelectGroupsBox";
import SelectVehicleMakeBox from "../VehicleDetails/components/SelectVehicleMakeBox";
import SelectVehicleModelBox from "../VehicleDetails/components/SelectVehicleModelBox";
import SelectVehicleYearBox from "../VehicleDetails/components/SelectVehicleYearBox";
import SelectTransmissionBox from "../VehicleDetails/components/SelectTransmissionBox";
import SelectFuelTypeBox from "../VehicleDetails/components/SelectFuelTypeBox";

const ServicesDetails = ({ callbackActive }: BusinessFormCommonProps) => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const { createCompany, imageBackground, companyLogo } = useSelector(
        (state: any) => state.companies
    );
    const dispatch = useDispatch();
    const [vehicleDetailsForm, setVehicleDetailsForm] = useState({
        vehicleRegistrationNo: "",
        vehicleColor: "",
        engineNo: "",
        chasisNo: "",
        instructions: "",
        remarks: "",

    });

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (e: any) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };
    const [formData, setFormData] = useState({});
    const {
        vehicleRegistrationNo,
        vehicleColor,
        engineNo,
        chasisNo,
        instructions,
        remarks,

    } = vehicleDetailsForm;
    const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
        let name = event.target.name;
        let value =
            name === "rememberNextTime" ? event.target.checked : event.target.value;
        setVehicleDetailsForm({ ...vehicleDetailsForm, [name]: value });
    };

    const handleNextButton = () => {
        if (
            vehicleRegistrationNo !== "" &&
            vehicleColor !== "" &&
            engineNo !== "" &&
            chasisNo !== "" &&
            instructions !== "" &&
            remarks !== ""

        ) {
            // dispatch(setServersAddItemsList([]));
            // dispatch(
            //   setCreateCompany({
            //     ...createCompany,
            //     ...accountCredentialsForm,
            //   })
            // );
            // console.log("formData -->", accountCredentialsForm);
            // console.log("createCompany--- >", createCompany);
            callbackActive(3);
        } else {
            ShowError();
        }
    };

    const crmModules = ["Geofence", "Cut Off", "Panic", "Microphone", "Ignition ON/OFF Alerts", "Web Access", "Mobile App Access", "Over Speed Alerts", "One Way Communication", "2 way Communication", "WhatsApp Alerts", "SMS Alerts"]
    return (
        <Form
            onSubmit={(event) => event.preventDefault()}
            className="needs-validation"
            noValidate
        >
            <Row className="g-3">
                <Row style={{ display: "flex", flexWrap: "wrap" }}>
                    {crmModules?.map((item: any, index: any) => {
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
                                            value="value"
                                            // checked={permission.read}
                                            // onChange={() => {
                                            //     handleCheckboxChange(index, "read");
                                            // }}
                                            style={{ display: "none" }} // Hide the default checkbox
                                        />
                                        <span
                                            onClick={(e) => e.stopPropagation()}
                                            className="green"
                                        ></span>
                                        <span style={{ marginTop: "5px" }}>{item}</span>
                                    </label></Col>
                            </>
                        );
                    })}
                </Row>

                <Col
                    xs={12}
                    className="text-end d-flex justify-content-end gap-2 align-center"
                >
                    <Button color="primary" onClick={() => callbackActive(1)}>
                        Previous
                    </Button>
                    <Button color="primary" onClick={handleNextButton}>
                        Continue
                    </Button>
                </Col>
            </Row>

        </Form >
    );
};

export default ServicesDetails;

























