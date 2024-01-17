import { Card, CardBody, Col, Container, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { citiesListHeading } from "../../utils/Constant";
import DataTable from "react-data-table-component";
import { citiesTableColumns } from "./CitiesData/CitiesData";
import { useEffect, useState } from "react";
// import { getCities, updateCity } from "../../Api";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody } from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { H3 } from "../../AbstractElements";
import { CitiesType } from "./CityTypes/CityTypes";
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
  setValue,
} from "../../ReaduxToolkit/Reducer/CitiesSlice";
import deleteAlert from "../Alerts/DeleteAlert";
import "./tableStyle.css";
import Loader from "../Loader/Loader";

const CitiesList = () => {
  const { cities, loading, error, id, value } = useSelector(
    (state: any) => state.cities
  );
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [cityName, setCityName] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    dispatch(setCitiesStart());
    setLoad(true);
    getAll({ url: "city/get-all-cities" }).then((data: any) => {
      console.log("api call --- >", data);
      setTimeout(() => {
        setLoad(false);
      }, 3000);
      dispatch(setCitiesEnd());
      if (data !== undefined) {
        if (data.success) {
          console.log("hhg");
          dispatch(setCities(data.data));
          dispatch(setFilterCities(data.data));
        }
        // else{
        //   dispatch
        // }
      }
    });
  }, []);

  useEffect(() => {
    getAll({ url: "country/get-all-active-countries" }).then((data: any) => {
      console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          console.log("hhg");
          dispatch(setCountries(data.data));
        }
      }
    });
    getAll({ url: "province/get-all-active-provinces" }).then((data: any) => {
      console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          console.log("hhg");
          dispatch(setProvinces(data.data));
        }
      }
    });
  }, []);
  const renderTableRows = () => {
    return cities.map((row: any) => (
      <tr key={row.id}>
        <td>{row._id}</td>
        <td>{row.name}</td>
        <td>{row.province?.name}</td>
        <td>{row.country?.name}</td>
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
                console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                dispatch(setId(row._id));
                // dispatch(setValue(""));
                // dispatch(setValue(row.name));
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

                  {loading && load ? (
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
                  cities?.length > 0 && loading === false ? (
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Province</th>
                            <th>Country</th>
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
                      No Cities Found
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
