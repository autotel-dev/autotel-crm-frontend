import { useEffect, useState } from "react";
import { Button, Col, FormGroup, Input, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { PlusCircle } from "react-feather";
import { getAll } from "../../../../../../../../Utilities/api";

import {
  GET_ACCOUNT_STATEMENT,
  GET_ALL_CUSTOMERS,
  GET_CUSTOMER_GENERAL_ACCOUNTS,
  IMAGE_BASE_URL,
} from "../../../../../../../../Utilities/api/apiEndpoints";

import Skeleton from "../../../../../../../Utilities/Skeleton/Skeleton";
import {
  setCustomerLedgers,
  setCustomers,
  setFromAccounts,
} from "../../../../../../../../ReaduxToolkit/Reducer/CustomerLedgerSlice";
import CreateNewCustomerLedger from "./CreateNewMakePayment/CreateNewCustomerLedger";
import { TbFileInvoice } from "react-icons/tb";
import { P } from "../../../../../../../../AbstractElements";
import SelectCustomerBox from "./CreateNewMakePayment/components/SelectCustomerBox";
import { SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import {
  Document,
  Page,
  PDFViewer,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import BackgroundImage from "../../../../../../../../assets/Background Image.png";

const CustomerLedgerTable = ({}) => {
  const dispatch = useDispatch();
  // Function to transform supportData into allBugReports format
  const { customerLedgers } = useSelector(
    (state: any) => state.customerLedgers
  );

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  function hexToRgb(hex: any) {
    // Remove the hash sign if present
    hex = hex?.replace(/^#/, "");
    // Parse the hex values to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  // Usage
  const hexColor = "#ff0000"; // Example hex color
  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor); // Convert hex to RGB
  // // console.log("support", support);
  const vendorLedgerData = () => {
    if (customerLedgers?.length > 0) {
      return customerLedgers.map((item: any, index: any) => ({
        date: `${item?.date.toString().slice(0, 10)},  ${new Date(item?.date)
          .toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .toString()}`,
        reference: item.reference,
        narration: item.narration,
        debit: item.debit,
        credit: item.credit,
        balance: item.balance,
      }));
    }
  };

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setData(vendorLedgerData());
  }, [searchValue]);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  useEffect(() => {
    setData(vendorLedgerData());
    console.log("customerLedgers", customerLedgers);
  }, [customerLedgers]);

  const navigate = useNavigate();
  // const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [data, setData] = useState(vendorLedgerData());

  useEffect(() => {
    getAll({ url: GET_ALL_CUSTOMERS }).then((data: any) => {
      if (data?.success) {
        dispatch(setCustomers(data.data));
      }
    });

    getAll({ url: GET_CUSTOMER_GENERAL_ACCOUNTS }).then((data: any) => {
      if (data?.success) {
        dispatch(setFromAccounts(data.data));
      }
    });
  }, []);

  const [customer, setCustomer] = useState("");
  const [accountId, setAccountId] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  const [loading, setLoading] = useState(false);

  const addVendorLedger: SubmitHandler<any> = async (data) => {
    setLoading(true);
    if (accountId !== "" && startDate !== "" && endDate !== "") {
      try {
        const response: any = await getAll({
          url: `${GET_ACCOUNT_STATEMENT}?accountId=${accountId}&startDate=${startDate}&endDate=${endDate}`,
        });
        if (response.success) {
          console.log("data", response.data.statement);
          setReportName(`${customer} Ledger`);
          dispatch(setCustomerLedgers(response.data.statement));
          setLoading(false);
        } else {
          Swal.fire({
            text: response.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
        }
      } catch (error: any) {
        Swal.fire({
          text: error.message || "Error creating Expense",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
      }
    } else {
      Swal.fire({
        text: "Please fill in all the fields",
        icon: "info",
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: true,
      });
      setLoading(false);
    }
  };

  const styles2 = StyleSheet.create({
    page: { padding: 20 },
    section: { marginBottom: 10 },
    text: {
      fontSize: 8,
    },
    reportName: {
      justifyContent: "center",
      alignItems: "center",
    },
    titleName: {
      fontSize: 12,
    },
    titleText: {
      fontSize: 16,
    },
    companyDetails: {
      fontSize: 12,
      maxWidth: "200px",
    },
    detailsRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingVertical: 3,
    },
    tableContainer: {
      width: "100%",
      height: "auto",
      border: "2px solid black",
    },
    tableRowForHeader: {
      flexDirection: "row",
      borderBottom: "2px solid black",
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: "1px solid black",
      borderColor: "gray",
    },
    tableCell: {
      paddingVertical: 7,
      paddingLeft: 7,
      fontSize: "7.5px",
      margin: -1,
      fontWeight: "extrabold",
    },
    headerCell: {
      paddingVertical: 10,
      paddingLeft: 7,
      margin: -1,
      fontFamily: "Helvetica-Bold",
      fontSize: "9.5px",
    },
    image: {
      minWidth: "150px",
      maxWidth: "160px",
      height: "80px",
    },
    header: {
      flexDirection: "row",
      marginBottom: 10,
      justifyContent: "space-between",
    },
  });
  const [header, setHeader]: any = useState([]);
  const [reportName, setReportName]: any = useState("");
  const [pdfData, setPdfData] = useState([]);

  // Function to calculate the max width of each column or distribute evenly
  const getColumnWidths = () => {
    const totalColumns = header?.length;
    if (pdfData?.length === 0) {
      return Array(totalColumns).fill(100); // If no data, make each column equal width
    }
    const widths = header?.map((headerItem: any) => {
      let maxLength = headerItem.label.length; // Initialize with the label length
      // Check max length from data values for each column
      pdfData?.forEach((item: any) => {
        const itemLength = String(item[headerItem.value] || "").length;
        if (itemLength > maxLength) {
          maxLength = itemLength;
        }
      });
      return maxLength * 7; // Multiply by a factor to ensure enough space for text (7px per character)
    });
    // If there is less data, distribute columns evenly across the page
    const totalWidth = widths?.reduce((sum: any, width: any) => sum + width, 0);
    if (totalWidth < 800) {
      return Array(totalColumns).fill(800 / totalColumns); // Distribute evenly if total width is too small
    }
    return widths;
  };

  const columnWidths = getColumnWidths(); // Get dynamic column widths

  const PDFDcoument = () => (
    <Document>
      <Page size={[842.89, 555.28]} style={styles2.page}>
        <View style={styles2.section}>
          <View style={styles2.header}>
            <Image
              src={
                userPersonalizationData !== null &&
                userPersonalizationData?.loginPageLogo.url !== ""
                  ? `${IMAGE_BASE_URL}/${userPersonalizationData?.loginPageLogo.url}`
                  : BackgroundImage
              }
              style={styles2.image}
            />
            <View style={styles2.reportName}>
              <View>
                <Text style={styles2.titleName}>Report Name:</Text>
              </View>
              <View>
                <Text style={styles2.titleText}>{reportName}</Text>
              </View>
            </View>
            <View style={styles2.companyDetails}>
              <View style={styles2.detailsRow}>
                <Text style={styles2.titleName}> Name: &nbsp;</Text>
                <Text style={styles2.titleName}>
                  abc@gmail.com
                  {userPersonalizationData?.user?.emailAddress}
                </Text>
              </View>
              <View style={styles2.detailsRow}>
                <Text style={styles2.titleName}> Email: &nbsp;</Text>
                <Text style={styles2.titleName}>
                  abc@gmail.com
                  {userPersonalizationData?.user?.emailAddress}
                </Text>
              </View>
              <View style={styles2.detailsRow}>
                <Text style={styles2.titleName}> Address: &nbsp;</Text>
                <Text style={styles2.titleName}>
                  abc address
                  {userPersonalizationData?.user?.emailAddress}
                </Text>
              </View>
              <View style={styles2.detailsRow}>
                <Text style={styles2.titleName}> Phone: &nbsp;</Text>
                <Text style={styles2.titleName}>
                  021-36215572
                  {userPersonalizationData?.user?.emailAddress}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles2.text}></Text>
          <br />

          <br />
          <View style={styles2.tableContainer}>
            {/* Table Header */}
            <View style={styles2.tableRowForHeader}>
              {header &&
                Array.isArray(header) &&
                header?.map((item: any, index: any) => (
                  <Text
                    style={[styles2.headerCell, { width: columnWidths[index] }]}
                    key={index}
                  >
                    {item.label}
                  </Text>
                ))}
            </View>

            {/* Table Data */}
            {pdfData?.map((item: any, index: any) => (
              <View style={styles2.tableRow} key={index}>
                {header?.map((headerItem: any, headerIndex: number) => {
                  const value = item[headerItem.value];
                  return (
                    <Text
                      style={[
                        styles2.tableCell,
                        { width: columnWidths[headerIndex] },
                      ]}
                      key={headerIndex}
                    >
                      {value || "N/A"}
                    </Text>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  return (
    <div
      className="table-responsive support-table"
      style={{ overflow: "auto", scrollbarWidth: "none" }}
    >
      <Row>
        <div
          style={{
            display: "flex",
            gap: "20px",
            // justifyContent: "end",
            paddingRight: "25px",
            paddingLeft: "25px",
            alignItems: "center",
          }}
        >
          <Col md={3}>
            <FormGroup>
              <div>
                <P>
                  Select Vendor
                  <span className="txt-danger">*</span>
                </P>
              </div>
              <SelectCustomerBox
                placeholder="Select Customer"
                setCustomer={setCustomer}
                customer={customer}
                setAccountId={setAccountId}
                accountId={accountId}
                // disabled={receiveMoney !== null}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <P>
                From Date
                <span className="txt-danger">*</span>
              </P>
              <Input
                type="date"
                placeholder="Enter Date "
                value={startDate}
                name="startDate"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <P>
                To Date
                <span className="txt-danger">*</span>
              </P>
              <Input
                type="date"
                placeholder="Enter Date "
                value={endDate}
                name="endDate"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col xs={3} style={{ marginTop: "15px" }}>
            {customerLedgers.length > 0 && (
              <Button
                style={{ marginRight: "10px" }}
                color="primary"
                disabled={loading}
                onClick={() => {
                  dispatch(setCustomerLedgers([]));
                  setCustomer("");
                  setAccountId("");
                  setStartDate(new Date().toISOString().slice(0, 10));
                  setEndDate(new Date().toISOString().slice(0, 10));
                }}
              >
                Cancel
              </Button>
            )}

            {customerLedgers.length == 0 && (
              <Button
                disabled={loading}
                color="primary"
                onClick={addVendorLedger}
              >
                {loading ? "Loading..." : "Generate"}
              </Button>
            )}
            {customerLedgers.length > 0 && (
              <PDFDownloadLink
                document={<PDFDcoument />} // PDF content to be downloaded
                fileName={`${reportName} .pdf`} // Name of the file to be downloaded
              >
                <Button
                  disabled={loading}
                  color="primary"
                  onClick={() => {
                    var columns = [
                      { label: "Date", value: "date" },
                      { label: "Reference", value: "reference" },
                      { label: "Narration", value: "narration" },
                      {
                        label: "Debit",
                        value: "debit",
                      },
                      {
                        label: "Credit",
                        value: "credit",
                      },
                      {
                        label: "Balance",
                        value: "balance",
                      },
                    ];
                    var rowData = customerLedgers.map(
                      (item: any, index: any) => {
                        return {
                          date: `${item?.date
                            .toString()
                            .slice(0, 10)},  ${new Date(item?.date)
                            .toLocaleString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                            .toString()}`,
                          reference: item.reference,
                          narration: item.narration,
                          debit: item.debit,
                          credit: item.credit,
                          balance: item.balance,
                        };
                      }
                    );
                    setHeader(columns);
                    setPdfData(rowData);
                  }}
                >
                  Download
                </Button>
              </PDFDownloadLink>
            )}
          </Col>
          {/* <CreateNewVendorLedger /> */}
        </div>
      </Row>
      <Row style={{ display: "flex", alignItems: "center" }}>
        <Col sm={12} md={12} lg={12} xl={12}>
          <input
            className="global-search-field"
            type="text"
            placeholder="Type to Search.."
            value={searchValue}
            onChange={(e) => {
              handleSearch(e);
            }}
          />
        </Col>
      </Row>

      <DataTable
        columns={[
          {
            name: "Date",
            selector: (row: any) => row["date"],
            sortable: true,
            width: "15%",
          },
          {
            name: "Narration",
            selector: (row: any) => row["narration"],
            sortable: true,
            width: "35%",
          },
          {
            name: "Refernce",
            selector: (row: any) => row["reference"],
            sortable: true,
            width: "15%",
          },

          {
            name: "Debit",
            selector: (row: any) => row["debit"],
            sortable: true,
            width: "8%",
          },
          {
            name: "Credit",
            selector: (row: any) => row["credit"],
            sortable: true,
            width: "8%",
          },
          {
            name: "Balance",
            selector: (row: any) => row["balance"],
            sortable: true,
            width: "8%",
          },
        ]}
        data={data}
        pagination
        selectableRows
        clearSelectedRows={toggleDelete}
        style={{
          cursor: "pointer",
        }}
        className="custom-data-table"
        customStyles={{
          rows: {
            style: {
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`,
              },
            },
          },
          head: {
            style: {
              fontWeight: "bold",
              fontSize: "13px",
            },
          },
        }}
      />

      <style>
        {`
       .custom-data-table thead th {
        text-align: center !important;
      }
      `}
      </style>
    </div>
  );
};

export default CustomerLedgerTable;
