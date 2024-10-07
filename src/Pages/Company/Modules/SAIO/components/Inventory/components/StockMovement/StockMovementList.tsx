import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { PlusCircle } from "react-feather";
import CreateNewStockMovementModal from "./CreateNewStockMovementModal";
import {
  GET_ALL_ACTIVE_BRANCHES,
  GET_ALL_ACTIVE_WAREHOUSES,
  GET_ALL_PRODUCTS,
} from "../../../../../../../../Utilities/api/apiEndpoints";
import { getAll } from "../../../../../../../../Utilities/api";
import { setBranches, setProducts, setStockMovement, setWarehouses } from "../../../../../../../../ReaduxToolkit/Reducer/StockMovementSlice";
import { formatUnderscoredString } from "../../../../../../../../Utilities/globals/globals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const StockMovementTable = () => {
  const dispatch = useDispatch();
  // Function to transform supportData into allBugReports format
  const { stockMovements } = useSelector((state: any) => state.stockMovement);
  const [addModal, setAddModal] = useState(false);

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
  const [searchValue, setSearchValue] = useState("");
  const stockMovementData = () => {
    return stockMovements
      ?.filter(
        (item: any) =>
          item?.product?.name?.toLowerCase().includes(searchValue) ||
          item?.stockMovementType?.toLowerCase().includes(searchValue)
      )
      .map((item: any, index: any) => ({
        index: index + 1,
        ...item,
      }));
  };



  useEffect(() => {
    setData(stockMovementData());
  }, [searchValue]);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  // console.log("allBugReports", supportData());
  useEffect(() => {
    setData(stockMovementData());
  }, [stockMovements]);

  const navigate = useNavigate();
  // const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [data, setData] = useState(stockMovementData());


  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_WAREHOUSES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setWarehouses(data.data));
        }
      }
    });

    getAll({ url: GET_ALL_ACTIVE_BRANCHES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setBranches(data.data));
        }
      }
    });

    getAll({ url: GET_ALL_PRODUCTS }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setProducts(data.data));
        }
      }
    });
  }, []);



  const handleRowClicked = (row: any) => {
    console.log("row", row);
    dispatch(setStockMovement(row))
    setAddModal(!addModal)

  };
  return (
    <div
      className="table-responsive support-table"
      style={{ overflow: "auto", scrollbarWidth: "none" }}
    >
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
              dispatch(setStockMovement(null))
              setAddModal(!addModal)
            }}
          >
            <PlusCircle size={18} style={{
              marginRight: "5px"
            }} />
            Create New Stock Movement
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
                    // onClick={handleDelete}
                    onClick={() => {
                      // // console.log("345678");
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
                      //     console.log("empty");

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
            selector: (row: any) => "",
            sortable: true,
            width: "18%",
            cell: (row: any) => (
              <div
              >
                {row?.createdAt.toString().slice(0, 10)}, {new Date(
                  row?.createdAt
                )
                  .toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                  .toString()}
              </div>
            )

          },
          {
            name: "ID",
            selector: (row: any) => row.index,
            sortable: true,
            width: "15%",
            cell: (row: any) => (
              <div
                style={{

                  borderRadius: "5px",
                }}
              >
                SM - {row.index}
              </div>
            )
          },

          {
            name: "User",
            selector: (row: any) => `${row?.user !== null ? row?.user?.fullName : "N/A"}`,
            sortable: true,
            // center: true,
            width: "15%", // Set the width for this column

          },
          {
            name: "Movement Type",
            selector: (row: any) => formatUnderscoredString(row.stockMovementType),
            sortable: true,
            // center: true
          },
          {
            name: "Product",
            selector: (row: any) => row.product.name,
            sortable: true,
            center: true
          },
          {
            name: "Items",
            selector: (row: any) => row.quantity,
            sortable: true,
            center: true
          },


        ]}
        data={data}
        // striped={true}
        pagination
        selectableRows
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

      {addModal && <CreateNewStockMovementModal
        isVisible={addModal}
        setIsVisible={setAddModal}
      />}
    </div>
  );
};

export default StockMovementTable;
