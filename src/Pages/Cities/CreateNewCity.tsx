import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { createNewCity } from "../../utils/Constant";
import { Link } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { CheckCircle } from "react-feather";
import { H3 } from "../../AbstractElements";
import { CitiesType } from "./CityTypes/CityTypes";
import { create, getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import {
  setCities,
  setCitiesEnd,
  setCitiesStart,
} from "../../ReaduxToolkit/Reducer/CitiesSlice";
import Swal from "sweetalert2";
import SelectBox from "./components/SelectCountryBox";

const CreateNewCity = () => {
  const { cities } = useSelector((state: any) => state.cities);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  var [countriesList, setCountriesList]: any = useState([]);
  var [provincesList, setProvincesList]: any = useState([]);

  useEffect(() => {
    getAll({ url: "country/get-all-countries" }).then((data: any) => {
      console.log(data);
      if (data.statusCode == 200) {
        setCountriesList(data.data);
      }
    });
    getAll({ url: "province/get-all-provinces" }).then((data: any) => {
      console.log(data);
      if (data.statusCode == 200) {
        setProvincesList(data.data);
      }
    });
  }, []);

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CitiesType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    setAddModal(!addModal);
    reset({
      name: "",
    });
  };

  const addCity: SubmitHandler<CitiesType> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const city = {
        name: data.name,
      };
      console.log(city);
      try {
        await create(city, { url: "city/create-city" }).then((data: any) => {
          if (data.success) {
            console.log(data);
            setLoading(false);
            setAddModal(false);
            reset({
              name: "",
            });
            dispatch(setCitiesStart());
            getAll({ url: "city/get-all-cities" }).then((data: any) => {
              console.log(data);
              if (data.statusCode == 200) {
                dispatch(setCitiesEnd());
                dispatch(setCities(data.data));
              }
            });
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        console.error("Error creating post:", error);
        setLoading(false);
        setAddModal(false);
        reset({
          name: "",
        });
      }
    }
  };

  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className="btn btn-primary"
          style={{ color: "white" }}
          onClick={addToggle}
        >
          <PlusCircle />
          {createNewCity}
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H3 className="modal-title">Add City</H3>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addCity)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <Label>City Name</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "City name is required"}
                  </span>
                </FormGroup>
              </Row>
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <SelectBox
                  list={provincesList}
                  placeholder={"Select Province"}
                />
                <SelectBox
                  list={countriesList}
                  placeholder={"Select Country"}
                />
              </div>
              <Button color="primary" className="me-1">
                {loading ? "Loading ..." : `Add`}
              </Button>
              &nbsp;&nbsp;
              <Button color="secondary" onClick={addToggle}>
                {Cancel}
              </Button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default CreateNewCity;
