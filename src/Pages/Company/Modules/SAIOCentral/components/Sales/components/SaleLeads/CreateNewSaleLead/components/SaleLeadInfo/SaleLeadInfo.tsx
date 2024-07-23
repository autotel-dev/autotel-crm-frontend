import { ChangeEvent, useEffect, useState } from "react";
import ShowError from "../../ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { BusinessFormCommonProps } from "../../../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import { P } from "../../../../../../../../../../../AbstractElements";
import SelectCitiesBox from "./components/SelectCitiesBox";
import SelectPackageBox from "./components/SelectPackageBox";
import SelectProvincesBox from "./components/SelectProvincesBox";
import { create, getAll, patch } from "../../../../../../../../../../../Utilities/api";
import { CONFIRM_OR_REJECT_SALELEAD, CREATE_NEW_LEAD, GET_ALL_SALELEADS, GET_SINGLE_CUSTOMERS, GET_SINGLE_SALELEAD } from "../../../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../../../Utilities/constants/constants";
import Swal from "sweetalert2";
import { setSaleLeadId, setSaleLeads, setIsConnected, setCustomer, setSaleLead } from "../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";

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
  });
  const {
    customerName,
    customerContactNo,
    discountedServiceCharges,
    requirements,
  } = saleLeadInfoForm;

  const [city, setCity] = useState("");
  const [packagee, setPackage] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(customer !== null ? true : false)

  const getUserData = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let name = event.target.name;
    let value = name == "discountedServiceCharges" ? Number(event.target.value) :
      event.target.value;
    setSaleLeadInfoForm({ ...saleLeadInfoForm, [name]: value });
  };

  const createLead = async () => {
    setLoading(true);
    if (
      customerName !== "" &&
      customerContactNo !== "" &&
      city !== "" &&
      // province !== "" &&
      packagee !== "" && discountedServiceCharges !== "" && requirements !== ""
    ) {
      const body = {
        ...saleLeadInfoForm,
        city: city,
        package: packagee,
        isExistingCustomer: customer !== null ? true : false,
        customer: customer !== null && customer
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
                      setIscreateNewSaleLead(false)
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

  useEffect(() => {
    if (saleLead !== null) {
      if (saleLead.status == "CONFIRMED") {
        if (saleLead.customer !== null && saleLead.vehicle !== null) {
          callbackActive(4)
        }
        else if (saleLead.customer !== null) {
          callbackActive(3)
        }
        else {
          callbackActive(2)
        }
      }

    }
  },[])

  useEffect(() => {
    if (saleLead !== null) {

      if (saleLead.status == "NEW" || saleLead.status == "REJECTED") {
        getAll({ url: `${GET_SINGLE_SALELEAD}/${saleLead.id}` }).then((data: any) => {

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
                requirements: data.data !== null ? data.data.requirements : "",
              })
              setCity(data.data !== null ? data.data.city._id : city);
              setPackage(data.data !== null ? data.data.package._id : packagee);
              dispatch(setSaleLead(data.data));

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
      <Row className="g-3">
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
          <SelectCitiesBox placeholder="Select City" setCity={setCity} city={city} />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Package
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectPackageBox placeholder="Select Package" setPackage={setPackage} packagee={packagee} />
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
            onChange={getUserData}
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
            <Button color="secondary" disabled>
              Rejected
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
            <Button color="primary" onClick={createLead}>
              {loading ? "Loading..." : "Create Lead"}
            </Button>
          </Col>
        }
      </Row>
    </Form >
  );
};

export default SaleLeadInfo;
