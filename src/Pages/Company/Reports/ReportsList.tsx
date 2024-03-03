import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";

import { useEffect, useState } from "react";
// import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./reportsStyle.css";
import CommonHeader from "../../../Common/CommonHeader";
import Loader from "../../Loader/Loader";
import xlsx from "json-as-xlsx";

const ReportsList = () => {
  //   const { reports } = useSelector((state: any) => state.roles);
  const dispatch = useDispatch();
  const reports = [
    {
      _id: "1",
      name: "Bilal",
      age: "23",
    },
    {
      _id: "2",
      name: "Talha",
      age: "23",
    },
    {
      _id: "3",
      name: "Osama",
      age: "23",
    },
    {
      _id: "4",
      name: "Salman",
      age: "23",
    },
    {
      _id: "5",
      name: "Ali",
      age: "23",
    },
  ];

  let data = [
    {
      sheet: "Children",
      columns: [
        { label: "User", value: "user" }, // Top level data
        { label: "Age", value: "age", format: '# "years"' }, // Column format
        { label: "Phone", value: "more.phone", format: "(###) ###-####" }, // Deep props and column format
      ],
      content: [
        { user: "Manuel", age: 16, more: { phone: 9999999900 } },
        { user: "Ana", age: 17, more: { phone: 8765432135 } },
      ],
    },
  ];

  const [loading, setLoading] = useState(false);
  const renderTableRows = () => {
    return reports?.map((row: any) => (
      <tr key={row._id}>
        <td>{row._id}</td>
        <td>{row.name}</td>
        <td>{row.age}</td>

        <td>
          <div>
            <button
              style={{
                width: "100px",
                fontSize: 14,
                padding: "10px",
                color: "white",
                backgroundColor: "red",
                borderRadius: "5px",
                marginRight: "5px",
                border: "none",
              }}
              onClick={() => {
                let settings = {
                  fileName: "My User Reports", // Name of the resulting spreadsheet
                  extraLength: 3, // A bigger number means that columns will be wider
                  writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
                  writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
                  RTL: false, // Display the columns from right-to-left (the default value is false)
                };

                xlsx(data, settings);
              }}
            >
              Download
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Container fluid>
        <Col sm="12">
          <Card>
            <CommonHeader title="All Roles" />
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  <Loader />
                ) : reports?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Age</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>{renderTableRows()}</tbody>
                    </table>
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                  >
                    No Reports Found
                  </div>
                )}

                {/* )} */}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default ReportsList;
