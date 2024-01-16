import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { createNewCity } from "../../utils/Constant";
import { Link } from "react-router-dom";
import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { CheckCircle } from "react-feather";
import { H3 } from "../../AbstractElements";
import { create, getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import { Type } from "./CountryTypes/CountryTypes";
import {
  setCountriesStart,
  setCountriesEnd,
  setCountries,
  setFilterCountries,
} from "../../ReaduxToolkit/Reducer/CountrySlice";

const CreateNewCountry = () => {
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Type>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    setAddModal(!addModal);
    reset({
      name: "",
    });
  };

  const addCountry: SubmitHandler<Type> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const city = {
        name: data.name,
      };
      console.log(city);
      try {
        await create(city, { url: "country/create-country" }).then(
          (data: any) => {
            if (data.success) {
              console.log(data);
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
              });
              dispatch(setCountriesStart());
              getAll({ url: "country/get-all-countries" }).then((data: any) => {
                console.log("api call --- >", data);
                dispatch(setCountriesEnd());
                if (data !== undefined) {
                  if (data.success) {
                    console.log("hhg");
                    dispatch(setCountries(data.data));
                    dispatch(setFilterCountries(data.data));
                  }
                }
              });
            }
          }
        );
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
          Create New Country
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H3 className="modal-title">Add Country</H3>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addCountry)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <Label>Country Name</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "Country name is required"}
                  </span>
                </FormGroup>
              </Row>
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

export default CreateNewCountry;
