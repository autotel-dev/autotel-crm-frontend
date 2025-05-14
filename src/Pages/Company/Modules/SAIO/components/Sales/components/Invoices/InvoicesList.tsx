import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { PlusCircle } from "react-feather";
import { getAll } from "../../../../../../../../Utilities/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { formatUnderscoredString } from "../../../../../../../../Utilities/globals/globals";
import { TbFileInvoice } from "react-icons/tb";
import {
  setSaleInvoiceLoading,
  setSaleInvoice,
  setSaleInvoices,
} from "../../../../../../../../ReaduxToolkit/Reducer/SaleInvoiceSlice";
import { GET_ALL_SALE_INVOICES } from "../../../../../../../../Utilities/api/apiEndpoints";
import Skeleton from "../../../../../../../Utilities/Skeleton/Skeleton";

const SaleInvoiceTable = ({}) => {
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(true);
  // Function to transform supportData into allBugReports format
  const { saleInvoices, loading } = useSelector(
    (state: any) => state.saleInvoice
  );

  useEffect(() => {
    // console.log("called...");

    // Whenever saleLeads is updated, this effect will trigger
    if (saleInvoices && saleInvoices.length > 0) {
      dispatch(setSaleInvoices(saleInvoices)); // Update Redux store with the latest saleLeads
      // setLoading(false)
    }
    // Dependency array with saleLeads to watch for changes
  }, [saleInvoices]);

  useEffect(() => {
    if (loading) {
      dispatch(setSaleInvoices([]));
      getAll({ url: GET_ALL_SALE_INVOICES }).then((data: any) => {
        if (data !== undefined) {
          if (!data.success) {
            dispatch(setSaleInvoiceLoading(false));
          }
          if (data.success) {
            dispatch(setSaleInvoices(data.data));
            dispatch(setSaleInvoiceLoading(false));
          }
        }
      });
    }
  }, []);

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
  const saleInvoicesData = () => {
    return saleInvoices
      ?.filter(
        (item: any) =>
          item?.customerName?.toLowerCase().includes(searchValue) ||
          item?.companyName?.toLowerCase().includes(searchValue)
      )
      .map((item: any, index: any) => ({
        index: index + 1,
        ...item,
        invoiceDate: `${item?.invoiceDate.toString().slice(0, 10)},  ${new Date(
          item?.updatedAt
        )
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
  };

  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);

  useEffect(() => {
    setData(saleInvoicesData());
  }, [searchValue]);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  useEffect(() => {
    setData(saleInvoicesData());
  }, [saleInvoices]);

  const navigate = useNavigate();

  const [data, setData] = useState(saleInvoicesData());

  const handleRowClicked = (row: any) => {
    // console.log("row", row);
    dispatch(setSaleInvoice(null));
    dispatch(setSaleInvoice(row));
    navigate(
      `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/invoices/invoice-detail/${row._id}`
    );
  };
  return (
    <div
      className="table-responsive support-table"
      style={{ overflow: "auto", scrollbarWidth: "none" }}
    >
      <Row>
        {/* <div style={{
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
                            dispatch(setSaleInvoices(null))
                            navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/sales/invoices/create-invoice`)
                            // setIscreateNewPurchaseInvoice(true)
                        }}
                    >
                        <PlusCircle size={18} style={{
                            marginRight: "5px"
                        }} />
                        Create New Sale Invoice
                    </button>
                </div> */}
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
            {
              name: "Due Date",
              selector: (row: any) => row["invoiceDueDate"],
              sortable: true,
              center: true,
              width: "15%", // Set the width for this column
            },
            {
              name: "Invoice Id",
              selector: (row: any) => `S-INV-${row?.index}`,
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
              name: "Customer",
              selector: (row: any) => row.customerName,
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
              selector: (row: any) =>
                row["remainingBalance"] == 0 &&
                row["netAmount"] - row["remainingBalance"] == row["netAmount"]
                  ? row["netAmount"]
                  : row["remainingBalance"],
              sortable: true,
              // center: true,
              width: "10%",
            },
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

export default SaleInvoiceTable;
