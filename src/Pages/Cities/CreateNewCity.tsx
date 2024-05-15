import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { createNewCity } from "../../utils/Constant";
import { Link, useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { CheckCircle } from "react-feather";
import { H3, H4, P } from "../../AbstractElements";
import { CitiesType } from "./CityTypes/CityTypes";
import { create, getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import {
  setCities,
  setFilterCities,
  setCitiesEnd,
  setCitiesStart,
  setCountryId,
  setProvinceId,
  setInActiveActiveCities,
} from "../../ReaduxToolkit/Reducer/CitiesSlice";
import SelectProvinceBox from "./components/SelectProvinceBox";
import SelectCountryBox from "./components/SelectCountryBox";
import Swal from "sweetalert2";

const CreateNewCity = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { provinceId, countryId } = useSelector((state: any) => state.cities);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CitiesType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        name: "",
      });
      dispatch(setCountryId(null));
      dispatch(setProvinceId(null));
    }
  };
  const navigate = useNavigate();

  const addCity: SubmitHandler<CitiesType> = async (data) => {
    setLoading(true);
    if (data.name !== "" && provinceId !== null && countryId !== null) {
      const city = {
        name: data.name,
        provinceId: provinceId,
        countryId: countryId,
      };
      // console.log(city);
      try {
        await create(city, { url: "city/create-city" }).then((data: any) => {
          if (data !== undefined) {
            if (
              !data.success &&
              data.message === "ERROR_INTERNET_DISCONNECTED"
            ) {
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
              });
              dispatch(setCountryId(null));
              dispatch(setProvinceId(null));
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
              });
              dispatch(setCountryId(null));
              dispatch(setProvinceId(null));
            }
            if (data.success) {
              // console.log(data);
              dispatch(setProvinceId(null));
              dispatch(setCountryId(null));
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
              });
              dispatch(setCountryId(null));
              dispatch(setProvinceId(null));
              dispatch(setCitiesStart());
              getAll({ url: "city/get-all-cities" }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  Swal.fire({
                    text: "Failed to fetch due to connection refused",
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
                dispatch(setCitiesEnd());
                if (data !== undefined) {
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setCities(data.data));
                    dispatch(setFilterCities(data.data));
                  }
                }
              });
            }
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);

        setLoading(false);
        setAddModal(false);
        reset({
          name: "",
        });
        dispatch(setCountryId(null));
        dispatch(setProvinceId(null));
      }
    } else {
      Swal.fire({
        text: "Please Select all the fields",
        icon: "info",
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: true,
      });
      setLoading(false);
    }
  };

  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""
            }`}
          style={{
            color: "white",
            backgroundColor: `${userPersonalizationData && userPersonalizationData?.buttonsAndBarsColor
              }`,
          }}
          onClick={addToggle}
        >
          <PlusCircle />
          {createNewCity}
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add City</H4>
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
                  <P>City Name</P>
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
                <div>
                  <P>Select Country</P>
                  <SelectCountryBox placeholder={"Select Country"} />
                </div>
                <div>
                  <P>Select Province</P>
                  <SelectProvinceBox placeholder={"Select Province"} />
                </div>
              </div>
              <Button color="primary" className="me-1">
                {loading ? "Loading ..." : `Add`}
              </Button>
              &nbsp;&nbsp;
              <Button
                disabled={loading ? true : false}
                color="secondary"
                onClick={addToggle}
              >
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
