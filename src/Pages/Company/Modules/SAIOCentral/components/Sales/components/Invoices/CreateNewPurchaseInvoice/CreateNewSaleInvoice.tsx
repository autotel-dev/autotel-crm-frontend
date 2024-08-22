






// import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';








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
  ModalFooter
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { P } from "../../../../../../../../../AbstractElements";

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MdDelete } from "react-icons/md";

import { SubmitHandler } from "react-hook-form";
import { create, getAll } from "../../../../../../../../../Utilities/api";
import { CREATE_NEW_PURCHASE_INVOICE, GET_ALL_PURCHASE_INVOICES } from "../../../../../../../../../Utilities/api/apiEndpoints";
import Swal from "sweetalert2";
import { setPurchaseInvoice, setPurchaseInvoices } from "../../../../../../../../../ReaduxToolkit/Reducer/PurchaseInvoiceSlice";

import { IoClose } from "react-icons/io5";
import { IoMdDownload, IoMdPrint } from "react-icons/io";
import html2canvas from 'html2canvas';










declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface CreateNewSaleInvoiceProps {
  iscreateNewInvoice: boolean;
  setIscreateNewInvoice: any
}

const CreateNewSaleInvoice: React.FC<CreateNewSaleInvoiceProps> = ({
  iscreateNewInvoice,
  setIscreateNewInvoice,
}) => {
  const { products, purchaseInvoice } = useSelector((state: any) => state.purchaseInvoice);
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const dispatch = useDispatch();

  const [customerLoading, setCustomerLoading] = useState(false);
  const [vendor, setVendor] = useState(purchaseInvoice !== null ? purchaseInvoice.vendor : "");
  const [branch, setBranch] = useState(purchaseInvoice !== null ? purchaseInvoice.branch : "");
  const [warehouse, setWarehouse] = useState(purchaseInvoice !== null ? purchaseInvoice.warehouse : "");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const [purchaseInvoiceForm, setPurchaseInvoiceForm] = useState({
    date: purchaseInvoice !== null ? purchaseInvoice?.invoiceDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    dueDate: purchaseInvoice !== null ? purchaseInvoice?.invoiceDueDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    reference: purchaseInvoice !== null ? purchaseInvoice?.reference : "",
    comments: purchaseInvoice !== null ? purchaseInvoice?.comments : "",
    shippingCharges: purchaseInvoice !== null ? purchaseInvoice?.shippingCharges : "",
    netAmount: purchaseInvoice !== null ? purchaseInvoice?.netAmount : ""
  });

  const {
    date,
    dueDate,
    reference,
    comments,
    shippingCharges,
    netAmount
  } = purchaseInvoiceForm;

  const getUserData = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    let name = event.target.name;
    let value = event.target.value;
    setPurchaseInvoiceForm({ ...purchaseInvoiceForm, [name]: value });
  };

  const data = [
    { "name": "John Doe", "age": 30, "position": "Developer" },
    { "name": "Jane Smith", "age": 25, "position": "Designer" },
    { "name": "John Doe1", "age": 30, "position": "Developer" },
    { "name": "Jane Smith1", "age": 25, "position": "Designer" },
    { "name": "John Doe2", "age": 30, "position": "Developer" },
    { "name": "Jane Smith2", "age": 25, "position": "Designer" },
    { "name": "John Doe3", "age": 30, "position": "Developer" },
    { "name": "Jane Smith3", "age": 25, "position": "Designer" },
    { "name": "John Doe4", "age": 30, "position": "Developer" },
    { "name": "Jane Smith4", "age": 25, "position": "Designer" },
    { "name": "John Doe5", "age": 30, "position": "Developer" },
    { "name": "Jane Smith5", "age": 25, "position": "Designer" },
    { "name": "John Doe", "age": 30, "position": "Developer" },
    { "name": "Jane Smith", "age": 25, "position": "Designer" },
    { "name": "John Doe1", "age": 30, "position": "Developer" },
    { "name": "Jane Smith1", "age": 25, "position": "Designer" },
    { "name": "John Doe2", "age": 30, "position": "Developer" },
    { "name": "Jane Smith2", "age": 25, "position": "Designer" },
    { "name": "John Doe3", "age": 30, "position": "Developer" },
    { "name": "Jane Smith3", "age": 25, "position": "Designer" },
    { "name": "John Doe4", "age": 30, "position": "Developer" },
    { "name": "Jane Smith4", "age": 25, "position": "Designer" },
    { "name": "John Doe5", "age": 30, "position": "Developer" },
    { "name": "Jane Smith5", "age": 25, "position": "Designer" },
    { "name": "John Doe", "age": 30, "position": "Developer" },
    { "name": "Jane Smith", "age": 25, "position": "Designer" },
    { "name": "John Doe1", "age": 30, "position": "Developer" },
    { "name": "Jane Smith1", "age": 25, "position": "Designer" },
    { "name": "John Doe2", "age": 30, "position": "Developer" },
    { "name": "Jane Smith2", "age": 25, "position": "Designer" },
    { "name": "John Doe3", "age": 30, "position": "Developer" },
    { "name": "Jane Smith3", "age": 25, "position": "Designer" },
    { "name": "John Doe4", "age": 30, "position": "Developer" },
    { "name": "Jane Smith4", "age": 25, "position": "Designer" },
    { "name": "John Doe5", "age": 30, "position": "Developer" },
    { "name": "Jane Smith5", "age": 25, "position": "Designer" },
  ];

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


  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Employee List', 14, 22);

    const columns = ["Name", "Age", "Position"];
    const rows = data.map(item => [item.name, item.age, item.position]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save('table.pdf');
  };

  const printPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Employee List', 14, 22);

    const columns = ["Name", "Age", "Position"];
    const rows = data.map(item => [item.name, item.age, item.position]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
    });

    window.open(doc.output('bloburl'), '_blank');
  };



















  // ---------------------------------------------------------------


  const pdfRef = useRef<HTMLDivElement | null>(null);


  const handleGeneratePdf = () => {
    if (pdfRef.current) {
      const input = pdfRef.current;
      html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          // Define padding
          const padding = 10; // Padding in mm

          // Calculate new dimensions and coordinates
          const imgWidth = pdfWidth - 2 * padding;
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
          const yOffset = padding;

          pdf.addImage(imgData, 'PNG', padding, yOffset, imgWidth, imgHeight);
          pdf.save('download.pdf');
        })
        .catch((err) => console.log(err));
    } else {
      console.error('Ref is null');
    }
  };




  // --------------------------------------------------------------


  const [productObjects, setProductObjects] = useState<
    {
      product: string,
      type: string,
      quantity: number,
      price: string,
      discount: number,
      totalAmount: string,
      description: string,
      serialsOrSkus: [];
    }[]
  >(purchaseInvoice !== null ? purchaseInvoice.productsDetails : []);

  // Function to add a new body parameter
  const addProductObject = () => {
    console.log("productObjects", productObjects);

    setProductObjects([...productObjects, {
      product: "",
      type: "",
      quantity: Number(""),
      price: "",
      discount: Number(""),
      totalAmount: "",
      description: "",
      serialsOrSkus: []
    }]);
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
      product: string,
      type: string,
      quantity: number,
      price: string,
      discount: number,
      totalAmount: string,
      description: string,
      serialsOrSkus: [];
    }
  ) => {
    console.log("productObjects", productObjects);

    const updatedProductObject = productObjects.map((param, i) =>
      i === index ? {
        ...newParam,
        totalAmount: newParam.discount == 0 ? calculateAmount(newParam.quantity, newParam.price, 0) : calculateAmount(newParam.quantity, newParam.price, newParam.discount)
      } : param
    );


    setProductObjects(updatedProductObject);
    const totalAmount = updatedProductObject.reduce((sum, param) => {
      return sum + parseFloat(param.totalAmount);
    }, 0);
    console.log("total", totalAmount);


    setPurchaseInvoiceForm({ ...purchaseInvoiceForm, netAmount: totalAmount });
  };

  // Function to calculate amount based on quantity, price, and discount
  const calculateAmount = (quantity: number, price: string, discount: number) => {
    console.log(quantity, price, discount);

    const parsedQuantity = quantity;
    const parsedPrice = parseFloat(price);
    const parsedDiscount = discount;

    if (parsedQuantity && parsedPrice) {
      if (parsedDiscount > 0) {
        return ((parsedQuantity * parsedPrice) * ((100 - parsedDiscount) / 100)).toFixed(2);
      } else {
        return (parsedQuantity * parsedPrice).toFixed(2);
      }
    } else {
      return "";
    }
  };


  const addAndUpdatePurchaseInvoice: SubmitHandler<any> = async (data) => {
    setLoading(true);
    if (
      date !== "" && vendor !== "" && dueDate !== "" && productObjects.length > 0 && netAmount > 0 && shippingCharges > 0
    ) {
      let isValid = true;
      productObjects.forEach((item) => {
        if (item.quantity == 0) {
          Swal.fire({
            text: `Quantity of ${products.find((i: any) => i._id == item.product).name} of type ${item.type} is ${item.quantity}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          isValid = false;
          setLoading(false);
          return;
        }
        if ((item.type === "SIM" || item.type === "DEVICES") && Number(item.quantity) !== item.serialsOrSkus.length) {
          Swal.fire({
            text: `Quantity for ${products.find((i: any) => i._id == item.product).name} of type ${item.type} does not match the number of ${item.type == "SIM" ? "Sim numbers" : item.type == "DEVICES" ? "IMEIS" : "serial numbers"}`,
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
        productsDetails: productObjects.map(({ type, quantity, serialsOrSkus = [], ...rest }) => {
          const updatedSerialsOrSku = serialsOrSkus.length > 0
            ? serialsOrSkus
            : Array.from({ length: quantity }, () => ({ serialNumber: null, sku: null }));

          return {
            ...rest,
            quantity,
            serialsOrSkus: updatedSerialsOrSku,
          };
        })
      };

      try {
        const response: any = await create(purchaseInvoiceData, { url: CREATE_NEW_PURCHASE_INVOICE });
        if (response.success) {
          setLoading(false);
          const purchaseInvoicesResponse: any = await getAll({ url: GET_ALL_PURCHASE_INVOICES });
          if (purchaseInvoicesResponse.success) {
            dispatch(setPurchaseInvoices(purchaseInvoicesResponse.data));
            setIscreateNewInvoice(false);
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

  const rowsPerPage = 20;
  const pages = [];
  for (let i = 0; i < data.length; i += rowsPerPage) {
    pages.push(data.slice(i, i + rowsPerPage));
  }


  const toggleModal = () => setModal(!modal);

  return (
    <>
      <Container fluid>
        <Card>
          <CardBody>
            <Row>
              <Form
                onSubmit={(event) => event.preventDefault()}
                className="needs-validation"
                noValidate
              >
                <div ref={pdfRef}>
                  <Row className="g-3" >
                    <Col lg={3} xs={12}>
                      <P>
                        Customer Name
                      </P>
                      <Input
                        type="text"
                        placeholder="Enter Reference"
                        value={reference}
                        name="reference"
                        onChange={getUserData}
                      />
                    </Col>
                    <Col lg={3} xs={12}>
                      <P>
                        Company Name
                      </P>
                      <Input
                        type="text"
                        placeholder="Enter Reference"
                        value={reference}
                        name="reference"
                        onChange={getUserData}
                      />
                    </Col>
                    <Col lg={3} xs={12}>
                      <P>
                        Address
                      </P>
                      <Input
                        type="text"
                        placeholder="Enter Reference"
                        value={reference}
                        name="reference"
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
                        value={purchaseInvoice !== null ? purchaseInvoice.purchaseInvoiceId : "PI-000"}
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
                      />
                    </Col>
                    <Col lg={3} xs={12}>
                      <P>
                        Reference
                      </P>
                      <Input
                        type="text"
                        placeholder="Enter Reference"
                        value={reference}
                        name="reference"
                        onChange={getUserData}
                      />
                    </Col>

                    {/* <Row className="g-3" style={{ marginTop: "35px" }}>
                      <div style={{ display: "flex", justifyContent: "end" }}>
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
                        }
                      </div>
                      {productObjects.length > 0 && <table style={{ border: "1px solid lightgray", width: "100%" }}>
                        <thead>
                          <tr>
                            <th style={{ width: "23%", borderRight: "1px solid lightgray" }}>
                              Product
                            </th>
                            <th style={{ width: "17%", borderRight: "1px solid lightgray" }}>
                              Quantity
                            </th>
                            <th style={{ width: "17%", borderRight: "1px solid lightgray" }}>
                              Price
                            </th>
                            <th style={{ width: "17%", borderRight: "1px solid lightgray" }}>
                              Discount
                            </th>
                            <th style={{ width: "17%", borderRight: "1px solid lightgray" }}>
                              Amount
                            </th>
                            <th style={{ width: "10%", borderRight: "1px solid lightgray" }}>Actions</th>
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
                            />
                          ))}
                        </tbody>
                      </table>}


                    </Row> */}
                    <Row className="g-3" style={{ marginTop: "15px" }}>
                      <Col lg={6} xs={12}>
                        <P>
                          Comments
                        </P>
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
                      <Button color="primary" onClick={() => { dispatch(setPurchaseInvoice(null)); setIscreateNewInvoice(false) }}>
                        Cancel
                      </Button>
                      <Button color="primary" onClick={addAndUpdatePurchaseInvoice}>
                        {loading ? "Loading..." : "Create"}
                      </Button>


                      <Button color="primary" onClick={toggleModal}>VIew</Button>
                    </Col>
                  </Row>
                </div>

              </Form>


            </Row>
            <Modal isOpen={modal} toggle={toggleModal} centered size="xl" className="custom-modal" style={{ minHeight: "600px" }}>
              <ModalBody style={{ minHeight: "600px" }}>
                <button className="close-btn" onClick={toggleModal}>
                  <IoClose />
                </button>
                <div className="footer-buttons">
                  <div style={{ padding: "3px", borderRadius: "2px", cursor: "pointer" }} onClick={generatePDF}><IoMdDownload color="white" size="1.5rem" /></div>
                  <div style={{ padding: "3px", borderRadius: "2px", cursor: "pointer" }} onClick={printPDF}><IoMdPrint color="white" size="1.5rem" /> </div>
                  {/* <Button color="danger" onClick={toggleModal}>Close</Button> */}
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
`}</style>






          </CardBody>
        </Card>
      </Container >
    </>
  );
};

export default CreateNewSaleInvoice;










