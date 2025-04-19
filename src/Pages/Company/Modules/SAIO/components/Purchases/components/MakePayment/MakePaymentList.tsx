import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { PlusCircle } from "react-feather";
import { getAll } from "../../../../../../../../Utilities/api";

import {
  GET_ALL_BANK_ACCOUNTS,
  GET_ALL_PURCHASE_INVOICES,
  GET_ALL_VENDORS,
  GET_MAKE_PAYEMENT_TRANSACTIONS,
  GET_VENDOR_GENERAL_ACCOUNTS,
} from "../../../../../../../../Utilities/api/apiEndpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { formatUnderscoredString } from "../../../../../../../../Utilities/globals/globals";
import Skeleton from "../../../../../../../Utilities/Skeleton/Skeleton";
import {
  setFromAccounts,
  setMakePayment,
  setMakePaymentLoading,
  setMakePayments,
  setPurchaseInvoices,
  setToAccounts,
  setVendors,
} from "../../../../../../../../ReaduxToolkit/Reducer/MakePaymentSlice";

const MakePaymentTable = ({}) => {
  const dispatch = useDispatch();
  // Function to transform supportData into allBugReports format
  const { makePayments, loading } = useSelector(
    (state: any) => state.makePayments
  );

  useEffect(() => {
    if (loading) {
      dispatch(setMakePayments([]));
      getAll({ url: GET_MAKE_PAYEMENT_TRANSACTIONS }).then((data: any) => {
        if (data !== undefined) {
          if (!data.success) {
            dispatch(setMakePaymentLoading(false));
          }
          if (data.success) {
            dispatch(setMakePayments(data.data));
            setTimeout(() => {
              dispatch(setMakePaymentLoading(false));
            }, 500);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    // Whenever saleLeads is updated, this effect will trigger
    if (makePayments && makePayments.length > 0) {
      dispatch(setMakePayments(makePayments)); // Update Redux store with the latest saleLeads
      // setLoading(false)
    }
    // Dependency array with saleLeads to watch for changes
  }, [makePayments]);

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
    if (makePayments?.length > 0) {
      return makePayments
        ?.filter((item: any) =>
          item?.vendor?.vendorName?.toLowerCase().includes(searchValue)
        )
        .map((item: any, index: any) => ({
          index: index + 1,
          _id: item?._id,
          vendor: item?.vendor,
          debitAccount: item?.debitTrx?.debitAccount,
          creditAccount: item?.debitTrx?.creditAccount,
          amount: item?.amount,
          date: `${item?.transactionDate.toString().slice(0, 10)},  ${new Date(
            item?.transactionDate
          )
            .toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .toString()}`,

          status: item?.status,
          paymentType: item?.amountType,
          reference: item?.reference,
          comments: item?.comments,
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
  }, [makePayments]);

  const navigate = useNavigate();
  // const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [data, setData] = useState(purchaseInvoicesData());

  const handleRowClicked = (row: any) => {
    // console.log("row", row);

    dispatch(setMakePayment(row));
    navigate(
      `${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/make-payments/${row.id}`
    );
    // setIscreateNewPurchaseInvoice(true)
  };

  useEffect(() => {
    getAll({ url: GET_ALL_VENDORS }).then((data: any) => {
      if (data?.success) {
        dispatch(setVendors(data.data));
      }
    });

    getAll({ url: GET_VENDOR_GENERAL_ACCOUNTS }).then((data: any) => {
      if (data?.success) {
        dispatch(setToAccounts(data.data));
      }
    });

    getAll({ url: GET_ALL_BANK_ACCOUNTS }).then((data: any) => {
      if (data?.success) {
        dispatch(setFromAccounts(data.data));
      }
    });
    getAll({ url: GET_ALL_PURCHASE_INVOICES }).then((data: any) => {
      if (data?.success) {
        dispatch(setPurchaseInvoices(data.data));
      }
    });
  }, []);

  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );

  var saio_purchases = userPermissions.find(
    (item: any) => item.title === "SAIO Purchases"
  );

  return (
    <div
      className="table-responsive support-table"
      style={{ overflow: "auto", scrollbarWidth: "none" }}
    >
      {saio_purchases && saio_purchases.create && (
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
                dispatch(setMakePayment(null));
                navigate(
                  `${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/make-payments/create-payment`
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
              Create New Make Payment
            </button>
          </div>
        </Row>
      )}
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
              name: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    paddingLeft: "0px ",
                  }}
                >
                  {selectedRows.length > 0 && (
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      onClick={() => {}}
                      style={{
                        cursor: "pointer",
                        color: "red",
                        marginRight: "20px",
                        paddingLeft: "0px",
                      }}
                    />
                  )}
                  S.No.
                </div>
              ),
              selector: (row: any) => row.index,
              sortable: true,
              width: "10%",
              // center: true,
              cell: (row: any) => (
                <div
                  style={{
                    paddingLeft: "10px",
                    borderRadius: "5px",
                  }}
                >
                  {row.index}
                </div>
              ),
            },
            {
              name: "Date",
              selector: (row: any) => row["date"],
              sortable: true,
              width: "15%", // Set the width for this column
            },
            {
              name: "Vendor",
              selector: (row: any) => row["vendor"]["vendorName"],
              sortable: true,
              width: "15%", // Set the width for this column
            },
            // {
            //   name: "Debit Account",
            //   selector: (row: any) => row["debitAccount"]["name"],
            //   sortable: true,
            //   width: "15%", // Set the width for this column
            // },
            // {
            //   name: "Credit Account",
            //   selector: (row: any) => row["creditAccount"]["name"],
            //   sortable: true,
            //   width: "15%", // Set the width for this column
            // },
            {
              name: "Account",
              selector: (row: any) => row["debitAccount"]["name"],
              sortable: true,
              width: "15%", // Set the width for this column
            },
            {
              name: "Amount",
              selector: (row: any) => row["amount"],
              sortable: true,
              width: "15%", // Set the width for this column
            },
            {
              name: "Status",
              selector: (row: any) => row["status"],
              sortable: true,
              // center: true,
              width: "15%", // Set the width for this column
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

export default MakePaymentTable;
