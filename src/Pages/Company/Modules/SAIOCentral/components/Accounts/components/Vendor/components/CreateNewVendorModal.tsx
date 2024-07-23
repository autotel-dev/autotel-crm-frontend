import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { H4, P } from "../../../../../../../../../AbstractElements";
import { Select } from "antd"; // Use your custom Select component
import { create, getAll } from "../../../../../../../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import { Cancel } from "../../../../../../../../../utils/Constant";
import {
  setVendor,
  setVendorStart,
  setVendorEnd,
  setCitiesId,
  setCountryId,
  setFilterVendor,
} from "../../../../../../../../../ReaduxToolkit/Reducer/VendorSlice";
import Swal from "sweetalert2";
import {
  CREATE_VENDOR,
  GET_ALL_VENDORS,
} from "../../../../../../../../../Utilities/api/apiEndpoints";

const CreateNewVendorModal = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [addModal, setAddModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);

  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        vendorName: "",
        phoneNo: "",
        cnic: "",
        emailAddress: "",
        city: "",
        ntn: "",
        contactPersonName: "",
        country: "",
        address: "",
      });
      setSelectedCountry(undefined);
      setSelectedCity(undefined);
    }
  };

  const addVendor: SubmitHandler<any> = async (data) => {
    setLoading(true);
    if (
      data.vendorName &&
      data.phoneNo &&
      data.cnic &&
      data.emailAddress &&
      selectedCity &&
      data.ntn &&
      data.contactPersonName &&
      selectedCountry &&
      data.address
    ) {
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
        const response: any = await create(vendor, { url: CREATE_VENDOR });
        if (response.success) {
          Swal.fire({
            text: "Vendor created successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
          setAddModal(false);
          reset();
          setSelectedCountry(undefined);
          setSelectedCity(undefined);

          dispatch(setVendorStart());
          const vendorsResponse: any = await getAll({ url: GET_ALL_VENDORS });
          dispatch(setVendorEnd());
          if (vendorsResponse.success) {
            dispatch(setVendor(vendorsResponse.data));
            dispatch(setFilterVendor(vendorsResponse.data));
          } else {
            Swal.fire({
              text: "Failed to fetch vendors",
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }
        } else {
          Swal.fire({
            text: response.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
        }
      } catch (error: any) {
        Swal.fire({
          text: error.message || "Error creating vendor",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
      }
    } else {
      Swal.fire({
        text: "Please fill in all the fields",
        icon: "info",
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: true,
      });
      setLoading(false);
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
      <div className="text-end">
        <button
          className={`btn ${
            userPersonalizationData?.buttonsAndBarsColor == null
              ? "btn-primary"
              : ""
          }`}
          style={{
            color: "white",
            backgroundColor: userPersonalizationData?.buttonsAndBarsColor || "",
          }}
          onClick={addToggle}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <PlusCircle size={18} style={{ marginRight: "5px" }} />
            Create New Vendor
          </span>
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Vendor </H4>
            <Button
              color="transparent"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addVendor)}
            >
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
                      {errors.vendorName && "Vendor name is required"}
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
                      showSearch
                      style={{ width: "100%", height: 36 }}
                      placeholder="Select Country"
                      optionFilterProp="children"
                      filterOption={(input: any, option: any) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      onChange={(value) => {
                        setSelectedCountry(value);
                        setSelectedCity(""); // Clear city selection when country changes
                      }}
                      options={countriesList}
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
                      showSearch
                      
                      style={{ width: "100%", height: 36 }}
                      placeholder="Select City"
                      optionFilterProp="children"
                      filterOption={(input: any, option: any) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      onChange={(value) => setSelectedCity(value)}
                      options={citiesList}
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
                  onClick={addToggle}
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
      </div>
    </Col>
  );
};

export default CreateNewVendorModal;
