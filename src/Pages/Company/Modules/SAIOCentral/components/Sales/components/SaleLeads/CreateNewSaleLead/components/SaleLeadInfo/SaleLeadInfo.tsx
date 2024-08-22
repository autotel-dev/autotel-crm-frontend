import { ChangeEvent, useEffect, useState } from "react";
import ShowError from "../../ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { BusinessFormCommonProps } from "../../../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import { P } from "../../../../../../../../../../../AbstractElements";
import SelectCitiesBox from "./components/SelectCitiesBox";
import SelectPackageBox from "./components/SelectPackageBox";
import SelectProvincesBox from "./components/SelectProvincesBox";
import { create, getAll, patch, update } from "../../../../../../../../../../../Utilities/api";
import { CONFIRM_OR_REJECT_SALELEAD, CREATE_NEW_LEAD, GET_ALL_SALELEADS, GET_SINGLE_CUSTOMERS, GET_SINGLE_SALELEAD, UPDATE_SALE_LEAD } from "../../../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../../../Utilities/constants/constants";
import Swal from "sweetalert2";
import { setSaleLeadId, setSaleLeads, setIsConnected, setCustomer, setSaleLead } from "../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import { Select } from "antd";
import { formatUnderscoredString } from "../../../../../../../../../../../Utilities/globals/globals";

interface SaleLeadInfoProps {
  callbackActive: (val: number | undefined) => void;
  iscreateNewSaleLead: boolean;
  setIscreateNewSaleLead: any;

}

const SaleLeadInfo = ({ callbackActive, iscreateNewSaleLead, setIscreateNewSaleLead }: SaleLeadInfoProps) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const { customer, saleLead } = useSelector((state: any) => state.sales);
  console.log("saleLead", saleLead);

  const dispatch = useDispatch();
  const [saleLeadInfoForm, setSaleLeadInfoForm] = useState({
    customerName: "",
    customerContactNo: "",
    discountedServiceCharges: "",
    requirements: "",
    totalNoOfVehicles: ""
  });
  const {
    customerName,
    customerContactNo,
    discountedServiceCharges,
    requirements,
    totalNoOfVehicles
  } = saleLeadInfoForm;

  const [city, setCity] = useState("");
  const [packagee, setPackage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saleLeadLoading, setSaleLeadLoading] = useState(saleLead !== null ? true : false);
  const [customerLoading, setCustomerLoading] = useState(customer !== null ? true : false)

  const getUserData = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let name = event.target.name;
    let value = name == "discountedServiceCharges" ? Number(event.target.value) :
      event.target.value;
    setSaleLeadInfoForm({ ...saleLeadInfoForm, [name]: value });
  };

  const [isEditSaleLeadInfo, setIsEditSaleLeadInfo] = useState(saleLead !== null ? true : false)

  const createLead = async () => {
    setLoading(true);
    if (
      customerName !== "" &&
      customerContactNo !== "" &&
      city !== "" &&
      // province !== "" &&
      packagee !== "" && discountedServiceCharges !== "" && requirements !== ""
    ) {
      console.log("this");

      const body = {
        ...saleLeadInfoForm,
        city: city,
        package: packagee,
        isExistingCustomer: customer !== null ? true : false,
        customer: customer !== null && customer,

      }

      try {
        await create(body, { url: CREATE_NEW_LEAD }).then((data: any) => {
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
              dispatch(setSaleLeadId(data.data.saleLead._id))
              console.log("data.data.saleLead._id", data.data.saleLead._id);
              if (customer !== null) {
                getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {

                  if (data !== undefined) {
                    if (!data.success && data.message === ERROR_MESSAGE) {
                      dispatch(setIsConnected(true));
                    }
                    if (!data.success) {
                      Swal.fire({
                        text: `${data.message}`,
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                      // setIscreateNewSaleLead(false)
                    }
                    if (data.success) {
                      // setIscreateNewSaleLead(false)
                      // // console.log("hhg");
                      dispatch(setSaleLeads(data.data));
                    }
                  }
                });
                setLoading(false);
                callbackActive(2);
              }
              else {
                getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {

                  if (data !== undefined) {
                    if (!data.success && data.message === ERROR_MESSAGE) {
                      dispatch(setIsConnected(true));
                    }
                    if (!data.success) {
                      Swal.fire({
                        text: `${data.message}`,
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                      setIscreateNewSaleLead(false)

                    }
                    if (data.success) {
                      // if (!isEditSaleLeadInfo) {
                      setIscreateNewSaleLead(false)
                      // }
                      // // console.log("hhg");
                      dispatch(setSaleLeads(data.data));
                    }
                  }
                });
                // callbackActive(2);
                setLoading(false);
              }

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

  const updateLead = async () => {
    setLoading(true);
    if (
      customerName !== "" &&
      customerContactNo !== "" &&
      city !== "" &&
      // province !== "" &&
      packagee !== "" && discountedServiceCharges !== "" && requirements !== ""
    ) {
      console.log("this");

      const body = {
        ...saleLeadInfoForm,
        city: city,
        package: packagee,
        isExistingCustomer: customer !== null ? true : false,
        customer: customer !== null && customer,
      }

      try {
        await update(body, { url: `${UPDATE_SALE_LEAD}/${saleLead._id}` }).then((data: any) => {
          console.log("update data", data);

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
              setIsEditSaleLeadInfo(true)
              getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {

                if (data !== undefined) {
                  if (data.success) {
                    // if (!isEditSaleLeadInfo) {
                    setLoading(false);
                    dispatch(setSaleLeads(data.data));
                    getAll({ url: `${GET_SINGLE_SALELEAD}/${saleLead._id}` }).then((data: any) => {
                      if (data !== undefined) {
                        if (data.success) {
                          dispatch(setSaleLead(data.data));
                        }
                      }
                    });
                  }
                  else {
                    setLoading(false);
                  }
                }
              });
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

  const [rejectLoading, setRejectLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);



  const acceptOrRejectSaleLead = async (status: any) => {
    if (status == "CONFIRMED") {
      setConfirmLoading(true);
    }
    else {
      setRejectLoading(true)
    }


    const body = {
      status: status
    };

    try {
      await patch(body, { url: `${CONFIRM_OR_REJECT_SALELEAD}/${saleLead._id}` }).then((data: any) => {
        if (data !== undefined) {
          if (
            !data.success &&
            data.message === ERROR_MESSAGE
          ) {
            setConfirmLoading(false);
            setRejectLoading(false)
            console.log("data.message", data.message);

          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setConfirmLoading(false);
            setRejectLoading(false)

          }
          if (data.success) {
            if (status == "CONFIRMED") {
              dispatch(setSaleLeadId(saleLead._id))
              if (data.data.customer !== null) {
                getAll({ url: `${GET_SINGLE_CUSTOMERS}/${data.data.customer}` }).then((data: any) => {
                  if (data !== undefined) {
                    if (data.success) {
                      dispatch(setCustomer(data.data))
                    }
                  }
                });
              }

              getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {

                if (data !== undefined) {
                  if (data.success) {
                    // setIscreateNewSaleLead(false);
                    dispatch(setSaleLeads(data.data));
                  }
                }
              });
              getAll({ url: `${GET_SINGLE_SALELEAD}/${saleLead._id}` }).then((data: any) => {

                if (data !== undefined) {

                  if (!data.success) {
                    Swal.fire({
                      text: `${data.message}`,
                      icon: "error",
                      timer: 2000,
                      showConfirmButton: false,
                    });
                  }
                  if (data.success) {
                    dispatch(setSaleLead(data.data));

                  }
                }
              });
              setConfirmLoading(false);
              setRejectLoading(false)
              callbackActive(2);

            }
            else {
              dispatch(setCustomer(null));
              dispatch(setSaleLeadId(""));
              getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {

                if (data !== undefined) {
                  if (!data.success && data.message === ERROR_MESSAGE) {
                    dispatch(setIsConnected(true));
                  }
                  if (!data.success) {
                    Swal.fire({
                      text: `${data.message}`,
                      icon: "error",
                      timer: 2000,
                      showConfirmButton: false,
                    });
                    setIscreateNewSaleLead(false)
                  }
                  if (data.success) {
                    setIscreateNewSaleLead(false);
                    dispatch(setSaleLeads(data.data));
                  }
                }
              });
              // callbackActive(2);
              setConfirmLoading(false);
              setRejectLoading(false)
            }

          }
        }
      });
      // Handle successful post creation (e.g., show a success message, redirect, etc.)
    } catch (error: any) {
      // Handle error (e.g., show an error message)
      // console.error("Error creating post:", error);
      setLoading(false);
    }


  };

  useEffect(() => {
    if (customer !== null) {
      getAll({ url: `${GET_SINGLE_CUSTOMERS}/${customer}` }).then((data: any) => {

        if (data !== undefined) {
          if (!data.success && data.message === ERROR_MESSAGE) {
            dispatch(setIsConnected(true));
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setCustomerLoading(false)
          }
          if (data.success) {

            setSaleLeadInfoForm({
              ...saleLeadInfoForm,
              customerName: data.data !== null ? data.data.fullName : "",
              customerContactNo: data.data !== null ? data.data.phoneNo : "",
            })
            setCity(data.data !== null ? data.data.city._id : city);
            dispatch(setCustomer(data.data));

            setCustomerLoading(false)
          }
        }
      });
    }
  }, []);

  // useEffect(() => {

  // }, [saleLead])

  useEffect(() => {
    if (saleLead !== null) {

      if (saleLead.status == "NEW" || saleLead.status == "REJECTED" || saleLead.status == "IN_PROGRESS" || saleLead.status == "CONFIRMED" || saleLead.status == "COMPLETED" || saleLead.status == "INSTALLATION" || saleLead.status == "INSTALLED") {
        getAll({ url: `${GET_SINGLE_SALELEAD}/${saleLead.id}` }).then((data: any) => {
          dispatch(setSaleLead(null));
          if (data !== undefined) {
            if (!data.success && data.message === ERROR_MESSAGE) {
              dispatch(setIsConnected(true));
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setCustomerLoading(false)
            }
            if (data.success) {

              setSaleLeadInfoForm({
                ...saleLeadInfoForm,
                customerName: data.data !== null ? data.data.customerName : "",
                customerContactNo: data.data !== null ? data.data.customerContactNo : "",
                discountedServiceCharges: data.data !== null ? data.data.discountedServiceCharges : "",
                totalNoOfVehicles: data.data !== null ? data.data?.totalNoOfVehicles : "",
                requirements: data.data !== null ? data.data.requirements : "",
              })
              setCity(data.data !== null ? data.data.city._id : city);
              setPackage(data.data !== null ? data.data.package._id : packagee);
              dispatch(setSaleLead(data.data));
              if (saleLead !== null) {
                if (data.data.status == "CONFIRMED" || data.data.status == "IN_PROGRESS" || data.data.status == "INSTALLATION" || data.data.status == "INSTALLED" || data.data.status == "COMPLETED") {
                  if (data.data.status == "COMPLETED") {
                    callbackActive(1)
                    console.log("Tab 7");
                    setSaleLeadLoading(false);
                  }

                  else if (data.data.customer !== null && data.data?.vehicles.length == data.data?.totalNoOfVehicles && data.data?.vehicles?.every((item: any) => item?.inventory?.length > 0) && data.data?.vehicles.every((item: any) => item?.installationStatus == "INSTALLED") && data.data?.vehicles.every((item: any) => item.securityBriefing.authenticationCredentials.username !== "") && data.data.status == "INSTALLED") {
                    callbackActive(7)
                    console.log("Tab 7");
                    setSaleLeadLoading(false);

                  }
                  // console.log(saleLead.customer, saleLead.vehicle);
                  else if (data.data.customer !== null && data.data?.vehicles.length == data.data?.totalNoOfVehicles && data.data?.vehicles?.every((item: any) => item?.inventory?.length > 0) && data.data?.vehicles.every((item: any) => item?.installationStatus == "INSTALLED") && data.data.status == "INSTALLED") {
                    callbackActive(6)
                    console.log("Tab 6");
                    setSaleLeadLoading(false);

                  }
                  else if (data.data.customer !== null && data.data?.vehicles.length == data.data?.totalNoOfVehicles && data.data?.vehicles?.every((item: any) => item?.inventory?.length > 0)) {
                    callbackActive(5)
                    console.log("Tab 5");
                    setSaleLeadLoading(false);
                  }

                  else if (data.data.customer !== null && data.data?.vehicles.length == data.data?.totalNoOfVehicles) {
                    callbackActive(4)
                    console.log("Tab 4");
                    setSaleLeadLoading(false);
                  }
                  else if (data.data.customer !== null && data.data?.vehicles?.length < data.data?.totalNoOfVehicles) {
                    callbackActive(3)
                    setSaleLeadLoading(false);
                  }
                  else {
                    callbackActive(2)
                    setSaleLeadLoading(false);
                  }

                }

              }
              setSaleLeadLoading(false)
              getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {

                if (data !== undefined) {
                  if (data.success) {
                    // // console.log("hhg");
                    dispatch(setSaleLeads(data.data));
                  }
                }
              });
              setCustomerLoading(false)
            }
          }
        });
      }


    }
  }, []);


  return (
    <Form
      onSubmit={(event) => event.preventDefault()}
      className="needs-validation"
      noValidate
    >
      {
        saleLeadLoading ? <h1>Loading...</h1> : <Row className="g-3">
          <Col xl={4} xs={12}>
            <P>
              Customer Name
              <span className="txt-danger">*</span>
            </P>
            <Input
              type="text"
              placeholder="Enter Customer Name"
              value={customerName}
              name="customerName"
              disabled={isEditSaleLeadInfo}
              onChange={getUserData}
            />
          </Col>
          <Col xl={4} xs={12}>
            <P>
              Customer Contact No
              <span className="txt-danger">*</span>
            </P>
            <Input
              type="text"
              placeholder="Enter Customer Contact No"
              value={customerContactNo}
              name="customerContactNo"
              disabled={isEditSaleLeadInfo}
              onChange={getUserData}
            />
          </Col>

          <Col xl={4} xs={12}>
            <div>
              <P>
                Select City
                <span className="txt-danger">*</span>
              </P>
            </div>
            <SelectCitiesBox placeholder="Select City" setCity={setCity} city={city} disabled={isEditSaleLeadInfo} />
          </Col>
          <Col xl={4} xs={12}>
            <div>
              <P>
                Select Package
                <span className="txt-danger">*</span>
              </P>
            </div>
            <SelectPackageBox placeholder="Select Package" setPackage={setPackage} packagee={packagee} disabled={isEditSaleLeadInfo} />
          </Col>

          {/* <Col xl={4} xs={12}>
          <div>
            <P>
              Select Province
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectProvincesBox placeholder="Select Province" />
        </Col> */}

          <Col xl={4} xs={12}>
            <P>
              Discounted Service Charges
              <span className="txt-danger">*</span>
            </P>
            <Input
              type="text"
              placeholder="Enter Discounted Service Charges"
              value={discountedServiceCharges}
              name="discountedServiceCharges"
              disabled={isEditSaleLeadInfo}
              onChange={getUserData}
            />
          </Col>

          {/* <Col xl={4} xs={12}>
          <P>
            Number Of Vehicles
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Discounted Service Charges"
            value={totalNoOfVehicles}
            name="totalNoOfVehicles"
            onChange={getUserData}
          />
        </Col> */}

          <Col xl={4} xs={12}>
            <div>
              <P>
                Select Number Of Vehicles
                <span className="txt-danger">*</span>
              </P>
            </div>
            <Select
              showSearch
              value={totalNoOfVehicles !== "" ? totalNoOfVehicles : null}
              style={{ width: "100%", height: 36 }}
              placeholder="Select Vehicles"
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                (option?.label ?? "").includes(input)
              }
              onChange={(e) => {
                if (e < totalNoOfVehicles) {
                  Swal.fire({
                    text: `You are not selected the number ofvehicles less than vehicles added`,
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                }
                else {
                  setSaleLeadInfoForm({
                    ...saleLeadInfoForm,
                    totalNoOfVehicles: e
                  })
                }

              }}

              options={[
                { value: "1", label: "1" }, { value: "2", label: "2" },
                { value: "3", label: "3" }, { value: "4", label: "4" },
                { value: "5", label: "5" }, { value: "6", label: "6" },
                { value: "7", label: "7" }, { value: "8", label: "8" },
                { value: "9", label: "9" }, { value: "10", label: "10" },
                { value: "11", label: "11" }, { value: "12", label: "12" },
                { value: "13", label: "13" }, { value: "14", label: "14" },

              ]}
              disabled={isEditSaleLeadInfo}
            />
          </Col>
          <Col xl={12} xs={12}>
            <P>
              Requirements
              <span className="txt-danger">*</span>
            </P>
            <textarea
              className="form-control"
              placeholder="Enter Requirements"
              rows={3} // Minimum number of visible lines
              style={{
                maxHeight: "200px", // Maximum height for 5 lines of text
                resize: "vertical", // Allow vertical resizing within the specified range
              }}
              value={requirements}
              name="requirements"
              onChange={getUserData}
              disabled={isEditSaleLeadInfo}
            // {...register("description", { required: true })}
            />

          </Col>

          {
            saleLead?.status == "REJECTED" ? <Col xs={12} className="text-end d-flex justify-content-end gap-2 align-center">
              <Button color="secondary" onClick={() => {
                setIscreateNewSaleLead(false);
                dispatch(setSaleLead(null));
              }}>
                Cancel
              </Button>
              <Button color="primary" disabled>
                Rejected
              </Button>

            </Col> : saleLead?.status == "CONFIRMED" || saleLead?.status == "INSTALLATION" || saleLead?.status == "INSTALLED" || saleLead?.status == "COMPLETED" ? <Col xs={12} className="text-end d-flex justify-content-end gap-2 align-center">
              <Button color="secondary" onClick={() => {
                setIscreateNewSaleLead(false);
                dispatch(setSaleLead(null));
              }}>
                Cancel
              </Button>
              <Button color="primary" onClick={() => !isEditSaleLeadInfo ? updateLead() : setIsEditSaleLeadInfo(!isEditSaleLeadInfo)} disabled={saleLead?.status == "INSTALLED" || saleLead?.status == "COMPLETED"}>
                {saleLead?.status == "INSTALLED" || saleLead?.status == "COMPLETED" ? formatUnderscoredString(saleLead?.status) : loading ? "Loading..." : isEditSaleLeadInfo == false ? "Save" : "Edit"}
              </Button>

            </Col> : saleLead !== null ? <Col xs={12} className="text-end d-flex justify-content-end gap-2 align-center">
              <Button color="primary" onClick={() => {
                setIscreateNewSaleLead(false);
                dispatch(setSaleLead(null));
              }}>
                Cancel
              </Button>

              <Button color="secondary" onClick={() => { acceptOrRejectSaleLead("REJECTED") }}>
                {rejectLoading ? "Loading..." : "Reject"}
              </Button>
              <Button color="primary" onClick={() => { acceptOrRejectSaleLead("CONFIRMED") }}>
                {confirmLoading ? "Loading..." : "Confirm"}
              </Button>
            </Col> : <Col xs={12} className="text-end d-flex justify-content-end gap-2 align-center">
              <Button color="secondary" onClick={() => { dispatch(setCustomer(null)); dispatch(setSaleLeadId("")); setIscreateNewSaleLead(false) }}>
                Cancel
              </Button>
              <Button color="primary" onClick={() => createLead()}>
                {loading ? "Loading..." : "Create Lead"}
              </Button>
            </Col>
          }
        </Row>
      }
    </Form >
  );
};

export default SaleLeadInfo;
