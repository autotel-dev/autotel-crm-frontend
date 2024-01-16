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
  setPackageDays,
  setPackageDuration,
  setPackages,
  setPackagesEnd,
  setPackagesStart,
} from "../../ReaduxToolkit/Reducer/PackageSlice";
import SelectPackageBox from "./components/SelectPackageBox";
import { setProvincesEnd } from "../../ReaduxToolkit/Reducer/ProvinceSlice";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  id: any;
  title: any;
  price: any;
  duration: any;
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
  duration,
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
    setAddModal(!addModal);
    reset({
      title: "",
      price: Number(""),
      duration: "",
    });
  };
  console.log(id);
  console.log(title);
  console.log(price);
  console.log(duration);
  console.log("isActive -- >", isActive);
  // dispatch(setValue(value));
  console.log("is: ", isVisible);

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
      console.log(packag);
      try {
        await update(packag, { url: `package/update-package/${id}` }).then(
          (data: any) => {
            setLoading(false);
            if (data.success === false) {
              setLoading(false);
              setIsVisible(!isVisible);
            }
            if (data.success) {
              console.log(data);
              setLoading(false);
              setIsVisible(!isVisible);

              dispatch(setPackageDuration(null));
              dispatch(setPackageDays(null));
              dispatch(setPackagesStart());
              getAll({ url: "package/get-all-packages" }).then((data: any) => {
                console.log("api call --- >", data);
                dispatch(setPackagesEnd());
                if (data !== undefined) {
                  if (data.success) {
                    console.log("hhg");
                    setLoading(true);
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
        console.error("Error creating post:", error);
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
      toggle={() => {
        setIsVisible(!isVisible);
      }}
      size="md"
      onClosed={() => {
        // setValue("")
        setIsVisible(false);
        console.log(title);
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
            console.log(title);
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
          <div style={{ marginLeft: "10px" }}>
            <Row>
              <FormGroup check switch inline className="col-md-12 create-group">
                <Input
                  type="checkbox"
                  role="switch"
                  defaultChecked={isActive}
                  value={isActive ? "on" : "off"}
                  onChange={(e) => {
                    setIsActive(!isActive);
                    console.log(e.target.value);
                  }}
                />
              </FormGroup>
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
              console.log(title);
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
