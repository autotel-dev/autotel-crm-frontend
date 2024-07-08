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
import { Type } from "./BankTypes/BankTypes";
import {
  setBanksStart,
  setBanksEnd,
  setBanks,
  setFilterBanks,
  setInActiveActiveBanks,
} from "../../../ReaduxToolkit/Reducer/BankSlice";
import Swal from "sweetalert2";
import { CREATE_BANK,  GET_ALL_BANKS } from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

const CreateNewBank = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
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
    if (!loading) {
      setAddModal(!addModal);
      reset({
        name: "",
      });
    }
  };

  const addBank: SubmitHandler<Type> = async (data: any) => {
    setLoading(true);
    if (data.name !== "") {
      const city = {
        name: data.name,
      };
      // console.log(city);
      try {
        await create(city, { url: CREATE_BANK }).then(
          (data: any) => {
            if (data !== undefined) {
              if (
                !data.success &&
                data.message === ERROR_MESSAGE
              ) {
                setLoading(false);
                setAddModal(false);
                reset({
                  name: "",
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
                  name: "",
                });
              }
              if (data.success) {
                // console.log(data);
                setLoading(false);
                setAddModal(false);
                reset({
                  name: "",
                });
                dispatch(setBanksStart());
                getAll({ url: GET_ALL_BANKS }).then(
                  (data: any) => {
                    // console.log("api call --- >", data);
                    if (data == undefined) {
                      Swal.fire({
                        text: "Failed to fetch due to connection refused",
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                      dispatch(setInActiveActiveBanks("All"));
                      dispatch(setBanks([]));
                      dispatch(setFilterBanks([]));
                      dispatch(setBanksEnd());
                      return;
                    }
                    dispatch(setBanksEnd());
                    if (data !== undefined) {
                      if (data.success) {
                        // console.log("hhg");
                        dispatch(setBanks(data.data));
                        dispatch(setFilterBanks(data.data));
                      }
                    }
                  }
                );
              }
            }
          }
        );
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        setLoading(false);
        setAddModal(false);
        reset({
          name: "",
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
          className={`btn ${
            userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""
          }`}
          style={{
            color: "white",
            backgroundColor: `${
              userPersonalizationData !== null &&
              userPersonalizationData?.buttonsAndBarsColor
            }`,
          }}
          onClick={addToggle}
        >
          <PlusCircle />
          Create New Bank
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Bank</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addBank)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Bank Name</P>
                  <input
                    className="form-control"
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "Bank name is required"}
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

export default CreateNewBank;
