import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomer, setSaleLead, setSaleLeadId, setSaleLeads } from '../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice';
import { H3, H4 } from '../../../../../../../../../../../AbstractElements';
import SecurityBreifingDetails from './SecurityBreifingDetails';
import { getAll, update } from '../../../../../../../../../../../Utilities/api';
import { ATTACH_SECURITY_BRIEFING, GET_ALL_SALELEADS, GET_SINGLE_SALELEAD } from '../../../../../../../../../../../Utilities/api/apiEndpoints';
import { ERROR_MESSAGE } from '../../../../../../../../../../../Utilities/constants/constants';
import Swal from 'sweetalert2';
import ShowError from '../../ShowError';

interface InventoryDetailsListProps {
    callbackActive: (val: number | undefined) => void;
    iscreateNewSaleLead: boolean;
    setIscreateNewSaleLead: any;
}

const SecurityBriefingDetailsList = ({ callbackActive, iscreateNewSaleLead, setIscreateNewSaleLead }: InventoryDetailsListProps) => {
    const { saleLead } = useSelector((state: any) => state.sales);
    const [securityBriefingForms, setSecurityBriefingForms] = useState<any[]>([]);
    const [selectedVehicles, setSelectedVehicles] = useState<any[]>([]);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (saleLead) {
            const vehicleOptions = saleLead.vehicles.map((vehicle: any) => ({
                title: vehicle.registrationNo,
                value: vehicle.registrationNo,
                id: vehicle._id,
                checked: vehicle.installationStatus == "INSTALLED" ? true : false,
                vehicleData: vehicle
            }));
            setSelectedVehicles(vehicleOptions);

            // Initialize inventory forms with the already selected vehicles
            const initializedForms = vehicleOptions
                .filter((vehicle: any) => vehicle.checked)
                .map((vehicle: any) => ({
                    vehicleId: vehicle.id,
                    username: vehicle.vehicleData?.securityBriefing?.authenticationCredentials?.username !== undefined || vehicle.vehicleData?.securityBriefing?.authenticationCredentials?.username !== "" ? vehicle.vehicleData?.securityBriefing?.authenticationCredentials?.username : "",
                    password: vehicle.vehicleData?.securityBriefing?.authenticationCredentials?.password !== undefined || vehicle.vehicleData?.securityBriefing?.authenticationCredentials?.password !== "" ? vehicle.vehicleData?.securityBriefing?.authenticationCredentials?.password : "",
                    normalPassword: vehicle.vehicleData?.securityBriefing?.normalPassword !== undefined || vehicle.vehicleData?.securityBriefing?.normalPassword !== "" ? vehicle.vehicleData?.securityBriefing?.normalPassword : "",
                    emergencyPassword: vehicle.vehicleData?.securityBriefing?.emergencyPassword !== undefined || vehicle.vehicleData?.securityBriefing?.emergencyPassword !== "" ? vehicle.vehicleData?.securityBriefing?.emergencyPassword : "",
                    motherName: vehicle.vehicleData?.securityBriefing?.motherName !== undefined || vehicle.vehicleData?.securityBriefing?.motherName !== "" ? vehicle.vehicleData?.securityBriefing?.motherName : "",
                    vehicleValue: vehicle.value,
                    vehicleData: vehicle
                }));
            setSecurityBriefingForms(initializedForms);
        }
    }, [saleLead]);

    const handleFormDataChange = (index: number, newData: any) => {
        const updatedForms = securityBriefingForms.map((form: any, i: number) =>
            i === index ? { ...form, ...newData } : form
        );
        setSecurityBriefingForms(updatedForms);
        console.log("securityBriefingForms", securityBriefingForms);

    };

    const handleFormDataChangeForAll = (newData: any) => {
        const updatedForms = securityBriefingForms.map((form: any, i: number) => {
            return {
                ...form,
                username: newData.username,
                password: newData.password,
                normalPassword: newData.normalPassword,
                emergencyPassword: newData.emergencyPassword,
                motherName: newData.motherName,
            }
        }
        );
        setSecurityBriefingForms(updatedForms);
        console.log("securityBriefingForms", securityBriefingForms);

    };

    useEffect(() => {
        // Update inventoryForms based on selectedVehicles
        const newForms = selectedVehicles
            .filter(vehicle => vehicle.checked)
            .filter(vehicle => !securityBriefingForms.find(form => form.vehicleValue === vehicle.value)) // Ensure not to duplicate forms
            .map(vehicle => ({
                vehicleId: vehicle.id,
                username: "",
                password: "",
                normalPassword: "",
                emergencyPassword: "",
                motherName: "",
                vehicleValue: vehicle.value,
            }));

        // Remove forms for unselected vehicles
        const removedForms = securityBriefingForms
            .filter(form => !selectedVehicles.find(vehicle => vehicle.value === form.vehicleValue && vehicle.checked));

        // Update inventoryForms with new forms and remove old ones
        setSecurityBriefingForms(prevForms => [
            ...prevForms.filter(form => !removedForms.find(removedForm => removedForm.vehicleValue === form.vehicleValue)),
            ...newForms
        ]);

        // setInventoryForms(prevForms => [...prevForms, ...newForms]);
    }, [selectedVehicles]);

    const handleVehiclesChange = (index: number) => {
        const updatedVehicles = selectedVehicles.map((vehicle, i) =>
            i === index ? { ...vehicle, checked: !vehicle.checked } : vehicle
        );
        setSelectedVehicles(updatedVehicles);
        console.log("updatedVehicles", updatedVehicles)

    };
    const handleSelectAllvehiclesChange = () => {
        const updatedVehicles = selectedVehicles.map((vehicle, i) => { return { ...vehicle, checked: true } }
        );
        setSelectedVehicles(updatedVehicles);
        console.log("updatedVehicles", updatedVehicles)

    };



    const attachSecurityBreifing = async () => {
        setLoading(true);
        if (
            securityBriefingForms.every((vehicle: any) => vehicle.username !== "" && vehicle.password !== "")
        ) {

            const securityBriefingData = [...securityBriefingForms.map((formData: any) => {
                return {
                    vehicleId: formData.vehicleId,
                    securityBriefing: {
                        authenticationCredentials: {
                            username: formData.username,
                            password: formData.password
                        },
                        emergencyPassword
                            :
                            formData.emergencyPassword,
                        motherName
                            :
                            formData.motherName,
                        normalPassword
                            :
                            formData.normalPassword,
                    }
                }
            })]

            try {
                await update({ securityBriefingData: securityBriefingData }, { url: ATTACH_SECURITY_BRIEFING }).then((data: any) => {
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
                            getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {
                                if (data !== undefined) {
                                    if (!data.success) {
                                        // setIscreateNewSaleLead(false)
                                    }
                                    if (data.success) {
                                        setLoading(false);
                                        dispatch(setSaleLeads(data.data));

                                        getAll({ url: `${GET_SINGLE_SALELEAD}/${saleLead._id}` }).then((data: any) => {
                                            if (data !== undefined) {
                                                if (data.success) {
                                                    dispatch(setSaleLead(data.data));
                                                    // dispatch(setSaleLead(null));
                                                    // if (data.data.vehicles.length == data.data.totalNoOfVehicles) {
                                                    setIscreateNewSaleLead(false)
                                                }
                                            }
                                        });
                                    }
                                }
                            });

                            setLoading(false);
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
        <Container>
            <Row style={{ display: "flex", flexWrap: "wrap", marginTop: "30px", marginBottom: "30px" }}>
                <H4>Select Vehicle</H4>
                <div style={{ height: "20px" }}></div>
                <label
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        position: "relative",
                        cursor: "pointer",
                        marginRight: "20px",
                        fontSize: "18px",
                        marginBottom: "15px"
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <input
                        type="checkbox"
                        name="key"
                        checked={selectedVehicles.every((v, i) => v.checked)}
                        onChange={() => handleSelectAllvehiclesChange()}
                        style={{ display: "none" }}
                    />
                    <span onClick={(e) => e.stopPropagation()} className="green"></span>
                    <span style={{ marginTop: "5px" }}>Select All</span>
                </label>
                <div style={{ height: "20px" }}></div>

                {selectedVehicles.map((item, index) =>
                    <Col sm={3} key={index}>
                        <label
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                position: "relative",
                                cursor: "pointer",
                                marginRight: "20px",
                                fontSize: "18px",
                                marginBottom: "15px"
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <input
                                type="checkbox"
                                name="key"
                                value={item.value}
                                checked={item.checked}
                                onChange={() => handleVehiclesChange(index)}
                                style={{ display: "none" }}
                            />
                            <span onClick={(e) => e.stopPropagation()} className="green"></span>
                            <span style={{ marginTop: "5px" }}>{item.title}</span>
                        </label>
                    </Col>
                )}
                <div style={{ margin: "0px 0px", height: "8px", borderBottom: "2px solid gray", borderTop: "2px solid gray" }}></div>
            </Row>
            {securityBriefingForms.map((formData, index) => (
                <React.Fragment key={index}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <H3>Registration Number : {formData.vehicleValue}</H3>
                        {securityBriefingForms[0].username !== "" &&
                            securityBriefingForms[0].password !== "" &&
                            securityBriefingForms[0].normalPassword !== "" &&
                            securityBriefingForms[0].emergencyPassword !== "" &&
                            securityBriefingForms[0].motherName !== "" && saleLead?.vehicles.length > 1 && index == 0 &&
                            <Button color="primary"
                                onClick={() => handleFormDataChangeForAll(securityBriefingForms[0])}
                            >
                                Reuse For All
                            </Button>}
                    </div>
                    <div style={{ height: "20px" }}></div>
                    <SecurityBreifingDetails
                        index={index}
                        securityBriefingData={formData}
                        onChange={handleFormDataChange}
                        onRemove={() => setSecurityBriefingForms(securityBriefingForms.filter((_, i) => i !== index))}
                        callbackActive={callbackActive}
                        iscreateNewSaleLead={iscreateNewSaleLead}
                        setIscreateNewSaleLead={setIscreateNewSaleLead}
                    />
                    <div style={{ padding: index === securityBriefingForms.length - 1 ? "10px 0px 15px 0px" : "25px 0px 35px 0px" }}>
                        <div style={{ margin: "0px 0px", height: "8px", borderBottom: "2px solid gray", borderTop: "2px solid gray" }}></div>
                    </div>
                </React.Fragment>
            ))}
            <Col xs={12} className="text-end d-flex justify-content-end gap-2 align-center">
                <Button color="secondary" onClick={() => { dispatch(setSaleLead(null)); dispatch(setCustomer(null)); dispatch(setSaleLeadId("")); setIscreateNewSaleLead(false) }}>
                    Cancel
                </Button>
                {saleLead?.vehicles?.every((item: any) => (item?.securityBriefing?.authenticationCredentials?.username !== "") && (item?.securityBriefing?.authenticationCredentials?.password !== "")) ? <Button color="primary" onClick={() => callbackActive(7)}>
                    Next
                </Button> : <Button color="primary" onClick={attachSecurityBreifing}>
                    Attach Security Briefing
                </Button>}
            </Col>
        </Container>
    );
};

export default SecurityBriefingDetailsList;




