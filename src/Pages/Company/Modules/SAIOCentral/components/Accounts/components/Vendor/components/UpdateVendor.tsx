import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Select } from "antd"; // Use your custom Select component
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { Cancel } from "../../../../../../../../../utils/Constant";
import { H3, H4, P } from "../../../../../../../../../AbstractElements";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, update } from "../../../../../../../../../Utilities/api";
import { Col } from "reactstrap";
import {
  setVendor,
  setVendorEnd,
  setVendorStart,
  setFilterVendor,
  setId,
  setInActiveActiveVendor,
} from "../../../../../../../../../ReaduxToolkit/Reducer/VendorSlice";
import { setNoDataFound } from "../../../../../../../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import Swal from "sweetalert2";
import {
  GET_ALL_VENDORS,
  UPDATE_VENDOR,
} from "../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../Utilities/constants/constants";
import { PlusCircle } from "react-feather";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  selectedVendor: any;
}

const UpdateVendor: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible,
  selectedVendor,
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
    selectedVendor.country
  );
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    selectedVendor.city
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      vendorName: selectedVendor.vendorName,
      phoneNo: selectedVendor.phoneNo,
      cnic: selectedVendor.cnic,
      emailAddress: selectedVendor.emailAddress,
      city: selectedVendor.city,
      ntn: selectedVendor.ntn,
      contactPersonName: selectedVendor.contactPersonName,
      country: selectedVendor.country,
      address: selectedVendor.address,
    },
  });

  useEffect(() => {
    reset({
      vendorName: selectedVendor.vendorName,
      phoneNo: selectedVendor.phoneNo,
      cnic: selectedVendor.cnic,
      emailAddress: selectedVendor.emailAddress,
      city: selectedVendor.city,
      ntn: selectedVendor.ntn,
      contactPersonName: selectedVendor.contactPersonName,
      country: selectedVendor.country,
      address: selectedVendor.address,
    });
  }, [selectedVendor, reset]);

  const updateVendor: SubmitHandler<any> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const vendor = {
        vendorName: data.vendorName,
        phoneNo: data.phoneNo,
        cnic: data.cnic,
        emailAddress: data.emailAddress,
        city: selectedCity,
        ntn: data.ntn,
        contactPersonName: data.contactPersonName,
        country: selectedCountry,
        address: data.address,
      };
      try {
        const response: any = await update(vendor, {
          url: `${UPDATE_VENDOR}/${selectedVendor._id}`,
        });
        if (response.success) {
          Swal.fire({
            text: "Vendor updated successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          dispatch(setId(null));
          dispatch(setVendorStart());
          const vendors: any = await getAll({ url: GET_ALL_VENDORS });
          if (vendors?.success) {
            dispatch(setVendor(vendors.data));
            dispatch(setFilterVendor(vendors.data));
          }
          setIsVisible(false);
        } else {
          Swal.fire({
            text: response.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setIsVisible(false);
        }
      } catch (error) {
        Swal.fire({
          text: "Failed to update vendor",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsVisible(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const { countries, cities } = useSelector((state: any) => state.vendor);

  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);

  useEffect(() => {
    const countriesOptions = countries.map((item: any) => ({
      value: item._id,
      label: item.name,
    }));
    setCountriesList(countriesOptions);
  }, [countries]);

  useEffect(() => {
    const filteredCities = cities
      .filter((city: any) => city.country === selectedCountry)
      .map((city: any) => ({
        value: city._id,
        label: city.name,
      }));
    setCitiesList(filteredCities);
  }, [cities, selectedCountry]);

  return (
    <Col md={6}>
      <Modal
        isOpen={isVisible}
        toggle={() => setIsVisible(!isVisible)}
        size="lg"
        centered
      >
        <div className="modal-header">
          <H4 className="modal-title">Update Vendor</H4>
          <Button
            color="transparent"
            className="btn-close"
            onClick={() => setIsVisible(!isVisible)}
          ></Button>
        </div>
        <ModalBody>
          <form onSubmit={handleSubmit(updateVendor)}>
            <Row style={{ marginBottom: "-20px" }}>
              <Col md={6}>
                <FormGroup>
                  <P>Vendor Name</P>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Name Here..."
                    {...register("vendorName", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "Vendor name is required"}
                  </span>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <P>Phone No</P>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Phone No Here..."
                    {...register("phoneNo", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.phoneNo && "Phone No is required"}
                  </span>
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: "-20px" }}>
              <Col md={6}>
                <FormGroup>
                  <P>Contact Person Name</P>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Contact Person Name Here..."
                    {...register("contactPersonName", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.contactPersonName &&
                      "Contact Person Name is required"}
                  </span>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <P>Email</P>
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Enter Email Here..."
                    {...register("emailAddress", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.emailAddress && "Email is required"}
                  </span>
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: "-20px" }}>
              <Col md={6}>
                <FormGroup>
                  <P>CNIC</P>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter CNIC Here..."
                    {...register("cnic", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.cnic && "CNIC is required"}
                  </span>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <P>NTN</P>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter NTN Here..."
                    {...register("ntn", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.ntn && "NTN is required"}
                  </span>
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: "0px" }}>
              <Col md={6}>
                <FormGroup>
                  <P>Country</P>
                  <Select
                    value={selectedVendor.country}
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select Country"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={countriesList}
                    onChange={(value) => {
                      setSelectedCountry(value);
                      setSelectedCity(""); // Clear city selection when country changes
                    }}
                  />
                  <span style={{ color: "red" }}>
                    {errors.country && "Country is required"}
                  </span>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <P>City</P>
                  <Select
                    value={selectedVendor.city}
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select City"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={citiesList}
                    onChange={(value) => setSelectedCity(value)}
                  />
                  <span style={{ color: "red" }}>
                    {errors.city && "City is required"}
                  </span>
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: "-20px" }}>
              <Col md={6}>
                <FormGroup>
                  <P>Address</P>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Address Here..."
                    {...register("address", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.address && "Address is required"}
                  </span>
                </FormGroup>
              </Col>
            </Row>
            <div className="text-end">
              <button
                type="button"
                className={`btn ${
                  userPersonalizationData?.buttonsAndBarsColor == null
                    ? "btn-secondary"
                    : ""
                }`}
                style={{
                  color: "white",
                  backgroundColor:
                    userPersonalizationData?.buttonsAndBarsColor || "",
                }}
                onClick={() => setIsVisible(false)}
              >
                {Cancel}
              </button>
              <button
                type="submit"
                className={`btn ${
                  userPersonalizationData?.buttonsAndBarsColor == null
                    ? "btn-primary"
                    : ""
                }`}
                style={{
                  color: "white",
                  backgroundColor:
                    userPersonalizationData?.buttonsAndBarsColor || "",
                  marginLeft: "5px",
                }}
              >
                {loading ? "Loading..." : "Save"}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </Col>
  );
};

export default UpdateVendor;
