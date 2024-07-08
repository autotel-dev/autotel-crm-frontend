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

const SecurityBreifingDetails = ({ callbackActive }: BusinessFormCommonProps) => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const { createCompany, imageBackground, companyLogo } = useSelector(
        (state: any) => state.companies
    );
    const dispatch = useDispatch();
    const [vehicleDetailsForm, setVehicleDetailsForm] = useState({
        loginUsername: "",
        loginPassword: "",
        normalPassword: "",
        emergencyPassword: "",
        motherName: "",


    });

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (e: any) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };
    const [formData, setFormData] = useState({});
    const {
        loginUsername,
        loginPassword,
        normalPassword,
        emergencyPassword,
        motherName,

    } = vehicleDetailsForm;
    const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
        let name = event.target.name;
        let value =
            name === "rememberNextTime" ? event.target.checked : event.target.value;
        setVehicleDetailsForm({ ...vehicleDetailsForm, [name]: value });
    };

    const handleNextButton = () => {
        if (
            loginUsername !== "" &&
            loginPassword !== "" &&
            normalPassword !== "" &&
            emergencyPassword !== "" &&
            motherName !== ""

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
    return (
        <Form
            onSubmit={(event) => event.preventDefault()}
            className="needs-validation"
            noValidate
        >
            <Row className="g-3">

                <Col xl={4} xs={12}>
                    <P>
                        Login Username
                        <span className="txt-danger">*</span>
                    </P>
                    <Input
                        type="text"
                        placeholder="Enter Login Username"
                        value={loginUsername}
                        name="loginUsername"
                        onChange={getUserData}
                    />
                </Col> <Col xl={4} xs={12}>
                    <P>
                        Login Password
                        <span className="txt-danger">*</span>
                    </P>
                    <Input
                        type="text"
                        placeholder="Enter Login Password"
                        value={loginPassword}
                        name="loginPassword"
                        onChange={getUserData}
                    />
                </Col> <Col xl={4} xs={12}>
                    <P>

                        Normal Password
                        <span className="txt-danger">*</span>
                    </P>
                    <Input
                        type="text"
                        placeholder="Enter Normal Password"
                        value={normalPassword}
                        name="normalPassword"
                        onChange={getUserData}
                    />
                </Col> <Col xl={4} xs={12}>
                    <P>

                        Emergency Password
                        <span className="txt-danger">*</span>
                    </P>
                    <Input
                        type="text"
                        placeholder="Enter Emergency Password"
                        value={emergencyPassword}
                        name="emergencyPassword"
                        onChange={getUserData}
                    />
                </Col>
                <Col xl={4} xs={12}>
                    <P>

                        Mother Name
                        <span className="txt-danger">*</span>
                    </P>
                    <Input
                        type="text"
                        placeholder="Enter Mother Name"
                        value={motherName}
                        name="motherName"
                        onChange={getUserData}
                    />
                </Col>


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

export default SecurityBreifingDetails;
