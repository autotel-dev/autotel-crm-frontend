import { ChangeEvent, useState } from "react";
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

const PersonalInfo = ({ callbackActive }: BusinessFormCommonProps) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { createCompany, imageBackground, companyLogo } = useSelector(
    (state: any) => state.companies
  );
  const dispatch = useDispatch();
  const [personalDetailsForm, setPersonalDetailsForm] = useState({
    cnicNo: "",
    dateOfBirth: "",
    additionalContactNo: "",
    officeNo: "",
    emailAddress: "",
    residentialNo: "",
    homeAddress: ""

  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({});
  const {
    cnicNo,
    dateOfBirth,
    additionalContactNo,
    officeNo,
    emailAddress,
    residentialNo,
    homeAddress
  } = personalDetailsForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setPersonalDetailsForm({ ...personalDetailsForm, [name]: value });
  };

  const handleNextButton = () => {
    if (
      cnicNo !== "" &&
      dateOfBirth !== "" &&
      additionalContactNo !== "" &&
      officeNo !== "" &&
      emailAddress !== "" &&
      residentialNo !== "" &&
      homeAddress

    ) {
      // dispatch(setServersAddItemsList([]));
      // dispatch(
      //   setCreateCompany({
      //     ...createCompany,
      //     ...accountCredentialsForm,
      //   })
      // );
      // console.log("formData -->", accountCredentialsForm);
      // console.log("createCompany--- >", createCompany);
      callbackActive(3);
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
          <P>
            CNIC No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter CNIC No"
            value={cnicNo}
            name="cnicNo"
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
            value={dateOfBirth}
            name="dateOfBirth"
            onChange={getUserData}
          />
        </Col> <Col xl={4} xs={12}>
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
        </Col> <Col xl={4} xs={12}>
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
        </Col> <Col xl={4} xs={12}>
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
        </Col> <Col xl={4} xs={12}>
          <P>

            Residential No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Residential No"
            value={
              residentialNo}
            name="residentialNo"
            onChange={getUserData}
          />
        </Col> <Col xl={4} xs={12}>
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
          <Button color="primary" onClick={() => callbackActive(1)}>
            Previous
          </Button>
          <Button color="primary"
          // onClick={handleNextButton}
          >
            Continue
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PersonalInfo;
