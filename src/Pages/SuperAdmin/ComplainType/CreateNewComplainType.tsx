import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../../utils/Constant";
import { CheckCircle } from "react-feather";
import { H3, H4, P } from "../../../AbstractElements";
import { create, getAll } from "../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import { Type } from "./ComplainsTypes/ComplainsTypes";

import Swal from "sweetalert2";
import {
  setComplainsTypes,
  setComplainsTypesEnd,
  setComplainsTypesStart,
  setFilterComplainsTypes,
  setInActiveComplainsTypes,
} from "../../../ReaduxToolkit/Reducer/ComplainsTypeSlice";
import SelectPriorityBox from "./components/SelectPriorityBox";
import { CREATE_TYPE, GET_ALL_TYPES } from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

const CreateNewComplainType = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Type>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        title: "",
      });
    }
  };

  const addComplainType: SubmitHandler<Type> = async (data: any) => {
    setLoading(true);
    if (data.title !== "") {
      const complainType = {
        title: data.title,
        priorty: priority
      };
      // console.log(city);
      try {
        await create(complainType, {
          url: CREATE_TYPE,
        }).then((data: any) => {
          if (data !== undefined) {
            if (
              !data.success &&
              data.message === ERROR_MESSAGE
            ) {
              setLoading(false);
              setAddModal(false);
              reset({
                title: "",
              });
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
                title: "",
              });
            }
            if (data.success) {
              // console.log(data);
              setLoading(false);
              setAddModal(false);
              reset({
                title: "",
              });
              dispatch(setComplainsTypesStart());
              getAll({
                url: GET_ALL_TYPES,
              }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  Swal.fire({
                    text: "Failed to fetch due to connection refused",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  dispatch(setInActiveComplainsTypes("All"));
                  dispatch(setComplainsTypes([]));
                  dispatch(setFilterComplainsTypes([]));
                  dispatch(setComplainsTypesEnd());
                  return;
                }
                dispatch(setComplainsTypesEnd());
                if (data !== undefined) {
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setComplainsTypes(data.data));
                    dispatch(setFilterComplainsTypes(data.data));
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
          title: "",
        });
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
            backgroundColor: `${userPersonalizationData !== null &&
              userPersonalizationData?.buttonsAndBarsColor
              }`,
          }}
          onClick={addToggle}
        >
          <PlusCircle />
          Create New Complain Type
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Complain Type</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addComplainType)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Complain Type Title</P>
                  <input
                    className="form-control"
                    type="text"
                    {...register("title", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "Complain type is required"}
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
                  <P>Select Priority</P>
                  <SelectPriorityBox priority={priority} setPriority={setPriority} />
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

export default CreateNewComplainType;
