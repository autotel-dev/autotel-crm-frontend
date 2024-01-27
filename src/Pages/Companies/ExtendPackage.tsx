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

import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { ProvinceType } from "../Province/ProvinceTypes/ProvinceTypes";
import {
  setCompanies,
  setCompaniesEnd,
  setCompaniesStart,
  setFilterCompanies,
} from "../../ReaduxToolkit/Reducer/CompanySlice";
import Swal from "sweetalert2";
import header from "../../Api/header";
import axios from "axios";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  companyId: any;
  packageId: any;
}

const ExtendPackage: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  companyId,
  packageId,
}) => {
  const { packages } = useSelector((state: any) => state.companies);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState("");
  const [customDays, setCustomDays] = useState("");
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

  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
    }
  };
  console.log(companyId);
  console.log(packageId);
  // dispatch(setValue(value));
  console.log("is: ", isVisible);

  const updateExtendedDays: SubmitHandler<ProvinceType> = async (data) => {
    setLoading(true);

    var extendedDays = {
      daysToAdd: Number(data.days),
    };
    // } else if (type === "Default") {
    //   extendedDays = {
    //     daysToAdd: Number(days),
    //   };
    // }

    console.log("extendedDays -- >", extendedDays);

    try {
      const response = await axios.patch(
        `http://124.29.238.127:8080/api/v1/super-admin/extend-company-package/${companyId}`,
        extendedDays,
        {
          headers: header,
        }
      );

      const result = response.data;
      console.log("Response data of change password:", response.data);
      if (result.success) {
        console.log("extended Days api", result);
        setLoading(false);
        setIsVisible(!isVisible);

        // dispatch(setValue(""));
        dispatch(setCompaniesStart());
        getAll({ url: "super-admin/get-all-companies" }).then((data: any) => {
          console.log("api call --- >", data);
          dispatch(setCompaniesEnd());
          if (data !== undefined) {
            dispatch(setNoDataFound(data.message));
            if (data.success) {
              console.log("hhg");
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
        // console.log(value);
      }}
    >
      <div className="modal-header">
        <H3 className="modal-title">Extend Package Days</H3>
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
          onSubmit={handleSubmit(updateExtendedDays)}
        >
          <Row>
            <FormGroup className="col-md-12 create-group">
              <Label>Extended Days</Label>
              <input
                className="form-control"
                type="text"
                autoComplete="off"
                // onChange={(e) => handleChange(e)}
                {...register("days")}
              />
            </FormGroup>
          </Row>
          <Button
            // onClick={() => {
            //   setType("Default");
            // }}
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
            // onClick={() => {
            //   setType("Custom");
            // }}
          >
            {loading ? "Loading ..." : `Custom`}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default ExtendPackage;
