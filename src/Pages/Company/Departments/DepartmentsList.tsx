import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";

import { useEffect, useState } from "react";
// import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import "./tableStyle.css";
import CommonHeader from "../../../Common/CommonHeader";
import Loader from "../../Utilities/Loader/Loader";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { getAll, patch, update } from "../../../Utilities/api";
import {
  setFilterRoles,
  setInActiveActiveRoles,
  setIsConnected,
  setRoles,
  setRolesEnd,
  setRolesStart,
} from "../../../ReaduxToolkit/Reducer/RolesSlice";
import { setOperatorsEnd } from "../../../ReaduxToolkit/Reducer/OperatorSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { H4, H5 } from "../../../AbstractElements";
import H7 from "../../../CommonElements/Headings/H7Element";
import {
  CHANGE_SUB_ROLE_ACTIVATION_STATUS,
  GET_ALL_SUB_ROLES,
} from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";
import deleteAlert from "../../../Utilities/alerts/DeleteAlert";
import UpdateDepartment from "./UpdateDepartment";

const DepartmentsList = () => {
  const { roles, activeInActiveRoles, loading } = useSelector(
    (state: any) => state.roles
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [departmentPermissions, setDepartmentPermissions] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  function hexToRgb(hex: any) {
    // Remove the hash sign if present
    hex = hex?.replace(/^#/, "");
    // Parse the hex values to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  // Usage
  const hexColor = "#ff0000"; // Example hex color
  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor); // Convert hex to RGB

  useEffect(() => {
    dispatch(setRoles([]));
    dispatch(setFilterRoles([]));
    dispatch(setRolesStart());
    getAll({ url: GET_ALL_SUB_ROLES }).then((data: any) => {
      // // console.log("api call --- >", data);
      // if (data == undefined) {
      //   Swal.fire({
      //     text: "Failed to fetch due to connection refused",
      //     icon: "error",
      //     timer: 2000,
      //     showConfirmButton: false,
      //   });
      //   // dispatch(setInActiveActiveUsers("All"));
      //   dispatch(setInActiveActiveRoles("All"));
      //   dispatch(setRoles([]));
      //   dispatch(setFilterRoles([]));
      //   dispatch(setRolesEnd());
      //   return;
      // }

      if (data !== undefined) {
        dispatch(setNoDataFound(data.message));
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setIsConnected(true));
        }
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          // // console.log("hhg");
          dispatch(setRoles(data.data));
          dispatch(setFilterRoles(data.data));
        }
      }
      dispatch(setRolesEnd());
    });
  }, []);

  // const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");
  const renderTableRows = () => {
    return roles?.map((row: any) => (
      <tr
        key={row._id}
        onMouseEnter={() => {
          setIsHovered(true);
          setIdd(row._id);
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor:
            isHovered && idd == row._id
              ? userPersonalizationData == null
                ? "#D6EEEE"
                : `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`
              : "transparent",
          transition: "background-color 0.3s",
        }}
      >
        <td>{row._id}</td>
        <td>{row.name}</td>
        <td>
          <div className="d-flex" style={{ justifyContent: "center" }}>
            <div
              className={`text-end flex-shrink-0 icon-state 
                            }`}
            >
              <Label className="switch mb-0">
                <Input
                  type="checkbox"
                  defaultChecked={row.isActive}
                  value={row.isActive}
                  onChange={async (e: any) => {
                    //  --------------------------
                    const changeStatus = {
                      isActive: !row.isActive,
                    };

                    try {
                      await patch(changeStatus, {
                        url: `${CHANGE_SUB_ROLE_ACTIVATION_STATUS}/${row._id}`,
                      }).then((data: any) => {
                        if (data.success) {
                          // // console.log(data);
                          dispatch(setRolesStart());
                          getAll({ url: GET_ALL_SUB_ROLES }).then(
                            (data: any) => {
                              // // console.log("api call --- >", data);
                              dispatch(setRolesEnd());
                              if (data !== undefined) {
                                if (data.success) {
                                  // // console.log("hhg");
                                  dispatch(setRoles(data.data));
                                  dispatch(setFilterRoles(data.data));
                                }
                              }
                            }
                          );
                        } else {
                          Swal.fire({
                            text: `${data.message}`,
                            icon: "error",
                            timer: 2000,
                            showConfirmButton: false,
                          });
                        }
                      });
                      // Handle successful post creation (e.g., show a success message, redirect, etc.)
                    } catch (error: any) {
                      Swal.fire({
                        text: `${error.message}`,
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                    }
                  }}
                />
                <span
                  // className={`switch-state ${
                  //   row.isActive ? "bg-primary" : "bg-secondary"
                  // }`}
                  className="switch-state"
                  style={{ backgroundColor: row.isActive ? "green" : "red" }}
                />
              </Label>
            </div>
          </div>
        </td>
        <td>
          <div>
            {
              <button
                className="global-table-delete-btn"
                onClick={() => {
                  var alertData = {
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this ",
                  };
                  const type = "subRolesType";
                  deleteAlert(alertData, row._id, type, dispatch);
                }}
                disabled={
                  row.name == "Sales" ||
                  row.name == "Inventory" ||
                  row.name == "CRO" ||
                  row.name == "Accounts" ||
                  row.name == "Installation"
                }
              >
                Delete
              </button>
            }

            <button
              className="global-table-edit-btn"
              onClick={() => {
                setIsUpdateModalOpen(true);
                setId(row._id);
                setName(row.name);
                setDepartmentPermissions(row.permissions);
              }}
            >
              Edit
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Container fluid>
        <Col sm="12">
          <Card>
            <CardHeader className="pb-0">
              <H4>All Departments</H4>
            </CardHeader>
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  // <Loader />
                  <>
                    <Skeleton height="100px" width="100%" borderRadius="10px" />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </>
                ) : roles?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>{renderTableRows()}</tbody>
                    </table>
                  </div>
                ) : (
                  <H7>
                    {activeInActiveRoles !== "All"
                      ? activeInActiveRoles
                      : "No Sub Roles Found"}
                  </H7>
                )}

                {/* )} */}
              </div>

              <UpdateDepartment
                isVisible={isUpdateModalOpen}
                setIsVisible={setIsUpdateModalOpen}
                name={name}
                id={id}
                departmentPermissions={departmentPermissions}
              />
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default DepartmentsList;
