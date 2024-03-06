import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
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
import {
  AadhaarNumber,
  ChooseBanks,
  Continue,
  PAN,
  Previous,
} from "../../../utils/Constant";
import { H3, Image, LI, UL } from "../../../AbstractElements";
import { dynamicImage } from "../../../Service";
import { popularBanksList } from "../../../Data/Forms/FormsLayout/FormWizardData";
import { setServersAddItemsList } from "../../../ReaduxToolkit/Reducer/CompanySlice";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCompany } from "../../../ReaduxToolkit/Reducer/CompanySlice";
import FileAttachementComponent from "./FileAttachementComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const AccountCredentials = ({ callbackActive }: BusinessFormCommonProps) => {
  const { createCompany, imageBackground, companyLogo } = useSelector(
    (state: any) => state.companies
  );
  const dispatch = useDispatch();
  const [accountCredentialsForm, setAccountCredentialsForm] = useState({
    emailAddress: "",
    password: "",
    // imageTitle: "",
    // companyTitle: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({});
  const { emailAddress, password } = accountCredentialsForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setAccountCredentialsForm({ ...accountCredentialsForm, [name]: value });
  };

  const handleNextButton = () => {
    if (
      emailAddress !== "" &&
      password !== ""
      // imageBackground !== null &&
      // companyLogo !== null
    ) {
      // dispatch(setServersAddItemsList([]));
      dispatch(
        setCreateCompany({
          ...createCompany,
          ...accountCredentialsForm,
        })
      );
      console.log("formData -->", accountCredentialsForm);
      console.log("createCompany--- >", createCompany);
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
        <Col sm={6}>
          <Label>
            Email Address
            <span className="txt-danger">*</span>
          </Label>
          <Input
            value={emailAddress}
            name="emailAddress"
            onChange={getUserData}
            type="email"
            placeholder="Enter Email Address"
          />
        </Col>
        <Col sm={6}>
          <Label>
            Password
            <span className="txt-danger">*</span>
          </Label>
          {/* <Input
            type="password"
            placeholder="Enter Password"
            value={password}
            name="password"
            onChange={getUserData}
          /> */}

          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              name="password"
              onChange={getUserData}
            />
            <Button
              color="white"
              // className="bg-transparent"
              onClick={togglePasswordVisibility}
              style={{
                backgroundColor: "transparent",
                width: "80px",
                border: "1px solid #dee2e6",
              }}
            >
              <FontAwesomeIcon
                // color="secondary"
                style={{
                  color: "green",
                  fontSize: "20px",
                  marginRight: "20px",
                }}
                icon={showPassword ? faEye : faEyeSlash}
              />
            </Button>
          </InputGroup>
        </Col>

        {/* <Col xl={6} sm={6}>
          <Label>
            Image Title
            <span className="txt-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter Image Title"
            value={imageTitle}
            name="imageTitle"
            onChange={getUserData}
          />
        </Col>
        <Col xl={6} sm={6}>
          <Label>
            Company Title
            <span className="txt-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter Company Title"
            value={companyTitle}
            name="companyTitle"
            onChange={getUserData}
          />
        </Col>

        <Row style={{ marginTop: "10px" }}>
          <FileAttachementComponent
            heading="Attach Image Background"
            category="imageBackground"
          />
          <FileAttachementComponent
            heading="Attach Company Logo"
            category="companyLogo"
          />
        </Row> */}
        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button color="primary" onClick={() => callbackActive(1)}>
            {Previous}
          </Button>
          <Button color="primary" onClick={handleNextButton}>
            {Continue}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AccountCredentials;
