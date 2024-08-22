import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { PlusCircle } from "react-feather";
import {
  GET_ALL_PRODUCTS,
  GET_ALL_STOCK_ADJUSTMENT_TYPES,
} from "../../../../../../../../Utilities/api/apiEndpoints";
import { getAll } from "../../../../../../../../Utilities/api";
import { setProducts } from "../../../../../../../../ReaduxToolkit/Reducer/StockAdjustementSlice";
import { formatUnderscoredString } from "../../../../../../../../Utilities/globals/globals";
import { setStockAdjustmentTypes } from "../../../../../../../../ReaduxToolkit/Reducer/StockAdjustementSlice";
import CreateNewStockAdjustmentModal from "./CreateNewStockAdjustmentModal";

const StockAdjustmentTable = () => {
  const dispatch = useDispatch();
  // Function to transform supportData into allBugReports format
  const { stockAdjustments } = useSelector((state: any) => state.stockAdjustment);

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
  const stockAdjustmentsData = () => {
    return stockAdjustments
      ?.filter(
        (item: any) =>
          item?._id.toLowerCase().includes(searchValue) ||
          item?.type?.name.toLowerCase().includes(searchValue)
      )
      .map((item: any) => ({
        ...item,

      }));
  };



  useEffect(() => {
    setData(stockAdjustmentsData());
  }, [searchValue]);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  // console.log("allBugReports", supportData());
  useEffect(() => {
    setData(stockAdjustmentsData());
  }, [stockAdjustments]);

  const navigate = useNavigate();
  // const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [data, setData] = useState(stockAdjustmentsData());


  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  useEffect(() => {
    getAll({ url: GET_ALL_STOCK_ADJUSTMENT_TYPES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setStockAdjustmentTypes(data.data));
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

  // const handleDelete = () => {
  //   if (
  //     window.confirm(
  //       `Are you sure you want to delete:\r ${selectedRows.map(
  //         (r: SaleLeadsDataType) => r.id
  //       )}?`
  //     )
  //   ) {
  //     setToggleDelete(!toggleDelete);
  //     setData(
  //       data.filter((item: any) =>
  //         selectedRows.filter((elem: SaleLeadsDataType) => elem.id === item.id)
  //           .length > 0
  //           ? false
  //           : true
  //       )
  //     );
  //     setSelectedRows([]);
  //   }
  // };

  const handleRowClicked = (row: any) => {
    // navigate(
    //   `${process.env.PUBLIC_URL}/support/ticketDetails/${row.ticket_id}`
    // );
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
            justifyContent: "end",
            paddingRight: "25px",
          }}
        >
          <CreateNewStockAdjustmentModal
          />
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
            name: "ID",
            selector: (row: any) => row._id,
            sortable: true,
            center: true
          },
          {
            name: "User",
            selector: (row: any) => row.company.fullName,
            sortable: true,
            center: true
          },
          {
            name: "Email Address",
            selector: (row: any) => row.company.emailAddress,
            sortable: true,
            center: true
          },
          {
            name: "Product",
            selector: (row: any) => row.product.name,
            sortable: true,
            center: true
          },
          {
            name: "Adjustment Type",
            selector: (row: any) => formatUnderscoredString(row.type.name),
            sortable: true,
            center: true
          },
          {
            name: "Items",
            selector: (row: any) => row.quantity,
            sortable: true,
            center: true
          },

          {
            name: "Date",
            selector: (row: any) => row.createdAt,
            sortable: true,
            center: true
          },
        ]}
        data={data}
        // striped={true}
        pagination
        selectableRows
        onSelectedRowsChange={handleRowSelected}
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

export default StockAdjustmentTable;
