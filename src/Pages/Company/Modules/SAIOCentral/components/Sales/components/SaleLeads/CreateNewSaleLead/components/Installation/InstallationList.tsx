import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomer, setSaleLead, setSaleLeadId } from '../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice';
import { H3, H4 } from '../../../../../../../../../../../AbstractElements';
import InstallationForm from './InstallationForm';

interface InstallationListProps {
    callbackActive: (val: number | undefined) => void;
    iscreateNewSaleLead: boolean;
    setIscreateNewSaleLead: any;
}

const InstallationList = ({ callbackActive, iscreateNewSaleLead, setIscreateNewSaleLead }: InstallationListProps) => {
    const { saleLead } = useSelector((state: any) => state.sales);
    const [installationForms, setInstallationForms] = useState<any[]>([]);
    const [selectedVehicles, setSelectedVehicles] = useState<any[]>([]);
    const dispatch = useDispatch();
    console.log("instalationdata",);
    

    useEffect(() => {
        if (saleLead) {
            const vehicleOptions = saleLead.vehicles.map((vehicle: any) => ({
                title: vehicle.registrationNo,
                value: vehicle.registrationNo,
                checked: vehicle.installationStatus == "INSTALLED" ? true : false,
                id: vehicle?._id,
                vehicleData: vehicle
            }));
            setSelectedVehicles(vehicleOptions);

            // Initialize forms with the already selected vehicles
            const initializedForms = vehicleOptions
                .filter((vehicle: any) => vehicle.checked)
                .map((vehicle: any) => ({
                    vehicleFront: vehicle?.vehicleData?.vehicleFront?.url !== "" ? vehicle?.vehicleData?.vehicleFront?.url : "",
                    vehicleBack: vehicle?.vehicleData?.vehicleBack?.url !== "" ? vehicle?.vehicleData?.vehicleBack?.url : "",
                    trackerLocation: vehicle?.vehicleData?.trackerLocation?.url !== "" ? vehicle?.vehicleData?.trackerLocation?.url : "",
                    otherEvidence: vehicle?.vehicleData?.otherEvidence?.url !== "" ? vehicle?.vehicleData?.otherEvidence?.url : "",
                    installationRemarks: vehicle.vehicleData?.installationRemarks !== "" ? vehicle.vehicleData?.installationRemarks : "",
                    vehicleValue: vehicle.value,
                    vehicleId: vehicle.id,
                    installationStatus: vehicle.vehicleData.installationStatus
                }));
            setInstallationForms(initializedForms);
        }
    }, [saleLead]);

    const handleFormDataChange = (index: number, newData: any) => {
        const updatedForms = installationForms.map((form, i) =>
            i === index ? newData : form
        );
        setInstallationForms(updatedForms);
        console.log("installationForms", installationForms);
    };

    useEffect(() => {
        const newForms = selectedVehicles
            .filter(vehicle => vehicle.checked && !installationForms.some(form => form.vehicleValue === vehicle.value))
            .map(vehicle => ({
                vehicleFront: "",
                vehicleBack: "",
                trackerLocation: "",
                otherEvidence: "",
                installationRemarks: "",
                vehicleValue: vehicle.value,
                vehicleId: vehicle.id
            }));

        // Remove forms for unselected vehicles
        const updatedForms = installationForms.filter(form =>
            selectedVehicles.some(vehicle => vehicle.value === form.vehicleValue && vehicle.checked)
        );

        setInstallationForms([...updatedForms, ...newForms]);
    }, [selectedVehicles]);

    const handleVehiclesChange = (index: number) => {
        const updatedVehicles = selectedVehicles.map((vehicle, i) =>
            i === index ? { ...vehicle, checked: !vehicle.checked } : vehicle
        );
        setSelectedVehicles(updatedVehicles);
        console.log("updatedVehicles", updatedVehicles);
    };

    return (
        <Container>
            <Row style={{ display: "flex", flexWrap: "wrap", marginTop: "10px", marginBottom: "20px" }}>
                <H4>Select Vehicle</H4>
                <div style={{ height: "10px" }}></div>
                {selectedVehicles.map((item, index) => (
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
                ))}
                <div style={{ margin: "0px 0px", height: "8px", borderBottom: "2px solid gray", borderTop: "2px solid gray" }}></div>
            </Row>
            {installationForms.map((formData, index) => (
                <React.Fragment key={index}>
                    <H4>Registration Number : {formData.vehicleValue}</H4>
                    <div style={{ marginBottom: "15px" }}></div>
                    <InstallationForm
                        index={index}
                        installationData={formData}
                        onChange={handleFormDataChange}
                        onRemove={() => setInstallationForms(installationForms.filter((_, i) => i !== index))}
                        callbackActive={callbackActive}
                        iscreateNewSaleLead={iscreateNewSaleLead}
                        setIscreateNewSaleLead={setIscreateNewSaleLead}
                    />
                    <div style={{ padding: index === installationForms.length - 1 ? "10px 0px 15px 0px" : "25px 0px 35px 0px" }}>
                        <div style={{ margin: "0px 0px", height: "8px", borderBottom: "2px solid gray", borderTop: "2px solid gray" }}></div>
                    </div>
                </React.Fragment>
            ))}
            <Col xs={12} className="text-end d-flex justify-content-end gap-2 align-center">
                <Button color="secondary" onClick={() => { dispatch(setSaleLead(null)); dispatch(setCustomer(null)); dispatch(setSaleLeadId("")); setIscreateNewSaleLead(false) }}>
                    Cancel
                </Button>
                {saleLead?.vehicles?.some((vehicle: any) => vehicle.installationStatus == "INSTALLED") && <Button color="primary" onClick={() => callbackActive(6)}>
                    Next
                </Button>}
            </Col>
        </Container>
    );
};

export default InstallationList;
