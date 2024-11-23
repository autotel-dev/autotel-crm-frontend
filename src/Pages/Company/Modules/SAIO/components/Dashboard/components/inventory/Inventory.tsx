import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import { H3, H4 } from "../../../../../../../../AbstractElements";
import ProductsTable from "./components/productsTable/ProductsTable";
import LowInventory from "./components/lowInventory/LowInventory";
import { useEffect } from "react";
import { getAll } from "../../../../../../../../Utilities/api";
import { GET_INVENTORY_STATISTICS } from "../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../Utilities/constants/constants";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  setInventoryActivitiesData,
  setInventoryActivitiesLoading,
} from "../../../../../../../../ReaduxToolkit/Reducer/SalesDashboardSlice";

const Inventory = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setInventoryActivitiesLoading(true));
    getAll({ url: GET_INVENTORY_STATISTICS }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setInventoryActivitiesData(null));
        }
        if (data.success) {
          dispatch(setInventoryActivitiesData(data.data.statistics));
        }
      }
    });
  }, []);
  return (
    <Row>
      <Col xxl="7" xl="7" lg="7" md="12">
        <Card className="invoice-card">
          <CardHeader className="pb-0">
            <H4>Products</H4>
          </CardHeader>
          <CardBody className="transaction-card">
            <ProductsTable />
          </CardBody>
        </Card>
      </Col>
      <Col xxl="5" xl="5" lg="5" md="12">
        <Card className="invoice-card">
          <CardHeader className="pb-0">
            <H4>Low Inventory</H4>
          </CardHeader>
          <CardBody className="transaction-card">
            <LowInventory />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Inventory;
