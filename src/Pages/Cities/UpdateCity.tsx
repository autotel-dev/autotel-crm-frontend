import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { H3 } from "../../AbstractElements";
import { CitiesType } from "./CityTypes/CityTypes";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { update } from "../../Api";
import GetData from "./GetList";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
}

const UpdateCity: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
}) => {
  const { cities } = useSelector((state: any) => state.cities);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  var [citiesList, setCitiesList]: any = useState([]);
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

  console.log("is: ", isVisible);

  const updateCity: SubmitHandler<CitiesType> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const city = {
        name: data.name,
      };
      console.log(city);
      try {
        // await update(city, { url: "city/update-city" }).then((data: any) => {
        //   if (data.success) {
        //     console.log(data);
        //     setLoading(false);
        //     setAddModal(false);
        //     reset({
        //       name: "",
        //     });
        //     GetData(
        //       cities,
        //       dispatch,
        //       citiesList,
        //       setCitiesList,
        //       setIsVisible,
        //       isVisible
        //     );
        //   }
        // });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error) {
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
    <Modal
      centered
      isOpen={isVisible}
      toggle={() => {
        setIsVisible(!isVisible);
      }}
      size="md"
    >
      <div className="modal-header">
        <H3 className="modal-title">Update City</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            setIsVisible(!isVisible);
          }}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(updateCity)}
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
          <Button color="secondary" className="me-1">
            Update
          </Button>
          &nbsp;&nbsp;
          <Button
            color="primary"
            onClick={() => {
              setIsVisible(!isVisible);
            }}
          >
            {Cancel}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateCity;
