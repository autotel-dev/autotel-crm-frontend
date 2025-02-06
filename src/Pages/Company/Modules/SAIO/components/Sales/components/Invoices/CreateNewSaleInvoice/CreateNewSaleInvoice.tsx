import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Container,
  Card,
  CardBody,
  Modal,
  ModalBody,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { P } from "../../../../../../../../../AbstractElements";
import { SubmitHandler } from "react-hook-form";

import jsPDF from "jspdf";
import "jspdf-autotable";
import BcakgroundImage from "../../../../../../../../../assets/Background Image.png";

import {
  setPurchaseInvoice,
  setPurchaseInvoices,
} from "../../../../../../../../../ReaduxToolkit/Reducer/PurchaseInvoiceSlice";
import { Select } from "antd";
import {
  create,
  getAll,
  patch,
} from "../../../../../../../../../Utilities/api";
import {
  CREATE_SALE_INVOICE,
  GET_ALL_SALE_INVOICES,
  SALE_INVOICE_STATUS_APPROVED,
} from "../../../../../../../../../Utilities/api/apiEndpoints";
import Swal from "sweetalert2";
import {
  StyleSheet,
  Document,
  Page,
  Text,
  View,
  pdf,
  Image,
} from "@react-pdf/renderer";

import { useNavigate } from "react-router-dom";
import {
  setSaleInvoice,
  setSaleInvoiceLoading,
} from "../../../../../../../../../ReaduxToolkit/Reducer/SaleInvoiceSlice";
import {
  setInvoiceData,
  setIsInvoiceRenwed,
} from "../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";

const CreateNewSaleInvoice = ({}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedTax, setSelectedTax] = useState(0);

  const { invoiceData, isInvoiceRenwed } = useSelector(
    (state: any) => state.sales
  );
  const { saleInvoice } = useSelector((state: any) => state.saleInvoice);
  const { taxes } = useSelector((state: any) => state.taxes);
  // console.log("invoiceData", invoiceData);
  const [saleInvoiceForm, setSaleInvoiceForm] = useState({
    invoiceDate: isInvoiceRenwed
      ? invoiceData.serviceRenewalDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    invoiceDueDate: isInvoiceRenwed
      ? invoiceData.serviceRenewalDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    reference: "",
    comments: "",
    additionalCharges: 0,
    withHoldingCharges: 0,
    discount:
      invoiceData !== null
        ? isInvoiceRenwed
          ? invoiceData?.servicePackageDiscountedCharges * 1
          : invoiceData?.discounted_service_charges *
            invoiceData?.vehicles?.length
        : "",
    netAmount:
      invoiceData !== null
        ? isInvoiceRenwed
          ? invoiceData?.servicePackageDiscountedCharges * 1
          : invoiceData?.service_charges * invoiceData?.vehicles?.length
        : "",

    grossAmount:
      invoiceData !== null
        ? isInvoiceRenwed
          ? invoiceData?.servicePackageDiscountedCharges * 1
          : invoiceData?.discounted_service_charges *
            invoiceData?.vehicles?.length
        : "",
    customer: invoiceData !== null ? invoiceData?.customer?._id : "",
    customerName: invoiceData !== null ? invoiceData?.customer?.fullName : "",
    customerEmail:
      invoiceData !== null ? invoiceData?.customer?.emailAddress : "",
    companyName: invoiceData !== null ? invoiceData?.customer?.fullName : "",
    address: "",
    packagePrice:
      invoiceData !== null
        ? isInvoiceRenwed
          ? invoiceData?.servicePackageDiscountedCharges
          : invoiceData?.service_charges
        : "",
    discountedPackagePrice:
      invoiceData !== null
        ? isInvoiceRenwed
          ? invoiceData?.servicePackageDiscountedCharges
          : invoiceData?.discounted_service_charges
        : "",
  });

  const {
    invoiceDate,
    invoiceDueDate,
    reference,
    comments,
    additionalCharges,
    withHoldingCharges,
    discount,
    netAmount,
    grossAmount,
    customer,
    customerName,
    customerEmail,
    companyName,
    address,
    packagePrice,
    discountedPackagePrice,
  } = saleInvoiceForm;

  const getUserData = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    let name = event.target.name;
    let value = event.target.value;
    setSaleInvoiceForm({ ...saleInvoiceForm, [name]: value });
  };

  useEffect(() => {
    var netAmount = Number(discount);
    if (additionalCharges >= 0) {
      netAmount = Number(discount) + Number(additionalCharges);
    }
    if (withHoldingCharges >= 0) {
      netAmount =
        Number(discount) +
        Number(additionalCharges) +
        Number(withHoldingCharges);
    }
    if (selectedTax >= 0) {
      netAmount =
        Number(discount) +
        Number(additionalCharges) +
        Number(withHoldingCharges) +
        Number(discount) * (Number(selectedTax) / 100);
    }

    setSaleInvoiceForm({ ...saleInvoiceForm, netAmount: netAmount });
  }, [discount, additionalCharges, withHoldingCharges, selectedTax]);

  const addAndUpdateSaleInvoice: SubmitHandler<any> = async (data) => {
    setLoading(true);
    if (invoiceDate !== "" && invoiceDueDate !== "" && grossAmount !== "") {
      const saleInvoiceData = {
        invoiceDate,
        invoiceDueDate,
        reference,
        comments,
        additionalCharges,
        withHoldingCharges,
        discount,
        netAmount,
        grossAmount,
        customer,
        customerName,
        companyName,
        address,
        packagePrice,
        discountedPackagePrice,
        tax: selectedTax,
        vehicles: isInvoiceRenwed
          ? [invoiceData._id]
          : [...invoiceData?.vehicles?.map((item: any) => item._id)],
      };

      try {
        const response: any = await create(saleInvoiceData, {
          url: isInvoiceRenwed
            ? `${CREATE_SALE_INVOICE}?isRenewal=true`
            : CREATE_SALE_INVOICE,
        });
        if (response.success) {
          dispatch(setSaleInvoiceLoading(true));
          dispatch(setSaleInvoice(response.data.saleInvoice));
          setLoading(false);
          // navigate(
          //   `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/invoices`
          // );
          // const saleInvoicesResponse: any = await getAll({ url: GET_ALL_SALE_INVOICES });
          // if (saleInvoicesResponse.success) {
          //   dispatch(setSaleInvoices(saleInvoicesResponse.data));
          //   setLoading(false);
          //   navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/sales/invoices`)
          //   // dispatch(setInvoiceData(null))
          // }
          if (isInvoiceRenwed) {
            dispatch(setIsInvoiceRenwed(false));
          }
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
          text: error.message || "Error creating Sale Invoice",
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
      // fontWeight: 'bold', // Use the bold variant of the font
      fontSize: 8,
    },
    textNormal: {
      // fontWeight: 'normal', // Set to extrabold
      fontSize: 8,
    },
    ultraboldText: {
      // fontWeight: 'ultrabold', // Set to extrabold
      fontSize: 8,
    },
    heavyText: {
      fontFamily: "Helvetica-Bold",
      // fontWeight: 'heavy', // Set to extrabold
      fontSize: 8,
    },
    heavyUnderlineText: {
      // fontWeight: 'heavy', // Set to extrabold
      fontSize: 8,
      textDecoration: "underline",
    },
    textRow: { flexDirection: "row", marginBottom: 2 },
    image: {
      width: "160px",
      height: "120px",
    },
    centerText: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10,
    },
    titleText: {
      fontSize: 16,
      fontWeight: "extrabold", // Set to extrabold
    },
    tableContainer: {
      width: "28%",
      height: "auto",
      border: "1px solid black",
      position: "absolute",
      right: "20",
      top: "20%",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCell: {
      flex: 1,
      border: "1px solid black",
      padding: 3,
      fontSize: "9px",
      margin: -1,
      fontWeight: "extrabold", // Set to extrabold
    },
    tableCell1: {
      flex: 1,
      border: "1px solid black",
      padding: 4,
      fontSize: "9px",
      margin: -1,
      fontWeight: "extrabold", // Set to extrabold
    },
    tableCell2: {
      flex: 2,
      border: "1px solid black",
      padding: 4,
      fontSize: "9px",
      margin: -1,
      fontWeight: "extrabold", // Set to extrabold
    },
    tableCell3: {
      flex: 7,
      border: "1px solid black",
      padding: 4,
      fontSize: "9px",
      margin: -1,
      fontWeight: "extrabold", // Set to extrabold
    },
    headerCell1: {
      flex: 1,
      border: "1px solid black",
      padding: 4,
      margin: -1,
      fontFamily: "Helvetica-Bold", // Replace with your bold font family
      fontSize: 9,
    },
    headerCell2: {
      flex: 2,
      border: "1px solid black",
      padding: 4,
      margin: -1,
      fontFamily: "Helvetica-Bold", // Replace with your bold font family
      fontSize: 9,
    },
    headerCell3: {
      flex: 7,
      border: "1px solid black",
      padding: 4,
      margin: -1,
      fontFamily: "Helvetica-Bold", // Replace with your bold font family
      fontSize: 9,
    },
  });

  const downloadSaleInvoicePDF = () => (
    <Document>
      <Page style={styles2.page}>
        <View style={styles2.section}>
          <View style={{ marginBottom: "10px" }}>
            <Image
              src={BcakgroundImage} // Replace with your image URL or path
              style={styles2.image}
            />
          </View>
          <View>
            <Text style={styles2.text}></Text>
          </View>
          <br />
          <View>
            <View style={styles2.textRow}>
              <Text style={styles2.heavyText}>Address: </Text>
              <Text style={styles2.text}>{address}</Text>
            </View>
          </View>
          <br></br>

          <View>
            <View style={styles2.textRow}>
              <Text style={styles2.heavyText}>Mail: </Text>
              <Text style={styles2.text}>{customerEmail}</Text>
            </View>
          </View>
          <br></br>

          <View>
            <View style={styles2.textRow}>
              <Text style={styles2.heavyText}>GST No.: </Text>
              <Text style={styles2.text}>GST No</Text>
            </View>
          </View>
          <br></br>

          <View style={{ marginBottom: 10 }}>
            <View style={styles2.textRow}>
              <Text style={styles2.heavyText}>Sst No.: </Text>
              <Text style={styles2.text}>SST No</Text>
            </View>
          </View>
          <br></br>

          <View style={styles2.textRow}>
            <View style={styles2.heavyText}>
              <Text style={styles2.heavyText}>To,</Text>
            </View>
          </View>
          <br />
          <View>
            <View style={styles2.heavyText}>
              <Text style={styles2.heavyText}>{companyName}</Text>
            </View>
          </View>
          <br />
        </View>
        <View style={styles2.centerText}>
          <Text style={styles2.titleText}>Sale Invoice</Text>
        </View>

        <View style={styles2.tableContainer}>
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell}>Number</Text>
            <Text style={styles2.tableCell2}>SI-0000</Text>
          </View>
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell}>Date</Text>
            <Text style={styles2.tableCell2}>{invoiceDate}</Text>
          </View>
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell}>Due Date</Text>
            <Text style={styles2.tableCell2}>{invoiceDueDate}</Text>
          </View>
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell}>Reference</Text>
            <Text style={styles2.tableCell2}>{reference}</Text>
          </View>
        </View>

        <View>
          <View style={{ ...styles2.textRow, marginBottom: "10px" }}>
            <Text style={styles2.text}>Registration No: </Text>
            <Text style={styles2.heavyUnderlineText}>Reg No.</Text>
          </View>
        </View>
        <br></br>
        <View>
          <View style={styles2.tableRow}>
            <Text style={styles2.headerCell1}>S.No.</Text>
            <Text style={styles2.headerCell3}>Description</Text>
            <Text style={styles2.headerCell1}>Quantity</Text>
            <Text style={styles2.headerCell2}>Price</Text>
            <Text style={styles2.headerCell2}>Discounted Price</Text>
            <Text style={styles2.headerCell2}>Amount</Text>
          </View>
        </View>
        {invoiceData?.vehicles?.map((product: any, index: any) => (
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell1}>{index + 1}</Text>

            <Text style={styles2.tableCell3}>
              P-000119 - ATL06 356220380158323 | 356220380092183 |
              356220380092654{" "}
            </Text>
            <Text style={styles2.tableCell1}>1</Text>
            <Text style={styles2.tableCell2}>{invoiceData?.packagePrice}</Text>
            <Text style={styles2.tableCell2}>
              {invoiceData?.discounted_service_charges}
            </Text>
            <Text style={styles2.tableCell2}>{invoiceData?.packagePrice}</Text>
          </View>
        ))}

        <View
          style={{
            marginTop: "25px",
            width: "100%",
            position: "relative",
            right: 0,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              width: "30%",
              ...styles2.textRow,
              justifyContent: "flex-end",
              marginLeft: "70%",
              marginBottom: "4px",
              borderBottom: "2px solid black",
              paddingVertical: "5px",
            }}
          >
            <Text style={{ ...styles2.text, flex: 1 }}>Net Amount: </Text>
            <Text style={styles2.heavyText}>{netAmount}</Text>
          </View>
          <br />
          <View
            style={{
              width: "30%",
              ...styles2.textRow,
              justifyContent: "flex-end",
              marginLeft: "70%",
              marginBottom: "4px",
              borderBottom: "2px solid black",
              paddingVertical: "3.5px",
            }}
          >
            <Text style={{ ...styles2.text, flex: 1 }}>
              Discounted Amount:{" "}
            </Text>
            <Text style={styles2.heavyText}>
              {discountedPackagePrice * invoiceData?.vehicles.length}
            </Text>
          </View>
          <br />
          <View
            style={{
              width: "30%",
              ...styles2.textRow,
              justifyContent: "flex-end",
              marginLeft: "70%",
              marginBottom: "4px",
              borderBottom: "2px solid black",
              paddingVertical: "3.5px",
            }}
          >
            <Text style={{ ...styles2.text, flex: 1 }}>
              With Holding Charges:{" "}
            </Text>
            <Text style={styles2.heavyText}>{withHoldingCharges}</Text>
          </View>
          <br />
          <View
            style={{
              width: "30%",
              ...styles2.textRow,
              justifyContent: "flex-end",
              marginLeft: "70%",
              marginBottom: "4px",
              borderBottom: "2px solid black",
              paddingVertical: "3.5px",
            }}
          >
            <Text style={{ ...styles2.text, flex: 1 }}>
              Additional Charges:{" "}
            </Text>
            <Text style={styles2.heavyText}>{additionalCharges}</Text>
          </View>
          <View
            style={{
              width: "30%",
              ...styles2.textRow,
              justifyContent: "flex-end",
              marginLeft: "70%",
              marginBottom: "4px",
              borderBottom: "2px solid black",
              paddingVertical: "3.5px",
            }}
          >
            <Text style={{ ...styles2.text, flex: 1 }}>Tax: </Text>
            <Text style={styles2.heavyText}>{selectedTax}</Text>
          </View>
          <br />
          <View
            style={{
              width: "30%",
              ...styles2.textRow,
              justifyContent: "flex-end",
              marginLeft: "70%",
              marginBottom: "4px",
              borderBottom: "2px solid black",
              paddingVertical: "3.5px",
            }}
          >
            <Text style={{ ...styles2.text, flex: 1 }}>Gross Amount: </Text>
            <Text style={styles2.heavyText}>{grossAmount}</Text>
          </View>
        </View>

        <View style={{ marginTop: "22px", marginBottom: "5px" }}>
          <Text style={styles2.titleText}>Comments</Text>
        </View>

        <View style={{ marginVertical: "3px" }}>
          <Text style={styles2.text}>
            i) Autotel warrants to the original purchaser that tracker shall be
            free from defects in material and workmanship for a period of 12
            months from date of activation. If a defect covered by this warranty
            occurs during the warranty period, Autoel will repair or replace
            your tracker free of charge.
          </Text>
        </View>
        <View style={{ marginVertical: "3px" }}>
          <Text style={styles2.text}>
            ii) Autotel warrants from defects in material and workmanship for a
            period of 12 months from date of activation. If a defect covered by
            this warranty occurs during the warranty period, Autoel will repair
            or replace your tracker free of charge.
          </Text>
        </View>
        <View style={{ marginVertical: "3px" }}>
          <Text style={styles2.text}>
            iii) Autotel warrants to the original purchaser that tracker shall
            be free from defects in material and workmanship for a period of 12
            months from date of activation. If a defect during the warranty
            period, Autoel will repair or replace your tracker free of charge.
          </Text>
        </View>
      </Page>
    </Document>
  );

  const downloadPDF = async () => {
    const blob = await pdf(downloadSaleInvoicePDF()).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sale_invoice.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  const approvedSaleInvoice: SubmitHandler<any> = async (data) => {
    setLoading(true);
    const receiveMoneyData = {
      status: "APPROVED",
    };

    try {
      const response: any = await patch(receiveMoneyData, {
        url: `${SALE_INVOICE_STATUS_APPROVED}/${saleInvoice._id}`,
      });
      if (response.success) {
        dispatch(setSaleInvoiceLoading(true));
        setLoading(false);

        navigate(
          `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/invoices`
        );
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
  };

  const toggleModal = () => setModal(!modal);
  return (
    <>
      <Container fluid>
        <Row>
          <Form
            onSubmit={(event) => event.preventDefault()}
            className="needs-validation"
            noValidate
          >
            <Row className="g-3">
              <Col lg={3} xs={12}>
                <P>Customer Name</P>
                <Input
                  type="text"
                  placeholder="Enter Customer Name"
                  value={customerName}
                  name="customerName"
                  disabled
                  onChange={getUserData}
                />
              </Col>
              <Col lg={3} xs={12}>
                <P>Company Name</P>
                <Input
                  type="text"
                  placeholder="Enter Company Name"
                  value={companyName}
                  name="companyName"
                  onChange={getUserData}
                  disabled
                />
              </Col>
              <Col lg={3} xs={12}>
                <P>Address</P>
                <Input
                  type="text"
                  placeholder="Enter Address"
                  value={address}
                  name="address"
                  onChange={getUserData}
                />
              </Col>
              <Col lg={2} xs={12}>
                <div>
                  <P>
                    Invoice Number
                    <span className="txt-danger">*</span>
                  </P>
                </div>
                <Input
                  type="text"
                  placeholder="Enter Invoice Number"
                  value={"SI-000"}
                  // name="dueDate"
                  // onChange={getUserData}
                  disabled
                />
              </Col>
              <Col lg={2} xs={12}>
                <P>
                  Date
                  <span className="txt-danger">*</span>
                </P>
                <Input
                  type="date"
                  placeholder="Enter Date "
                  value={invoiceDate}
                  name="invoiceDate"
                  onChange={getUserData}
                />
              </Col>
              <Col lg={2} xs={12}>
                <P>
                  Due Date
                  <span className="txt-danger">*</span>
                </P>
                <Input
                  type="date"
                  placeholder="Enter Due Date"
                  value={invoiceDueDate}
                  name="invoiceDueDate"
                  onChange={getUserData}
                />
              </Col>
              <Col lg={3} xs={12}>
                <P>Reference</P>
                <Input
                  type="text"
                  placeholder="Enter Reference"
                  value={reference}
                  name="reference"
                  onChange={getUserData}
                />
              </Col>

              <Row className="g-3" style={{ marginTop: "35px" }}>
                {/* <div style={{ display: "flex", justifyContent: "end" }}>
                        {
                          userPersonalizationData !== null ? (
                            <Button
                              color=""
                              onClick={addProductObject}
                              style={{
                                color: "white",
                                backgroundColor: `${userPersonalizationData?.buttonsAndBarsColor
                                  }`,
                              }}
                            >
                              Add Product
                            </Button>
                          ) : (
                            <Button color="primary" onClick={addProductObject}>
                              Add Product
                            </Button>
                          )
                        } */}
                {/* </div> */}
                {invoiceData.vehicles?.length > 0 && (
                  <table
                    style={{ border: "1px solid lightgray", width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            width: "23%",
                            borderRight: "1px solid lightgray",
                          }}
                        >
                          S.No.
                        </th>
                        <th
                          style={{
                            width: "17%",
                            borderRight: "1px solid lightgray",
                          }}
                        >
                          Vehicle
                        </th>
                        <th
                          style={{
                            width: "17%",
                            borderRight: "1px solid lightgray",
                          }}
                        >
                          Price
                        </th>
                        <th
                          style={{
                            width: "17%",
                            borderRight: "1px solid lightgray",
                          }}
                        >
                          Discount
                        </th>
                        <th
                          style={{
                            width: "17%",
                            borderRight: "1px solid lightgray",
                          }}
                        >
                          Net Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.vehicles?.map((item: any, index: any) => (
                        <>
                          <div
                            style={{
                              height: "10px",
                            }}
                          >
                            {" "}
                          </div>
                          <tr
                            style={{
                              backgroundColor: "#f6f6f6",
                              borderTop: "1px solid lightgray",
                            }}
                          >
                            <td
                              style={{
                                width: "10%",
                                textAlign: "start",
                                borderRight: "1px solid lightgray",
                              }}
                            >
                              <Col xs={12}>
                                <Input
                                  type="number"
                                  placeholder="Enter Price"
                                  value={index + 1}
                                  name="price"
                                  disabled
                                />
                              </Col>
                            </td>
                            <td
                              style={{
                                width: "30%",
                                alignItems: "start",
                                borderRight: "1px solid lightgray",
                              }}
                            >
                              <Col xs={12}>
                                <Input
                                  type="number"
                                  placeholder="Enter Price"
                                  value={index + 1}
                                  name="price"
                                  disabled
                                />
                              </Col>
                            </td>
                            <td
                              style={{
                                width: "17%",
                                alignItems: "start",
                                borderRight: "1px solid lightgray",
                              }}
                            >
                              <Col xs={12}>
                                <Input
                                  type="number"
                                  placeholder="Enter Price"
                                  value={
                                    isInvoiceRenwed
                                      ? invoiceData?.servicePackageDiscountedCharges
                                      : invoiceData.service_charges
                                  }
                                  // name="price"
                                  disabled
                                />
                              </Col>
                            </td>
                            <td
                              style={{
                                width: "17%",
                                alignItems: "start",
                                borderRight: "1px solid lightgray",
                              }}
                            >
                              <Col xs={12}>
                                <Input
                                  type="number"
                                  placeholder="Enter Discounted Price"
                                  value={
                                    isInvoiceRenwed
                                      ? invoiceData?.servicePackageDiscountedCharges
                                      : invoiceData.discounted_service_charges
                                  }
                                  // name="price"
                                  disabled
                                />
                              </Col>
                            </td>
                            <td
                              style={{
                                width: "17%",
                                alignItems: "start",
                                borderRight: "1px solid lightgray",
                              }}
                            >
                              <Col xs={12}>
                                <Input
                                  type="number"
                                  placeholder="Enter Discounted Price"
                                  value={
                                    isInvoiceRenwed
                                      ? invoiceData?.servicePackageDiscountedCharges
                                      : invoiceData.discounted_service_charges
                                  }
                                  // name="price"
                                  disabled
                                />
                              </Col>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                )}
              </Row>
              <Row className="g-3" style={{ marginTop: "15px" }}>
                <Col lg={6} xs={12}>
                  <P>Comments</P>
                  <textarea
                    className="form-control"
                    placeholder="Enter Comments"
                    rows={4.5}
                    style={{
                      maxHeight: "200px",
                      resize: "vertical",
                    }}
                    value={comments}
                    name="comments"
                    onChange={getUserData}
                  />
                </Col>
                <Col lg={6} xs={12}>
                  <Row className="g-3">
                    <Col lg={12} xs={12} style={{ marginTop: "5px" }}>
                      <P>
                        Gross (PKR)
                        <span className="txt-danger">*</span>
                      </P>
                      <Input
                        type="number"
                        placeholder="Enter Net Amount"
                        value={grossAmount}
                        name="grossAmount"
                        onChange={getUserData}
                        disabled
                      />
                    </Col>
                    <Col lg={12} xs={12}>
                      <P>
                        Additional Charges
                        {/* <span className="txt-danger">*</span> */}
                      </P>
                      <Input
                        type="number"
                        placeholder="Enter Additional Charges"
                        value={additionalCharges}
                        name="additionalCharges"
                        onChange={getUserData}
                      />
                    </Col>
                    <Col lg={12} xs={12}>
                      <P>
                        With Holding Charges
                        {/* <span className="txt-danger">*</span> */}
                      </P>
                      <Input
                        type="number"
                        placeholder="Enter With Holding Charges"
                        value={withHoldingCharges}
                        name="withHoldingCharges"
                        onChange={getUserData}
                      />
                    </Col>
                    <Col lg={12} xs={12}>
                      <P>
                        Discounted Charges
                        <span className="txt-danger">*</span>
                      </P>
                      <Input
                        type="number"
                        placeholder="Enter Discounted Charges"
                        value={discount}
                        name="discount"
                        onChange={getUserData}
                        disabled
                      />
                    </Col>
                    <Col lg={12} xs={12}>
                      <P>
                        Select Tax
                        {/* <span className="txt-danger">*</span> */}
                      </P>
                      <Select
                        value={selectedTax >= 0 ? selectedTax : 0}
                        showSearch
                        style={{ width: "100%", height: 36 }}
                        placeholder="Select Tax"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.label ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        onChange={(value, option) => {
                          setSelectedTax(value); // Pass both value and type
                        }}
                        options={[
                          ...taxes.map((item: any) => ({
                            value: item.percentage,
                            label: `${item.title} - ${item.percentage}%`,
                          })),
                        ]}
                      />
                    </Col>
                    <Col lg={12} xs={12}>
                      <P>
                        Net Amount
                        <span className="txt-danger">*</span>
                      </P>
                      <Input
                        type="text"
                        placeholder="Enter Gross Amount"
                        value={netAmount}
                        name="netAmount"
                        onChange={getUserData}
                        disabled
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Col
                xs={12}
                className="text-end d-flex justify-content-end gap-2 align-center"
                style={{ marginTop: "20px" }}
              >
                <Button
                  color="primary"
                  disabled={loading}
                  onClick={() => {
                    dispatch(setInvoiceData(null));
                    navigate(
                      `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/invoices`
                    );
                  }}
                >
                  Cancel
                </Button>
                {/* <Button
                  color="primary"
                  disabled={loading}
                  onClick={addAndUpdateSaleInvoice}
                >
                  {loading ? "Loading..." : "Create"}
                </Button> */}

                {saleInvoice == null && (
                  <Button
                    disabled={loading}
                    color="primary"
                    onClick={addAndUpdateSaleInvoice}
                  >
                    {loading ? "Loading..." : "Create"}
                  </Button>
                )}

                {saleInvoice !== null && saleInvoice.status == "ISSUED" && (
                  <Button
                    disabled={loading}
                    color="primary"
                    onClick={approvedSaleInvoice}
                  >
                    {loading ? "Loading..." : "Approve"}
                  </Button>
                )}
                {saleInvoice !== null && saleInvoice.status == "APPROVED" && (
                  <Button disabled={true} color="primary" onClick={() => {}}>
                    {loading ? "Loading..." : "Approved"}
                  </Button>
                )}
                {/* <Button color="primary" onClick={toggleModal}>View</Button> */}
              </Col>
            </Row>
          </Form>
        </Row>

        {/* <ViewPDFModal modal={modal} toggleModal={toggleModal} body={downloadSaleInvoicePDF} /> */}
      </Container>
    </>
  );
};

export default CreateNewSaleInvoice;
