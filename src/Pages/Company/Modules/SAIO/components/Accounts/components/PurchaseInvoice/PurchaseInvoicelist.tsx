import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { CustomersDataType, supportColumns } from "./Type/Type";
import { PlusCircle } from "react-feather";
import { setCustomer } from "../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import { getAll } from "../../../../../../../../Utilities/api";
import { setBranches, setProducts, setPurchaseInvoice, setSerialNumbers, setVendors, setWarehouses } from "../../../../../../../../ReaduxToolkit/Reducer/PurchaseInvoiceSlice";
import { GET_ALL_BRANCHES, GET_ALL_PRODUCTS, GET_ALL_VENDORS, GET_ALL_WAREHOUSES } from "../../../../../../../../Utilities/api/apiEndpoints";

interface PurchaseInvoiceTableProps {
    // iscreateNewPurchaseInvoice: boolean;
    // setIscreateNewPurchaseInvoice: any
}

const PurchaseInvoiceTable: React.FC<PurchaseInvoiceTableProps> = ({
    // iscreateNewPurchaseInvoice,
    // setIscreateNewPurchaseInvoice,
}) => {
    const dispatch = useDispatch();
    // Function to transform supportData into allBugReports format
    const { purchaseInvoices } = useSelector((state: any) => state.purchaseInvoice);
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    function hexToRgb(hex: any) {
        // Remove the hash sign if present
        hex = hex?.replace(/^#/, '');
        // Parse the hex values to RGB
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    // Usage
    const hexColor = "#ff0000"; // Example hex color
    const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor); // Convert hex to RGB
    // console.log("support", support);
    const purchaseInvoicesData = () => {
        return purchaseInvoices?.filter(
            (item: any) =>
                item?.purchaseInvoiceId?.includes(searchValue) ||
                item?.vendor?.toLowerCase().includes(searchValue)
        )
            .map((item: any) => ({
                id: item?._id,
                vendor: item?.vendor,
                reference: item?.reference,
                comments: item?.comments,
                productsDetails: item?.productsDetails,
                shippingCharges: item?.shippingCharges,
                netAmount: item?.netAmount,
                purchaseInvoiceId: item?.purchaseInvoiceId,
                company: item?.company,
                branch: item?.branch,
                warehouse: item?.warehouse,
                invoiceDate: `${item?.invoiceDate.toString().slice(0, 10)},  ${new Date(
                    item?.updatedAt
                )
                    .toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })
                    .toString()}`,
                invoiceDueDate: `${item?.invoiceDueDate.toString().slice(0, 10)},  ${new Date(
                    item?.updatedAt
                )
                    .toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })
                    .toString()}`,
                status: item?.status,
            }));
    };

    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        setData(purchaseInvoicesData());
    }, [searchValue]);

    const handleSearch = (e: any) => {
        const searchKey = e.target.value.toLowerCase();
        setSearchValue(searchKey);
    };

    // console.log("allBugReports", supportData());
    useEffect(() => {
        setData(purchaseInvoicesData());
    }, [purchaseInvoices]);

    const navigate = useNavigate();
    // const history = useHistory();
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleDelete, setToggleDelete] = useState(false);
    const [data, setData] = useState(purchaseInvoicesData());

    // const handleRowSelected = useCallback((state: any) => {
    //     setSelectedRows(state.selectedRows);
    // }, []);

    // const handleDelete = () => {
    //     if (
    //         window.confirm(
    //             `Are you sure you want to delete:\r ${selectedRows.map(
    //                 (r: SaleLeadsDataType) => r.id
    //             )}?`
    //         )
    //     ) {
    //         setToggleDelete(!toggleDelete);
    //         setData(
    //             data.filter((item: any) =>
    //                 selectedRows.filter((elem: SaleLeadsDataType) => elem.id === item.id)
    //                     .length > 0
    //                     ? false
    //                     : true
    //             )
    //         );
    //         setSelectedRows([]);
    //     }
    // };

    const handleRowClicked = (row: any) => {
        console.log("row", row);

        dispatch(setPurchaseInvoice(row))
        navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/accounts/purchase-invoice/invoice-detail/${row.id}`)
        // setIscreateNewPurchaseInvoice(true)

    };


    useEffect(() => {
        // Fetch countries and cities from API
        getAll({ url: GET_ALL_VENDORS }).then((data: any) => {
            if (data?.success) {
                dispatch(setVendors(data.data));
            }
        });

        getAll({ url: GET_ALL_PRODUCTS }).then((data: any) => {
            if (data?.success) {
                dispatch(setProducts(data.data));
            }
        });
        getAll({ url: GET_ALL_BRANCHES }).then((data: any) => {
            if (data?.success) {
                dispatch(setBranches(data.data));
            }
        });

        getAll({ url: GET_ALL_WAREHOUSES }).then((data: any) => {
            if (data?.success) {
                dispatch(setWarehouses(data.data));
            }
        });
    }, []);

    return (
        <div className="table-responsive support-table" style={{ overflow: "auto", scrollbarWidth: "none" }}>
            <Row>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    paddingRight: "25px"
                }}>
                    <button
                        className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""
                            }`}
                        style={{
                            color: "white",
                            backgroundColor: `${userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor
                                }`,
                            display: "flex",
                            alignItems: "center",

                        }}
                        onClick={() => {
                            dispatch(setPurchaseInvoice(null))
                            navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/accounts/purchase-invoices/create-invoice`)
                            // setIscreateNewPurchaseInvoice(true)
                        }}
                    >
                        <PlusCircle size={18} style={{
                            marginRight: "5px"
                        }} />
                        Create New Purchase Invoice
                    </button>
                </div>
            </Row>
            <Row style={{ display: "flex", alignItems: "center" }}>
                <Col
                    sm={12}
                    md={
                        12
                    }
                    lg={
                        12
                    }
                    xl={
                        12
                    }
                >
                    <input
                        className="global-search-field"
                        type="text"
                        placeholder="Type to Search.."
                        value={searchValue}
                        onChange={(e) => {
                            handleSearch(e);
                        }}

                    />
                </Col>

            </Row>

            <DataTable
                columns={supportColumns}
                data={data}
                // striped={true}
                pagination
                selectableRows
                // onSelectedRowsChange={handleRowSelected}
                onRowClicked={handleRowClicked} // Pass the event handler for row clicks
                clearSelectedRows={toggleDelete}
                style={{
                    cursor: "pointer",
                }}
                className="custom-data-table" // Add a class to your DataTable for styling
                // You can add more props as needed
                customStyles={{
                    rows: {
                        style: {
                            cursor: "pointer",
                            transition: "background-color 0.2s", // Smooth transition for background color change
                            "&:hover": { // Define hover style
                                backgroundColor: `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`,
                            },
                        },
                    },
                    head: {
                        style: {
                            fontWeight: "bold",
                            fontSize: "13px",
                        },
                    },
                }}
            />
            <style>
                {`
       .custom-data-table thead th {
        text-align: center !important;
      }
      `}
            </style>
        </div>
    );
};

export default PurchaseInvoiceTable;
