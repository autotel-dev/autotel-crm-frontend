import { H2, Image } from "../../../AbstractElements";
import { dynamicImage } from "../../../Service";
import { SuccessfullyCompleted } from "../../../utils/Constant";
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
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { createCom, getAll } from "../../../Api";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../../Common/CommonHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import {
  setAllowedModules,
  setCompanies,
  setCompaniesEnd,
  setCompaniesStart,
  setCreateCompany,
  setFilterCompanies,
  setServerCredentials,
  setServersAddItemsList,
  setCNICFront,
  setCNICBack,
  setNTNFile,
  setPTACertificate,
  setOther,
} from "../../../ReaduxToolkit/Reducer/CompanySlice";
import PDFViewer from "./PDFViewer";
import Swal from "sweetalert2";
// import pdfFile from "../../../assets/";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const SuccessfullyFormSubmitted = ({
  callbackActive,
}: BusinessFormCommonProps) => {
  const {
    createCompany,
    cities,
    packages,
    timezones,
    serverCredentials,
    servers,
    allowedModules,
    permissions,
    crmModules,
    cnicFront,
    cnicBack,
    ntnFile,
    ptaCertificate,
    other,
    imageBackground,
    companyLogo,
  } = useSelector((state: any) => state.companies);
  console.log("createCompany", createCompany);

  // const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    console.log("CNICFront:", cnicFront);
    console.log("CNICBack:", cnicBack);
  });

  function checkFileTypeByExtension(fileName: any, file: any) {
    console.log("filename", fileName);
    console.log("file", file);

    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const pdfExtension = "pdf";

    const extension = fileName.split(".").pop().toLowerCase();

    if (imageExtensions.includes(extension)) {
      return "image";
    } else if (extension === pdfExtension) {
      return "pdf";
    } else {
      return "unknown";
    }
  }
  const [numPages, setNumPages]: any = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const nextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
  };

  const prevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const onDocumentLoadError = (error: any) => {
    console.error("Error while loading the document:", error);
  };

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
    formData.append("timezone", createCompany.timezone);
    formData.append(
      "serverCredentials",
      JSON.stringify(createCompany.serverCredentials)
    );
    formData.append(
      "allowedModules",
      JSON.stringify(createCompany.allowedModules)
    );
    const providePermissions = createCompany.permissions
      .filter((permission: any) => permission.checked)
      .map(
        ({ checked, ...rest }: { checked: any; [key: string]: any }) => rest
      );
    formData.append("permissions", JSON.stringify(providePermissions));

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

    try {
      setLoading(true);
      await createCom(formData, {
        url: "super-admin/create-company",
      }).then((data: any) => {
        if (!data.success && data.message == "ERROR_INTERNET_DISCONNECTED") {
          setLoading(false);
        }
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
        }

        if (data.success) {
          console.log(data);
          setLoading(false);
          dispatch(setCompaniesStart());
          getAll({ url: "super-admin/get-all-companies" }).then((data: any) => {
            console.log("api call --- >", data);
            if (data == undefined) {
              Swal.fire({
                text: "Failed to fetch due to connection refused",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              dispatch(setCompaniesEnd());
              dispatch(setCompanies([]));
              dispatch(setFilterCompanies([]));
              return;
            }
            dispatch(setCreateCompany({}));
            dispatch(setServerCredentials([]));

            dispatch(setAllowedModules([]));
            dispatch(setServersAddItemsList([]));
            dispatch(setCNICFront(null));
            dispatch(setCNICBack(null));
            dispatch(setNTNFile(null));
            dispatch(setPTACertificate(null));
            dispatch(setOther(null));

            // ----------------------
            dispatch(setCompaniesEnd());
            if (data !== undefined) {
              dispatch(setNoDataFound(data.message));
              if (data.success) {
                console.log("hhg");
                dispatch(setCompanies(data.data));
                dispatch(setFilterCompanies(data.data));
                navigate(`${process.env.PUBLIC_URL}/super-admin/companies`);
              }
            }
          });
        }
      });
    } catch (error: any) {
      console.error("Error creating post:", error);

      setLoading(false);
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
          {timezones.map((item: any, index: any) => {
            if (item == createCompany.timezone) {
              return (
                <Col xl={4} xs={12}>
                  <Label>
                    Timezone
                    <span className="txt-danger">*</span>
                  </Label>
                  <Input
                    id="timezone"
                    type="text"
                    placeholder="Enter Time zone"
                    defaultValue={item}
                    disabled
                    name="timezone"
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
            {/* <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              defaultValue={createCompany.password}
              disabled
              name="password"
            /> */}

            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                defaultValue={createCompany.password}
                disabled
                name="password"
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
          {/* <Col sm={6}>
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
          </Col> */}
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
                      className={`text-end flex-shrink-0 icon-state 
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

      <H2>Allowed Permissions</H2>
      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <div
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "30vh", // Subtract scrollbar width from max height
            WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
            scrollbarWidth: "thin", // Specify scrollbar width
            WebkitBorderRadius: "5px !important", // For WebKit browsers (Chrome, Safari)
            MozBorderRadius: "5px !important", // For Mozilla Firefox
            borderRadius: "5px !important", // For other browsers
            scrollbarColor: "lightgray transparent", // Specify scrollbar color
          }}
        >
          {createCompany.permissions?.map((permission: any, index: any) => {
            return (
              <div key={index}>
                <Row>
                  <Col
                    key={index}
                    xl={10}
                    lg={10}
                    md={10}
                    sm={12}
                    xs={12}
                    // xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "17px",
                        margin: "10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      <label
                        style={{
                          display: "inline-block",
                          position: "relative",
                          cursor: "pointer",
                          marginRight: "25px",
                          fontSize: "18px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          name="key"
                          value="value"
                          checked={permission.checked}
                          onChange={() => {}}
                          style={{ display: "none" }} // Hide the default checkbox
                        />
                        <span
                          onClick={(e) => e.stopPropagation()}
                          className="green"
                        ></span>
                      </label>
                      {permission.title}
                    </span>
                    {permission.checked && (
                      <div>
                        <label
                          style={{
                            display: "inline-block",
                            position: "relative",
                            cursor: "pointer",
                            marginRight: "25px",
                            fontSize: "18px",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            name="key"
                            value="value"
                            checked={permission.read}
                            onChange={() => {}}
                            style={{ display: "none" }} // Hide the default checkbox
                          />
                          <span
                            onClick={(e) => e.stopPropagation()}
                            className="green"
                          ></span>
                          Read
                        </label>
                        <label
                          style={{
                            display: "inline-block",
                            position: "relative",
                            cursor: "pointer",
                            marginRight: "25px",
                            fontSize: "18px",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            name="key"
                            value="value"
                            checked={permission.create}
                            onChange={() => {}}
                            style={{ display: "none" }} // Hide the default checkbox
                          />
                          <span
                            onClick={(e) => e.stopPropagation()}
                            className="green"
                          ></span>
                          Create
                        </label>
                        <label
                          style={{
                            display: "inline-block",
                            position: "relative",
                            cursor: "pointer",
                            marginRight: "25px",
                            fontSize: "18px",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            name="key"
                            value="value"
                            checked={permission.edit}
                            onChange={() => {}}
                            style={{ display: "none" }} // Hide the default checkbox
                          />
                          <span
                            onClick={(e) => e.stopPropagation()}
                            className="green"
                          ></span>
                          Edit
                        </label>
                        <label
                          style={{
                            display: "inline-block",
                            position: "relative",
                            cursor: "pointer",
                            marginRight: "25px",
                            fontSize: "18px",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            name="key"
                            value="value"
                            checked={permission.delete}
                            onChange={() => {}}
                            style={{ display: "none" }} // Hide the default checkbox
                          />
                          <span
                            onClick={(e) => e.stopPropagation()}
                            className="green"
                          ></span>
                          Delete
                        </label>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            );
          })}
        </div>
      </Form>

      <H2>Legal Attachements</H2>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {cnicFront !== null &&
            checkFileTypeByExtension(cnicFront.name, cnicFront) == "image" ? (
              <div>
                <Label style={{ fontSize: "18px", fontWeight: "bold" }}>
                  CNIC Front
                  <span className="txt-danger">*</span>
                </Label>
                <img
                  src={URL.createObjectURL(cnicFront)}
                  alt=""
                  style={{
                    width: "300px",
                    height: "220px",
                    border: "1px solid lightgray",
                  }}
                />
              </div>
            ) : (
              cnicFront !== null &&
              checkFileTypeByExtension(cnicFront.name, cnicFront) == "pdf" && (
                <div>
                  <Label style={{ fontSize: "18px", fontWeight: "bold" }}>
                    CNIC Front
                    <span className="txt-danger">*</span>
                  </Label>
                  <PDFViewer
                    file={cnicFront}
                    name={cnicFront.name.toString().slice(0, 20)}
                  />
                </div>
              )
            )}
            {cnicBack !== null &&
            checkFileTypeByExtension(cnicBack.name, cnicBack) == "image" ? (
              <div>
                <Label style={{ fontSize: "18px", fontWeight: "bold" }}>
                  CNIC Back
                  <span className="txt-danger">*</span>
                </Label>
                <img
                  src={URL.createObjectURL(cnicBack)}
                  alt=""
                  style={{
                    width: "300px",
                    height: "220px",
                    border: "1px solid lightgray",
                  }}
                />
              </div>
            ) : (
              cnicBack !== null &&
              checkFileTypeByExtension(cnicBack.name, cnicBack) == "pdf" && (
                <div>
                  <Label style={{ fontSize: "18px", fontWeight: "bold" }}>
                    CNIC Back
                    <span className="txt-danger">*</span>
                  </Label>
                  <PDFViewer
                    file={cnicBack}
                    name={cnicBack.name.toString().slice(0, 20)}
                  />
                </div>
              )
            )}
            {ntnFile !== null &&
            checkFileTypeByExtension(ntnFile.name, ntnFile) == "image" ? (
              <div>
                <Label style={{ fontSize: "18px", fontWeight: "bold" }}>
                  NTN File
                  <span className="txt-danger">*</span>
                </Label>
                <img
                  src={URL.createObjectURL(ntnFile)}
                  alt=""
                  style={{
                    width: "300px",
                    height: "220px",
                    border: "1px solid lightgray",
                  }}
                />
              </div>
            ) : (
              ntnFile !== null &&
              checkFileTypeByExtension(ntnFile.name, ntnFile) == "pdf" && (
                <div>
                  <Label style={{ fontSize: "18px", fontWeight: "bold" }}>
                    NTN File
                    <span className="txt-danger">*</span>
                  </Label>
                  <PDFViewer
                    file={ntnFile}
                    name={ntnFile.name.toString().slice(0, 20)}
                  />
                </div>
              )
            )}
            {ptaCertificate !== null &&
            checkFileTypeByExtension(ptaCertificate.name, ptaCertificate) ==
              "image" ? (
              <div>
                <Label style={{ fontSize: "18px", fontWeight: "bold" }}>
                  PTA Certificate
                  <span className="txt-danger">*</span>
                </Label>
                <img
                  src={URL.createObjectURL(ptaCertificate)}
                  alt=""
                  style={{
                    width: "300px",
                    height: "220px",
                    border: "1px solid lightgray",
                  }}
                />
              </div>
            ) : (
              ptaCertificate !== null &&
              checkFileTypeByExtension(ptaCertificate.name, ptaCertificate) ==
                "pdf" && (
                <div>
                  <Label style={{ fontSize: "18px", fontWeight: "bold" }}>
                    PTA Certificate
                    <span className="txt-danger">*</span>
                  </Label>
                  <PDFViewer
                    file={ptaCertificate}
                    name={ptaCertificate.name.toString().slice(0, 20)}
                  />
                </div>
              )
            )}
            {other !== null &&
            checkFileTypeByExtension(other.name, other) == "image" ? (
              <div>
                <Label style={{ fontSize: "18px", fontWeight: "bold" }}>
                  Other
                  <span className="txt-danger">*</span>
                </Label>
                <img
                  src={URL.createObjectURL(other)}
                  alt=""
                  style={{
                    width: "300px",
                    height: "220px",
                    border: "1px solid lightgray",
                  }}
                />
              </div>
            ) : (
              other !== null &&
              checkFileTypeByExtension(other.name, other) == "pdf" && (
                <div>
                  <Label style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Other
                    <span className="txt-danger">*</span>
                  </Label>
                  <PDFViewer
                    file={other}
                    name={other.name.toString().slice(0, 20)}
                  />
                </div>
              )
            )}
          </div>
        </Row>
      </Form>
      <Row>
        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          {/* <Button color="primary">Print</Button> */}
          <Button
            disabled={loading ? true : false}
            color="primary"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SuccessfullyFormSubmitted;
