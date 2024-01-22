import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Card, CardBody } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import Dropzone from "react-dropzone-uploader";
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
import { setCreateCompany } from "../../../ReaduxToolkit/Reducer/CompanySlice";
import { useDispatch, useSelector } from "react-redux";
import { create } from "../../../Api";
import axios from "axios";

const Attachements = ({ callbackActive }: BusinessFormCommonProps) => {
  const subTitle = [
    {
      text: "",
      code: "",
    },
  ];
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

  const { allowedModules, crmModules, createCompany } = useSelector(
    (state: any) => state.companies
  );
  const dispatch = useDispatch();

  const [cnicFront, setCnciFront] = useState(null);
  const [cnicBack, setCnciBack] = useState(null);
  const [ptaCertificate, setPtaCertificate] = useState(null);
  const [ntnFile, setNtn] = useState(null);
  const [other, setOther] = useState(null);
  const formData = new FormData();

  const handleNextButton = () => {
    // if (imageTitle !== "" && companyTitle !== "") {

    //   callbackActive(6);
    // } else {
    //   ShowError();
    // }

    dispatch(
      setCreateCompany({
        ...createCompany,
        // cnicFront: cnicFront,
        // cnicBack: cnicBack,
        // ptaCertificate: ptaCertificate,
        // ntnFile: ntnFile,
        // other: other,
        packageExpirationDate: new Date(),
        package: "657813241da464c48b1ae98d",
      })
    );
  };

  const onImageChange = (event: any) => {
    setCnciFront(event.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("cnicNumber", createCompany.cnicNumber);
    formData.append("contactPersonName", createCompany.contactPersonNumber);
    formData.append("contactPersonNumber", createCompany.contactPersonNumber);
    formData.append("emailAddress", createCompany.emailAddress);
    formData.append("address", createCompany.address);
    formData.append("city", createCompany.city);
    formData.append("gstNo", createCompany.gstNo);
    formData.append("ntn", createCompany.ntn);
    formData.append("password", createCompany.password);
    formData.append("phoneNo", createCompany.phoneNo);
    formData.append(
      "serverCredentials",
      JSON.stringify(createCompany.serverCredentials)
    );
    formData.append(
      "allowedModules",
      JSON.stringify(createCompany.allowedModules)
    );
    formData.append("package", "657813241da464c48b1ae98d");
    formData.append("packageExpirationDate", `${new Date()}`);
    if (cnicFront !== null) {
      formData.append("cnicFront", cnicFront);
    }
    if (cnicBack !== null) {
      formData.append("cnicBack", cnicBack);
    }
    if (ptaCertificate !== null) {
      formData.append("ptaCertificate", ptaCertificate);
    }
    if (ntnFile !== null) {
      formData.append("ntnFile", ntnFile);
    }
    if (other !== null) {
      formData.append("other", other);
    }

    formData.append("package", "657813241da464c48b1ae98d");
    formData.append("packageExpirationDate", `${new Date()}`);
    console.log("createCompany--- >", createCompany);
    try {
      const response = await axios.post(
        "http://124.29.238.127:8080/api/v1/super-admin/create-company",
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    // try {
    //   await create(createCompany, {
    //     url: "super-admin/create-company",
    //   }).then((data: any) => {
    //     // setLoading(false);

    //     if (data.success) {
    //       console.log(data);
    //       // setLoading(false);
    //       // dispatch(setServersStart());
    //     }
    //   });
    //   // Handle successful post creation (e.g., show a success message, redirect, etc.)
    // } catch (error: any) {
    //   // Handle error (e.g., show an error message)
    //   console.error("Error creating post:", error);
    //   // setLoading(false);
    // }
  };
  // const onImageChange = (event: any) => {
  //   console.log(event.target.files);

  //   setCnciFront(event.target.files[0]);
  //   // if (event.target.files && event.target.files[0]) {
  //   // setImage(URL.createObjectURL(event.target.files[0]));
  //   // }
  // };

  const handleCNCIFront = (file: any) => {
    console.log("simpleFile -- >", file);
    console.log("updatedFile -- >", file.file);

    setCnciFront(file.file);
    // console.log("File added:", file.file);
    // Do something with the file or its meta data
  };
  const handleCNCIBack = (file: any) => {
    setCnciBack(file.file);
    console.log("File added:", file.file);
    // Do something with the file or its meta data
  };
  const handlePTA = (file: any) => {
    setPtaCertificate(file.file);
    console.log("File added:", file.file);
    // Do something with the file or its meta data
  };
  const handleNTN = (file: any) => {
    setNtn(file.file);
    console.log("File added:", file.file);
    // Do something with the file or its meta data
  };
  const handleOther = (file: any) => {
    setOther(file.file);
    console.log("File added:", file.file);
    // Do something with the file or its meta data
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
          {/* <FileAttachementComponent heading="Attach CNIC Front" />
          <FileAttachementComponent heading="Attach CNIC Back" />
          <FileAttachementComponent heading="Attach PTA Certificate" />
          <FileAttachementComponent heading="Attach NTN" />
          <FileAttachementComponent heading="Attach Other" /> */}

          <input type="file" accept="image/*" onChange={onImageChange} />
          <Col lg={4}>
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
                  onChangeStatus={handleCNCIBack}
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
          </Col>
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
        </Row>
      </div>
      <Row>
        <Col xs={12} className="text-end">
          <Button color="primary" onClick={handleNextButton}>
            Next
          </Button>
        </Col>
        <Col xs={12} className="text-end">
          <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Attachements;
