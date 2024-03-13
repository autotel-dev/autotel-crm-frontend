import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { citiesListHeading } from "../../utils/Constant";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../Alerts/DeleteAlert";

// import UpdateCountry from "./UpdateCountry";
import { log } from "console";
import {
  setCRMModules,
  setFilterCRMModules,
  setCRMModulesStart,
  setCRMModulesEnd,
  setId,
  setValue,
  setInActiveActiveModules,
  setIsConnected,
} from "../../ReaduxToolkit/Reducer/CRMModuleSlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import UpdateCRMModule from "./UpdateCRMModule";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CRMModuleList = () => {
  const { crmModules, loading, error, id, value, activeInActiveModules } =
    useSelector((state: any) => state.crmModules);
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [iconClass, setIconClass] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setCRMModulesStart());
    getAll({ url: "crm-module/get-all-modules" }).then((data: any) => {
      console.log("api call --- >", data);
      // if (data == undefined) {
      //   Swal.fire({
      //     text: "Failed to fetch due to connection refused",
      //     icon: "error",
      //     timer: 2000,
      //     showConfirmButton: false,
      //   });
      //   dispatch(setInActiveActiveModules("All"));
      //   dispatch(setCRMModulesEnd());
      //   dispatch(setCRMModules([]));
      //   dispatch(setFilterCRMModules([]));
      //   return;
      // }

      if (data !== undefined) {
        dispatch(setNoDataFound(data.message));
        if (!data.success && data.message == "ERROR_INTERNET_DISCONNECTED") {
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
          console.log("hhg");
          dispatch(setCRMModules(data.data));
          dispatch(setFilterCRMModules(data.data));
        }
      }
      dispatch(setCRMModulesEnd());
    });
    // .catch((error: any) => {
    //   console.log(error);
    // });
  }, []);
  const renderTableRows = () => {
    return crmModules?.map((row: any) => (
      <tr key={row.id}>
        <td style={{ width: "10%" }}>{row._id}</td>
        <td style={{ width: "15%" }}>{row.name}</td>
        <td style={{ width: "15%" }}>{row.icon}</td>
        <td style={{ width: "15%" }}>{row.route}</td>
        <td style={{ width: "15%" }}>
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
                  checked={row.isActive}
                  // onChange={async (e: any) => {
                  //   //  --------------------------

                  //   const operator = {
                  //     fullName: row.fullName,
                  //     emailAddress: row.emailAddress,
                  //     phoneNo: row.phoneNo,
                  //     isActive: !row.isActive,
                  //     company: decodedToken.userId,
                  //   };
                  //   console.log(operator);
                  //   setIsActive(!row.isActive);
                  //   // setRowIndex(index);
                  //   console.log(e.target.value);
                  //   try {
                  //     await update(operator, {
                  //       url: `operator/update-operator/${row._id}`,
                  //     }).then((data: any) => {
                  //       if (data.success) {
                  //         console.log(data);

                  //         dispatch(setOperatorsStart());
                  //         getAll({
                  //           url: "operator/get-all-operators",
                  //         }).then((data: any) => {
                  //           console.log("api call --- >", data);
                  //           dispatch(setOperatorsEnd());
                  //           if (data !== undefined) {
                  //             if (data.success) {
                  //               console.log("hhg");
                  //               dispatch(setOperators(data.data));
                  //               dispatch(setFilterOperators(data.data));
                  //             }
                  //           }
                  //         });
                  //       }
                  //     });
                  //     // Handle successful post creation (e.g., show a success message, redirect, etc.)
                  //   } catch (error) {
                  //     // Handle error (e.g., show an error message)
                  //     console.error("Error creating post:", error);
                  //   }
                  // }}
                />
                <span
                  className={`switch-state ${
                    row.isActive ? "bg-primary" : "bg-secondary"
                  }`}
                />
              </Label>
            </div>
          </div>
        </td>
        <td>
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
                console.log("345678");
                var alertData = {
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this ",
                };
                const type = "crmModuleType";
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
                console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                dispatch(setId(row._id));
                setModuleName(row.name);
                setIconClass(row.icon);
                setIsActive(row.isActive);
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
        <Row>
          <Col sm="12">
            <Card>
              <CommonHeader title="All CRM Modules" />
              <CardBody>
                <div className="table-responsive product-table">
                  {loading ? (
                    // <div
                    //   style={{
                    //     textAlign: "center",
                    //     fontSize: "25px",
                    //     fontWeight: "bold",
                    //   }}
                    // >
                    //   Loading....
                    // </div>

                    <Loader />
                  ) : // <Loader />
                  crmModules?.length > 0 && loading === false ? (
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: "10%" }}>ID</th>
                            <th style={{ width: "15%" }}>Name</th>
                            <th style={{ width: "15%" }}>Icon</th>
                            <th style={{ width: "15%" }}>Route</th>
                            <th style={{ width: "15%" }}>Status</th>
                            <th>Actions</th>
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
                      {activeInActiveModules !== "All"
                        ? activeInActiveModules
                        : "No Modules Found"}
                    </div>
                  )}

                  {/* )} */}
                </div>
                <UpdateCRMModule
                  isVisible={isUpdateModalOpen}
                  setIsVisible={setIsUpdateModalOpen}
                  id={id}
                  value={moduleName}
                  icon={iconClass}
                  isActive={isActive}
                  setIsActive={setIsActive}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CRMModuleList;
