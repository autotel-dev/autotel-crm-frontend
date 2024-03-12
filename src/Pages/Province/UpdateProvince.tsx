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
import { Cancel } from "../../utils/Constant";
import { H3 } from "../../AbstractElements";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, update } from "../../Api";
import { ProvinceType } from "./ProvinceTypes/ProvinceTypes";
import {
  setId,
  setProvinces,
  setProvincesEnd,
  setProvincesStart,
  setFilterProvinces,
  setInActiveActiveProvinces,
} from "../../ReaduxToolkit/Reducer/ProvinceSlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import SelectCountryBox from "./components/SelectCountryBox";
import Swal from "sweetalert2";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  id: any;
  value: any;
  isActive: any;
  setIsActive: any;
  // setValue:any,
}

const UpdateProvince: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  id,
  value,
  isActive,
  setIsActive,
  // setValue
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { countryName, countryId } = useSelector(
    (state: any) => state.provinces
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProvinceType>({
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
  console.log(id);
  console.log(value);
  console.log("isActive -- >", isActive);
  // dispatch(setValue(value));
  console.log("is: ", isVisible);

  const updateProvince: SubmitHandler<ProvinceType> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const province = {
        name: data.name,
        isActive: isActive,
        countryId: countryId,
      };
      console.log(province);
      try {
        await update(province, { url: `province/update-province/${id}` }).then(
          (data: any) => {
            if (
              !data.success &&
              data.message == "ERROR_INTERNET_DISCONNECTED"
            ) {
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
            }
            if (data.success) {
              console.log(data);
              setLoading(false);
              setIsVisible(!isVisible);

              dispatch(setId(null));
              // dispatch(setValue(""));
              dispatch(setProvincesStart());
              getAll({ url: "province/get-all-provinces" }).then(
                (data: any) => {
                  console.log("api call --- >", data);
                  if (data == undefined) {
                    Swal.fire({
                      text: "Failed to fetch due to connection refused",
                      icon: "error",
                      timer: 2000,
                      showConfirmButton: false,
                    });
                    dispatch(setInActiveActiveProvinces("All"));
                    dispatch(setProvincesEnd());
                    dispatch(setProvinces([]));
                    dispatch(setFilterProvinces([]));
                    return;
                  }
                  dispatch(setProvincesEnd());
                  if (data !== undefined) {
                    dispatch(setNoDataFound(data.message));
                    if (data.success) {
                      console.log("hhg");
                      dispatch(setProvinces(data.data));
                      dispatch(setFilterProvinces(data.data));
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
        console.log(value);
      }}
    >
      <div className="modal-header">
        <H3 className="modal-title">Update Province</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
            console.log(value);
          }}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(updateProvince)}
        >
          <Row>
            <FormGroup className="col-md-12 create-group">
              <Label>Province Name</Label>
              <input
                className="form-control"
                type="text"
                // defaultValue={value}
                autoComplete="off"
                {...register("name", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.name && "Province name is required"}
              </span>

              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <SelectCountryBox placeholder={"Select Country"} />
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
              console.log(value);
            }}
          >
            {Cancel}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateProvince;
