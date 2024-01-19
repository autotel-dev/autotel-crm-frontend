import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import {
  AgreeToTermsAndConditions,
  ContactNumber,
  Continue,
  Email,
  FirstName,
  Lastname,
  State,
  ZipCode,
} from "../../../utils/Constant";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCompany } from "../../../ReaduxToolkit/Reducer/CompanySlice";

const CompanyInfoForm = ({ callbackActive }: BusinessFormCommonProps) => {
  const dispatch = useDispatch();
  const { createCompany } = useSelector((state: any) => state.companies);
  const [personalDetailsForm, setPersonalDetailsForm] = useState({
    companyName: "",
    phoneNo: "",
    city: "",
    address: "",
    contactPersonName: "",
    ntn: "",
    gstNo: "",
    contactPersonNumber: "",
    cnicNumber: "",
  });
  const {
    companyName,
    phoneNo,
    city,
    address,
    contactPersonName,
    ntn,
    gstNo,
    contactPersonNumber,
    cnicNumber,
  } = personalDetailsForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setPersonalDetailsForm({ ...personalDetailsForm, [name]: value });
  };

  const handleNextButton = () => {
    if (
      companyName !== "" &&
      phoneNo !== "" &&
      city !== "" &&
      address !== "" &&
      contactPersonName !== "" &&
      ntn !== "" &&
      gstNo !== "" &&
      contactPersonNumber !== "" &&
      cnicNumber !== ""
    ) {
      dispatch(setCreateCompany(personalDetailsForm));
      console.log("personalDetailsForm -->", personalDetailsForm);
      console.log("createCompany--- >", createCompany);

      callbackActive(2);
    } else {
      ShowError();
    }
  };
  return (
    <Form
      onSubmit={(event) => event.preventDefault()}
      className="needs-validation"
      noValidate
    >
      <Row className="g-3">
        <Col xl={4} sm={6}>
          <Label>
            Company Name
            <span className="txt-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter Company Name"
            value={companyName}
            name="companyName"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} sm={6}>
          <Label>
            Phone No
            <span className="txt-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter Phone No"
            value={phoneNo}
            name="phoneNo"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <Label>
            City
            <span className="txt-danger">*</span>
          </Label>
          <Input
            id="city"
            type="text"
            placeholder="city"
            value={city}
            name="city"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} sm={6}>
          <Label>
            Address
            <span className="txt-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter address"
            value={address}
            name="address"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} sm={6}>
          <Label>
            Contact Person Name
            <span className="txt-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter Contact Person Name"
            value={contactPersonName}
            name="contactPersonName"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <Label>
            NTN
            <span className="txt-danger">*</span>
          </Label>
          <Input
            id="ntn"
            type="text"
            placeholder="Enter ntn"
            value={ntn}
            name="ntn"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <Label>
            Gst No
            <span className="txt-danger">*</span>
          </Label>
          <Input
            id="gstNo"
            type="text"
            placeholder="Enter Gst Number"
            value={gstNo}
            name="gstNo"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <Label>
            Contact Person Number
            <span className="txt-danger">*</span>
          </Label>
          <Input
            id="contactPersonNumber"
            type="text"
            placeholder="Enter Contact Person Number"
            value={contactPersonNumber}
            name="contactPersonNumber"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <Label>
            CNIC Number
            <span className="txt-danger">*</span>
          </Label>
          <Input
            id="cnicNumber"
            type="text"
            placeholder="Enter CNIC Number"
            value={cnicNumber}
            name="cnicNumber"
            onChange={getUserData}
          />
        </Col>
        {/* <Col xs={12}>
          <FormGroup check>
            <Input id="invalid-check-wizard" type="checkbox" />
            <Label
              className="form-check-label mb-0 d-block"
              htmlFor="invalid-check-wizard"
            >
              {AgreeToTermsAndConditions}
            </Label>
          </FormGroup>
        </Col> */}
        <Col xs={12} className="text-end">
          <Button color="primary" onClick={handleNextButton}>
            {Continue}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CompanyInfoForm;
