import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";

import { CheckCircle } from "react-feather";

import { useDispatch, useSelector } from "react-redux";
import { Type } from "./CountryTypes/CountryTypes";
import { Cancel } from "../../../utils/Constant";
import { H3 } from "../../../AbstractElements";
import { create, getAll } from "../../../Api";
// import {
//   setCountriesStart,
//   setCountriesEnd,
//   setCountries,
//   setFilterCountries,
// } from "../../ReaduxToolkit/Reducer/CountrySlice";

const CreateNewRole = () => {
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Type>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        name: "",
      });
    }
  };

  const permissionsArray = [
    {
      title: "Profile",
      value: "PROFILE",
      read: true,
      create: false,
      edit: false,
      delete: false,
    },
    {
      title: "Legal Documents",
      value: "LEGAL_DOCUMENTS",
      read: true,
      create: false,
      edit: false,
      delete: false,
    },
    {
      title: "Support",
      value: "SUPPORT",
      read: true,
      create: false,
      edit: false,
      delete: false,
    },
    {
      title: "Dashboard",
      value: "DASHBOARD",
      read: true,
      create: false,
      edit: false,
      delete: false,
    },
    {
      title: "User",
      value: "USER",
      read: true,
      create: false,
      edit: false,
      delete: false,
    },
  ];
  // const addRole: SubmitHandler<Type> = async (data: any) => {
  //   setLoading(true);
  //   if (data.name !== "") {
  //     const city = {
  //       name: data.name,
  //     };
  //     console.log(city);
  //     try {
  //       await create(city, { url: "country/create-country" }).then(
  //         (data: any) => {
  //           setLoading(false);
  //           setAddModal(false);
  //           if (data.success) {
  //             console.log(data);
  //             setLoading(false);
  //             setAddModal(false);
  //             reset({
  //               name: "",
  //             });
  //             dispatch(setCountriesStart());
  //             getAll({ url: "country/get-all-countries" }).then((data: any) => {
  //               console.log("api call --- >", data);
  //               dispatch(setCountriesEnd());
  //               if (data !== undefined) {
  //                 if (data.success) {
  //                   console.log("hhg");
  //                   dispatch(setCountries(data.data));
  //                   dispatch(setFilterCountries(data.data));
  //                 }
  //               }
  //             });
  //           }
  //         }
  //       );
  //       // Handle successful post creation (e.g., show a success message, redirect, etc.)
  //     } catch (error: any) {
  //       // Handle error (e.g., show an error message)
  //       console.error("Error creating post:", error);
  //       setLoading(false);
  //       setAddModal(false);
  //       reset({
  //         name: "",
  //       });
  //     }
  //   }
  // };

  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className="btn btn-primary"
          style={{ color: "white" }}
          onClick={addToggle}
        >
          <PlusCircle />
          Create New Role
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H3 className="modal-title">Add Role</H3>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              // onSubmit={handleSubmit(addCountry)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <Label>Role Name</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "Country name is required"}
                  </span>
                </FormGroup>

                <FormGroup
                  className="col-md-12 create-group"
                  style={{
                    overflowY: "auto",
                    maxHeight: "20vh", // Subtract scrollbar width from max height
                    WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
                    scrollbarWidth: "thin", // Specify scrollbar width
                    WebkitBorderRadius: "5px !important", // For WebKit browsers (Chrome, Safari)
                    MozBorderRadius: "5px !important", // For Mozilla Firefox
                    borderRadius: "5px !important", // For other browsers
                    scrollbarColor: "lightgray transparent", // Specify scrollbar color
                  }}
                >
                  {permissionsArray.map((permission: any, index: any) => {
                    return (
                      <div key={index}>
                        <Row>
                          <Col
                            key={index}
                            xl={10}
                            lg={10}
                            md={10}
                            sm={12}
                            xs={12}
                            // xs={12}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "17px",
                                margin: "15px 0px",
                                fontWeight: "bold",
                              }}
                            >
                              {permission.title}
                            </span>
                            <div>
                              <label
                                style={{
                                  display: "inline-block",
                                  position: "relative",
                                  cursor: "pointer",
                                  marginRight: "25px",
                                  fontSize: "18px",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  name="key"
                                  value="value"
                                  checked={permission.read}
                                  onChange={() => {}}
                                  style={{ display: "none" }} // Hide the default checkbox
                                />
                                <span
                                  onClick={(e) => e.stopPropagation()}
                                  className={permission.read ? "green" : "red"}
                                ></span>
                                Read
                              </label>
                              <label
                                style={{
                                  display: "inline-block",
                                  position: "relative",
                                  cursor: "pointer",
                                  marginRight: "25px",
                                  fontSize: "18px",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  name="key"
                                  value="value"
                                  checked={permission.create}
                                  onChange={() => {}}
                                  style={{ display: "none" }} // Hide the default checkbox
                                />
                                <span
                                  onClick={(e) => e.stopPropagation()}
                                  className={
                                    permission.create ? "green" : "red"
                                  }
                                ></span>
                                Create
                              </label>
                              <label
                                style={{
                                  display: "inline-block",
                                  position: "relative",
                                  cursor: "pointer",
                                  marginRight: "25px",
                                  fontSize: "18px",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  name="key"
                                  value="value"
                                  checked={permission.edit}
                                  onChange={() => {}}
                                  style={{ display: "none" }} // Hide the default checkbox
                                />
                                <span
                                  onClick={(e) => e.stopPropagation()}
                                  className={permission.edit ? "green" : "red"}
                                ></span>
                                Edit
                              </label>
                              <label
                                style={{
                                  display: "inline-block",
                                  position: "relative",
                                  cursor: "pointer",
                                  marginRight: "25px",
                                  fontSize: "18px",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  name="key"
                                  value="value"
                                  checked={permission.delete}
                                  onChange={() => {}}
                                  style={{ display: "none" }} // Hide the default checkbox
                                />
                                <span
                                  onClick={(e) => e.stopPropagation()}
                                  className={
                                    permission.delete ? "green" : "red"
                                  }
                                ></span>
                                Delete
                              </label>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </FormGroup>
              </Row>
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

export default CreateNewRole;
