import { PlusCircle } from "react-feather";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  Row,
  Col,
} from "reactstrap";
import { CheckCircle } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { H3 } from "../../../AbstractElements";
import { UserType } from "./UserTypes/UserTypes";
import { create, getAll } from "../../../Api";
import {
  setFilterOperators,
  setInActiveActiveUsers,
  setOperators,
  setOperatorsEnd,
  setOperatorsStart,
} from "../../../ReaduxToolkit/Reducer/OperatorSlice";
import { jwtDecode } from "jwt-decode";
import { Select } from "antd";
import Swal from "sweetalert2";

const CreateNewUser = () => {
  const { crmActiveModules } = useSelector((state: any) => state.crmModules);
  const [decodedToken, setDecodedToken]: any = useState(null);
  const authToken = localStorage.getItem("token");
  useEffect(() => {
    if (authToken !== null) {
      const decodedToken = jwtDecode(authToken);
      // console.log(decodedToken);
      setDecodedToken(decodedToken);
    }
  }, []);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allowedModules, setAllowedModules]: any = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        name: "",
        emailAddress: "",
        password: "",
        phoneNo: "",
        company: "",
      });
      setRole("");
      setAllowedModules([]);
    }
  };

  const addOperator: SubmitHandler<UserType> = async (data: any) => {
    setLoading(true);
    if (data.name !== "" && role !== "") {
      const operator = {
        name: data.name,
        emailAddress: data.emailAddress,
        password: data.password,
        phoneNo: data.phoneNo,
        isActive: true,
        company: decodedToken.userId,
        subRole: role,
        allowedModules: allowedModules,
      };
      // console.log(operator);
      try {
        await create(operator, { url: "operator/create-operator" }).then(
          (data: any) => {
            if (
              !data.success &&
              data.message == "ERROR_INTERNET_DISCONNECTED"
            ) {
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
                emailAddress: "",
                password: "",
                phoneNo: "",
              });
              setRole("");
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
                emailAddress: "",
                password: "",
                phoneNo: "",
              });
              setRole("");
            }
            if (data.success) {
              // console.log(data);
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
                emailAddress: "",
                password: "",
                phoneNo: "",
              });
              setRole("");
              dispatch(setOperatorsStart());
              getAll({ url: "operator/get-all-operators" }).then(
                (data: any) => {
                  // console.log("api call --- >", data);
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
                      // console.log("hhg");
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
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);

        setLoading(false);
        setAddModal(false);
        reset({
          name: "",
          emailAddress: "",
          password: "",
          phoneNo: "",
        });
        setRole("");
      }
    }
  };

  const { roles } = useSelector((state: any) => state.roles);
  const [rolesList, setRolesList] = useState([]);
  const [role, setRole] = useState("");
  // console.log("Roles", roles);

  const tempRolesList: any = [];
  useEffect(() => {
    roles.map((item: any, index: any) => {
      tempRolesList.push({
        value: `${item._id}`,
        label: `${item.name}`,
      });
    });
    setRolesList(tempRolesList);
  }, [roles]);

  const handleModuleClick = (moduleId: any) => {
    const index = allowedModules.findIndex(
      (module: any) => module === moduleId
    );
    if (index === -1) {
      setAllowedModules([...allowedModules, moduleId]);
    } else {
      const updatedItems = allowedModules.filter(
        (module: any) => module !== moduleId
      );
      setAllowedModules(updatedItems);
    }
  };

  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className="btn btn-primary"
          style={{ color: "white" }}
          onClick={addToggle}
        >
          <PlusCircle />
          Create New User
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H3 className="modal-title">Create User</H3>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addOperator)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <Label>User Name</Label>
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
                  <Label>Email Address</Label>
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
                  <Label>Password</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("password", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.emailAddress && "Password is required"}
                  </span>
                </FormGroup>
                <FormGroup className="col-md-12 create-group">
                  <Label>Phone Number</Label>
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
                  <div>
                    <Label>Select User Role </Label>
                  </div>
                  <Select
                    showSearch
                    style={{ width: 250, height: 36 }}
                    placeholder="Select Role"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    onChange={(e: any) => {
                      // console.log(e);
                      setRole(e);
                    }}
                    options={rolesList}
                  />
                </FormGroup>

                {role !== "" && <Label>Given Permissions</Label>}
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
                    .filter((item: any) => item._id === role)
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
                                      fontSize: "17px",
                                      margin: "15px 0px",
                                      fontWeight: "bold",
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
                                        onChange={() => {}}
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
                                        fontSize: "18px",
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <input
                                        type="checkbox"
                                        name="key"
                                        value="value"
                                        disabled={true}
                                        checked={permission.create}
                                        onChange={() => {}}
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
                                        fontSize: "18px",
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <input
                                        type="checkbox"
                                        name="key"
                                        value="value"
                                        disabled={true}
                                        checked={permission.edit}
                                        onChange={() => {}}
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
                                        fontSize: "18px",
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <input
                                        type="checkbox"
                                        name="key"
                                        value="value"
                                        disabled={true}
                                        checked={permission.delete}
                                        onChange={() => {}}
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
                <Label>Allowed Modules</Label>
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
                              <span
                                style={{ fontSize: "17px", margin: "15px 0px" }}
                              >
                                {module.name}
                              </span>
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
                                    checked={allowedModules.some(
                                      (selectedModule: any) =>
                                        selectedModule === module._id
                                    )}
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
                </FormGroup>
              </Row>
              <Button color="primary" className="me-1">
                {loading ? "Loading ..." : `Add`}
              </Button>
              &nbsp;&nbsp;
              <Button
                disabled={loading ? true : false}
                color="secondary"
                onClick={addToggle}
              >
                Cancel
              </Button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default CreateNewUser;
