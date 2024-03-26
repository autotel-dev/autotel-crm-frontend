import { ChangeEvent, useEffect, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { H4, H5, P } from "../../../AbstractElements";
import { itemsName } from "../../../Data/Forms/FormsLayout/FormWizardData";
import {
  ContactNumber,
  Continue,
  Email,
  Previous,
} from "../../../utils/Constant";
import SelectServerBox from "./SelectServersBox";
import { useDispatch, useSelector } from "react-redux";
import AddServersComponent from "./AddServersComponent";
import {
  setAllowedModules,
  setCreateCompany,
  setPermissions,
} from "../../../ReaduxToolkit/Reducer/CompanySlice";
import "./permissionsStyle.css";

const CRMModules = ({ callbackActive }: BusinessFormCommonProps) => {
  const { allowedModules, crmModules, createCompany, permissions } =
    useSelector((state: any) => state.companies);
  const dispatch = useDispatch();

  const [givenPermissions, setGivenPermissions] = useState(
    createCompany.permissions !== undefined
      ? createCompany.permissions.map((permission: any) => ({
          ...permission,
        }))
      : permissions.map((permission: any) => ({
          ...permission,
          checked: false,
        }))
  );

  const [switches, setSwitches] = useState("off");
  useEffect(() => {
    const arrayChecked = permissions.every(
      (permission: any) => permission.checked
    );
    if (arrayChecked) {
      setGivenPermissions(permissions);
    }
  }, [permissions]);

  // const handleCheckboxChange = (index: any,) => {
  //   setGivenPermissions((prevPermissions: any) => {
  //     const updatedPermissions = [...prevPermissions];
  //     updatedPermissions[index] = {
  //       ...updatedPermissions[index],
  //       checked: !updatedPermissions[index].checked,
  //     };
  //     return updatedPermissions;
  //   });
  // };

  // const handleCheckboxChange = (index: any, key: any) => {
  //   setGivenPermissions((prevPermissions: any) => {
  //     const updatedPermissions = [...prevPermissions];
  //     updatedPermissions[index][key] = !updatedPermissions[index][key];
  //     return updatedPermissions;
  //   });
  // };

  const handleCheckboxChange = (index: any, key: any) => {
    setGivenPermissions((prevPermissions: any) => {
      // Create a shallow copy of the array
      const updatedPermissions = [...prevPermissions];
      // Create a shallow copy of the object at the specified index
      const updatedPermission = { ...updatedPermissions[index] };
      // Update the specified key in the copied object
      updatedPermission[key] = !updatedPermission[key];
      // Replace the object at the specified index with the updated object
      updatedPermissions[index] = updatedPermission;
      return updatedPermissions;
    });
  };

  const handleNextButton = () => {
    // Filter out only the permissions that are checked
    // const checkedPermissions = givenPermissions.filter(
    //   (permission: any) => permission.checked
    // );

    dispatch(
      setCreateCompany({
        ...createCompany,
        allowedModules: allowedModules,
        permissions: givenPermissions,
      })
    );

    callbackActive(5);
  };

  return (
    <Form
      onSubmit={(event) => event.preventDefault()}
      className="needs-validation"
      noValidate
    >
      <Row className="g-3">
        <Col xs={12} className="inquiries-form">
          <Row>
            <Col md={8}>
              <Row className="g-3">
                <Col xs={12}>
                  <H4>
                    Select CRM Modules
                    <span className="txt-danger">*</span>
                  </H4>
                </Col>
                {crmModules.map((item: any, index: any) => {
                  return (
                    <div
                      style={{
                        margin: "12px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Col md={6}>{item.name}</Col>
                      <Col md={6}>
                        <div className="d-flex">
                          <div className={`text-end flex-shrink-0 icon-state`}>
                            <Label className="switch mb-0">
                              <Input
                                type="checkbox"
                                defaultChecked={switches == "on" ? true : false}
                                value={switches === "on" ? "on" : "off"}
                                onChange={(e) => {
                                  if (switches === "on") {
                                    setSwitches("off");
                                  } else {
                                    setSwitches("on");
                                  }
                                  const itemExist = allowedModules.some(
                                    (i: any) => i === item._id
                                  );
                                  // console.log(itemExist);

                                  if (itemExist) {
                                    // If the server exists, remove it from the array

                                    const updatedAllowedModules =
                                      allowedModules.filter(
                                        (i: any) => i !== item._id
                                      );
                                    // console.log("If condition");
                                    // console.log(
                                    //   "allowedModules -- >",
                                    //   updatedAllowedModules
                                    // );

                                    dispatch(
                                      setAllowedModules(updatedAllowedModules)
                                    );
                                  } else {
                                    // If the server doesn't exist, add it to the array
                                    // console.log("else condition");
                                    dispatch(
                                      setAllowedModules([
                                        ...allowedModules,
                                        item._id,
                                      ])
                                    );
                                  }
                                  // console.log(e.target.value);
                                  // console.log(
                                  //   "allowedModules -- >",
                                  //   allowedModules
                                  // );
                                }}
                              />
                              <span
                                className={`switch-state ${
                                  allowedModules.includes(item._id)
                                    ? "bg-primary"
                                    : "bg-secondary"
                                }`}
                              />
                            </Label>
                          </div>
                        </div>
                      </Col>
                    </div>
                  );
                })}
              </Row>
            </Col>
          </Row>
        </Col>

        <Col xs={12} className="inquiries-form">
          <Row>
            <Col md={10}>
              <Row className="g-3">
                <Col xs={12}>
                  <H4>
                    Select Permissions
                    <span className="txt-danger">*</span>
                  </H4>
                </Col>
                <div
                  className="col-md-12 create-group"
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
                  {givenPermissions.map((permission: any, index: any) => {
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
                                fontSize: "16px",
                                margin: "15px 0px",
                                fontWeight: "bold",
                              }}
                            >
                              <label
                                style={{
                                  display: "inline-flex", // Use flexbox
                                  alignItems: "center", // Center items vertically
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
                                  onChange={() => {
                                    handleCheckboxChange(index, "checked");
                                  }}
                                  style={{ display: "none" }} // Hide the default checkbox
                                />
                                <span
                                  onClick={(e) => e.stopPropagation()}
                                  className="green"
                                ></span>
                              </label>
                              <span style={{ marginTop: "5px" }}>
                                {permission.title}
                              </span>
                            </span>
                            {permission.checked && (
                              <div>
                                <label
                                  style={{
                                    display: "inline-flex", // Use flexbox
                                    alignItems: "center", // Center items vertically
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
                                    onChange={() => {
                                      handleCheckboxChange(index, "read");
                                    }}
                                    style={{ display: "none" }} // Hide the default checkbox
                                  />
                                  <span
                                    onClick={(e) => e.stopPropagation()}
                                    className="green"
                                  ></span>
                                  <span style={{ marginTop: "5px" }}>Read</span>
                                </label>
                                <label
                                  style={{
                                    display: "inline-flex", // Use flexbox
                                    alignItems: "center", // Center items vertically
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
                                    onChange={() => {
                                      handleCheckboxChange(index, "create");
                                    }}
                                    style={{ display: "none" }} // Hide the default checkbox
                                  />
                                  <span
                                    onClick={(e) => e.stopPropagation()}
                                    className="green"
                                  ></span>
                                  <span style={{ marginTop: "5px" }}>
                                    Create
                                  </span>
                                </label>
                                <label
                                  style={{
                                    display: "inline-flex", // Use flexbox
                                    alignItems: "center", // Center items vertically
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
                                    onChange={() => {
                                      handleCheckboxChange(index, "edit");
                                    }}
                                    style={{ display: "none" }} // Hide the default checkbox
                                  />
                                  <span
                                    onClick={(e) => e.stopPropagation()}
                                    className="green"
                                  ></span>
                                  <span style={{ marginTop: "5px" }}>Edit</span>
                                </label>
                                <label
                                  style={{
                                    display: "inline-flex", // Use flexbox
                                    alignItems: "center", // Center items vertically
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
                                    onChange={() => {
                                      handleCheckboxChange(index, "delete");
                                    }}
                                    style={{ display: "none" }} // Hide the default checkbox
                                  />
                                  <span
                                    onClick={(e) => e.stopPropagation()}
                                    className="green"
                                  ></span>
                                  <span style={{ marginTop: "5px" }}>
                                    Delete
                                  </span>
                                </label>
                              </div>
                            )}
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button color="primary">{Previous}</Button>
          <Button color="primary" onClick={handleNextButton}>
            {Continue}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CRMModules;
