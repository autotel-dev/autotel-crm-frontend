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
import SelectCitiesBox from "./SelectCitiesBox";
import SelectPackageBox from "./SelectPackageBox";
import SelectTimeZoneBox from "./SelectTimeZoneBox";

const CompanyInfoForm = ({ callbackActive }: BusinessFormCommonProps) => {
  const dispatch = useDispatch();
  const { createCompany } = useSelector((state: any) => state.companies);
  const [companyInfoForm, setCompanyInfoForm] = useState({
    fullName: "",
    phoneNo: "",
    address: "",
    contactPersonName: "",
    ntn: "",
    gstNo: "",
    contactPersonNumber: "",
    cnicNumber: "",
    packageExpirationDate: "",
  });
  const {
    fullName,
    phoneNo,
    packageExpirationDate,
    address,
    contactPersonName,
    ntn,
    gstNo,
    contactPersonNumber,
    cnicNumber,
  } = companyInfoForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setCompanyInfoForm({ ...companyInfoForm, [name]: value });
  };

  const handleNextButton = () => {
    if (
      fullName !== "" &&
      phoneNo !== "" &&
      packageExpirationDate !== "" &&
      address !== "" &&
      contactPersonName !== "" &&
      ntn !== "" &&
      gstNo !== "" &&
      contactPersonNumber !== "" &&
      cnicNumber !== ""
    ) {
      // dispatch(setCreateCompany(companyInfoForm));
      // console.log("personalDetailsForm -->", companyInfoForm);
      // console.log("createCompany--- >", createCompany);
      dispatch(
        setCreateCompany({
          ...createCompany,
          ...companyInfoForm,
        })
      );

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
        <Col xl={4} xs={12}>
          <Label>
            Company Name
            <span className="txt-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter Company Name"
            value={fullName}
            name="fullName"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
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
        <Col xl={4} xs={12}>
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

        <Col xl={4} xs={12}>
          <Label>
            Package Expiration Date
            <span className="txt-danger">*</span>
          </Label>
          <Input
            id="packageExpirationDate"
            type="date"
            // placeholder="Enter CNIC Number"
            value={packageExpirationDate}
            name="packageExpirationDate"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <Label>
              Select City
              <span className="txt-danger">*</span>
            </Label>
          </div>
          <SelectCitiesBox placeholder="Select City" />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <Label>
              Select Package
              <span className="txt-danger">*</span>
            </Label>
          </div>
          <SelectPackageBox placeholder="Select Package" />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <Label>
              Select Time Zone
              <span className="txt-danger">*</span>
            </Label>
          </div>
          <SelectTimeZoneBox placeholder="Select Time Zone" />
        </Col>

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
