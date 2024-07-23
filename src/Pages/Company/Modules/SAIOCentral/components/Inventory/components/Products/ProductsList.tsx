import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { PlusCircle } from "react-feather";
import CreateNewProductModal from "./components/CreateNewProductModal";
import UpdateProduct from "./components/UpdateProduct";
import { getAll } from "../../../../../../../../Utilities/api";
import {
  GET_ALL_PRODUCT_TYPES,
  GET_ALL_UNITS,
  GET_ALL_PRODUCTS,
} from "../../../../../../../../Utilities/api/apiEndpoints";
import {
  setProductType,
  setUnits,
} from "../../../../../../../../ReaduxToolkit/Reducer/InventoryProductSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import deleteAlert from "../../../../../../../../Utilities/alerts/DeleteAlert";
import { Id } from "../../../../../../../../utils/Constant";

const ProductsTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor);

  const { product } = useSelector((state: any) => state.inventoryProduct);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows]: any = useState([]);

  const [toggleDelete, setToggleDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected product
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    // Fetch Product Types
    getAll({ url: GET_ALL_PRODUCT_TYPES }).then((data: any) => {
      if (data?.success) {
        dispatch(setProductType(data.data.allProductTypes));
      }
    });

    // Fetch Units
    getAll({ url: GET_ALL_UNITS }).then((data: any) => {
      if (data?.success) {
        dispatch(setUnits(data.data));
      }
    });
  }, []);

  const productsData = () => {
    return product
      ?.filter(
        (item: any) =>
          item?._id.toLowerCase().includes(searchValue) ||
          item?.name.toLowerCase().includes(searchValue)
      )
      .map((item: any) => ({
        id: item._id,
        name: item.name,
        isActive: item.isActive ? "true" : "false",
        qrCode: item.qrCode?.url || "N/A",
        productType: item.productType,
        serialNumber: item.serialNumber,
        productTypeId: item.productType,
        measurementUnit: item.measurementUnit,
        sku: item.sku,
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

  useEffect(() => {
    setData(productsData());
  }, [searchValue]);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };
  const [idd, setIdd] = useState("");

  // console.log("allBugReports", supportData());
  useEffect(() => {
    setData(productsData());
  }, [product]);

  const [data, setData] = useState(productsData());

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleRowClicked = (row: any) => {
    setSelectedProduct(row);
    setIsUpdateModalOpen(true);
  };

  // Define columns for the DataTable
  const columns = [
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
                // console.log("345678");
                var alertData = {
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this ",
                };
                const type = "productType";
                deleteAlert(alertData, selectedRows[0].id, type, dispatch).then(
                  () => {
                    console.log("empty");

                    setSelectedRows([]);
                  }
                );
              }}
              style={{
                cursor: "pointer",
                color: "red",
                marginRight: "20px",
                paddingLeft: "0px",
              }}
            />
          )}
          Product Name
        </div>
      ),
      selector: (row: any) => row.vendorName,
      sortable: true,
      width: "180px",
      cell: (row: any) => (
        <div
          style={{
            width: "180px",
            textAlign: "center",
            paddingRight: "60px",
            borderRadius: "5px",
          }}
        >
          {row.name}
        </div>
      ),
    },
    // {
    //   name: "Product Name",
    //   selector: (row: any) => row.name,
    //   sortable: true,
    // },
    {
      name: "Product Type",
      selector: (row: any) => row.productType,
      sortable: true,
    },

    {
      name: "Measurement unit",
      selector: (row: any) => row.measurementUnit,
      sortable: true,
    },

    {
      name: "Date",
      selector: (row: any) => row.date,
      sortable: true,
    },
  ];

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
          <CreateNewProductModal />
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
        columns={columns}
        data={data}
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
        {`.custom-data-table thead th {
        text-align: center !important;
      }`}
      </style>

      {isUpdateModalOpen && (
        <UpdateProduct
          isVisible={isUpdateModalOpen}
          setIsVisible={setIsUpdateModalOpen}
          selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
};

export default ProductsTable;
