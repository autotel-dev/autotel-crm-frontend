import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { PlusCircle } from "react-feather";
import { getAll } from "../../../../../../../../Utilities/api";

import { GET_ALL_BANK_ACCOUNTS } from "../../../../../../../../Utilities/api/apiEndpoints";

import { TbFileInvoice } from "react-icons/tb";
import CreateNewCompanyLedger from "./CreateNewMakePayment/CreateNewCompanyLedger";
import { setFromAccounts } from "../../../../../../../../ReaduxToolkit/Reducer/CompanyLedgerSlice";

const CompanyLedgerTable = ({}) => {
  const dispatch = useDispatch();
  // Function to transform supportData into allBugReports format
  const { companyLedgers } = useSelector((state: any) => state.companyLedgers);

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
    if (companyLedgers?.length > 0) {
      return companyLedgers.map((item: any, index: any) => ({
        index: index + 1,
        title: item.title,
        from: `${item?.from.toString().slice(0, 10)},  ${new Date(item?.from)
          .toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .toString()}`,
        to: `${item?.to.toString().slice(0, 10)},  ${new Date(item?.to)
          .toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .toString()}`,
        statement: item.statement,
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
    console.log("companyLedgers", companyLedgers);
  }, [companyLedgers]);

  const navigate = useNavigate();
  // const history = useHistory();

  const [toggleDelete, setToggleDelete] = useState(false);
  const [data, setData] = useState(vendorLedgerData());

  useEffect(() => {
    getAll({ url: GET_ALL_BANK_ACCOUNTS }).then((data: any) => {
      if (data?.success) {
        dispatch(setFromAccounts(data.data));
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
          <CreateNewCompanyLedger />
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
            name: "Title",
            selector: (row: any) => row["title"],
            sortable: true,
            width: "25%",
          },
          {
            name: "From",
            selector: (row: any) => row["from"],
            sortable: true,
            width: "25%",
          },
          {
            name: "To",
            selector: (row: any) => row["to"],
            sortable: true,
            width: "25%",
          },
          {
            name: "Actions",
            selector: (row: any) => row["actions"],
            sortable: true,
            center: true,
            width: "20%", // Set the width for this column
            cell: (row: any) => (
              <div
                style={{
                  // width: "100px",
                  textAlign: "center",
                  paddingTop: "2px",
                  marginBottom: "-12px",
                  borderRadius: "5px",
                  color: "black",
                }}
              >
                <div
                  onClick={() => {
                    // dispatch(setInvoiceData(row));
                    // navigate(
                    //   `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/invoices/create-invoice`
                    // );
                  }}
                >
                  <TbFileInvoice size={18} />
                  <span className="tooltip">View Statement</span>
                </div>
              </div>
            ),
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

export default CompanyLedgerTable;
