import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Modal, ModalBody, Row } from "reactstrap";
import { H4, P } from "../../../../../../../../AbstractElements";
import Swal from "sweetalert2";
import { Select } from "antd"; // Use your custom Select component
import { useDispatch, useSelector } from "react-redux";
import { Cancel } from "../../../../../../../../utils/Constant";
import { create, getAll } from "../../../../../../../../Utilities/api";
import {

  CREATE_NEW_STOCK_ADJUSTMENT,
  CREATE_NEW_STOCK_MOVEMENT,
  GET_ALL_STOCK_ADJUSTMENT,
  GET_ALL_STOCK_MOVEMENT,
} from "../../../../../../../../Utilities/api/apiEndpoints";
import { MdOutlineMinorCrash } from "react-icons/md";
import { ERROR_MESSAGE } from "../../../../../../../../Utilities/constants/constants";
import AddSerialNumbersModel from "./AddSerialNumbersModal";
import { setStockAdjustments } from "../../../../../../../../ReaduxToolkit/Reducer/StockAdjustementSlice";


const CreateNewStockAdjustmentModal = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { stockAdjustmentTypes, products } = useSelector((state: any) => state.stockAdjustment);


  const dispatch = useDispatch();
  const [product, setProduct] = useState("")
  const [adjustmentType, setAdjustmentType] = useState("")
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [addSerialModalOpen, setAddSerialModalOPen] = useState(false);
  const [type, setType] = useState("");
  const [items, setItems] = useState([]);
  const [notAvailableSerialsOrSkus, setnotAvailableSerialsOrSkus]: any = useState([])
  const [quantity, setQuantity] = useState("")
  const [comments, setComments] = useState("")


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
    }
  };


  const addStockAdjustment: SubmitHandler<any> = async (data: any) => {
    setLoading(true);
    if (quantity !== "" && adjustmentType !== "" && product !== "") {
      var formData: any;
      // if (type == "BRANCH_TO_BRANCH") {
      formData = {
        type: adjustmentType,
        product: product,
        quantity: quantity,
        items: [...items.map((item: any) => item.id)],
        comments: comments
      };

      try {
        await create(formData, { url: CREATE_NEW_STOCK_ADJUSTMENT }).then(
          (data: any) => {
            if (data !== undefined) {
              if (
                !data.success &&
                data.message === ERROR_MESSAGE
              ) {
                setLoading(false);
                setAddModal(false);
                reset({
                  quantity: "",
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
                setItems([]);
                setnotAvailableSerialsOrSkus([]);
                setComments("");
                setQuantity("");
                setProduct("");
                setAdjustmentType("")
              }
              if (data.success) {
                // console.log(data);
                setLoading(false);
                setAddModal(false);

                setItems([]);
                setnotAvailableSerialsOrSkus([]);
                setComments("");
                setQuantity("");
                setProduct("");
                setAdjustmentType("")


                getAll({ url: GET_ALL_STOCK_ADJUSTMENT }).then(
                  (data: any) => {
                    // console.log("api call --- >", data);
                    if (data == undefined) {
                      Swal.fire({
                        text: "Failed to fetch due to connection refused",
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                      dispatch(setStockAdjustments([]));
                      return;
                    }
                    if (data !== undefined) {
                      if (data.success) {
                        // console.log("hhg");
                        dispatch(setStockAdjustments(data.data));
                      }
                    }
                  }
                );
              }
            }
          }
        );
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        setLoading(false);
        setAddModal(false);

        setItems([]);
        setnotAvailableSerialsOrSkus([]);
        setComments("");
        setQuantity("");
        setProduct("");
        setAdjustmentType("")
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
          className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null
            ? "btn-primary"
            : ""
            }`}
          style={{
            color: "white",
            backgroundColor: `${userPersonalizationData !== null &&
              userPersonalizationData?.buttonsAndBarsColor
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
            Create New Stock Adjustment
          </span>
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">Create New Stock Adjustment</H4>
            <Button
              color="transparent"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addStockAdjustment)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Select Adjustment Type</P>
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
                    onChange={(e: any) => {
                      // console.log(e);
                      setAdjustmentType(e);
                    }}
                    options={[...stockAdjustmentTypes.map((item: any, index: any) => {
                      return {
                        value: item?._id,
                        label: item?.name
                      }
                    })]}
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
                    onChange={(e: any) => {
                      // console.log(e);
                      setProduct(e);
                    }}
                    options={[...products.map((item: any, index: any) => {
                      return {
                        value: item?._id,
                        label: item?.name
                      }
                    })]}
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
                      onChange={(e) => setQuantity(e.target.value)}
                    // {...register("quantity", { required: true })}
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null
                        ? "btn-primary"
                        : ""
                        }`}
                      style={{
                        color: "white",
                        marginTop: "0px",
                        backgroundColor: `${userPersonalizationData !== null &&
                          userPersonalizationData?.buttonsAndBarsColor
                          }`,
                      }}
                      onClick={() => {
                        setItems([]);
                        setnotAvailableSerialsOrSkus([])
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
                    placeholder="Enter Comments Here..."
                    onChange={(e) => setComments(e.target.value)}
                  />
                </FormGroup>
              </Row>
              <Button color="primary" className="me-1">
                {loading ? "Loading ..." : `Save`}
              </Button>
              &nbsp;&nbsp;
              <Button disabled={loading} color="secondary" onClick={addToggle}>
                {Cancel}
              </Button>
            </form>
          </ModalBody>
        </Modal>
        {addSerialModalOpen && (
          <AddSerialNumbersModel
            isVisible={addSerialModalOpen}
            setIsVisible={setAddSerialModalOPen}
            product={product}
            quantity={quantity}
            items={items}
            setItems={setItems}
            notAvailableSerialsOrSkus={notAvailableSerialsOrSkus}
            setnotAvailableSerialsOrSkus={setnotAvailableSerialsOrSkus}
          />
        )}
      </div>
    </Col>
  );
};

export default CreateNewStockAdjustmentModal;
