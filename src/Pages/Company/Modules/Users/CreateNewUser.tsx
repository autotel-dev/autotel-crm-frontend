import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { CheckCircle } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { H3 } from "../../../../AbstractElements";
import { UserType } from "./UserTypes/UserTypes";

const CreateNewUser = () => {
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        name: "",
        emailAddress: "",
        password: "",
        phoneNo: "",
        company: "",
        isActive: true,
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
          Create New Country
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H3 className="modal-title">Create Operator</H3>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              // onSubmit={handleSubmit(addCountry)}
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
                Cancel
              </Button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default CreateNewUser;
