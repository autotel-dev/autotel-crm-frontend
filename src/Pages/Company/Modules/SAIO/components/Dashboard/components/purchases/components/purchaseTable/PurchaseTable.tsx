import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { H4 } from "../../../../../../../../../../AbstractElements";
import { Href } from "../../../../../../../../../../utils/Constant";
import { useSelector } from "react-redux";

const PurchaseTable = () => {
  const purchaseHeader = ["Id", "Vendor", "Date", "Payment", "Total"];

  const purchaseBody = [
    {
      id: "P-INV-001",
      img: "01",
      vendor: "Ali",
      delivery: "Free delivery",
      date: "Aug 15,2023",
      payment: "Paid",
      //   status: "Delivered",
      amount: "$44.54",
      color: "success",
    },
    {
      id: "P-INV-002",
      img: "02",
      vendor: "Bilal",
      delivery: "$83.97 delivery",
      date: "Aug 25,2023",
      payment: "Paid",
      //   status: "Pending",
      amount: "$51.50",
      color: "success",
    },
  ];

  const { recentPurchasesData } = useSelector(
    (state: any) => state.salesDashboard
  );
  return (
    <div
      className="table-responsive theme-scrollbar recent-wrapper"
      style={{
        maxHeight: "340px",
        minHeight: "340px",
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
            {purchaseHeader.map((data, index) => (
              <th key={index}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentPurchasesData?.map((data: any, index: any) => (
            <tr key={index}>
              <td>{data?.purchaseInvoiceId}</td>
              <td>
                <div className="d-flex">
                  <div className="flex-grow-1 ms-2">
                    <H4>{data?.vendor?.vendorName}</H4>
                  </div>
                </div>
              </td>
              <td>{data?.invoiceDate.slice(0, 10)}</td>
              <td
                className={`txt-${
                  data.status == "DRAFT" ? "danger" : "success"
                }`}
                style={{ fontWeight: "bold" }}
              >
                {data?.status}
              </td>
              <td>{data?.netAmount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PurchaseTable;
