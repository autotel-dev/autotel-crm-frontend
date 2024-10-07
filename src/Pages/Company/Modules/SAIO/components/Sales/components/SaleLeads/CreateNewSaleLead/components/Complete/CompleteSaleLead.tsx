import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomer, setSaleLead, setSaleLeadId, setSaleLeads } from '../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice';
import { H3, H4 } from '../../../../../../../../../../../AbstractElements';
import { getAll, patch, update } from '../../../../../../../../../../../Utilities/api';
import { ATTACH_SECURITY_BRIEFING, COMPLETE_SALE_LEAD, GET_ALL_SALELEADS, GET_SINGLE_SALELEAD } from '../../../../../../../../../../../Utilities/api/apiEndpoints';
import { ERROR_MESSAGE } from '../../../../../../../../../../../Utilities/constants/constants';
import Swal from 'sweetalert2';
import ShowError from '../../ShowError';
import { useNavigate } from 'react-router-dom';
import { formatUnderscoredString } from '../../../../../../../../../../../Utilities/globals/globals';

interface CompleteSaleLeadProps {
    callbackActive: (val: number | undefined) => void;
}

const CompleteSaleLead = ({ callbackActive }: CompleteSaleLeadProps) => {
    const { saleLead } = useSelector((state: any) => state.sales);
    const [installedVehicleForms, setInstalledVehiclesForms] = useState<any[]>([]);
    const [selectedVehicles, setSelectedVehicles] = useState<any[]>([]);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (saleLead) {
            const vehicleOptions = saleLead.vehicles.map((vehicle: any) => ({
                title: vehicle.registrationNo,
                value: vehicle.registrationNo,
                id: vehicle._id,
                checked: vehicle.installationStatus == "INSTALLED" ? true : false,
                vehicleData: vehicle,
                installationStatus: vehicle.installationStatus
            }));
            setSelectedVehicles(vehicleOptions);

            // Initialize inventory forms with the already selected vehicles
            const initializedForms = vehicleOptions
                .filter((vehicle: any) => vehicle.checked)
                .map((vehicle: any) => ({
                    vehicleId: vehicle.id,
                    vehicleValue: vehicle.value,
                    vehicleData: vehicle,
                    installationStatus: vehicle.installationStatus
                }));
            setInstalledVehiclesForms(initializedForms);
        }
    }, [saleLead]);



    useEffect(() => {
        // Update inventoryForms based on selectedVehicles
        const newForms = selectedVehicles
            .filter(vehicle => vehicle.checked)
            .filter(vehicle => !installedVehicleForms.find(form => form.vehicleValue === vehicle.value)) // Ensure not to duplicate forms
            .map(vehicle => ({
                vehicleId: vehicle.id,
                vehicleValue: vehicle.value,
                vehicleData: vehicle,
                installationStatus: vehicle.installationStatus
            }));

        // Remove forms for unselected vehicles
        const removedForms = installedVehicleForms
            .filter(form => !selectedVehicles.find(vehicle => vehicle.value === form.vehicleValue && vehicle.checked));

        // Update inventoryForms with new forms and remove old ones
        setInstalledVehiclesForms(prevForms => [
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

    const completeSaleLead = async () => {
        setLoading(true);
        if (
            saleLead?.vehicles?.every((item: any) => item.installationStatus == "INSTALLED")
        ) {
            try {
                await patch({}, { url: `${COMPLETE_SALE_LEAD}/${saleLead._id}` }).then((data: any) => {
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
                                        setLoading(false);
                                    }
                                    if (data.success) {
                                        dispatch(setSaleLeads(data.data));
                                        setLoading(false);
                                        navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads`);

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
        <Container>
            <Row style={{ display: "flex", flexWrap: "wrap", marginTop: "10px", marginBottom: "20px" }}>
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
                        disabled={saleLead?.status == "COMPLETED" || saleLead?.vehicles?.every((item: any) => item.installationStatus == "INSTALLED")}
                        onChange={() => handleSelectAllvehiclesChange()}
                        style={{ display: "none" }}
                    />
                    <span onClick={(e) => e.stopPropagation()} className="green"></span>
                    <span style={{ marginTop: "5px" }}>Select All</span>
                </label>
                <div style={{ height: "5px" }}></div>

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
                                disabled={saleLead?.status == "COMPLETED" || saleLead?.vehicles?.every((item: any) => item.installationStatus == "INSTALLED")}
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
            {installedVehicleForms.map((formData, index) => (
                <React.Fragment key={index}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <H4>Registration Number : {formData.vehicleValue}</H4>
                        <H4>{formData.vehicleData.installationStatus}</H4>
                    </div>
                    <div style={{ height: "5px" }}></div>

                    <div style={{ padding: "15px 0px 25px 0px" }}>
                        <div style={{ margin: "0px 0px", height: "8px", borderBottom: "2px solid gray", borderTop: "2px solid gray" }}></div>
                    </div>
                </React.Fragment>
            ))}
            <Col xs={12} className="text-end d-flex justify-content-end gap-2 align-center">
                <Button color="secondary" onClick={() => { dispatch(setSaleLead(null)); dispatch(setCustomer(null)); dispatch(setSaleLeadId("")); navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads`) }}>
                    Cancel
                </Button>
                {saleLead?.vehicles?.every((item: any) => item.installationStatus == "INSTALLED") && < Button color="primary" disabled={loading || saleLead?.status == "COMPLETED"} onClick={completeSaleLead} >
                    {loading ? "Loading..." : saleLead?.status == "COMPLETED" ? formatUnderscoredString(saleLead?.status) : "Complete Lead"}
                </Button>}
            </Col>
        </Container>
    );
};

export default CompleteSaleLead;




