import { H2, Image } from "../../../AbstractElements";
import { dynamicImage } from "../../../Service";
import { SuccessfullyCompleted } from "../../../utils/Constant";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { create, getAll } from "../../../Api";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../../Common/CommonHeader";
import axios from "axios";

const SuccessfullyFormSubmitted = ({
  callbackActive,
}: BusinessFormCommonProps) => {
  const {
    createCompany,
    cities,
    packages,
    serverCredentials,
    servers,
    allowedModules,
    crmModules,
    cnicFront,
    cnicBack,
    ntnFile,
    ptaCertificate,
    other,
    imageBackground,
    companyLogo,
  } = useSelector((state: any) => state.companies);
  // const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("fullName", createCompany.fullName);
    formData.append("cnicNumber", createCompany.cnicNumber);
    formData.append("contactPersonName", createCompany.contactPersonName);
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
      formData.append("ntnCertificate", ntnFile);
    }
    if (other !== null) {
      formData.append("otherAttachment", other);
    }

    formData.append("package", createCompany.package);
    formData.append(
      "packageExpirationDate",
      createCompany.packageExpirationDate
    );
    console.log("createCompany--- >", createCompany);

    for (const [key, value] of formData.entries()) {
      console.log(`Key: ${key}, Value: ${value}`);
    }

    // try {
    //   await create(formData, {
    //     url: "server-management/create-server",
    //   }).then((data: any) => {
    //     setLoading(false);

    //     if (data.success) {
    //       console.log(data);
    //       setLoading(false);
    //       // dispatch(setServersStart());
    //       // getAll({ url: "server-management/get-all-servers" }).then(
    //       //   (data: any) => {
    //       //     console.log("api call --- >", data);
    //       //     dispatch(setServerInfo({}));
    //       //     dispatch(setServerCredentials({}));
    //       //     dispatch(setGoogleAccountCreadentials({}));
    //       //     dispatch(setFirebaseAccountCredentials({}));
    //       //     dispatch(setApiKeys(""));
    //       //     dispatch(setCreateServer({}));
    //       //     // ----------------------
    //       //     dispatch(setServersEnd());
    //       //     if (data !== undefined) {
    //       //       dispatch(setNoDataFound(data.message));
    //       //       if (data.success) {
    //       //         console.log("hhg");
    //       //         dispatch(setServers(data.data.allServers));
    //       //         dispatch(setFilterServers(data.data.allServers));
    //       //         navigate(`${process.env.PUBLIC_URL}/setup/server_details`);
    //       //       }
    //       //     }
    //       //   }
    //       // );
    //     }
    //   });
    //   // Handle successful post creation (e.g., show a success message, redirect, etc.)
    // } catch (error: any) {
    //   // Handle error (e.g., show an error message)
    //   console.error("Error creating post:", error);
    //   setLoading(false);
    // }

    try {
      const response = await axios.post(
        "http://124.29.238.127:8080/api/v1/super-admin/create-company",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="form-completed">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <H2>Company Info</H2>
        <Row>
          <Col
            xs={9}
            className="text-end d-flex justify-content-end gap-2 align-center"
          >
            <Button color="primary" onClick={() => callbackActive(1)}>
              Edit
            </Button>
          </Col>
        </Row>
      </div>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <Col xl={4} sm={6}>
            <Label>
              Company Name
              <span className="txt-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter Company Name"
              defaultValue={createCompany.fullName}
              disabled
              name="phoneNo"
            />
          </Col>
          <Col xl={4} sm={6}>
            <Label>
              Phone Number
              <span className="txt-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter Phone Number"
              defaultValue={createCompany.phoneNo}
              disabled
              name="phoneNo"
            />
          </Col>
          <Col xl={4} xs={12}>
            <Label>
              Address
              <span className="txt-danger">*</span>
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter Address"
              defaultValue={createCompany.address}
              disabled
              name="address"
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
              defaultValue={createCompany.contactPersonName}
              disabled
              name="contactPersonName"
            />
          </Col>
          <Col xl={4} sm={6}>
            <Label>
              NTN
              <span className="txt-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter ntn"
              defaultValue={createCompany.ntn}
              disabled
              name="ntn"
            />
          </Col>
          <Col xl={4} xs={12}>
            <Label>
              GST Number
              <span className="txt-danger">*</span>
            </Label>
            <Input
              id="gstNo"
              type="text"
              placeholder="Enter GST Number"
              defaultValue={createCompany.gstNo}
              disabled
              name="gstNo"
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
              defaultValue={createCompany.contactPersonNumber}
              disabled
              name="contactPersonNumber"
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
              defaultValue={createCompany.cnicNumber}
              disabled
              name="cnicNumber"
            />
          </Col>
          <Col xl={4} xs={12}>
            <Label>
              Package Expiration Date
              <span className="txt-danger">*</span>
            </Label>
            <Input
              id="packageExpirationDate"
              type="text"
              placeholder="Enter Package Expiration Date"
              defaultValue={createCompany.packageExpirationDate}
              disabled
              name="packageExpirationDate"
            />
          </Col>
          {cities.map((item: any, index: any) => {
            if (item._id == createCompany.city) {
              return (
                <Col xl={4} xs={12}>
                  <Label>
                    City
                    <span className="txt-danger">*</span>
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Enter City name"
                    defaultValue={item.name}
                    disabled
                    name="city"
                  />
                </Col>
              );
            }
          })}
          {packages.map((item: any, index: any) => {
            if (item._id == createCompany.package) {
              return (
                <Col xl={4} xs={12}>
                  <Label>
                    Package Name
                    <span className="txt-danger">*</span>
                  </Label>
                  <Input
                    id="package"
                    type="text"
                    placeholder="Enter Package name"
                    defaultValue={item.title}
                    disabled
                    name="package"
                  />
                </Col>
              );
            }
          })}
        </Row>
      </Form>
      {/*  */}

      <H2>Account Credentials</H2>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <Col sm={6}>
            <Label>
              Email Address
              <span className="txt-danger">*</span>
            </Label>
            <Input
              defaultValue={createCompany.emailAddress}
              disabled
              name="emailAddress"
              type="email"
              placeholder="Enter  Email Address"
            />
          </Col>
          <Col sm={6}>
            <Label>
              Password
              <span className="txt-danger">*</span>
            </Label>
            <Input
              type="password"
              placeholder="Enter Password"
              defaultValue={createCompany.password}
              disabled
              name="password"
            />
          </Col>
          <Col sm={6}>
            <Label>
              Image Title
              <span className="txt-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter Image Title"
              defaultValue={createCompany.imageTitle}
              disabled
              name="imageTitle"
            />
          </Col>
          <Col sm={6}>
            <Label>
              Company Title
              <span className="txt-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter Company Title"
              defaultValue={createCompany.companyTitle}
              disabled
              name="companyTitle"
            />
          </Col>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            {imageBackground !== null && (
              <div>
                <Label>
                  Image Background
                  <span className="txt-danger">*</span>
                </Label>
                <img
                  src={URL.createObjectURL(imageBackground)}
                  alt=""
                  style={{ width: "230px", height: "160px" }}
                />
              </div>
            )}
            {companyLogo !== null && (
              <div>
                <Label>
                  Image Background
                  <span className="txt-danger">*</span>
                </Label>
                <img
                  src={URL.createObjectURL(companyLogo)}
                  alt=""
                  style={{ width: "230px", height: "160px" }}
                />
              </div>
            )}
          </div>
        </Row>
      </Form>

      <H2>Server Credentials</H2>
      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        {serverCredentials.map((item: any, index: any) => {
          return (
            <div
              style={{
                padding: "20px",
                border: "2px solid black",
                borderRadius: "10px",
                margin: "20px",
              }}
            >
              <Row className="g-3">
                <Col lg={12} sm={12}>
                  {servers.map((serverItem: any, index: any) => {
                    if (item.server == serverItem._id) {
                      return (
                        <CommonHeader
                          title={serverItem.companyName}
                          headClass="pb-0"
                        />
                      );
                    }
                  })}
                </Col>
                <Col sm={6}>
                  <Label>
                    Email Address
                    <span className="txt-danger">*</span>
                  </Label>
                  <Input
                    defaultValue={item.emailAddress}
                    disabled
                    name="emailAddress"
                    type="email"
                    placeholder="Enter Email Address"
                  />
                </Col>

                <Col sm={6}>
                  <Label>
                    Password
                    <span className="txt-danger">*</span>
                  </Label>
                  <Input
                    defaultValue={item.password}
                    disabled
                    name="password"
                    type="email"
                    placeholder="Enter Password"
                  />
                </Col>
                <Col sm={6}>
                  <Label>
                    Server Id
                    <span className="txt-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter Server"
                    defaultValue={item.server}
                    name="server"
                    disabled
                  />
                </Col>
                <Col sm={6}>
                  <Label>
                    Host Url
                    <span className="txt-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter Host Url"
                    defaultValue={item.hostUrl}
                    name="hostUrl"
                    disabled
                  />
                </Col>
              </Row>
            </div>
          );
        })}
      </Form>
      <H2>Allowed CRM Modules</H2>
      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        {allowedModules.map((item: any, index: any) => {
          return (
            <div
              style={{
                margin: "15px",
                fontSize: "16px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Col md={6} style={{ display: "flex" }}>
                {crmModules.map((module: any, index: any) => {
                  if (item == module._id) {
                    return <Col md={6}>{module.name}</Col>;
                  }
                })}
                <Col md={6}>
                  <div className="d-flex" key={index}>
                    <div
                      className={`text-end flex-shrink-0 icon-state switch-outline
                            }`}
                    >
                      <Label className="switch mb-0">
                        <Input type="checkbox" defaultChecked={true} disabled />
                        <span className={`switch-state bg-primary`} />
                      </Label>
                    </div>
                  </div>
                </Col>
              </Col>
            </div>
          );
        })}
      </Form>

      <H2>Legal Attachements</H2>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {cnicFront !== null && (
              <div>
                <Label>
                  CNIC Front
                  <span className="txt-danger">*</span>
                </Label>
                <img
                  src={URL.createObjectURL(cnicFront)}
                  alt=""
                  style={{ width: "230px", height: "160px" }}
                />
              </div>
            )}
            {cnicBack !== null && (
              <div>
                <Label>
                  CNIC Back
                  <span className="txt-danger">*</span>
                </Label>
                <img
                  src={URL.createObjectURL(cnicBack)}
                  alt=""
                  style={{ width: "230px", height: "160px" }}
                />
              </div>
            )}
            {ntnFile !== null && (
              <div>
                <Label>
                  NTN File
                  <span className="txt-danger">*</span>
                </Label>
                <img
                  src={URL.createObjectURL(ntnFile)}
                  alt=""
                  style={{ width: "230px", height: "160px" }}
                />
              </div>
            )}
            {ptaCertificate !== null && (
              <div>
                <Label>
                  PTA Certificate
                  <span className="txt-danger">*</span>
                </Label>
                <img
                  src={URL.createObjectURL(ptaCertificate)}
                  alt=""
                  style={{ width: "230px", height: "160px" }}
                />
              </div>
            )}
            {other !== null && (
              <div>
                <Label>
                  Other
                  <span className="txt-danger">*</span>
                </Label>
                <img
                  src={URL.createObjectURL(other)}
                  alt=""
                  style={{ width: "230px", height: "160px" }}
                />
              </div>
            )}
          </div>
        </Row>
      </Form>
      <Row>
        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button color="primary">Print</Button>
          <Button
            color="primary"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SuccessfullyFormSubmitted;
