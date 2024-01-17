import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { H3 } from "../../AbstractElements";
import { PackageType } from "./PackageType/PackageType";
import { create, getAll } from "../../Api";
import {
  setFilterPackages,
  setPackageDays,
  setPackageDuration,
  setPackages,
  setPackagesEnd,
} from "../../ReaduxToolkit/Reducer/PackageSlice";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import SelectPackageBox from "./components/SelectPackageBox";

const CreateNewPackage = () => {
  const dispatch = useDispatch();
  const { packageDuration, packageDays } = useSelector(
    (state: any) => state.packages
  );

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PackageType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        title: "",
        price: Number(""),
        duration: "",
      });
    }
  };

  const addPackage: SubmitHandler<PackageType> = async (data) => {
    if (
      data.title !== "" &&
      data.price !== Number("") &&
      packageDuration !== null &&
      packageDays !== null
    ) {
      const packag = {
        title: data.title,
        price: data.price,
        duration: packageDuration,
        days: packageDays,
      };

      console.log(packag);
      try {
        await create(packag, { url: "package/create-package" }).then(
          (data: any) => {
            setLoading(false);
            setAddModal(false);
            if (data.success) {
              console.log(data);
              setLoading(false);
              dispatch(setPackageDuration(null));
              dispatch(setPackageDays(null));
              setAddModal(false);
              reset({
                title: "",
                price: Number(""),
              });
              getAll({ url: "package/get-all-packages" }).then((data: any) => {
                console.log("api call --- >", data);
                dispatch(setPackagesEnd());
                if (data !== undefined) {
                  if (data.success) {
                    console.log("hhg");
                    dispatch(setPackages(data.data));
                    dispatch(setFilterPackages(data.data));
                  }
                }
              });
            }
          }
        );
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        console.error("Error creating post:", error);
        setLoading(false);
        console.log(packag);
        setAddModal(false);
        reset({
          title: "",
          price: Number(""),
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
          className="btn btn-primary"
          style={{ color: "white" }}
          onClick={addToggle}
        >
          <PlusCircle />
          Add New Package
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="lg">
          <div className="modal-header">
            <H3 className="modal-title">Add Package</H3>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addPackage)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <Label>Package Name</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("title", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.title && "Package Title is required"}
                  </span>
                </FormGroup>
              </Row>
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <Label>Price</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("price", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.price && "Package price is required"}
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
                <SelectPackageBox placeholder={"Select Duration"} />
              </div>
              <Button color="primary" className="me-1">
                Add
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

export default CreateNewPackage;
