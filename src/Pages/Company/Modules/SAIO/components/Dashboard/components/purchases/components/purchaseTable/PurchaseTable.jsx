import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { H4 } from "../../../../../../../../../../AbstractElements";
import { Href } from "../../../../../../../../../../utils/Constant";

const PurchaseTable = () => {
  const purchaseHeader = ["Id", "Vendor", "Date", "Payment", "Total"];

  const purchaseBody = [
    {
      id: "P-001",
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
      id: "P-001",
      img: "02",
      vendor: "Bilal",
      delivery: "$83.97 delivery",
      date: "Aug 25,2023",
      payment: "Paid",
      //   status: "Pending",
      amount: "$51.50",
      color: "success",
    },
    {
      id: "P-001",
      img: "03",
      vendor: "Talha",
      delivery: "Free delivery",
      date: "May 08,2023",
      payment: "Paid",
      //   status: "Cancel",
      amount: "$64.16",
      color: "success",
    },
    {
      id: "P-001",
      img: "04",
      vendor: "Salman",
      delivery: "$12.55 delivery",
      date: "Feb 14,2023",
      payment: "Unpaid",
      //   status: "Delivered",
      amount: "$35.95",
      color: "danger",
    },
    // {
    //   id: "P-001",
    //   img: "01",
    //   vendor: "Ali",
    //   delivery: "Free delivery",
    //   date: "Aug 15,2023",
    //   payment: "Paid",
    //   //   status: "Delivered",
    //   amount: "$44.54",
    //   color: "success",
    // },
    // {
    //   id: "P-001",
    //   img: "02",
    //   vendor: "Bilal",
    //   delivery: "$83.97 delivery",
    //   date: "Aug 25,2023",
    //   payment: "Paid",
    //   //   status: "Pending",
    //   amount: "$51.50",
    //   color: "success",
    // },
    // {
    //   id: "P-001",
    //   img: "01",
    //   vendor: "Ali",
    //   delivery: "Free delivery",
    //   date: "Aug 15,2023",
    //   payment: "Paid",
    //   //   status: "Delivered",
    //   amount: "$44.54",
    //   color: "success",
    // },
    // {
    //   id: "P-001",
    //   img: "02",
    //   vendor: "Bilal",
    //   delivery: "$83.97 delivery",
    //   date: "Aug 25,2023",
    //   payment: "Paid",
    //   //   status: "Pending",
    //   amount: "$51.50",
    //   color: "success",
    // },
  ];
  return (
    <div
      className="table-responsive theme-scrollbar recent-wrapper"
      style={{
        maxHeight: "50vh",
        minHeight: "50vh",
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
          {purchaseBody.map((data, index) => (
            <tr key={index}>
              <td>{data.id}</td>
              <td>
                <div className="d-flex">
                  <div className="flex-grow-1 ms-2">
                    {/* <Link to={Href}> */}
                    <H4>{data.vendor}</H4>
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

export default PurchaseTable;
