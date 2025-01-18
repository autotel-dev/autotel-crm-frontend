import { useState } from "react";
import { Button, Col, Form, Input, Row, Container } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { P } from "../../../../../../../../../AbstractElements";

import "jspdf-autotable";
import BcakgroundImage from "../../../../../../../../../assets/Background Image.png";
import { Select } from "antd";

import {
  StyleSheet,
  Document,
  Page,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import ViewPDFModal from "../../../../ViewPDFModal";
import { useNavigate } from "react-router-dom";
import {
  setSaleInvoice,
  setSaleInvoices,
} from "../../../../../../../../../ReaduxToolkit/Reducer/SaleInvoiceSlice";
import { formatUnderscoredString } from "../../../../../../../../../Utilities/globals/globals";
import { IMAGE_BASE_URL } from "../../../../../../../../../Utilities/api/apiEndpoints";

const InvoiceDetail = ({}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const { saleInvoice } = useSelector((state: any) => state.saleInvoice);
  // console.log("saleInv", saleInvoice);
  const { taxes } = useSelector((state: any) => state.taxes);
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
      width: "150px",
      height: "100px",
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
              <Text style={styles2.heavyText}>Address: </Text>
              <Text style={styles2.text}>{saleInvoice?.address}</Text>
            </View>
          </View>
          <br></br>

          <View>
            <View style={styles2.textRow}>
              <Text style={styles2.heavyText}>Mail: </Text>
              <Text style={styles2.text}>Mail@mail.com</Text>
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
              <Text style={styles2.heavyText}>{saleInvoice?.customerName}</Text>
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
            <Text style={styles2.tableCell2}>
              {saleInvoice?.invoiceDate.slice(0, 10)}
            </Text>
          </View>
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell}>Due Date</Text>
            <Text style={styles2.tableCell2}>
              {saleInvoice?.invoiceDueDate.slice(0, 10)}
            </Text>
          </View>
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell}>Reference</Text>
            <Text style={styles2.tableCell2}>{saleInvoice?.reference}</Text>
          </View>
        </View>

        <View>
          <View style={{ ...styles2.textRow, marginBottom: "10px" }}>
            <Text style={styles2.text}>Sale Invoice No: </Text>
            <Text style={styles2.heavyUnderlineText}>S-INV - 000</Text>
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
        {saleInvoice?.vehicles?.map((vehicle: any, index: any) => (
          <View style={styles2.tableRow}>
            <Text style={styles2.tableCell1}>{index + 1}</Text>

            <Text style={styles2.tableCell3}>
              <Text style={{ fontSize: "12px" }}>
                {vehicle?.registrationNo}
              </Text>
              {"\n"}
              {"\n"}
              {vehicle?.additionalServices?.map(
                (item: any) =>
                  `${formatUnderscoredString(item.service.title)} | `
              )}
            </Text>
            <Text style={styles2.tableCell1}>1</Text>
            <Text style={styles2.tableCell2}>{saleInvoice?.packagePrice}</Text>
            <Text style={styles2.tableCell2}>
              {saleInvoice?.discountedPackagePrice}
            </Text>
            <Text style={styles2.tableCell2}>
              {saleInvoice?.discountedPackagePrice}
            </Text>
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
            <Text style={styles2.heavyText}>{saleInvoice?.netAmount}</Text>
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
              {saleInvoice?.discountedPackagePrice *
                saleInvoice?.vehicles?.length}
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
            <Text style={styles2.heavyText}>
              {saleInvoice?.withHoldingCharges}
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
              Additional Charges:{" "}
            </Text>
            <Text style={styles2.heavyText}>
              {saleInvoice?.additionalCharges}
            </Text>
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
            <Text style={styles2.heavyText}>{saleInvoice?.tax}</Text>
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
            <Text style={styles2.heavyText}>{saleInvoice?.grossAmount}</Text>
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
                  value={saleInvoice?.customerName}
                  name="customerName"
                  disabled={saleInvoice !== null}
                />
              </Col>
              <Col lg={3} xs={12}>
                <P>Company Name</P>
                <Input
                  type="text"
                  placeholder="Enter Company Name"
                  value={saleInvoice?.companyName}
                  name="companyName"
                  disabled={saleInvoice !== null}
                />
              </Col>
              <Col lg={3} xs={12}>
                <P>Address</P>
                <Input
                  type="text"
                  placeholder="Enter Address"
                  value={saleInvoice?.address}
                  name="address"
                  disabled={saleInvoice !== null}
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
                  disabled={saleInvoice !== null}
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
                  value={saleInvoice?.invoiceDate.slice(0, 10)}
                  name="invoiceDate"
                  disabled={saleInvoice !== null}
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
                  value={saleInvoice?.invoiceDueDate.slice(0, 10)}
                  name="invoiceDueDate"
                  disabled={saleInvoice !== null}
                />
              </Col>
              <Col lg={3} xs={12}>
                <P>Reference</P>
                <Input
                  type="text"
                  placeholder="Enter Reference"
                  value={saleInvoice?.reference}
                  name="reference"
                  disabled={saleInvoice !== null}
                />
              </Col>

              <Row className="g-3" style={{ marginTop: "35px" }}>
                {saleInvoice?.vehicles?.length > 0 && (
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
                      {saleInvoice?.vehicles?.map((item: any, index: any) => (
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
                                  value={index + 1}
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
                                <textarea
                                  className="form-control"
                                  placeholder="Enter Comments"
                                  style={{
                                    minHeight: "130px",
                                    resize: "vertical",
                                  }}
                                  value={`${
                                    item.registrationNo
                                  } \n\n${item?.additionalServices
                                    ?.map(
                                      (service: any) => service?.service?.title
                                    )
                                    .join(" | ")}`}
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
                                  value={saleInvoice?.packagePrice}
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
                                  value={saleInvoice?.discountedPackagePrice}
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
                                  value={saleInvoice?.discountedPackagePrice}
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
                    rows={4.5}
                    style={{
                      maxHeight: "200px",
                      resize: "vertical",
                    }}
                    value={saleInvoice?.comments}
                    disabled={saleInvoice !== null}
                  />
                </Col>
                <Col lg={6} xs={12}>
                  <Row className="g-3">
                    <Col lg={12} xs={12} style={{ marginTop: "5px" }}>
                      <P>
                        Net (PKR)
                        <span className="txt-danger">*</span>
                      </P>
                      <Input
                        type="number"
                        value={saleInvoice?.netAmount}
                        disabled={saleInvoice !== null}
                      />
                    </Col>
                    <Col lg={12} xs={12}>
                      <P>
                        Additional Charges
                        <span className="txt-danger">*</span>
                      </P>
                      <Input
                        type="number"
                        value={saleInvoice?.additionalCharges}
                        disabled={saleInvoice !== null}
                      />
                    </Col>
                    <Col lg={12} xs={12}>
                      <P>
                        With Holding Charges
                        <span className="txt-danger">*</span>
                      </P>
                      <Input
                        type="number"
                        value={saleInvoice?.withHoldingCharges}
                        disabled={saleInvoice !== null}
                      />
                    </Col>
                    <Col lg={12} xs={12}>
                      <P>
                        Discounted Charges
                        <span className="txt-danger">*</span>
                      </P>
                      <Input
                        type="number"
                        value={saleInvoice?.discount}
                        disabled={saleInvoice !== null}
                      />
                    </Col>
                    <Col lg={12} xs={12}>
                      <P>
                        Select Tax
                        <span className="txt-danger">*</span>
                      </P>
                      <Input
                        type="number"
                        value={saleInvoice?.tax}
                        disabled={saleInvoice !== null}
                      />
                    </Col>
                    <Col lg={12} xs={12}>
                      <P>
                        Gross Amount
                        <span className="txt-danger">*</span>
                      </P>
                      <Input
                        type="text"
                        value={saleInvoice?.grossAmount}
                        disabled={saleInvoice !== null}
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
                  onClick={() => {
                    dispatch(setSaleInvoice(null));
                    navigate(
                      `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/invoices`
                    );
                  }}
                >
                  Cancel
                </Button>

                <Button color="primary" onClick={toggleModal}>
                  View PDF
                </Button>
              </Col>
            </Row>
          </Form>
        </Row>

        <ViewPDFModal
          modal={modal}
          toggleModal={toggleModal}
          body={downloadSaleInvoicePDF}
        />
      </Container>
    </>
  );
};

export default InvoiceDetail;
