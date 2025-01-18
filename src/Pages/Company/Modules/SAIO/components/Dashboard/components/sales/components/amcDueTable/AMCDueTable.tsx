import { Link, useNavigate } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { H4, H5 } from "../../../../../../../../../../AbstractElements";
import { useSelector } from "react-redux";
import { TbFileInvoice } from "react-icons/tb";
import {
  setInvoiceData,
  setIsInvoiceRenwed,
} from "../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import { useDispatch } from "react-redux";

const AMCDueTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const amcDueHeader = [
    "Reg No.",
    "Renewal Date",
    "Charges",
    "Customer",
    "Actions",
  ];

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
            <tr key={index} style={{ cursor: "default" }}>
              <td>{data?.registrationNo}</td>
              <td>
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <div style={{ fontSize: "12px" }}>
                      {data?.serviceRenewalDate.slice(0, 10)}
                    </div>

                    <div style={{ fontSize: "12px" }}>
                      {(() => {
                        // Extract the time part from the ISO string
                        const timeStr = data?.serviceRenewalDate.slice(11, 19); // Get the time part "HH:MM:SS"

                        // Convert to 12-hour format with AM/PM
                        const hours24 = parseInt(timeStr.slice(0, 2)); // Get the hours (0-23)
                        const minutes = timeStr.slice(3, 5); // Get the minutes (00-59)
                        const seconds = timeStr.slice(6, 8); // Get the seconds (00-59)

                        // Determine AM or PM
                        const period = hours24 >= 12 ? "PM" : "AM";

                        // Convert to 12-hour format
                        const hours12 = hours24 % 12 || 12; // Convert 0 to 12 (midnight), 13-23 to 1-11 PM

                        // Format time in 12-hour format with AM/PM
                        return `${hours12}:${minutes}:${seconds} ${period}`;
                      })()}
                    </div>
                  </div>
                </div>
              </td>
              <td>{data?.servicePackageDiscountedCharges}</td>
              <td>{data?.customer?.fullName}</td>
              <td>
                <TbFileInvoice
                  size={20}
                  cursor="pointer"
                  onClick={() => {
                    const updatedData = {
                      vehicles: [data.registratioNo],
                      ...data,
                    };
                    dispatch(setInvoiceData(updatedData));
                    dispatch(setIsInvoiceRenwed(true));
                    navigate(
                      `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/invoices/create-invoice`
                    );
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AMCDueTable;
