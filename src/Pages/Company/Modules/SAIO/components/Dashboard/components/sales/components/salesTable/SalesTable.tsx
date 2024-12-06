import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { H4, H5 } from "../../../../../../../../../../AbstractElements";
import { useSelector } from "react-redux";

const SalesTable = () => {
  const salesHeader = ["Id", "Customer", "Date", "Payment", "Total"];

  const SalesBody = [
    {
      id: "S-INV-001",
      img: "01",
      customer: "Ali",
      delivery: "Free delivery",
      date: "Aug 15,2023",
      payment: "Paid",
      //   status: "Delivered",
      amount: "$44.54",
      color: "success",
    },
    {
      id: "S-INV-002",
      img: "02",
      customer: "Bilal",
      delivery: "$83.97 delivery",
      date: "Aug 25,2023",
      payment: "Paid",
      //   status: "Pending",
      amount: "$51.50",
      color: "success",
    },
  ];

  const { recentSalesData } = useSelector((state: any) => state.salesDashboard);
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
            {salesHeader.map((data, index) => (
              <th key={index}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentSalesData?.map((data: any, index: any) => (
            <tr key={data._id}>
              <td>S-INV-{index}</td>
              <td>
                <div className="d-flex">
                  <div className="flex-grow-1 ms-2">
                    <H5>{data?.customerName}</H5>
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
              <td>{data?.grossAmount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SalesTable;
