import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";

import { useEffect, useState } from "react";
// import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import CommonHeader from "../../../Common/CommonHeader";
import Loader from "../../Loader/Loader";

// import {
//   setCountries,
//   setCountriesEnd,
//   setCountriesStart,
//   setFilterCountries,
//   setId,
// } from "../../ReaduxToolkit/Reducer/CountrySlice";
// import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";

const RolesList = () => {
  // const { countries, loading, id } = useSelector(
  //   (state: any) => state.countries
  // );
  // const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(setCountriesStart());
  //   getAll({ url: "country/get-all-countries" }).then((data: any) => {
  //     console.log("api call --- >", data);
  //     dispatch(setCountriesEnd());
  //     if (data !== undefined) {
  //       dispatch(setNoDataFound(data.message));
  //       if (data.success) {
  //         console.log("hhg");
  //         setFilterCountries(data.data);
  //         dispatch(setCountries(data.data));
  //         dispatch(setFilterCountries(data.data));
  //       }
  //     }
  //   });
  // }, []);
  const roles = [
    { id: 1, name: "Role 1", isActive: true },
    { id: 1, name: "Role 1", isActive: true },
    { id: 1, name: "Role 1", isActive: true },
  ];
  const [loading, setLoading] = useState(false);
  const renderTableRows = () => {
    return roles?.map((row: any) => (
      <tr key={row.id}>
        <td>{row.id}</td>
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
                  value={row.isActive ? "on" : "off"}
                  onChange={async (e: any) => {
                    //  --------------------------
                    // const operator = {
                    //   fullName: row.fullName,
                    //   emailAddress: row.emailAddress,
                    //   phoneNo: row.phoneNo,
                    //   isActive: !row.isActive,
                    //   company: decodedToken.userId,
                    // };
                    // console.log(operator);
                    // setIsActive(!row.isActive);
                    // // setRowIndex(index);
                    // console.log(e.target.value);
                    // try {
                    //   await update(operator, {
                    //     url: `operator/update-operator/${row._id}`,
                    //   }).then((data: any) => {
                    //     if (data.success) {
                    //       console.log(data);
                    //       dispatch(setOperatorsStart());
                    //       getAll({ url: "operator/get-all-operators" }).then(
                    //         (data: any) => {
                    //           console.log("api call --- >", data);
                    //           dispatch(setOperatorsEnd());
                    //           if (data !== undefined) {
                    //             if (data.success) {
                    //               console.log("hhg");
                    //               dispatch(setOperators(data.data));
                    //               dispatch(setFilterOperators(data.data));
                    //             }
                    //           }
                    //         }
                    //       );
                    //     }
                    //   });
                    //   // Handle successful post creation (e.g., show a success message, redirect, etc.)
                    // } catch (error) {
                    //   // Handle error (e.g., show an error message)
                    //   console.error("Error creating post:", error);
                    // }
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
            <CommonHeader title="All Roles" />
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
                    {/* {noDataFound !== ""
                      ? "No Countries Found"
                      : "Faild to Fetch"} */}
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
