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

// import { PackageType } from "./PackageType/PackageType";
import { CitiesType } from "../Cities/CityTypes/CityTypes";
import {
  setFilterPackages,
  setId,
  setInActiveActivePackages,
  setPackageDays,
  setPackageDuration,
  setPackages,
  setPackagesEnd,
  setPackagesStart,
} from "../../ReaduxToolkit/Reducer/PackageSlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import SelectPackageBox from "./components/SelectPackageBox";
import { setProvincesEnd } from "../../ReaduxToolkit/Reducer/ProvinceSlice";
import Swal from "sweetalert2";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  id: any;
  title: any;
  price: any;
  isActive: any;
  setIsActive: any;
  // setValue:any,
}

const UpdatePackage: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  id,
  title,
  price,
  isActive,
  setIsActive,
  // setValue
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { packageDuration, packageDays } = useSelector(
    (state: any) => state.packages
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CitiesType>({
    defaultValues: {
      // Set the initial value from props
      title: title,
      price: price,
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
  // console.log(title);
  // console.log(price);
  // console.log("isActive -- >", isActive);
  // dispatch(setValue(value));
  // console.log("is: ", isVisible);

  const updatePackage: SubmitHandler<CitiesType> = async (data) => {
    setLoading(true);
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
        days: Number(packageDays),
        isActive: isActive,
      };
      // console.log(packag);
      try {
        await update(packag, { url: `package/update-package/${id}` }).then(
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
              // console.log(data);
              setLoading(false);
              setIsVisible(!isVisible);

              dispatch(setPackageDuration(null));
              dispatch(setPackageDays(null));
              dispatch(setPackagesStart());
              getAll({ url: "package/get-all-packages" }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  Swal.fire({
                    text: "Failed to fetch due to connection refused",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  dispatch(setInActiveActivePackages("All"));
                  dispatch(setPackages([]));
                  dispatch(setFilterPackages([]));
                  dispatch(setPackagesEnd());
                  return;
                }
                dispatch(setPackagesEnd());
                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    setLoading(false);
                    dispatch(setPackages(data.data));
                    dispatch(setFilterPackages(data.data));
                  }
                }
              });
            }
          }
        );
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
    setValue("title", title);
  }, [title, setValue]);
  useEffect(() => {
    setValue("price", price);
  }, [price, setValue]);

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
        // console.log(title);
      }}
    >
      <div className="modal-header">
        <H3 className="modal-title">Update Package</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
            // console.log(title);
          }}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(updatePackage)}
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

              {/*  */}

              {/*  */}
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <SelectPackageBox placeholder={"Select Duration"} />
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
          <Button color="primary" className="me-1" disabled={loading}>
            {loading ? "Loading ..." : `Update`}
          </Button>
          &nbsp;&nbsp;
          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={() => {
              // setValue("")
              setIsVisible(!isVisible);
              // console.log(title);
            }}
          >
            {Cancel}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default UpdatePackage;
