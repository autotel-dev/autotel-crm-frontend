import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { H3 } from "../../AbstractElements";
import { create, getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import { Type } from "../Countries/CountryTypes/CountryTypes";
import {
  setCRMModules,
  setCRMModulesEnd,
  setCRMModulesStart,
  setFilterCRMModules,
} from "../../ReaduxToolkit/Reducer/CRMModuleSlice";

const CreateNewCRMModule = () => {
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
    setAddModal(!addModal);
    reset({
      name: "",
      icon: "",
    });
  };

  const addCCRMModule: SubmitHandler<Type> = async (data) => {
    setLoading(true);
    if (data.name !== "" && data.icon !== "") {
      const crmModule = {
        name: data.name,
        icon: data.icon,
      };
      console.log(crmModule);
      try {
        await create(crmModule, { url: "crm-module/create-module" }).then(
          (data: any) => {
            if (data.success) {
              console.log(data);
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
                icon: "",
              });
              dispatch(setCRMModulesStart());
              getAll({ url: "crm-module/get-all-modules" }).then(
                (data: any) => {
                  console.log("api call --- >", data);
                  dispatch(setCRMModulesEnd());
                  if (data !== undefined) {
                    if (data.success) {
                      console.log("hhg");
                      dispatch(setCRMModules(data.data));
                      dispatch(setFilterCRMModules(data.data));
                    }
                  }
                }
              );
            }
          }
        );
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        console.error("Error creating post:", error);
        setLoading(false);
        setAddModal(false);
        reset({
          name: "",
          icon: "",
        });
      }
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
          Create New Module
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H3 className="modal-title">Add CRM Module</H3>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addCCRMModule)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <Label>Module Name</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "Module name is required"}
                  </span>
                </FormGroup>
              </Row>
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <Label>Icon Class</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("icon", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "Icon class is required"}
                  </span>
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

export default CreateNewCRMModule;
