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
import CommonHeader from "../../../Common/CommonHeader";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { getAll, update } from "../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import "./usersStyle.css";
import {
  setFilterOperators,
  setInActiveActiveUsers,
  setIsConnected,
  setOperators,
  setOperatorsEnd,
  setOperatorsStart,
} from "../../../ReaduxToolkit/Reducer/OperatorSlice";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import Loader from "../../Utilities/Loader/Loader";
import UpdateUser from "./UpdateUser";
import { jwtDecode } from "jwt-decode";
import { formatUnderscoredString, getUserRole } from "../../../Utilities/globals/globals";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { H4 } from "../../../AbstractElements";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import "../../../CssConstaints/Style.css";
import deleteAlert from "../../../Utilities/alerts/DeleteAlert";


const UsersList = () => {
  const { operators, loading, activeInActiveOperators } = useSelector(
    (state: any) => state.operators
  );
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var user = userPermissions.find((item: any) => item.title === "User");
  // console.log("user", user);
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

  // console.log("userPermissions:", userPermissions);
  // console.log("getUserRole()", getUserRole());
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [emailAdress, setEmailAddress] = useState("");
  const [phoneNo, setPhoneNo] = useState(false);
  const [allowedModules, setAllowedModules] = useState(false);
  const [subRole, setSubRole] = useState(false);
  const navigate = useNavigate();

  // -----------------------------------
  const [decodedToken, setDecodedToken]: any = useState(null);
  const authToken = localStorage.getItem("token");
  useEffect(() => {
    if (authToken !== null) {
      const decodedToken = jwtDecode(authToken);
      // console.log(decodedToken);
      setDecodedToken(decodedToken);
    }
  }, []);

  useEffect(() => {
    dispatch(setOperators([]));
    dispatch(setFilterOperators([]));
    dispatch(setOperatorsStart());
    getAll({ url: "operator/get-all-operators" }).then((data: any) => {
      // console.log("api call --- >", data);
      // if (data == undefined) {
      //   Swal.fire({
      //     text: "Failed to fetch due to connection refused",
      //     icon: "error",
      //     timer: 2000,
      //     showConfirmButton: false,
      //   });
      //   dispatch(setInActiveActiveUsers("All"));
      //   dispatch(setOperators([]));
      //   dispatch(setFilterOperators([]));
      //   dispatch(setOperatorsEnd());
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
          // console.log("hhg");
          dispatch(setOperators(data.data));
          dispatch(setFilterOperators(data.data));
        }
      }
      dispatch(setOperatorsEnd());
    });
  }, []);
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");

  const renderTableRows = () => {
    return operators?.map((row: any, index: any) => (
      // setIsActive(row.isActive);
      <tr key={row.id}
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
        <td style={{ width: "10%" }}>{row._id}</td>
        <td style={{ width: "15%" }}>{row.fullName}</td>
        <td style={{ width: "10%" }}>{formatUnderscoredString(row.role)}</td>
        <td style={{ width: "15%" }}>{row.emailAddress}</td>
        <td style={{ width: "10%" }}>
          <div className="d-flex" style={{ justifyContent: "center" }}>
            <div
              className={`text-end flex-shrink-0 icon-state 
                            }`}
            >
              <Label className="switch mb-0">
                <Input
                  type="checkbox"
                  disabled={!user?.edit}
                  defaultChecked={row.isActive}
                  value={row.isActive}
                  checked={row.isActive}
                  onChange={async (e: any) => {
                    //  --------------------------

                    const operator = {
                      fullName: row.fullName,
                      emailAddress: row.emailAddress,
                      phoneNo: row.phoneNo,
                      isActive: !row.isActive,
                      company: decodedToken.userId,
                      allowedModules: row.allowedModules,
                      subRole: row.subRole,
                    };
                    // console.log(operator);
                    setIsActive(!row.isActive);
                    // setRowIndex(index);
                    // console.log(e.target.value);
                    try {
                      await update(operator, {
                        url: `operator/update-operator/${row._id}`,
                      }).then((data: any) => {
                        if (data.success) {
                          // console.log(data);

                          dispatch(setOperatorsStart());
                          getAll({
                            url: "operator/get-all-operators",
                          }).then((data: any) => {
                            // console.log("api call --- >", data);
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
                    } catch (error) {
                      // Handle error (e.g., show an error message)
                      // console.error("Error creating post:", error);
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
        {(user?.edit || user?.delete) && (
          <td>
            <div>
              {user?.delete && (
                <button
                className="global-table-delete-btn"
                  // style={{
                  //   width: 60,
                  //   fontSize: 14,
                  //   padding: 3,
                  //   color: "white",
                  //   backgroundColor: "red",
                  //   borderRadius: "5px",
                  //   marginRight: "5px",
                  //   border: "none",
                  // }}
                  onClick={() => {
                    // console.log("345678");
                    var alertData = {
                      title: "Are you sure?",
                      text: "Once deleted, you will not be able to recover this ",
                    };
                    const type = "usersType";
                    deleteAlert(alertData, row._id, type, dispatch);
                  }}
                >
                  Delete
                </button>
              )}
              {user?.edit && (
                <button
                className="global-table-edit-btn"
                  // style={{
                  //   width: 60,
                  //   fontSize: 14,
                  //   padding: 3,
                  //   color: "white",
                  //   backgroundColor: "green",
                  //   borderRadius: "5px",
                  //   border: "none",
                  // }}
                  onClick={() => {
                    setIsUpdateModalOpen(true);
                    // console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                    setId(row._id);
                    setName(row.fullName);
                    setEmailAddress(row.emailAddress);
                    setPhoneNo(row.phoneNo);
                    setIsActive(row.isActive);
                    setAllowedModules(row.allowedModules);
                    setSubRole(row.subRole);
                  }}
                >
                  Edit
                </button>
              )}
            </div>
          </td>
        )}
      </tr>
    ));
  };

  return (
    <>
      <Container fluid> 
        <Col sm="12">
          <Card>
            <CardHeader className="pb-0">
              <H4>All Users</H4>
            </CardHeader>
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  // <Loader />
                  <>
                  <Skeleton height="100px" width="100%" borderRadius="10px" />
                  <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                  <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                  <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                  <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                </>
                ) : operators?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: "10%" }}>ID</th>
                          <th style={{ width: "15%" }}>Name</th>
                          <th style={{ width: "10%" }}>Department</th>
                          <th style={{ width: "15%" }}>Email Address</th>
                          <th style={{ width: "10%" }}>Account Status</th>
                          {(user?.edit || user?.delete) && <th>Actions</th>}
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
                    {activeInActiveOperators !== "All"
                      ? activeInActiveOperators
                      : "No Operators Found"}
                  </div>
                )}

                {/* )} */}
              </div>
              <UpdateUser
                isVisible={isUpdateModalOpen}
                setIsVisible={setIsUpdateModalOpen}
                id={id}
                name={name}
                emailAddress={emailAdress}
                phoneNo={phoneNo}
                isActive={isActive}
                setIsActive={setIsActive}
                allowedModules={allowedModules}
                setAllowedModules={setAllowedModules}
                subRole={subRole}
              />
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default UsersList;
