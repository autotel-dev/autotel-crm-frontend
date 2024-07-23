import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState, useEffect } from "react";
import { Select } from "antd"; // Use your custom Select component
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
// import { Cancel } from "../../../utils/Constant";
import { CheckCircle } from "react-feather";
import { H3, H4, P } from "../../../../../../../../AbstractElements";
import { create, getAll } from "../../../../../../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import AddSerialNo from "./AddSerialNo";
import { Cancel } from "../../../../../../../../utils/Constant";
import {
  setCurrenciesStart,
  setCurrenciesEnd,
  setCurrencies,
  setFilterCurrencies,
  setInActiveActiveCurrencies,
} from "../../../../../../../../ReaduxToolkit/Reducer/CurrencySlice";
import Swal from "sweetalert2";
import {
  CREATE_CURRENCY,
  GET_ALL_CURRENCIES,
  //  GET_PRODUCT_TYPES
} from "../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../Utilities/constants/constants";
import { ProductType } from "./Type/ProductType";
import { MdOutlineMinorCrash } from "react-icons/md";

const CreateNewStockAdjustmentModal = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addSerialModalOpen, setAddSerialModalOPen] = useState(false);
  const [productTypes, setProductTypes] = useState([]); // State to hold product types
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
        // productType: ""  Reset the product type field
      });
    }
  };

  const addCurrency: SubmitHandler<ProductType> = async (data: any) => {
    setLoading(true);
    if (data.name !== "" && data.productType !== "") {
      // Include productType in the validation
      const currency = {
        name: data.name,
        symbol: data.symbol,
        productType: data.productType, // Include productType in the payload
      };
      try {
        await create(currency, { url: CREATE_CURRENCY }).then((data: any) => {
          if (data !== undefined) {
            if (!data.success && data.message === ERROR_MESSAGE) {
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",

                //   productType: ""
              });
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
                //   productType: ""
              });
            }
            if (data.success) {
              setLoading(false);
              setAddModal(false);
              reset({
                name: "",
                //   productType: ""
              });
              dispatch(setCurrenciesStart());
              getAll({ url: GET_ALL_CURRENCIES }).then((data: any) => {
                if (data == undefined) {
                  Swal.fire({
                    text: "Failed to fetch due to connection refused",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  dispatch(setInActiveActiveCurrencies("All"));
                  dispatch(setCurrencies([]));
                  dispatch(setFilterCurrencies([]));
                  dispatch(setCurrenciesEnd());
                  return;
                }
                dispatch(setCurrenciesEnd());
                if (data !== undefined) {
                  if (data.success) {
                    dispatch(setCurrencies(data.data));
                    dispatch(setFilterCurrencies(data.data));
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
          //   productType: ""
        });
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
            backgroundColor: `${
              userPersonalizationData !== null &&
              userPersonalizationData?.buttonsAndBarsColor
            }`,
          }}
          onClick={addToggle}
        >
          {" "}
          <span style={{ display: "flex", alignItems: "center" }}>
            <PlusCircle
              size={18}
              style={{
                marginRight: "5px",
              }}
            />
            Create New Stock Adjustment
          </span>
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Stock Adjustment</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addCurrency)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Stock Adjustment Type</P>
                  <Select
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select Type"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.P ?? "").includes(input)
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.P ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.P ?? "").toLowerCase())
                    }
                    // onChange={(e: any) => {
                    //   // console.log(e);
                    //   setType(e);
                    // }}
                    // options={branchesList}
                  />
                </FormGroup>
              </Row>
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Product</P>
                  <Select
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select Product"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.P ?? "").includes(input)
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.P ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.P ?? "").toLowerCase())
                    }
                    // onChange={(e: any) => {
                    //   // console.log(e);
                    //   setType(e);
                    // }}
                    // options={branchesList}
                  />
                </FormGroup>
              </Row>
             
              <Row>
                <P>Quantity</P>
                <FormGroup
                  className="col-md-12 create-group"
                  style={{ display: "flex" }}
                >
                  <div style={{ width: "85%", paddingRight: "10px" }}>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Quantity Here..."
                      // {...register("comments")}
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      className={`btn ${
                        userPersonalizationData?.buttonsAndBarsColor == null
                          ? "btn-primary"
                          : ""
                      }`}
                      style={{
                        color: "white",
                        marginTop: "0px",
                        backgroundColor: `${
                          userPersonalizationData !== null &&
                          userPersonalizationData?.buttonsAndBarsColor
                        }`,
                      }}
                      onClick={() => {
                        setAddSerialModalOPen(true);
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "1px",
                        }}
                      >
                        <MdOutlineMinorCrash size={20} />
                      </span>
                    </button>
                  </div>
                </FormGroup>
              </Row>
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Comments</P>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Comments Here.."
                    // {...register("comments")}
                  />
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
        {addSerialModalOpen && (
          <AddSerialNo
            addSerialModalOpen={addSerialModalOpen}
            setAddSerialModalOPen={setAddSerialModalOPen}
          />
        )}
      </div>
    </Col>
  );
};

export default CreateNewStockAdjustmentModal;
