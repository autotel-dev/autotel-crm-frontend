import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { H4, H5 } from "../../../../../../../../../../AbstractElements";

const AMCDueTable = () => {
  const amcDueHeader = ["Vehicle", , "Date", "Latitude", "Longitude", "imei"];

  const amcDueBody = [
    {
      vehicle: "SIR-0098",
      date: "Aug 15,2023",
      latitude: 22.676769,
      longitude: 67.676769,
      imei: "1989787887787878",
    },
    {
      vehicle: "SIR-0098",
      date: "Aug 15,2023",
      latitude: 22.676769,
      longitude: 67.676769,
      imei: "1989787887787878",
    },
    {
      vehicle: "SIR-0098",
      date: "Aug 15,2023",
      latitude: 22.676769,
      longitude: 67.676769,
      imei: "1989787887787878",
    },
    {
      vehicle: "SIR-0098",
      date: "Aug 15,2023",
      latitude: 22.676769,
      longitude: 67.676769,
      imei: "1989787887787878",
    },
    {
      vehicle: "SIR-0098",
      date: "Aug 15,2023",
      latitude: 22.676769,
      longitude: 67.676769,
      imei: "1989787887787878",
    },
    {
      vehicle: "SIR-0098",
      date: "Aug 15,2023",
      latitude: 22.676769,
      longitude: 67.676769,
      imei: "1989787887787878",
    },
    {
      vehicle: "SIR-0098",
      date: "Aug 15,2023",
      latitude: 22.676769,
      longitude: 67.676769,
      imei: "1989787887787878",
    },
  ];
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
          {amcDueBody.map((data, index) => (
            <tr key={index}>
              <td>{data.vehicle}</td>
              <td>{data.date}</td>
              <td>{data.latitude}</td>
              <td>{data.longitude}</td>
              <td>{data.imei}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AMCDueTable;
