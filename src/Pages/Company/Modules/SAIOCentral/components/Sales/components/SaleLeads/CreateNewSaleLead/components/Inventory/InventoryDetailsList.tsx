import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomer, setSaleLead, setSaleLeadId } from '../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice';
import InventoryDetails from './InventoryDetails';
import { H3, H4 } from '../../../../../../../../../../../AbstractElements';

interface InventoryDetailsListProps {
    callbackActive: (val: number | undefined) => void;
    iscreateNewSaleLead: boolean;
    setIscreateNewSaleLead: any;
}

const InventoryDetailsList = ({ callbackActive, iscreateNewSaleLead, setIscreateNewSaleLead }: InventoryDetailsListProps) => {
    const { saleLead } = useSelector((state: any) => state.sales);
    const [inventoryForms, setInventoryForms] = useState<any[]>([]);
    const [selectedVehicles, setSelectedVehicles] = useState<any[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (saleLead) {
            const vehicleOptions = saleLead.vehicles.map((vehicle: any) => ({
                title: vehicle?.registrationNo,
                value: vehicle?.registrationNo,
                id: vehicle?._id,
                installer: vehicle?.installer,
                checked: vehicle?.inventory?.length == 0 ? false : true,
                inventory: vehicle?.inventory,
                vehicleData: vehicle
            }));
            setSelectedVehicles(vehicleOptions);



            // Initialize inventory forms with the already selected vehicles
            const initializedForms = vehicleOptions
                .filter((vehicle: any) => vehicle.checked)
                .map((vehicle: any) => ({
                    installer: vehicle.installer !== null || vehicle.installer !== "" ? vehicle.installer : "",
                    deviceIMEI: vehicle?.inventory?.find((item: any) => item.productType == "DEVICES") ? vehicle?.inventory?.find((item: any) => item.productType == "DEVICES").serialNumber : "",
                    deviceId: vehicle?.inventory?.find((item: any) => item.productType == "DEVICES") ? vehicle?.inventory?.find((item: any) => item.productType == "DEVICES")._id : "",
                    deviceType: vehicle?.inventory?.find((item: any) => item.productType == "DEVICES") ? vehicle?.inventory?.find((item: any) => item.productType == "DEVICES").productType : "",
                    deviceID: vehicle?.inventory?.find((item: any) => item.productType == "DEVICES") ? vehicle?.inventory?.find((item: any) => item.productType == "DEVICES").sku : "",
                    sims: vehicle?.inventory?.find((item: any) => item.productType == "SIM") ? [...vehicle?.inventory?.filter((item: any) => item.productType == "SIM").map((item: any) => { return { id: item._id, simNumber: item.serialNumber, iccid: item.sku, network: item.productName } })] : [],
                    sensors: vehicle?.inventory?.find((item: any) => item.productType == "SENSORS") ? [...vehicle?.inventory?.filter((item: any) => item.productType == "SENSORS").map((item: any) => { return { id: item._id, serialNumber: item.serialNumber, sku: item.sku, type: item.productType } })] : [],
                    accessories: vehicle?.inventory?.find((item: any) => item.productType == "ACCESSORIES") ? [...vehicle?.inventory?.filter((item: any) => item.productType == "ACCESSORIES").map((item: any) => { return { id: item._id, serialNumber: item.serialNumber, sku: item.sku, type: item.productType } })] : [],
                    vehicleValue: vehicle.value,
                    vehicleId: vehicle.id,
                    vehicleData: vehicle.vehicleData
                }));
            setInventoryForms(initializedForms);
        }
    }, [saleLead]);

    const handleFormDataChange = (index: number, newData: any) => {
        const updatedForms = inventoryForms.map((form: any, i: number) =>
            i === index ? newData : form
        );
        setInventoryForms(updatedForms);
        console.log("inventoryForms", inventoryForms);

    };

    useEffect(() => {
        // Update inventoryForms based on selectedVehicles
        const newForms = selectedVehicles
            .filter(vehicle => vehicle.checked)
            .filter(vehicle => !inventoryForms.find(form => form.vehicleValue === vehicle.value)) // Ensure not to duplicate forms
            .map(vehicle => ({
                installer: vehicle.installer !== null || vehicle.installer !== "" ? vehicle.installer : "",
                deviceIMEI: "",
                deviceId: "",
                deviceType: "",
                deviceID: "",
                sims: [],
                sensors: [],
                accessories: [],
                vehicleValue: vehicle.value,
                vehicleId: vehicle.id,
                vehicleData: vehicle.vehicleData
            }));

        // Remove forms for unselected vehicles
        const removedForms = inventoryForms
            .filter(form => !selectedVehicles.find(vehicle => vehicle.value === form.vehicleValue && vehicle.checked));

        // Update inventoryForms with new forms and remove old ones
        setInventoryForms(prevForms => [
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
        console.log("updatedVehicles", updatedVehicles);
        console.log("inventoryForms", inventoryForms);

    };

    return (
        <Container>
            <Row style={{ display: "flex", flexWrap: "wrap", marginTop: "30px", marginBottom: "30px" }}>
                <H4>Select Vehicle</H4>
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
            {inventoryForms.map((formData, index) => (
                <React.Fragment key={index}>
                    <H3>Registration Number : {formData.vehicleValue}</H3>
                    <div style={{ marginBottom: "25px" }}></div>
                    <InventoryDetails
                        index={index}
                        inventoryData={formData}
                        onChange={handleFormDataChange}
                        onRemove={() => setInventoryForms(inventoryForms.filter((_, i) => i !== index))}
                        callbackActive={callbackActive}
                        iscreateNewSaleLead={iscreateNewSaleLead}
                        setIscreateNewSaleLead={setIscreateNewSaleLead}
                    />
                    <div style={{ padding: index === inventoryForms.length - 1 ? "10px 0px 15px 0px" : "25px 0px 35px 0px" }}>
                        <div style={{ margin: "0px 0px", height: "8px", borderBottom: "2px solid gray", borderTop: "2px solid gray" }}></div>
                    </div>
                </React.Fragment>
            ))}
            <Col xs={12} className="text-end d-flex justify-content-end gap-2 align-center">
                <Button color="secondary" onClick={() => { dispatch(setSaleLead(null)); dispatch(setCustomer(null)); dispatch(setSaleLeadId("")); setIscreateNewSaleLead(false) }}>
                    Cancel
                </Button>
                {saleLead?.vehicles?.length > 0 && <Button color="primary" onClick={() => callbackActive(5)}>
                    Next
                </Button>}
            </Col>
        </Container>
    );
};

export default InventoryDetailsList;




