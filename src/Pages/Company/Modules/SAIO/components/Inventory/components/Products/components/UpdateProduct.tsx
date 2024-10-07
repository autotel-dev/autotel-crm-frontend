import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { H4, P } from "../../../../../../../../../AbstractElements";
import { Select } from "antd"; // Use your custom Select component
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { ERROR_MESSAGE } from "../../../../../../../../../Utilities/constants/constants";
import { ProductType } from "../Type/ProductType";
import { Cancel } from "../../../../../../../../../utils/Constant";
import { getAll, update } from "../../../../../../../../../Utilities/api";
import {
  GET_ALL_PRODUCTS,
  UPDATE_PRODUCT,
} from "../../../../../../../../../Utilities/api/apiEndpoints";
import {
  setProduct,
  setProductStart,
} from "../../../../../../../../../ReaduxToolkit/Reducer/InventoryProductSlice";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  selectedProduct: any;
}

const UpdateProduct: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible,
  selectedProduct,
}) => {
  const dispatch = useDispatch();
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  console.log("selectedProduct",selectedProduct);
  

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      name: selectedProduct.name,
      productType: selectedProduct.productType,
      measurementUnit: selectedProduct.measurementUnit,
    },
  });

  useEffect(() => {
    reset({
      name: selectedProduct.name,
      productType: selectedProduct.productType,
      measurementUnit: selectedProduct.measurementUnit,
    });
  }, [selectedProduct, reset]);

  const productType = useSelector(
    (state: any) => state.inventoryProduct.productType || []
  );
  const units = useSelector((state: any) => state.inventoryProduct.units || []);

  const [productTypeList, setProductTypeList] = useState<any[]>([]);
  const [productTypeId, setProductTypeId] = useState(
    selectedProduct.productType
  );
  const [unitsList, setUnitsList] = useState<any[]>([]);
  const [measurementUnit, setMeasurementUnit] = useState(selectedProduct.measurementUnit);

  useEffect(() => {
    const tempList = productType.map((item: any) => ({
      value: `${item.value}`,
      label: `${item.title}`,
    }));
    setProductTypeList(tempList);
  }, [productType]);

  useEffect(() => {
    const tempList = units.map((item: any) => ({
      label: `${item.title}`,
      value: `${item.symbol}`,
    }));
    setUnitsList(tempList);
  }, [units]);

  const updateProduct: SubmitHandler<any> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const vendor = {
        name: data.name,
        productType: productTypeId,
        measurementUnit: measurementUnit,
      };
      try {
        const response: any = await update(vendor, {
          url: `${UPDATE_PRODUCT}/${selectedProduct.id}`,
        });
        if (response.success) {
          
          dispatch(setProductStart());
          const products: any = await getAll({ url: GET_ALL_PRODUCTS });
          console.log("products->",products);
          
          if (products.success) {
            dispatch(setProduct(products.data));
          }
          Swal.fire({
            text: "Product updated successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
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

  return (
    <Modal
      isOpen={isVisible}
      toggle={() => setIsVisible(!isVisible)}
      size="md"
      centered
    >
      <div className="modal-header">
        <H4 className="modal-title">Update Product</H4>
        <Button
          color="transparent"
          className="btn-close"
          onClick={() => setIsVisible(!isVisible)}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(updateProduct)}
        >
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Product Type</P>
              <Select
                value={productTypeId !== "" ? productTypeId : null}
                showSearch
                style={{ width: "100%", height: 36 }}
                placeholder="Select Product Type"
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onChange={(e) => setProductTypeId(e)}
                options={productTypeList}
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Units</P>
              <Select
                value={measurementUnit !== "" ? measurementUnit : null}
                showSearch
                style={{ width: "100%", height: 36 }}
                placeholder="Select Unit"
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onChange={(e) => setMeasurementUnit(e)}
                options={unitsList}
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Product Name</P>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Product Name Here..."
                {...register("name", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.name && "Product name is required"}
              </span>
            </FormGroup>
          </Row>
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Save`}
          </Button>
          &nbsp;&nbsp;
          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={() => setIsVisible(false)}
          >
            {Cancel}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateProduct;
