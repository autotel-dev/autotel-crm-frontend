import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { H4 } from "../../../../../../../../../../AbstractElements";
import { Href } from "../../../../../../../../../../utils/Constant";

const ProductsTable = () => {
  const productsHeader = [
    "Id",
    "product",
    "Price",
    "Units",
    "Use",
    "Available",
    "Check Availablity",
  ];

  const productsBody = [
    {
      id: "P-001",
      product: "ATS-100",
      price: "$44.54",
      units: 130,
      payment: "Paid",
      available: 40,
      use: 90,
      color1: "danger",
      color2: "success",
    },

    {
      id: "P-001",
      product: "ATS-100",
      price: "$44.54",
      units: 130,
      payment: "Paid",
      available: 40,
      use: 90,
      color1: "danger",
      color2: "success",
    },
    {
      id: "P-001",
      product: "ATS-100",
      price: "$44.54",
      units: 130,
      payment: "Paid",
      available: 40,
      use: 90,
      color1: "danger",
      color2: "success",
    },
    {
      id: "P-001",
      product: "ATS-100",
      price: "$44.54",
      units: 130,
      payment: "Paid",
      available: 40,
      use: 90,
      color1: "danger",
      color2: "success",
    },
    {
      id: "P-001",
      product: "ATS-100",
      price: "$44.54",
      units: 130,
      payment: "Paid",
      available: 40,
      use: 90,
      color1: "danger",
      color2: "success",
    },
    {
      id: "P-001",
      product: "ATS-100",
      price: "$44.54",
      units: 130,
      payment: "Paid",
      available: 40,
      use: 90,
      color1: "danger",
      color2: "success",
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
            {productsHeader.map((data, index) => (
              <th key={index}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productsBody.map((data, index) => (
            <tr key={index}>
              <td>{data.id}</td>
              <td>
                <div className="d-flex">
                  <div className="flex-grow-1 ms-2">
                    {/* <Link to={Href}> */}
                    <H4>{data.product}</H4>
                    {/* <span>{data.delivery}</span> */}
                    {/* </Link> */}
                  </div>
                </div>
              </td>
              <td>{data.price}</td>
              <td>{data.units}</td>
              <td
                className={`txt-${data.color1}`}
                style={{ fontWeight: "bold" }}
              >
                {data.use}
              </td>
              <td
                className={`txt-${data.color2}`}
                style={{ fontWeight: "bold" }}
              >
                {data.available}
              </td>
              <td>
                <Button color="success">View</Button>
              </td>
              {/* <td className={`txt-${data.color}`}>{data.status}</td> */}

              {/* <td>{data.amount}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductsTable;
