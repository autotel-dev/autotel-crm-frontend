import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { createNewCity } from "../../utils/Constant";
import { Link } from "react-router-dom";
import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { CheckCircle } from "react-feather";
import { H3 } from "../../AbstractElements";
import { create } from "../../Api";
import GetData from "./GetList";
import { useDispatch, useSelector } from "react-redux";
import { ProvinceType } from "./ProvinceTypes/ProvinceTypes";

const CreateNewProvince = () => {
  const { provinces } = useSelector((state: any) => state.provinces);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  var [provinceList, setProvinceList]: any = useState([]);

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProvinceType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    setAddModal(!addModal);
    reset({
      name: "",
    });
  };

  const addProvince: SubmitHandler<ProvinceType> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const province = {
        name: data.name,
      };
      console.log(province);
      try {
        await create(province, { url: "province/create-province" }).then(
          (data: any) => {
            if (data.success) {
              console.log(data);
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
              });
              GetData(
                provinces,
                dispatch,
                provinceList,
                setProvinceList,
                setIsUpdateModalOpen,
                isUpdateModalOpen
              );
            }
          }
        );
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error) {
        // Handle error (e.g., show an error message)
        console.error("Error creating post:", error);
        setLoading(false);
        setAddModal(false);
        reset({
          name: "",
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
                  <Label>Province Name</Label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "City name is required"}
                  </span>
                </FormGroup>
              </Row>
              <Button color="secondary" className="me-1">
                {loading ? "Loading ..." : `Add`}
              </Button>
              &nbsp;&nbsp;
              <Button color="primary" onClick={addToggle}>
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
