import { Card, CardBody, CardHeader, Col, Table } from "reactstrap";
import { H3, H4 } from "../../../../../../AbstractElements";

const CompletedAlerts = () => {
  const tableHeader = [
    "ID",
    "Device",
    "Alert",
    "Type",
    "Message",
    "address",
  ];

  const completedAlerts = [
    {
      id: "121",
      device: "device",
      date: "dateTime",
      alertt: "alert",
      type: "type",
      message: "message",
      address: "address",
    },
    {
      id: "122",
      device: "device",
      date: "dateTime",
      alertt: "alert",
      type: "type",
      message: "message",
      address: "address",
    },
    {
      id: "123",
      device: "device",
      date: "dateTime",
      alertt: "alert",
      type: "type",
      message: "message",
      address: "address",
    },
    {
      id: "124",
      device: "device",
      date: "dateTime",
      alertt: "alert",
      type: "type",
      message: "message",
      address: "address",
    },
    {
      id: "125",
      device: "device",
      date: "dateTime",
      alertt: "alert",
      type: "type",
      message: "message",
      address: "address",
    },
    {
      id: "122",
      device: "device",
      date: "dateTime",
      alertt: "alert",
      type: "type",
      message: "message",
      address: "address",
    },
    {
      id: "123",
      device: "device",
      date: "dateTime",
      alertt: "alert",
      type: "type",
      message: "message",
      address: "address",
    },
    {
      id: "124",
      device: "device",
      date: "dateTime",
      alertt: "alert",
      type: "type",
      message: "message",
      address: "address",
    },
    {
      id: "125",
      device: "device",
      date: "dateTime",
      alertt: "alert",
      type: "type",
      message: "message",
      address: "address",
    },
  ];

  return (
    <Card className="invoice-card">
      {/* <CardHeader className="pb-0">
        <div>
          <H3>Completed Alerts</H3>
        </div>
      </CardHeader> */}
      <CardBody className="transaction-card">
        <div className="table-responsive theme-scrollbar recent-wrapper">
          <Table className="display order-wrapper" id="recent-order">
            <thead>
              <tr>
                {tableHeader.map((data, index) => (
                  <th key={index}>{data}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {completedAlerts.map((data: any, index: any) => {
                if (index < 8) {
                  return (
                    <tr key={index}>
                      <td>{data.id}</td>
                      <td>
                        <div className="d-flex">
                          <div className="flex-grow-1 ms-2">
                            <H4>{data.device}</H4>
                            <span>{data.date}</span>
                          </div>
                        </div>
                      </td>

                      <td className={`txt-primary`}>{data.alertt}</td>
                      <td>{data.type}</td>
                      <td>{data.message}</td>
                      <td>{data.address}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default CompletedAlerts;
