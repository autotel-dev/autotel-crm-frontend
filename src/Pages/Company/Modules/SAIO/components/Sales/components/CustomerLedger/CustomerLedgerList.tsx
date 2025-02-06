import { useEffect, useState } from "react";
import { Button, Col, FormGroup, Input, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { PlusCircle } from "react-feather";
import { getAll } from "../../../../../../../../Utilities/api";

import {
  GET_ACCOUNT_STATEMENT,
  GET_ALL_CUSTOMERS,
  GET_CUSTOMER_GENERAL_ACCOUNTS,
} from "../../../../../../../../Utilities/api/apiEndpoints";

import Skeleton from "../../../../../../../Utilities/Skeleton/Skeleton";
import {
  setCustomerLedgers,
  setCustomers,
  setFromAccounts,
} from "../../../../../../../../ReaduxToolkit/Reducer/CustomerLedgerSlice";
import CreateNewCustomerLedger from "./CreateNewMakePayment/CreateNewCustomerLedger";
import { TbFileInvoice } from "react-icons/tb";
import { P } from "../../../../../../../../AbstractElements";
import SelectCustomerBox from "./CreateNewMakePayment/components/SelectCustomerBox";
import { SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";

const CustomerLedgerTable = ({}) => {
  const dispatch = useDispatch();
  // Function to transform supportData into allBugReports format
  const { customerLedgers } = useSelector(
    (state: any) => state.customerLedgers
  );

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
  const vendorLedgerData = () => {
    if (customerLedgers?.length > 0) {
      return customerLedgers.map((item: any, index: any) => ({
        date: `${item?.date.toString().slice(0, 10)},  ${new Date(item?.date)
          .toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .toString()}`,
        reference: item.reference,
        narration: item.narration,
        debit: item.debit,
        credit: item.credit,
        balance: item.balance,
      }));
    }
  };

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setData(vendorLedgerData());
  }, [searchValue]);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  useEffect(() => {
    setData(vendorLedgerData());
    console.log("customerLedgers", customerLedgers);
  }, [customerLedgers]);

  const navigate = useNavigate();
  // const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [data, setData] = useState(vendorLedgerData());

  useEffect(() => {
    getAll({ url: GET_ALL_CUSTOMERS }).then((data: any) => {
      if (data?.success) {
        dispatch(setCustomers(data.data));
      }
    });

    getAll({ url: GET_CUSTOMER_GENERAL_ACCOUNTS }).then((data: any) => {
      if (data?.success) {
        dispatch(setFromAccounts(data.data));
      }
    });
  }, []);

  const [customer, setCustomer] = useState("");
  const [accountId, setAccountId] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  const [loading, setLoading] = useState(false);

  const addVendorLedger: SubmitHandler<any> = async (data) => {
    setLoading(true);
    if (accountId !== "" && startDate !== "" && endDate !== "") {
      try {
        const response: any = await getAll({
          url: `${GET_ACCOUNT_STATEMENT}?accountId=${accountId}&startDate=${startDate}&endDate=${endDate}`,
        });
        if (response.success) {
          console.log("data", response.data.statement);

          dispatch(setCustomerLedgers(response.data.statement));
          setLoading(false);
        } else {
          Swal.fire({
            text: response.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
        }
      } catch (error: any) {
        Swal.fire({
          text: error.message || "Error creating Expense",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
      }
    } else {
      Swal.fire({
        text: "Please fill in all the fields",
        icon: "info",
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: true,
      });
      setLoading(false);
    }
  };

  return (
    <div
      className="table-responsive support-table"
      style={{ overflow: "auto", scrollbarWidth: "none" }}
    >
      <Row>
        <div
          style={{
            display: "flex",
            gap: "20px",
            // justifyContent: "end",
            paddingRight: "25px",
            paddingLeft: "25px",
            alignItems: "center",
          }}
        >
          <Col md={3}>
            <FormGroup>
              <div>
                <P>
                  Select Vendor
                  <span className="txt-danger">*</span>
                </P>
              </div>
              <SelectCustomerBox
                placeholder="Select Customer"
                setCustomer={setCustomer}
                customer={customer}
                setAccountId={setAccountId}
                accountId={accountId}
                // disabled={receiveMoney !== null}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <P>
                From Date
                <span className="txt-danger">*</span>
              </P>
              <Input
                type="date"
                placeholder="Enter Date "
                value={startDate}
                name="startDate"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <P>
                To Date
                <span className="txt-danger">*</span>
              </P>
              <Input
                type="date"
                placeholder="Enter Date "
                value={endDate}
                name="endDate"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col xs={3} style={{ marginTop: "15px" }}>
            {customerLedgers.length > 0 && (
              <Button
                style={{ marginRight: "10px" }}
                color="primary"
                disabled={loading}
                onClick={() => {
                  dispatch(setCustomerLedgers([]));
                  setCustomer("");
                  setAccountId("");
                  setStartDate(new Date().toISOString().slice(0, 10));
                  setEndDate(new Date().toISOString().slice(0, 10));
                }}
              >
                Cancel
              </Button>
            )}

            {customerLedgers.length == 0 && (
              <Button
                disabled={loading}
                color="primary"
                onClick={addVendorLedger}
              >
                {loading ? "Loading..." : "Generate"}
              </Button>
            )}
            {customerLedgers.length > 0 && (
              <Button disabled={loading} color="primary" onClick={() => {}}>
                Download
              </Button>
            )}
          </Col>
          {/* <CreateNewVendorLedger /> */}
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

      <DataTable
        columns={[
          {
            name: "Date",
            selector: (row: any) => row["date"],
            sortable: true,
            width: "15%",
          },
          {
            name: "Narration",
            selector: (row: any) => row["narration"],
            sortable: true,
            width: "35%",
          },
          {
            name: "Refernce",
            selector: (row: any) => row["reference"],
            sortable: true,
            width: "15%",
          },

          {
            name: "Debit",
            selector: (row: any) => row["debit"],
            sortable: true,
            width: "8%",
          },
          {
            name: "Credit",
            selector: (row: any) => row["credit"],
            sortable: true,
            width: "8%",
          },
          {
            name: "Balance",
            selector: (row: any) => row["balance"],
            sortable: true,
            width: "8%",
          },
        ]}
        data={data}
        pagination
        selectableRows
        clearSelectedRows={toggleDelete}
        style={{
          cursor: "pointer",
        }}
        className="custom-data-table"
        customStyles={{
          rows: {
            style: {
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
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

export default CustomerLedgerTable;
