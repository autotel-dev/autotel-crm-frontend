import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { Cancel } from "../../../utils/Constant";
import { H3 } from "../../../AbstractElements";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, update } from "../../../Api";
import { UserType } from "./UserTypes/UserTypes";
import { jwtDecode } from "jwt-decode";
import {
  setFilterOperators,
  setOperators,
  setOperatorsEnd,
  setOperatorsStart,
} from "../../../ReaduxToolkit/Reducer/OperatorSlice";
// import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  id: any;
  name: any;
  emailAddress: any;
  phoneNo: any;
  isActive: any;
  setIsActive: any;
}

const UpdateUser: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  id,
  name,
  emailAddress,
  phoneNo,
  isActive,
  setIsActive,

  // setValue
}) => {
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
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserType>({
    defaultValues: {
      // Set the initial value from props
      name: name,
      emailAddress: emailAddress,
      phoneNo: phoneNo,
      isActive: isActive,
    },
  });
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
      reset({
        isActive: isActive,
      });
    }
  };

  const updateUser: SubmitHandler<UserType> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const operator = {
        name: data.name,
        emailAddress: data.emailAddress,
        password: data.password,
        phoneNo: data.phoneNo,
        isActive: isActive,
        company: decodedToken.userId,
      };
      console.log(operator);
      try {
        await update(operator, { url: `operator/update-operator/${id}` }).then(
          (data: any) => {
            if (data.success == false) {
              setLoading(false);
              setIsVisible(!isVisible);
            }
            if (data.success) {
              console.log(data);
              setLoading(false);
              setIsVisible(!isVisible);

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
      } catch (error) {
        // Handle error (e.g., show an error message)
        console.error("Error creating post:", error);
        setLoading(false);
        setIsVisible(!isVisible);
      }
    }
  };
  useEffect(() => {
    setValue("name", name);
  }, [name, setValue]);
  useEffect(() => {
    setValue("emailAddress", emailAddress);
  }, [emailAddress, setValue]);
  useEffect(() => {
    setValue("phoneNo", phoneNo);
  }, [phoneNo, setValue]);

  useEffect(() => {
    setValue("isActive", isActive);
  }, [isActive, setValue]);

  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={
        addToggle
        //   () => {
        //   setIsVisible(!isVisible);
        // }
      }
      size="md"
      onClosed={() => {
        // setValue("")
        setIsVisible(false);
      }}
    >
      <div className="modal-header">
        <H3 className="modal-title">Update Country</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
          }}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(updateUser)}
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
              <div className="d-flex">
                <div
                  className={`text-end flex-shrink-0 icon-state 
                            }`}
                >
                  <Label className="switch mb-0">
                    <Input
                      type="checkbox"
                      defaultChecked={isActive}
                      value={isActive ? "on" : "off"}
                      onChange={(e) => {
                        setIsActive(!isActive);
                        console.log(e.target.value);
                      }}
                    />
                    <span
                      className={`switch-state ${
                        isActive ? "bg-primary" : "bg-secondary"
                      }`}
                    />
                  </Label>
                </div>
              </div>
            </FormGroup>
          </Row>
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Update`}
          </Button>
          &nbsp;&nbsp;
          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={() => {
              // setValue("")
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

export default UpdateUser;
