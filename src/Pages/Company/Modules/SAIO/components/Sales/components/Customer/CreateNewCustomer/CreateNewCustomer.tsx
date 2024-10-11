import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
  Container,
  Card,
  CardBody,
} from "reactstrap";
import { useEffect, useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { P } from "../../../../../../../../../AbstractElements";
import { useSelector } from "react-redux";
import {
  create,
  getAll,
  update,
} from "../../../../../../../../../Utilities/api";
import {
  CREATE_NEW_CUSTOMER,
  GET_ALL_CUSTOMERS,
  GET_SINGLE_CUSTOMERS,
  UPDATE_CUSTOMER,
} from "../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../Utilities/constants/constants";
import Swal from "sweetalert2";
import ShowError from "./ShowError";
import SelectCitiesBox from "./components/SelectCitiesBox";
import {
  setCustomer,
  setCustomers,
  setIsConnected,
} from "../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import Skeleton from "../../../../../../../../Utilities/Skeleton/Skeleton";
import { useNavigate } from "react-router-dom";

const CreateNewCustomer = () => {
  const { customer } = useSelector((state: any) => state.sales);
  // console.log("customer", customer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [customerLoading, setCustomerLoading] = useState(
    customer !== null ? true : false
  );

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(customer !== null ? true : false);

  const [customerInfoForm, setCustomerInfoForm] = useState({
    customerName: "",
    customerContactNo: "",
    cnic: "",
    dob: "",
    additionalContactNo: "",
    officeNo: "",
    emailAddress: "",
    residentialNo: "",
    homeAddress: "",
  });
  const {
    customerName,
    customerContactNo,
    cnic,
    dob,
    additionalContactNo,
    officeNo,
    emailAddress,
    residentialNo,
    homeAddress,
  } = customerInfoForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setCustomerInfoForm({ ...customerInfoForm, [name]: value });
  };

  const createCustomer = async () => {
    setLoading(true);
    if (
      customerName !== "" &&
      customerContactNo !== "" &&
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
          { ...customerInfoForm, city: city, saleLeadId: null },
          { url: CREATE_NEW_CUSTOMER }
        ).then((data: any) => {
          if (data !== undefined) {
            if (!data.success && data.message === ERROR_MESSAGE) {
              setLoading(false);
              // console.log("data.message", data.message);
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
              getAll({ url: GET_ALL_CUSTOMERS }).then((data: any) => {
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
                    navigate(
                      `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/customers`
                    );
                  }
                  if (data.success) {
                    dispatch(setCustomers(data.data));
                    navigate(
                      `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/customers`
                    );
                    dispatch(setCustomer(null));
                    // // // console.log("hhg");
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

  const editCustomer = async () => {
    setLoading(true);
    if (
      customerName !== "" &&
      customerContactNo !== "" &&
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
          { ...customerInfoForm, city: city, saleLeadId: null },
          { url: `${UPDATE_CUSTOMER}/${customer.id}` }
        ).then((data: any) => {
          if (data !== undefined) {
            if (!data.success && data.message === ERROR_MESSAGE) {
              setLoading(false);
              // console.log("data.message", data.message);
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
              getAll({ url: GET_ALL_CUSTOMERS }).then((data: any) => {
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
                    // setIscreateNewCustomer(false)
                  }
                  if (data.success) {
                    dispatch(setCustomers(data.data));
                    setIsEdit(!isEdit);
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
      getAll({ url: `${GET_SINGLE_CUSTOMERS}/${customer.id}` }).then(
        (data: any) => {
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
              setCustomerLoading(false);
            }
            if (data.success) {
              setCustomerInfoForm({
                customerName: data.data !== null ? data.data.fullName : "",
                customerContactNo: data.data !== null ? data.data.phoneNo : "",
                cnic: data.data !== null ? data.data.cnic : "",
                dob: data.data !== null ? data.data.dob.slice(0, 10) : "",
                additionalContactNo:
                  data.data !== null ? data.data.additionalContactNo : "",
                officeNo: data.data !== null ? data.data.officeNo : "",
                emailAddress: data.data !== null ? data.data.emailAddress : "",
                residentialNo:
                  data.data !== null ? data.data.residentialNo : "",
                homeAddress: data.data !== null ? data.data.homeAddress : "",
              });
              setCity(data.data !== null ? data.data.city._id : city);

              setCustomerLoading(false);
            }
          }
        }
      );
    }
  }, []);

  return (
    <>
      <Container fluid>
        {customerLoading ? (
          <>
            <div style={{ textAlign: "center" }}>
              {/* <Loader /> */}

              <>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    marginLeft: "20px",
                    //  marginRight:"50px",
                    marginTop: "20px",
                  }}
                >
                  <div style={{ width: "33%" }}>
                    <Skeleton
                      height="20px"
                      width="45%"
                      borderRadius="10px"
                      marginBottom="5px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </div>
                  <div style={{ width: "30%" }}>
                    <Skeleton
                      height="20px"
                      width="45%"
                      borderRadius="10px"
                      marginBottom="5px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </div>
                  <div style={{ width: "30%", marginRight: "50px" }}>
                    <Skeleton
                      height="20px"
                      width="45%"
                      borderRadius="10px"
                      marginBottom="5px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    marginLeft: "20px",
                    //  marginRight:"50px",
                    marginTop: "30px",
                  }}
                >
                  <div style={{ width: "33%" }}>
                    <Skeleton
                      height="20px"
                      width="45%"
                      borderRadius="10px"
                      marginBottom="5px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </div>
                  <div style={{ width: "30%" }}>
                    <Skeleton
                      height="20px"
                      width="45%"
                      borderRadius="10px"
                      marginBottom="5px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </div>
                  <div style={{ width: "30%", marginRight: "50px" }}>
                    <Skeleton
                      height="20px"
                      width="45%"
                      borderRadius="10px"
                      marginBottom="5px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    marginLeft: "20px",
                    //  marginRight:"50px",
                    marginTop: "30px",
                  }}
                >
                  <div style={{ width: "33%" }}>
                    <Skeleton
                      height="20px"
                      width="45%"
                      borderRadius="10px"
                      marginBottom="5px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </div>
                  <div style={{ width: "30%" }}>
                    <Skeleton
                      height="20px"
                      width="45%"
                      borderRadius="10px"
                      marginBottom="5px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </div>
                  <div style={{ width: "30%", marginRight: "50px" }}>
                    <Skeleton
                      height="20px"
                      width="45%"
                      borderRadius="10px"
                      marginBottom="5px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    marginLeft: "20px",
                    //  marginRight:"50px",
                    marginTop: "30px",
                  }}
                >
                  <div style={{ width: "33%" }}>
                    <Skeleton
                      height="20px"
                      width="45%"
                      borderRadius="10px"
                      marginBottom="5px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </div>
                  <div style={{ width: "30%" }}>
                    <Skeleton
                      height="20px"
                      width="45%"
                      borderRadius="10px"
                      marginBottom="5px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </div>
                  <div style={{ width: "30%", marginRight: "50px" }}>
                    <Skeleton
                      height="20px"
                      width="45%"
                      borderRadius="10px"
                      marginBottom="5px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </div>
                </div>
              </>
            </div>
          </>
        ) : (
          <Row>
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
                    disabled={isEdit}
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
                    disabled={isEdit}
                  />
                </Col>
                <Col xl={4} xs={12}>
                  <div>
                    <P>
                      Select City
                      <span className="txt-danger">*</span>
                    </P>
                  </div>
                  <SelectCitiesBox
                    placeholder="Select City"
                    setCity={setCity}
                    city={city}
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
                    disabled={isEdit}
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
                    disabled={isEdit}
                  />
                </Col>{" "}
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
                    disabled={isEdit}
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
                    disabled={isEdit}
                  />
                </Col>{" "}
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
                    disabled={isEdit}
                  />
                </Col>{" "}
                <Col xl={4} xs={12}>
                  <P>
                    Residential No
                    <span className="txt-danger">*</span>
                  </P>
                  <Input
                    type="text"
                    placeholder="Enter Residential No"
                    value={residentialNo}
                    name="residentialNo"
                    onChange={getUserData}
                    disabled={isEdit}
                  />
                </Col>{" "}
                <Col xl={4} xs={12}>
                  <P>
                    Home Address
                    <span className="txt-danger">*</span>
                  </P>
                  <Input
                    type="text"
                    placeholder="Enter Home Address"
                    value={homeAddress}
                    name="homeAddress"
                    onChange={getUserData}
                    disabled={isEdit}
                  />
                </Col>
                <Col
                  xs={12}
                  className="text-end d-flex justify-content-end gap-2 align-center"
                >
                  <Button
                    color="primary"
                    onClick={() => {
                      navigate(
                        `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/customers`
                      );
                    }}
                  >
                    Cancel
                  </Button>
                  {customer == null ? (
                    <Button color="primary" onClick={createCustomer}>
                      Create Customer
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      onClick={() =>
                        !isEdit ? editCustomer() : setIsEdit(!isEdit)
                      }
                    >
                      {loading ? "Loading..." : !isEdit ? "Update" : "Edit"}
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          </Row>
        )}
      </Container>
    </>
  );
};

export default CreateNewCustomer;
