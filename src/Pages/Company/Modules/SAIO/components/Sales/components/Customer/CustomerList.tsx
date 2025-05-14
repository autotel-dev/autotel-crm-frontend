import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { CustomersDataType } from "./Type/Type";
import { PlusCircle } from "react-feather";
import { setCustomer } from "../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { formatUnderscoredString } from "../../../../../../../../Utilities/globals/globals";

const CustomerTable = () => {
  const dispatch = useDispatch();
  // Function to transform supportData into allBugReports format
  const { customers } = useSelector((state: any) => state.sales);
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
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
  var support = userPermissions.find((item: any) => item.title === "Support");
  // // console.log("support", support);
  const customersData = () => {
    return customers
      ?.filter(
        (item: any) =>
          item?._id.toLowerCase().includes(searchValue) ||
          item?.fullName.toLowerCase().includes(searchValue) ||
          item?.emailAddress.toLowerCase().includes(searchValue)
      )
      .map((item: any, index: any) => ({
        index: index + 1,
        id: item?._id,
        fullName: item?.fullName,
        emailAddress: item?.emailAddress,
        phoneNo: item?.phoneNo,
        city: item?.city?.name,
        user: item?.company?.fullName,
        dob: item?.dob?.slice(0, 10),
        isActive: item.isActive ? "Active" : "In active",
        date: `${item?.updatedAt.toString().slice(0, 10)},  ${new Date(
          item?.updatedAt
        )
          .toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .toString()}`,
      }));
  };

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setData(customersData());
  }, [searchValue]);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  // // console.log("allBugReports", supportData());
  useEffect(() => {
    setData(customersData());
  }, [customers]);

  const navigate = useNavigate();
  // const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [data, setData] = useState(customersData());

  const handleRowClicked = (row: any) => {
    dispatch(setCustomer(row));
    navigate(
      `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/customers/${row.id}`
    );
  };

  var saio_sales = userPermissions.find(
    (item: any) => item.title === "SAIO Sales"
  );
  return (
    <div
      className="table-responsive support-table"
      style={{ overflow: "auto", scrollbarWidth: "none" }}
    >
      {saio_sales && saio_sales.create && (
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
                dispatch(setCustomer(null));
                navigate(
                  `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/customers/create-customer`
                );
              }}
            >
              <PlusCircle
                size={18}
                style={{
                  marginRight: "5px",
                }}
              />
              Create New Customer
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
                    onClick={() => {
                      // var alertData = {
                      //     title: "Are you sure?",
                      //     text: "Once deleted, you will not be able to recover this ",
                      // };
                      // const type = "vendorType";
                      // deleteAlert(
                      //     alertData,
                      //     selectedRows[0]._id,
                      //     type,
                      //     dispatch
                      // ).then(() => {
                      //     // console.log("empty");
                      //     setSelectedRows([]);
                      // });
                    }}
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
            width: "8%",
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
            selector: (row: CustomersDataType) => row["date"],
            sortable: true,
            // center: true,
            width: "17%", // Set the width for this column
          },
          {
            name: "ID",
            selector: (row: any) => row.index,
            sortable: true,
            width: "8%",
            cell: (row: any) => (
              <div
                style={{
                  // width: "10%",
                  // textAlign: "center",
                  paddingLeft: "10px",
                  borderRadius: "5px",
                }}
              >
                {row.index}
              </div>
            ),
          },
          {
            name: "Status",
            selector: (row: any) => row.isActive,
            sortable: true,
            // center: true,
            width: "10%", // Set the width for this column
            cell: (row: any) => (
              <div
                style={{
                  width: "80%",
                  textAlign: "center",
                  padding: "5px",
                  borderRadius: "5px",
                  backgroundColor: "rgba(0, 0, 255, 0.3)",

                  color: "black",
                }}
              >
                {formatUnderscoredString(row.isActive)}
              </div>
            ),
          },
          {
            name: "User",
            selector: (row: any) => row["user"],
            sortable: true,
            center: false,
            width: "13%", // Set the width for this column
          },
          {
            name: "Customer Name",
            selector: (row: CustomersDataType) => row["fullName"],
            sortable: true,
            center: false,
            width: "13%", // Set the width for this column
          },
          {
            name: "Email",
            selector: (row: CustomersDataType) => row["emailAddress"],
            sortable: true,
            // center: true,
            width: "15%",
          },
          {
            name: "Phone Number",
            selector: (row: CustomersDataType) => row["phoneNo"],
            sortable: true,
            // center: true,
            width: "12%", // Set the width for this column
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

export default CustomerTable;
