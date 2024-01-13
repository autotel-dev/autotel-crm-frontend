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
  setId,
  setValue,
} from "../../ReaduxToolkit/Reducer/CitiesSlice";
import "./tableStyle.css";
import deleteAlert from "../Alerts/DeleteAlert";

const CitiesList = () => {
  const { cities, loading, error, id, value } = useSelector(
    (state: any) => state.cities
  );
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [cityName, setCityName] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    getAll({ url: "city/get-all-cities" }).then((data: any) => {
      console.log(data);
      if (data.statusCode == 200) {
        dispatch(setCities(data.data));
      }
    });
  }, []);
  const renderTableRows = () => {
    return cities.map((row: any) => (
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
