import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Card, CardBody } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import Dropzone from "react-dropzone-uploader";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

import FileAttachementComponent from "./FileAttachementComponent";
import { setCreateCompany } from "../../../ReaduxToolkit/Reducer/CompanySlice";
import { useDispatch, useSelector } from "react-redux";
import { create } from "../../../Api";

const Attachements = ({ callbackActive }: BusinessFormCommonProps) => {
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

  // const [cnicFront, setCnciFront] = useState(null);
  // const [cnicBack, setCnciBack] = useState(null);
  // const [ptaCertificate, setPtaCertificate] = useState(null);
  // const [ntnFile, setNtn] = useState(null);
  // const [other, setOther] = useState(null);
  const formData = new FormData();

  const handleNextButton = (e: any) => {
    e.preventDefault();
    if (
      cnicFront !== null &&
      cnicBack !== null &&
      ptaCertificate !== null &&
      ntnFile !== null &&
      other !== null
    ) {
      dispatch(
        setCreateCompany({
          ...createCompany,
        })
      );

      callbackActive(6);
    } else {
      ShowError();
    }
  };

  // const onImageChange = (event: any) => {
  //   setCnciFront(event.target.files[0]);
  // };

  // const onImageChange = (event: any) => {
  //   // console.log(event.target.files);

  //   setCnciFront(event.target.files[0]);
  //   // if (event.target.files && event.target.files[0]) {
  //   // setImage(URL.createObjectURL(event.target.files[0]));
  //   // }
  // };

  // const handleCNCIFront = ({ file, meta, remove }: type, status: any) => {
  //   if (status === "done") {
  //     // console.log("File uploaded successfully:", file);
  //     setCnciFront(file);
  //   } else if (status === "removed") {
  //     // console.log("File removed:", file);
  //     setCnciFront(null);
  //   }
  // };
  // const handleCNICBack = ({ file, meta, remove }: type, status: any) => {
  //   if (status === "done") {
  //     // console.log("File uploaded successfully:", file);
  //     setCnciBack(file);
  //   } else if (status === "removed") {
  //     // console.log("File removed:", file);
  //     setCnciBack(null);
  //   }
  // };
  // const handlePTA = ({ file, meta, remove }: type, status: any) => {
  //   if (status === "done") {
  //     // console.log("File uploaded successfully:", file);
  //     setPtaCertificate(file);
  //   } else if (status === "removed") {
  //     // console.log("File removed:", file);
  //     setPtaCertificate(null);
  //   }
  // };
  // const handleNTN = ({ file, meta, remove }: type, status: any) => {
  //   if (status === "done") {
  //     // console.log("File uploaded successfully:", file);
  //     setNtn(file);
  //   } else if (status === "removed") {
  //     // console.log("File removed:", file);
  //     setNtn(null);
  //   }
  // };
  // const handleOther = ({ file, meta, remove }: type, status: any) => {
  //   if (status === "done") {
  //     // console.log("File uploaded successfully:", file);
  //     setOther(file);
  //   } else if (status === "removed") {
  //     // console.log("File removed:", file);
  //     setOther(null);
  //   }
  // };

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

          {/* <input type="file" accept="image/*" onChange={onImageChange} /> */}
          {/* <Col lg={4}>
            <Card>
              <CommonHeader
                title="Attach CNIC Front"
                subTitle={subTitle}
                headClass="pb-0"
              />
              <CardBody>
                <Dropzone
                  onChangeStatus={handleCNCIFront}
                  accept="image/*"
                  maxFiles={1}
                  inputContent="Drop files here or click to upload."
                />
              </CardBody>
            </Card>
          </Col>
          <Col lg={4}>
            <Card>
              <CommonHeader
                title="Attach CNIC Back"
                subTitle={subTitle}
                headClass="pb-0"
              />
              <CardBody>
                <Dropzone
                  onChangeStatus={handleCNICBack}
                  accept="image/*"
                  maxFiles={1}
                  inputContent="Drop files here or click to upload."
                />
              </CardBody>
            </Card>
          </Col>
          <Col lg={4}>
            <Card>
              <CommonHeader
                title="Attach PTA Certificate"
                subTitle={subTitle}
                headClass="pb-0"
              />
              <CardBody>
                <Dropzone
                  onChangeStatus={handlePTA}
                  accept="image/*"
                  maxFiles={1}
                  inputContent="Drop files here or click to upload."
                />
              </CardBody>
            </Card>
          </Col>
          <Col lg={4}>
            <Card>
              <CommonHeader
                title="Attach NTN"
                subTitle={subTitle}
                headClass="pb-0"
              />
              <CardBody>
                <Dropzone
                  onChangeStatus={handleNTN}
                  accept="image/*"
                  maxFiles={1}
                  inputContent="Drop files here or click to upload."
                />
              </CardBody>
            </Card>
          </Col>
          <Col lg={4}>
            <Card>
              <CommonHeader
                title="Attach Other"
                subTitle={subTitle}
                headClass="pb-0"
              />
              <CardBody>
                <Dropzone
                  onChangeStatus={handleOther}
                  accept="image/*"
                  maxFiles={1}
                  inputContent="Drop files here or click to upload."
                />
              </CardBody>
            </Card>
          </Col> */}
        </Row>
      </div>

      {/* <div>
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
          </Row> */}
      {/* </Row>
      </div> */}
      <Row>
        <Col xs={12} className="text-end">
          <Button color="primary" onClick={handleNextButton}>
            Next
          </Button>
          {/* <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button> */}
        </Col>
      </Row>
    </Form>
  );
};

export default Attachements;
