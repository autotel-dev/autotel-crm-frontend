import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StickyBar from "./components/StickyBar/StickyBar";

import { useDispatch } from "react-redux";
import { getAll } from "../../../../../../Utilities/api";
import { GET_ALL_VENDORS } from "../../../../../../Utilities/api/apiEndpoints";

import { setVendors } from "../../../../../../ReaduxToolkit/Reducer/PurchaseInvoiceSlice";
import { Outlet, useLocation } from "react-router-dom";

const Purchases = () => {
  const location = useLocation(); // Access current route information
  const [component, setComponent] = useState("Vendors");
  useEffect(() => {
    console.log(location.pathname.split("/"));
    const arr = location.pathname.split("/");
    const route = arr[arr.length - 1];

    if (arr.includes("vendors")) {
      setComponent("Vendors");
    } else if (arr.includes("invoice-detail")) {
      setComponent("Purchase Invoice Detail");
    } else if (arr.includes("purchase-invoices")) {
      setComponent("Purchase Invoices");
    } else if (arr.includes("make-payments")) {
      setComponent("Make Payments");
    }
  }, [location.pathname]);

  const { purchaseInvoices, vendors } = useSelector(
    (state: any) => state.purchaseInvoice
  );
  const { vendor } = useSelector((state: any) => state.vendor);
  const dispatch = useDispatch();

  // useEffect(() => {
  //     dispatch(setPurchaseInvoices([]));
  //     getAll({ url: GET_ALL_PURCHASE_INVOICES }).then((data: any) => {

  //         if (data !== undefined) {
  //             if (!data.success) {

  //             }
  //             if (data.success) {
  //                 // // console.log("hhg");
  //                 dispatch(setPurchaseInvoices(data.data));
  //             }
  //         }
  //     });
  // }, []);
  useEffect(() => {
    dispatch(setVendors([]));
    getAll({ url: GET_ALL_VENDORS }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          // // console.log("hhg");
          dispatch(setVendors(data.data));
        }
      }
    });
  }, []);

  // useEffect(() => {
  //     // Fetch vendors from API
  //     dispatch(setVendor([]));
  //     getAll({ url: GET_ALL_VENDORS }).then((data: any) => {
  //         if (data?.success) {
  //             dispatch(setVendor(data.data));
  //         }
  //     });
  // }, []);

  // useEffect(() => {
  //     // Whenever saleLeads is updated, this effect will trigger
  //     if (purchaseInvoices && purchaseInvoices.length > 0) {
  //         dispatch(setPurchaseInvoices(purchaseInvoices)); // Update Redux store with the latest saleLeads
  //     }
  //     // Dependency array with saleLeads to watch for changes
  // }, [purchaseInvoices]);

  useEffect(() => {
    // Whenever saleLeads is updated, this effect will trigger
    if (vendors && vendors.length > 0) {
      dispatch(setVendors(vendors)); // Update Redux store with the latest saleLeads
    }
    // Dependency array with saleLeads to watch for changes
  }, [vendors]);

  // useEffect(() => {
  //     // Whenever saleLeads is updated, this effect will trigger
  //     if (vendor && vendor.length > 0) {
  //         dispatch(setVendor(vendor)); // Update Redux store with the latest saleLeads
  //     }
  //     // Dependency array with saleLeads to watch for changes
  // }, [vendor]);

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

export default Purchases;
