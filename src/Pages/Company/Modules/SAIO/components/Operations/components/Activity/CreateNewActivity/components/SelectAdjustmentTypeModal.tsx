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
import { create } from "../../../../../../../../../../Utilities/api";
import { CREATE_NEW_STOCK_ADJUSTMENT } from "../../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../../Utilities/constants/constants";

interface SelectAdjustmentTypeModalProps {
  addModal: any;
  setAddModal: any;
  productId: string;
  itemId: string;
  setProductId: any;
  setItemId: any;
  setVehicleInventory: any;
  vehicleInventory: any;
  vehicleId: string;
}

const SelectAdjustmentTypeModal: React.FC<SelectAdjustmentTypeModalProps> = ({
  addModal,
  setAddModal,
  productId,
  itemId,
  setProductId,
  setItemId,
  setVehicleInventory,
  vehicleInventory,
  vehicleId,
}) => {
  const [adjustmentType, setAdjustmentType] = useState("");
  const [loading, setLoading] = useState(false);
  const { stockAdjustmentTypes } = useSelector(
    (state: any) => state.stockAdjustmentTypes
  );

  const navigate = useNavigate();

  const { branches, warehouses, products } = useSelector(
    (state: any) => state.stockMovement
  );
  // console.log("branches", branches, "warehouses", warehouses, "products", products);

  const addToggle = () => {
    setAddModal(!addModal);
  };

  const addStockAdjustment: SubmitHandler<any> = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    if (adjustmentType !== "") {
      var formData = {
        type: adjustmentType,
        product: productId,
        quantity: 1,
        items: [itemId],
        comments: "abc",
        vehicleId: vehicleId,
      };

      try {
        await create(formData, { url: CREATE_NEW_STOCK_ADJUSTMENT }).then(
          (data: any) => {
            if (data !== undefined) {
              if (!data.success && data.message === ERROR_MESSAGE) {
                setLoading(false);
                addToggle();
              }
              if (!data.success) {
                Swal.fire({
                  text: `${data.message}`,
                  icon: "error",
                  timer: 2000,
                  showConfirmButton: false,
                });
                setLoading(false);
                addToggle();
                setItemId("");
                setProductId("");
                setAdjustmentType("");
              }
              if (data.success) {
                // // console.log(data);
                setLoading(false);
                addToggle();
                setVehicleInventory([
                  ...vehicleInventory.filter((i: any) => i._id !== itemId),
                ]);
                setItemId("");
                setProductId("");
                setAdjustmentType("");
              }
            }
          }
        );
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        setLoading(false);
        addToggle();
        setItemId("");
        setProductId("");
        setAdjustmentType("");
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
  return (
    <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
      <div className="modal-header">
        <H4 className="modal-title">Create Adjustment</H4>
        <Button
          color="transparent"
          className="btn-close"
          onClick={addToggle}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={addStockAdjustment}
        >
          <FormGroup className="col-md-12 create-group">
            <P>Select Adjustment Type</P>
            <Select
              value={adjustmentType !== "" ? adjustmentType : null}
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
                setAdjustmentType(e);
              }}
              options={[
                ...stockAdjustmentTypes.map((item: any, index: any) => {
                  return {
                    value: item?._id,
                    label: item?.name,
                  };
                }),
              ]}
            />
          </FormGroup>
          <Button
            color="primary"
            className="me-1"
            disabled={adjustmentType == ""}
          >
            {loading ? "Loading ..." : `Create`}
          </Button>
          &nbsp;&nbsp;
          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={addToggle}
          >
            Cancel
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default SelectAdjustmentTypeModal;
