import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { H4 } from "../../../../../../../../../../AbstractElements";
import { Href } from "../../../../../../../../../../utils/Constant";
import { useSelector } from "react-redux";
import Skeleton from "../../../../../../../../../Utilities/Skeleton/Skeleton";
import { useState } from "react";
import ViewAllInventoryItemsInDashboardModal from "../viewAllInventoryItemsInDashboard/ViewAllInventoryItemsInDashboard";

const ProductsTable = () => {
  const { inventoryStatisticsData, inventoryStatisticsLoading } = useSelector(
    (state: any) => state.salesDashboard
  );
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected product
  const [isViewInventoryModalOpen, setIsViewInventoryModalOpen] =
    useState(false);
  const productsHeader = [
    "Id",
    "product",
    "Units",
    "Use",
    "Available",
    "Check Availablity",
  ];

  return (
    <div
      className="table-responsive theme-scrollbar recent-wrapper"
      style={{
        maxHeight: "50vh",
        minHeight: "50vh",
        overflowY: "auto",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
        scrollbarWidth: "thin", // Specify scrollbar width
        WebkitBorderRadius: "5px", // For WebKit browsers (Chrome, Safari)
        MozBorderRadius: "5px", // For Mozilla Firefox
        borderRadius: "5px", // For other browsers
        scrollbarColor: "lightgray transparent", // Specify scrollbar color
      }}
    >
      <Table className="display order-wrapper" id="recent-order">
        <thead>
          <tr>
            {productsHeader.map((data, index) => (
              <th key={index}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {inventoryStatisticsLoading == true &&
          inventoryStatisticsData == null ? (
            <>
              <Skeleton height="100px" width="100%" borderRadius="10px" />
              <Skeleton
                height="40px"
                width="100%"
                marginTop="10px"
                marginBottom="10"
                borderRadius="10px"
              />
              <Skeleton
                height="40px"
                width="100%"
                marginTop="10px"
                marginBottom="10"
                borderRadius="10px"
              />
              <Skeleton
                height="40px"
                width="100%"
                marginTop="10px"
                marginBottom="10"
                borderRadius="10px"
              />
              <Skeleton
                height="40px"
                width="100%"
                marginTop="10px"
                marginBottom="10"
                borderRadius="10px"
              />
            </>
          ) : inventoryStatisticsLoading == false &&
            inventoryStatisticsData == null ? (
            <tr>
              <td
                colSpan={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                No Products Found
              </td>
            </tr>
          ) : (
            inventoryStatisticsData?.map((data: any, index: any) => (
              <tr key={index}>
                <td>P-00{index}</td>
                <td>
                  <div className="d-flex">
                    <div className="flex-grow-1 ms-2">
                      <H4>{data?.productName}</H4>
                    </div>
                  </div>
                </td>
                <td>{data?.totalItems}</td>
                <td className={`txt-danger`} style={{ fontWeight: "bold" }}>
                  {data?.unavailableItems}
                </td>
                <td className={`txt-success`} style={{ fontWeight: "bold" }}>
                  {data?.availableItems}
                </td>
                <td>
                  <Button
                    onClick={() => {
                      setSelectedProduct(data);
                      setIsViewInventoryModalOpen(true);
                    }}
                    color="success"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {isViewInventoryModalOpen && (
        <ViewAllInventoryItemsInDashboardModal
          isVisible={isViewInventoryModalOpen}
          setIsVisible={setIsViewInventoryModalOpen}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default ProductsTable;

// const productsBody = [
//   {
//     id: "P-001",
//     product: "ATS-100",
//     price: "$44.54",
//     units: 130,
//     payment: "Paid",
//     available: 40,
//     use: 90,
//     color1: "danger",
//     color2: "success",
//   },

//   {
//     id: "P-001",
//     product: "ATS-100",
//     price: "$44.54",
//     units: 130,
//     payment: "Paid",
//     available: 40,
//     use: 90,
//     color1: "danger",
//     color2: "success",
//   },
//   {
//     id: "P-001",
//     product: "ATS-100",
//     price: "$44.54",
//     units: 130,
//     payment: "Paid",
//     available: 40,
//     use: 90,
//     color1: "danger",
//     color2: "success",
//   },
//   {
//     id: "P-001",
//     product: "ATS-100",
//     price: "$44.54",
//     units: 130,
//     payment: "Paid",
//     available: 40,
//     use: 90,
//     color1: "danger",
//     color2: "success",
//   },
//   {
//     id: "P-001",
//     product: "ATS-100",
//     price: "$44.54",
//     units: 130,
//     payment: "Paid",
//     available: 40,
//     use: 90,
//     color1: "danger",
//     color2: "success",
//   },
//   {
//     id: "P-001",
//     product: "ATS-100",
//     price: "$44.54",
//     units: 130,
//     payment: "Paid",
//     available: 40,
//     use: 90,
//     color1: "danger",
//     color2: "success",
//   },
// ];
