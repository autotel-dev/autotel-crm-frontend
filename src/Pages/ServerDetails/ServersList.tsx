import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { citiesListHeading } from "../../utils/Constant";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { API_BASE_URL, create, getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../Alerts/DeleteAlert";
import {
  setCreateServer,
  setServersStart,
  setServers,
  setServersEnd,
  setFilterServers,
  setServer,
  setId,
  setInActiveActiveServers,
  setIsConnected,
} from "../../ReaduxToolkit/Reducer/ServerDetailsSlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import CommonModal from "../../CommonElements/Ui-kits/CommonModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import { header } from "../../Api/header";
import axios from "axios";
import Swal from "sweetalert2";
import H7 from "../../CommonElements/Headings/H7Element";

const ServersList = () => {
  const { servers, loading, error, id, activeInActiveServers } = useSelector(
    (state: any) => state.serverDetails
  );
  const navigate = useNavigate();
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  const ModalData = {
    isOpen: modal,
    class: "modal-dialog-centered",
    toggler: toggle,
    bodyClass: "social-profile text-start",
  };

  useEffect(() => {
    dispatch(setServersStart());
    getAll({ url: "server-management/get-all-servers" }).then((data: any) => {
      // console.log("api call --- >", data);
      // if (data == undefined) {
      //   Swal.fire({
      //     text: "Failed to fetch due to connection refused",
      //     icon: "error",
      //     timer: 2000,
      //     showConfirmButton: false,
      //   });
      //   dispatch(setInActiveActiveServers("All"));
      //   dispatch(setServers([]));
      //   dispatch(setFilterServers([]));
      //   dispatch(setServersEnd());
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
          dispatch(setServers(data.data.allServers));
          dispatch(setFilterServers(data.data.allServers));
        }
      }
      dispatch(setServersEnd());
    });
  }, []);
  const renderTableRows = () => {
    return servers?.map((row: any) => (
      <tr key={row._id}>
        <td style={{ width: "10%" }}>{row._id}</td>
        <td style={{ width: "15%" }}>{row.companyName}</td>
        <td style={{ width: "10%" }}>{row.serviceProvider}</td>
        <td style={{ width: "15%" }}>{row.ipAddress}</td>
        <td style={{ width: "15%" }}>{row.url}</td>
        <td style={{ width: "10%" }}>
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
                const type = "serverType";
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
                dispatch(setServer(row));
                navigate(
                  `${process.env.PUBLIC_URL}/super-admin/setup/server_details/update-server`
                );
              }}
            >
              Edit
            </button>
            <button
              style={{
                width: 130,
                fontSize: 14,
                padding: 3,
                color: "white",
                backgroundColor: "green",
                borderRadius: "5px",
                border: "none",
                margin: "10px",
              }}
              onClick={async () => {
                dispatch(setId(row._id));
                toggle();
                try {
                  const response = await fetch(
                    `${API_BASE_URL}/server-management/send-otp`,
                    {
                      method: "POST",
                      headers: header(),
                    }
                  );
                  const result = await response.json();
                  // console.log("api --- >", result);

                  return result;
                } catch (error: any) {
                  Swal.fire({
                    text: `${error.response.data.message}`,
                    icon: "info",
                    timer: 2000,
                    showCancelButton: false,
                  });
                }
              }}
            >
              Change Password
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
              <CommonHeader title="All Servers" />
              <CardBody>
                <div className="table-responsive product-table">
                  {loading ? (
                    <Loader />
                  ) : servers?.length > 0 && loading === false ? (
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: "10%" }}>ID</th>
                            <th style={{ width: "15%" }}>Company Name</th>
                            <th style={{ width: "10%" }}>Service Provider</th>
                            <th style={{ width: "15%" }}>IP Address</th>
                            <th style={{ width: "15%" }}>URL</th>
                            <th style={{ width: "10%" }}>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>{renderTableRows()}</tbody>
                      </table>
                    </div>
                  ) : (
                    // <div
                    //   style={{
                    //     textAlign: "center",
                    //     fontSize: "25px",
                    //     fontWeight: "bold",
                    //   }}
                    // >
                      // {activeInActiveServers !== "All"
                      //   ? activeInActiveServers
                      //   : "No Servers Found"}
                    // </div>
                    <H7>
                         {activeInActiveServers !== "All"
                        ? activeInActiveServers
                        : "No Servers Found"}
                    </H7>
                  )}
                </div>

                <CommonModal modalData={ModalData}>
                  <ChangePasswordModal toggle={toggle} />
                </CommonModal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ServersList;
