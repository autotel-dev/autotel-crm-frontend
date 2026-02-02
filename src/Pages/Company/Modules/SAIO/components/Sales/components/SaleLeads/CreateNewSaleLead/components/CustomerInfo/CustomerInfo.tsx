import { ChangeEvent, useEffect, useState } from "react";
import ShowError from "../../ShowError";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { P } from "../../../../../../../../../../../AbstractElements";
import { BusinessFormCommonProps } from "../../../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import {
  create,
  getAll,
  update,
} from "../../../../../../../../../../../Utilities/api";
import {
  CREATE_NEW_CUSTOMER,
  GET_ALL_SALELEADS,
  GET_SINGLE_SALELEAD,
  UPDATE_CUSTOMER,
} from "../../../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../../../Utilities/constants/constants";
import Swal from "sweetalert2";
import {
  setCustomer,
  setSaleLead,
  setSaleLeadId,
  setSaleLeads,
} from "../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import { useNavigate } from "react-router-dom";

interface CustomerInfoProps {
  callbackActive: (val: number | undefined) => void;
}

const CustomerInfo = ({ callbackActive }: CustomerInfoProps) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization,
  );
  const { customer, saleLead } = useSelector((state: any) => state.sales);
  // // console.log("saleLeadId", saleLeadId);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [personalDetailsForm, setPersonalDetailsForm] = useState({
    customerName: saleLead?.customerName,
    cnic: "",
    dob: "",
    additionalContactNo: "",
    officeNo: "",
    emailAddress: "",
    residentialNo: "",
    homeAddress: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({});
  const {
    customerName,
    cnic,
    dob,
    additionalContactNo,
    officeNo,
    emailAddress,
    residentialNo,
    homeAddress,
  } = personalDetailsForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setPersonalDetailsForm({ ...personalDetailsForm, [name]: value });
  };

  const [loading, setLoading] = useState(false);
  // // console.log("saleLeadId", saleLeadId);

  const [isEditCustomerInfo, setIsEditCustomerInfo] = useState(
    saleLead?.customer !== null ? true : false,
  );

  const createCustomer = async () => {
    setLoading(true);
    if (
      customerName !== "" &&
      cnic !== "" &&
      dob !== "" &&
      additionalContactNo !== "" &&
      officeNo !== "" &&
      emailAddress !== "" &&
      residentialNo !== "" &&
      homeAddress
    ) {
      try {
        await create(
          { ...personalDetailsForm, saleLeadId: saleLead?._id },
          { url: CREATE_NEW_CUSTOMER },
        ).then((data: any) => {
          if (data !== undefined) {
            if (!data.success && data.message === ERROR_MESSAGE) {
              setLoading(false);
              // // console.log("data.message", data.message);
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              dispatch(setCustomer(null));
              dispatch(setSaleLeadId(""));
            }
            if (data.success) {
              getAll({ url: `${GET_SINGLE_SALELEAD}/${saleLead?._id}` }).then(
                (data: any) => {
                  if (data !== undefined) {
                    if (data.success) {
                      dispatch(setSaleLead(data.data));
                      callbackActive(3);
                    }
                  }
                },
              );

              getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {
                if (data !== undefined) {
                  if (!data.success) {
                    Swal.fire({
                      text: `${data.message}`,
                      icon: "error",
                      timer: 2000,
                      showConfirmButton: false,
                    });
                    dispatch(setSaleLeadId(""));
                    dispatch(setCustomer(null));
                  }
                  if (data.success) {
                    dispatch(setSaleLeadId(""));
                    dispatch(setCustomer(null));
                    dispatch(setSaleLeads(data.data));
                  }
                }
                setLoading(false);
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

  const updateCustomer = async () => {
    setLoading(true);
    if (
      customerName !== "" &&
      cnic !== "" &&
      dob !== "" &&
      additionalContactNo !== "" &&
      officeNo !== "" &&
      emailAddress !== "" &&
      residentialNo !== "" &&
      homeAddress
    ) {
      try {
        await update(
          {
            ...personalDetailsForm,
            customerName: saleLead?.customerName,
            customerContactNo: saleLead?.customerContactNo,
            city: saleLead?.city._id,
            saleLeadId: saleLead?._id,
          },
          { url: `${UPDATE_CUSTOMER}/${saleLead?.customer?._id}` },
        ).then((data: any) => {
          if (data !== undefined) {
            if (!data.success && data.message === ERROR_MESSAGE) {
              setLoading(false);
              // // console.log("data.message", data.message);
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              setIsEditCustomerInfo(true);
            }
            if (data.success) {
              setLoading(false);
              setIsEditCustomerInfo(true);
              getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {
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
                    // // // // console.log("hhg");
                    dispatch(setSaleLeads(data.data));
                    setIsEditCustomerInfo(true);
                    getAll({
                      url: `${GET_SINGLE_SALELEAD}/${saleLead?._id}`,
                    }).then((data: any) => {
                      if (data !== undefined) {
                        if (data.success) {
                          dispatch(setSaleLead(data.data));
                        }
                      }
                    });
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

  useEffect(() => {
    if (customer !== null) {
      setPersonalDetailsForm({
        customerName: customer !== null ? saleLead?.customerName : "",
        cnic: customer !== null ? customer?.cnic : "",
        dob: customer !== null ? customer?.dob?.slice(0, 10) : "",
        additionalContactNo:
          customer !== null ? customer?.additionalContactNo : "",
        officeNo: customer !== null ? customer?.officeNo : "",
        emailAddress: customer !== null ? customer?.emailAddress : "",
        residentialNo: customer !== null ? customer?.residentialNo : "",
        homeAddress: customer !== null ? customer?.homeAddress : "",
      });
    }
  }, [customer]);

  useEffect(() => {
    if (saleLead?.customer !== null) {
      setPersonalDetailsForm({
        customerName:
          saleLead?.fullName !== null ? saleLead?.customer?.fullName : "",
        cnic: saleLead?.customer !== null ? saleLead?.customer?.cnic : "",
        dob:
          saleLead?.customer !== null
            ? saleLead?.customer?.dob?.slice(0, 10)
            : "",
        additionalContactNo:
          saleLead?.customer !== null
            ? saleLead?.customer?.additionalContactNo
            : "",
        officeNo:
          saleLead?.customer !== null ? saleLead?.customer?.officeNo : "",
        emailAddress:
          saleLead?.customer !== null ? saleLead?.customer?.emailAddress : "",
        residentialNo:
          saleLead?.customer !== null ? saleLead?.customer?.residentialNo : "",
        homeAddress:
          saleLead?.customer !== null ? saleLead?.customer?.homeAddress : "",
      });
    }
  }, [saleLead]);

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
            disabled={isEditCustomerInfo}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Company Name
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Company Name"
            // value={cnic}
            name="companyName"
            onChange={getUserData}
            disabled={isEditCustomerInfo}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            CNIC No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter CNIC No"
            value={cnic}
            name="cnic"
            onChange={getUserData}
            disabled={isEditCustomerInfo}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Date of Birth
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="date"
            placeholder="Enter Date of Birth"
            value={dob}
            name="dob"
            onChange={getUserData}
            disabled={isEditCustomerInfo}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Additional Contact No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Additional Contact No"
            value={additionalContactNo}
            name="additionalContactNo"
            onChange={getUserData}
            disabled={isEditCustomerInfo}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Office No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Office No"
            value={officeNo}
            name="officeNo"
            onChange={getUserData}
            disabled={isEditCustomerInfo}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Email Address
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Email Address"
            value={emailAddress}
            name="emailAddress"
            onChange={getUserData}
            disabled={isEditCustomerInfo}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Phone No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Phone No"
            value={residentialNo}
            name="residentialNo"
            onChange={getUserData}
            disabled={isEditCustomerInfo}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Address
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Address"
            value={homeAddress}
            name="homeAddress"
            onChange={getUserData}
            disabled={isEditCustomerInfo}
          />
        </Col>

        {saleLead?.status == "INSTALLED" ? (
          // {saleLead?.status == "COMPLETED" ? (
          <>
            <Col
              xs={12}
              className="text-end d-flex justify-content-end gap-2 align-center"
            >
              <Button
                color="secondary"
                onClick={() => {
                  dispatch(setCustomer(null));
                  dispatch(setSaleLeadId(""));
                  dispatch(setSaleLead(null));
                  navigate(
                    `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads`,
                  );
                }}
              >
                Cancel
              </Button>
              <Button color="primary" onClick={() => callbackActive(3)}>
                Next
              </Button>
            </Col>
          </>
        ) : (
          <>
            {customer !== null ? (
              <Col
                xs={12}
                className="text-end d-flex justify-content-end gap-2 align-center"
              >
                <Button
                  color="secondary"
                  onClick={() => {
                    dispatch(setCustomer(null));
                    dispatch(setSaleLeadId(""));
                    dispatch(setSaleLead(null));
                    navigate(
                      `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads`,
                    );
                  }}
                >
                  Cancel
                </Button>
                <Button color="primary" onClick={() => callbackActive(3)}>
                  OK
                </Button>
              </Col>
            ) : saleLead?.customer !== null ? (
              <Col
                xs={12}
                className="text-end d-flex justify-content-end gap-2 align-center"
              >
                {/* {customer !== null &&  */}
                <Button
                  color="secondary"
                  disabled={loading}
                  onClick={() => {
                    dispatch(setCustomer(null));
                    dispatch(setSaleLeadId(""));
                    dispatch(setSaleLead(null));
                    navigate(
                      `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads`,
                    );
                  }}
                >
                  Cancel
                </Button>

                <Button
                  color="primary"
                  disabled={loading || saleLead?.status == "COMPLETED"}
                  onClick={() =>
                    !isEditCustomerInfo
                      ? updateCustomer()
                      : setIsEditCustomerInfo(!isEditCustomerInfo)
                  }
                >
                  {loading
                    ? "Loading..."
                    : !isEditCustomerInfo
                      ? "Save"
                      : "Edit"}
                </Button>
              </Col>
            ) : (
              <Col
                xs={12}
                className="text-end d-flex justify-content-end gap-2 align-center"
              >
                {/* {customer !== null &&  */}
                <Button
                  color="secondary"
                  disabled={loading}
                  onClick={() => {
                    dispatch(setCustomer(null));
                    dispatch(setSaleLeadId(""));
                    dispatch(setSaleLead(null));
                    navigate(
                      `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads`,
                    );
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  disabled={loading}
                  onClick={() => createCustomer()}
                >
                  {loading ? "Loading..." : "Create Customer"}
                </Button>
              </Col>
            )}
          </>
        )}
      </Row>
    </Form>
  );
};

export default CustomerInfo;
