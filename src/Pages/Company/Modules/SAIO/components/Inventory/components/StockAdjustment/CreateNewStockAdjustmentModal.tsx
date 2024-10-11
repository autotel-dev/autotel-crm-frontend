import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Modal, ModalBody, Row } from "reactstrap";
import { H4, H5, P } from "../../../../../../../../AbstractElements";
import Swal from "sweetalert2";
import { Select } from "antd"; // Use your custom Select component
import { useDispatch, useSelector } from "react-redux";
import { Cancel } from "../../../../../../../../utils/Constant";
import { create, getAll } from "../../../../../../../../Utilities/api";
import {
  CREATE_NEW_STOCK_ADJUSTMENT,
  CREATE_NEW_STOCK_MOVEMENT,
  GET_ALL_INVENTORY_ITEMS_BY_PRODUCT_ID,
  GET_ALL_STOCK_ADJUSTMENT,
  GET_ALL_STOCK_MOVEMENT,
} from "../../../../../../../../Utilities/api/apiEndpoints";
import { MdOutlineMinorCrash } from "react-icons/md";
import { ERROR_MESSAGE } from "../../../../../../../../Utilities/constants/constants";
import AddSerialNumbersModel from "./AddSerialNumbersModal";
import { setStockAdjustments } from "../../../../../../../../ReaduxToolkit/Reducer/StockAdjustementSlice";
interface CreateNewStockAdjustmentModalProps {
  isVisible: any;
  setIsVisible: any;
}

const CreateNewStockAdjustmentModal: React.FC<
  CreateNewStockAdjustmentModalProps
> = ({ isVisible, setIsVisible }) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const {
    stockAdjustmentTypes,
    branches,
    warehouses,
    products,
    stockAdjustment,
  } = useSelector((state: any) => state.stockAdjustment);

  const dispatch = useDispatch();
  const [fromBranch, setFromBranch] = useState(
    stockAdjustment !== null
      ? stockAdjustment?.fromBranch?._id
      : branches.length > 0
      ? branches?.find((item: any) => item?.name == "Default")?._id
      : ""
  );
  const [fromWarehouse, setFromWarehouse] = useState(
    stockAdjustment !== null
      ? stockAdjustment?.fromWarehouse?._id
      : warehouses.length > 0
      ? warehouses?.find((item: any) => item?.name == "Default")?._id
      : ""
  );

  const [product, setProduct] = useState(
    stockAdjustment !== null ? stockAdjustment?.product?._id : ""
  );
  const [adjustmentType, setAdjustmentType] = useState(
    stockAdjustment !== null ? stockAdjustment?.type?._id : ""
  );
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [addSerialModalOpen, setAddSerialModalOPen] = useState(false);
  const [items, setItems] = useState(
    stockAdjustment !== null ? stockAdjustment?.items : []
  );
  const [notAvailableSerialsOrSkus, setnotAvailableSerialsOrSkus]: any =
    useState([]);
  const [quantity, setQuantity] = useState(
    stockAdjustment !== null ? stockAdjustment?.quantity : ""
  );
  const [comments, setComments] = useState(
    stockAdjustment !== null ? stockAdjustment?.comments : ""
  );

  const [inventoryItems, setInventoryItems]: any = useState(
    stockAdjustment !== null ? stockAdjustment?.items : []
  );
  const [inventoryLoading, setInventoryLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
      setInventoryItems([]);
      setAdjustmentType("");
      setFromBranch(
        branches.length > 0
          ? branches?.find((item: any) => item?.name == "Default")?._id
          : ""
      );
      setFromWarehouse(
        warehouses.length > 0
          ? warehouses?.find((item: any) => item?.name == "Default")?._id
          : ""
      );
    }
  };

  const addStockAdjustment: SubmitHandler<any> = async (data: any) => {
    setLoading(true);

    if (
      quantity !== "" &&
      fromWarehouse !== "" &&
      product !== "" &&
      ((inventoryItems.length > 0 &&
        inventoryItems[0]?.productType == "ACCESSORIES") ||
        items.length > 0)
    ) {
      var formData: any;
      formData = {
        type: adjustmentType,
        product: product,
        quantity: quantity,
        items:
          inventoryItems.length > 0 &&
          inventoryItems[0]?.productType == "ACCESSORIES"
            ? [
                ...inventoryItems
                  .map((item: any) => item?._id)
                  .reverse()
                  .slice(0, quantity),
              ]
            : [...items.map((item: any) => item.id)],
        comments: comments,
        vehicleId: null,
      };

      if (
        inventoryItems[0]?.productType !== "ACCESSORIES" &&
        items.length !== Number(quantity)
      ) {
        Swal.fire({
          text: "Number of Quantity is not matched with the number of Items",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
        return;
      }
      if (
        inventoryItems[0]?.productType == "ACCESSORIES" &&
        inventoryItems.length !== Number(quantity)
      ) {
        Swal.fire({
          text: "Number of Quantity is not matched with the number of Items",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
        return;
      }
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

                setFromBranch("");
                setFromWarehouse("");
                setProduct("");
                setComments("");
                setQuantity("");
                setItems([]);
                setnotAvailableSerialsOrSkus([]);
              }
              if (data.success) {
                // // console.log(data);

                getAll({ url: GET_ALL_STOCK_ADJUSTMENT }).then((data: any) => {
                  // // console.log("api call --- >", data);
                  if (data == undefined) {
                    setLoading(false);
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
                      setLoading(false);
                      // // console.log("hhg");
                      dispatch(setStockAdjustments(data.data));
                      addToggle();
                    }
                    if (!data.success) {
                      setLoading(false);
                      addToggle();
                    }
                  }
                  reset({
                    quantity: "",
                  });
                  setFromBranch("");
                  setFromWarehouse("");
                  setProduct("");
                  setItems([]);
                  setnotAvailableSerialsOrSkus([]);
                  setProduct("");
                  setComments("");
                  setQuantity("");
                });
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
        reset({
          quantity: "",
        });
        setFromBranch("");
        setFromWarehouse("");
        setProduct("");
        setItems([]);
        setnotAvailableSerialsOrSkus([]);
        setProduct("");
        setComments("");
        setQuantity("");
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
    <>
      <Modal isOpen={isVisible} toggle={addToggle} size="md" centered>
        <div className="modal-header">
          <H4 className="modal-title">
            {stockAdjustment !== null ? "View" : "Create New"} Stock Adjustment
          </H4>
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
              {stockAdjustment == null && (
                <FormGroup className="col-md-6 create-group">
                  <P>From Branch</P>
                  <Select
                    disabled={stockAdjustment !== null}
                    value={fromBranch}
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="From Branch"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.P ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.P ?? "").toLowerCase())
                    }
                    onChange={(e: any) => {
                      // // console.log(e);
                      setFromBranch(e);
                    }}
                    options={[
                      ...branches?.map((item: any, index: any) => {
                        return {
                          value: item?._id,
                          label: item?.name,
                        };
                      }),
                    ]}
                  />
                </FormGroup>
              )}
              {stockAdjustment == null && (
                <FormGroup className="col-md-6 create-group">
                  <P>From Warehouse</P>
                  <Select
                    disabled={stockAdjustment !== null}
                    showSearch
                    value={fromWarehouse}
                    style={{ width: "100%", height: 36 }}
                    placeholder="From Warehouse"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.P ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.P ?? "").toLowerCase())
                    }
                    onChange={(e: any) => {
                      setProduct("");
                      setFromWarehouse(e);
                    }}
                    options={[
                      ...warehouses?.map((item: any, index: any) => {
                        return {
                          value: item?._id,
                          label: item?.name,
                        };
                      }),
                    ]}
                  />
                </FormGroup>
              )}
              <FormGroup className="col-md-12 create-group">
                <P>Select Adjustment Type</P>
                <Select
                  disabled={stockAdjustment !== null}
                  showSearch
                  value={adjustmentType !== "" ? adjustmentType : null}
                  style={{ width: "100%", height: 36 }}
                  placeholder="Select Type"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  filterSort={(optionA: any, optionB: any) =>
                    (optionA?.P ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.P ?? "").toLowerCase())
                  }
                  onChange={(e: any) => {
                    // // console.log(e);
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
            </Row>
            {fromWarehouse !== "" && (
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Product</P>
                  <Select
                    disabled={stockAdjustment !== null}
                    value={product !== "" ? product : null}
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select Product"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.P ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.P ?? "").toLowerCase())
                    }
                    onChange={async (e: any) => {
                      setInventoryLoading(true);
                      setInventoryItems([]);
                      setQuantity("");

                      setProduct(e);
                      // // console.log(e);
                      const inventoryItems: any = await create(
                        {
                          productId: e,
                          warehouseId: fromWarehouse,
                        },
                        {
                          url: `${GET_ALL_INVENTORY_ITEMS_BY_PRODUCT_ID}`,
                        }
                      );

                      if (inventoryItems?.success) {
                        // console.log("inventoryItems", inventoryItems);
                        setInventoryItems(inventoryItems.data);
                        setInventoryLoading(false);
                      }
                      if (!inventoryItems?.success) {
                        setInventoryLoading(false);
                      }
                    }}
                    options={[
                      ...products.map((item: any, index: any) => {
                        return {
                          value: item?._id,
                          label: item?.name,
                        };
                      }),
                    ]}
                  />
                </FormGroup>
              </Row>
            )}
            {inventoryLoading && (
              <Row
                style={{
                  width: "100%",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <H5>Loading...</H5>
              </Row>
            )}
            {product !== "" && inventoryItems.length > 0 ? (
              <>
                <Row>
                  <P>Total Items</P>
                  <FormGroup
                    className="col-md-12 create-group"
                    style={{ display: "flex" }}
                  >
                    <input
                      className="form-control"
                      type="text"
                      value={inventoryItems.length}
                      placeholder="Enter Quantity Here..."
                      onChange={(e) => setQuantity(e.target.value)}
                      // {...register("quantity", { required: true })}
                      disabled
                    />
                  </FormGroup>
                </Row>
                <Row>
                  <P>Quantity</P>
                  <FormGroup
                    className="col-md-12 create-group"
                    style={{ display: "flex" }}
                  >
                    <div
                      style={{
                        width: `${
                          inventoryItems[0]?.productType !== "ACCESSORIES"
                            ? "85%"
                            : "100%"
                        }`,
                        paddingRight: "10px",
                      }}
                    >
                      <input
                        disabled={stockAdjustment !== null}
                        className="form-control"
                        type="text"
                        placeholder="Enter Quantity Here..."
                        value={quantity}
                        onChange={(e) => {
                          if (Number(e.target.value) <= inventoryItems.length) {
                            setQuantity(e.target.value);
                          }
                        }}
                        // {...register("quantity", { required: true })}
                      />
                    </div>

                    {stockAdjustment == null &&
                      inventoryItems[0]?.productType !== "ACCESSORIES" && (
                        <div>
                          <button
                            type="button"
                            className={`btn ${
                              userPersonalizationData?.buttonsAndBarsColor ==
                              null
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
                              // setItems([]);
                              // setnotAvailableSerialsOrSkus([])
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
                      )}

                    {stockAdjustment !== null &&
                      inventoryItems.length > 0 &&
                      inventoryItems[0]?.productType !== "ACCESSORIES" && (
                        <div>
                          <button
                            type="button"
                            className={`btn ${
                              userPersonalizationData?.buttonsAndBarsColor ==
                              null
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
                      )}
                  </FormGroup>
                </Row>

                <Row>
                  <FormGroup className="col-md-12 create-group">
                    <P>Comments</P>
                    <input
                      value={comments}
                      className="form-control"
                      type="text"
                      placeholder="Enter Comments Here..."
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </FormGroup>
                </Row>
              </>
            ) : (
              product !== "" &&
              fromWarehouse !== "" &&
              inventoryItems.length > 0 && (
                <Row>
                  <P>Total Items</P>
                  <FormGroup
                    className="col-md-12 create-group"
                    style={{ display: "flex" }}
                  >
                    <input
                      className="form-control"
                      type="text"
                      value={inventoryItems.length}
                      placeholder="Enter Quantity Here..."
                      onChange={(e) => setQuantity(e.target.value)}
                      // {...register("quantity", { required: true })}
                      disabled
                    />
                  </FormGroup>
                </Row>
              )
            )}
            {stockAdjustment == null && (
              <Button color="primary" className="me-1">
                {loading ? "Loading ..." : `Save`}
              </Button>
            )}
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
          inventoryItems={inventoryItems}
        />
      )}
    </>
  );
};

export default CreateNewStockAdjustmentModal;
