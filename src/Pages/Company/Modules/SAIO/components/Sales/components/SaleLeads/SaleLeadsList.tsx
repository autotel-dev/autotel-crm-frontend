import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { SaleLeadsDataType } from "./Type/Type";
import { PlusCircle } from "react-feather";
import CreateNewSaleLead from "./CreateNewSaleLead/CreateNewSaleLead";
import Swal from "sweetalert2";
import { Select } from "antd";
import ReactDOM from "react-dom";
import {
  setCustomer,
  setInvoiceData,
  setIsConnected,
  setSaleLead,
  setSaleLeads,
} from "../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import { PopoverBody, PopoverHeader, UncontrolledPopover } from "reactstrap";
import { formatUnderscoredString } from "../../../../../../../../Utilities/globals/globals";
import { TbFileInvoice } from "react-icons/tb";
import "../StickyBar/StickyBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { ERROR_MESSAGE } from "../../../../../../../../Utilities/constants/constants";
import { GET_ALL_SALELEADS } from "../../../../../../../../Utilities/api/apiEndpoints";
import { getAll } from "../../../../../../../../Utilities/api";
import Skeleton from "../../../../../../../Utilities/Skeleton/Skeleton";

const SaleLeadsTable = () => {
  const [loading, setLoading] = useState(true);
  const { customers, saleLeads } = useSelector((state: any) => state.sales);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSaleLeads([]));
    getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {
      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setIsConnected(true));
        }
        if (!data.success) {
          // Swal.fire({
          //   text: `${data.message}`,
          //   icon: "error",
          //   timer: 2000,
          //   showConfirmButton: false,
          // });
          setLoading(false);
        }
        if (data.success) {
          dispatch(setSaleLeads(data.data)); // Update saleLeads with fetched data
          setLoading(false);
        }
      }
    });
    // Empty array to run this effect only once on mount
  }, []);

  useEffect(() => {
    // console.log("called...");

    // Whenever saleLeads is updated, this effect will trigger
    if (saleLeads && saleLeads.length > 0) {
      dispatch(setSaleLeads(saleLeads)); // Update Redux store with the latest saleLeads
    }
    // Dependency array with saleLeads to watch for changes
  }, [saleLeads]);

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization,
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
  const saleLeadsData = () => {
    return saleLeads
      ?.filter(
        (item: any) =>
          item?.customerName
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          item?.user?.fullName.toLowerCase().includes(searchValue),
      )
      .map((item: any, index: any) => ({
        index: index + 1,
        id: item?._id,
        username: item?.user?.fullName,
        email: item?.user?.emailAddress,
        customer_name: item?.customerName,
        customer_contact_no: item?.customerContactNo,
        package: item?.package?.title,
        packagePrice: item?.package?.price,
        serviceCharges: item?.serviceCharges,
        discountedServiceCharges: item?.discountedServiceCharges,
        status: item?.status,
        customer: item?.customer,
        vehicles: item?.vehicles,
        service_charges: item?.serviceCharges,
        openedBy: item?.openedBy,
        totalNoOfVehicles: item?.totalNoOfVehicles,
        discounted_service_charges: item?.discountedServiceCharges,
        isActive: item?.isActive ? "true" : "false",
        date: `${item?.updatedAt.toString().slice(0, 10)},  ${new Date(
          item?.updatedAt,
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
    setData(saleLeadsData());
  }, [searchValue]);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  // // console.log("allBugReports", supportData());
  useEffect(() => {
    setData(saleLeadsData());
  }, [saleLeads]);

  const navigate = useNavigate();
  // const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [data, setData] = useState(saleLeadsData());

  const handleRowClicked = (row: any) => {
    // console.log("row", row);

    dispatch(setSaleLead(row));
    dispatch(setCustomer(null));
    navigate(
      `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads/${row.id}`,
    );
    // setIscreateNewSaleLead(true)
  };

  const [customerId, setCustomerId] = useState("");
  const [customerList, setCustomerList] = useState([]);
  // const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    customers?.map((item: any, index: any) => {
      tempList.push({
        value: `${item?._id}`,
        label: `${item?.fullName}`,
        phoneNo: `${item?.phoneNo}`,
      });
    });
    setCustomerList(tempList);
  }, [customers]);

  const handleSelectChange = (e: any) => {
    setCustomerId(e);
    dispatch(setCustomer(e));
  };

  const handleButtonClick = () => {
    Swal.fire({
      title: "Please Select Customer",
      showCancelButton: false,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "New",
      showDenyButton: true,
      denyButtonText: "Existing",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(setCustomer(null));
        dispatch(setSaleLead(null));
        navigate(
          `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads/sale-lead`,
        );
      } else if (result.isDenied) {
        Swal.fire({
          title: "Select Customer",
          html: `
                        <div id="select-customer" style="width: 100%; height: 36px; z-index: 9999;">
                            <div id="select-box"></div>
                        </div>`,
          showConfirmButton: true,
          confirmButtonText: "OK",
          showCloseButton: true,
          showDenyButton: true,
          denyButtonText: "Cancel",
          didOpen: () => {
            const container = document.getElementById("select-box");
            const selectElement = (
              <Select
                showSearch
                style={{ width: "100%", height: 36 }}
                dropdownStyle={{ zIndex: 9999 }} // Ensure the dropdown has a high z-index
                placeholder="Select a customer"
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase(),
                  ) ||
                  (option?.value.toLowerCase() ?? "").includes(
                    input.toLowerCase(),
                  ) ||
                  (option?.phoneNo ?? "").includes(input)
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onChange={handleSelectChange}
                options={customerList}
              />
            );
            if (container) {
              ReactDOM.render(selectElement, container);
            }
          },
          customClass: {
            popup: "swal-custom-class", // Add a custom class to the popup
          },
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(setSaleLead(null));
            navigate(
              `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads/sale-lead`,
            );
            setCustomerId("");
          } else if (result.isDenied) {
            dispatch(setSaleLead(null));
            navigate(
              `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads`,
            );
            setCustomerId("");
          }
        });
      }
    });
  };

  const saleLeadColumns = [
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
      width: "7%",
      // center: true,
      cell: (row: any) => (
        <div
          style={{
            width: "7%",
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
      name: "Date",
      selector: (row: SaleLeadsDataType) => row["date"],
      sortable: true,
      // center: true,
      width: "15%", // Set the width for this column
    },
    {
      name: "ID",
      selector: (row: any) => row.index,
      sortable: true,
      width: "9%",
      cell: (row: any) => (
        <div
          style={{
            borderRadius: "5px",
          }}
        >
          S-INV - {row.index}
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: SaleLeadsDataType) => row["status"],
      sortable: true,
      center: true,
      width: "125px", // Set the width for this column
      cell: (row: SaleLeadsDataType) => (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            padding: "5px",
            borderRadius: "5px",
            color: "black",
            backgroundColor:
              row.status === "NEW"
                ? "rgba(0, 0, 255, 0.3)"
                : row.status === "IN_PROGRESS"
                  ? "rgba(255, 200, 0, 0.3)"
                  : row.status === "REJECTED"
                    ? "rgba(255, 0, 0, 0.3)"
                    : "rgba(0, 255, 0, 0.3)",
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click from propagating up
            handleRowClicked(row); // Manually trigger the row click handler
          }}
          id={`PopoverForSaleLead-${
            row.status == "IN_PROGRESS" ? row.openedBy?._id : ""
          }`} // Unique ID for each row
        >
          {formatUnderscoredString(row.status)}
          {row.openedBy !== null && row.status == "IN_PROGRESS" ? (
            <UncontrolledPopover
              placement="top"
              trigger="hover"
              target={`PopoverForSaleLead-${row.openedBy?._id}`}
            >
              <PopoverHeader>Opened By</PopoverHeader>
              <PopoverBody>{row.openedBy?.fullName}</PopoverBody>
            </UncontrolledPopover>
          ) : (
            <></>
          )}
        </div>
      ),
    },
    {
      name: "User",
      selector: (row: SaleLeadsDataType) => row["username"],
      sortable: true,
      center: false,
      width: "12%", // Set the width for this column
    },

    {
      name: "Customer Name",
      selector: (row: SaleLeadsDataType) => row["customer_name"],
      sortable: true,
      center: true,
      width: "12%", // Set the width for this column
    },
    {
      name: "Customer #",
      selector: (row: SaleLeadsDataType) => row["customer_contact_no"],
      sortable: true,
      // center: true,
      width: "12%", // Set the width for this column
    },
    {
      name: "Vehicles",
      selector: (row: SaleLeadsDataType) => row["vehicles"],
      sortable: true,
      center: true,
      width: "130px", // Set the width for this column
      cell: (row: SaleLeadsDataType) => (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "-10px",
            marginBottom: "-10px",
            borderRadius: "5px",
            color: "black",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click from propagating up
            handleRowClicked(row); // Manually trigger the row click handler
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "green",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Total: </span>
            {row.totalNoOfVehicles}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "orange",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Installed: </span>
            {
              row?.vehicles?.filter(
                (item: any) => item?.installationStatus == "INSTALLED",
              ).length
            }
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "red",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Pending: </span>
            {
              row?.vehicles?.filter(
                (item: any) => item?.installationStatus == "IN_PROGRESS",
              ).length
            }
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "green",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Completed: </span>
            {row?.status == "COMPLETED" ? "Yes" : "No"}
          </div>{" "}
        </div>
      ),
    },

    {
      name: "Actions",
      selector: (row: SaleLeadsDataType) => row["actions"],
      sortable: true,
      center: true,
      width: "10%", // Set the width for this column
      cell: (row: SaleLeadsDataType) => (
        <div
          style={{
            // width: "100px",
            textAlign: "center",
            padding: "5px",
            borderRadius: "5px",
            color: "black",
          }}
        >
          {row.status == "COMPLETED" ? (
            <div
              onClick={() => {
                dispatch(setInvoiceData(row));
                navigate(
                  `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/invoices/create-invoice`,
                );
              }}
            >
              <TbFileInvoice size={18} />
              <span className="tooltip">Sale Invoice</span>
            </div>
          ) : (
            <></>
          )}
          <style>
            {`
       .tooltip {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  right:30px ; /* Position the tooltip to the left of the text */
  transform: translateY(-95%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap; /* Ensure the tooltip text doesn't wrap */
}

 .tooltip:hover {
  visibility: visible;
  opacity: 1;
}
      `}
          </style>
        </div>
      ),
    },
  ];

  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions,
  );

  var saio_sales = userPermissions.find(
    (item: any) => item.title === "SAIO Sales",
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
              onClick={handleButtonClick}
            >
              <PlusCircle
                size={18}
                style={{
                  marginRight: "5px",
                }}
              />
              Create New Lead
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
          columns={saleLeadColumns}
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

export default SaleLeadsTable;
