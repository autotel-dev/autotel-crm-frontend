import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
// import { Cancel } from "../../../utils/Constant";
import { CheckCircle } from "react-feather";
import { H3, H4, P } from "../../../../../../../../AbstractElements";
import { create, getAll } from "../../../../../../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
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

const CreateNewStockAdjustment = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  //   useEffect(() => {
  //     // Fetch product types from API
  //     // const fetchProductTypes = async () => {
  //     //   try {
  //     //     const response = await getAll({ url: GET_PRODUCT_TYPES });
  //     //     if (response.success) {
  //     //       setProductTypes(response.data);
  //     //     } else {
  //     //       Swal.fire({
  //     //         text: `${response.message}`,
  //     //         icon: "error",
  //     //         timer: 2000,
  //     //         showConfirmButton: false,
  //     //       });
  //     //     }
  //     //   } catch (error) {
  //     //     Swal.fire({
  //     //       text: "Failed to fetch product types",
  //     //       icon: "error",
  //     //       timer: 2000,
  //     //       showConfirmButton: false,
  //     //     });
  //     //   }
  //     // };

  //     fetchProductTypes();
  //   }, []);

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
            Create New Stock Adjustment Type
          </span>
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Stock Adjustment Type</H4>
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
                  <P>Stock Adjustment Type Name</P>
                  <input
                    className="form-control"
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && "Stock Adjustment name is required"}
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

export default CreateNewStockAdjustment;
