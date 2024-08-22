// import { ChangeEvent, useState } from "react";
// import ShowError from "../../ShowError";
// import {
//   Button,
//   Col,
//   Form,
//   FormGroup,
//   Input,
//   InputGroup,
//   Label,
//   Row,
// } from "reactstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { H4, P } from "../../../../../../../../../../../AbstractElements";
// import SelectBanksBox from "./components/SelectBanksBox";
// import SelectInsuranceBox from "./components/SelectInsuranceBox";
// import SelectGroupsBox from "./components/SelectGroupsBox";
// import SelectVehicleMakeBox from "./components/SelectVehicleMakeBox";
// import SelectVehicleModelBox from "./components/SelectVehicleModelBox";
// import SelectVehicleYearBox from "./components/SelectVehicleYearBox";
// import SelectTransmissionBox from "./components/SelectTransmissionBox";
// import SelectFuelTypeBox from "./components/SelectFuelTypeBox";
// import { setCustomer, setSaleLead, setSaleLeadId, setSaleLeads } from "../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
// import { create, getAll } from "../../../../../../../../../../../Utilities/api";
// import Swal from "sweetalert2";
// import { CREATE_NEW_SALELEAD_VEHICLE, GET_ALL_SALELEADS } from "../../../../../../../../../../../Utilities/api/apiEndpoints";
// import { ERROR_MESSAGE } from "../../../../../../../../../../../Utilities/constants/constants";

// interface VehicleDetailsProps {
//   callbackActive: (val: number | undefined) => void;
//   iscreateNewSaleLead: boolean;
//   setIscreateNewSaleLead: any;

// }

// const VehicleDetails = ({ callbackActive, iscreateNewSaleLead, setIscreateNewSaleLead }: VehicleDetailsProps) => {
//   const { userPersonalizationData } = useSelector(
//     (state: any) => state.personalization
//   );
//   const { saleLead } = useSelector((state: any) => state.sales);
//   console.log("saleLead", saleLead);
//   const dispatch = useDispatch();
//   const [vehicleDetailsForm, setVehicleDetailsForm] = useState({
//     registrationNo: "",
//     color: "",
//     engineNo: "",
//     chasisNo: "",
//     instructions: "",
//     remarks: "",
//   });
//   const [bank, setBank] = useState("");
//   const [insurance, setInsurance] = useState("");
//   const [group, setGroup] = useState("");
//   const [vehicleMake, setVehicleMake] = useState("");
//   const [vehicleModel, setVehicleModel] = useState("");
//   const [vehicleYear, setVehicleYear] = useState("");
//   const [transmission, setTransmission] = useState("");
//   const [fuelType, setFuelType] = useState("");

//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = (e: any) => {
//     e.preventDefault();
//     setShowPassword(!showPassword);
//   };
//   const [formData, setFormData] = useState({});
//   const {
//     registrationNo,
//     color,
//     engineNo,
//     chasisNo,
//     instructions,
//     remarks,

//   } = vehicleDetailsForm;
//   const getUserData = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
//     let name = event.target.name;
//     let value =
//       event.target.value;
//     setVehicleDetailsForm({ ...vehicleDetailsForm, [name]: value });
//   };

//   const [loading, setLoading] = useState(false)

// const createVehicle = async () => {
//   setLoading(true);
//   if (
//     registrationNo !== "" &&
//     color !== "" &&
//     engineNo !== "" &&
//     // province !== "" &&
//     chasisNo !== "" && instructions !== "" && remarks !== ""
//   ) {
//     const body = {
//       ...vehicleDetailsForm,
//       bank: bank,
//       insurance: insurance,
//       vehicleMake: vehicleMake,
//       vehicleModel: vehicleModel,
//       year: Number(vehicleYear),
//       fuelType: fuelType,
//       transmissionType: transmission,
// saleLeadId: saleLead._id,
// customer: saleLead.customer._id,
//       group: group,
//       additionalServices: vehicleServicesOptional
//         .filter((item: any) => item.checked)
//         .map((item: any) => item.value),
//       defaultService: selection
//     }

//     try {
//       await create(body, { url: CREATE_NEW_SALELEAD_VEHICLE }).then((data: any) => {
//         if (data !== undefined) {
//           if (
//             !data.success &&
//             data.message === ERROR_MESSAGE
//           ) {
//             setLoading(false);
//             console.log("data.message", data.message);

//           }
//           if (!data.success) {
//             Swal.fire({
//               text: `${data.message}`,
//               icon: "error",
//               timer: 2000,
//               showConfirmButton: false,
//             });
//             setLoading(false);

//           }
//           if (data.success) {
//             getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {
//               if (data !== undefined) {
//                 if (!data.success) {
//                   // setIscreateNewSaleLead(false)
//                 }
//                 if (data.success) {
//                   dispatch(setSaleLeads(data.data));


//                   // setIscreateNewSaleLead(false)
//                   // // console.log("hhg");

//                 }
//               }
//             });
//             callbackActive(4);
//             setLoading(false);
//           }
//         }
//       });
//       // Handle successful post creation (e.g., show a success message, redirect, etc.)
//     } catch (error: any) {
//       // Handle error (e.g., show an error message)
//       // console.error("Error creating post:", error);
//       setLoading(false);
//     }

//   } else {
//     ShowError();
//     setLoading(false);
//   }
// };

//   const { services } = useSelector((state: any) => state.sales);

//   const [vehicleServicesOptional, setVehicleServicesOptional] = useState(services.map((item: any) => ({
//     ...item,
//     checked: false
//   })))
//   // const [vehicleServicesDefault, setVehicleServicesDefault] = useState([{ title: "Self", value: "SELF", checked: true }, { title: "Control Room", value: "CONTROL ROOM", checked: false }])

// const handleCheckboxChange = (index: number) => {
//   const updatedServices = vehicleServicesOptional.map((service: any, i: number) =>
//     i === index ? { ...service, checked: !service.checked } : service
//   );
//   setVehicleServicesOptional(updatedServices);
//   console.log("updatedServices", updatedServices);

// };

//   const [selection, setSelection] = useState("Self"); // Added state for selection

//   const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSelection(e.target.value);
//   };
//   return (
//     <Form
//       onSubmit={(event) => event.preventDefault()}
//       className="needs-validation"
//       noValidate
//     >
//       <Row className="g-3">
//         <Col xl={4} xs={12}>
//           <div>
//             <P>
//               Select Bank
//               <span className="txt-danger">*</span>
//             </P>
//           </div>
//           <SelectBanksBox placeholder="Select Bank" bank={bank} setBank={setBank} />
//         </Col>
//         <Col xl={4} xs={12}>
//           <div>
//             <P>
//               Select Insurance
//               <span className="txt-danger">*</span>
//             </P>
//           </div>
//           <SelectInsuranceBox placeholder="Select Insurance" insurance={insurance} setInsurance={setInsurance} />
//         </Col>
//         <Col xl={4} xs={12}>
//           <div>
//             <P>
//               Select Group
//               <span className="txt-danger">*</span>
//             </P>
//           </div>
//           <SelectGroupsBox placeholder="Select Group" group={group} setGroup={setGroup} />
//         </Col>
//         <Col xl={4} xs={12}>
//           <div>
//             <P>
//               Select Vehicle Make
//               <span className="txt-danger">*</span>
//             </P>
//           </div>
//           <SelectVehicleMakeBox placeholder="Select Vehicle Make" vehicleMake={vehicleMake} setVehicleMake={setVehicleMake} />
//         </Col>
//         <Col xl={4} xs={12}>
//           <div>
//             <P>
//               Select Vehicle Model
//               <span className="txt-danger">*</span>
//             </P>
//           </div>
//           <SelectVehicleModelBox placeholder="Select Vehicle Model" vehicleModel={vehicleModel} setVehicleModel={setVehicleModel} />
//         </Col>
//         <Col xl={4} xs={12}>
//           <div>
//             <P>
//               Select Vehicle Year
//               <span className="txt-danger">*</span>
//             </P>
//           </div>
//           <SelectVehicleYearBox placeholder="Select Vehicle Year" vehicleYear={vehicleYear} setVehicleYear={setVehicleYear} />
//         </Col>
//         <Col xl={4} xs={12}>
//           <div>
//             <P>
//               Select Fuel Type
//               <span className="txt-danger">*</span>
//             </P>
//           </div>
//           <SelectFuelTypeBox placeholder="Select Fuel Type" fuelType={fuelType} setFuelType={setFuelType} />
//         </Col>
//         <Col xl={4} xs={12}>
//           <div>
//             <P>
//               Select Transmission
//               <span className="txt-danger">*</span>
//             </P>
//           </div>
//           <SelectTransmissionBox placeholder="Select Transmission" transmission={transmission} setTransmission={setTransmission} />
//         </Col>
//         <Col xl={4} xs={12}>
//           <P>
//             Vehicle Registration No
//             <span className="txt-danger">*</span>
//           </P>
//           <Input
//             type="text"
//             placeholder="Enter Vehicle Registration No"
//             value={registrationNo}
//             name="registrationNo"
//             onChange={getUserData}
//           />
//         </Col>
//         <Col xl={4} xs={12}>
//           <P>
//             Vehicle Color
//             <span className="txt-danger">*</span>
//           </P>
//           <Input
//             type="text"
//             placeholder="Enter Vehicle Color"
//             value={color}
//             name="color"
//             onChange={getUserData}
//           />
//         </Col>
//         <Col xl={4} xs={12}>
//           <P>

//             Chasis No
//             <span className="txt-danger">*</span>
//           </P>
//           <Input
//             type="text"
//             placeholder="Enter Chasis No"
//             value={
//               chasisNo}
//             name="chasisNo"
//             onChange={getUserData}
//           />
//         </Col>
//         <Col xl={4} xs={12}>
//           <P>

//             Engine No
//             <span className="txt-danger">*</span>
//           </P>
//           <Input
//             type="text"
//             placeholder="Enter Engine No"
//             value={engineNo}
//             name="engineNo"
//             onChange={getUserData}
//           />
//         </Col>
//         <Col xl={12} xs={12}>
//           <P>
//             Instructions
//             <span className="txt-danger">*</span>
//           </P>
//           <textarea
//             className="form-control"
//             placeholder="Enter Instructions"
//             rows={2} // Minimum number of visible lines
//             style={{
//               maxHeight: "200px", // Maximum height for 5 lines of text
//               resize: "vertical", // Allow vertical resizing within the specified range
//             }}
//             value={instructions}
//             name="instructions"
//             onChange={getUserData}
//           // {...register("description", { required: true })}
//           />
//         </Col>
//         <Col xl={12} xs={12}>
//           <P>
//             Remarks
//             <span className="txt-danger">*</span>
//           </P>
//           <textarea
//             className="form-control"
//             placeholder="Enter Remarks"
//             rows={2} // Minimum number of visible lines
//             style={{
//               maxHeight: "200px", // Maximum height for 5 lines of text
//               resize: "vertical", // Allow vertical resizing within the specified range
//             }}
//             value={remarks}
//             name="remarks"
//             onChange={getUserData}
//           // {...register("description", { required: true })}
//           />
//         </Col>
//       </Row >

// <Row className="g-3">
//   <Row style={{ display: "flex", flexWrap: "wrap", marginTop: "50px" }}>
//     <H4>Default Services</H4>
//     <div style={{
//       height: "20px",

//     }}>  </div>
//     <Row>
//       <div style={{ display: "flex", justifyContent: "start", alignItems: "center", marginBottom: "25px" }}>
//         <Input
//           type="radio"
//           name="selection"
//           value="Self"
//           checked={selection === "Self"}
//           onChange={handleSelectionChange}
//           style={{ display: 'none' }}
//           id="Self"
//         />
//         <label
//           htmlFor="Self"
//           style={{
//             position: 'relative',
//             paddingLeft: '25px',
//             marginRight: '50px',
//             cursor: 'pointer',
//             fontSize: '16px',
//             color: '#333'
//           }}
//         >
//           Self
//           <span
//             style={{
//               content: '',
//               position: 'absolute',
//               left: 0,
//               top: 0,
//               width: '18px',
//               height: '18px',
//               border: '2px solid black',
//               borderRadius: '50%',
//               background: 'white'
//             }}
//           />
//           {selection === 'Self' && (
//             <span
//               style={{
//                 content: '',
//                 position: 'absolute',
//                 left: '5px',
//                 top: '5px',
//                 width: '8px',
//                 height: '8px',
//                 borderRadius: '50%',
//                 background: 'green'
//               }}
//             />
//           )}
//         </label>
//         <Input
//           type="radio"
//           name="selection"
//           value="Control Room"
//           checked={selection === "Control Room"}
//           onChange={handleSelectionChange}
//           style={{ display: 'none' }}
//           id="Control Room"
//         />
//         <label
//           htmlFor="Control Room"
//           style={{
//             position: 'relative',
//             paddingLeft: '25px',
//             marginRight: '20px',
//             cursor: 'pointer',
//             fontSize: '16px',
//             color: '#333'
//           }}
//         >
//           Control Room
//           <span
//             style={{
//               content: '',
//               position: 'absolute',
//               left: 0,
//               top: 0,
//               width: '18px',
//               height: '18px',
//               border: '2px solid black',
//               borderRadius: '50%',
//               background: 'white'
//             }}
//           />
//           {selection === 'Control Room' && (
//             <span
//               style={{
//                 content: '',
//                 position: 'absolute',
//                 left: '5px',
//                 top: '5px',
//                 width: '8px',
//                 height: '8px',
//                 borderRadius: '50%',
//                 background: 'green'
//               }}
//             />
//           )}
//         </label>
//       </div>
//     </Row>
//     <H4>Optional Services</H4>
//     <div style={{
//       height: "20px"
//     }}>

//     </div>
//     {services?.map((item: any, index: any) => {
//       return (
//         <>
//           <Col sm={3}>
//             <label
//               style={{
//                 display: "inline-flex", // Use flexbox
//                 alignItems: "center", // Center items vertically
//                 position: "relative",
//                 cursor: "pointer",
//                 marginRight: "25px",
//                 fontSize: "18px",
//                 marginBottom: "15px" // Add some space between rows
//               }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <input
//                 type="checkbox"
//                 name="key"
//                 value={item.value}
//                 checked={item.checked}
//                 onChange={() => handleCheckboxChange(index)}
//                 style={{ display: "none" }}

//               />
//               <span
//                 onClick={(e) => e.stopPropagation()}
//                 className="green"
//               ></span>
//               <span style={{ marginTop: "5px" }}>{item.title}</span>
//             </label></Col>
//         </>
//       );
//     })}
//   </Row>



// <Col
//   xs={12}
//   className="text-end d-flex justify-content-end gap-2 align-center"
// >
//   <Button color="secondary" onClick={() => { dispatch(setSaleLead(null)); dispatch(setCustomer(null)); dispatch(setSaleLeadId("")); setIscreateNewSaleLead(false) }}>
//     Cancel
//   </Button>
//   {/* <Button color="primary" onClick={() => callbackActive(1)}>
//     Previous
//   </Button> */}
//   <Button color="primary" onClick={createVehicle}>
//     {loading ? "Loading..." : "Create New"}
//   </Button>

//   {saleLead?.vehicles?.length > 0 && <Button color="primary" onClick={() => callbackActive(4)}>
//     Next
//   </Button>}
// </Col>
//       </Row>
//     </Form >
//   );
// };

// export default VehicleDetails;























// src/components/VehicleForm.js
import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Form, Input } from 'reactstrap';
import SelectBanksBox from "./components/SelectBanksBox";
import SelectInsuranceBox from "./components/SelectInsuranceBox";
import SelectGroupsBox from "./components/SelectGroupsBox";
import SelectVehicleMakeBox from "./components/SelectVehicleMakeBox";
import SelectVehicleModelBox from "./components/SelectVehicleModelBox";
import SelectVehicleYearBox from "./components/SelectVehicleYearBox";
import SelectTransmissionBox from "./components/SelectTransmissionBox";
import SelectFuelTypeBox from "./components/SelectFuelTypeBox";
import Swal from 'sweetalert2';
import { create, deleteSingle, getAll, update } from '../../../../../../../../../../../Utilities/api';
import { CREATE_NEW_SALELEAD_VEHICLE, DELETE_VEHICLE, GET_ALL_SALELEADS, GET_SINGLE_SALELEAD, UPDATE_VEHICLE } from '../../../../../../../../../../../Utilities/api/apiEndpoints';
import { ERROR_MESSAGE } from '../../../../../../../../../../../Utilities/constants/constants';
import { useDispatch } from 'react-redux';
import { setSaleLead, setSaleLeads } from '../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice';
import ShowError from '../../ShowError';
import { useSelector } from 'react-redux';
import { H4, P } from '../../../../../../../../../../../AbstractElements';
import SelectServersBox from './components/SelectServerBox';
import { Select } from 'antd';
import { formatUnderscoredString } from '../../../../../../../../../../../Utilities/globals/globals';



const VehicleForm = ({ onRemove, index, vehicleData, onChange, callbackActive, iscreateNewSaleLead, setIscreateNewSaleLead }: any) => {
  const [formData, setFormData] = useState(vehicleData);
  console.log("formData", formData);
  const { saleLead } = useSelector((state: any) => state.sales)

  useEffect(() => {
    setFormData(vehicleData);
  }, [vehicleData]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    onChange(index, { ...formData, [name]: value });
  };

  const handleSelectChange = (name: any, value: any) => {
    setFormData({ ...formData, [name]: value });
    onChange(index, { ...formData, [name]: value });
  };

  const handleCheckboxChange = (index: number) => {
    const updatedServices = formData.additionalServices.map((service: any, i: number) =>
      i === index ? { ...service, checked: !service.checked } : service
    );
    setFormData({ ...formData, additionalServices: updatedServices });
    onChange(index, { ...formData, additionalServices: updatedServices });
  };

  const handleDefaultServiceChange = (na: any, value: string, i: any) => {
    const updatedFormData = { ...formData, defautService: value };
    setFormData(updatedFormData);
    onChange(index, updatedFormData);

  }
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const [isCreated, setIsCreated] = useState(saleLead.vehicles.find((item: any, i: number) => formData.registrationNo == item.registrationNo) ? true : false);


  const { services } = useSelector((state: any) => state.sales);

  const [vehicleServicesOptional, setVehicleServicesOptional] = useState(services.map((item: any) => ({
    ...item,
    checked: false
  })))


  const [selection, setSelection] = useState("Self"); // Added state for selection

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelection(e.target.value);
  };
  const createVehicle = async () => {
    setLoading(true);
    if (
      formData.registrationNo !== "" &&
      formData.color !== "" &&
      formData.engineNo !== "" &&
      formData.chasisNo !== "" &&
      formData.instructions !== "" &&
      formData.remarks !== "" &&
      formData.bank !== "" &&
      formData.insurance !== "" &&
      formData.group !== "" &&
      formData.vehicleMake !== "" &&
      formData.vehicleModel !== "" &&
      formData.year !== "" &&
      formData.transmission !== "" &&
      formData.fuelType !== ""
    ) {
      const body = {
        ...formData,
        additionalServices: [...formData.additionalServices
          .filter((service: any) => service.checked)
          .map((service: any) => service.value)],
        saleLeadId: saleLead._id,
        customer: saleLead.customer._id,
      }

      try {
        await create(body, { url: CREATE_NEW_SALELEAD_VEHICLE }).then((data: any) => {
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
                          if (data.data.vehicles.length == data.data.totalNoOfVehicles) {
                            setIsCreated(true);
                            callbackActive(4)
                          } else {
                            setIsCreated(true);
                          }
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



  const updateVehicle = async () => {
    setLoading(true);
    if (
      formData.registrationNo !== "" &&
      formData.color !== "" &&
      formData.engineNo !== "" &&
      formData.chasisNo !== "" &&
      formData.instructions !== "" &&
      formData.remarks !== "" &&
      formData.bank !== "" &&
      formData.insurance !== "" &&
      formData.group !== "" &&
      formData.vehicleMake !== "" &&
      formData.vehicleModel !== "" &&
      formData.year !== "" &&
      formData.transmission !== "" &&
      formData.fuelType !== ""
    ) {
      const body = {
        ...formData,
        additionalServices: [...formData.additionalServices
          .filter((service: any) => service.checked)
          .map((service: any) => service.value)],
        saleLeadId: saleLead._id,
        customer: saleLead.customer._id,
      }

      try {
        await update(body, { url: `${UPDATE_VEHICLE}/${formData.vehicleData._id}` }).then((data: any) => {
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
                          setIsCreated(true);
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

  const removeVehicle = async () => {
    if (formData.vehicleData.inventory.length > 0) {
      Swal.fire({
        title: "Alert",
        text: "Please remove the inventory of this vehicle before you delete this",
        icon: "warning",
        showCancelButton: true,
      })
    }
    else {
      setLoading(true);
      Swal.fire({
        title: "Remove Vehicle",
        text: "Are you sure You want to remove this vehicle",
        icon: "warning",
        showCancelButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            text: `Deleting...`,
            icon: "info",
            showConfirmButton: false,
          });
          try {
            await create({ saleLeadId: saleLead?._id }, { url: `${DELETE_VEHICLE}/${formData.vehicleData._id}` }).then((data: any) => {
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
                  setLoading(false);
                  Swal.fire({
                    text: `${data.message}`,
                    icon: "success",
                    timer: 2500,
                    showConfirmButton: false,
                  });
                  getAll({ url: `${GET_SINGLE_SALELEAD}/${saleLead._id}` }).then((data: any) => {
                    if (data !== undefined) {
                      if (data.success) {
                        dispatch(setSaleLead(data.data));
                        onRemove(index)
                        setIsCreated(false);
                      }
                    }
                  });
                  getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {
                    if (data !== undefined) {
                      if (!data.success) {
                        // setIscreateNewSaleLead(false)
                      }
                      if (data.success) {
                        dispatch(setSaleLeads(data.data));
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
        }
      });
    }

  };

  return (
    <Form className="vehicle-form">
      <Row className="g-3">
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Bank
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectBanksBox
            placeholder="Select Bank"
            bank={formData.bank}
            setBank={(value: any) => handleSelectChange('bank', value)}
            disabled={isCreated}
          />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Insurance
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectInsuranceBox
            placeholder="Select Insurance"
            insurance={formData.insurance}
            setInsurance={(value: any) => handleSelectChange('insurance', value)}
            disabled={isCreated}
          />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Group
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectGroupsBox
            placeholder="Select Group"
            group={formData.group}
            setGroup={(value: any) => handleSelectChange('group', value)}
            disabled={isCreated}
          />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Vehicle Make
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectVehicleMakeBox
            placeholder="Select Vehicle Make"
            vehicleMake={formData.vehicleMake}
            setVehicleMake={(value: any) => handleSelectChange('vehicleMake', value)}
            disabled={isCreated}
          />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Vehicle Model
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectVehicleModelBox
            placeholder="Select Vehicle Model"
            vehicleModel={formData.vehicleModel}
            setVehicleModel={(value: any) => handleSelectChange('vehicleModel', value)}
            disabled={isCreated}
          />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Model Year
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectVehicleYearBox
            placeholder="Select Vehicle Year"
            vehicleYear={formData.year}
            setVehicleYear={(value: any) => handleSelectChange('year', value)}
            disabled={isCreated}
          />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Fuel Type
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectFuelTypeBox
            placeholder="Select Fuel Type"
            fuelType={formData.fuelType}
            setFuelType={(value: any) => handleSelectChange('fuelType', value)}
            disabled={isCreated}
          />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Transmissions
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectTransmissionBox
            placeholder="Select Transmission"
            transmission={formData.transmissionType}
            setTransmission={(value: any) => handleSelectChange('transmissionType', value)}
            disabled={isCreated}
          />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Enter Registration Number
              <span className="txt-danger">*</span>
            </P>
          </div>
          <Input
            type="text"
            placeholder="Enter Vehicle Registration No"
            value={formData.registrationNo}
            name="registrationNo"
            onChange={handleInputChange}
            disabled={isCreated}
          />
        </Col>
        {/* <Col xl={4} xs={12}>
          <div>
            <P>
              Select Vehicle Color
              <span className="txt-danger">*</span>
            </P>
          </div>
          <Input
            type="text"
            placeholder="Enter Vehicle Color"
            value={formData.color}
            name="color"
            onChange={handleInputChange}
            disabled={isCreated}
          />
        </Col> */}

        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Vehicle Color
              <span className="txt-danger">*</span>
            </P>
          </div>
          <Select
            showSearch
            value={formData.color !== "" ? formData.color : null}
            style={{ width: "100%", height: 36 }}
            placeholder="Select Vehicle Color"
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
              (option?.label ?? "").includes(input)
            }
            onChange={(e) => {
              setFormData({ ...formData, color: e });
              onChange(index, { ...formData, color: e });
            }}
            disabled={isCreated}
            options={[
              { value: "Black", label: "Black" }, { value: "Blue", label: "Blue" },
              { value: "White", label: "White" }, { value: "Gray", label: "Gray" },
              { value: "Green", label: "Green" }, { value: "Red", label: "Red" },
            ]}
          />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Enter Chasis Number
              <span className="txt-danger">*</span>
            </P>
          </div>
          <Input
            type="text"
            placeholder="Enter Chasis Number"
            value={formData.chasisNo}
            name="chasisNo"
            onChange={handleInputChange}
            disabled={isCreated}
          />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Enter Engine Number
              <span className="txt-danger">*</span>
            </P>
          </div>
          <Input
            type="text"
            placeholder="Enter Engine Number"
            value={formData.engineNo}
            name="engineNo"
            onChange={handleInputChange}
            disabled={isCreated}
          />
        </Col>
        <Col xl={12} xs={12}>
          <div>
            <P>
              Enter Instructions
              <span className="txt-danger">*</span>
            </P>
          </div>
          <textarea
            className="form-control"
            placeholder="Enter Instructions"
            rows={2}
            value={formData.instructions}
            name="instructions"
            onChange={handleInputChange}
            disabled={isCreated}
          />
        </Col>
        <Col xl={12} xs={12}>
          <div>
            <P>
              Enter Remarks
              <span className="txt-danger">*</span>
            </P>
          </div>
          <textarea
            className="form-control"
            placeholder="Enter Remarks"
            rows={2}
            value={formData.remarks}
            name="remarks"
            onChange={handleInputChange}
            disabled={isCreated}
          />
        </Col>


        <Row className="g-3">
          <Row style={{ display: "flex", flexWrap: "wrap", marginTop: "50px" }}>
            <H4>Default Services</H4>
            <div style={{
              height: "20px",

            }}>  </div>
            <Row>
              <div style={{ display: "flex", justifyContent: "start", alignItems: "center", marginBottom: "25px" }}>
                <Input
                  type="radio"
                  name="selection"
                  value="Self"
                  checked={formData?.defaultService === "Self"}
                  onChange={() => handleDefaultServiceChange("defaultService", "Self", index)}
                  style={{ display: 'none' }}
                  id="Self"
                />
                <label
                  htmlFor="Self"
                  style={{
                    position: 'relative',
                    paddingLeft: '25px',
                    marginRight: '50px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#333'
                  }}
                >
                  Self
                  <span
                    style={{
                      content: '',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '18px',
                      height: '18px',
                      border: '2px solid black',
                      borderRadius: '50%',
                      background: 'white'
                    }}
                  />
                  {formData?.defaultService === 'Self' && (
                    <span
                      style={{
                        content: '',
                        position: 'absolute',
                        left: '5px',
                        top: '5px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'green'
                      }}
                    />
                  )}
                </label>
                <Input
                  type="radio"
                  name="selection"
                  value="Control Room"
                  checked={formData?.defaultService === "Control Room"}
                  onChange={() => handleDefaultServiceChange("defaultService", "Control Room", index)}
                  style={{ display: 'none' }}
                  id="Control Room"
                />
                <label
                  htmlFor="Control Room"
                  style={{
                    position: 'relative',
                    paddingLeft: '25px',
                    marginRight: '20px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#333'
                  }}
                >
                  Control Room
                  <span
                    style={{
                      content: '',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '18px',
                      height: '18px',
                      border: '2px solid black',
                      borderRadius: '50%',
                      background: 'white'
                    }}
                  />
                  {formData?.defaultService === 'Control Room' && (
                    <span
                      style={{
                        content: '',
                        position: 'absolute',
                        left: '5px',
                        top: '5px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'green'
                      }}
                    />
                  )}
                </label>
              </div>
            </Row>
            <H4>Optional Services</H4>
            <div style={{
              height: "20px"
            }}>

            </div>
            {formData?.additionalServices?.map((item: any, index: any) => {
              return (
                <>
                  <Col sm={3}>
                    <label
                      style={{
                        display: "inline-flex", // Use flexbox
                        alignItems: "center", // Center items vertically
                        position: "relative",
                        cursor: "pointer",
                        marginRight: "25px",
                        fontSize: "18px",
                        marginBottom: "15px" // Add some space between rows
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        name="key"
                        value={item.value}
                        checked={item.checked}
                        onChange={() => handleCheckboxChange(index)}
                        style={{ display: "none" }}

                      />
                      <span
                        onClick={(e) => e.stopPropagation()}
                        className="green"
                      ></span>
                      <span style={{ marginTop: "5px" }}>{item.title}</span>
                    </label></Col>
                </>
              );
            })}
          </Row>
        </Row>

        <Row className="g-3">
          <Col xl={6} xs={12}>
            {/* <div>
              <P>
                Select DeviceId
                <span className="txt-danger">*</span>
              </P>
            </div>
            <SelectBanksBox
              placeholder="Select Bank"
              bank={formData.bank}
              setBank={(value: any) => handleSelectChange('bank', value)}
              disabled={isCreated}
            /> */}

            <div>
              <P>
                Enter Device Id
                <span className="txt-danger">*</span>
              </P>
            </div>
            <Input
              type="text"
              placeholder="Enter Device Id"
              value={formData.deviceId}
              name="deviceId"
              onChange={handleInputChange}
              disabled={isCreated}
            />
          </Col>
          <Col xl={6} xs={12}>
            <div>
              <P>
                Select Server
                <span className="txt-danger">*</span>
              </P>
            </div>
            <SelectServersBox
              placeholder="Select Server"
              server={formData.server}
              setServer={(value: any) => handleSelectChange('server', value)}
              disabled={isCreated}
            />
          </Col>
        </Row>
        {
          saleLead?.status == "INSTALLED" || formData?.vehicleData?.installationStatus == "INSTALLED" ? <Col
            xs={12}
            className="text-end d-flex justify-content-end gap-2 align-center"
          >
            <Button color="primary" disabled>
              {formData?.vehicleData?.installationStatus == "INSTALLED" && formatUnderscoredString("INSTALLED")}
            </Button>
          </Col> : <Col
            xs={12}
            className="text-end d-flex justify-content-end gap-2 align-center"
          >
            {
              saleLead.vehicles.find((item: any, i: number) => formData.registrationNo == item.registrationNo) ? <>

                {!isCreated && <Button color="secondary" onClick={() => setIsCreated(!isCreated)}>
                  Cancel
                </Button>}
                <Button color="primary" onClick={() => removeVehicle()} disabled={loading}>
                  {loading ? "Deleting..." : "Delete"}
                </Button>
                <Button color="primary" onClick={() => !isCreated ? updateVehicle() : setIsCreated(!isCreated)}>
                  {isCreated ? "Edit" : "Save"}
                </Button>

              </>
                : <>
                  <Button color="primary" onClick={() => createVehicle()}>
                    {loading ? "Loading..." : "Save"}
                  </Button>

                  {!isCreated && < Button color="danger" onClick={() => onRemove(index)}>
                    Remove
                  </Button>}
                </>
            }

          </Col>
        }

      </Row>
    </Form >
  );
};

export default VehicleForm;
