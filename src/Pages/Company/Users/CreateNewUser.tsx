import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { CheckCircle } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { H3 } from "../../../AbstractElements";
import { UserType } from "./UserTypes/UserTypes";
import { create, getAll } from "../../../Api";
import {
  setFilterOperators,
  setOperators,
  setOperatorsEnd,
  setOperatorsStart,
} from "../../../ReaduxToolkit/Reducer/OperatorSlice";
import { jwtDecode } from "jwt-decode";

const CreateNewUser = () => {
  const [decodedToken, setDecodedToken]: any = useState(null);
  const authToken = localStorage.getItem("token");
  useEffect(() => {
    if (authToken !== null) {
      const decodedToken = jwtDecode(authToken);
      console.log(decodedToken);
      setDecodedToken(decodedToken);
    }
  }, []);
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
      });
    }
  };

  const addOperator: SubmitHandler<UserType> = async (data: any) => {
    setLoading(true);
    if (data.name !== "") {
      const operator = {
        name: data.name,
        emailAddress: data.emailAddress,
        password: data.password,
        phoneNo: data.phoneNo,
        isActive: true,
        company: decodedToken.userId,
      };
      console.log(operator);
      try {
        await create(operator, { url: "operator/create-operator" }).then(
          (data: any) => {
            setLoading(false);
            setAddModal(false);
            if (data.success) {
              console.log(data);
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
                emailAddress: "",
                password: "",
                phoneNo: "",
              });
              dispatch(setOperatorsStart());
              getAll({ url: "operator/get-all-operators" }).then(
                (data: any) => {
                  console.log("api call --- >", data);
                  dispatch(setOperatorsEnd());
                  if (data !== undefined) {
                    if (data.success) {
                      console.log("hhg");
                      dispatch(setOperators(data.data));
                      dispatch(setFilterOperators(data.data));
                    }
                  }
                }
              );
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
          emailAddress: "",
          password: "",
          phoneNo: "",
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
          Create New User
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
              onSubmit={handleSubmit(addOperator)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <Label>Operator Name</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "Operaor name is required"}
                  </span>
                </FormGroup>
                <FormGroup className="col-md-12 create-group">
                  <Label>Email Address</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("emailAddress", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.emailAddress && "Email Address is required"}
                  </span>
                </FormGroup>
                <FormGroup className="col-md-12 create-group">
                  <Label>Password</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("password", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.emailAddress && "Password is required"}
                  </span>
                </FormGroup>
                <FormGroup className="col-md-12 create-group">
                  <Label>Phone Number</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("phoneNo", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.phoneNo && "Phone Number is required"}
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
