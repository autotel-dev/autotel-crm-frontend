import React, { useCallback, useEffect, useState } from "react";
import { Col, Button, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import { getAll } from "../../../../../../../../../../Utilities/api";
import {
  GET_ALL_INVENTORY_ITEMS,
  GET_ALL_PRODUCTS_BY_TYPE,
  GET_ALL_SINGLE_INVENTORY_ITEM,
} from "../../../../../../../../../../Utilities/api/apiEndpoints";
import { H4, P } from "../../../../../../../../../../AbstractElements";
import debounce from "lodash.debounce";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: any;
  newInventories: any;
  setNewInventories: any;
}

const AddInventoryItemModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible,
  newInventories,
  setNewInventories,
}) => {
  const [listProducts, setListProducts] = useState([]);
  const [type, setType] = useState("");
  const [product, setProduct] = useState("");
  const [item, setItem]: any = useState(null);
  const [productsLoading, setProductLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);

  const addToggle = () => {
    setIsVisible(!isVisible);
  };

  const fetchProductsByType = async (productType: string) => {
    setProductLoading(true);
    setProduct("");

    const allProductsByTypeData: any = await getAll({
      url: `${GET_ALL_PRODUCTS_BY_TYPE}?productType=${productType}`,
    });

    if (allProductsByTypeData.success) {
      // // console.log("allProductsByTypeData.data", allProductsByTypeData.data);
      const tempList: any = [];
      allProductsByTypeData.data.map((item: any, index: any) => {
        tempList.push({
          value: `${item?._id}`,
          label: `${item?.name}`,
          productType: `${item.productType}`,
        });
      });
      setListProducts(tempList);
      setProductLoading(false);
    } else {
      setListProducts([]);
      setProductLoading(false);
    }
  };

  const [inventoryList, setInventoryList] = useState([]);

  const fetchInventoryitems = async (searchString: string, product: string) => {
    const allInventoryitemsData: any = await getAll({
      url: `${GET_ALL_INVENTORY_ITEMS}?serialNo=${searchString}&productId=${product}`,
    });

    if (allInventoryitemsData?.success) {
      setInventoryList(
        allInventoryitemsData?.data?.inventoryItems.map((item: any) => ({
          value: item?._id,
          label: item?.serialNumber, // Use label for displaying the text in the dropdown
          id: item._id,
          sku: item.sku,
          product: item.productName,
          type: item.productType,
        }))
      );
    } else {
      setInventoryList([]);
    }
  };

  const debouncedFetchInventoryItems = useCallback(
    debounce((searchString: string, product: string) => {
      fetchInventoryitems(searchString, product);
    }, 200), // Debounce delay (300ms)
    []
  );

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Inventory</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody style={{ overflow: "hidden" }}>
            <div style={{ margin: "10px 0px" }}>
              <P> Select Type</P>
              <Select
                showSearch
                style={{ width: "100%", height: 36, marginBottom: "10px" }}
                placeholder={`Select Type`}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={async (value: any, options: any) => {
                  setType(value);
                  fetchProductsByType(value);
                }}
                options={[
                  {
                    label: "Devices",
                    value: "DEVICES",
                  },
                  {
                    label: "Sim",
                    value: "SIM",
                  },
                  {
                    label: "Sensors",
                    value: "SENSORS",
                  },
                  {
                    label: "Accessories",
                    value: "ACCESSORIES",
                  },
                ]}
                value={type !== "" ? type : null}
              />
            </div>

            {type !== "" && (
              <div style={{ margin: "10px 00px" }}>
                {productsLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Loading...
                  </div>
                ) : (
                  <div>
                    <P> Select Product</P>
                    <Select
                      showSearch
                      style={{
                        width: "100%",
                        height: 36,
                        marginBottom: "10px",
                      }}
                      placeholder={`Select Product`}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={async (value: any, options: any) => {
                        setInventoryList([]);
                        setProduct(value);
                        // console.log("value,kl", value);
                      }}
                      options={listProducts}
                      value={product !== "" ? product : null}
                    />
                  </div>
                )}
              </div>
            )}

            {product !== "" && (
              <div style={{ margin: "10px 00px" }}>
                <div>
                  <P> Select Item</P>
                  <Select
                    value={item?._id !== "" ? item?._id : null}
                    showSearch
                    onSearch={(value) => {
                      debouncedFetchInventoryItems(value, product);
                    }}
                    style={{ width: "100%", height: 36 }}
                    placeholder={"Select Item"}
                    optionFilterProp="label"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onChange={async (e) => {
                      const singleInventoryitemData: any = await getAll({
                        url: `${GET_ALL_SINGLE_INVENTORY_ITEM}/${e}`,
                      });

                      if (singleInventoryitemData?.success) {
                        setItem(singleInventoryitemData?.data);
                        setNewInventories([
                          ...newInventories,
                          singleInventoryitemData?.data,
                        ]);
                      }
                    }}
                    options={inventoryList}
                  />
                </div>
              </div>
            )}

            <Row className="g-3">
              <Col
                xs={12}
                className="text-end d-flex justify-content-end gap-2 align-center"
                style={{ marginTop: "20px" }}
              >
                <Button
                  color="primary"
                  onClick={() => {
                    addToggle();
                  }}
                >
                  Done
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default AddInventoryItemModal;
