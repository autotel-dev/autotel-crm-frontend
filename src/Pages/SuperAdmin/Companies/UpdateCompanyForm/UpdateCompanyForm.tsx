import { H4, H5, P } from "../../../../AbstractElements";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import Skeleton from "../../../Utilities/Skeleton/Skeleton";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  Input,
  Row,
  Container,
  InputGroup,
  Label,
  Modal,
  ModalBody,
  CardHeader,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { setNoDataFound } from "../../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import {
  create,
  getAll,
  getImage,
  update,
} from "../../../../Utilities/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import SelectCitiesBox from "./SelectCitiesBox";
import SelectPackageBox from "./SelectPackageBox";
import SelectTimeZoneBox from "./SelectTimeZoneBox";
import {
  setCompanies,
  setCompaniesEnd,
  setCompaniesStart,
  setFilterCompanies,
  setIsConnected,
} from "../../../../ReaduxToolkit/Reducer/CompanySlice";
import CommonHeader from "../../../../Common/CommonHeader";
import { Select } from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import Loader from "../../../Utilities/Loader/Loader";
import { GET_ALL_COMPANIES, GET_COMPANY_BY_ID, IMAGE_BASE_URL, UPDATE_COMPANY } from "../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../Utilities/constants/constants";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PropsTypes {
  location: any;
}
const UpdateCompanyForm = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { crmModules, servers, permissions } = useSelector(
    (state: any) => state.companies
  );
  const [formData, setFormData]: any = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [attachementImagesLoading, setAttachementImagesLoading] =
    useState(true);
  const [removedModules, setRemovedModules]: any = useState([]);
  const [updatedCity, setUpdatedCity] = useState("");
  const [updatedPackage, setUpdatedPackage] = useState("");
  const [updatedTimeZone, setUpdatedTimeZone] = useState("");
  const [attachementImages, setAttachementImages] = useState<any[]>([]);
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [serverList, setServerList] = useState([]);
  const { Option } = Select;

  const tempList: any = [];
  useEffect(() => {
    // console.log("Servers in useeffect -- >", servers);

    servers?.map((item: any, index: any) => {
      tempList.push({
        value: `${item._id}`,
        label: `${item.companyName}`,
        hostUrl: `${item.backendUrl}`,
        server: `${item._id}`,
        item: `${item}`,
      });
    });
    setServerList(tempList);
  }, [servers]);
  useEffect(() => {
    getAll({ url: `${GET_COMPANY_BY_ID}/${companyId}` }).then(
      (data: any) => {
        // console.log("api call --- >", data);

        if (data !== undefined) {
          dispatch(setNoDataFound(data.message));
          if (!data.success && data.message === ERROR_MESSAGE) {
            dispatch(setIsConnected(true));
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
            const formDataWithChecked = {
              ...data.data,
              permissions: permissions.map((permission: any) => {
                const matchingAdminPermission = data.data.permissions.find(
                  (adminPermission: any) =>
                    adminPermission.value === permission.value
                );
                if (matchingAdminPermission) {
                  return {
                    ...permission,
                    checked: true,
                    read: matchingAdminPermission.read,
                    create: matchingAdminPermission.create,
                    edit: matchingAdminPermission.edit,
                    delete: matchingAdminPermission.delete,
                  };
                } else {
                  return {
                    ...permission,
                    checked: false,
                    read: false,
                    create: false,
                    edit: false,
                    delete: false,
                  };
                }
              }),
            };

            setFormData(formDataWithChecked);
            const updatedCrmModules = crmModules.map((module: any) => {
              const foundModule = data.data.allowedModules.find(
                (allowedModule: any) => allowedModule._id === module._id
              );
              return {
                ...module,
                checked: !!foundModule, // Set checked to true if foundModule is truthy, otherwise false
              };
            });
            setRemovedModules(updatedCrmModules);

            getImage({
              url: `${IMAGE_BASE_URL}/${data.data.cnicFront.url}`,
            }).then(async (dataa: any) => {
              if (data.data.cnicFront.url !== "") {
                attachementImages.push({
                  key: "cnicFront",
                  url: data.data?.cnicFront.url,
                  blob: dataa,
                });
              }

              setAttachementImages(attachementImages);

              // setFormData(formData);
              getImage({
                url: `${IMAGE_BASE_URL}/${data.data.cnicBack.url}`,
              }).then(async (dataa: any) => {
                if (data.data.cnicBack.url !== "") {
                  attachementImages.push({
                    key: "cnicBack",
                    url: data.data?.cnicBack.url,
                    blob: dataa,
                  });
                }
                setAttachementImages(attachementImages);

                // setFormData(formData);
                getImage({
                  url: `${IMAGE_BASE_URL}/${data.data.ptaCertificate.url}`,
                }).then(async (dataa: any) => {
                  if (data.data.ptaCertificate.url !== "") {
                    attachementImages.push({
                      key: "ptaCertificate",
                      url: data.data?.ptaCertificate.url,
                      blob: dataa,
                    });
                  }
                  setAttachementImages(attachementImages);

                  // setFormData(formData);
                  getImage({
                    url: `${IMAGE_BASE_URL}/${data.data.ntnCertificate.url}`,
                  }).then(async (dataa: any) => {
                    if (data.data.ntnCertificate.url !== "") {
                      attachementImages.push({
                        key: "ntnCertificate",
                        url: data.data?.ntnCertificate.url,
                        blob: dataa,
                      });
                    }
                    setAttachementImages(attachementImages);

                    // setFormData(formData);
                    getImage({
                      url: `${IMAGE_BASE_URL}/${data.data.otherAttachment.url}`,
                    }).then(async (dataa: any) => {
                      if (data.data.otherAttachment.url !== "") {
                        attachementImages.push({
                          key: "otherAttachment",
                          url: data.data?.otherAttachment.url,
                          blob: dataa,
                        });
                      }
                      setAttachementImages(attachementImages);

                      // setFormData(formData);
                      setLoading(false);
                    });
                  });
                });
              });
            });

            // if (attachementImages.length === 5) {
              setLoading(false);
            // }
          }
        }
      }
    );
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [firebaseShowPassword, setFireaseShowPassword] = useState(false);
  const [googleShowPassword, setGoogleShowPassword] = useState(false);
  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const toggleFirebasePasswordVisibility = (e: any) => {
    e.preventDefault();
    setFireaseShowPassword(!firebaseShowPassword);
  };
  const toggleGooglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setGoogleShowPassword(!googleShowPassword);
  };

  const updateFormData = (field: any, value: any) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData, // Copy the existing state
      [field]: value, // Update the specific field
    }));
  };

  const handleServerCredentialChange = (index: any, field: any, value: any) => {
    const updatedCredentials = [...formData.serverCredentials];
    updatedCredentials[index][field] = value;
    setFormData({ ...formData, serverCredentials: updatedCredentials });
  };

  // Inside your component
  const handlePermissionChange = (
    index: any,
    field: any,
    value: any,
    title: any
  ) => {
    // Clone the permissions array from formData
    let updatedPermissions = [...formData.permissions];

    // Update the specific permission field if it's not "checked"

    updatedPermissions[index][field] = value;

    // Check if the permission title exists in formData.permissions

    // Set the updated permissions array back to the formData state
    setFormData({ ...formData, permissions: updatedPermissions });
  };

  const handleAllowedModuleChange = (
    index: any,
    field: any,
    value: any,
    item: any
  ) => {
    const updatedModules = [...removedModules];

    // If the module is being unchecked, remove it from the array
    updatedModules[index][field] = value;
    setRemovedModules(updatedModules);

    // setFormData({ ...formData, allowedModules: updatedModules });
  };

  const updateCompanySubmitted = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const convertedServerCredentials = formData.serverCredentials.map(
      (credential: any) => ({
        emailAddress: credential.emailAddress,
        password: credential.password,
        hostUrl: credential.hostUrl,
        server: credential.server._id,
      })
    );
    const filteredPermissions = formData.permissions.filter(
      (permission: any) => permission.checked
    );

    // Create a copy of the filtered permissions array without the checked key
    const updatedPermissions = filteredPermissions.map((permission: any) => {
      const { checked, ...permissionWithoutChecked } = permission;
      return permissionWithoutChecked;
    });
    // console.log("updatedFormData", formData);

    const updatedRemoveModules = removedModules.filter(
      (module: any) => module.checked
    );
    const updatedModuless = updatedRemoveModules.map((module: any) => {
      const { _id, ...rest } = module;
      return _id;
    });

    const updatedFormData = {
      ...formData,
      allowedModules: updatedModuless,
      permissions: updatedPermissions,
      package: updatedPackage !== "" ? updatedPackage : formData.package._id,
      city: updatedCity !== "" ? updatedCity : formData.city._id,
      timezone: updatedTimeZone !== "" ? updatedTimeZone : formData.timezone,
      serverCredentials: convertedServerCredentials,
    };

    try {
      await update(updatedFormData, {
        url: `${UPDATE_COMPANY}/${companyId}`,
      }).then((data: any) => {
        // console.log("update Server form updated");

        setLoading(false);
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
          // console.log(data);
          setLoading(false);
          dispatch(setCompaniesStart());
          getAll({ url: GET_ALL_COMPANIES }).then((data: any) => {
            if (data !== undefined) {
              dispatch(setNoDataFound(data.message));
              if (
                !data.success &&
                data.message === ERROR_MESSAGE
              ) {
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
                // console.log("hhg");
                dispatch(setCompanies(data.data));
                dispatch(setFilterCompanies(data.data));
                navigate(`${process.env.PUBLIC_URL}/super-admin/companies`);
              }
            }
            dispatch(setCompaniesEnd());
          });
        }
      });
      // Handle successful post creation (e.g., show a success message, redirect, etc.)
    } catch (error: any) {
      setLoading(false);
    }
  };

  const handleDeselect = (value: any, option: any) => {
    // Dispatch an action to remove the deselected item from the Redux state
    console.log("value", value);
    console.log("option", option);

    const updatedList = formData?.serverCredentials?.filter(
      (item: any) => item?.server?._id !== value
    );
    console.log("updatedList", updatedList);

    setFormData({ ...formData, serverCredentials: updatedList });
  };

  // Attachement ASSETS

  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    setAddModal(!addModal);
  };

  const [imageUrl, setImageUrl] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [index, setIndex] = useState(0);

  const handleMouseEnter = (index: any) => {
    setIsHovered(true);
    setIndex(index);
  };
  const handleMouseLeave = (index: any) => {
    setIsHovered(false);
    setIndex(index);
  };

  function checkFileTypeByExtension(fileName: any) {
    // console.log("filename", fileName);

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

  const [image, setImage] = useState<string | null>(null);
  const onDocumentLoadSuccess = async (file: any) => {
    try {
      const pdf = await pdfjs.getDocument(file).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) {
        throw new Error("Canvas context is null");
      }
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      const imgData = canvas.toDataURL();
      setImage(imgData);
    } catch (error) {
      // console.error("Error rendering PDF:", error);
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    file: any
  ) => {
    event.preventDefault();
    window.open(file, "_blank");
  };

  return (
    <>
      {loading ? (
        // <div
        //   style={{
        //     display: "flex",
        //     marginTop: "130px",
        //     justifyContent: "center",
        //     height: "90vh",
        //     backgroundColor: "white",
        //     alignItems: "center",
        //   }}
        // >
          <div style={{ textAlign: "center" }}>
            {/* <Loader /> */}

            <>
              <div
                style={{
                  display: "flex",
                  width :"100%",
                  justifyContent: "space-between",
                   marginLeft:"20px",
                  //  marginRight:"50px",
                   marginTop:"200px",
                }}
              >
                <div style={{width:"33%", }}>
                <Skeleton
                  height="20px"
                  width="45%"
                  borderRadius="10px"
                  marginBottom="5px"
                />
                <Skeleton
                  height="40px"
                  width="100%"
                  marginBottom="10"
                  borderRadius="10px"
                />
                </div>
                <div style={{width:"30%"}}>
                <Skeleton
                  height="20px"
                  width="45%"
                  borderRadius="10px"
                  marginBottom="5px"
                />
                <Skeleton
                  height="40px"
                  width="100%"
                  marginBottom="10"
                  borderRadius="10px"
                />
                </div>
                <div style={{width:"30%" ,  marginRight:"50px"}}>
                <Skeleton
                  height="20px"
                  width="45%"
                  borderRadius="10px"
                  marginBottom="5px"
                />
                <Skeleton
                  height="40px"
                  width="100%"
                  marginBottom="10"
                  borderRadius="10px"
                />
                </div>
                
               
              </div>
              <div
                style={{
                  display: "flex",
                  width :"100%",
                  justifyContent: "space-between",
                   marginLeft:"20px",
                  //  marginRight:"50px",
                   marginTop:"60px",
                }}
              >
                <div style={{width:"33%", }}>
                <Skeleton
                  height="20px"
                  width="45%"
                  borderRadius="10px"
                  marginBottom="5px"
                />
                <Skeleton
                  height="40px"
                  width="100%"
                  marginBottom="10"
                  borderRadius="10px"
                />
                </div>
                <div style={{width:"30%"}}>
                <Skeleton
                  height="20px"
                  width="45%"
                  borderRadius="10px"
                  marginBottom="5px"
                />
                <Skeleton
                  height="40px"
                  width="100%"
                  marginBottom="10"
                  borderRadius="10px"
                />
                </div>
                <div style={{width:"30%" ,  marginRight:"50px"}}>
                <Skeleton
                  height="20px"
                  width="45%"
                  borderRadius="10px"
                  marginBottom="5px"
                />
                <Skeleton
                  height="40px"
                  width="100%"
                  marginBottom="10"
                  borderRadius="10px"
                />
                </div>
                
               
              </div>
              <div
                style={{
                  display: "flex",
                  width :"100%",
                  justifyContent: "space-between",
                   marginLeft:"20px",
                  //  marginRight:"50px",
                   marginTop:"60px",
                }}
              >
                <div style={{width:"33%", }}>
                <Skeleton
                  height="20px"
                  width="45%"
                  borderRadius="10px"
                  marginBottom="5px"
                />
                <Skeleton
                  height="40px"
                  width="100%"
                  marginBottom="10"
                  borderRadius="10px"
                />
                </div>
                <div style={{width:"30%"}}>
                <Skeleton
                  height="20px"
                  width="45%"
                  borderRadius="10px"
                  marginBottom="5px"
                />
                <Skeleton
                  height="40px"
                  width="100%"
                  marginBottom="10"
                  borderRadius="10px"
                />
                </div>
                <div style={{width:"30%" ,  marginRight:"50px"}}>
                <Skeleton
                  height="20px"
                  width="45%"
                  borderRadius="10px"
                  marginBottom="5px"
                />
                <Skeleton
                  height="40px"
                  width="100%"
                  marginBottom="10"
                  borderRadius="10px"
                />
                </div>
                
               
              </div>
              <div
                style={{
                  display: "flex",
                  width :"100%",
                  justifyContent: "space-between",
                   marginLeft:"20px",
                  //  marginRight:"50px",
                   marginTop:"60px",
                }}
              >
                <div style={{width:"33%", }}>
                <Skeleton
                  height="20px"
                  width="45%"
                  borderRadius="10px"
                  marginBottom="5px"
                />
                <Skeleton
                  height="40px"
                  width="100%"
                  marginBottom="10"
                  borderRadius="10px"
                />
                </div>
                <div style={{width:"30%"}}>
                <Skeleton
                  height="20px"
                  width="45%"
                  borderRadius="10px"
                  marginBottom="5px"
                />
                <Skeleton
                  height="40px"
                  width="100%"
                  marginBottom="10"
                  borderRadius="10px"
                />
                </div>
                <div style={{width:"30%" ,  marginRight:"50px"}}>
                <Skeleton
                  height="20px"
                  width="45%"
                  borderRadius="10px"
                  marginBottom="5px"
                />
                <Skeleton
                  height="40px"
                  width="100%"
                  marginBottom="10"
                  borderRadius="10px"
                />
                </div>
                
               
              </div>
            </>
          </div>
        
      ) : (
        <div>
          <Breadcrumbs
            mainTitle="Update Company"
            parent="Companies"
            title="Update Company"
          />
          <Container fluid>
            <Row>
              <Col sm={12}>
                <Card>
                  <CardBody>
                    <div className="form-completed">
                      <Form>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "30px",
                          }}
                        >
                          <H4>Company Info</H4>
                          <Row>
                            <Col
                              xs={9}
                              className="text-end d-flex justify-content-end gap-2 align-center"
                            ></Col>
                          </Row>
                        </div>

                        <Row
                          className="g-3"
                          style={{ marginBottom: "65px", marginTop: "20px" }}
                        >
                          <Col xl={4} sm={6}>
                            <P>
                              Company Name
                              <span className="txt-danger">*</span>
                            </P>
                            <Input
                              type="text"
                              placeholder="Enter Company Name"
                              defaultValue={formData.fullName}
                              name="fullName"
                              onChange={(e) =>
                                updateFormData("fullName", e.target.value)
                              }
                            />
                          </Col>
                          <Col xl={4} sm={6}>
                            <P>
                              Phone No
                              <span className="txt-danger">*</span>
                            </P>
                            <Input
                              type="text"
                              placeholder="Enter Phone Number"
                              defaultValue={formData.phoneNo}
                              name="phoneNo"
                              onChange={(e) =>
                                updateFormData("phoneNo", e.target.value)
                              }
                            />
                          </Col>
                          <Col xl={4} xs={6}>
                            <P>
                              Address
                              <span className="txt-danger">*</span>
                            </P>
                            <Input
                              type="text"
                              placeholder="Enter address"
                              defaultValue={formData.address}
                              name="address"
                              onChange={(e) =>
                                updateFormData("address", e.target.value)
                              }
                            />
                          </Col>
                          <Col xl={4} xs={6}>
                            <P>
                              Contact Person Name
                              <span className="txt-danger">*</span>
                            </P>
                            <Input
                              type="text"
                              placeholder="Enter Contact Person Name"
                              defaultValue={formData.contactPersonName}
                              name="contactPersonName"
                              onChange={(e) =>
                                updateFormData(
                                  "contactPersonName",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col xl={4} sm={6}>
                            <P>
                              NTN
                              <span className="txt-danger">*</span>
                            </P>
                            <Input
                              type="text"
                              placeholder="Enter NTN"
                              defaultValue={formData.ntn}
                              name="ntn"
                              onChange={(e) =>
                                updateFormData("ntn", e.target.value)
                              }
                            />
                          </Col>
                          <Col xl={4} sm={6}>
                            <P>
                              Gst No
                              <span className="txt-danger">*</span>
                            </P>
                            <Input
                              type="text"
                              placeholder="Enter Gst Number"
                              defaultValue={formData.gstNo}
                              name="gstNo"
                              onChange={(e) =>
                                updateFormData("gstNo", e.target.value)
                              }
                            />
                          </Col>
                          <Col xl={4} xs={6}>
                            <P>
                              Contact Person Number
                              <span className="txt-danger">*</span>
                            </P>
                            <Input
                              type="text"
                              placeholder="Enter Contact Person Number"
                              defaultValue={formData.contactPersonPhoneNo}
                              name="contactPersonPhoneNo"
                              onChange={(e) =>
                                updateFormData(
                                  "contactPersonPhoneNo",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col xl={4} xs={6}>
                            <P>
                              CNIC Number
                              <span className="txt-danger">*</span>
                            </P>
                            <Input
                              type="text"
                              placeholder="Enter CNIC Number"
                              defaultValue={formData.cnicNo}
                              name="cnicNo"
                              onChange={(e) =>
                                updateFormData("cnicNo", e.target.value)
                              }
                            />
                          </Col>
                          <Col xl={4} xs={6}>
                            <P>
                              Package Expiration Date
                              <span className="txt-danger">*</span>
                            </P>
                            <Input
                              id="packageExpirationDate"
                              type="date"
                              value={formData?.packageExpirationDate?.slice(
                                0,
                                10
                              )}
                              name="packageExpirationDate"
                              onChange={(e) => {
                                updateFormData(
                                  "packageExpirationDate",
                                  e.target.value
                                );
                              }}
                            />
                          </Col>
                          <Col xl={4} xs={6}>
                            <div>
                              <P>
                                Select City
                                <span className="txt-danger">*</span>
                              </P>
                            </div>
                            <SelectCitiesBox
                              placeholder="Select City"
                              defaultValue={formData?.city?._id}
                              setUpdatedCity={setUpdatedCity}
                            />
                          </Col>
                          <Col xl={4} xs={6}>
                            <div>
                              <P>
                                Select Package
                                <span className="txt-danger">*</span>
                              </P>
                            </div>
                            <SelectPackageBox
                              placeholder="Select Package"
                              defaultValue={formData?.package?._id}
                              setUpdatedPackage={setUpdatedPackage}
                            />
                          </Col>
                          <Col xl={4} xs={6}>
                            <div>
                              <P>
                                Select Time Zone
                                <span className="txt-danger">*</span>
                              </P>
                            </div>
                            <SelectTimeZoneBox
                              placeholder="Select Time Zone"
                              defaultValue={formData?.timezone}
                              setUpdatedTimeZone={setUpdatedTimeZone}
                            />
                          </Col>
                        </Row>

                        <H4>Account Credentials</H4>

                        <Row
                          className="g-3"
                          style={{ marginBottom: "65px", marginTop: "20px" }}
                        >
                          <Col sm={6}>
                            <P>
                              Email Address
                              <span className="txt-danger">*</span>
                            </P>
                            <Input
                              value={formData.emailAddress}
                              name="emailAddress"
                              onChange={(e) => {
                                updateFormData("emailAddress", e.target.value);
                              }}
                              type="email"
                              placeholder="Enter Email Address"
                            />
                          </Col>
                          {/* <Col sm={6}>
                            <P>
                              Password
                              <span className="txt-danger">*</span>
                            </P>

                            <InputGroup>
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                value={formData.password}
                                name="password"
                                onChange={(e) => {
                                  updateFormData("password", e.target.value);
                                }}
                              />
                              <Button
                                color="white"
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
                          </Col> */}
                        </Row>

                        <H4>Server Credentials</H4>
                        <Col md={6}>
                          <Select
                            defaultValue={formData?.serverCredentials.map(
                              (server: any) => server?.server?.companyName
                            )}
                            value={formData?.serverCredentials?.map(
                              (server: any) => server?.server?._id
                            )}
                            showSearch
                            mode="multiple"
                            style={{ width: "100%", height: 36 }}
                            placeholder="Add Servers"
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                              (option?.label ?? "").includes(input)
                            }
                            filterSort={(optionA: any, optionB: any) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
                            }
                            onChange={(selectedValues, selectedOptions) => {
                              // const newlySelectedServers = selectedOptions.filter(
                              //   (option: any) =>
                              //     !formData.serverCredentials.some(
                              //       (server: any) => server.label === option.label
                              //     )
                              // );
                              const newlySelectedServers =
                                selectedOptions.filter(
                                  (option: any) =>
                                    !formData.serverCredentials.some(
                                      (server: any) =>
                                        server?.server?._id === option.server
                                    )
                                );
                              // console.log("selectedValues", selectedValues);

                              // console.log(
                              //   "newlySelectedServers",
                              //   newlySelectedServers
                              // );

                              const newServers = newlySelectedServers.map(
                                (option: any) => ({
                                  label: option.label,
                                  emailAddress: "",
                                  password: "",
                                  server: {
                                    _id: option.server,
                                    companyName: option.label,
                                  },
                                  hostUrl: option.hostUrl,
                                })
                              );

                              const updatedCredentials = [
                                ...formData.serverCredentials,
                                ...newServers,
                              ];

                              setFormData((prevState: any) => ({
                                ...prevState,
                                serverCredentials: updatedCredentials,
                              }));

                              // console.log("reduxServerAdItemsList -- >", serversAddItemsList);
                            }}
                            // Custom rendering for options
                            dropdownRender={(menu) => (
                              <div>
                                {menu}
                                {formData?.serverCredentials?.map(
                                  (server: any) => (
                                    <Option
                                      key={server?.server?._id}
                                      value={server?.server?._id}
                                      disabled
                                    >
                                      {server?.server?.companyName}
                                    </Option>
                                  )
                                )}
                              </div>
                            )}
                            options={serverList}
                            onDeselect={handleDeselect}
                          />
                        </Col>
                        <Form
                          style={{ marginBottom: "65px", marginTop: "20px" }}
                        >
                          {formData?.serverCredentials?.map(
                            (item: any, index: any) => {
                              return (
                                <div
                                  style={{
                                    padding: "20px",
                                    border: "1px solid black",
                                    borderRadius: "10px",
                                    margin: "20px 0px",
                                  }}
                                >
                                  <Row className="g-3">
                                    <Col lg={12} sm={12}>
                                      <CommonHeader
                                        title={item?.server?.companyName}
                                        headClass="pb-0"
                                      />
                                    </Col>
                                    <Col sm={6}>
                                      <P>
                                        Email Address
                                        <span className="txt-danger">*</span>
                                      </P>
                                      <Input
                                        value={item?.emailAddress}
                                        name="emailAddress"
                                        type="email"
                                        placeholder="Enter Email Address"
                                        onChange={(e) =>
                                          handleServerCredentialChange(
                                            index,
                                            "emailAddress",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Col>

                                    <Col sm={6}>
                                      <P>
                                        Password
                                        <span className="txt-danger">*</span>
                                      </P>
                                      <Input
                                        value={item?.password}
                                        name="password"
                                        type="email"
                                        placeholder="Enter Password"
                                        onChange={(e) =>
                                          handleServerCredentialChange(
                                            index,
                                            "password",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col sm={6}>
                                      <P>
                                        Server Id
                                        <span className="txt-danger">*</span>
                                      </P>
                                      <Input
                                        type="text"
                                        placeholder="Enter Server"
                                        value={item?.server?._id}
                                        name="server"
                                        disabled
                                      />
                                    </Col>
                                    <Col sm={6}>
                                      <P>
                                        Host Url
                                        <span className="txt-danger">*</span>
                                      </P>
                                      <Input
                                        type="text"
                                        placeholder="Enter Host Url"
                                        value={item?.hostUrl}
                                        name="hostUrl"
                                        disabled
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              );
                            }
                          )}
                        </Form>

                        <H4>Allowed CRM Modules</H4>
                        <Form
                          style={{ marginBottom: "65px", marginTop: "20px" }}
                        >
                          {removedModules.map((item: any, index: any) => {
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
                                  <Col md={6}>{item.name}</Col>
                                  <Col md={6}>
                                    <div className="d-flex" key={index}>
                                      <div
                                        className={`text-end flex-shrink-0 icon-state 
                            }`}
                                      >
                                        <Label className="switch mb-0">
                                          <Input
                                            type="checkbox"
                                            // defaultChecked={removedModules.includes(
                                            //   item._id
                                            // )}
                                            checked={item.checked}
                                            onChange={(e) =>
                                              handleAllowedModuleChange(
                                                index,
                                                "checked",
                                                !item.checked,
                                                item
                                              )
                                            }
                                          />
                                          <span
                                            className={`switch-state ${
                                              item.checked
                                                ? `bg-primary`
                                                : `bg-secondary`
                                            }`}
                                          />
                                        </Label>
                                      </div>
                                    </div>
                                  </Col>
                                </Col>
                              </div>
                            );
                          })}
                        </Form>
                        <H4>Allowed Permissions</H4>
                        <Form
                          style={{ marginBottom: "65px", marginTop: "20px" }}
                        >
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
                            {formData.permissions?.map(
                              (permission: any, index: any) => {
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
                                          <Label
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
                                              onChange={(e) =>
                                                handlePermissionChange(
                                                  index,
                                                  "checked",
                                                  e.target.checked,
                                                  permission.title
                                                )
                                              }
                                              style={{ display: "none" }} // Hide the default checkbox
                                            />
                                            <span
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                              className="green"
                                            ></span>
                                          </Label>
                                          {permission.title}
                                        </span>

                                        {permission.checked && (
                                          <div>
                                            <Label
                                              style={{
                                                display: "inline-block",
                                                position: "relative",
                                                cursor: "pointer",
                                                marginRight: "25px",
                                                fontSize: "18px",
                                              }}
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              <input
                                                type="checkbox"
                                                name="key"
                                                value="value"
                                                checked={permission.read}
                                                onChange={(e) =>
                                                  handlePermissionChange(
                                                    index,
                                                    "read",
                                                    e.target.checked,
                                                    permission.title
                                                  )
                                                }
                                                style={{ display: "none" }} // Hide the default checkbox
                                              />
                                              <span
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                                className="green"
                                              ></span>
                                              Read
                                            </Label>
                                            <Label
                                              style={{
                                                display: "inline-block",
                                                position: "relative",
                                                cursor: "pointer",
                                                marginRight: "25px",
                                                fontSize: "18px",
                                              }}
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              <input
                                                type="checkbox"
                                                name="key"
                                                value="value"
                                                checked={permission.create}
                                                onChange={(e) =>
                                                  handlePermissionChange(
                                                    index,
                                                    "create",
                                                    e.target.checked,
                                                    permission.title
                                                  )
                                                }
                                                style={{ display: "none" }} // Hide the default checkbox
                                              />
                                              <span
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                                className="green"
                                              ></span>
                                              Create
                                            </Label>
                                            <Label
                                              style={{
                                                display: "inline-block",
                                                position: "relative",
                                                cursor: "pointer",
                                                marginRight: "25px",
                                                fontSize: "18px",
                                              }}
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              <input
                                                type="checkbox"
                                                name="key"
                                                value="value"
                                                checked={permission.edit}
                                                onChange={(e) =>
                                                  handlePermissionChange(
                                                    index,
                                                    "edit",
                                                    e.target.checked,
                                                    permission.title
                                                  )
                                                }
                                                style={{ display: "none" }} // Hide the default checkbox
                                              />
                                              <span
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                                className="green"
                                              ></span>
                                              Edit
                                            </Label>
                                            <Label
                                              style={{
                                                display: "inline-block",
                                                position: "relative",
                                                cursor: "pointer",
                                                marginRight: "25px",
                                                fontSize: "18px",
                                              }}
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              <input
                                                type="checkbox"
                                                name="key"
                                                value="value"
                                                checked={permission.delete}
                                                onChange={(e) =>
                                                  handlePermissionChange(
                                                    index,
                                                    "delete",
                                                    e.target.checked,
                                                    permission.title
                                                  )
                                                }
                                                style={{ display: "none" }} // Hide the default checkbox
                                              />
                                              <span
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                                className="green"
                                              ></span>
                                              Delete
                                            </Label>
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </Form>
                        {/* Row commented if below will uncomment */}
                      </Form>
                      <Row>
                        <Col
                          xs={12}
                          className="text-end d-flex justify-content-end gap-2 align-center"
                        >
                          {/* <Button color="primary">Print</Button> */}
                          <Button
                            color="primary"
                            onClick={(e) => {
                              updateCompanySubmitted(e);
                            }}
                          >
                            {loading ? "Loading..." : "Submit"}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader className="pb-0">
                    <H4>Attachments</H4>
                  </CardHeader>
                  <CardBody>
                    {attachementImages.length > 0 ? (
                      <Row>
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                          {attachementImages.map((data, imageIndex) =>
                            checkFileTypeByExtension(data.url) === "pdf" ? (
                              <div>
                                <H5>
                                  {data.key === "cnicFront"
                                    ? "CNIC Front"
                                    : data.key === "cnicBack"
                                    ? "CNIC Back"
                                    : data.key === "ptaCertificate"
                                    ? "PTA Certificate"
                                    : data.key === "ntnCertificate"
                                    ? "NTN Certificate"
                                    : "Other Attachment"}
                                </H5>
                                <div
                                  style={{
                                    width: "300px",
                                    marginRight: "20px",
                                    marginBottom: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => handleClick(e, data.blob)} // Add onClick event handler
                                >
                                  {image && (
                                    <img src={image} alt="First Page" />
                                  )}
                                  <div
                                    style={{
                                      height: "160px",
                                      overflow: "hidden", // Changed from "scroll" to "hidden"
                                      border: "1px solid lightgray",
                                    }}
                                  >
                                    <Document
                                      file={data.blob}
                                      onLoadSuccess={() =>
                                        onDocumentLoadSuccess(image)
                                      }
                                    >
                                      <Page pageNumber={1} width={300} />
                                    </Document>
                                  </div>
                                  <div
                                    style={{
                                      padding: "8px 15px",
                                      fontSize: "16px",
                                      borderBottomLeftRadius: "5px",
                                      borderBottomRightRadius: "5px",
                                      overflow: "clip",
                                    }}
                                    className="btn-primary"
                                  >
                                    {data.key === "cnicFront"
                                      ? "CNIC Front"
                                      : data.key === "cnicBack"
                                      ? "CNIC Back"
                                      : data.key === "ptaCertificate"
                                      ? "PTA Certificate"
                                      : data.key === "ntnCertificate"
                                      ? "NTN Certificate"
                                      : "Other Attachment"}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <H5>
                                  {data.key === "cnicFront"
                                    ? "CNIC Front"
                                    : "CNIC Back"}
                                </H5>
                                <div
                                  style={{
                                    position: "relative",
                                    marginRight: "20px",
                                    marginBottom: "20px",
                                  }}
                                  onMouseEnter={() =>
                                    handleMouseEnter(imageIndex)
                                  }
                                  onMouseLeave={() =>
                                    handleMouseLeave(imageIndex)
                                  }
                                  onClick={() => {
                                    setImageUrl(data.blob);
                                    addToggle();
                                  }}
                                >
                                  <img
                                    src={data.blob}
                                    alt=""
                                    height={200}
                                    width={300}
                                    style={{
                                      borderRadius: "10px",
                                      border: "0.5px solid lightgray",
                                    }}
                                  />
                                  {isHovered && index === imageIndex && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        background: "rgba(0, 0, 0, 0.7)", // Light black color with opacity
                                        borderRadius: "10px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "20px",
                                          color: "white",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        View Image
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                          <Modal
                            isOpen={addModal}
                            toggle={addToggle}
                            size="lg"
                            centered
                          >
                            <ModalBody>
                              <div>
                                <div className="modal-header"></div>
                                <img
                                  src={imageUrl}
                                  alt=""
                                  height={500}
                                  width="100%"
                                />
                              </div>
                            </ModalBody>
                          </Modal>
                        </div>
                      </Row>
                    ) : (
                      <div>No attachments found</div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default UpdateCompanyForm;
