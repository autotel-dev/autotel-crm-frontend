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
import { H3, H4 } from "../../AbstractElements";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL, getAll, update } from "../../Api";

import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { ProvinceType } from "../Province/ProvinceTypes/ProvinceTypes";
import {
  setCompanies,
  setCompaniesEnd,
  setCompaniesStart,
  setFilterCompanies,
} from "../../ReaduxToolkit/Reducer/CompanySlice";
import Swal from "sweetalert2";
import { header } from "../../Api/header";
import axios from "axios";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  companyId: any;
  packageId: any;
  packageExpirationDate: any;
}

const ExtendPackage: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => { },
  companyId,
  packageId,
  packageExpirationDate,
}) => {
  const { packages } = useSelector((state: any) => state.companies);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState("");
  const [customDays, setCustomDays] = useState(0);
  const [customDate, setCustomDate] = useState("");
  const [type, setType] = useState("");
  useEffect(() => {
    packages.map((item: any, index: any) => {
      if (item._id === packageId) {
        setDays(item.days);
      }
    });
  }, [packageId]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProvinceType>({
    defaultValues: {
      days: days,
    },
  });
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
    }
  };

  const handleChange = (e: any) => {
    console.log(e.target.value);
    setCustomDate(e.target.value);
  };

  const remainingDaysCalculation = (date: string) => {
    const targetDate = new Date(date);
    const currentDate = new Date();

    // Calculate the difference in milliseconds between the target date and the current date
    const differenceInMillis = targetDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const daysRemaining = Math.ceil(differenceInMillis / (1000 * 60 * 60 * 24));
    return daysRemaining;
    // console.log("Days remaining:", daysRemaining);
  };

  const updateExtendedDays: SubmitHandler<ProvinceType> = async (data) => {
    setLoading(true);
    try {
      var extendedDays;
      var response;
      if (type == "custom") {
        const expirationDate = new Date(customDate);
        const today = new Date();
        const differenceInTime = expirationDate.getTime() - today.getTime();
        const differenceInDays = Math.ceil(
          differenceInTime / (1000 * 3600 * 24)
        );
        const remainigDays = remainingDaysCalculation(packageExpirationDate);
        if (differenceInDays <= remainigDays) {
          setLoading(false);
          setIsVisible(!isVisible);
          Swal.fire({
            title: "Note",
            html: "The date you selected is included in your expiry already</br>Please select the date that is greater than your expiry",
            icon: "warning",
            timer: 2000,
            showConfirmButton: false,
          });
          return;
        }
        setCustomDays(differenceInDays);
        extendedDays = {
          daysToAdd: Number(differenceInDays),
        };

        response = await axios.patch(
          `${API_BASE_URL}/super-admin/extend-company-package/${companyId}`,
          extendedDays,
          {
            headers: header(),
          }
        );
      } else {
        extendedDays = {
          daysToAdd: Number(data.days),
        };

        response = await axios.patch(
          `${API_BASE_URL}/super-admin/extend-company-package/${companyId}`,
          extendedDays,
          {
            headers: header(),
          }
        );
      }

      const result = response.data;
      // console.log("Response data of change password:", response.data);
      if (result.success) {
        // console.log("extended Days api", result);
        setLoading(false);
        setIsVisible(!isVisible);
        if (type == "custom") {
          setType("");
        }
        // dispatch(setValue(""));
        dispatch(setCompaniesStart());
        getAll({ url: "super-admin/get-all-companies" }).then((data: any) => {
          // console.log("api call --- >", data);
          dispatch(setCompaniesEnd());
          if (data !== undefined) {
            dispatch(setNoDataFound(data.message));
            if (data.success) {
              // console.log("hhg");
              dispatch(setCompanies(data.data));
              dispatch(setFilterCompanies(data.data));
            }
          }
        });
      }

      return result;
    } catch (error: any) {
      setLoading(false);
      Swal.fire({
        text: `${error.response.data.message}`,
        icon: "info",
        timer: 2000,
        showCancelButton: false,
      });
      setIsVisible(!isVisible);
    }
  };

  useEffect(() => {
    setValue("days", days);
  }, [days, setValue]);

  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={addToggle}
      size="md"
      onClosed={() => {
        // setValue("")
        setIsVisible(false);
        // // console.log(value);
      }}
    >
      <div className="modal-header">
        <H4 className="modal-title">Extend Package Days</H4>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
            // // console.log(value);
          }}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(updateExtendedDays)}
        >
          <Row>
            {type !== "custom" && (
              <FormGroup className="col-md-12 create-group">
                <Label>Extended Days</Label>
                <input
                  className="form-control"
                  type="text"
                  autoComplete="off"
                  disabled={true}
                  // onChange={(e) => handleChange(e)}
                  {...register("days")}
                />
              </FormGroup>
            )}
            {type == "custom" && (
              <FormGroup className="col-md-12 create-group">
                <Label>Select Date For Extension</Label>
                <input
                  className="form-control"
                  type="date"
                  autoComplete="off"
                  onChange={(e) => handleChange(e)}
                  min={new Date().toISOString().split("T")[0]}
                  max={
                    new Date(
                      new Date().setDate(new Date().getDate() + Number(days))
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  value={customDate == "" ? new Date().toISOString().split("T")[0] : customDate}
                // {...register("days")}
                />
              </FormGroup>
            )}
          </Row>
          {type !== "custom" && (
            <div>
              <Button
                disabled={loading ? true : false}
                color="primary"
                className="me-1"
              >
                {loading ? "Loading ..." : `Default`}
              </Button>
              &nbsp;&nbsp;
              <Button
                disabled={loading ? true : false}
                color="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setType("custom");
                }}
              >
                {/* {loading ? "Loading ..." : `Custom`} */}
                Custom
              </Button>
            </div>
          )}

          {type == "custom" && (
            <div>
              <Button
                disabled={loading ? true : false}
                color="primary"
                className="me-1"
                onClick={(e) => {
                  e.preventDefault();
                  setType("");
                }}
              >
                Cancel
              </Button>
              &nbsp;&nbsp;
              <Button disabled={loading ? true : false} color="secondary">
                {loading ? "Loading ..." : `Save`}
              </Button>
            </div>
          )}
        </form>
      </ModalBody>
    </Modal>
  );
};

export default ExtendPackage;
