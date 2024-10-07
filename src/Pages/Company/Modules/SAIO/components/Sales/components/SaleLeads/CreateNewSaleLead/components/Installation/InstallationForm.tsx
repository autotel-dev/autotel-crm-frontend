
import { ChangeEvent, useEffect, useState } from "react";
import ShowError from "../../ShowError";
import {
    Button,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    InputGroup,
    Label,
    Modal,
    ModalBody,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H4, H5, P } from "../../../../../../../../../../../AbstractElements";
import { MdDelete } from "react-icons/md";
import FileAttachementComponent from "./components/FileAttachementComponent";
import { createWithMultipart, getAll, patchWithMultipart } from "../../../../../../../../../../../Utilities/api";
import { ERROR_MESSAGE } from "../../../../../../../../../../../Utilities/constants/constants";
import Swal from "sweetalert2";
import { COMPLETE_VEHICLE_INSTALLATION, GET_ALL_SALELEADS, GET_SINGLE_SALELEAD, IMAGE_BASE_URL } from "../../../../../../../../../../../Utilities/api/apiEndpoints";
import { setSaleLead, setSaleLeads } from "../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";

const InstallationForm = ({ onRemove, index, installationData, onChange, callbackActive }: any) => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const { saleLead } = useSelector(
        (state: any) => state.sales
    );
    const dispatch = useDispatch();
    console.log("instalationdata", installationData);

    const [formData, setFormData] = useState(installationData);
    const [isAddedInstallationImages, setIsAddedInstallationImages] = useState(false)
    const [loading, setLoading] = useState(false);

    const [addModal, setAddModal] = useState(false);
    const addToggle = () => {
        setAddModal(!addModal);
    };


    useEffect(() => {
        setFormData(installationData);
        setIsAddedInstallationImages(installationData.installationStatus == "INSTALLED")
    }, [installationData]);

    console.log("formData in iD", formData);


    const handleSelectChange = (name: string, value: any) => {
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        onChange(index, updatedFormData);
        console.log("FormData", formData);
    };

    const [imageUrl, setImageUrl] = useState("");
    const [isHoveredForVehicleFront, setIsHoveredForVehicleFront] = useState(false);
    const [isHoveredForVehicleBack, setIsHoveredForVehicleBack] =
        useState(false);
    const [isHoveredForTrackerlocation, setIsHoveredForTrackerLocation] = useState(false);
    const [isHoveredForOtherEvidence, setIsHoveredForOtherEvidence] =
        useState(false);

    const handleMouseEnterForVehicleFront = () => {
        setIsHoveredForVehicleFront(true);
    };
    const handleMouseLeaveForVehicleFront = () => {
        setIsHoveredForVehicleBack(false);
    };
    const handleMouseEnterForVehicleBack = () => {
        setIsHoveredForVehicleBack(true);
    };
    const handleMouseLeaveForVehicleBack = () => {
        setIsHoveredForVehicleBack(false);
    };
    const handleMouseLeaveForTrackerLocation = () => {
        setIsHoveredForTrackerLocation(false);
    };
    const handleMouseEnterForTrackerLocation = () => {
        setIsHoveredForTrackerLocation(true);
    };
    const handleMouseLeaveForOtherEvidence = () => {
        setIsHoveredForOtherEvidence(false);
    };
    const handleMouseEnterForOtherEvidence = () => {
        setIsHoveredForOtherEvidence(true);
    };

    const addInstallationImageToAVehicle = async () => {
        console.log("formData", formData);

        setLoading(true);
        if (
            formData.vehicleFront !== null &&
            formData.vehicleBack !== null && formData.trackerLocation !== null && formData.otherEvidence !== null
        ) {
            const bodyData = new FormData()
            bodyData.append("vehicleFront", formData.vehicleFront)
            bodyData.append("vehicleBack", formData.vehicleBack)
            bodyData.append("trackerLocation", formData.trackerLocation)
            bodyData.append("otherEvidence", formData.otherEvidence)
            bodyData.append("installationRemarks", formData.installationRemarks)
            bodyData.append("saleLeadId", saleLead._id)
            console.log("bodyData", bodyData);

            try {
                await patchWithMultipart(bodyData, { url: `${COMPLETE_VEHICLE_INSTALLATION}/${formData.vehicleId}` }).then((data: any) => {
                    if (data !== undefined) {
                        if (
                            !data.success &&
                            data.message === ERROR_MESSAGE
                        ) {
                            setLoading(false);
                            console.log("data.message", data.message);

                        }
                        if (!data.success) {
                            Swal.fire({
                                text: `${data.message}`,
                                icon: "error",
                                timer: 2000,
                                showConfirmButton: false,
                            });
                            setLoading(false);

                        }
                        if (data.success) {
                            // getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {
                            //     if (data !== undefined) {
                            //         if (!data.success) {
                            //             // setIscreateNewSaleLead(false)
                            //         }
                            //         if (data.success) {
                            //             // setLoading(false);
                            //             dispatch(setSaleLeads(data.data));
                            //         }
                            //     }
                            // });
                            getAll({ url: `${GET_SINGLE_SALELEAD}/${saleLead._id}` }).then((data: any) => {
                                if (data !== undefined) {
                                    if (!data.success) {
                                        setLoading(false);
                                    }
                                    if (data.success) {
                                        setLoading(false);
                                        dispatch(setSaleLead(data.data));
                                        if (data.data.vehicles.every((item: any) => item.installationStatus == "INSTALLED")) {
                                            callbackActive(6)

                                        } else {
                                            setIsAddedInstallationImages(true);
                                        }
                                    }
                                }
                            });
                            // setLoading(false);
                        }
                    }
                });
                // Handle successful post creation (e.g., show a success message, redirect, etc.)
            } catch (error: any) {
                // Handle error (e.g., show an error message)
                // console.error("Error creating post:", error);
                setLoading(false);
            }

        } else {
            ShowError();
            setLoading(false);
        }
    };


    return (
        <Form
            onSubmit={(event) => event.preventDefault()}
            className="needs-validation"
            noValidate
        >
            <Row>
                {
                    formData.vehicleFront !== "" && isAddedInstallationImages ? <Col xl={3} md={6}>
                        <P>Vehicle Front</P>

                        <div
                            style={{
                                position: "relative",
                                marginRight: "20px",
                            }}
                            onMouseEnter={() => handleMouseEnterForVehicleFront()}
                            onMouseLeave={() => handleMouseLeaveForVehicleFront()}
                            onClick={() => {
                                setImageUrl(
                                    `${IMAGE_BASE_URL}/${formData.vehicleFront}`
                                );
                                addToggle();
                            }}
                        >
                            <img
                                src={`${IMAGE_BASE_URL}/${formData.vehicleFront}`}
                                alt=""
                                height={200}
                                width={300}
                                style={{
                                    borderRadius: "10px",
                                    border: "0.5px solid lightgray",
                                }}
                            />
                            {isHoveredForVehicleFront && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "300px",
                                        height: "200px",
                                        background: "rgba(0, 0, 0, 0.7)", // Light black color with opacity
                                        borderRadius: "10px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "20px",
                                            color: "white",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        View Image
                                    </span>
                                </div>
                            )}
                        </div>
                    </Col> : <FileAttachementComponent
                        heading="Vehicle Front"
                        category="vehicleFront"
                        handleChange={handleSelectChange}
                        installationStatus={isAddedInstallationImages}
                    />
                }
                {formData.vehicleBack !== "" && isAddedInstallationImages ? <Col xl={3} md={6}>
                    <P>Vehicle Back</P>
                    <div
                        style={{
                            position: "relative",
                            marginRight: "20px",

                        }}
                        onMouseEnter={() => handleMouseEnterForVehicleBack()}
                        onMouseLeave={() => handleMouseLeaveForVehicleBack()}
                        onClick={() => {
                            setImageUrl(
                                `${IMAGE_BASE_URL}/${formData.vehicleBack}`
                            );
                            addToggle();
                        }}
                    >
                        <img
                            src={`${IMAGE_BASE_URL}/${formData.vehicleBack}`}
                            alt=""
                            height={200}
                            width={300}
                            style={{
                                borderRadius: "10px",
                                border: "0.5px solid lightgray",
                            }}
                        />
                        {isHoveredForVehicleBack && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "300px",
                                    height: "200px",
                                    background: "rgba(0, 0, 0, 0.7)", // Light black color with opacity
                                    borderRadius: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "20px",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    View Image
                                </span>
                            </div>
                        )}
                    </div>
                </Col> : <FileAttachementComponent
                    heading="Vehicle Front"
                    category="vehicleBack"
                    handleChange={handleSelectChange}
                    installationStatus={isAddedInstallationImages}
                />}
                {formData.trackerLocation !== "" && isAddedInstallationImages ? <Col xl={3} md={6}>
                    <P>Tracker Location</P>

                    <div
                        style={{
                            position: "relative",
                            marginRight: "20px",

                        }}
                        onMouseEnter={() => handleMouseEnterForTrackerLocation()}
                        onMouseLeave={() => handleMouseLeaveForTrackerLocation()}
                        onClick={() => {
                            setImageUrl(
                                `${IMAGE_BASE_URL}/${formData.trackerLocation}`
                            );
                            addToggle();
                        }}
                    >
                        <img
                            src={`${IMAGE_BASE_URL}/${formData.trackerLocation}`}
                            alt=""
                            height={200}
                            width={300}
                            style={{
                                borderRadius: "10px",
                                border: "0.5px solid lightgray",
                            }}
                        />
                        {isHoveredForTrackerlocation && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "300px",
                                    height: "200px",
                                    background: "rgba(0, 0, 0, 0.7)", // Light black color with opacity
                                    borderRadius: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "20px",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    View Image
                                </span>
                            </div>
                        )}
                    </div>
                </Col> : <FileAttachementComponent
                    heading="Tracker Location"
                    category="trackerLocation"
                    handleChange={handleSelectChange}
                    installationStatus={isAddedInstallationImages}
                />}
                {formData.otherEvidence !== "" && isAddedInstallationImages ? <Col xl={3} md={6}>
                    <P>Other Evidence</P>

                    <div
                        style={{
                            position: "relative",
                            marginRight: "20px",

                        }}
                        onMouseEnter={() => handleMouseEnterForOtherEvidence()}
                        onMouseLeave={() => handleMouseLeaveForOtherEvidence()}
                        onClick={() => {
                            setImageUrl(
                                `${IMAGE_BASE_URL}/${formData.otherEvidence}`
                            );
                            addToggle();
                        }}
                    >
                        <img
                            src={`${IMAGE_BASE_URL}/${formData.otherEvidence}`}
                            alt=""
                            height={200}
                            width={300}
                            style={{
                                borderRadius: "10px",
                                border: "0.5px solid lightgray",
                            }}
                        />
                        {isHoveredForOtherEvidence && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "300px",
                                    height: "200px",
                                    background: "rgba(0, 0, 0, 0.7)", // Light black color with opacity
                                    borderRadius: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "20px",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    View Image
                                </span>
                            </div>
                        )}
                    </div>
                </Col> : <FileAttachementComponent
                    heading="Other Evidence"
                    category="otherEvidence"
                    handleChange={handleSelectChange}
                    installationStatus={isAddedInstallationImages}
                />}

                <Col xl={12} xs={12} style={{ marginTop: "20px" }}>
                    <div>
                        <P>
                            Enter Remarks
                        </P>
                    </div>
                    <textarea
                        className="form-control"
                        placeholder="Enter Remarks"
                        rows={2}
                        value={formData.installationRemarks}
                        name="installationRemarks"
                        onChange={(e) => handleSelectChange("installationRemarks", e.target.value)}
                        disabled={isAddedInstallationImages}
                    />
                </Col>


                <Modal
                    isOpen={addModal}
                    toggle={addToggle}
                    size="lg"
                    centered
                >
                    <ModalBody>
                        <div>
                            <div className="modal-header"></div>
                            <img
                                src={imageUrl}
                                alt=""
                                height={500}
                                width="100%"
                            />
                        </div>
                    </ModalBody>
                </Modal>
            </Row>
            <Row className="g-3" style={{ marginTop: "15px" }}>
                <Col
                    xs={12}
                    className="text-end d-flex justify-content-end gap-2 align-center"
                >
                    {
                        <Button disabled={isAddedInstallationImages || loading} color="primary" onClick={() => !isAddedInstallationImages ? addInstallationImageToAVehicle() : null}>
                            {loading ? "Loading..." : "Installed"}
                        </Button>
                    }

                </Col>
            </Row>


        </Form >
    );
};

export default InstallationForm;






















