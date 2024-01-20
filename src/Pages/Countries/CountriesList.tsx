import { Card, CardBody, Col, Container, Row } from "reactstrap";
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
} from "../../ReaduxToolkit/Reducer/CountrySlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import UpdateCountry from "./UpdateCountry";
import Loader from "../Loader/Loader";

const CountriesList = () => {
  const { countries, loading, error, id, value } = useSelector(
    (state: any) => state.countries
  );
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [countryName, setCountryName] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    dispatch(setCountriesStart());
    getAll({ url: "country/get-all-countries" }).then((data: any) => {
      console.log("api call --- >", data);
      dispatch(setCountriesEnd());
      if (data !== undefined) {
        dispatch(setNoDataFound(data.message));
        if (data.success) {
          console.log("hhg");
          dispatch(setCountries(data.data));
          dispatch(setFilterCountries(data.data));
        }
      }
    });
    // .catch((error: any) => {
    //   console.log(error);
    // });
  }, []);
  const renderTableRows = () => {
    return countries?.map((row: any) => (
      <tr key={row.id}>
        <td>{row._id}</td>
        <td>{row.name}</td>
        <td>{row.isActive ? "Active" : "inActive"}</td>
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
        <Row>
          <Col sm="12">
            <Card>
              <CommonHeader title="All Countries" />
              <CardBody>
                <div className="table-responsive product-table">
                  {/* {loading ? (
                    <Loader />
                  ) : ( */}
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
                      {noDataFound !== "" ? noDataFound : "Faild to Fetch"}
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
        </Row>
      </Container>
    </>
  );
};

export default CountriesList;
