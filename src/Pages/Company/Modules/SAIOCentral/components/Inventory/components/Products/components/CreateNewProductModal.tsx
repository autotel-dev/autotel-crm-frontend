import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { CheckCircle } from "react-feather";
import { H3, H4, P } from "../../../../../../../../../AbstractElements";
import { Select } from "antd"; // Use your custom Select component
import { create, getAll } from "../../../../../../../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import { Cancel } from "../../../../../../../../../utils/Constant";
import {
  setProductTypeId,
  setId,
  setProduct,
  setProductEnd,
  setProductStart,
  setFilterProduct,
  setInActiveActiveProduct
} from "../../../../../../../../../ReaduxToolkit/Reducer/InventoryProductSlice";
import Swal from "sweetalert2";
import {
  CREATE_PRODUCT,
  GET_ALL_PRODUCTS,
} from "../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../Utilities/constants/constants";
import { ProductType } from "../Type/ProductType";

const CreateNewProductModal = () => {
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
  } = useForm<ProductType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        name: "",
      });
    }
  };

  const productType = useSelector((state: any) => state.inventoryProduct.productType || []);
  const units = useSelector((state: any) => state.inventoryProduct.units || []);

  const [productTypeList, setProductTypeList] = useState<any[]>([]);
  const [productTypeId, setProductTypeId] = useState("");
  const [unitsList, setUnitsList] = useState<any[]>([]);
  const [unitSymbol, setunitSymbol] = useState("");

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

  const addProduct: SubmitHandler<ProductType> = async (data) => {
    setLoading(true);
    if (data.name !== "" && productTypeId !== null && unitSymbol !== null) {
      const product = {
        name: data.name,
        productType: productTypeId,
        measurementUnit: unitSymbol,
      };
      try {
        await create(product, { url: CREATE_PRODUCT }).then((data: any) => {
          if (data !== undefined) {
            if (!data.success && data.message === ERROR_MESSAGE) {
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
              });
              setProductTypeId("");
              setunitSymbol("");
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
              });
              setProductTypeId("");
              setunitSymbol("");
            }

            if (data.success) {
              setProductTypeId("");
              setunitSymbol("");
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
              });
              dispatch(setProductStart());
              getAll({ url: GET_ALL_PRODUCTS }).then((data: any) => {
                if (data === undefined) {
                  Swal.fire({
                    text: "Failed to fetch due to connection refused",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  dispatch(setInActiveActiveProduct("All"));
                  dispatch(setProductEnd());
                  dispatch(setProduct([]));
                  dispatch(setFilterProduct([]));
                  return;
                }
                dispatch(setProductEnd());
                if (data !== undefined) {
                  if (data.success) {
                    dispatch(setProduct(data.data));
                    dispatch(setFilterProduct(data.data));
                  }
                }
              });
            }
          }
        });
      } catch (error: any) {
        setLoading(false);
        setAddModal(false);
        reset({
          name: "",
        });
        setProductTypeId("");
        setunitSymbol("");
      }
    } else {
      Swal.fire({
        text: "Please Select all the fields",
        icon: "info",
        timer: 2000,
        showConfirmButton: true,
      });
      setLoading(false);
    }
  };

  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null
              ? "btn-primary"
              : ""
            }`}
          style={{
            color: "white",
            backgroundColor: `${userPersonalizationData?.buttonsAndBarsColor || ""
              }`,
          }}
          onClick={addToggle}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <PlusCircle
              size={18}
              style={{
                marginRight: "5px",
              }}
            />
            Create New Product
          </span>
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Product</H4>
            <Button
              color="transparent"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addProduct)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Product Type</P>
                  <Select
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select Product Type"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
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
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select Unit"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    onChange={(e) => setunitSymbol(e)}
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
                {loading ? "Loading ..." : `Create`}
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

export default CreateNewProductModal;
