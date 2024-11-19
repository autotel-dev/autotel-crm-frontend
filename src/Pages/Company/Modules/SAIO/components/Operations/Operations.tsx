import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { Outlet } from "react-router-dom";
import StickyBar from "./components/StickyBar/StickyBar";
import { getAll } from "../../../../../../Utilities/api";
import {
  GET_ALL_ACTIVITIES,
  GET_ALL_COMPANY_INSTALLERS,
  GET_ALL_CUSTOMERS,
  GET_ALL_STOCK_ADJUSTMENT_TYPES,
} from "../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../Utilities/constants/constants";
import { setStockAdjustmentTypes } from "../../../../../../ReaduxToolkit/Reducer/StockAdjustmentTypeSlice";
import {
  setCustomers,
  setInstallers,
} from "../../../../../../ReaduxToolkit/Reducer/OperationActivitySlice";

const Operations = () => {
  const [component, setComponent] = useState("Activity");
  const dispatch = useDispatch();

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
    dispatch(setCustomers([]));
    getAll({ url: GET_ALL_CUSTOMERS }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          // // console.log("hhg");
          dispatch(setCustomers(data.data));
        }
      }
    });
  }, []);

  useEffect(() => {
    dispatch(setInstallers([]));
    getAll({ url: GET_ALL_COMPANY_INSTALLERS }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          dispatch(setInstallers(data.data));
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
    </div>
  );
};

export default Operations;
