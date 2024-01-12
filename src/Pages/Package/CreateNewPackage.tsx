import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { H3 } from "../../AbstractElements";
import { PackageType } from "./PackageType/PackageType";

const CreateNewPackage = () => {
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

  const addPackage: SubmitHandler<PackageType> = async (data) => {
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
    <Col md={6}>
      <div className="text-end">
        <button
          className="btn btn-primary"
          style={{ color: "white" }}
          onClick={addToggle}
        >
          <PlusCircle />
          Add New Package
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="lg">
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
              onSubmit={handleSubmit(addPackage)}
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
                Add
              </Button>
              &nbsp;&nbsp;
              <Button color="primary" onClick={addToggle}>
                {Cancel}
              </Button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default CreateNewPackage;
