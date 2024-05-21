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
import { H3, H4, P } from "../../AbstractElements";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, update } from "../../Api";
import { Type } from "./EmailTemplatesTypes/EmailTemplatesTypes";
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

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  id: any;
  value: any;
  isActive: any;
  setIsActive: any;
}

const UpdateEmailTemplate: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => { },
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
      title: value,
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

  // const updateCountry: SubmitHandler<Type> = async (data) => {
  //   setLoading(true);
  //   if (data.name !== "") {
  //     const country = {
  //       name: data.name,
  //       isActive: isActive,
  //     };
  //     // console.log(country);
  //     try {
  //       await update(country, { url: `country/update-country/${id}` }).then(
  //         (data: any) => {
  //           if (
  //             !data.success &&
  //             data.message === "ERROR_INTERNET_DISCONNECTED"
  //           ) {
  //             setLoading(false);
  //             setIsVisible(!isVisible);
  //           }
  //           if (!data.success) {
  //             Swal.fire({
  //               text: `${data.message}`,
  //               icon: "error",
  //               timer: 2000,
  //               showConfirmButton: false,
  //             });
  //             setLoading(false);
  //             setIsVisible(!isVisible);
  //           }
  //           if (data.success) {
  //             // console.log(data);
  //             setLoading(false);
  //             setIsVisible(!isVisible);

  //             dispatch(setId(null));
  //             // dispatch(setValue(""));
  //             dispatch(setCountriesStart());
  //             getAll({ url: "country/get-all-countries" }).then((data: any) => {
  //               // console.log("api call --- >", data);
  //               if (data == undefined) {
  //                 Swal.fire({
  //                   text: "Failed to fetch due to connection refused",
  //                   icon: "error",
  //                   timer: 2000,
  //                   showConfirmButton: false,
  //                 });
  //                 dispatch(setInActiveActiveCountries("All"));
  //                 dispatch(setCountries([]));
  //                 dispatch(setFilterCountries([]));
  //                 dispatch(setCountriesEnd());
  //                 return;
  //               }
  //               dispatch(setCountriesEnd());
  //               if (data !== undefined) {
  //                 dispatch(setNoDataFound(data.message));
  //                 if (data.success) {
  //                   // console.log("hhg");
  //                   dispatch(setCountries(data.data));
  //                   dispatch(setFilterCountries(data.data));
  //                 }
  //               }
  //             });
  //           }
  //         }
  //       );
  //       // Handle successful post creation (e.g., show a success message, redirect, etc.)
  //     } catch (error) {
  //       // Handle error (e.g., show an error message)
  //       // console.error("Error creating post:", error);

  //       setLoading(false);
  //       setIsVisible(!isVisible);
  //     }
  //   }
  // };
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
        <H4 className="modal-title">Update Country</H4>
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
        // onSubmit={handleSubmit(updateCountry)}
        >
          <Row>
            <FormGroup className="col-md-12 ">
              <P>Title</P>
              <input
                className="form-control"
                type="text"
                // defaultValue={value}
                autoComplete="off"
                {...register("title", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.title && "Template Title is required"}
              </span>
              {/* <div className="d-flex">
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
                      className={`switch-state ${isActive ? "bg-primary" : "bg-secondary"
                        }`}
                    />
                  </Label>
                </div>
              </div> */}
            </FormGroup>
            <FormGroup className="col-md-12 create-group">
              <P>Content</P>
              <textarea
                className="form-control"
                rows={5} // Minimum number of visible lines
                style={{
                  maxHeight: "500px", // Maximum height for 5 lines of text
                  resize: "vertical", // Allow vertical resizing within the specified range
                }}
                {...register("templateContent", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.templateContent && "Template Content is required"}
              </span>
            </FormGroup>
          </Row>
          <div style={{ marginLeft: "10px" }}>
            <Row>
              {/* <FormGroup check switch inline className="col-md-12 create-group">
                <Input
                  type="checkbox"
                  role="switch"
                  defaultChecked={isActive}
                  value={isActive ? "on" : "off"}
                  onChange={(e) => {
                    setIsActive(!isActive);
                    // console.log(e.target.value);
                  }}
                />
              </FormGroup> */}
            </Row>
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

export default UpdateEmailTemplate;
