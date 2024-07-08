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
import { H3, H4, P } from "../../../AbstractElements";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { VehicleModelType } from "./VehicleModelTypes/VehicleModelTypes";
import {
  setId,
  setVehicleModel,
  setVehicleModelEnd,
  setVehicleModelStart,
  setFilterVehiclesModel,
  setInActiveActiveVehiclesModel,
  setVehicleMakeId,
} from "../../../ReaduxToolkit/Reducer/VehicleModelSlice";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import SelectVehicleMakeBox from "./components/SelectVehicleMakeBox";
import Swal from "sweetalert2";
import { getAll, update } from "../../../Utilities/api";
import {
  GET_ALL_VEHICLES_MODEL,
  UPDATE_VEHICLE_MODEL,
} from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  id: any;
  value: any;
  isActive: any;
  setIsActive: any;
  // setValue:any,
}

const UpdateVehicleModel: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  id,
  value,
  isActive,
  setIsActive,
  // setValue
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { vehicleMakeName, vehicleMakeId } = useSelector(
    (state: any) => state.vehicleModel
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VehicleModelType>({
    defaultValues: {
      // Set the initial value from props
      name: value,
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
  // console.log(id);
  // console.log(value);
  // console.log("isActive -- >", isActive);
  // dispatch(setValue(value));
  // console.log("is: ", isVisible);

  const updateVehicleModel: SubmitHandler<VehicleModelType> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const vehicleModel = {
        name: data.name,
        isActive: isActive,
        vehicleMake: vehicleMakeId,
      };
      // console.log(province);
      try {
        await update(vehicleModel, {
          url: `${UPDATE_VEHICLE_MODEL}/${id}`,
        }).then((data: any) => {
          if (!data.success && data.message === ERROR_MESSAGE) {
            setLoading(false);
            setIsVisible(!isVisible);
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            setIsVisible(!isVisible);
            dispatch(setVehicleMakeId(null));
          }
          if (data.success) {
            // console.log(data);
            setLoading(false);
            setIsVisible(!isVisible);
            dispatch(setVehicleMakeId(null));

            dispatch(setVehicleMakeId(null));
            // dispatch(setValue(""));
            dispatch(setVehicleModelStart());
            getAll({ url: GET_ALL_VEHICLES_MODEL }).then((data: any) => {
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
                dispatch(setNoDataFound(data.message));
                if (data.success) {
                  // console.log("hhg");
                  dispatch(setVehicleModel(data.data));
                  dispatch(setFilterVehiclesModel(data.data));
                }
              }
            });
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);

        setLoading(false);
        setIsVisible(!isVisible);
      }
    }
  };

  useEffect(() => {
    setValue("name", value);
  }, [value, setValue]);

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
        // console.log(value);
      }}
    >
      <div className="modal-header">
        <H4 className="modal-title">Update Vehicle Model</H4>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
            // console.log(value);
          }}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(updateVehicleModel)}
        >
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Vehicle Model Name</P>
              <input
                className="form-control"
                type="text"
                // defaultValue={value}
                autoComplete="off"
                {...register("name", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.name && "Vehicle Model name is required"}
              </span>

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
                        // console.log(e.target.value);
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
              // console.log(value);
            }}
          >
            {Cancel}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateVehicleModel;
