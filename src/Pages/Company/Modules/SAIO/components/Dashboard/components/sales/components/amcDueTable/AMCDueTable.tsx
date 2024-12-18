import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { H4, H5 } from "../../../../../../../../../../AbstractElements";
import { useSelector } from "react-redux";

const AMCDueTable = () => {
  const amcDueHeader = ["Reg No.", "Renewal Date", "Charges", "Customer"];

  const { vehiclesByMonthData } = useSelector(
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
            {amcDueHeader.map((data, index) => (
              <th key={index}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vehiclesByMonthData?.map((data: any, index: any) => (
            <tr key={index}>
              <td>{data?.registrationNo}</td>
              <td>{data?.serviceRenewalDate}</td>
              <td>{data?.servicePackageDiscountedCharges}</td>
              <td>{data?.customer?.fullName}</td>
              {/* <td>{data.imei}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AMCDueTable;
