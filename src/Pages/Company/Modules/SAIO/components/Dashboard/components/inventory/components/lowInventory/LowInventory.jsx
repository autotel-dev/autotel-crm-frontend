import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { H4 } from "../../../../../../../../../../AbstractElements";
import { Href } from "../../../../../../../../../../utils/Constant";

const LowInventory = () => {
  const productsHeader = [
    "Id",
    "product",
    "Available Units",
    "Check Availability",
  ];

  const productsBody = [
    {
      id: "P-001",
      product: "ATS-100",
      availableUnits: 90,
      color1: "danger",
    },

    {
      id: "P-001",
      product: "ATS-100",
      availableUnits: 90,
      color1: "danger",
    },
    {
      id: "P-001",
      product: "ATS-100",
      availableUnits: 90,
      color1: "danger",
    },
    {
      id: "P-001",
      product: "ATS-100",
      availableUnits: 90,
      color1: "danger",
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
                    <H4>{data.product}</H4>
                  </div>
                </div>
              </td>
              <td
                className={`txt-${data.color1}`}
                style={{ fontWeight: "bold" }}
              >
                {data.availableUnits}
              </td>

              <td>
                <Button color="success">View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default LowInventory;
