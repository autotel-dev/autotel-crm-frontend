import { H4, P } from "../../../AbstractElements";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
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
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { IMAGE_BASE_URL, create, getAll, getImage, update } from "../../../Api";
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
} from "../../../ReaduxToolkit/Reducer/CompanySlice";
import Loader from "../../Loader/Loader";
import CommonHeader from "../../../Common/CommonHeader";
import { Select } from "antd";

interface PropsTypes {
  location: any;
}
const UpdateCompanyForm = () => {
  const { crmModules, servers, permissions } = useSelector(
    (state: any) => state.companies
  );
  const [formData, setFormData]: any = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [removedModules, setRemovedModules]: any = useState([]);
  const [updatedCity, setUpdatedCity] = useState("");
  const [updatedPackage, setUpdatedPackage] = useState("");
  const [updatedTimeZone, setUpdatedTimeZone] = useState("");
  const [ticketImages, setTicketImages] = useState<any[]>([]);
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [serverList, setServerList] = useState([]);

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
    getAll({ url: `super-admin/get-company/${companyId}` }).then(
      (data: any) => {
        // console.log("api call --- >", data);

        if (data !== undefined) {
          dispatch(setNoDataFound(data.message));
          if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
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
            const formDataWithChecked = { ...data.data };
            if (formDataWithChecked.permissions) {
              formDataWithChecked.permissions =
                formDataWithChecked.permissions.map((permission: any) => ({
                  ...permission,
                  checked: true,
                }));
            }
            const allowedModuleIds = data.data.allowedModules.map(
              (module: any) => module._id
            );
            setRemovedModules(allowedModuleIds);
            setFormData(formDataWithChecked);
            // getImage({
            //   url: `${IMAGE_BASE_URL}/${data.data.user.cnicFront.url}`,
            // }).then(async (data: any) => {
            //   // console.log("image api --- >", data);

            //   if (data.data.user.cnicFront.url !== "") {
            //     ticketImages.push({
            //       key: "cnicFront",
            //       url: data.data.user.cnicFront.url,
            //       blob: data,
            //     });
            //     setTicketImages(ticketImages);
            //   }
            // });
            // getImage({
            //   url: `${IMAGE_BASE_URL}/${data.data.user.cnicBack.url}`,
            // }).then(async (data: any) => {
            //   if (data.data.user.cnicBack.url !== "") {
            //     ticketImages.push({
            //       key: "cnicBack",
            //       url: data.data.user.cnicBack.url,
            //       blob: data,
            //     });
            //     setTicketImages(ticketImages);
            //   }
            //   // console.log("image api --- >", data);

            //   // console.log("Ticket Images", ticketImages);
            //   // ptaCertificate
            // });
            // getImage({
            //   url: `${IMAGE_BASE_URL}/${data.data.user.ptaCertificate.url}`,
            // }).then(async (data: any) => {
            //   // console.log("image api --- >", data);
            //   if (data.data.user.ptaCertificate.url !== "") {
            //     ticketImages.push({
            //       key: "ptaCertificate",
            //       url: data.data.user.ptaCertificate.url,
            //       blob: data,
            //     });
            //     setTicketImages(ticketImages);
            //   }
            //   // console.log("Ticket Images", ticketImages);
            //   // ntnCertificate
            // });
            // getImage({
            //   url: `${IMAGE_BASE_URL}/${data.data.user.ntnCertificate.url}`,
            // }).then(async (data: any) => {
            //   // console.log("image api --- >", data);
            //   if (data.data.user.ntnCertificate.url !== "") {
            //     ticketImages.push({
            //       key: "ntnCertificate",
            //       url: data.data.user.ntnCertificate.url,
            //       blob: data,
            //     });
            //     setTicketImages(ticketImages);
            //   }
            //   // console.log("Ticket Images", ticketImages);

            //   // otherAttachment
            // });
            // getImage({
            //   url: `${IMAGE_BASE_URL}/${data.data.user.otherAttachment.url}`,
            // }).then(async (data: any) => {
            //   // console.log("image api --- >", data);
            //   if (data.data.user.otherAttachment.url !== "") {
            //     ticketImages.push({
            //       key: "otherAttachment",
            //       url: data.data.user.otherAttachment.url,
            //       blob: data,
            //     });
            //     setTicketImages(ticketImages);
            //   }
            //   // console.log("Ticket Images", ticketImages);
            //   // if (ticketImages.length === 5) {
            //   //   setUserDataLoading(false);
            //   // }
            // });
            setLoading(false);
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
    if (field !== "checked") {
      updatedPermissions[index][field] = value;
    }
    if (field == "checked") {
      const permissionTitle = title;
      const foundIndex = updatedPermissions.findIndex(
        (permission) => permission.title == permissionTitle
      );

      if (foundIndex !== -1) {
        // If the permission already exists, remove it from the array
        updatedPermissions = updatedPermissions.filter(
          (item, index) => item.title == permissionTitle
        );
      } else {
        // If the permission doesn't exist, find and add it from the permissions data
        const newPermission = permissions.find(
          (permission: any) => permission.title === permissionTitle
        );
        if (newPermission) {
          updatedPermissions.push(newPermission);
        }
      }
    }

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
    if (updatedModules.includes(value)) {
      if (updatedModules.length == 1) {
        updatedModules.pop();
      } else {
        updatedModules.splice(index, 1);
      }
    } else {
      updatedModules.push(item._id);
    }
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
    const updatedFormData = {
      ...formData,
      allowedModules: removedModules,
      permissions: updatedPermissions,
      package: updatedPackage !== "" ? updatedPackage : formData.package,
      city: updatedCity !== "" ? updatedCity : formData.city,
      timezone: updatedTimeZone !== "" ? updatedTimeZone : formData.timezone,
      serverCredentials: convertedServerCredentials,
    };

    try {
      await update(updatedFormData, {
        url: `super-admin/update-company/${companyId}`,
      }).then((data: any) => {
        // console.log("update Server form updated");

        setLoading(false);

        if (data.success) {
          // console.log(data);
          setLoading(false);
          dispatch(setCompaniesStart());
          getAll({ url: "super-admin/get-all-companies" }).then((data: any) => {
            if (data !== undefined) {
              dispatch(setNoDataFound(data.message));
              if (
                !data.success &&
                data.message === "ERROR_INTERNET_DISCONNECTED"
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

    const updatedList = formData.serverCredentials.filter(
      (item: any) => item.server._id == option.server
    );
    console.log("updatedList", updatedList);

    setFormData({ ...formData, serverCredentials: updatedList });
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "80vh",
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Loader />
          </div>
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
                              defaultValue={formData.gstno}
                              name="gstno"
                              onChange={(e) =>
                                updateFormData("gstno", e.target.value)
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
                              value={formData.packageExpirationDate.slice(
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
                              defaultValue={formData.city._id}
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
                              defaultValue={formData.package._id}
                              setUpdatedPackage={setUpdatedCity}
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
                              defaultValue={formData.timezone}
                              setUpdatedTimeZone={setUpdatedCity}
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
                        <Select
                          defaultValue={formData.serverCredentials.map(
                            (server: any) => server.server.companyName
                          )}
                          showSearch
                          mode="multiple"
                          style={{ width: 500, height: 36 }}
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
                            const newlySelectedServers = selectedOptions.filter(
                              (option: any) =>
                                !formData.serverCredentials.some(
                                  (server: any) => server.label === option.label
                                )
                            );

                            const newServers = newlySelectedServers.map(
                              (option: any) => ({
                                label: option.label,
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
                          options={serverList}
                          onDeselect={handleDeselect}
                        />
                        <Form
                          style={{ marginBottom: "65px", marginTop: "20px" }}
                        >
                          {formData.serverCredentials.map(
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
                                        title={item.server.companyName}
                                        headClass="pb-0"
                                      />
                                    </Col>
                                    <Col sm={6}>
                                      <P>
                                        Email Address
                                        <span className="txt-danger">*</span>
                                      </P>
                                      <Input
                                        defaultValue={item.emailAddress}
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
                                        defaultValue={item.password}
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
                                        defaultValue={item.server._id}
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
                                        defaultValue={item.hostUrl}
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
                          {crmModules.map((item: any, index: any) => {
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
                                            defaultChecked={removedModules.includes(
                                              item._id
                                            )}
                                            onChange={(e) =>
                                              handleAllowedModuleChange(
                                                index,
                                                "_id",
                                                item._id,
                                                item
                                              )
                                            }
                                          />
                                          <span
                                            className={`switch-state bg-primary`}
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
                            {permissions?.map((permission: any, index: any) => {
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
                                            checked={
                                              permission.title ==
                                              formData?.permissions[index]
                                                ?.title
                                            }
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
                                            onClick={(e) => e.stopPropagation()}
                                            className="green"
                                          ></span>
                                        </Label>
                                        {permission.title}
                                      </span>
                                      {permission.title ==
                                        formData?.permissions[index]?.title && (
                                        <div>
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
                                              checked={
                                                formData?.permissions[index]
                                                  ?.read
                                              }
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
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <input
                                              type="checkbox"
                                              name="key"
                                              value="value"
                                              checked={
                                                formData?.permissions[index]
                                                  ?.create
                                              }
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
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <input
                                              type="checkbox"
                                              name="key"
                                              value="value"
                                              checked={
                                                formData?.permissions[index]
                                                  ?.edit
                                              }
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
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <input
                                              type="checkbox"
                                              name="key"
                                              value="value"
                                              checked={
                                                formData?.permissions[index]
                                                  ?.delete
                                              }
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
                            })}
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
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default UpdateCompanyForm;
