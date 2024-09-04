import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
  Col,
} from "reactstrap";
import { Cancel } from "../../../utils/Constant";
import { H3, P } from "../../../AbstractElements";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, update } from "../../../Utilities/api";
import { UserType } from "./UserTypes/UserTypes";
import { jwtDecode } from "jwt-decode";
import {
  setFilterOperators,
  setInActiveActiveUsers,
  setOperators,
  setOperatorsEnd,
  setOperatorsStart,
} from "../../../ReaduxToolkit/Reducer/OperatorSlice";
import Swal from "sweetalert2";
import { Select } from "antd";
import "./permissionsStyle.css";
import { GET_ALL_OPERATORS, UPDATE_OPERATOR } from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";
// import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  id: any;
  name: any;
  emailAddress: any;
  phoneNo: any;
  isActive: any;
  setIsActive: any;
  allowedModules: any;
  setAllowedModules: React.Dispatch<React.SetStateAction<any>>;
  subRole: any;
  userBranch: string;
}

const UpdateUser: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => { },
  id,
  name,
  emailAddress,
  phoneNo,
  isActive,
  setIsActive,
  allowedModules,
  setAllowedModules,
  subRole,
  userBranch

  // setValue
}) => {
  // console.log("allowedModules", allowedModules);

  const [decodedToken, setDecodedToken]: any = useState(null);
  const authToken = localStorage.getItem("token");
  useEffect(() => {
    if (authToken !== null) {
      const decodedToken = jwtDecode(authToken);
      // // console.log(decodedToken);
      setDecodedToken(decodedToken);
    }
  }, []);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserType>({
    defaultValues: {
      // Set the initial value from props
      name: name,
      emailAddress: emailAddress,
      phoneNo: phoneNo,
      isActive: isActive,
    },
  });
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
      reset({
        isActive: isActive,
      });
    }
  };
  const { roles } = useSelector((state: any) => state.roles);
  const { branches } = useSelector((state: any) => state.operators);
  const { crmActiveModules } = useSelector((state: any) => state.crmModules);
  const [rolesList, setRolesList] = useState([]);
  const [role, setRole] = useState("");
  // // console.log("Roles", roles);

  const tempRolesList: any = [];
  useEffect(() => {
    roles.map((item: any, index: any) => {
      tempRolesList.push({
        value: `${item._id}`,
        label: `${item.name}`,
      });
    });
    setRolesList(tempRolesList);
  }, []);

  const [branchesList, setBranchesList] = useState([]);
  const [branch, setBranch] = useState("");
  // console.log("Roles", roles);

  const tempBranchesList: any = [];
  useEffect(() => {
    branches.map((item: any, index: any) => {
      tempBranchesList.push({
        value: `${item._id}`,
        label: `${item.name}`,
      });
    });
    setBranchesList(tempBranchesList);
  }, [branches]);

  const updateUser: SubmitHandler<UserType> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const operator = {
        fullName: data.name,
        emailAddress: data.emailAddress,
        phoneNo: data.phoneNo,
        isActive: isActive,
        company: decodedToken.userId,
        allowedModules: allowedModules,
        subRole: role !== "" ? role : subRole,
      };
      // // console.log(operator);
      try {
        await update(operator, { url: `${UPDATE_OPERATOR}/${id}` }).then(
          (data: any) => {
            if (
              !data.success &&
              data.message === ERROR_MESSAGE
            ) {
              setLoading(false);
              setIsVisible(!isVisible);
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              setIsVisible(!isVisible);
            }
            if (data.success) {
              // // console.log(data);
              setLoading(false);
              setIsVisible(!isVisible);

              dispatch(setOperatorsStart());
              getAll({ url: GET_ALL_OPERATORS }).then(
                (data: any) => {
                  // // console.log("api call --- >", data);
                  if (data == undefined) {
                    Swal.fire({
                      text: "Failed to fetch due to connection refused",
                      icon: "error",
                      timer: 2000,
                      showConfirmButton: false,
                    });
                    dispatch(setInActiveActiveUsers("All"));
                    dispatch(setOperators([]));
                    dispatch(setFilterOperators([]));
                    dispatch(setOperatorsEnd());
                    return;
                  }
                  dispatch(setOperatorsEnd());
                  if (data !== undefined) {
                    if (data.success) {
                      // // console.log("hhg");
                      dispatch(setOperators(data.data));
                      dispatch(setFilterOperators(data.data));
                    }
                  }
                }
              );
            }
          }
        );
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error) {
        // Handle error (e.g., show an error message)
        // // console.error("Error creating post:", error);
        setLoading(false);
        setIsVisible(!isVisible);
      }
    }
  };
  useEffect(() => {
    setValue("name", name);
  }, [name, setValue]);
  useEffect(() => {
    setValue("emailAddress", emailAddress);
  }, [emailAddress, setValue]);
  useEffect(() => {
    setValue("phoneNo", phoneNo);
  }, [phoneNo, setValue]);

  useEffect(() => {
    setValue("isActive", isActive);
  }, [isActive, setValue]);

  useEffect(() => {
    setValue("subRole", subRole);
  }, [subRole, setValue]);
  useEffect(() => {
    setValue("userBranch", userBranch);
  }, [userBranch, setValue]);

  const handleModuleClick = (moduleId: any) => {
    const index = allowedModules.findIndex(
      (module: any) => module === moduleId
    );
    if (index === -1) {
      // const updateModules = [...allowedModules, moduleId];
      setAllowedModules([...allowedModules, moduleId]);
    } else {
      const updatedItems = allowedModules.filter(
        (module: any) => module !== moduleId
      );
      setAllowedModules(updatedItems);
    }
  };

  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={
        addToggle
        //   () => {
        //   setIsVisible(!isVisible);
        // }
      }
      size="lg"
      onClosed={() => {
        // setValue("")
        setIsVisible(false);
      }}
    >
      <div className="modal-header">
        <H3 className="modal-title">Update User</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
          }}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(updateUser)}
        >
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>User Name</P>
              <input
                className="form-control"
                type="text"
                {...register("name", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.name && "Operaor name is required"}
              </span>
            </FormGroup>
            <FormGroup className="col-md-12 create-group">
              <P>Email Address</P>
              <input
                className="form-control"
                type="text"
                {...register("emailAddress", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.emailAddress && "Email Address is required"}
              </span>
            </FormGroup>

            <FormGroup className="col-md-12 create-group">
              <P>Phone Number</P>
              <input
                className="form-control"
                type="text"
                {...register("phoneNo", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.phoneNo && "Phone Number is required"}
              </span>
            </FormGroup>

            <FormGroup className="col-md-12 create-group">
              <Row>
                <Col md="6">
                  <div>
                    <P>Select User Department </P>
                  </div>
                  <Select
                    value={
                      roles &&
                      roles.find((role: any) => role?._id === subRole)?.name
                    }
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select Department"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.P ?? "").includes(input)
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.P ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.P ?? "").toLowerCase())
                    }
                    onChange={(e: any) => {
                      // console.log(e);
                      setRole(e);
                    }}
                    options={rolesList}
                  />
                </Col>
                <Col md="6">
                  <div>
                    <P>Select User Branch </P>
                  </div>
                  <Select
                    value={
                      branches &&
                      branches.find((b: any) => b?._id === userBranch)?.name
                    }
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select Branch"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.P ?? "").includes(input)
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.P ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.P ?? "").toLowerCase())
                    }
                    onChange={(e: any) => {
                      // console.log(e);
                      setBranch(e);
                    }}
                    options={branchesList}
                  />
                </Col>
              </Row>
            </FormGroup>


            {role !== "" && <P>Given Permissions : </P>}
            <FormGroup
              className="col-md-12 create-group"
              style={{
                overflowY: "auto",
                maxHeight: "25vh", // Subtract scrollbar width from max height
                WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
                scrollbarWidth: "thin", // Specify scrollbar width
                WebkitBorderRadius: "5px !important", // For WebKit browsers (Chrome, Safari)
                MozBorderRadius: "5px !important", // For Mozilla Firefox
                borderRadius: "5px !important", // For other browsers
                scrollbarColor: "lightgray transparent", // Specify scrollbar color
              }}
            >
              {roles
                .filter(
                  (item: any) => item._id === (role !== "" ? role : subRole)
                )
                .map((filteredRole: any) =>
                  filteredRole.permissions.map(
                    (permission: any, index: any) => {
                      return (
                        <div key={index}>
                          <Row>
                            <Col
                              key={index}
                              xl={12}
                              lg={12}
                              md={12}
                              sm={12}
                              xs={12}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "16px",
                                }}
                              >
                                {permission.title}
                              </span>

                              <div>
                                <label
                                  style={{
                                    display: "inline-block",
                                    position: "relative",
                                    cursor: "not-allowed",
                                    marginRight: "25px",
                                    marginBottom: "15px",
                                    fontSize: "18px",
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    name="key"
                                    value="value"
                                    disabled={true}
                                    checked={permission.read}
                                    onChange={() => { }}
                                    style={{ display: "none" }} // Hide the default checkbox
                                  />
                                  <span
                                    onClick={(e) => e.stopPropagation()}
                                    className={
                                      permission.read ? "green" : "red"
                                    }
                                  ></span>
                                  Read
                                </label>
                                <label
                                  style={{
                                    display: "inline-block",
                                    position: "relative",
                                    cursor: "not-allowed",
                                    marginRight: "25px",
                                    marginBottom: "15px",
                                    fontSize: "16px",
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    name="key"
                                    value="value"
                                    disabled={true}
                                    checked={permission.create}
                                    onChange={() => { }}
                                    style={{ display: "none" }} // Hide the default checkbox
                                  />
                                  <span
                                    onClick={(e) => e.stopPropagation()}
                                    className={
                                      permission.create ? "green" : "red"
                                    }
                                  ></span>
                                  Create
                                </label>
                                <label
                                  style={{
                                    display: "inline-block",
                                    position: "relative",
                                    cursor: "not-allowed",
                                    marginRight: "25px",
                                    marginBottom: "15px",
                                    fontSize: "16px",
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    name="key"
                                    value="value"
                                    disabled={true}
                                    checked={permission.edit}
                                    onChange={() => { }}
                                    style={{ display: "none" }} // Hide the default checkbox
                                  />
                                  <span
                                    onClick={(e) => e.stopPropagation()}
                                    className={
                                      permission.edit ? "green" : "red"
                                    }
                                  ></span>
                                  Edit
                                </label>
                                <label
                                  style={{
                                    display: "inline-block",
                                    position: "relative",
                                    cursor: "not-allowed",
                                    marginRight: "25px",
                                    marginBottom: "15px",
                                    fontSize: "16px",
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    name="key"
                                    value="value"
                                    disabled={true}
                                    checked={permission.delete}
                                    onChange={() => { }}
                                    style={{ display: "none" }} // Hide the default checkbox
                                  />
                                  <span
                                    onClick={(e) => e.stopPropagation()}
                                    className={
                                      permission.delete ? "green" : "red"
                                    }
                                  ></span>
                                  Delete
                                </label>
                                {/* Similarly, add labels for other permissions */}
                              </div>
                            </Col>
                          </Row>
                        </div>
                      );
                    }
                  )
                )}
            </FormGroup>
            <P>Allowed Modules : </P>
            <FormGroup
              className="col-md-12 create-group"
              style={{
                overflowY: "auto",
                maxHeight: "25vh", // Subtract scrollbar width from max height
                WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
                scrollbarWidth: "thin", // Specify scrollbar width
                WebkitBorderRadius: "5px !important", // For WebKit browsers (Chrome, Safari)
                MozBorderRadius: "5px !important", // For Mozilla Firefox
                borderRadius: "5px !important", // For other browsers
                scrollbarColor: "lightgray transparent", // Specify scrollbar color
              }}
            >
              <Row>
                {crmActiveModules.map((module: any, index: any) => {
                  const isChecked =
                    Array.isArray(allowedModules) &&
                    allowedModules.includes(module._id);
                  return (
                    <div key={index}>
                      <Row>
                        <Col
                          key={index}
                          xl={7}
                          lg={7}
                          md={9}
                          sm={12}
                          xs={12}
                          // xs={12}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <P>{module.name}</P>
                          <div>
                            <label
                              style={{
                                display: "inline-block",
                                position: "relative",
                                cursor: "pointer",
                                marginRight: "55px",
                                marginBottom: "15px",
                                fontSize: "18px",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                name="key"
                                value="value"
                                checked={isChecked}
                                onChange={() => {
                                  handleModuleClick(module._id);
                                }}
                                style={{ display: "none" }} // Hide the default checkbox
                              />
                              <span
                                onClick={(e) => e.stopPropagation()}
                                className="green"
                              ></span>
                            </label>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </Row>
              <div className="d-flex">
                <div
                  className={`text-end flex-shrink-0 icon-state 
                            }`}
                >
                  <Label className="switch mb-0">
                    <Input
                      type="checkbox"
                      defaultChecked={isActive}
                      value={isActive ? "on" : "off"}
                      onChange={(e) => {
                        setIsActive(!isActive);
                        // // console.log(e.target.value);
                      }}
                    />
                    <span
                      className={`switch-state ${isActive ? "bg-primary" : "bg-secondary"
                        }`}
                    />
                  </Label>
                </div>
              </div>
            </FormGroup>
          </Row>
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Update`}
          </Button>
          &nbsp;&nbsp;
          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={() => {
              // setValue("")
              setIsVisible(!isVisible);
            }}
          >
            {Cancel}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateUser;
