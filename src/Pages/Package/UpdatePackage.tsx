import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { H3 } from "../../AbstractElements";
import React from "react";
import { PackageType } from "./PackageType/PackageType";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
}

const UpdatePackage: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PackageType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    setAddModal(!addModal);
    reset({
      title: "",
      price: Number(""),
      duration: "",
    });
  };

  console.log("is: ", isVisible);

  const updatePackage: SubmitHandler<PackageType> = async (data) => {
    if (
      data.title !== "" &&
      data.price !== Number("") &&
      data.duration !== ""
    ) {
      const packag = {
        title: data.title,
        price: data.price,
        duration: data.duration,
      };
      console.log(packag);
      setAddModal(false);
      reset({
        title: "",
        price: Number(""),
        duration: "",
      });
    }
  };
  return (
    <Modal
      isOpen={isVisible}
      toggle={() => {
        setIsVisible(!isVisible);
      }}
      size="lg"
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
          onSubmit={handleSubmit(updatePackage)}
        >
          <Row>
            <FormGroup className="col-md-12 create-group">
              <Label>Package Name</Label>
              <input
                className="form-control"
                type="text"
                {...register("title", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.title && "Package Title is required"}
              </span>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <Label>Price</Label>
              <input
                className="form-control"
                type="text"
                {...register("price", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.price && "Package price is required"}
              </span>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <Label>Duration</Label>
              <input
                className="form-control"
                type="text"
                {...register("duration", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.duration && "Package duration is required"}
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

export default UpdatePackage;
