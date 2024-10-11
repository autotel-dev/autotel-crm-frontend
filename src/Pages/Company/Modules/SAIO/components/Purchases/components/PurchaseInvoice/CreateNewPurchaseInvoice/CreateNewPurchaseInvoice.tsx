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
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { P } from "../../../../../../../../../AbstractElements";
import SelectVendorBox from "./components/SelectVendorBox";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MdDelete } from "react-icons/md";
import SingleProductObject from "./components/SingleProductObject";
import SelectBranchBox from "./components/SelectBranchBox";
import SelectWarehouseBox from "./components/SelectWarehouseBox";
import { SubmitHandler } from "react-hook-form";
import { create, getAll } from "../../../../../../../../../Utilities/api";
import {
  CREATE_NEW_PURCHASE_INVOICE,
  GET_ALL_PURCHASE_INVOICES,
  IMAGE_BASE_URL,
} from "../../../../../../../../../Utilities/api/apiEndpoints";
import Swal from "sweetalert2";
import {
  setPurchaseInvoice,
  setPurchaseInvoiceLoading,
  setPurchaseInvoices,
} from "../../../../../../../../../ReaduxToolkit/Reducer/PurchaseInvoiceSlice";

import { IoClose } from "react-icons/io5";
import { IoMdDownload, IoMdPrint } from "react-icons/io";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import ViewPDFModal from "../../../../ViewPDFModal";
import {
  StyleSheet,
  Document,
  Page,
  Text,
  View,
  pdf,
  Image,
  PDFViewer,
  Font,
  BlobProvider,
} from "@react-pdf/renderer";
import BcakgroundImage from "../../../../../../../../../assets/Background Image.png";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const CreateNewPurchaseInvoice = ({}) => {
  const { products, purchaseInvoice, vendors } = useSelector(
    (state: any) => state.purchaseInvoice
  );
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const dispatch = useDispatch();

  const [customerLoading, setCustomerLoading] = useState(false);
  const [vendor, setVendor] = useState(
    purchaseInvoice !== null ? purchaseInvoice?.vendor : ""
  );
  const [branch, setBranch] = useState(
    purchaseInvoice !== null ? purchaseInvoice?.branch?._id : ""
  );
  const [warehouse, setWarehouse] = useState(
    purchaseInvoice !== null ? purchaseInvoice?.warehouse?._id : ""
  );
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const [purchaseInvoiceForm, setPurchaseInvoiceForm] = useState({
    date:
      purchaseInvoice !== null
        ? purchaseInvoice?.invoiceDate.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    dueDate:
      purchaseInvoice !== null
        ? purchaseInvoice?.invoiceDueDate.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    reference: purchaseInvoice !== null ? purchaseInvoice?.reference : "",
    comments: purchaseInvoice !== null ? purchaseInvoice?.comments : "",
    shippingCharges:
      purchaseInvoice !== null ? purchaseInvoice?.shippingCharges : "",
    netAmount: purchaseInvoice !== null ? purchaseInvoice?.netAmount : "",
  });

  const { date, dueDate, reference, comments, shippingCharges, netAmount } =
    purchaseInvoiceForm;

  const getUserData = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    let name = event.target.name;
    let value = event.target.value;
    setPurchaseInvoiceForm({ ...purchaseInvoiceForm, [name]: value });
  };

  // ---------------------------------------------------------------

  const pdfRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // --------------------------------------------------------------

  const [productObjects, setProductObjects] = useState<
    {
      product: string;
      type: string;
      quantity: number;
      price: string;
      discount: number;
      totalAmount: string;
      description: string;
      serialsOrSkus: [];
    }[]
  >(purchaseInvoice !== null ? purchaseInvoice.productsDetails : []);

  // Function to add a new body parameter
  const addProductObject = () => {
    // console.log("productObjects", productObjects);

    setProductObjects([
      ...productObjects,
      {
        product: "",
        type: "",
        quantity: Number(""),
        price: "",
        discount: Number(""),
        totalAmount: "",
        description: "",
        serialsOrSkus: [],
      },
    ]);
  };

  // Function to delete a body parameter
  const deleteProductObject = (index: number) => {
    const updatedParams = productObjects.filter((_, i) => i !== index);
    setProductObjects(updatedParams);
  };

  // Function to handle body parameter changes
  const handleProductObjectChange = (
    index: number,
    newParam: {
      product: string;
      type: string;
      quantity: number;
      price: string;
      discount: number;
      totalAmount: string;
      description: string;
      serialsOrSkus: [];
    }
  ) => {
    // console.log("productObjects", productObjects);

    const updatedProductObject = productObjects.map((param, i) =>
      i === index
        ? {
            ...newParam,
            totalAmount:
              newParam.discount == 0
                ? calculateAmount(newParam.quantity, newParam.price, 0)
                : calculateAmount(
                    newParam.quantity,
                    newParam.price,
                    newParam.discount
                  ),
          }
        : param
    );

    setProductObjects(updatedProductObject);
    const totalAmount = updatedProductObject.reduce((sum, param) => {
      return sum + parseFloat(param.totalAmount);
    }, 0);
    // console.log("total", totalAmount);

    setPurchaseInvoiceForm({ ...purchaseInvoiceForm, netAmount: totalAmount });
  };

  // Function to calculate amount based on quantity, price, and discount
  const calculateAmount = (
    quantity: number,
    price: string,
    discount: number
  ) => {
    // console.log(quantity, price, discount);

    const parsedQuantity = quantity;
    const parsedPrice = parseFloat(price);
    const parsedDiscount = discount;

    if (parsedQuantity && parsedPrice) {
      if (parsedDiscount > 0) {
        return (
          parsedQuantity *
          parsedPrice *
          ((100 - parsedDiscount) / 100)
        ).toFixed(2);
      } else {
        return (parsedQuantity * parsedPrice).toFixed(2);
      }
    } else {
      return "";
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

  const downloadPurchaseInvoicePDF = () => (
    <Document>
      <Page style={styles2.page}>
        <View style={styles2.section}>
          <View style={{ marginBottom: "10px" }}>
            <Image
              src={
                userPersonalizationData !== null &&
                userPersonalizationData?.loginPageLogo.url !== ""
                  ? `${IMAGE_BASE_URL}/${userPersonalizationData?.loginPageLogo.url}`
                  : BcakgroundImage
              }
              style={styles2.image}
            />
          </View>
          <View>
            <Text style={styles2.text}></Text>
          </View>
          <br />

          <View>
            <View style={styles2.textRow}>
              <Text style={styles2.heavyText}>Mail: </Text>
              <Text style={styles2.text}>
                {
                  vendors.find((item: any) => item.vendorName == vendor)
                    ?.emailAddress
                }
              </Text>
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
              <Text style={styles2.heavyText}>{vendor}</Text>
            </View>
          </View>
          <br />
        </View>
        <View style={styles2.centerText}>
          <Text style={styles2.titleText}>Purchase Invoice</Text>
        </View>

        <View style={styles2.tableContainer}>
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell}>Number</Text>
            <Text style={styles2.tableCell2}>
              {purchaseInvoice?.purchaseInvoiceId}
            </Text>
          </View>
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell}>Date</Text>
            <Text style={styles2.tableCell2}>{date}</Text>
          </View>
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell}>Due Date</Text>
            <Text style={styles2.tableCell2}>{dueDate}</Text>
          </View>
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell}>Reference</Text>
            <Text style={styles2.tableCell2}>{reference}</Text>
          </View>
        </View>

        <View>
          <View style={{ ...styles2.textRow, marginBottom: "10px" }}>
            <Text style={styles2.text}>Invoice No: </Text>
            <Text style={styles2.heavyUnderlineText}>
              {purchaseInvoice?.purchaseInvoiceId}
            </Text>
          </View>
        </View>
        <br></br>
        <View>
          <View style={styles2.tableRow}>
            <Text style={styles2.headerCell1}>S.No.</Text>
            <Text style={styles2.headerCell3}>Items</Text>
            <Text style={styles2.headerCell1}>Quantity</Text>
            <Text style={styles2.headerCell1}>Discount</Text>
            <Text style={styles2.headerCell2}>Price</Text>
            <Text style={styles2.headerCell2}>Amount</Text>
          </View>
        </View>
        {purchaseInvoice?.productsDetails?.map((product: any, index: any) => (
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell1}>{index + 1}</Text>

            <Text style={styles2.tableCell3}>
              <Text style={{ fontSize: "12px" }}>{product?.product?.name}</Text>
              {"\n"}
              {"\n"}
              {product?.serialsOrSkus?.map(
                (item: any) => `${item.serialNo} | `
              )}
            </Text>
            <Text style={styles2.tableCell1}>
              {product?.serialsOrSkus?.length}
            </Text>
            <Text style={styles2.tableCell1}>{product?.discount}</Text>
            <Text style={styles2.tableCell2}>{product?.price}</Text>
            <Text style={styles2.tableCell2}>{product?.totalAmount}</Text>
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
            <Text style={styles2.heavyText}>{netAmount - shippingCharges}</Text>
          </View>
          <br />
          {/* <View style={{ width: "30%", ...styles2.textRow, justifyContent: "flex-end", marginLeft: "70%", marginBottom: "4px", borderBottom: "2px solid black", paddingVertical: "3.5px" }}>
            <Text style={{ ...styles2.text, flex: 1 }}>Discounted Amount: </Text>
            <Text style={styles2.heavyText}>{discountedPackagePrice * saleInvoice?.vehicles.length}</Text>
          </View>
          <br />
          <View style={{ width: "30%", ...styles2.textRow, justifyContent: "flex-end", marginLeft: "70%", marginBottom: "4px", borderBottom: "2px solid black", paddingVertical: "3.5px" }}>
            <Text style={{ ...styles2.text, flex: 1 }}>With Holding Charges: </Text>
            <Text style={styles2.heavyText}>{withHoldingCharges}</Text>
          </View>
          <br /> */}
          {/* <View style={{ width: "30%", ...styles2.textRow, justifyContent: "flex-end", marginLeft: "70%", marginBottom: "4px", borderBottom: "2px solid black", paddingVertical: "3.5px" }}>
            <Text style={{ ...styles2.text, flex: 1 }}>Additional Charges: </Text>
            <Text style={styles2.heavyText}>{additionalCharges}</Text>
          </View> */}
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
            <Text style={{ ...styles2.text, flex: 1 }}>Shipping Charges: </Text>
            <Text style={styles2.heavyText}>{shippingCharges}</Text>
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
            <Text style={styles2.heavyText}>{netAmount}</Text>
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

  const addAndUpdatePurchaseInvoice: SubmitHandler<any> = async (data) => {
    setLoading(true);
    if (
      date !== "" &&
      vendor !== "" &&
      dueDate !== "" &&
      productObjects.length > 0 &&
      netAmount > 0 &&
      shippingCharges > 0
    ) {
      let isValid = true;
      productObjects.forEach((item) => {
        if (item.quantity == 0) {
          Swal.fire({
            text: `Quantity of ${
              products.find((i: any) => i._id == item.product).name
            } of type ${item.type} is ${item.quantity}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          isValid = false;
          setLoading(false);
          return;
        }
        if (
          (item.type === "SIM" || item.type === "DEVICES") &&
          Number(item.quantity) !== item.serialsOrSkus.length
        ) {
          Swal.fire({
            text: `Quantity for ${
              products.find((i: any) => i._id == item.product).name
            } of type ${item.type} does not match the number of ${
              item.type == "SIM"
                ? "Sim numbers"
                : item.type == "DEVICES"
                ? "IMEIS"
                : "serial numbers"
            }`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          isValid = false;
          setLoading(false);
          return;
        }
      });

      if (!isValid) {
        return;
      }

      const purchaseInvoiceData = {
        vendor: vendor,
        branch: branch,
        warehouse: warehouse,
        invoiceDate: date,
        invoiceDueDate: dueDate,
        reference: reference,
        comments: comments,
        netAmount: Number(netAmount) + Number(shippingCharges),
        shippingCharges: Number(shippingCharges),
        productsDetails: productObjects.map(
          ({ type, quantity, serialsOrSkus = [], ...rest }) => {
            const updatedSerialsOrSku =
              serialsOrSkus.length > 0
                ? serialsOrSkus
                : Array.from({ length: quantity }, () => ({
                    serialNumber: null,
                    sku: null,
                  }));

            return {
              ...rest,
              quantity,
              serialsOrSkus: updatedSerialsOrSku,
            };
          }
        ),
      };

      try {
        const response: any = await create(purchaseInvoiceData, {
          url: CREATE_NEW_PURCHASE_INVOICE,
        });
        if (response.success) {
          dispatch(setPurchaseInvoiceLoading(true));
          setLoading(false);
          navigate(
            `${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/purchase-invoices`
          );

          // const purchaseInvoicesResponse: any = await getAll({ url: GET_ALL_PURCHASE_INVOICES });
          // if (purchaseInvoicesResponse.success) {
          //   dispatch(setPurchaseInvoices(purchaseInvoicesResponse.data));
          //   dispatch(setPurchaseInvoiceLoading(true));
          //   setLoading(false);

          //   navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/purchase-invoices`)
          // }
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

  // const rowsPerPage = 20;
  // const pages = [];
  // for (let i = 0; i < data.length; i += rowsPerPage) {
  //   pages.push(data.slice(i, i + rowsPerPage));
  // }

  const toggleModal = () => setModal(!modal);

  return (
    <>
      <>
        <Row>
          <Form
            onSubmit={(event) => event.preventDefault()}
            className="needs-validation"
            noValidate
          >
            <div ref={pdfRef}>
              <Row className="g-3">
                <Col lg={3} xs={12}>
                  <div>
                    <P>
                      Select Vendor
                      <span className="txt-danger">*</span>
                    </P>
                  </div>
                  <SelectVendorBox
                    placeholder="Select Vendor"
                    setVendor={setVendor}
                    vendor={vendor}
                    disabled={purchaseInvoice !== null}
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
                    value={
                      purchaseInvoice !== null
                        ? purchaseInvoice.purchaseInvoiceId
                        : "PI-000"
                    }
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
                    value={date}
                    name="date"
                    onChange={getUserData}
                    disabled={purchaseInvoice !== null}
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
                    value={dueDate}
                    name="dueDate"
                    onChange={getUserData}
                    disabled={purchaseInvoice !== null}
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
                    disabled={purchaseInvoice !== null}
                  />
                </Col>
                <Col lg={3} xs={12}>
                  <div>
                    <P>
                      Select Branch
                      <span className="txt-danger">*</span>
                    </P>
                  </div>
                  <SelectBranchBox
                    placeholder="Select Branch"
                    setBranch={setBranch}
                    branch={branch}
                    disabled={purchaseInvoice !== null}
                  />
                </Col>
                <Col lg={3} xs={12}>
                  <div>
                    <P>
                      Select Warehouse
                      <span className="txt-danger">*</span>
                    </P>
                  </div>
                  <SelectWarehouseBox
                    placeholder="Select Warehouse"
                    setWarehouse={setWarehouse}
                    warehouse={warehouse}
                    disabled={purchaseInvoice !== null}
                  />
                </Col>
                <Row className="g-3" style={{ marginTop: "35px" }}>
                  {purchaseInvoice == null && (
                    <div style={{ display: "flex", justifyContent: "end" }}>
                      {userPersonalizationData !== null ? (
                        <Button
                          color=""
                          onClick={addProductObject}
                          style={{
                            color: "white",
                            backgroundColor: `${userPersonalizationData?.buttonsAndBarsColor}`,
                          }}
                        >
                          Add Product
                        </Button>
                      ) : (
                        <Button color="primary" onClick={addProductObject}>
                          Add Product
                        </Button>
                      )}
                    </div>
                  )}
                  {productObjects.length > 0 && (
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
                            Product
                          </th>
                          <th
                            style={{
                              width: "17%",
                              borderRight: "1px solid lightgray",
                            }}
                          >
                            Quantity
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
                            Discount %
                          </th>
                          <th
                            style={{
                              width: "17%",
                              borderRight: "1px solid lightgray",
                            }}
                          >
                            Amount
                          </th>
                          <th
                            style={{
                              width: "10%",
                              borderRight: "1px solid lightgray",
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productObjects.map((param, index) => (
                          <SingleProductObject
                            key={index}
                            param={param}
                            onChange={(newParam: any) =>
                              handleProductObjectChange(index, newParam)
                            }
                            onDelete={() => deleteProductObject(index)}
                            disabled={purchaseInvoice !== null}
                          />
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
                      disabled={purchaseInvoice !== null}
                    />
                  </Col>
                  <Col lg={6} xs={12}>
                    <Row className="g-3">
                      <Col lg={12} xs={12}>
                        <P>
                          Shipping Charges
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="number"
                          placeholder="Enter Shipping Charges"
                          value={shippingCharges}
                          name="shippingCharges"
                          onChange={getUserData}
                          disabled={purchaseInvoice !== null}
                        />
                      </Col>
                      <Col lg={12} xs={12} style={{ marginTop: "5px" }}>
                        <P>
                          Net (PKR)
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="number"
                          placeholder="Enter Net Amount"
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
                      dispatch(setPurchaseInvoice(null));
                      // setIscreateNewPurchaseInvoice(false);

                      navigate(
                        `${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/purchase-invoices`
                      );
                    }}
                  >
                    Cancel
                  </Button>
                  {purchaseInvoice == null && (
                    <Button
                      disabled={loading}
                      color="primary"
                      onClick={addAndUpdatePurchaseInvoice}
                    >
                      {loading ? "Loading..." : "Create"}
                    </Button>
                  )}
                  {purchaseInvoice !== null && (
                    <Button color="primary" onClick={toggleModal}>
                      View PDF
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
          </Form>
        </Row>
      </>
      <ViewPDFModal
        modal={modal}
        toggleModal={toggleModal}
        body={downloadPurchaseInvoicePDF}
      />
    </>
  );
};

export default CreateNewPurchaseInvoice;

{
  /* <div className="text-end mt-3">
                        <PDFDownloadLink
                          document={
                            <PurchaseInvoicePDF
                              productObjects={productObjects}
                              vendor={vendor}
                              date={date}
                              dueDate={dueDate}
                              reference={reference}
                              comments={comments}
                              shippingCharges={shippingCharges}
                              netAmount={netAmount}
                            />
                          }
                          fileName="purchase-invoice.pdf"
                        >
                          {({ loading }) =>
                            loading ? "Loading PDF..." : "Download PDF"
                          }
                        </PDFDownloadLink>
                      </div> */
}

{
  /* <Button color="primary" onClick={handleGeneratePdf}>
                      {loading ? "Loading..." : "PDF"}
                    </Button> */
}

{
  /* <Button color="primary" onClick={toggleModal}>VIew</Button> */
}

// const styles = StyleSheet.create({
//   page: { padding: 20 },
//   section: { marginBottom: 10 },
//   table: { width: 'auto' },
//   tableRow: { display: 'flex', flexDirection: 'row' }, // Use flex instead of table
//   tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#000' },
//   tableCell: { margin: 5, fontSize: 10 },
// });

// const PurchaseInvoicePDF = ({ productObjects, vendor, date, dueDate, reference, comments, shippingCharges, netAmount }: any) => (
//   <Document>
//     <Page style={styles.page}>
//       <View style={styles.section}>
//         <Text>Vendor: {vendor}</Text>
//         <Text>Date: {date}</Text>
//         <Text>Due Date: {dueDate}</Text>
//         <Text>Reference: {reference}</Text>
//         <Text>Comments: {comments}</Text>
//         <Text>Shipping Charges: {shippingCharges}</Text>
//         <Text>Net Amount: {netAmount}</Text>
//       </View>
//       <View style={styles.section}>
//         <Text>Products</Text>
//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <View style={styles.tableCol}><Text style={styles.tableCell}>Product</Text></View>
//             <View style={styles.tableCol}><Text style={styles.tableCell}>Quantity</Text></View>
//             <View style={styles.tableCol}><Text style={styles.tableCell}>Price</Text></View>
//             <View style={styles.tableCol}><Text style={styles.tableCell}>Total Amount</Text></View>
//           </View>
//           {productObjects.map((product: any, index: any) => (
//             <View key={index} style={styles.tableRow}>
//               <View style={styles.tableCol}><Text style={styles.tableCell}>{product.product}</Text></View>
//               <View style={styles.tableCol}><Text style={styles.tableCell}>{product.quantity}</Text></View>
//               <View style={styles.tableCol}><Text style={styles.tableCell}>{product.price}</Text></View>
//               <View style={styles.tableCol}><Text style={styles.tableCell}>{product.totalAmount}</Text></View>
//             </View>
//           ))}
//         </View>
//       </View>
//     </Page>
//   </Document>
// );

// const data = [
//   { "name": "John Doe", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith", "age": 25, "position": "Designer" },
//   { "name": "John Doe1", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith1", "age": 25, "position": "Designer" },
//   { "name": "John Doe2", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith2", "age": 25, "position": "Designer" },
//   { "name": "John Doe3", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith3", "age": 25, "position": "Designer" },
//   { "name": "John Doe4", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith4", "age": 25, "position": "Designer" },
//   { "name": "John Doe5", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith5", "age": 25, "position": "Designer" },
//   { "name": "John Doe", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith", "age": 25, "position": "Designer" },
//   { "name": "John Doe1", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith1", "age": 25, "position": "Designer" },
//   { "name": "John Doe2", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith2", "age": 25, "position": "Designer" },
//   { "name": "John Doe3", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith3", "age": 25, "position": "Designer" },
//   { "name": "John Doe4", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith4", "age": 25, "position": "Designer" },
//   { "name": "John Doe5", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith5", "age": 25, "position": "Designer" },
//   { "name": "John Doe", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith", "age": 25, "position": "Designer" },
//   { "name": "John Doe1", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith1", "age": 25, "position": "Designer" },
//   { "name": "John Doe2", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith2", "age": 25, "position": "Designer" },
//   { "name": "John Doe3", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith3", "age": 25, "position": "Designer" },
//   { "name": "John Doe4", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith4", "age": 25, "position": "Designer" },
//   { "name": "John Doe5", "age": 30, "position": "Developer" },
//   { "name": "Jane Smith5", "age": 25, "position": "Designer" },
// ];

// const generatePDF = () => {
//   const doc = new jsPDF();
//   doc.setFontSize(20);
//   doc.text('Employee List', 14, 22);

//   const columns = ["Name", "Age", "Position"];
//   const rows = data.map(item => [item.name, item.age, item.position]);

//   doc.autoTable({
//     head: [columns],
//     body: rows,
//     startY: 30,
//     theme: 'striped',
//     headStyles: { fillColor: [22, 160, 133] },
//   });

//   doc.save('table.pdf');
// };

// const generatePDF = () => {
//   const doc = new jsPDF();
//   doc.setFontSize(20);
//   doc.text('Employee List', 14, 22);

//   const columns = ["Name", "Age", "Position"];
//   const rows = data.map(item => [item.name, item.age, item.position]);

//   doc.autoTable({
//     head: [columns],
//     body: rows,
//     startY: 30,
//     theme: 'striped',
//     headStyles: { fillColor: [22, 160, 133] },
//   });

//   doc.save('table.pdf');
// };

// const printPDF = () => {
//   const doc = new jsPDF();
//   doc.setFontSize(20);
//   doc.text('Employee List', 14, 22);

//   const columns = ["Name", "Age", "Position"];
//   const rows = data.map(item => [item.name, item.age, item.position]);

//   doc.autoTable({
//     head: [columns],
//     body: rows,
//     startY: 30,
//     theme: 'striped',
//     headStyles: { fillColor: [22, 160, 133] },
//   });

//   window.open(doc.output('bloburl'), '_blank');
// };

// const printPDF = () => {
//   const doc = new jsPDF();

//   // Set font size and style for the header
//   doc.setFontSize(16);
//   doc.setFont("helvetica", "bold");
//   doc.setTextColor(0, 0, 255); // Blue color for the header

//   // Calculate the center position for the username and email
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const headerText = `John Doe | 'john.doe@example.com'`;
//   const textWidth = doc.getTextWidth(headerText);
//   const textX = (pageWidth - textWidth) / 2;

//   // Add username and email to the document
//   doc.text(headerText, textX, 15);

//   // Add the main title
//   doc.setFontSize(20);
//   doc.setFont("helvetica", "bold");
//   doc.setTextColor(0, 0, 0); // Black color for the title
//   doc.text('Employee List', 14, 22);

//   // Set up the table columns and rows
//   const columns = ["Name", "Age", "Position"];
//   const rows = data.map(item => [item.name, item.age, item.position]);

//   // Add the table to the document
//   doc.autoTable({
//     head: [columns],
//     body: rows,
//     startY: 30,
//     theme: 'striped',
//     headStyles: { fillColor: [22, 160, 133] },
//   });

//   // Open the PDF in a new window
//   window.open(doc.output('bloburl'), '_blank');
// };

// const printPDF = () => {
//   const doc = new jsPDF();

//   // Set font size for the title
//   doc.setFontSize(20);
//   doc.text('Invoice Details', 14, 22);

//   // Set font size for the body
//   doc.setFontSize(12);

//   // Define the label and value for Invoice Number
//   const invoiceLabel = 'Invoice Number:';
//   const invoiceValue = purchaseInvoice !== null ? purchaseInvoice.purchaseInvoiceId : "PI-000";

//   // Add the Invoice Number label and value to the PDF
//   doc.text(invoiceLabel, 14, 40);
//   doc.text(invoiceValue, 60, 40);

//   // Open the generated PDF in a new tab
//   window.open(doc.output('bloburl'), '_blank');
// };

// const printPDF = () => {
//   const doc = new jsPDF();

//   // Set font size for the title
//   doc.setFontSize(20);
//   doc.text('Invoice Details', 14, 22);

//   // Set font size for the body
//   doc.setFontSize(12);

//   // Define the label and value for Invoice Number
//   const invoiceLabel = 'Invoice Number:';
//   const invoiceValue = purchaseInvoice !== null ? purchaseInvoice.purchaseInvoiceId : "PI-000";

//   // Add the Invoice Number label to the PDF
//   doc.text(invoiceLabel, 14, 40);

//   // Draw a rectangle to simulate an input field
//   const inputX = 60; // X coordinate for the input field
//   const inputY = 35; // Y coordinate for the input field
//   const inputWidth = 60; // Width of the input field
//   const inputHeight = 8; // Height of the input field

//   doc.rect(inputX, inputY, inputWidth, inputHeight); // Draw the rectangle

//   // Add the Invoice Number value inside the rectangle
//   doc.text(invoiceValue, inputX + 2, inputY + 6); // Adjust position to place text inside the rectangle

//   // Open the generated PDF in a new tab
//   window.open(doc.output('bloburl'), '_blank');
// };

{
  /* <Modal isOpen={modal} toggle={toggleModal} centered size="xl" className="custom-modal" style={{ minHeight: "600px" }}>
<ModalBody style={{ minHeight: "600px" }}>
  <button className="close-btn" onClick={toggleModal}>
    <IoClose />
  </button>
  <div className="footer-buttons">
    <div style={{ padding: "3px", borderRadius: "2px", cursor: "pointer" }} onClick={generatePDF}><IoMdDownload color="white" size="1.5rem" /></div>
    <div style={{ padding: "3px", borderRadius: "2px", cursor: "pointer" }} onClick={printPDF}><IoMdPrint color="white" size="1.5rem" /> </div>

  </div>
  <p>Here is a list of employees:</p>
  <div>
    {pages.map((page, pageIndex) => (
      <div key={pageIndex} className="page">
        {pageIndex !== 0 && <hr className="page-divider" />}
        <table>
          {pageIndex === 0 && (
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Position</th>
              </tr>
            </thead>
          )}
          <tbody>
            {page.map((item, index) => (
              <tr key={index} style={{ borderBottom: "0px", borderTop: "1px solid lightgray" }}>
                <td style={{ borderBottom: "0px", borderTop: "1px solid lightgray" }}>{item.name}</td>
                <td style={{ borderBottom: "0px", borderTop: "1px solid lightgray" }}>{item.age}</td>
                <td style={{ borderBottom: "0px", borderTop: "1px solid lightgray" }}>{item.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
</ModalBody>
</Modal>

<style>{`
.custom-modal .modal-dialog {
max-width: 800px;
margin: 30px auto;
}
.custom-modal .modal-content {
background: #fff;
border-radius: 0px;
padding: 20px;
}
.modal-backdrop.show {
opacity: 0.9;
background-color: black;
padding: 20px;
}
.close-btn {
position: fixed;
top: 3%;
left: 8.5%;
background: transparent;
border: none;
font-size: 2rem;
color: white;
cursor: pointer;
}
.footer-buttons {
position: fixed;
top: 4%;
right: 3%;
display: flex;
gap: 10px;
}
.page {
margin-bottom: 20px;
page-break-after: always;
}
.page-divider {
border-top: 6px solid black;
margin: 30px -40px;
}
`}</style> */
}
