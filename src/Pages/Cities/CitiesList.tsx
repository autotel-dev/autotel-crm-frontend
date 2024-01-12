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
// import DeleteCity from "./DeleteCity";
import deleteAlert from "../Alerts/DeleteAlert";
import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import { setCities } from "../../ReaduxToolkit/Reducer/CitiesSlice";
import GetData from "./GetList";

const CitiesList = () => {
  const { cities, loading, error } = useSelector((state: any) => state.cities);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  var [citiesList, setCitiesList]: any = useState([]);

  useEffect(() => {
    GetData(
      cities,
      dispatch,
      citiesList,
      setCitiesList,
      setIsUpdateModalOpen,
      isUpdateModalOpen
    );
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonHeader title={citiesListHeading} />
              <CardBody>
                <div className="table-responsive product-table">
                  <DataTable
                    // data={citiesTableData}
                    data={cities}
                    columns={citiesTableColumns}
                    className="display dataTable no-footer"
                    dense={true}
                    noHeader
                    pagination
                    paginationServer
                  />
                </div>
                <UpdateCity
                  isVisible={isUpdateModalOpen}
                  setIsVisible={setIsUpdateModalOpen}
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
