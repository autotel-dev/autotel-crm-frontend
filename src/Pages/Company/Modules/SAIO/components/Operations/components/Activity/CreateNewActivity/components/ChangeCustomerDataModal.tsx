import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Col, Button, Modal, ModalBody, Row, Form, Input } from "reactstrap";

import { getAll } from "../../../../../../../../../../Utilities/api";
import { GET_SINGLE_CUSTOMERS } from "../../../../../../../../../../Utilities/api/apiEndpoints";
import { H4, P } from "../../../../../../../../../../AbstractElements";

import Swal from "sweetalert2";
import SelectCitiesBox from "./SelctCitiesBox";
import Skeleton from "../../../../../../../../../Utilities/Skeleton/Skeleton";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: any;
  customer: any;
  isCustomerDataEdited: any;
  setIsCustomerDataEdited: any;
  setActivityForm: any;
  activityForm: any;
}

const ChangeCustomerDataModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible,
  customer,
  isCustomerDataEdited,
  setIsCustomerDataEdited,
  setActivityForm,
  activityForm,
}) => {
  const addToggle = () => {
    setIsVisible(!isVisible);
  };
  const [customerLoading, setCustomerLoading] = useState(
    customer !== null && !isCustomerDataEdited ? true : false
  );

  const [city, setCity] = useState("");

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

  useEffect(() => {
    if (customer !== null && !isCustomerDataEdited) {
      getAll({ url: `${GET_SINGLE_CUSTOMERS}/${customer}` }).then(
        (data: any) => {
          if (data !== undefined) {
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
    } else {
      setCustomerInfoForm({
        customerName:
          activityForm.customerData !== null
            ? activityForm.customerData.fullName
            : "",
        customerContactNo:
          activityForm.customerData !== null
            ? activityForm.customerData.phoneNo
            : "",
        cnic:
          activityForm.customerData !== null
            ? activityForm.customerData.cnic
            : "",
        dob:
          activityForm.customerData !== null
            ? activityForm.customerData.dob.slice(0, 10)
            : "",
        additionalContactNo:
          activityForm.customerData !== null
            ? activityForm.customerData.additionalContactNo
            : "",
        officeNo:
          activityForm.customerData !== null
            ? activityForm.customerData.officeNo
            : "",
        emailAddress:
          activityForm.customerData !== null
            ? activityForm.customerData.emailAddress
            : "",
        residentialNo:
          activityForm.customerData !== null
            ? activityForm.customerData.residentialNo
            : "",
        homeAddress:
          activityForm.customerData !== null
            ? activityForm.customerData.homeAddress
            : "",
      });
      setCity(activityForm.customerData.city);
    }
  }, []);

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H4 className="modal-title">Change Customer Data</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody style={{ overflow: "hidden" }}>
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
                  onSubmit={(event: any) => event.preventDefault()}
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
                      />
                    </Col>
                    <Col
                      xs={12}
                      className="text-end d-flex justify-content-end gap-2 align-center"
                    >
                      <Button
                        color="primary"
                        onClick={() => {
                          // console.log("activityForm.customerData", activityForm.customerData);

                          setIsCustomerDataEdited(true);
                          setActivityForm((prevState: any) => ({
                            ...prevState,
                            customerData: { ...customerInfoForm, city: city },
                          }));
                          addToggle();
                        }}
                      >
                        OK
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Row>
            )}
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default ChangeCustomerDataModal;
