import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Modal, ModalBody, Row } from "reactstrap";
import Swal from "sweetalert2";
import { Select } from "antd"; // Use your custom Select component
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { H4, P } from "../../../../../../../../../../AbstractElements";
import { setActivity } from "../../../../../../../../../../ReaduxToolkit/Reducer/OperationActivitySlice";

interface SelectActivityTypeModalProps {
  addModal: any;
  setAddModal: any;
  activityType: string;
  setActivityType: any;
}

const SelectActivityTypeModal: React.FC<SelectActivityTypeModalProps> = ({
  addModal,
  setAddModal,
  activityType,
  setActivityType,
}) => {
  const dispatch = useDispatch();

  const ACTIVITY_TYPES = [
    { label: "Remove", value: "REMOVE" },
    { label: "Transfer", value: "TRANSFER" },
    { label: "Temporary Remove", value: "TEMPORARY_REMOVE" },
    { label: "Ownership Change", value: "OWNERSHIP_CHANGE" },
    // { label: "Add Vehicle", value: "ADD_VEHICLE" },
    { label: "Redo", value: "REDO" },
    { label: "Customer Data Update", value: "CUSTOMER_DATA_UPDATE" },
  ];

  const navigate = useNavigate();

  const { branches, warehouses, products } = useSelector(
    (state: any) => state.stockMovement
  );
  // console.log("branches", branches, "warehouses", warehouses, "products", products);

  const addToggle = () => {
    setAddModal(!addModal);
  };
  return (
    <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
      <div className="modal-header">
        <H4 className="modal-title">Activity Type</H4>
        <Button
          color="transparent"
          className="btn-close"
          onClick={addToggle}
        ></Button>
      </div>
      <ModalBody>
        <form className="form-bookmark needs-validation">
          <FormGroup className="col-md-12 create-group">
            <P>Select Activity Type</P>
            <Select
              value={activityType !== "" ? activityType : null}
              showSearch
              style={{ width: "100%", height: 36 }}
              placeholder="Select Activity Type"
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                (option?.P ?? "").includes(input)
              }
              filterSort={(optionA: any, optionB: any) =>
                (optionA?.P ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.P ?? "").toLowerCase())
              }
              onChange={async (e: any) => {
                setActivityType(e);
                localStorage.setItem("activityType", e);
              }}
              options={ACTIVITY_TYPES}
            />
          </FormGroup>

          {activityType !== "" && (
            <Button
              color="primary"
              onClick={() => {
                dispatch(setActivity(null));
                navigate(
                  `${process.env.PUBLIC_URL}/company/modules/saio-central/operations/activity/create-activity`
                );
              }}
            >
              Next
            </Button>
          )}
        </form>
      </ModalBody>
    </Modal>
  );
};

export default SelectActivityTypeModal;
