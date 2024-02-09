import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H3 } from "../../../../../../../AbstractElements";

interface ResponseType {
  field1?: string;
  field2?: string;
  field3?: string;
}

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
}

const ResponseForm: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResponseType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        field1: "",
        field2: "",
        field3: "",
      });
    }
  };

  //   const sendResponse: SubmitHandler<ResponseType> = async (data: any) => {
  //     setLoading(true);
  //     if (data.name !== "") {
  //       const city = {
  //         name: data.name,
  //       };
  //       console.log(city);
  //       try {
  //         await create(city, { url: "country/create-country" }).then(
  //           (data: any) => {
  //             setLoading(false);
  //             setAddModal(false);
  //             if (data.success) {
  //               console.log(data);
  //               setLoading(false);
  //               setAddModal(false);
  //               reset({
  //                 name: "",
  //               });
  //               dispatch(setCountriesStart());
  //               getAll({ url: "country/get-all-countries" }).then((data: any) => {
  //                 console.log("api call --- >", data);
  //                 dispatch(setCountriesEnd());
  //                 if (data !== undefined) {
  //                   if (data.success) {
  //                     console.log("hhg");
  //                     dispatch(setCountries(data.data));
  //                     dispatch(setFilterCountries(data.data));
  //                   }
  //                 }
  //               });
  //             }
  //           }
  //         );
  //         // Handle successful post creation (e.g., show a success message, redirect, etc.)
  //       } catch (error: any) {
  //         // Handle error (e.g., show an error message)
  //         console.error("Error creating post:", error);
  //         setLoading(false);
  //         setAddModal(false);
  //         reset({
  //           name: "",
  //         });
  //       }
  //     }
  //   };

  return (
    <Col md={12}>
      <form
        className="form-bookmark needs-validation"
        //   onSubmit={handleSubmit(addCountry)}
      >
        <Row style={{ paddingTop: "20px" }}>
          <FormGroup className="col-md-12 create-group">
            <Label>Field 1</Label>
            <input
              className="form-control"
              type="text"
              {...register("field1", { required: true })}
            />
            <span style={{ color: "red" }}>
              {errors.field1 && "Country name is required"}
            </span>
          </FormGroup>
          <FormGroup className="col-md-12 create-group">
            <Label>Field 2</Label>
            <input
              className="form-control"
              type="text"
              {...register("field2", { required: true })}
            />
            <span style={{ color: "red" }}>
              {errors.field2 && "Country name is required"}
            </span>
          </FormGroup>
          <FormGroup className="col-md-12 create-group">
            <Label>Field 3</Label>
            <input
              className="form-control"
              type="text"
              {...register("field3", { required: true })}
            />
            <span style={{ color: "red" }}>
              {errors.field3 && "Country name is required"}
            </span>
          </FormGroup>
        </Row>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Completed`}
          </Button>
          &nbsp;&nbsp;
          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={() => {
              setIsVisible(!isVisible);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Col>
  );
};

export default ResponseForm;
