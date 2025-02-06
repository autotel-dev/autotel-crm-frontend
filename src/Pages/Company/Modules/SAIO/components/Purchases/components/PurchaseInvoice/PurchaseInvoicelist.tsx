import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
// import { CustomersDataType } from "./Type/Type";
import { PlusCircle } from "react-feather";
import { setCustomer } from "../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import { getAll } from "../../../../../../../../Utilities/api";
import {
  setBranches,
  setProducts,
  setPurchaseInvoice,
  setPurchaseInvoiceLoading,
  setPurchaseInvoices,
  setSerialNumbers,
  setVendors,
  setWarehouses,
} from "../../../../../../../../ReaduxToolkit/Reducer/PurchaseInvoiceSlice";
import {
  GET_ALL_BRANCHES,
  GET_ALL_PRODUCTS,
  GET_ALL_PURCHASE_INVOICES,
  GET_ALL_VENDORS,
  GET_ALL_WAREHOUSES,
} from "../../../../../../../../Utilities/api/apiEndpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { formatUnderscoredString } from "../../../../../../../../Utilities/globals/globals";
import { TbFileInvoice } from "react-icons/tb";
import Skeleton from "../../../../../../../Utilities/Skeleton/Skeleton";

const PurchaseInvoiceTable = ({}) => {
  const dispatch = useDispatch();
  // Function to transform supportData into allBugReports format
  const { purchaseInvoices, loading } = useSelector(
    (state: any) => state.purchaseInvoice
  );

  useEffect(() => {
    if (loading) {
      dispatch(setPurchaseInvoices([]));
      getAll({ url: GET_ALL_PURCHASE_INVOICES }).then((data: any) => {
        if (data !== undefined) {
          if (!data.success) {
            dispatch(setPurchaseInvoiceLoading(false));
          }
          if (data.success) {
            dispatch(setPurchaseInvoices(data.data));
            setTimeout(() => {
              dispatch(setPurchaseInvoiceLoading(false));
            }, 500);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    // Whenever saleLeads is updated, this effect will trigger
    if (purchaseInvoices && purchaseInvoices.length > 0) {
      dispatch(setPurchaseInvoices(purchaseInvoices)); // Update Redux store with the latest saleLeads
      // setLoading(false)
    }
    // Dependency array with saleLeads to watch for changes
  }, [purchaseInvoices]);

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  function hexToRgb(hex: any) {
    // Remove the hash sign if present
    hex = hex?.replace(/^#/, "");
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
  // // console.log("support", support);
  const purchaseInvoicesData = () => {
    if (purchaseInvoices?.length > 0) {
      return purchaseInvoices
        ?.filter((item: any) =>
          item?.vendor?.vendorName?.toLowerCase().includes(searchValue)
        )
        .map((item: any, index: any) => ({
          index: index + 1,
          _id: item?._id,
          vendor: item?.vendor?.vendorName,
          reference: item?.reference,
          comments: item?.comments,
          productsDetails: item?.productsDetails,
          shippingCharges: item?.shippingCharges,
          netAmount: item?.netAmount,
          remainingBalance: item?.remainingBalance,
          purchaseInvoiceId: item?.purchaseInvoiceId,
          user: item?.user?.fullName,
          branch: item?.branch,
          warehouse: item?.warehouse,
          invoiceDate: `${item?.invoiceDate
            .toString()
            .slice(0, 10)},  ${new Date(item?.updatedAt)
            .toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .toString()}`,
          invoiceDueDate: `${item?.invoiceDueDate
            .toString()
            .slice(0, 10)},  ${new Date(item?.updatedAt)
            .toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .toString()}`,
          status: item?.status,
        }));
    }
  };

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setData(purchaseInvoicesData());
  }, [searchValue]);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  useEffect(() => {
    setData(purchaseInvoicesData());
  }, [purchaseInvoices]);

  const navigate = useNavigate();
  // const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [data, setData] = useState(purchaseInvoicesData());

  const handleRowClicked = (row: any) => {
    // console.log("row", row);

    dispatch(setPurchaseInvoice(row));
    navigate(
      `${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/purchase-invoices/invoice-detail/${row.id}`
    );
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
    <div
      className="table-responsive support-table"
      style={{ overflow: "auto", scrollbarWidth: "none" }}
    >
      <Row>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            paddingRight: "25px",
          }}
        >
          <button
            className={`btn ${
              userPersonalizationData?.buttonsAndBarsColor == null
                ? "btn-primary"
                : ""
            }`}
            style={{
              color: "white",
              backgroundColor: `${
                userPersonalizationData !== null &&
                userPersonalizationData?.buttonsAndBarsColor
              }`,
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => {
              dispatch(setPurchaseInvoice(null));
              navigate(
                `${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/purchase-invoices/create-invoice`
              );
              // setIscreateNewPurchaseInvoice(true)
            }}
          >
            <PlusCircle
              size={18}
              style={{
                marginRight: "5px",
              }}
            />
            Create New Purchase Invoice
          </button>
        </div>
      </Row>
      <Row style={{ display: "flex", alignItems: "center" }}>
        <Col sm={12} md={12} lg={12} xl={12}>
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

      {loading ? (
        <>
          <Skeleton height="90px" width="100%" borderRadius="10px" />
          <Skeleton
            height="50px"
            width="100%"
            marginTop="10px"
            marginBottom="10"
            borderRadius="10px"
          />
          <Skeleton
            height="50px"
            width="100%"
            marginTop="10px"
            marginBottom="10"
            borderRadius="10px"
          />
          <Skeleton
            height="50px"
            width="100%"
            marginTop="10px"
            marginBottom="10"
            borderRadius="10px"
          />
          <Skeleton
            height="50px"
            width="100%"
            marginTop="10px"
            marginBottom="10"
            borderRadius="10px"
          />
        </>
      ) : (
        <DataTable
          columns={[
            // {
            //   name: "Date",
            //   selector: (row: any) => row["invoiceDate"],
            //   sortable: true,
            //   // center: true,
            //   width: "15%", // Set the width for this column
            // },
            {
              name: "Due Date",
              selector: (row: any) => row["invoiceDueDate"],
              sortable: true,
              center: true,
              width: "15%", // Set the width for this column
            },
            {
              name: "Invoice Id",
              selector: (row: any) => row["purchaseInvoiceId"],
              sortable: true,
              // center: true,
              width: "12%", // Set the width for this column
            },
            {
              name: "Status",
              selector: (row: any) => row["status"],
              sortable: true,
              // center: true,
              width: "12%", // Set the width for this column
              cell: (row: any) => (
                <div
                  style={{
                    width: "80%",
                    textAlign: "center",
                    padding: "5px",
                    borderRadius: "5px",
                    backgroundColor:
                      row.status === "DRAFT"
                        ? "rgba(0, 0, 255, 0.3)"
                        : "rgba(0, 255, 0, 0.3)",
                    // color:
                    //   row.status === "NEW"
                    //     ? "blue"
                    //     : row.status === "IN_PROGRESS"
                    //     ? "orange"
                    //     : row.status === "PENDING"
                    //     ? "red"
                    //     : "green",
                    color: "black",
                  }}
                >
                  {formatUnderscoredString(row.status)}
                </div>
              ),
            },

            {
              name: "Vendor",
              selector: (row: any) => row.vendor,
              sortable: true,
              // center: true,
              width: "15%", // Set the width for this column
            },

            {
              name: "Amount",
              selector: (row: any) => row["netAmount"],
              sortable: true,
              // center: true,
              width: "10%", // Set the width for this column
            },
            {
              name: "Adjusted",
              selector: (row: any) =>
                row["netAmount"] - row["remainingBalance"] == row["netAmount"]
                  ? 0
                  : row["netAmount"] - row["remainingBalance"],
              sortable: true,
              // center: true,
              width: "10%",
            },
            {
              name: "Remaining",
              selector: (row: any) => row["remainingBalance"],
              sortable: true,
              // center: true,
              width: "10%",
            },

            //         {
            //             name: "Actions",
            //             selector: (row: any) => row["actions"],
            //             sortable: true,
            //             center: true,
            //             width: "8%", // Set the width for this column
            //             cell: (row: any) => (
            //                 <div
            //                     style={{
            //                         // width: "100px",
            //                         textAlign: "center",
            //                         padding: "5px",
            //                         borderRadius: "5px",
            //                         color: "black",

            //                     }}

            //                 >
            //                     <div
            //                         onClick={() => { dispatch(setPurchaseInvoice(row)); navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/purchase-invoices/create-invoice`) }}
            //                     >
            //                         <TbFileInvoice size={18} />
            //                         <span className="tooltip">Sale Invoice</span>
            //                     </div>
            //                     <style>
            //                         {`
            //        .tooltip {
            //   visibility: hidden;
            //   background-color: black;
            //   color: #fff;
            //   text-align: center;
            //   border-radius: 5px;
            //   padding: 5px;
            //   position: absolute;
            //   z-index: 1;
            //   right:30px ; /* Position the tooltip to the left of the text */
            //   transform: translateY(-95%);
            //   opacity: 0;
            //   transition: opacity 0.3s;
            //   white-space: nowrap; /* Ensure the tooltip text doesn't wrap */
            // }

            //  .tooltip:hover {
            //   visibility: visible;
            //   opacity: 1;
            // }
            //       `}
            //                     </style>
            //                 </div>

            //             ),
            //         },
          ]}
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
                "&:hover": {
                  // Define hover style
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
      )}
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
