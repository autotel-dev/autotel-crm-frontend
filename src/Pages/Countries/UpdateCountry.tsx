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
import { Type } from "./CountryTypes/CountryTypes";
import {
  setCountriesStart,
  setCountriesEnd,
  setCountries,
  setId,
} from "../../ReaduxToolkit/Reducer/CountrySlice";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  id: any;
  value: any;
}

const UpdateCountry: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  id,
  value,

  // setValue
}) => {
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
    },
  });
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    setAddModal(!addModal);
    reset({
      name: "",
    });
  };
  console.log(id);
  console.log(value);

  console.log("is: ", isVisible);

  const updateCity: SubmitHandler<Type> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const city = {
        name: data.name,
      };
      console.log(city);
      try {
        await update(city, { url: `country/update-country/${id}` }).then(
          (data: any) => {
            if (data.success == false) {
              setLoading(false);
              setIsVisible(!isVisible);
            }
            if (data.success) {
              console.log(data);
              setLoading(false);
              setIsVisible(!isVisible);
              reset({
                name: "",
              });
              dispatch(setId(null));
              // dispatch(setValue(""));
              dispatch(setCountriesStart());
              getAll({ url: "country/get-all-countries" }).then((data: any) => {
                console.log(data);
                if (data.statusCode == 200) {
                  dispatch(setCountriesEnd());
                  dispatch(setCountries(data.data));
                }
              });
            }
          }
        );
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error) {
        // Handle error (e.g., show an error message)
        console.error("Error creating post:", error);
        setLoading(false);
        setIsVisible(!isVisible);
        reset({
          name: "",
        });
      }
    }
  };

  useEffect(() => {
    setValue("name", value);
  }, [value, setValue]);

  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={() => {
        setIsVisible(!isVisible);
      }}
      size="md"
      onClosed={() => {
        // setValue("")
        setIsVisible(false);
        console.log(value);
      }}
    >
      <div className="modal-header">
        <H3 className="modal-title">Update City</H3>
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
          onSubmit={handleSubmit(updateCity)}
        >
          <Row>
            <FormGroup className="col-md-12 create-group">
              <Label>City Name</Label>
              <input
                className="form-control"
                type="text"
                // defaultValue={value}
                autoComplete="off"
                {...register("name", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.name && "City name is required"}
              </span>
            </FormGroup>
          </Row>
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Update`}
          </Button>
          &nbsp;&nbsp;
          <Button
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

export default UpdateCountry;
