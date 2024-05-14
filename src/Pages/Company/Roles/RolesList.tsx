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
import "./tableStyle.css";
import CommonHeader from "../../../Common/CommonHeader";
import Loader from "../../Loader/Loader";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { getAll, patch, update } from "../../../Api";
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
import { H4 } from "../../../AbstractElements";

const RolesList = () => {
  const { roles, activeInActiveRoles, loading } = useSelector(
    (state: any) => state.roles
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setRoles([]));
    dispatch(setFilterRoles([]));
    dispatch(setRolesStart());
    getAll({ url: "sub-role/get-all-sub-roles" }).then((data: any) => {
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
        if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
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
  const renderTableRows = () => {
    return roles?.map((row: any) => (
      <tr key={row._id}>
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
                        url: `sub-role/change-activation-status/${row._id}`,
                      }).then((data: any) => {
                        if (data.success) {
                          // // console.log(data);
                          dispatch(setRolesStart());
                          getAll({ url: "sub-role/get-all-sub-roles" }).then(
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
                        }
                      });
                      // Handle successful post creation (e.g., show a success message, redirect, etc.)
                    } catch (error) {
                      // Handle error (e.g., show an error message)
                      // // console.error("Error creating post:", error);
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
        {/* <td>
          <div>
            <button
              style={{
                width: 60,
                fontSize: 14,
                padding: 3,
                color: "white",
                backgroundColor: "red",
                borderRadius: "5px",
                marginRight: "5px",
                border: "none",
              }}
              onClick={() => {
                // // console.log("345678");
                var alertData = {
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this ",
                };
                const type = "countryType";
                deleteAlert(alertData, row._id, type, dispatch);
              }}
            >
              Delete
            </button>
            <button
              style={{
                width: 60,
                fontSize: 14,
                padding: 3,
                color: "white",
                backgroundColor: "green",
                borderRadius: "5px",
                border: "none",
              }}
              onClick={() => {
                setIsUpdateModalOpen(true);
                // // console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                dispatch(setId(row._id));
                setCountryName(row.name);
                setIsActive(row.isActive);
              }}
            >
              Edit
            </button>
          </div>
        </td> */}
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
                  <Loader />
                ) : roles?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Status</th>
                          {/* <th>Actions</th> */}
                        </tr>
                      </thead>
                      <tbody>{renderTableRows()}</tbody>
                    </table>
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                  >
                    {activeInActiveRoles !== "All"
                      ? activeInActiveRoles
                      : "No Roles Found"}
                  </div>
                )}

                {/* )} */}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default RolesList;
