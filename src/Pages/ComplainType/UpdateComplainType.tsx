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
import { H3, P } from "../../AbstractElements";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, update } from "../../Api";
import { Type } from "./ComplainsTypes/ComplainsTypes";
import {
  setCountriesStart,
  setCountriesEnd,
  setCountries,
  setId,
  setFilterCountries,
  setInActiveActiveCountries,
} from "../../ReaduxToolkit/Reducer/CountrySlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import Swal from "sweetalert2";
import {
  setComplainsTypes,
  setComplainsTypesEnd,
  setComplainsTypesStart,
  setFilterComplainsTypes,
  setInActiveComplainsTypes,
} from "../../ReaduxToolkit/Reducer/ComplainsTypeSlice";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  id: any;
  value: any;
  isActive: any;
  setIsActive: any;
}

const UpdateComplainType: React.FC<PropsTypes> = ({
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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Type>({
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

  const updateComplainType: SubmitHandler<Type> = async (data) => {
    setLoading(true);
    if (data.title !== "") {
      const complain = {
        title: data.title,
        isActive: isActive,
      };
      // console.log(country);
      try {
        await update(complain, {
          url: `complaint-center/internal-complaint-type/update-type/${id}`,
        }).then((data: any) => {
          if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
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
            // console.log(data);
            setLoading(false);
            setIsVisible(!isVisible);

            dispatch(setId(null));
            // dispatch(setValue(""));
            dispatch(setComplainsTypesStart());
            getAll({ url: "complaint-center/internal-complaint-type/get-all-types" }).then((data: any) => {
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
                dispatch(setNoDataFound(data.message));
                if (data.success) {
                  // console.log("hhg");
                  dispatch(setComplainsTypes(data.data));
                  dispatch(setFilterComplainsTypes(data.data));
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
    setValue("title", value);
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
        <H3 className="modal-title">Update Complain Title</H3>
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
          onSubmit={handleSubmit(updateComplainType)}
        >
          <Row>
            <FormGroup className="col-md-12 ">
              <P>Complain Type Title</P>
              <input
                className="form-control"
                type="text"
                // defaultValue={value}
                autoComplete="off"
                {...register("title", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.name && "Complain title is required"}
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
          <div style={{ marginLeft: "10px" }}>
            <Row></Row>
          </div>
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

export default UpdateComplainType;
