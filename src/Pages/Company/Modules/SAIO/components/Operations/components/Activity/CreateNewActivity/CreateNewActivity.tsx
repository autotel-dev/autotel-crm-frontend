import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { Button, Col, Form, Input, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { P } from "../../../../../../../../../AbstractElements";
import { Select } from "antd";
import {
  create,
  getAll,
  update,
} from "../../../../../../../../../Utilities/api";
import {
  CREATE_NEW_OPERATION_ACTIVITY,
  GET_ALL_ACTIVITIES,
  GET_ALL_CUSTOMER_VEHICLES,
  GET_SINGLE_ACTIVITY_BY_ID,
  UPDATE_OPERATION_STATUS,
} from "../../../../../../../../../Utilities/api/apiEndpoints";
import { useNavigate } from "react-router-dom";
import SelectAdjustmentTypeModal from "./components/SelectAdjustmentTypeModal";
import { SubmitHandler } from "react-hook-form";
import { ERROR_MESSAGE } from "../../../../../../../../../Utilities/constants/constants";
import Swal from "sweetalert2";
import {
  setActivities,
  setActivity,
  setActivityLoading,
} from "../../../../../../../../../ReaduxToolkit/Reducer/OperationActivitySlice";
import { formatUnderscoredString } from "../../../../../../../../../Utilities/globals/globals";
import AddInventoryItemModal from "./components/AddInventoryItemModal";
import ChangeCustomerDataModal from "./components/ChangeCustomerDataModal";
import { Id } from "../../../../../../../../../utils/Constant";

const CreateNewActivity = () => {
  const activityType = localStorage.getItem("activityType");
  const { customers, installers, activitiy } = useSelector(
    (state: any) => state.activities
  );
  const dispatch = useDispatch();
  const [customer, setCustomer] = useState("");
  const [customerVehicles, setCustomerVehicles]: any = useState([]);
  const [customerVehiclesLoading, setCustomerVehiclesLoading] = useState(false);

  const [isAddInventoryModalOpen, setIsAddInventoryModalOpen] = useState(false);
  const [isChangeCustomerDataModalOpen, setIsChangeCustomerDataModalOpen] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [activityForm, setActivityForm]: any = useState({
    activityType: activityType,
    items: [],
    fromVehicleId: "",
    toVehicleId: "",
    fromCustomerId: "",
    toCustomerId: "",
    installer: "",
    vehicles: [],
    customerData: {},
  });
  const [vehicleInventory, setVehicleInventory] = useState([]);
  const [newInventories, setNewInventories]: any = useState([]);
  const [isCustomerDataEdited, setIsCustomerDataEdited] = useState(false);
  const [getActivityLoading, setGetActivityLoading] = useState(
    activitiy !== null ? true : false
  );
  const [status, setStatus] = useState(
    activitiy !== null ? activitiy?.status : ""
  );
  const [remarks, setRemarks] = useState("");

  const getUserData = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    let name = event.target.name;
    let value = event.target.value;
    setActivityForm({ ...activityForm, [name]: value });
  };
  const navigate = useNavigate();
  const [addModal, setAddModal] = useState(false);
  const [isChangeStatus, setIsChangeStatus] = useState(false);
  const [productId, setProductId] = useState("");
  const [itemId, setItemId] = useState("");

  useEffect(() => {
    if (customer !== "") {
      getAll({
        url: `${GET_ALL_CUSTOMER_VEHICLES}/${customer}`,
      }).then((data: any) => {
        // console.log("data", data);
        // console.log("customerVehicles", data);
        setCustomerVehicles(data.data);
        // setCustomer("")
      });
    }
  }, [addModal]);

  const activityStatus = [
    {
      value: "ASSIGNED",
      label: "Assigned",
    },
    {
      value: "INSTALLATION",
      label: "Performed",
    },
    {
      value: "COMPLETED",
      label: "Completed",
    },
  ];

  useEffect(() => {
    if (activitiy !== null) {
      getAll({ url: `${GET_SINGLE_ACTIVITY_BY_ID}/${activitiy._id}` }).then(
        (data: any) => {
          if (data !== undefined) {
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setGetActivityLoading(false);
            }
            if (data.success) {
              setActivityForm({
                activityType:
                  data.data.data.activityType !== null
                    ? data.data.data.activityType
                    : "",
                items:
                  data?.data?.data?.inventoryItems?.length !== 0
                    ? data.data.data.inventoryItems
                    : [],
                fromVehicleId:
                  data?.data?.data?.fromVehicle !== null
                    ? data.data.data.fromVehicle.registrationNo
                    : "",
                toVehicleId:
                  data?.data?.data?.toVehicle !== null
                    ? data.data.data.toVehicle.registrationNo
                    : "",
                fromCustomerId:
                  data?.data?.data?.fromCustomer !== null
                    ? data.data.data.fromCustomer.fullName
                    : "",
                toCustomerId:
                  data?.data?.data?.toCustomer !== null
                    ? data.data.data.toCustomer.fullName
                    : "",
                installer:
                  data?.data?.data?.installer !== null
                    ? data.data.data.installer._id
                    : "",
                vehicles:
                  data?.data?.data?.vehicles?.length !== 0
                    ? data.data.data.vehicles
                    : [],
                // customerData: {}
              });
              if (
                data?.data?.data?.status !== null ||
                data?.data?.data?.status !== undefined
              ) {
                setStatus(data?.data?.data?.status);
              }

              setGetActivityLoading(false);
            }
          }
        }
      );
    }
  }, []);

  const addActivity = async () => {
    setLoading(true);
    // if (vehicleInventory.length > 0) {
    var formData: any;
    if (activityType == "TRANSFER") {
      formData = {
        activityType: activityType,
        fromVehicleId: activityForm.fromVehicleId,
        installer: activityForm.installer,
        toVehicleId: activityForm.toVehicleId,
        items: [...activityForm?.items],
      };
    }
    if (activityType == "REMOVE") {
      formData = {
        activityType: activityType,
        fromVehicleId: activityForm.fromVehicleId,
        installer: activityForm.installer,
        // items: [...vehicleInventory.map((item: any) => item._id)],
        items: [...activityForm?.items],
      };
    }
    if (activityType == "TEMPORARY_REMOVE") {
      formData = {
        activityType: activityType,
        fromVehicleId: activityForm.fromVehicleId,
        installer: activityForm.installer,
        // items: [...vehicleInventory.map((item: any) => item._id)],
        items: [...activityForm?.items],
      };
    }
    if (activityType == "REDO") {
      formData = {
        activityType: activityType,
        fromVehicleId: activityForm.fromVehicleId,
        installer: activityForm.installer,
        // items: [...vehicleInventory.map((item: any) => item._id), ],
        items: [
          ...activityForm?.items,
          ...newInventories.map((item: any) => item?._id),
        ],
      };
    }
    if (activityType == "OWNERSHIP_CHANGE") {
      formData = {
        activityType: activityType,
        fromCustomerId: activityForm.fromCustomerId,
        toCustomerId: activityForm.toCustomerId,
        // installer: activityForm.installer,
        // items: [...vehicleInventory.map((item: any) => item._id)],
        vehicles: [...activityForm?.vehicles],
      };
    }

    if (activityType == "CUSTOMER_DATA_UPDATE") {
      formData = {
        activityType: activityType,
        fromCustomerId: activityForm.fromCustomerId,
        customerData: activityForm.customerData,
      };
    }
    if (
      activityType == "TRANSFER" ||
      activityType == "REMOVE" ||
      activityType == "TEMPORARY_REMOVE" ||
      activityType == "REDO"
    ) {
      if (activityForm.fromVehicleId == "") {
        Swal.fire({
          text: `From Vehicle Field is empty`,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        setLoading(false);
        return;
      }

      if (activityForm.items.length == 0) {
        Swal.fire({
          text: `Please First Select the Items to proceed further`,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        setLoading(false);
        return;
      }

      if (activityForm.installer == "") {
        Swal.fire({
          text: `Installer Field is empty`,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        setLoading(false);
        return;
      }
    }
    if (activityType == "OWNERSHIP_CHANGE") {
      if (activityForm.fromCustomerId == "") {
        Swal.fire({
          text: `From Customer Field is empty`,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        setLoading(false);
        return;
      }

      if (activityForm.vehicles.length == 0) {
        Swal.fire({
          text: `Please First Select the Vehicles to proceed further`,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        setLoading(false);
        return;
      }

      if (activityForm.toCustomerId == "") {
        Swal.fire({
          text: `To Customer Field is empty`,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        setLoading(false);
        return;
      }
    }

    if (activityType == "CUSTOMER_DATA_UPDATE") {
      if (activityForm.fromCustomerId == "") {
        Swal.fire({
          text: `From Customer Field is empty`,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        setLoading(false);
        return;
      }
    }

    try {
      await create(formData, { url: CREATE_NEW_OPERATION_ACTIVITY }).then(
        (data: any) => {
          if (data !== undefined) {
            if (!data.success && data.message === ERROR_MESSAGE) {
              setLoading(false);
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);

              // setActivityForm
            }
            if (data.success) {
              dispatch(setActivityLoading(true));
              navigate(
                `${process.env.PUBLIC_URL}/company/modules/saio-central/operations/activity`
              );
              // getAll({ url: GET_ALL_ACTIVITIES }).then(
              //   (data: any) => {
              //     // // console.log("api call --- >", data);
              //     if (data !== undefined) {
              //       if (data.success) {
              //         // // console.log("hhg");
              //         dispatch(setActivities(data.data));
              //         dispatch(setActivityLoading(false))
              //         navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/operations/activity`)

              //       }
              //       else {
              //         setLoading(false);
              //       }
              //     }
              //   }
              // );
            }
          }
        }
      );
      // Handle successful post creation (e.g., show a success message, redirect, etc.)
    } catch (error: any) {
      // Handle error (e.g., show an error message)
      // console.error("Error creating post:", error);
      setLoading(false);
      setAddModal(false);
    }
    // }

    // else {
    //   Swal.fire({
    //     text: "Please Select all the fields",
    //     icon: "info",
    //     timer: 2000,
    //     showCancelButton: false,
    //     showConfirmButton: true,
    //   });
    //   setLoading(false);
    // }
  };

  const updateActivityStatus = async () => {
    setLoading(true);

    const updateActivityData = {
      installer: activityForm.installer,
      status: status,
      remarks: remarks,
    };

    try {
      const response: any = await update(updateActivityData, {
        url: `${UPDATE_OPERATION_STATUS}/${activitiy._id}`,
      });
      if (response.success) {
        dispatch(setActivityLoading(true));
        setLoading(false);
        setIsChangeStatus(!isChangeStatus);
        // const response: any = await getAll({ url: GET_ALL_ACTIVITIES });
        // if (response.success) {
        //   dispatch(setActivities(response.data));
        //   setLoading(false);
        //   setIsChangeStatus(!isChangeStatus)

        // }
      } else {
        Swal.fire({
          text: response.message,
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
        setIsChangeStatus(!isChangeStatus);
      }
    } catch (error: any) {
      Swal.fire({
        text: error.message || "Error creating Sale Invoice",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
      setIsChangeStatus(!isChangeStatus);
    }
  };

  return (
    <>
      <Row>
        {getActivityLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px 0px",
              fontSize: "24px",
            }}
          >
            Loading...
          </div>
        ) : (
          <Form onSubmit={addActivity} className="needs-validation" noValidate>
            <div>
              <Row
                className="g-3"
                style={{
                  padding: "30px 0px",
                }}
              >
                <Col lg={4} xs={12}>
                  <P>
                    Activity Type <span className="txt-danger">*</span>
                  </P>
                  <Input
                    type="text"
                    defaultValue={
                      activitiy !== null
                        ? formatUnderscoredString(activityForm.activityType)
                        : formatUnderscoredString(
                            localStorage.getItem("activityType")
                          )
                    }
                    disabled
                  />
                </Col>
                {activitiy == null && (
                  <Col lg={4} xs={12}>
                    <div>
                      <P>
                        Select Customer
                        <span className="txt-danger">*</span>
                      </P>
                    </div>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <Select
                        value={
                          activityForm.fromCustomerId !== ""
                            ? activityForm.fromCustomerId
                            : null
                        }
                        showSearch
                        style={{ width: "100%", height: 36 }}
                        placeholder="Select Customer"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={async (e: any) => {
                          setCustomer(e);
                          setIsCustomerDataEdited(false);
                          setActivityForm((prevState: any) => ({
                            ...prevState,
                            fromCustomerId: e,
                          }));

                          setCustomerVehiclesLoading(true);
                          setCustomerVehicles([]);

                          // // console.log(e);
                          const customerVehicles: any = await getAll({
                            url: `${GET_ALL_CUSTOMER_VEHICLES}/${e}`,
                          });

                          if (customerVehicles?.success) {
                            // console.log("customerVehicles", customerVehicles);
                            setCustomerVehicles(customerVehicles.data);
                            setCustomerVehiclesLoading(false);
                          }
                          if (!customerVehicles?.success) {
                            setCustomerVehiclesLoading(false);
                          }
                        }}
                        options={[
                          ...customers.map((item: any, index: any) => {
                            return {
                              value: item?._id,
                              label: item?.fullName,
                            };
                          }),
                        ]}
                      />
                      {activityType == "CUSTOMER_DATA_UPDATE" &&
                        activityForm.fromCustomerId !== "" && (
                          <Button
                            color="primary"
                            onClick={() => {
                              setIsChangeCustomerDataModalOpen(
                                !isChangeCustomerDataModalOpen
                              );
                            }}
                            style={{
                              padding: "5px 10px",
                              marginLeft: "10px",
                            }}
                          >
                            Change
                          </Button>
                        )}
                    </div>
                  </Col>
                )}

                {activitiy !== null &&
                  (activityForm.activityType == "OWNERSHIP_CHANGE" ||
                    activityForm.activityType == "CUSTOMER_DATA_UPDATE") && (
                    <Col lg={4} xs={12}>
                      <div>
                        <P>
                          Customer
                          <span className="txt-danger">*</span>
                        </P>
                      </div>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <Input
                          type="text"
                          placeholder="Enter Customer"
                          value={activityForm.fromCustomerId}
                          name="Customer"
                          disabled
                        />
                      </div>
                    </Col>
                  )}

                {(activityType === "TRANSFER" ||
                  activityType === "REMOVE" ||
                  activityType === "TEMPORARY_REMOVE" ||
                  activityType === "REDO") &&
                  activitiy == null && (
                    <Col lg={4} xs={12}>
                      <P>
                        From Vehicle <span className="txt-danger">*</span>
                      </P>
                      <Select
                        value={
                          activityForm.fromVehicleId !== ""
                            ? activityForm.fromVehicleId
                            : null
                        }
                        showSearch
                        style={{ width: "100%", height: 36 }}
                        placeholder="Select From Vehicle"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={async (e: any) => {
                          setActivityForm((prevState: any) => ({
                            ...prevState,
                            fromVehicleId: e,
                            items:
                              e !== prevState.fromVehicleId
                                ? []
                                : prevState.items, // Clear items array if value changes
                          }));
                          setVehicleInventory([]);
                          const vehicle = customerVehicles.find(
                            (item: any) => item._id == e
                          );
                          setVehicleInventory(vehicle?.inventory || []);
                          // console.log("inventory", vehicle?.inventory);
                        }}
                        options={customerVehicles.map((item: any) => ({
                          value: item?._id,
                          label: item?.registrationNo,
                        }))}
                      />
                    </Col>
                  )}

                {activitiy !== null &&
                  (activityForm.activityType == "TRANSFER" ||
                    activityForm.activityType == "REMOVE" ||
                    activityForm.activityType == "TEMPORARY_REMOVE" ||
                    activityForm.activityType == "REDO") && (
                    <Col lg={4} xs={12}>
                      <div>
                        <P>
                          From Vehicle
                          <span className="txt-danger">*</span>
                        </P>
                      </div>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <Input
                          type="text"
                          placeholder="Enter Vehicle"
                          value={activityForm.fromVehicleId}
                          name="Customer"
                          disabled
                        />
                      </div>
                    </Col>
                  )}

                {activitiy !== null && (
                  <Col lg={4} xs={12}>
                    <div>
                      <P>
                        Status
                        <span className="txt-danger">*</span>
                      </P>
                    </div>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <Select
                        disabled={activitiy !== null && !isChangeStatus}
                        value={status}
                        showSearch
                        style={{ width: "100%", height: 36 }}
                        placeholder="Select Status"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any) => {
                          setStatus(e);
                        }}
                        options={activityStatus.map((status: any) => ({
                          value: status?.value,
                          label: status?.label,
                        }))}
                      />
                    </div>
                  </Col>
                )}
              </Row>
              {activitiy == null && vehicleInventory?.length > 0 && (
                <Row
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "5px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <P>Select Inventory</P>
                    {activityType == "REDO" && (
                      <Button
                        color="primary"
                        onClick={() => {
                          setIsAddInventoryModalOpen(!isAddInventoryModalOpen);
                        }}
                        style={{
                          padding: "3px 10px",
                        }}
                      >
                        Add Inventory
                      </Button>
                    )}
                  </div>

                  <div style={{ height: "10px" }}></div>
                  {vehicleInventory.map((item: any, index) => (
                    <Col sm={12} key={index}>
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
                          value={item}
                          checked={activityForm?.items.includes(item._id)}
                          onChange={() => {
                            // console.log("activityForm", activityForm);

                            setActivityForm({
                              ...activityForm,
                              items: activityForm?.items.includes(item._id)
                                ? activityForm?.items.filter(
                                    (i: any) => i !== item._id
                                  ) // Remove if unchecked
                                : [...activityForm?.items, item._id], // Add if checked
                            });
                          }}
                          style={{ display: "none" }}
                        />
                        <span
                          onClick={(e) => e.stopPropagation()}
                          className="green"
                        ></span>
                        <div
                          style={{
                            marginBottom: "-10px",
                            display: "flex",
                            width: "800px",
                            justifyContent: "space-between",
                          }}
                        >
                          <P>
                            {item?.productName} | {item?.serialNumber} |{" "}
                            {item?.sku !== "" ? item?.sku : "N/A"}
                          </P>

                          {activityForm?.items.includes(item._id) && (
                            <Button
                              color="primary"
                              onClick={() => {
                                setProductId(item?.product);
                                setItemId(item?._id);
                                setAddModal(!addModal);
                              }}
                              style={{
                                padding: "3px 10px",
                              }}
                            >
                              Create Adjustment
                            </Button>
                          )}
                        </div>
                      </label>
                    </Col>
                  ))}
                </Row>
              )}

              {activitiy !== null && activityForm?.items?.length > 0 && (
                <Row
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "5px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <P>Inventory</P>
                  </div>

                  <div style={{ height: "10px" }}></div>
                  {activityForm?.items?.map((item: any, index: any) => (
                    <Col sm={12} key={index}>
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
                          value={item}
                          checked={true}
                          disabled
                          style={{ display: "none" }}
                        />
                        <span
                          onClick={(e) => e.stopPropagation()}
                          className="green"
                        ></span>
                        <div
                          style={{
                            marginBottom: "-10px",
                            display: "flex",
                            width: "800px",
                            justifyContent: "space-between",
                          }}
                        >
                          <P>
                            {item?.productName} | {item?.serialNumber} |{" "}
                            {item?.sku !== "" ? item?.sku : "N/A"}
                          </P>
                        </div>
                      </label>
                    </Col>
                  ))}
                </Row>
              )}

              {activitiy == null && newInventories.length > 0 && (
                <Row
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "5px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <P>New Inventory</P>
                  </div>

                  <div style={{ height: "10px" }}></div>
                  {newInventories.map((item: any, index: any) => (
                    <Col sm={12} key={index}>
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
                          value={item}
                          checked={true}
                          disabled
                          onChange={() => {
                            // console.log("activityForm", activityForm);
                          }}
                          style={{ display: "none" }}
                        />
                        <span
                          onClick={(e) => e.stopPropagation()}
                          className="green"
                        ></span>
                        <div
                          style={{
                            marginBottom: "-10px",
                            display: "flex",
                            width: "800px",
                            justifyContent: "space-between",
                          }}
                        >
                          <P>
                            {item?.productName} | {item?.serialNumber} |{" "}
                            {item?.sku !== "" ? item?.sku : "N/A"}
                          </P>

                          {
                            <Button
                              color="secondary"
                              onClick={() => {
                                const filteredInventories =
                                  newInventories.filter(
                                    (item: any, i: any) => index !== i
                                  );
                                setNewInventories(filteredInventories);
                              }}
                              style={{
                                padding: "3px 10px",
                              }}
                            >
                              Remove
                            </Button>
                          }
                        </div>
                      </label>
                    </Col>
                  ))}
                </Row>
              )}

              {activitiy == null &&
                activityType == "OWNERSHIP_CHANGE" &&
                customerVehicles.length > 0 && (
                  <Row
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <P>Select Vehicles</P>
                    </div>

                    <div style={{ height: "10px" }}></div>
                    {customerVehicles.map((vehicle: any, index: any) => (
                      <Col sm={12} key={index}>
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
                            value={vehicle._id}
                            checked={activityForm?.vehicles?.includes(
                              vehicle?._id
                            )}
                            onChange={() => {
                              // console.log("activityForm", activityForm);

                              setActivityForm({
                                ...activityForm,
                                vehicles: activityForm?.vehicles?.includes(
                                  vehicle?._id
                                )
                                  ? activityForm?.vehicles?.filter(
                                      (i: any) => i !== vehicle._id
                                    ) // Remove if unchecked
                                  : [...activityForm?.vehicles, vehicle._id],
                              });
                            }}
                            style={{ display: "none" }}
                          />
                          <span
                            onClick={(e) => e.stopPropagation()}
                            className="green"
                          ></span>
                          <div
                            style={{
                              marginBottom: "-10px",
                              display: "flex",
                              width: "800px",
                              justifyContent: "space-between",
                            }}
                          >
                            <P>{vehicle?.registrationNo}</P>
                          </div>
                        </label>
                      </Col>
                    ))}
                  </Row>
                )}

              {activitiy !== null &&
                activityForm.activityType == "OWNERSHIP_CHANGE" &&
                activityForm.vehicles.length > 0 && (
                  <Row
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <P>Vehicles</P>
                    </div>

                    <div style={{ height: "10px" }}></div>
                    {activityForm.vehicles.map((vehicle: any, index: any) => (
                      <Col sm={12} key={index}>
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
                            value={vehicle._id}
                            checked={true}
                            disabled
                            style={{ display: "none" }}
                          />
                          <span
                            onClick={(e) => e.stopPropagation()}
                            className="green"
                          ></span>
                          <div
                            style={{
                              marginBottom: "-10px",
                              display: "flex",
                              width: "800px",
                              justifyContent: "space-between",
                            }}
                          >
                            <P>{vehicle?.registrationNo}</P>
                          </div>
                        </label>
                      </Col>
                    ))}
                  </Row>
                )}

              <Row className="g-3">
                <>
                  {activitiy == null &&
                    activityType === "TRANSFER" &&
                    activityForm.fromVehicleId !== "" && (
                      <Col lg={4} xs={12}>
                        <P>
                          To Vehicle <span className="txt-danger">*</span>
                        </P>
                        <Select
                          showSearch
                          style={{ width: "100%", height: 36 }}
                          placeholder="Select To Vehicle"
                          optionFilterProp="children"
                          filterOption={(input: any, option: any) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          filterSort={(optionA: any, optionB: any) =>
                            (optionA?.P ?? "")
                              .toLowerCase()
                              .localeCompare((optionB?.P ?? "").toLowerCase())
                          }
                          onChange={(e: any) => {
                            setActivityForm((prevState: any) => ({
                              ...prevState,
                              toVehicleId: e,
                            }));
                          }}
                          options={customerVehicles
                            .filter(
                              (i: any) => i._id !== activityForm?.fromVehicleId
                            )
                            .map((item: any) => ({
                              value: item?._id,
                              label: item?.registrationNo,
                            }))}
                        />
                      </Col>
                    )}

                  {activitiy !== null &&
                    activityForm.activityType === "TRANSFER" && (
                      <Col lg={4} xs={12}>
                        <P>
                          To Vehicle <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="text"
                          placeholder="Enter To Vehicle"
                          value={activityForm.toVehicleId}
                          name="Vehicle"
                          disabled
                        />
                      </Col>
                    )}
                  {activitiy == null &&
                    activityType === "OWNERSHIP_CHANGE" &&
                    activityForm.fromCustomerId !== "" && (
                      <Col lg={4} xs={12}>
                        <div>
                          <P>
                            Change Customer
                            <span className="txt-danger">*</span>
                          </P>
                        </div>
                        <Select
                          showSearch
                          style={{ width: "100%", height: 36 }}
                          placeholder="Select Customer"
                          optionFilterProp="children"
                          filterOption={(input: any, option: any) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          filterSort={(optionA: any, optionB: any) =>
                            (optionA?.P ?? "")
                              .toLowerCase()
                              .localeCompare((optionB?.P ?? "").toLowerCase())
                          }
                          onChange={async (e: any) => {
                            setActivityForm((prevState: any) => ({
                              ...prevState,
                              toCustomerId: e,
                            }));
                          }}
                          options={[
                            ...customers.map((item: any, index: any) => {
                              return {
                                value: item?._id,
                                label: item?.fullName,
                              };
                            }),
                          ]}
                        />
                        {/* <SelectVendorBox placeholder="Select Vendor" setVendor={setVendor} vendor={vendor} /> */}
                      </Col>
                    )}

                  {activitiy !== null &&
                    activityForm.activityType === "OWNERSHIP_CHANGE" && (
                      <Col lg={4} xs={12}>
                        <div>
                          <P>
                            To Customer
                            <span className="txt-danger">*</span>
                          </P>
                        </div>
                        <Input
                          type="text"
                          placeholder="Enter Customer"
                          value={activityForm.toCustomerId}
                          name="Customer"
                          disabled
                        />
                      </Col>
                    )}

                  {activitiy == null &&
                    (activityType === "TRANSFER" ||
                      activityType === "REMOVE" ||
                      activityType === "TEMPORARY_REMOVE" ||
                      activityType === "REDO") &&
                    (activityForm.fromVehicleId !== "" ||
                      activityForm.toCustomerId !== "") && (
                      <Col lg={4} xs={12}>
                        <P>
                          Select Installer <span className="txt-danger">*</span>
                        </P>
                        <Select
                          showSearch
                          style={{ width: "100%", height: 36 }}
                          placeholder="Select Installer"
                          optionFilterProp="children"
                          filterOption={(input: any, option: any) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          filterSort={(optionA: any, optionB: any) =>
                            (optionA?.P ?? "")
                              .toLowerCase()
                              .localeCompare((optionB?.P ?? "").toLowerCase())
                          }
                          onChange={(e: any) => {
                            setActivityForm((prevState: any) => ({
                              ...prevState,
                              installer: e,
                            }));
                          }}
                          options={installers
                            .filter((item: any) => item.isActive == true)
                            .map((installer: any) => ({
                              value: installer?._id,
                              label: installer?.fullName,
                            }))}
                        />
                      </Col>
                    )}

                  {activitiy !== null &&
                    (activityForm.activityType === "TRANSFER" ||
                      activityForm.activityType === "REMOVE" ||
                      activityForm.activityType === "TEMPORARY_REMOVE" ||
                      activityForm.activityType === "REDO") && (
                      <Col lg={4} xs={12}>
                        <P>
                          Installer <span className="txt-danger">*</span>
                        </P>

                        <Select
                          disabled={activitiy !== null && !isChangeStatus}
                          value={activityForm.installer}
                          showSearch
                          style={{ width: "100%", height: 36 }}
                          placeholder="Select Installer"
                          optionFilterProp="children"
                          filterOption={(input: any, option: any) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          filterSort={(optionA: any, optionB: any) =>
                            (optionA?.P ?? "")
                              .toLowerCase()
                              .localeCompare((optionB?.P ?? "").toLowerCase())
                          }
                          onChange={(e: any) => {
                            setActivityForm((prevState: any) => ({
                              ...prevState,
                              installer: e,
                            }));
                          }}
                          options={installers
                            .filter((item: any) => item.isActive == true)
                            .map((installer: any) => ({
                              value: installer?._id,
                              label: installer?.fullName,
                            }))}
                        />
                      </Col>
                    )}
                </>
              </Row>

              <Row
                className="g-3"
                style={{ marginBottom: "15px", marginTop: "10px" }}
              >
                <Col lg={12} xs={12}>
                  <P>Remarks</P>
                  <textarea
                    className="form-control"
                    placeholder="Enter remarks"
                    rows={4.5}
                    style={{
                      maxHeight: "200px",
                      resize: "vertical",
                    }}
                    value={remarks}
                    name="remarks"
                    onChange={(e) => setRemarks(e.target.value)}
                    disabled={activitiy !== null && !isChangeStatus}
                  />
                </Col>
              </Row>

              <Row className="g-3">
                <Col
                  xs={12}
                  className="text-end d-flex justify-content-end gap-2 align-center"
                  style={{ marginTop: "20px" }}
                >
                  <Button
                    color="secondary"
                    onClick={() => {
                      localStorage.removeItem("activityType");
                      navigate(
                        `${process.env.PUBLIC_URL}/company/modules/saio-central/operations/activity`
                      );
                    }}
                  >
                    Cancel
                  </Button>
                  {activitiy == null && (
                    <Button
                      color="primary"
                      onClick={() => {
                        addActivity();
                      }}
                    >
                      {loading ? "Loading..." : "Create"}
                    </Button>
                  )}

                  {activitiy !== null && (
                    <Button
                      color="primary"
                      onClick={() => {
                        if (isChangeStatus) {
                          updateActivityStatus();
                        } else {
                          setIsChangeStatus(!isChangeStatus);
                        }
                      }}
                    >
                      {isChangeStatus
                        ? loading
                          ? "Loading..."
                          : "Save"
                        : "Edit"}
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
          </Form>
        )}
      </Row>

      {addModal && (
        <SelectAdjustmentTypeModal
          addModal={addModal}
          setAddModal={setAddModal}
          setProductId={setProductId}
          setItemId={setItemId}
          productId={productId}
          itemId={itemId}
          setVehicleInventory={setVehicleInventory}
          vehicleInventory={vehicleInventory}
          vehicleId={activityForm.fromVehicleId}
        />
      )}

      {isAddInventoryModalOpen && (
        <AddInventoryItemModal
          isVisible={isAddInventoryModalOpen}
          setIsVisible={setIsAddInventoryModalOpen}
          newInventories={newInventories}
          setNewInventories={setNewInventories}
        />
      )}

      {isChangeCustomerDataModalOpen && (
        <ChangeCustomerDataModal
          isVisible={isChangeCustomerDataModalOpen}
          setIsVisible={setIsChangeCustomerDataModalOpen}
          customer={activityForm.fromCustomerId}
          isCustomerDataEdited={isCustomerDataEdited}
          setIsCustomerDataEdited={setIsCustomerDataEdited}
          setActivityForm={setActivityForm}
          activityForm={activityForm}
        />
      )}
    </>
  );
};

export default CreateNewActivity;
