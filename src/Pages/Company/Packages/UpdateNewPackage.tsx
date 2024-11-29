import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Modal, ModalBody, Row } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { Cancel } from "../../../utils/Constant";
import { H3, P } from "../../../AbstractElements";
import { create, getAll, update } from "../../../Utilities/api";
import Swal from "sweetalert2";
import "./permissionsStyle.css";
import {
  CREATE_SERVICE_PACKAGE,
  GET_ALL_SERVICE_PACKAGES,
  UPDATE_SERVICE_PACKAGE,
} from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";
import {
  setInActiveActivePackages,
  setServicePackages,
  setServiceFilterPackages,
} from "../../../ReaduxToolkit/Reducer/CompanyServicePackageSlice";
import { Select } from "antd";
import P2 from "../../../CommonElements/Paragraph/P2Element";

interface UpdateNewPackageProps {
  packagee: any;
  isVisible: any;
  setIsVisible: any;
}

const UpdateNewPackage: React.FC<UpdateNewPackageProps> = ({
  packagee,
  isVisible,
  setIsVisible,
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { allPackagesDuration } = useSelector(
    (state: any) => state.companyServicePackages
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<any>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    setIsVisible(!isVisible);
  };
  const [packageServices, setPackageServices] = useState<any[]>([]);

  // Use useEffect to reset the form whenever the modal opens and a brand is selected
  useEffect(() => {
    if (isVisible && packagee) {
      // Reset the form fields, including the name and branch ID
      reset({
        title: packagee.title,
        price: packagee.price,
        duration: packagee.duration, // Send duration from the form
        days: packagee.days, // Send the corresponding number of days for the selected duration
      });
      setPackageServices(packagee?.services);
    }
  }, [isVisible, packagee, reset]);

  const updatePackage: SubmitHandler<any> = async (data) => {
    if (data.title !== "" && data.price !== Number("")) {
      const packageData = {
        title: data.title,
        price: data.price,
        duration: data.duration, // Send duration from the form
        days: data.days, // Send the corresponding number of days for the selected duration
        services: packageServices, // Include the selected services
      };

      try {
        setLoading(true);
        await update(packageData, {
          url: `${UPDATE_SERVICE_PACKAGE}/${packagee._id}`,
        }).then((response: any) => {
          if (response !== undefined) {
            if (!response.success && response.message === ERROR_MESSAGE) {
              setLoading(false);
            }
            if (!response.success) {
              Swal.fire({
                text: `${response.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              // setAddModal(false);
            }

            if (response.success) {
              setLoading(false);
              addToggle();
              getAll({ url: GET_ALL_SERVICE_PACKAGES }).then((data: any) => {
                if (data === undefined) {
                  Swal.fire({
                    text: "Failed to fetch due to connection refused",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  dispatch(setInActiveActivePackages("All"));
                  dispatch(setServicePackages([]));
                  dispatch(setServiceFilterPackages([]));
                  return;
                }
                if (data !== undefined && data.success) {
                  dispatch(setServicePackages(data.data));
                  dispatch(setServiceFilterPackages(data.data));
                }
              });
            }
          }
        });
      } catch (error) {
        setLoading(false);
        addToggle();
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

  const handlePackageDurationChange = (packageDuration: any) => {
    setValue("duration", packageDuration.value);
    setValue("days", packageDuration.days);
  };

  const handleCheckboxChange = (index: number) => {
    const updatedServices = packageServices.map((service: any, i: number) =>
      i === index ? { ...service, isOffering: !service.isOffering } : service
    );
    setPackageServices(updatedServices);
  };

  return (
    <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
      <div className="modal-header">
        <H3 className="modal-title">Update Package</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={addToggle}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(updatePackage)}
        >
          <Row
            style={{
              marginBottom: "-16px",
            }}
          >
            <FormGroup className="col-md-12 create-group ">
              <P>Name</P>
              <input
                className="form-control"
                type="text"
                {...register("title", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.name && "title is required"}
              </span>
            </FormGroup>
          </Row>
          <Row
            style={{
              marginBottom: "-16px",
            }}
          >
            <FormGroup className="col-md-12 create-group">
              <P>Price</P>
              <input
                className="form-control"
                type="text"
                {...register("price", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.name && "Price is required"}
              </span>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Select Duration</P>
              <Select
                style={{
                  width: "100%",
                  height: 36,
                }}
                showSearch
                value={watch("duration")} // Bind Select's value to the "branch" field from the form
                placeholder="Select Duration"
                optionFilterProp="children"
                filterOption={(input, option) => {
                  // Perform case-insensitive search
                  return (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase());
                }}
                onChange={(e, options) => handlePackageDurationChange(options)} // Update the form's branch field when a branch is selected
                options={[
                  ...allPackagesDuration.map((item: any, index: any) => {
                    return {
                      label: item.title,
                      value: item.value,
                      days: item.days,
                    };
                  }),
                ]}
              />
            </FormGroup>
          </Row>
          <Row
            style={{
              display: "flex",
            }}
          >
            <P>Services</P>
            <div
              style={{
                height: "10px",
              }}
            ></div>
            {packageServices?.map((item: any, index: number) => {
              return (
                <Col sm={4} key={index}>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      position: "relative",
                      cursor: "pointer",
                      marginRight: "25px",
                      fontSize: "18px",
                      marginBottom: "10px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      name="key"
                      value={item.service.value}
                      checked={item.isOffering} // Use isOffering to control checkbox state
                      onChange={() => handleCheckboxChange(index)} // Toggle isOffering when checkbox changes
                      style={{ display: "none" }}
                    />
                    <span
                      onClick={(e) => e.stopPropagation()}
                      className="green"
                    ></span>
                    <P2>{item.service.title}</P2>
                    {/* Display the service title */}
                  </label>
                </Col>
              );
            })}
          </Row>
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Update`}
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
  );
};

export default UpdateNewPackage;
