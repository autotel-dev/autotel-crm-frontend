import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { H3 } from "../../AbstractElements";
import { CitiesType } from "./CityTypes/CityTypes";
import React from "react";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
}

const DeleteCity: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
}) => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<CitiesType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    setAddModal(!addModal);
  };

  console.log("is: ", isVisible);

  const deleteCity: SubmitHandler<CitiesType> = async () => {
    setAddModal(false);
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
        <H3 className="modal-title">Delete Package</H3>
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
          onSubmit={handleSubmit(deleteCity)}
        >
          <Row
            style={{
              color: "black",
              fontSize: "24px",
              textAlign: "center",
            }}
          >
            <FormGroup className="col-md-12 create-group">
              <Label
                style={{
                  color: "black",
                  fontSize: "24px",
                  textAlign: "center",
                }}
              >
                Warning
              </Label>
            </FormGroup>
          </Row>
          <Row
            style={{
              color: "black",
              fontSize: "24px",
              textAlign: "center",
            }}
          >
            <FormGroup className="col-md-12 create-group">
              <span
                style={{
                  color: "black",
                  fontSize: "24px",
                  textAlign: "center",
                }}
              >
                Are You sure you want to delete this City?
              </span>
            </FormGroup>
          </Row>
          <Row
            style={{
              color: "white",
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            <FormGroup>
              <Button color="secondary" className="me-1">
                Yes
              </Button>
              &nbsp;&nbsp;
              <Button
                color="primary"
                onClick={() => {
                  setIsVisible(!isVisible);
                }}
              >
                No
              </Button>
            </FormGroup>
          </Row>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default DeleteCity;
