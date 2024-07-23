import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { createNewCity } from "../../../utils/Constant";
import { Link } from "react-router-dom";
import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../../utils/Constant";
import { CheckCircle } from "react-feather";
import { H3, H4, P } from "../../../AbstractElements";
import { create, getAll } from "../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import { VehicleModelType } from "./VehicleModelTypes/VehicleModelTypes";
import {
  setVehicleMakeId,
  setId,
  setVehicleModel,
  setVehicleModelEnd,
  setVehicleModelStart,
  setFilterVehiclesModel,
  setInActiveActiveVehiclesModel,
} from "../../../ReaduxToolkit/Reducer/VehicleModelSlice";
import SelectVehicleMakeBox from "./components/SelectVehicleMakeBox";
import Swal from "sweetalert2";
import { CREATE_VEHICLE_MODEL, GET_ALL_VEHICLES_MODEL } from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

const CreateNewVehicleModel = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const { vehicleMakeId } = useSelector((state: any) => state.vehicleModel);

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleModelType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        name: "",
      });
      dispatch(setVehicleMakeId(null));
    }
  };

  const addVehicleModel: SubmitHandler<VehicleModelType> = async (data) => {
    setLoading(true);
    if (data.name !== "" && vehicleMakeId !== null) {
      const vehicleModel = {
        name: data.name,
        vehicleMake: vehicleMakeId,
      };
      // console.log(province);
      try {
        await create(vehicleModel, { url: CREATE_VEHICLE_MODEL }).then(
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
                dispatch(setVehicleMakeId(null));
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
                dispatch(setVehicleMakeId(null));
              }

              if (data.success) {
                // console.log(data);
                dispatch(setVehicleMakeId(null));
                setLoading(false);
                setAddModal(false);
                reset({
                  name: "",
                });
                dispatch(setVehicleMakeId(null));
                dispatch(setVehicleModelStart());
                getAll({ url: GET_ALL_VEHICLES_MODEL }).then(
                  (data: any) => {
                    // console.log("api call --- >", data);
                    if (data == undefined) {
                      Swal.fire({
                        text: "Failed to fetch due to connection refused",
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                      dispatch(setInActiveActiveVehiclesModel("All"));
                      dispatch(setVehicleModelEnd());
                      dispatch(setVehicleModel([]));
                      dispatch(setFilterVehiclesModel([]));
                      return;
                    }
                    dispatch(setVehicleModelEnd());
                    if (data !== undefined) {
                      if (data.success) {
                        // console.log("hhg");
                        dispatch(setVehicleModel(data.data));
                        dispatch(setFilterVehiclesModel(data.data));
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
        dispatch(setVehicleMakeId(null));
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
          Create New Vehicle Model
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Vehicle Model</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addVehicleModel)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Vehicle Model Name</P>
                  <input
                    className="form-control"
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "Vehicle Model name is required"}
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
                  <P>Select Vehicle Make</P>
                  <SelectVehicleMakeBox placeholder={"Select Vehicle Make"} />
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

export default CreateNewVehicleModel;