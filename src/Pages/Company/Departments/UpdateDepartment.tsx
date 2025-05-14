import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { Type } from "./CountryTypes/CountryTypes";
import { Cancel } from "../../../utils/Constant";
import { H3, P } from "../../../AbstractElements";
import { create, getAll, update } from "../../../Utilities/api";
import {
  setFilterRoles,
  setRoles,
  setRolesEnd,
  setRolesStart,
} from "../../../ReaduxToolkit/Reducer/RolesSlice";
import Swal from "sweetalert2";

import "./permissionsStyle.css";
import {
  CREATE_SUB_ROLE,
  EDIT_SUB_ROLE,
  GET_ALL_SUB_ROLES,
} from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  name: any;
  id: string;
  departmentPermissions: any;
}

const UpdateDepartment: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  name,
  id,
  departmentPermissions,

  // setValue
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Type>();
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  const [givenPermissions, setGivenPermissions] = useState<any[]>([]);

  const addToggle = () => {
    if (!loading) {
      // Merge departmentPermissions and userPermissions
      const mergedPermissions = mergePermissions(
        departmentPermissions,
        userPermissions
      );
      setGivenPermissions(mergedPermissions);
      setIsVisible(!isVisible);
    }
  };

  useEffect(() => {
    if (isVisible) {
      // Merge departmentPermissions and userPermissions
      const mergedPermissions = mergePermissions(
        departmentPermissions,
        userPermissions
      );
      setGivenPermissions(mergedPermissions);
      reset({
        name: name,
      });
    }
  }, [isVisible, departmentPermissions, userPermissions, reset, name]);

  // Helper function to merge permissions
  const mergePermissions = (
    departmentPermissions: any[],
    userPermissions: any[]
  ) => {
    const merged = [];

    // Add departmentPermissions first
    if (departmentPermissions && departmentPermissions.length > 0) {
      merged.push(
        ...departmentPermissions.map((permission: any) => {
          // Find the corresponding permission in userPermissions
          const userPermission = userPermissions?.find(
            (userPerm: any) => userPerm.value === permission.value
          );

          return {
            ...permission,
            checked: true, // Ensure checked is true for departmentPermissions
            read:
              userPermission?.read === false
                ? "disabled" // Disable if false in userPermissions
                : permission.read
                ? permission.read
                : false,
            create:
              userPermission?.create === false
                ? "disabled" // Disable if false in userPermissions
                : permission.create
                ? permission.create
                : false,
            edit:
              userPermission?.edit === false
                ? "disabled" // Disable if false in userPermissions
                : permission.edit
                ? permission.edit
                : false,
            delete:
              userPermission?.delete === false
                ? "disabled" // Disable if false in userPermissions
                : permission.delete
                ? permission.delete
                : false,
          };
        })
      );
    }

    // Add userPermissions that are not already in departmentPermissions
    if (userPermissions && userPermissions.length > 0) {
      userPermissions.forEach((userPermission: any) => {
        const existsInDepartment = departmentPermissions?.some(
          (depPermission: any) => depPermission.value === userPermission.value
        );
        if (!existsInDepartment) {
          merged.push({
            ...userPermission,
            checked: false, // Ensure checked is false
            read: userPermission.read === false ? "disabled" : false, // Set read to false or "disabled"
            create: userPermission.create === false ? "disabled" : false, // Set create to false or "disabled"
            edit: userPermission.edit === false ? "disabled" : false, // Set edit to false or "disabled"
            delete: userPermission.delete === false ? "disabled" : false, // Set delete to false or "disabled"
          });
        }
      });
    }

    return merged;
  };

  const handleCheckboxChange = (index: any, key: any) => {
    setGivenPermissions((prevPermissions: any) => {
      const updatedPermissions = [...prevPermissions];
      updatedPermissions[index][key] = !updatedPermissions[index][key];
      return updatedPermissions;
    });
  };

  const updateSubRole: SubmitHandler<Type> = async (data: any) => {
    setLoading(true);
    if (data.name !== "") {
      const role = {
        name: data.name,
        permissions: givenPermissions
          .filter((permission) => permission.checked)
          .map(({ checked, ...rest }) => {
            // If any of the permission keys are disabled, set them to false
            const updatedRest = {
              ...rest,
              read: rest.read === "disabled" ? false : rest.read,
              create: rest.create === "disabled" ? false : rest.create,
              edit: rest.edit === "disabled" ? false : rest.edit,
              delete: rest.delete === "disabled" ? false : rest.delete,
            };
            return updatedRest;
          }),
      };

      // console.log(role);
      try {
        await update(role, { url: `${EDIT_SUB_ROLE}/${id}` }).then(
          (data: any) => {
            if (!data.success && data.message === ERROR_MESSAGE) {
              setLoading(false);
              addToggle();
              reset({
                name: "",
              });
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              addToggle();
              reset({
                name: "",
              });
            }
            if (data.success) {
              // console.log(data);
              setLoading(false);
              addToggle();
              reset({
                name: "",
              });
              setGivenPermissions(
                userPermissions.map((permission: any) => ({
                  ...permission,
                  checked: false,
                  // Disable keys based on their values
                  read: permission.read ? permission.read : "disabled",
                  create: permission.create ? permission.create : "disabled",
                  edit: permission.edit ? permission.edit : "disabled",
                  delete: permission.delete ? permission.delete : "disabled",
                }))
              );
              dispatch(setRolesStart());
              getAll({ url: GET_ALL_SUB_ROLES }).then((data: any) => {
                // console.log("api call --- >", data);
                dispatch(setRolesEnd());
                if (data !== undefined) {
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setRoles(data.data));
                    dispatch(setFilterRoles(data.data));
                  }
                }
              });
            }
          }
        );
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creati post:", error);
        setLoading(false);
        addToggle();
        reset({
          name: "",
        });
      }
    }
  };
  useEffect(() => {
    setValue("name", name);
  }, [name, setValue]);

  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={addToggle}
      size="lg"
      onClosed={() => {
        setIsVisible(false);
      }}
    >
      <div className="modal-header">
        <H3 className="modal-title">Add Department</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={addToggle}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(updateSubRole)}
        >
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Name</P>
              <input
                className="form-control"
                type="text"
                {...register("name", { required: true })}
                disabled={
                  name == "Sales" ||
                  name == "Inventory" ||
                  name == "CRO" ||
                  name == "Accounts" ||
                  name == "Installation"
                }
              />
              <span style={{ color: "red" }}>
                {errors.name && "Department name is required"}
              </span>
            </FormGroup>
            <P> Permissions</P>
            <FormGroup
              className="col-md-12 create-group"
              style={{
                overflowY: "auto",
                maxHeight: "20vh", // Subtract scrollbar width from max height
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
                        xl={12}
                        lg={12}
                        md={12}
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
                            margin: "5px 0px",
                          }}
                        >
                          <label
                            style={{
                              display: "inline-block",
                              position: "relative",
                              cursor: "pointer",
                              marginRight: "25px",
                              fontSize: "16px",
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
                          {permission.title}
                        </span>
                        {permission.checked && (
                          <div>
                            <label
                              style={{
                                display: "inline-block",
                                position: "relative",
                                cursor:
                                  permission.read === "disabled"
                                    ? "not-allowed"
                                    : "pointer",
                                marginRight: "25px",
                                fontSize: "16px",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                name="key"
                                value="value"
                                disabled={permission.read === "disabled"}
                                checked={permission.read}
                                onChange={() => {
                                  if (permission.read !== "disabled") {
                                    handleCheckboxChange(index, "read");
                                  }
                                }}
                                style={{ display: "none" }} // Hide the default checkbox
                              />
                              <span
                                onClick={(e) => e.stopPropagation()}
                                className={
                                  permission.read === "disabled"
                                    ? "red"
                                    : "green"
                                }
                              ></span>
                              Read
                            </label>
                            <label
                              style={{
                                display: "inline-block",
                                position: "relative",
                                cursor:
                                  permission.create === "disabled"
                                    ? "not-allowed"
                                    : "pointer",
                                marginRight: "25px",
                                fontSize: "16px",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                name="key"
                                value="value"
                                disabled={permission.create === "disabled"}
                                checked={permission.create}
                                onChange={() => {
                                  if (permission.create !== "disabled") {
                                    handleCheckboxChange(index, "create");
                                  }
                                }}
                                style={{ display: "none" }} // Hide the default checkbox
                              />
                              <span
                                onClick={(e) => e.stopPropagation()}
                                className={
                                  permission.create === "disabled"
                                    ? "red"
                                    : "green"
                                }
                              ></span>
                              Create
                            </label>
                            <label
                              style={{
                                display: "inline-block",
                                position: "relative",
                                cursor:
                                  permission.edit === "disabled"
                                    ? "not-allowed"
                                    : "pointer",
                                marginRight: "25px",
                                fontSize: "16px",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                name="key"
                                value="value"
                                disabled={permission.edit === "disabled"}
                                checked={permission.edit}
                                onChange={() => {
                                  if (permission.edit !== "disabled") {
                                    handleCheckboxChange(index, "edit");
                                  }
                                }}
                                style={{ display: "none" }} // Hide the default checkbox
                              />
                              <span
                                onClick={(e) => e.stopPropagation()}
                                className={
                                  permission.edit === "disabled"
                                    ? "red"
                                    : "green"
                                }
                              ></span>
                              Edit
                            </label>
                            <label
                              style={{
                                display: "inline-block",
                                position: "relative",
                                cursor:
                                  permission.delete === "disabled"
                                    ? "not-allowed"
                                    : "pointer",
                                marginRight: "25px",
                                fontSize: "16px",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                name="key"
                                value="value"
                                disabled={permission.delete === "disabled"}
                                checked={permission.delete}
                                onChange={() => {
                                  if (permission.delete !== "disabled") {
                                    handleCheckboxChange(index, "delete");
                                  }
                                }}
                                style={{ display: "none" }} // Hide the default checkbox
                              />
                              <span
                                onClick={(e) => e.stopPropagation()}
                                className={
                                  permission.delete === "disabled"
                                    ? "red"
                                    : "green"
                                }
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
            </FormGroup>
          </Row>
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Update`}
          </Button>
          &nbsp;&nbsp;
          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={addToggle}
          >
            {Cancel}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateDepartment;
