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
import { H4, P } from "../../../../../../../../../../../AbstractElements";
import { BusinessFormCommonProps } from "../../../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import SelectDeviceTypeBox from "./components/SelectDeviceTypeBox";
import SelectDeviceIMEIBox from "./components/SelectDeviceIMEIBox";
import SelectSimProviderBox from "./components/SelectSimProviderBox";
import SelectSimNoBox from "./components/SelectSimNoBox";
import SelectInstallerBox from "./components/SelectInstallerBox";
import SelectSensorsBox from "./components/SelectSensorsBox";
import SelectProductModel from "./components/SelectProductModel";

const InventoryDetails = ({ callbackActive }: BusinessFormCommonProps) => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const { createCompany, imageBackground, companyLogo } = useSelector(
        (state: any) => state.companies
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("")
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
                <div style={{
                    marginBottom: "50px", display: "flex", gap: "1%", alignItems: "end"
                }}>
                    <Col lg={6} xs={12}>
                        <div>
                            <P>
                                Select Installer
                                <span className="txt-danger">*</span>
                            </P>
                        </div>
                        <SelectInstallerBox placeholder="Select Installer" />
                    </Col>
                    <Button color="primary" style={{
                        height: "36px"
                    }}
                        onClick={() => { setModalType("IMEI"); setIsModalOpen(!isModalOpen) }}
                    >
                        Add IMEI
                    </Button>
                    <Button color="primary" style={{
                        height: "36px"
                    }}
                        onClick={() => { setModalType("SIM"); setIsModalOpen(!isModalOpen) }}
                    >
                        Add SIM
                    </Button>
                    <Button color="primary" style={{
                        height: "36px"
                    }}
                        onClick={() => { setModalType("Sensor"); setIsModalOpen(!isModalOpen) }}
                    >
                        Add Sensors
                    </Button>
                    <Button color="primary" style={{
                        height: "36px"
                    }}
                        onClick={() => { setModalType("Accessories"); setIsModalOpen(!isModalOpen) }}
                    >
                        Add Accessories
                    </Button>
                </div>

            </Row>

            <Row className="g-3" >

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
                    <P>
                        Device Type
                        <span className="txt-danger">*</span>
                    </P>
                    <Input
                        type="text"
                        placeholder="Enter Device Type"
                        // value={color}
                        // name="color"
                        onChange={getUserData}
                    />
                </Col>
                <Col xl={4} xs={12}>
                    <P>
                        Device ID
                        <span className="txt-danger">*</span>
                    </P>
                    <Input
                        type="text"
                        placeholder="Enter Device ID"
                        // value={color}
                        // name="color"
                        onChange={getUserData}
                    />
                </Col>

                <Col xl={4} xs={12}>
                    <div>
                        <P>
                            Select SIM
                            <span className="txt-danger">*</span>
                        </P>
                    </div>
                    <SelectSimProviderBox placeholder="Select SIM" />
                </Col>
                <Col xl={4} xs={12}>
                    <P>
                        ICCID
                        <span className="txt-danger">*</span>
                    </P>
                    <Input
                        type="text"
                        placeholder="Enter ICCID"
                        // value={color}
                        // name="color"
                        onChange={getUserData}
                    />
                </Col>
                <Col xl={4} xs={12}>
                    <P>
                        Network
                        <span className="txt-danger">*</span>
                    </P>
                    <Input
                        type="text"
                        placeholder="Enter Network"
                        // value={color}
                        // name="color"
                        onChange={getUserData}
                    />
                </Col>
                <H4>
                    Sensors
                </H4>

                <Row className="g-3">
                    <div style={{
                        marginBottom: "50px", display: "flex", gap: "1%", alignItems: "end"
                    }}>
                        <Col lg={4} xs={12}>
                            <div>
                                <P>
                                    Select Sensor Type
                                    <span className="txt-danger">*</span>
                                </P>
                            </div>
                            <SelectSensorsBox placeholder="Select Sensor Type" />
                        </Col>
                        <Button color="primary" style={{
                            height: "36px"
                        }}>
                            Add Sensor
                        </Button>

                    </div>

                </Row>

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
            {
                isModalOpen &&
                <SelectProductModel
                    isVisible={isModalOpen}
                    setIsVisible={setIsModalOpen}
                    type={modalType}
                />
            }
        </Form >
    );
};

export default InventoryDetails;













{/* <Col xl={4} xs={12}>
                    <div>
                        <P>
                            Select Device Type
                            <span className="txt-danger">*</span>
                        </P>
                    </div>
                    <SelectDeviceTypeBox placeholder="Select Device Type" />
                </Col> */}

{/* <Col xl={4} xs={12}>
                    <div>
                        <P>
                            Select SIM No
                            <span className="txt-danger">*</span>
                        </P>
                    </div>
                    <SelectSimNoBox placeholder="Select SIM No" />
                </Col> */}

