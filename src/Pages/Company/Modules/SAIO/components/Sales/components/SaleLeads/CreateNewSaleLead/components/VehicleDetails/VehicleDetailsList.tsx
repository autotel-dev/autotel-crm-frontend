// src/components/VehicleFormsManager.js
import React, { useEffect, useState } from "react";
import VehicleForm from "./VehicleDetails";
import { Button, Col, Container } from "reactstrap";
import { useSelector } from "react-redux";
import {
  setCustomer,
  setSaleLead,
  setSaleLeadId,
} from "../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface VehicleFormsManagerProps {
  callbackActive: (val: number | undefined) => void;
}
const VehicleFormsManager = ({ callbackActive }: VehicleFormsManagerProps) => {
  const { saleLead, services } = useSelector((state: any) => state.sales);
  const [vehicleForms, setVehicleForms]: any = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("vehicleForms", vehicleForms);

  useEffect(() => {
    if (saleLead !== null) {
      // console.log("salelead", saleLead);

      if (saleLead?.vehicles.length < saleLead?.totalNoOfVehicles) {
        setVehicleForms([
          ...saleLead?.vehicles.map((item: any, i: number) => {
            return {
              registrationNo: item?.registrationNo,
              color: item?.color,
              engineNo: item?.engineNo,
              chasisNo: item?.chasisNo,
              instructions: item?.instructions,
              remarks: item?.remarks,
              bank: item?.bank?._id,
              // geofenceIds:
              //   item?.geofences?.length > 0
              //     ? [...item?.geofences?.map((g: any) => g)]
              //     : [],
              insurance: item?.insurance?._id,
              group: item?.group?._id,
              vehicleMake: item?.make?._id,
              vehicleModel: item?.model?._id,
              year: item?.year,
              transmissionType: item?.transmissionType,
              fuelType: item?.fuelType,
              vehicleIconOffline: item?.vehicleIconOffline || "",
              vehicleIconIdle: item?.vehicleIconIdle || "",
              vehicleIconOnline: item?.vehicleIconOnline || "",
              vehicleIconStopped: item?.vehicleIconStopped || "",
              // additionalServices: [
              //   ...services?.map((service: any, i: number) => {
              //     return {
              //       title: service.title,
              //       value: service.value,
              //       checked: item?.additionalServices?.includes(service.value),
              //     };
              //   }),
              // ],
              additionalServices: (Array.isArray(item?.additionalServices) && typeof item?.additionalServices[0] === "string"
                ? JSON.parse(item?.additionalServices[0])
                : item?.additionalServices || []
              ).map((service: any) => ({
                service: {
                  title: service?.service?.title,
                  value: service?.service?.value,
                },
                isOffering: service?.isOffering,
              })) || [],
              defaultService: item?.defaultService,
              deviceId: item?.deviceId !== null ? item?.deviceId : null,
              server: item?.server !== null ? item?.server : null,
              vehicleData: item,
            };
          }),
          {
            registrationNo: "",
            color: "",
            engineNo: "",
            chasisNo: "",
            instructions: "",
            remarks: "",
            bank: "",
            // geofenceIds: [],
            insurance: "",
            group: "",
            vehicleMake: "",
            vehicleModel: "",
            year: "",
            transmissionType: "",
            fuelType: "",
            vehicleIconOffline: "",
            vehicleIconIdle: "",
            vehicleIconOnline: "",
            vehicleIconStopped: "",
            // additionalServices: [
            //   ...services?.map((service: any, i: number) => {
            //     return {
            //       title: service.title,
            //       value: service.value,
            //       checked: false,
            //     };
            //   }),
            // ],
            additionalServices:
              saleLead?.services?.map((service: any) => ({
                service: {
                  title: service?.service?.title,
                  value: service?.service?.value,
                },
                isOffering: service?.isOffering, // Set isOffering to true by default
              })) || [],
            defaultService: "Self",
            // deviceId: "",
            // server: "",
            deviceId: "12345",
            server: "61dd12a0cae2dc1c09c5166f",
            vehicleData: "",
          },
        ]);
      } else {
        setVehicleForms([
          ...saleLead?.vehicles.map((item: any, i: number) => {
            return {
              registrationNo: item?.registrationNo,
              color: item?.color,
              engineNo: item?.engineNo,
              chasisNo: item?.chasisNo,
              instructions: item?.instructions,
              remarks: item?.remarks,
              bank: item?.bank?._id,
              // geofenceIds:
              //   item?.geofences?.length > 0
              //     ? [...item?.geofences?.map((g: any) => g)]
              //     : [],
              insurance: item?.insurance?._id,
              group: item?.group?._id,
              vehicleMake: item?.make?._id,
              vehicleModel: item?.model?._id,
              year: item?.year,
              transmissionType: item?.transmissionType,
              fuelType: item?.fuelType,
              vehicleIconOffline: item?.vehicleIconOffline || "",
              vehicleIconIdle: item?.vehicleIconIdle || "",
              vehicleIconOnline: item?.vehicleIconOnline || "",
              vehicleIconStopped: item?.vehicleIconStopped || "",
              // additionalServices: [
              //   ...services?.map((service: any, i: number) => {
              //     return {
              //       title: service.title,
              //       value: service.value,
              //       checked: item?.additionalServices?.includes(service.value),
              //     };
              //   }),
              // ],
              additionalServices: (Array.isArray(item?.additionalServices) && typeof item?.additionalServices[0] === "string"
                ? JSON.parse(item?.additionalServices[0])
                : item?.additionalServices || []
              ).map((service: any) => ({
                service: {
                  title: service?.service?.title,
                  value: service?.service?.value,
                },
                isOffering: service?.isOffering,
              })) || [],
              defaultService: item?.defaultService,
              deviceId: item?.deviceId !== null ? item?.deviceId : null,
              server: item?.server !== null ? item?.server : null,
              vehicleData: item !== null ? item : null,
            };
          }),
        ]);
      }
    }
  }, [saleLead]);

  const addVehicleForm = () => {
    setVehicleForms([
      ...vehicleForms,
      {
        registrationNo: "",
        color: "",
        engineNo: "",
        chasisNo: "",
        instructions: "",
        remarks: "",
        bank: "",
        // geofenceIds: [],
        insurance: "",
        group: "",
        vehicleMake: "",
        vehicleModel: "",
        year: "",
        transmissionType: "",
        fuelType: "",
        vehicleIconOffline: "",
        vehicleIconIdle: "",
        vehicleIconOnline: "",
        vehicleIconStopped: "",
        // additionalServices: [
        //   ...services?.map((service: any, i: number) => {
        //     return {
        //       title: service.title,
        //       value: service.value,
        //       checked: false,
        //     };
        //   }),
        // ],
        additionalServices:
          saleLead?.services?.map((service: any) => ({
            service: {
              title: service?.service?.title,
              value: service?.service?.value,
            },
            isOffering: service?.isOffering, // Set isOffering to true by default
          })) || [],
        defaultService: "Self",
        // deviceId: "",
        // server: "",
        deviceId: "12345",
        server: "61dd12a0cae2dc1c09c5166f",
        vehicleData: "",
      },
    ]);
  };

  const removeVehicleForm = (index: number) => {
    setVehicleForms(vehicleForms.filter((_: any, i: number) => i !== index));
  };

  const handleFormDataChange = (index: number, newData: any) => {
    const updatedForms = vehicleForms.map((form: any, i: number) =>
      i === index ? newData : form,
    );
    setVehicleForms(updatedForms);
    // console.log("vehicleForms", vehicleForms);
  };

  return (
    <Container>
      {vehicleForms.map((formData: any, index: number) => (
        <>
          <VehicleForm
            key={index}
            index={index}
            vehicleData={formData}
            onChange={handleFormDataChange}
            onRemove={removeVehicleForm}
            callbackActive={callbackActive}
          />
          <div
            style={{
              padding:
                index == vehicleForms.length - 1
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
        </>
      ))}
      {vehicleForms.length < saleLead?.totalNoOfVehicles && (
        <Col className="text-end">
          <Button color="primary" onClick={addVehicleForm}>
            Add New Vehicle
          </Button>

          <div
            style={{
              padding: "10px 0px 10px 0px",
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
        </Col>
      )}
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
              `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads`,
            );
          }}
        >
          Cancel
        </Button>

        {saleLead?.vehicles?.length > 0 && (
          <Button color="primary" onClick={() => callbackActive(4)}>
            Next
          </Button>
        )}
      </Col>
    </Container>
  );
};

export default VehicleFormsManager;
