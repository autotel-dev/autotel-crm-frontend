import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PlusCircle } from "react-feather";
import StickyBar from "./components/StickyBar/StickyBar";

import {
  setProduct,
  setIsConnected,
} from "../../../../../../ReaduxToolkit/Reducer/InventoryProductSlice";
import {
  GET_ALL_PRODUCTS,
  GET_ALL_STOCK_ADJUSTMENT,
  GET_ALL_STOCK_ADJUSTMENT_TYPES,
  GET_ALL_STOCK_MOVEMENT,
} from "../../../../../../Utilities/api/apiEndpoints";
import { getAll } from "../../../../../../Utilities/api";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { ERROR_MESSAGE } from "../../../../../../Utilities/constants/constants";
import { Outlet, useLocation } from "react-router-dom";
import { setStockAdjustmentTypes } from "../../../../../../ReaduxToolkit/Reducer/StockAdjustmentTypeSlice";
import { setStockMovements } from "../../../../../../ReaduxToolkit/Reducer/StockMovementSlice";
import { setStockAdjustments } from "../../../../../../ReaduxToolkit/Reducer/StockAdjustementSlice";

const Inventory = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const location = useLocation(); // Access current route information
  const [component, setComponent] = useState("Products");

  useEffect(() => {
    console.log(location.pathname.split("/"));
    const arr = location.pathname.split("/");
    // const route = arr[arr.length - 1];

    if (arr.includes("products")) {
      setComponent("Products");
    } else if (arr.includes("stock-movement")) {
      setComponent("Stock Movements");
    } else if (arr.includes("stock-adjustment-type")) {
      setComponent("Stock Adjustment Types");
    } else if (arr.includes("stock-adjustment")) {
      setComponent("Stock Adjustments");
    }
  }, [location.pathname]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setProduct([]));
    getAll({ url: GET_ALL_PRODUCTS }).then((data: any) => {
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
          // dispatch(setIsConnected(true));
        }
        if (!data.success) {
          // Swal.fire({
          //   text: `${data.message}`,
          //   icon: "error",
          //   timer: 2000,
          //   showConfirmButton: false,
          // });
        }
        if (data.success) {
          // // console.log("hhg");
          dispatch(setProduct(data.data));
        }
      }
    });
  }, []);

  useEffect(() => {
    dispatch(setStockAdjustmentTypes([]));
    getAll({ url: GET_ALL_STOCK_ADJUSTMENT_TYPES }).then((data: any) => {
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
          // dispatch(setIsConnected(true));
        }

        if (data.success) {
          // // console.log("hhg");
          dispatch(setStockAdjustmentTypes(data.data));
        }
      }
    });
  }, []);

  useEffect(() => {
    dispatch(setStockMovements([]));
    getAll({ url: GET_ALL_STOCK_MOVEMENT }).then((data: any) => {
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
          // dispatch(setIsConnected(true));
        }
        if (data.success) {
          // // console.log("hhg");
          dispatch(setStockMovements(data.data));
        }
      }
    });
  }, []);

  useEffect(() => {
    dispatch(setStockAdjustments([]));
    getAll({ url: GET_ALL_STOCK_ADJUSTMENT }).then((data: any) => {
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
          // dispatch(setIsConnected(true));
        }
        if (data.success) {
          // // console.log("hhg");
          dispatch(setStockAdjustments(data.data));
        }
      }
    });
  }, []);

  return (
    <div>
      <StickyBar component={component} setComponent={setComponent} />
      <div
        style={{
          margin: "-10px 30px 0px 15px",
        }}
      >
        <Breadcrumbs
          mainTitle={component}
          parent="SAIO Central"
          title={component}
        />
      </div>
      <Container fluid>
        <Row
          style={{
            width: "100%",
          }}
        >
          <Col sm={12}>
            <Card>
              <CardBody>
                <Outlet />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* {
                component == "Products" ? (
                    <Container fluid>
                        <Row
                            style={{
                                width: "100%",
                            }}
                        >
                            <Col sm={12}>
                                <Card>
                                    <CardBody>
                                        <ProductsTable />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                ) : component == "Stock Adjustment types" ? (
                    <Container fluid>
                        <Row
                            style={{
                                width: "100%",
                            }}
                        >
                            <Col sm={12}>
                                <Card>
                                    <CardBody>
                                        <StockAdjustmentTypesList />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                ) : component == "Stock Movement" ? (
                    <Container fluid>
                        <Row
                            style={{
                                width: "100%",
                            }}
                        >
                            <Col sm={12}>
                                <Card>
                                    <CardBody>
                                        <StockMovementTable />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                ) : (
                    <Container fluid>
                        <Row
                            style={{
                                width: "100%",
                            }}
                        >
                            <Col sm={12}>
                                <Card>
                                    <CardBody>
                                        <StockAdjustmentTable />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                )

                // <CreateNewSaleLead />
            } */}
    </div>
  );
};

export default Inventory;
