import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { createNewCity } from "../../utils/Constant";
import { Link } from "react-router-dom";
import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { CheckCircle } from "react-feather";
import { H3, P } from "../../AbstractElements";
import { create, getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import { ProvinceType } from "./ProvinceTypes/ProvinceTypes";
import {
  setCountryId,
  setId,
  setProvinces,
  setProvincesEnd,
  setProvincesStart,
  setFilterProvinces,
  setInActiveActiveProvinces,
} from "../../ReaduxToolkit/Reducer/ProvinceSlice";
import SelectCountryBox from "./components/SelectCountryBox";
import Swal from "sweetalert2";

const CreateNewProvince = () => {
  const dispatch = useDispatch();
  const { countryId } = useSelector((state: any) => state.provinces);

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProvinceType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        name: "",
      });
      dispatch(setCountryId(null));
    }
  };

  const addProvince: SubmitHandler<ProvinceType> = async (data) => {
    setLoading(true);
    if (data.name !== "" && countryId !== null) {
      const province = {
        name: data.name,
        countryId: countryId,
      };
      // console.log(province);
      try {
        await create(province, { url: "province/create-province" }).then(
          (data: any) => {
            if (data !== undefined) {
              if (
                !data.success &&
                data.message == "ERROR_INTERNET_DISCONNECTED"
              ) {
                setLoading(false);
                setAddModal(false);
                reset({
                  name: "",
                });
                dispatch(setCountryId(null));
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
                dispatch(setCountryId(null));
              }

              if (data.success) {
                // console.log(data);
                dispatch(setCountryId(null));
                setLoading(false);
                setAddModal(false);
                reset({
                  name: "",
                });
                dispatch(setCountryId(null));
                dispatch(setProvincesStart());
                getAll({ url: "province/get-all-provinces" }).then(
                  (data: any) => {
                    // console.log("api call --- >", data);
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
                      if (data.success) {
                        // console.log("hhg");
                        dispatch(setProvinces(data.data));
                        dispatch(setFilterProvinces(data.data));
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
        dispatch(setCountryId(null));
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
          Create New Province
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H3 className="modal-title">Add Province</H3>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addProvince)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Province Name</P>
                  <input
                    className="form-control"
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "Province name is required"}
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
                  <P>Select Country</P>
                  <SelectCountryBox placeholder={"Select Country"} />
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

export default CreateNewProvince;
