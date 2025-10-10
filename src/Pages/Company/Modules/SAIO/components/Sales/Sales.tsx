import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../../../CommonElements/Breadcrumbs/Breadcrumbs";

import { useEffect, useState } from "react";

import {
  GET_ALL_ACTIVE_CITIES,
  GET_ALL_ACTIVE_SERVICE_PACKAGES,
  GET_ALL_BANKS,
  GET_ALL_COMPANY_INSTALLERS,
  GET_ALL_CUSTOMERS,
  GET_ALL_GEFENCES_DROPDOWN,
  GET_ALL_INSURANCES,
  GET_ALL_SALE_GROUPS,
  GET_ALL_SERVICES,
  GET_ALL_VEHICLES_MAKE,
  GET_ALL_VEHICLES_MODEL,
  GET_USER_BY_ID,
} from "../../../../../../Utilities/api/apiEndpoints";
import { getAll } from "../../../../../../Utilities/api";
import {
  setCities,
  setCustomers,
  setPackages,
  setGeofences,
  setIsConnected,
  setBanks,
  setInsurances,
  setGroups,
  setVehicleMakes,
  setVehicleModels,
  setServices,
  setInstalledUser,
  setServers,
} from "../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import { useDispatch } from "react-redux";
import { ERROR_MESSAGE } from "../../../../../../Utilities/constants/constants";
import StickyBar from "./components/StickyBar/StickyBar";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Sales = () => {
  const location = useLocation(); // Access current route information
  const [component, setComponent] = useState("Sale Leads");

  useEffect(() => {
    // console.log(location.pathname.split("/"));
    const arr = location.pathname.split("/");
    const route = arr[arr.length - 1];

    if (arr.includes("leads")) {
      setComponent("Sale Leads");
    } else if (arr.includes("invoice-detail")) {
      setComponent("Sale Invoice Detail");
    } else if (arr.includes("invoices")) {
      setComponent("Sale Invoices");
    } else if (arr.includes("receive-money")) {
      setComponent("Receive Money");
    } else if (arr.includes("customers")) {
      setComponent("Customers");
    }
  }, [location.pathname]);

  const { customers, saleLeads } = useSelector((state: any) => state.sales);

  const dispatch = useDispatch();

  useEffect(() => {
    getAll({ url: GET_ALL_GEFENCES_DROPDOWN }).then((data: any) => {
      // // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // // console.log("hhg");
          dispatch(setGeofences(data.data));
        }
        if (!data.success) {
          // // console.log("hhg");
          dispatch(setGeofences([]));
        }
      }
    });
  }, []);

  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_SERVICE_PACKAGES }).then((data: any) => {
      // // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // // console.log("hhg");
          dispatch(setPackages(data.data));
        }
        if (!data.success) {
          // // console.log("hhg");
          dispatch(setPackages([]));
        }
      }
    });
  }, []);

  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_CITIES }).then((data: any) => {
      // // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // // console.log("hhg");
          dispatch(setCities(data.data));
        }
        if (!data.success) {
          // // console.log("hhg");
          dispatch(setCities([]));
        }
      }
    });
  }, []);

  useEffect(() => {
    getAll({ url: GET_ALL_BANKS }).then((data: any) => {
      // // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // // console.log("hhg");
          dispatch(setBanks(data.data));
        }
        if (!data.success) {
          // // console.log("hhg");
          dispatch(setBanks([]));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_INSURANCES }).then((data: any) => {
      // // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // // console.log("hhg");
          dispatch(setInsurances(data.data));
        }
        if (!data.success) {
          // // console.log("hhg");
          dispatch(setInsurances([]));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_SALE_GROUPS }).then((data: any) => {
      // // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // // console.log("hhg");
          dispatch(setGroups(data.data));
        }
        if (!data.success) {
          // // console.log("hhg");
          dispatch(setGroups([]));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_VEHICLES_MAKE }).then((data: any) => {
      // // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // // console.log("hhg");
          dispatch(setVehicleMakes(data.data));
        }
        if (!data.success) {
          // // console.log("hhg");
          dispatch(setVehicleMakes([]));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_VEHICLES_MODEL }).then((data: any) => {
      // // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // // console.log("hhg");
          dispatch(setVehicleModels(data.data));
        }
        if (!data.success) {
          // // console.log("hhg");
          dispatch(setVehicleModels([]));
        }
      }
    });
  }, []);

  useEffect(() => {
    dispatch(setCustomers([]));
    getAll({ url: GET_ALL_CUSTOMERS }).then((data: any) => {
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setIsConnected(true));
        }

        if (data.success) {
          // // // console.log("hhg");
          dispatch(setCustomers(data.data));
        }
      }
    });
  }, []);

  // useEffect(() => {
  //   dispatch(setSaleInvoices([]));
  //   getAll({ url: GET_ALL_SALE_INVOICES }).then((data: any) => {

  //     if (data !== undefined) {
  //       if (data.success) {
  //         dispatch(setSaleInvoices(data.data));
  //       }
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   dispatch(setSaleLeads([])); // Reset the saleLeads state initially

  //   getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {
  //     if (data !== undefined) {
  //       if (!data.success && data.message === ERROR_MESSAGE) {
  //         dispatch(setIsConnected(true));
  //       }
  //       if (!data.success) {
  //         Swal.fire({
  //           text: `${data.message}`,
  //           icon: "error",
  //           timer: 2000,
  //           showConfirmButton: false,
  //         });
  //       }
  //       if (data.success) {
  //         dispatch(setSaleLeads(data.data)); // Update saleLeads with fetched data
  //       }
  //     }
  //   });
  //   // Empty array to run this effect only once on mount
  // }, []);

  useEffect(() => {
    // Whenever saleLeads is updated, this effect will trigger
    if (customers && customers.length > 0) {
      dispatch(setCustomers(customers)); // Update Redux store with the latest saleLeads
    }
    // Dependency array with saleLeads to watch for changes
  }, [customers]);

  useEffect(() => {
    dispatch(setServices([]));
    getAll({ url: GET_ALL_SERVICES }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          // // // console.log("hhg");
          dispatch(setServices(data.data));
        }
      }
    });
  }, []);

  useEffect(() => {
    dispatch(setInstalledUser([]));
    getAll({ url: GET_ALL_COMPANY_INSTALLERS }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          dispatch(setInstalledUser(data.data));
        }
      }
    });
  }, []);

  useEffect(() => {
    dispatch(setServers([]));
    getAll({ url: GET_USER_BY_ID }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          dispatch(setServers(data.data.user.serverCredentials));
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

export default Sales;
