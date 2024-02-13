import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { getAll, update } from "../../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../../Alerts/DeleteAlert";
import {
  setFilterOperators,
  setOperators,
  setOperatorsEnd,
  setOperatorsStart,
} from "../../../ReaduxToolkit/Reducer/OperatorSlice";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import Loader from "../../Loader/Loader";
import UpdateUser from "./UpdateUser";
import { jwtDecode } from "jwt-decode";

const UsersList = () => {
  const { operators, loading } = useSelector((state: any) => state.operators);
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [emailAdress, setEmailAddress] = useState("");
  const [phoneNo, setPhoneNo] = useState(false);
  // -----------------------------------
  const [decodedToken, setDecodedToken]: any = useState(null);
  const authToken = localStorage.getItem("token");
  useEffect(() => {
    if (authToken !== null) {
      const decodedToken = jwtDecode(authToken);
      console.log(decodedToken);
      setDecodedToken(decodedToken);
    }
  }, []);

  useEffect(() => {
    dispatch(setOperatorsStart());
    getAll({ url: "operator/get-all-operators" }).then((data: any) => {
      console.log("api call --- >", data);
      dispatch(setOperatorsEnd());
      if (data !== undefined) {
        dispatch(setNoDataFound(data.message));
        if (data.success) {
          console.log("hhg");
          dispatch(setOperators(data.data));
          dispatch(setFilterOperators(data.data));
        }
      }
    });
  }, []);

  const renderTableRows = () => {
    return operators?.map((row: any) => (
      // setIsActive(row.isActive);
      <tr key={row.id}>
        <td>{row._id}</td>
        <td>{row.fullName}</td>
        <td>{row.role}</td>
        <td>{row.emailAddress}</td>
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
                  value={row.isActive ? "on" : "off"}
                  onChange={async (e: any) => {
                    setIsActive(!row.isActive);
                    console.log(e.target.value);
                    //  --------------------------

                    const operator = {
                      name: row.fullName,
                      emailAddress: row.emailAddress,
                      password: "123456789",
                      phoneNo: row.phoneNo,
                      isActive: isActive,
                      company: decodedToken.userId,
                    };
                    console.log(operator);
                    try {
                      await update(operator, {
                        url: `operator/update-operator/${row._id}`,
                      }).then((data: any) => {
                        if (data.success) {
                          console.log(data);

                          dispatch(setOperatorsStart());
                          getAll({ url: "operator/get-all-operators" }).then(
                            (data: any) => {
                              console.log("api call --- >", data);
                              dispatch(setOperatorsEnd());
                              if (data !== undefined) {
                                if (data.success) {
                                  console.log("hhg");
                                  dispatch(setOperators(data.data));
                                  dispatch(setFilterOperators(data.data));
                                }
                              }
                            }
                          );
                        }
                      });
                      // Handle successful post creation (e.g., show a success message, redirect, etc.)
                    } catch (error) {
                      // Handle error (e.g., show an error message)
                      console.error("Error creating post:", error);
                    }
                  }}
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
                console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                setId(row._id);
                setName(row.fullName);
                setEmailAddress(row.emailAddress);
                setPhoneNo(row.phoneNo);
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
            <CommonHeader title="All Users" />
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  <Loader />
                ) : operators?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Email Address</th>
                          <th>Account Status</th>
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
                    {noDataFound !== ""
                      ? "No Countries Found"
                      : "Faild to Fetch"}
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
              />
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default UsersList;
