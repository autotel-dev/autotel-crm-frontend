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
import SelectDeviceTypeBox from "./components/SelectDeviceTypeBox";
import SelectDeviceIMEIBox from "./components/SelectDeviceIMEIBox";
import SelectSimProviderBox from "./components/SelectSimProviderBox";
import SelectSimNoBox from "./components/SelectSimNoBox";
import SelectInstallerBox from "./components/SelectInstallerBox";

const InventoryDetails = ({ callbackActive }: BusinessFormCommonProps) => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const { createCompany, imageBackground, companyLogo } = useSelector(
        (state: any) => state.companies
    );
    const dispatch = useDispatch();
    const [inventoryDetailsForm, setInventoryDetailsForm] = useState({
        // vehicleRegistrationNo: "",
        // vehicleColor: "",
        // engineNo: "",
        // chasisNo: "",
        // instructions: "",
        // remarks: "",

    });

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (e: any) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };
    const [formData, setFormData] = useState({});
    const {


    } = inventoryDetailsForm;
    const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
        let name = event.target.name;
        let value =
            name === "rememberNextTime" ? event.target.checked : event.target.value;
        setInventoryDetailsForm({ ...inventoryDetailsForm, [name]: value });
    };

    const handleNextButton = () => {
        callbackActive(6);
        // if (
        //     vehicleRegistrationNo !== "" &&
        //     vehicleColor !== "" &&
        //     engineNo !== "" &&
        //     chasisNo !== "" &&
        //     instructions !== "" &&
        //     remarks !== ""

        // ) {
        //     // dispatch(setServersAddItemsList([]));
        //     // dispatch(
        //     //   setCreateCompany({
        //     //     ...createCompany,
        //     //     ...accountCredentialsForm,
        //     //   })
        //     // );
        //     // console.log("formData -->", accountCredentialsForm);
        //     // console.log("createCompany--- >", createCompany);
        //     callbackActive(3);
        // } else {
        //     ShowError();
        // }
    };
    return (
        <Form
            onSubmit={(event) => event.preventDefault()}
            className="needs-validation"
            noValidate
        >
            <Row className="g-3">
                <Col xl={4} xs={12}>
                    <div>
                        <P>
                            Select Device Type
                            <span className="txt-danger">*</span>
                        </P>
                    </div>
                    <SelectDeviceTypeBox placeholder="Select Device Type" />
                </Col>
                <Col xl={4} xs={12}>
                    <div>
                        <P>
                            Select Device IMEI
                            <span className="txt-danger">*</span>
                        </P>
                    </div>
                    <SelectDeviceIMEIBox placeholder="Select Device IMEI" />
                </Col>
                <Col xl={4} xs={12}>
                    <div>
                        <P>
                            Select SIM Provider
                            <span className="txt-danger">*</span>
                        </P>
                    </div>
                    <SelectSimProviderBox placeholder="Select SIM Provider" />
                </Col>
                <Col xl={4} xs={12}>
                    <div>
                        <P>
                            Select SIM No
                            <span className="txt-danger">*</span>
                        </P>
                    </div>
                    <SelectSimNoBox placeholder="Select SIM No" />
                </Col>
                <Col xl={4} xs={12}>
                    <div>
                        <P>
                            Select Installer
                            <span className="txt-danger">*</span>
                        </P>
                    </div>
                    <SelectInstallerBox placeholder="Select Installer" />
                </Col>


                <Col
                    xs={12}
                    className="text-end d-flex justify-content-end gap-2 align-center"
                >
                    <Button color="primary" onClick={() => callbackActive(4)}>
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

export default InventoryDetails;
