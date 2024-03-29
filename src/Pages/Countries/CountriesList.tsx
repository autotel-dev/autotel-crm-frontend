import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { citiesListHeading } from "../../utils/Constant";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../Alerts/DeleteAlert";
import {
  setCountries,
  setCountriesEnd,
  setCountriesStart,
  setFilterCountries,
  setId,
  setInActiveActiveCountries,
  setIsConnected,
} from "../../ReaduxToolkit/Reducer/CountrySlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import UpdateCountry from "./UpdateCountry";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CountriesList = () => {
  const { countries, loading, id, activeInActiveCountries } = useSelector(
    (state: any) => state.countries
  );
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [countryName, setCountryName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setCountriesStart());
    getAll({ url: "country/get-all-countries" }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data === undefined) {
        Swal.fire({
          text: "No countries Found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(setInActiveActiveCountries("All"));
        dispatch(setCountries([]));
        dispatch(setFilterCountries([]));
        dispatch(setCountriesEnd());
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
          setFilterCountries(data.data);
          dispatch(setCountries(data.data));
          dispatch(setFilterCountries(data.data));
        }
      }
      dispatch(setCountriesEnd());
    });
  }, []);

  const renderTableRows = () => {
    return countries?.map((row: any) => (
      <tr key={row.id}>
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
                // console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                dispatch(setId(row._id));
                setCountryName(row.name);
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
            <CommonHeader title="All Countries" />
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  <Loader />
                ) : countries?.length > 0 && loading === false ? (
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
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                  >
                    {activeInActiveCountries !== "All"
                      ? activeInActiveCountries
                      : "No Counties Found"}
                  </div>
                )}

                {/* )} */}
              </div>
              <UpdateCountry
                isVisible={isUpdateModalOpen}
                setIsVisible={setIsUpdateModalOpen}
                id={id}
                value={countryName}
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

export default CountriesList;
