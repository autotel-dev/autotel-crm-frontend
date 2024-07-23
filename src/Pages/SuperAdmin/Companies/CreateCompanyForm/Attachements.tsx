import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Card, CardBody } from "reactstrap";
import CommonHeader from "../../../../Common/CommonHeader";
import Dropzone from "react-dropzone-uploader";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

import FileAttachementComponent from "./FileAttachementComponent";
import { setCreateCompany } from "../../../../ReaduxToolkit/Reducer/CompanySlice";
import { useDispatch, useSelector } from "react-redux";
import { create } from "../../../../Utilities/api";
import { H4 } from "../../../../AbstractElements";

const Attachements = ({ callbackActive }: BusinessFormCommonProps) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  // const subTitle = [
  //   {
  //     text: "",
  //     code: "",
  //   },
  // ];
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

  const { createCompany, cnicFront, cnicBack, ptaCertificate, ntnFile, other } =
    useSelector((state: any) => state.companies);
  const dispatch = useDispatch();

  const formData = new FormData();

  const handleNextButton = (e: any) => {
    e.preventDefault();

    callbackActive(6);
    dispatch(
      setCreateCompany({
        ...createCompany,
      })
    );
  };



  interface type {
    file: any;
    meta: any;
    remove: any;
  }

  return (
    <Form
      onSubmit={(event) => event.preventDefault()}
      className="needs-validation"
      noValidate
    >
      <div>
        <Row className="g-3">
          <Col xs={12}>
            <H4>
              Legal Attachements
              <span className="txt-danger">*</span>
            </H4>
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
            marginLeft: "5px",
            marginRight: "5px",
          }}
        >
          <FileAttachementComponent
            heading="Attach CNIC Front"
            category="cnicFront"
          />
          <FileAttachementComponent
            heading="Attach CNIC Back"
            category="cnicBack"
          />
          <FileAttachementComponent
            heading="Attach PTA Certificate"
            category="ptaCertificate"
          />
          <FileAttachementComponent heading="Attach NTN" category="ntnFile" />
          <FileAttachementComponent heading="Attach Other" category="other" />


        </Row>
      </div>


      <Row>
        <Col xs={12} className="text-end">
          <Button color="primary" onClick={handleNextButton}>
            Next
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Attachements;
