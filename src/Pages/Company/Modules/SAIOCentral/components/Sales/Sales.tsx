
import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import Breadcrumbs from '../../../../../../CommonElements/Breadcrumbs/Breadcrumbs'
import StickyBar from './components/StickyBar/StickyBar'
import { useEffect, useState } from 'react'
import SaleLeadsTable from './components/SaleLeads/SaleLeadsList'
import CreateNewSaleLead from './components/SaleLeads/CreateNewSaleLead/CreateNewSaleLead'
import { useSelector } from 'react-redux'
import { PlusCircle } from 'react-feather'
import InvoicesTable from './components/Invoices/InvoicesList'
import ReceiveMoneyTable from './components/ReceiveMoney/ReceiveMoneyList'
import CustomerTable from './components/Customer/CustomerList'
import CreateNewCustomer from './components/Customer/CreateNewCustomer/CreateNewCustomer'
import { GET_ALL_ACTIVE_CITIES, GET_ALL_ACTIVE_PACKAGES, GET_ALL_ACTIVE_SERVERS, GET_ALL_BANKS, GET_ALL_COMPANY_INSTALLERS, GET_ALL_CUSTOMERS, GET_ALL_INSURANCES, GET_ALL_OPERATORS, GET_ALL_SALE_GROUPS, GET_ALL_SALELEADS, GET_ALL_SERVICES, GET_ALL_VEHICLES_MAKE, GET_ALL_VEHICLES_MODEL, GET_USER_BY_ID } from '../../../../../../Utilities/api/apiEndpoints'
import { getAll } from '../../../../../../Utilities/api'
import { setCities, setCustomers, setPackages, setIsConnected, setSaleLeads, setBanks, setInsurances, setGroups, setVehicleMakes, setVehicleModels, setServices, setInstalledUser, setServers } from '../../../../../../ReaduxToolkit/Reducer/SalesSlice'
import { useDispatch } from 'react-redux'
import { ERROR_MESSAGE } from '../../../../../../Utilities/constants/constants'
import Swal from 'sweetalert2'
import CreateNewSaleInvoice from './components/Invoices/CreateNewPurchaseInvoice/CreateNewSaleInvoice'

const Sales = () => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const { saleLeads } = useSelector(
        (state: any) => state.sales
    );
    const [component, setComponent] = useState("Sale Leads");
    const [iscreateNewSaleLead, setIscreateNewSaleLead] = useState(false);
    const [iscreateNewCustomer, setIscreateNewCustomer] = useState(false);
    const [iscreateNewInvoice, setIscreateNewInvoice] = useState(false);
    const [iscreateNewReceiveMoney, setIscreateNewReceiveMoney] = useState(false);

    const dispatch = useDispatch();


    useEffect(() => {
        getAll({ url: GET_ALL_ACTIVE_PACKAGES }).then((data: any) => {
            // console.log("api call --- >", data);
            if (data !== undefined) {
                if (data.success) {
                    // console.log("hhg");
                    dispatch(setPackages(data.data));
                }
                if (!data.success) {
                    // console.log("hhg");
                    dispatch(setPackages([]));
                }
            }
        });
    }, []);

    useEffect(() => {
        getAll({ url: GET_ALL_ACTIVE_CITIES }).then((data: any) => {
            // console.log("api call --- >", data);
            if (data !== undefined) {
                if (data.success) {
                    // console.log("hhg");
                    dispatch(setCities(data.data));
                }
                if (!data.success) {
                    // console.log("hhg");
                    dispatch(setCities([]));
                }
            }
        });
    }, []);

    useEffect(() => {
        getAll({ url: GET_ALL_BANKS }).then((data: any) => {
            // console.log("api call --- >", data);
            if (data !== undefined) {
                if (data.success) {
                    // console.log("hhg");
                    dispatch(setBanks(data.data));
                }
                if (!data.success) {
                    // console.log("hhg");
                    dispatch(setBanks([]));
                }
            }
        });
    }, []);
    useEffect(() => {
        getAll({ url: GET_ALL_INSURANCES }).then((data: any) => {
            // console.log("api call --- >", data);
            if (data !== undefined) {
                if (data.success) {
                    // console.log("hhg");
                    dispatch(setInsurances(data.data));
                }
                if (!data.success) {
                    // console.log("hhg");
                    dispatch(setInsurances([]));
                }
            }
        });
    }, []);
    useEffect(() => {
        getAll({ url: GET_ALL_SALE_GROUPS }).then((data: any) => {
            // console.log("api call --- >", data);
            if (data !== undefined) {
                if (data.success) {
                    // console.log("hhg");
                    dispatch(setGroups(data.data));
                }
                if (!data.success) {
                    // console.log("hhg");
                    dispatch(setGroups([]));
                }
            }
        });
    }, []);
    useEffect(() => {
        getAll({ url: GET_ALL_VEHICLES_MAKE }).then((data: any) => {
            // console.log("api call --- >", data);
            if (data !== undefined) {
                if (data.success) {
                    // console.log("hhg");
                    dispatch(setVehicleMakes(data.data));
                }
                if (!data.success) {
                    // console.log("hhg");
                    dispatch(setVehicleMakes([]));
                }
            }
        });
    }, []);
    useEffect(() => {
        getAll({ url: GET_ALL_VEHICLES_MODEL }).then((data: any) => {
            // console.log("api call --- >", data);
            if (data !== undefined) {
                if (data.success) {
                    // console.log("hhg");
                    dispatch(setVehicleModels(data.data));
                }
                if (!data.success) {
                    // console.log("hhg");
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
                    dispatch(setCustomers(data.data));
                }
            }
        });
    }, []);

    useEffect(() => {
        dispatch(setSaleLeads([]));
        getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {

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
                    dispatch(setSaleLeads(data.data));
                }
            }
        });
    }, []);

    useEffect(() => {
        dispatch(setServices([]));
        getAll({ url: GET_ALL_SERVICES }).then((data: any) => {
            if (data !== undefined) {
                if (data.success) {
                    // // console.log("hhg");
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
            <StickyBar component={component} setComponent={setComponent} setIscreateNewSaleLead={setIscreateNewSaleLead} setIscreateNewCustomer={setIscreateNewCustomer} setIscreateNewInvoice={setIscreateNewInvoice} setIscreateNewReceiveMoney={setIscreateNewReceiveMoney} />
            <div style={{
                margin: "-10px 30px 0px 15px",
            }}>
                <Breadcrumbs mainTitle={component} parent="SAIO Central" title={component} />
            </div>
            {component == "Sale Leads" ? iscreateNewSaleLead ? <CreateNewSaleLead iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} /> : <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <SaleLeadsTable iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} iscreateNewInvoice={iscreateNewInvoice} setIscreateNewInvoice={setIscreateNewInvoice} setComponent={setComponent} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : component == "Invoices" ? iscreateNewInvoice ? <CreateNewSaleInvoice iscreateNewInvoice={iscreateNewInvoice} setIscreateNewInvoice={setIscreateNewInvoice} /> : <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <InvoicesTable iscreateNewInvoice={iscreateNewInvoice} setIscreateNewInvoice={setIscreateNewInvoice} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : component == "Receive Money" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <ReceiveMoneyTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : iscreateNewCustomer ? <CreateNewCustomer iscreateNewCustomer={iscreateNewCustomer} setIscreateNewCustomer={setIscreateNewCustomer} /> : <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <CustomerTable iscreateNewCustomer={iscreateNewCustomer} setIscreateNewCustomer={setIscreateNewCustomer} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            }
        </div>
    )
}

export default Sales
