import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  setCustomer,
  setSaleLead,
  setSaleLeadId,
} from "../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import InventoryDetails from "./InventoryDetails";
import { H3, H4, P } from "../../../../../../../../../../../AbstractElements";
import { useNavigate } from "react-router-dom";

interface InventoryDetailsListProps {
  callbackActive: (val: number | undefined) => void;
}

const InventoryDetailsList = ({
  callbackActive,
}: InventoryDetailsListProps) => {
  const { saleLead } = useSelector((state: any) => state.sales);
  const [inventoryForms, setInventoryForms] = useState<any[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<any[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("saleLead?.vehicles", saleLead?.vehicles);

    if (saleLead) {
      const vehicleOptions = saleLead?.vehicles?.map((vehicle: any) => ({
        title: vehicle?.registrationNo,
        value: vehicle?.registrationNo,
        id: vehicle?._id,
        installer: vehicle?.installer,
        checked: vehicle?.inventory?.length == 0 ? false : true,
        inventory: vehicle?.inventory,
        vehicleData: vehicle,
      }));
      setSelectedVehicles(vehicleOptions);
      // Initialize inventory forms with the already selected vehicles
      const initializedForms = vehicleOptions
        .filter((vehicle: any) => vehicle.checked)
        .map((vehicle: any) => ({
          installer:
            vehicle.installer !== null || vehicle.installer !== ""
              ? vehicle.installer
              : "",
          // deviceIMEI: vehicle?.inventory?.find((item: any) => item.productType == "DEVICES") ? vehicle?.inventory?.find((item: any) => item.productType == "DEVICES").serialNumber : "",
          // deviceId: vehicle?.inventory?.find((item: any) => item.productType == "DEVICES") ? vehicle?.inventory?.find((item: any) => item.productType == "DEVICES").product : "",
          // deviceType: vehicle?.inventory?.find((item: any) => item.productType == "DEVICES") ? vehicle?.inventory?.find((item: any) => item.productType == "DEVICES").productType : "",
          // deviceID: vehicle?.inventory?.find((item: any) => item.productType == "DEVICES") ? vehicle?.inventory?.find((item: any) => item.productType == "DEVICES").sku : "",

          devices: vehicle?.inventory?.find(
            (item: any) => item.productType == "DEVICES"
          )
            ? [
                ...vehicle?.inventory
                  ?.filter((item: any) => item.productType == "DEVICES")
                  .map((item: any) => {
                    return {
                      id: item._id,
                      imeiNumber: item.serialNumber,
                      deviceType: item.productType,
                      deviceId: item.sku,
                      product: item.product,
                    };
                  }),
              ]
            : [],
          sims: vehicle?.inventory?.find(
            (item: any) => item.productType == "SIM"
          )
            ? [
                ...vehicle?.inventory
                  ?.filter((item: any) => item.productType == "SIM")
                  .map((item: any) => {
                    return {
                      id: item._id,
                      simNumber: item.serialNumber,
                      iccid: item.sku,
                      network: item.productName,
                      product: item.product,
                    };
                  }),
              ]
            : [],
          sensors: vehicle?.inventory?.find(
            (item: any) => item.productType == "SENSORS"
          )
            ? [
                ...vehicle?.inventory
                  ?.filter((item: any) => item.productType == "SENSORS")
                  .map((item: any) => {
                    return {
                      id: item._id,
                      serialNumber: item.serialNumber,
                      sku: item.sku,
                      type: item.productType,
                      product: item.product,
                    };
                  }),
              ]
            : [],
          accessories: vehicle?.inventory?.find(
            (item: any) => item.productType == "ACCESSORIES"
          )
            ? [
                ...vehicle?.inventory
                  ?.filter((item: any) => item.productType == "ACCESSORIES")
                  .map((item: any) => {
                    return {
                      id: item._id,
                      serialNumber: item.serialNumber,
                      sku: item.sku,
                      type: item.productType,
                      name: item.productName,
                      product: item.product,
                    };
                  }),
              ]
            : [],
          vehicleValue: vehicle.value,
          inventory: vehicle?.inventory,
          vehicleId: vehicle.id,
          vehicleData: vehicle.vehicleData,
        }));
      setInventoryForms(initializedForms);
    }
  }, [saleLead]);

  const handleFormDataChange = (index: number, newData: any) => {
    const updatedForms = inventoryForms.map((form: any, i: number) =>
      i === index ? newData : form
    );
    setInventoryForms(updatedForms);
    // console.log("inventoryForms", inventoryForms);
  };

  useEffect(() => {
    // Update inventoryForms based on selectedVehicles
    const newForms = selectedVehicles
      .filter((vehicle) => vehicle.checked)
      .filter(
        (vehicle) =>
          !inventoryForms.find((form) => form.vehicleValue === vehicle.value)
      ) // Ensure not to duplicate forms
      .map((vehicle) => ({
        installer:
          vehicle.installer !== null || vehicle.installer !== ""
            ? vehicle.installer
            : "",
        deviceIMEI: "",
        deviceId: "",
        deviceType: "",
        deviceID: "",
        devices: [],
        sims: [],
        sensors: [],
        accessories: [],
        vehicleValue: vehicle.value,
        inventory: [],
        vehicleId: vehicle.id,
        vehicleData: vehicle.vehicleData,
      }));

    // Remove forms for unselected vehicles
    const removedForms = inventoryForms.filter(
      (form) =>
        !selectedVehicles.find(
          (vehicle) => vehicle.value === form.vehicleValue && vehicle.checked
        )
    );

    // Update inventoryForms with new forms and remove old ones
    setInventoryForms((prevForms) => [
      ...prevForms.filter(
        (form) =>
          !removedForms.find(
            (removedForm) => removedForm.vehicleValue === form.vehicleValue
          )
      ),
      ...newForms,
    ]);

    // setInventoryForms(prevForms => [...prevForms, ...newForms]);
  }, [selectedVehicles]);

  const handleVehiclesChange = (index: number) => {
    const updatedVehicles = selectedVehicles.map((vehicle, i) =>
      i === index ? { ...vehicle, checked: !vehicle.checked } : vehicle
    );
    setSelectedVehicles(updatedVehicles);
    // console.log("updatedVehicles", updatedVehicles);
    // console.log("inventoryForms", inventoryForms);
  };

  return (
    <Container>
      <Row
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "0px",
          marginBottom: "20px",
        }}
      >
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
                marginBottom: "15px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                name="key"
                value={item.value}
                checked={item.checked}
                disabled={
                  item?.installer !== null && item?.inventory?.length > 0
                }
                onChange={() => handleVehiclesChange(index)}
                style={{ display: "none" }}
              />
              <span
                onClick={(e) => e.stopPropagation()}
                className="green"
              ></span>
              <span style={{ marginBottom: "-10px" }}>
                <P>{item.title}</P>
              </span>
            </label>
          </Col>
        ))}
        <div
          style={{
            margin: "0px 0px",
            height: "8px",
            borderBottom: "2px solid gray",
            borderTop: "2px solid gray",
          }}
        ></div>
      </Row>
      {inventoryForms.map((formData, index) => (
        <React.Fragment key={index}>
          <H4>Registration Number : {formData.vehicleValue}</H4>
          <div style={{ marginBottom: "15px" }}></div>
          <InventoryDetails
            index={index}
            inventoryData={formData}
            onChange={handleFormDataChange}
            onRemove={() =>
              setInventoryForms(inventoryForms.filter((_, i) => i !== index))
            }
            callbackActive={callbackActive}
          />
          <div
            style={{
              padding:
                index === inventoryForms.length - 1
                  ? "10px 0px 15px 0px"
                  : "25px 0px 35px 0px",
            }}
          >
            <div
              style={{
                margin: "0px 0px",
                height: "8px",
                borderBottom: "2px solid gray",
                borderTop: "2px solid gray",
              }}
            ></div>
          </div>
        </React.Fragment>
      ))}
      <Col
        xs={12}
        className="text-end d-flex justify-content-end gap-2 align-center"
      >
        <Button
          color="secondary"
          onClick={() => {
            dispatch(setSaleLead(null));
            dispatch(setCustomer(null));
            dispatch(setSaleLeadId(""));
            navigate(
              `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads`
            );
          }}
        >
          Cancel
        </Button>
        {saleLead?.vehicles?.length > 0 && (
          <Button color="primary" onClick={() => callbackActive(5)}>
            Next
          </Button>
        )}
      </Col>
    </Container>
  );
};

export default InventoryDetailsList;
