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
import FileAttachementComponent from "./FileAttachementComponent";

const Attachements = ({ callbackActive }: BusinessFormCommonProps) => {
  const [personalDetailsForm, setPersonalDetailsForm] = useState({
    imageTitle: "",
    companyTitle: "",
  });
  const { imageTitle, companyTitle } = personalDetailsForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setPersonalDetailsForm({ ...personalDetailsForm, [name]: value });
  };

  const handleNextButton = () => {
    if (imageTitle !== "" && companyTitle !== "") {
      callbackActive(6);
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
      <div>
        <Row className="g-3">
          <Col xs={12}>
            <Label
              style={{
                fontSize: "25px",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            >
              Legal Attachements
              <span className="txt-danger">*</span>
            </Label>
          </Col>
        </Row>
        <Row
          className="g-3"
          style={{
            padding: "10px",
            border: "1px solid gray",
            borderRadius: "10px",
            marginTop: "15px",
            marginBottom: "40px",
            marginLeft: "15px",
            marginRight: "15px",
          }}
        >
          <FileAttachementComponent heading="Attach CNIC Front" />
          <FileAttachementComponent heading="Attach CNIC Back" />
          <FileAttachementComponent heading="Attach PTA Certificate" />
          <FileAttachementComponent heading="Attach NTN" />
          <FileAttachementComponent heading="Attach Other" />
        </Row>
      </div>

      <div>
        <Row className="g-3">
          <Col xs={12}>
            <Label
              style={{
                fontSize: "25px",
                fontWeight: "bold",
                marginLeft: "10px",
                marginTop: "20px",
              }}
            >
              Login Page Settings
              <span className="txt-danger">*</span>
            </Label>
          </Col>
        </Row>
        <Row
          className="g-3"
          style={{
            padding: "20px",
            border: "1px solid gray",
            borderRadius: "10px",
            marginTop: "15px",
            marginBottom: "40px",
            marginLeft: "15px",
            marginRight: "15px",
          }}
        >
          <Col xl={6} sm={6}>
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
            <FileAttachementComponent heading="Attach Image Background" />
            <FileAttachementComponent heading="Attach Company Logo" />
          </Row>
          {/* <Col xl={4} xs={12}>
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
          </Col> */}
        </Row>
      </div>
      <Row>
        <Col xs={12} className="text-end">
          <Button color="primary" onClick={handleNextButton}>
            {Continue}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Attachements;
