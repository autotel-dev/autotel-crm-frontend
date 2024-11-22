import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { H4, H5 } from "../../../../../../../../../../AbstractElements";

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
    {
      id: "S-INV-003",
      img: "03",
      customer: "Talha",
      delivery: "Free delivery",
      date: "May 08,2023",
      payment: "Paid",
      //   status: "Cancel",
      amount: "$64.16",
      color: "success",
    },
    {
      id: "S-INV-004",
      img: "04",
      customer: "Salman",
      delivery: "$12.55 delivery",
      date: "Feb 14,2023",
      payment: "Unpaid",
      //   status: "Delivered",
      amount: "$35.95",
      color: "danger",
    },
    {
      id: "S-INV-005",
      img: "04",
      customer: "Salman",
      delivery: "$12.55 delivery",
      date: "Feb 14,2023",
      payment: "Unpaid",
      //   status: "Delivered",
      amount: "$35.95",
      color: "danger",
    },
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
    {
      id: "S-INV-003",
      img: "03",
      customer: "Talha",
      delivery: "Free delivery",
      date: "May 08,2023",
      payment: "Paid",
      //   status: "Cancel",
      amount: "$64.16",
      color: "success",
    },
    {
      id: "S-INV-004",
      img: "04",
      customer: "Salman",
      delivery: "$12.55 delivery",
      date: "Feb 14,2023",
      payment: "Unpaid",
      //   status: "Delivered",
      amount: "$35.95",
      color: "danger",
    },
    {
      id: "S-INV-005",
      img: "04",
      customer: "Salman",
      delivery: "$12.55 delivery",
      date: "Feb 14,2023",
      payment: "Unpaid",
      //   status: "Delivered",
      amount: "$35.95",
      color: "danger",
    },
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
            {salesHeader.map((data, index) => (
              <th key={index}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SalesBody.map((data, index) => (
            <tr key={index}>
              <td>{data.id}</td>
              <td>
                <div className="d-flex">
                  <div className="flex-grow-1 ms-2">
                    {/* <Link to={Href}> */}
                    <H5>{data.customer}</H5>
                    {/* <span>{data.delivery}</span> */}
                    {/* </Link> */}
                  </div>
                </div>
              </td>
              <td>{data.date}</td>
              {/* <td>
                <Button color="transperant">{data.payment}</Button>
              </td> */}
              {/* <td className={`txt-${data.color}`}>{data.status}</td> */}
              <td
                className={`txt-${data.color}`}
                style={{ fontWeight: "bold" }}
              >
                {data.payment}
              </td>
              <td>{data.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SalesTable;
