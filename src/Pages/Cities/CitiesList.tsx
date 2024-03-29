import { Card, CardBody, Col, Container, Input, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { citiesListHeading } from "../../utils/Constant";
import { useEffect, useState } from "react";
// import { getCities, updateCity } from "../../Api";
import { Label } from "reactstrap";
import UpdateCity from "./UpdateCity";
import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import {
  setCities,
  setCitiesEnd,
  setCitiesStart,
  setCountries,
  setFilterCities,
  setId,
  setProvinces,
  setNoCityFound,
  setInActiveActiveCities,
  setIsConnected,
} from "../../ReaduxToolkit/Reducer/CitiesSlice";
import deleteAlert from "../Alerts/DeleteAlert";
import "./tableStyle.css";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";

const CitiesList = () => {
  const { cities, loading, id, activeInActiveCities } = useSelector(
    (state: any) => state.cities
  );

  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [cityName, setCityName] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    dispatch(setCitiesStart());
    // setLoad(true);
    getAll({ url: "city/get-all-cities" }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data == undefined) {
        Swal.fire({
          text: "No cities Found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(setInActiveActiveCities("All"));
        dispatch(setCities([]));
        dispatch(setFilterCities([]));
        dispatch(setCitiesEnd());
        return;
      }

      if (data !== undefined) {
        dispatch(setNoCityFound(data.message));
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
          dispatch(setCities(data.data));
          dispatch(setFilterCities(data.data));
        }
      }
      dispatch(setCitiesEnd());
    });
  }, []);

  useEffect(() => {
    getAll({ url: "country/get-all-active-countries" }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setCountries(data.data));
        }
      }
    });
    getAll({ url: "province/get-all-active-provinces" }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setProvinces(data.data));
        }
      }
    });
  }, []);
  const renderTableRows = () => {
    return cities.map((row: any) => (
      <tr key={row.id}>
        <td style={{ width: "10%" }}>{row._id}</td>
        <td style={{ width: "15%" }}>{row.name}</td>
        <td style={{ width: "15%" }}>{row.province?.name}</td>
        <td style={{ width: "15%" }}>{row.country?.name}</td>
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
                const type = "cityType";
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
                setCityName(row.name);
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
              <CommonHeader title={citiesListHeading} />
              <CardBody>
                <div className="table-responsive product-table">
                  {/* <DataTable
                     // data={citiesTableData}
                     data={cities}
                     columns={citiesTableColumns}
                     className="display dataTable no-footer"
                     dense={true}
                     noHeader
                     pagination
                     paginationServer
                   /> */}

                  {loading ? (
                    <Loader />
                  ) : cities?.length > 0 && loading === false ? (
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: "10%" }}>ID</th>
                            <th style={{ width: "15%" }}>Name</th>
                            <th style={{ width: "15%" }}>Province</th>
                            <th style={{ width: "15%" }}>Country</th>
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
                      {/* {noCityFound !== "" ? noCityFound : "Faild to Fetch"} */}

                      {activeInActiveCities !== "All"
                        ? activeInActiveCities
                        : "No Cities Found"}
                    </div>
                    // <Loader />
                  )}
                </div>
                <UpdateCity
                  isVisible={isUpdateModalOpen}
                  setIsVisible={setIsUpdateModalOpen}
                  id={id}
                  value={cityName}
                  isActive={isActive}
                  setIsActive={setIsActive}

                  // setValue={setCityName}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CitiesList;
