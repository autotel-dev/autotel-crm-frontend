import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import { H3, H4 } from "../../../../../../../../AbstractElements";
import PurchaseTable from "./components/purchaseTable/PurchaseTable";
import PurchaseSummary from "./components/purchaseSummary/PurchaseSummary";
import Swal from "sweetalert2";
import {
  setPurchaseSummaryData,
  setPurchaseSummaryLoading,
  setRecentPurchasesData,
  setRecentPurchasesLoading,
} from "../../../../../../../../ReaduxToolkit/Reducer/SalesDashboardSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAll } from "../../../../../../../../Utilities/api";
import {
  GET_LATEST_PURCHASE_INVOICE,
  GET_PURCHASE_SUMMARY,
} from "../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../Utilities/constants/constants";
import { useSelector } from "react-redux";
import Skeleton from "../../../../../../../Utilities/Skeleton/Skeleton";

const Purchases = () => {
  const { recentPurchasesLoading, purchaseSummaryLoading } = useSelector(
    (state: any) => state.salesDashboard
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setRecentPurchasesLoading(true));
    dispatch(setPurchaseSummaryLoading(true));

    getAll({ url: GET_LATEST_PURCHASE_INVOICE }).then((data: any) => {
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
          dispatch(setRecentPurchasesData(null));
        }
        if (data.success) {
          dispatch(setRecentPurchasesData(data.data));
        }
      }
    });
    getAll({ url: GET_PURCHASE_SUMMARY }).then((data: any) => {
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
          dispatch(setPurchaseSummaryData(null));
        }
        if (data.success) {
          dispatch(setPurchaseSummaryData(data.data));
        }
      }
    });
  }, []);
  return (
    <Row>
      {recentPurchasesLoading ? (
        <Col xxl="6" xl="6" lg="6" md="6" sm="6">
          <Skeleton
            height="280px"
            width="100%"
            marginTop="10px"
            marginBottom="25px"
            marginRight="20px"
            borderRadius="10px"
          />
        </Col>
      ) : (
        <Col xxl="6" xl="6" lg="6" md="12">
          <Card className="invoice-card">
            <CardHeader className="pb-0">
              <H4>Recent Purchases</H4>
            </CardHeader>
            <CardBody className="transaction-card">
              <PurchaseTable />
            </CardBody>
          </Card>
        </Col>
      )}
      {purchaseSummaryLoading ? (
        <Col xxl="6" xl="6" lg="6" md="6" sm="6">
          <Skeleton
            height="280px"
            width="100%"
            marginTop="10px"
            marginBottom="25px"
            marginRight="20px"
            borderRadius="10px"
          />
        </Col>
      ) : (
        <Col xxl="6" xl="6" lg="6" md="12">
          <Card>
            <CardHeader>
              <H4>Purchase Summary</H4>
            </CardHeader>
            <CardBody className="p-0">
              <PurchaseSummary />
            </CardBody>
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default Purchases;
