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
import { H3, P } from "../../../AbstractElements";
import { UserType } from "./UserTypes/UserTypes";
import { create, getAll } from "../../../Utilities/api";
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
import "./permissionsStyle.css";
import {
  CREATE_OPERATOR,
  GET_ALL_OPERATORS,
} from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

const CreateNewUser = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
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

  const { roles } = useSelector((state: any) => state.roles);
  const { branches } = useSelector((state: any) => state.operators);
  const [rolesList, setRolesList] = useState([]);
  const [role, setRole] = useState("");
  const [branchesList, setBranchesList] = useState([]);
  const [branch, setBranch] = useState("");
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
    if (role !== "" && branch !== "") {
      const operator = {
        name: data.name,
        emailAddress: data.emailAddress,
        password: data.password,
        phoneNo: data.phoneNo,
        isActive: true,
        company: decodedToken.userId,
        subRole: role,
        branch: branch,
        allowedModules: allowedModules,
      };
      // console.log(operator);
      try {
        await create(operator, { url: CREATE_OPERATOR }).then((data: any) => {
          if (!data.success && data.message === ERROR_MESSAGE) {
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
            getAll({ url: GET_ALL_OPERATORS }).then((data: any) => {
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
            });
          }
        });
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
    } else {
      Swal.fire({
        text: "Please select the department and branch both",
        icon: "info",
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: true,
      });
      setLoading(false);
    }
  };

  // console.log("Roles", roles);

  const tempRolesList: any = [];
  useEffect(() => {
    roles?.map((item: any, index: any) => {
      tempRolesList.push({
        value: `${item?._id}`,
        label: `${item?.name}`,
      });
    });
    setRolesList(tempRolesList);
  }, [roles]);

  // console.log("Roles", roles);

  const tempBranchesList: any = [];
  useEffect(() => {
    branches?.map((item: any, index: any) => {
      tempBranchesList.push({
        value: `${item?._id}`,
        label: `${item?.name}`,
      });
    });
    setBranchesList(tempBranchesList);
  }, [branches]);

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
          className={`btn ${
            userPersonalizationData?.buttonsAndBarsColor == null
              ? "btn-primary"
              : ""
          }`}
          style={{
            color: "white",
            backgroundColor: `${
              userPersonalizationData !== null &&
              userPersonalizationData?.buttonsAndBarsColor
            }`,
          }}
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
                  <P>Password</P>
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
                                  <P>{permission.title}</P>

                                  <div>
                                    <Label
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
                                    </Label>
                                    <Label
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
                                    </Label>
                                    <Label
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
                                    </Label>
                                    <Label
                                      style={{
                                        display: "inline-block",
                                        position: "relative",
                                        cursor: "not-allowed",
                                        marginRight: "25px",
                                        marginBottom: "15px",
                                        fontSize: "18px",
                                        verticalAlign: "center",
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
                                    </Label>
                                    {/* Similarly, add Ps for other permissions */}
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
                                <Label
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
                                </Label>
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
