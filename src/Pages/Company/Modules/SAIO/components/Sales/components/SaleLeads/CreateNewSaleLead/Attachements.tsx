import { ChangeEvent, useState } from "react";

import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";


import { useDispatch, useSelector } from "react-redux";
import { BusinessFormCommonProps } from "../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import { H4 } from "../../../../../../../../../AbstractElements";
import FileAttachementComponent from "./FileAttachementComponent";


const Attachements = ({ callbackActive }: BusinessFormCommonProps) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

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

    callbackActive(7);
    // dispatch(
    //   setCreateCompany({
    //     ...createCompany,
    //   })
    // );
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
            heading="Tracker Location"
            category="trackerLocation"
          />
          <FileAttachementComponent
            heading="Vehicle Front Picture"
            category="vehicleFrontPicture"
          />
          <FileAttachementComponent
            heading="Vehicle Back Picture"
            category="vehicleBackPicture"
          />


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
