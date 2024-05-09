import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { citiesListHeading } from "../../utils/Constant";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../Alerts/DeleteAlert";

import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";

import Loader from "../Loader/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import UpdateComplainType from "./UpdateComplainType";
import {
  setComplainsTypes,
  setComplainsTypesEnd,
  setComplainsTypesStart,
  setFilterComplainsTypes,
  setInActiveComplainsTypes,
  setId,
  setIsConnected,
  setComplainTypePriorities,
} from "../../ReaduxToolkit/Reducer/ComplainsTypeSlice";

const ComplainTypeList = () => {
  const { complainTypes, loading, id, activeInActiveComplainTypes } =
    useSelector((state: any) => state.complainTypes);
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [complainTitle, setComplainTitle] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    dispatch(setComplainsTypesStart());
    getAll({
      url: "complaint-center/internal-complaint-type/get-all-types",
    }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data == undefined) {
        Swal.fire({
          text: "No countries Found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(setInActiveComplainsTypes("All"));
        dispatch(setComplainsTypes([]));
        dispatch(setFilterComplainsTypes([]));
        dispatch(setComplainsTypesEnd());
        return;
      }

      if (data !== undefined) {
        // console.log("Data", data);

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

          dispatch(setComplainsTypes(data.data));
          dispatch(setFilterComplainsTypes(data.data));
        }
      }
      dispatch(setComplainsTypesEnd());
    });
  }, []);
 

  const renderTableRows = () => {
    return complainTypes?.map((row: any) => (
      <tr key={row.id}>
        <td>{row._id}</td>
        <td>{row.title}</td>
        <td>{row.priorty}</td>
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
                //   // console.log(operator);
                //   setIsActive(!row.isActive);
                //   // setRowIndex(index);
                //   // console.log(e.target.value);
                //   try {
                //     await update(operator, {
                //       url: `operator/update-operator/${row._id}`,
                //     }).then((data: any) => {
                //       if (data.success) {
                //         // console.log(data);

                //         dispatch(setOperatorsStart());
                //         getAll({
                //           url: "operator/get-all-operators",
                //         }).then((data: any) => {
                //           // console.log("api call --- >", data);
                //           dispatch(setOperatorsEnd());
                //           if (data !== undefined) {
                //             if (data.success) {
                //               // console.log("hhg");
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
                //     // console.error("Error creating post:", error);
                //   }
                // }}
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
                // console.log("345678");
                var alertData = {
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this ",
                };
                const type = "complainType";
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
                // console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                dispatch(setId(row._id));
                setComplainTitle(row.title);
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
        <Col sm="12">
          <Card>
            <CommonHeader title="All Complain types" />
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  <Loader />
                ) : complainTypes?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Priority</th>
                          <th>Status</th>
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
                    {activeInActiveComplainTypes !== "All"
                      ? activeInActiveComplainTypes
                      : "No Complain Types Found"}
                  </div>
                )}

                {/* )} */}
              </div>
              <UpdateComplainType
                isVisible={isUpdateModalOpen}
                setIsVisible={setIsUpdateModalOpen}
                id={id}
                value={complainTitle}
                isActive={isActive}
                setIsActive={setIsActive}

              // setValue={setCityName}
              />
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default ComplainTypeList;
