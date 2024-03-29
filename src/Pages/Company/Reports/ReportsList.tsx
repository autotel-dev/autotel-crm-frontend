import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  // Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardHeader,
  // Button,
} from "reactstrap";

import { useEffect, useState } from "react";
// import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./reportsStyle.css";
import CommonHeader from "../../../Common/CommonHeader";
import Loader from "../../Loader/Loader";
import xlsx from "json-as-xlsx";
import ViewModal from "./ViewModal/ViewModal";
import { Menu, Dropdown, Button, message, Space, Tooltip } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { setReports } from "../../../ReaduxToolkit/Reducer/ReportsSlice";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { H4 } from "../../../AbstractElements";

const ReportsList = () => {
  const { reports } = useSelector((state: any) => state.reports);
  // console.log("Reports in list", reports);

  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Select Type");
  const openDropdown = () => setDropdownOpen(true);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  function handleButtonClick(
    e: any,
    settings: any,
    excelData: any,
    index: any
  ) {
    // message.info("Click on left button.");
    // console.log("click left button", e);
    if (selectedTypes[index] === "Excel") {
      xlsx(excelData, settings);
    }
    // else if (selectedTypes[index] === "PDF") {
    //   downloadPDF();
    // }

    // Perform your onClick logic here
    // console.log(`Button clicked with type: ${selectedTypes}`);
  }

  const [selectedTypes, setSelectedTypes]: any = useState({});

  function handleMenuClick(e: any, type: any, index: any) {
    // message.info("Click on menu item.");
    setSelectedTypes((prevSelectedTypes: any) => ({
      ...prevSelectedTypes,
      [index]: type,
    }));
    // console.log("click", e);
  }

  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);

  const pdfData = {
    reportTableHeaders: [
      "Id",
      "Event Id",
      "Device Id",
      "Device Name",
      "Latitude",
      "Longitude",
      "Speed",
      "Type",
      "Message",
      "User Role",
      "Completion Response",
      "Alert Event Close Date",
      "Created At",
    ],
    reportData: [
      {
        "Event Id": "abc",
        "Device Id": "abc",
        "Device Name": "abc",
        Latitude: "abc",
        Longitude: "abc",
        Speed: "abc",
        Type: "abc",
        Message: "abc",
        "User Role": "abc",
        "Completion Response": "abc",
        "Alert Event Close Date": "abc",
        "Created At": "abc",
      },
      {
        "Event Id": "abc",
        "Device Id": "abc",
        "Device Name": "abc",
        Latitude: "abc",
        Longitude: "abc",
        Speed: "abc",
        Type: "abc",
        Message: "abc",
        "User Role": "abc",
        "Completion Response": "abc",
        "Alert Event Close Date": "abc",
        "Created At": "abc",
      },
      {
        "Event Id": "abc",
        "Device Id": "abc",
        "Device Name": "abc",
        Latitude: "abc",
        Longitude: "abc",
        Speed: "abc",
        Type: "abc",
        Message: "abc",
        "User Role": "abc",
        "Completion Response": "abc",
        "Alert Event Close Date": "abc",
        "Created At": "abc",
      },
    ],
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Construct HTML for the table
    const tableHTML = `
      <table>
        <thead>
          <tr>
            ${pdfData.reportTableHeaders
              .map((header) => `<th>${header}</th>`)
              .join("")}
          </tr>
        </thead>
        <tbody>
          ${pdfData.reportData
            .map(
              (row) => `
            <tr>
              ${Object.values(row)
                .map((cell) => `<td>${cell}</td>`)
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    // Convert HTML to PDF
    doc.html(tableHTML, {
      callback: (pdf) => {
        pdf.save("report.pdf");
      },
    });
  };
  // const downloadPDF = () => {
  //   const doc = new jsPDF();

  //   // Construct table data
  //   const tableData = pdfData.reportData.map((data: any) =>
  //     pdfData.reportTableHeaders.map(
  //       (header: any) => data[header.toLowerCase()]
  //     )
  //   );
  //   // console.log(tableData);

  //   // // Add headers
  //   // doc.({
  //   //   head: [pdfData.reportTableHeaders],
  //   //   body: tableData,
  //   // });

  //   // Save PDF
  //   doc.save("report.pdf");
  // };

  const renderTableRows = () => {
    return reports.map((row: any, index: any) => (
      <tr key={index}>
        <td style={{ width: "20%" }}>{index + 1}</td>
        <td style={{ width: "20%" }}>{row.title}</td>
        <td style={{ width: "15%" }}>{row.startDate.slice(0, 10)}</td>
        <td style={{ width: "15%" }}>{row.endDate.slice(0, 10)}</td>
        <td>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ backgroundColor: "green", borderRadius: "5px" }}>
              <Dropdown.Button
                type="primary"
                // className="ant-btn-primary"
                onClick={(e: any) => {
                  let settings = {
                    fileName: row.title, // Name of the resulting spreadsheet
                    extraLength: 3, // A bigger number means that columns will be wider
                    writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
                    writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
                    RTL: false, // Display the columns from right-to-left (the default value is false)
                  };
                  let data = [
                    {
                      sheet: "Sheet 1",

                      columns: [
                        { label: "Id", value: "_id" },
                        { label: "Event Id", value: "eventId" },
                        { label: "Device Id", value: "deviceId" },
                        { label: "Device Name", value: "deviceName" },
                        { label: "Latitude", value: "latitude" },
                        { label: "Longitude", value: "longitude" },
                        { label: "Speed", value: "speed" },
                        { label: "Type", value: "type" },
                        { label: "Message", value: "message" },
                        { label: "User Role", value: "userRole" },
                        {
                          label: "completionResponse",
                          value: "completionResponse",
                        },
                        {
                          label: "alertEventCloseDate",
                          value: "alertEventCloseDate",
                        },
                        { label: "createdAt", value: "createdAt" },
                      ],
                      content: row.data.reportData,
                    },
                  ];
                  handleButtonClick(e, settings, data, index);
                }}
                placement="bottomLeft"
                overlay={
                  <Menu>
                    <Menu.Item
                      key="1"
                      icon={<UserOutlined />}
                      onClick={(e: any) => {
                        handleMenuClick(e, "Excel", index);
                        // console.log(e);
                      }}
                    >
                      Excel
                    </Menu.Item>
                    {/* <Menu.Item
                      key="2"
                      icon={<UserOutlined />}
                      onClick={(e: any) => {
                        handleMenuClick(e, "PDF", index);
                        // console.log(e);
                      }}
                    >
                      PDF
                    </Menu.Item> */}
                  </Menu>
                }
              >
                {selectedTypes[index] || selectedType}
              </Dropdown.Button>
            </div>

            <button
              style={{
                width: "100px",
                fontSize: 14,
                padding: "5px",
                color: "white",
                backgroundColor: "red",
                borderRadius: "5px",
                marginRight: "5px",
                border: "none",
                marginLeft: "10px",
              }}
              onClick={() => {
                setIsUpdateModalOpen(true);
                setDataList(row.data.reportData);
                setTableHeader(row.data.reportTableHeaders);
              }}
            >
              View
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  useEffect(() => {
    dispatch(setReports([]));
    setIsUpdateModalOpen(false);
  }, []);

  return (
    <>
      <Container fluid>
        <Col sm="12">
          <Card>
          <CardHeader className="pb-0">
            <H4>All Reports</H4>
          </CardHeader>
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  <Loader />
                ) : reports?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <td style={{ width: "20%" }}>Report No</td>
                          <td style={{ width: "20%" }}>Title</td>
                          <td style={{ width: "15%" }}>Start Date</td>
                          <td style={{ width: "15%" }}>End Date</td>

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

              <ViewModal
                isVisible={isUpdateModalOpen}
                setIsVisible={setIsUpdateModalOpen}
                dataList={dataList}
                tableHeader={tableHeader}
              />
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default ReportsList;
