import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PlusCircle } from "react-feather";
import StickyBar from "./components/StickyBar/StickyBar";
import ProductsTable from "./components/Products/ProductsList";
import StockMovementTable from "./components/StockMovement/StockMovementList";
import StockAdjustmentTable from "./components/StockAdjustment/StockAdjustment";
import StockAdjustmentTypesList from "./components/StockAdjustmentTypes/StockAdjustmentTypesList";
import {
  setProduct,
  setIsConnected,
} from "../../../../../../ReaduxToolkit/Reducer/InventoryProductSlice";
import { GET_ALL_PRODUCTS } from "../../../../../../Utilities/api/apiEndpoints";
import { getAll } from "../../../../../../Utilities/api";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { ERROR_MESSAGE } from "../../../../../../Utilities/constants/constants";

const Inventory = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const [component, setComponent] = useState("Products");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setProduct([]));
    getAll({ url: GET_ALL_PRODUCTS }).then((data: any) => {
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setIsConnected(true));
        }
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          // // console.log("hhg");
          dispatch(setProduct(data.data.products));
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
      {
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
      }
    </div>
  );
};

export default Inventory;
