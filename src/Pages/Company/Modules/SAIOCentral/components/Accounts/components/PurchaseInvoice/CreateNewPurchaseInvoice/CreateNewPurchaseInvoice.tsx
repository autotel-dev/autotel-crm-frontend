import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Container,
  Card,
  CardBody
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { P } from "../../../../../../../../../AbstractElements";
import { create, getAll } from "../../../../../../../../../Utilities/api";
import { CREATE_NEW_CUSTOMER, GET_ALL_CUSTOMERS, GET_SINGLE_CUSTOMERS } from "../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../Utilities/constants/constants";
import Swal from "sweetalert2";
import ShowError from "./ShowError";
import SelectCitiesBox from "./components/SelectVendorBox";
import { setCustomer, setCustomers, setIsConnected } from "../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import Skeleton from "../../../../../../../../Utilities/Skeleton/Skeleton";
import SelectSerialNumberBox from "./components/SelectSerialNumberBox";
import SelectVendorBox from "./components/SelectVendorBox";
import SelectProductBox from "./components/SelectProductBox";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MdDelete } from "react-icons/md";
import SingleProductObject from "./components/SingleProductObject";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface CreateNewPurchaseInvoiceProps {
  iscreateNewPurchaseInvoice: boolean;
  setIscreateNewPurchaseInvoice: any
}

const CreateNewPurchaseInvoice: React.FC<CreateNewPurchaseInvoiceProps> = ({
  iscreateNewPurchaseInvoice,
  setIscreateNewPurchaseInvoice,
}) => {

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const dispatch = useDispatch();

  const [customerLoading, setCustomerLoading] = useState(false);

  const [serialNumber, setSerialNumber] = useState("");
  const [vendor, setVendor] = useState("");
  const [loading, setLoading] = useState(false);

  const [purchaseInvoiceForm, setPurchaseInvoiceForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date().toISOString().slice(0, 10),
    reference: "",
    comments: "",
    shippingCharges: "",
    netPkr: ""
  });

  const {
    date,
    dueDate,
    reference,
    comments,
    shippingCharges,
    netPkr
  } = purchaseInvoiceForm;

  const getUserData = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    let name = event.target.name;
    let value = event.target.value;
    setPurchaseInvoiceForm({ ...purchaseInvoiceForm, [name]: value });
  };

  const data = [
    { "name": "John Doe", "age": 30, "position": "Developer" },
    { "name": "Jane Smith", "age": 25, "position": "Designer" },
  ];

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

  const [productObjects, setProductObjects] = useState<
    {
      product: string,
      quantity: string,
      price: string,
      discount: string,
      amount: string,
      description: string,
    }[]
  >([]);

  // Function to add a new body parameter
  const addProductObject = () => {
    console.log("productObjects", productObjects);

    setProductObjects([...productObjects, {
      product: "",
      quantity: "",
      price: "",
      discount: "",
      amount: "",
      description: "",
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
      quantity: string,
      price: string,
      discount: string,
      amount: string,
      description: string,
    }
  ) => {
    console.log("productObjects", productObjects);

    const updatedProductObject = productObjects.map((param, i) =>
      i === index ? {
        ...newParam,
        amount: calculateAmount(newParam.quantity, newParam.price, newParam.discount)
      } : param
    );
    setProductObjects(updatedProductObject);
  };

  // Function to calculate amount based on quantity, price, and discount
  const calculateAmount = (quantity: string, price: string, discount: string) => {
    const parsedQuantity = parseFloat(quantity);
    const parsedPrice = parseFloat(price);
    const parsedDiscount = parseFloat(discount);

    if (parsedQuantity && parsedPrice && parsedDiscount) {
      if (parsedDiscount > 0) {
        return ((parsedQuantity * parsedPrice) * ((100 - parsedDiscount) / 100)).toFixed(2);
      } else {
        return (parsedQuantity * parsedPrice).toFixed(2);
      }
    } else {
      return "";
    }
  };


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
                <Row className="g-3">
                  <Col lg={2} xs={12}>
                    <div>
                      <P>
                        Select Vendor
                        <span className="txt-danger">*</span>
                      </P>
                    </div>
                    <SelectVendorBox placeholder="Select Vendor" setVendor={setVendor} vendor={vendor} />
                  </Col>
                  <Col lg={2} xs={12}>
                    <div>
                      <P>
                        Select Serial Number
                        <span className="txt-danger">*</span>
                      </P>
                    </div>
                    <SelectSerialNumberBox placeholder="Select Number" setSerialNumber={setSerialNumber} serialNumber={serialNumber} />
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
                  <Col lg={2} xs={12}>
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
                  <Row className="g-3" style={{ marginTop: "35px" }}>
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

                  </Row>
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
                            type="text"
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
                            type="text"
                            placeholder="Enter Net Amount"
                            value={netPkr}
                            name="netPkr"
                            onChange={getUserData}
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
                    <Button color="primary" onClick={() => setIscreateNewPurchaseInvoice(false)}>
                      Cancel
                    </Button>
                    <Button color="primary">
                      {loading ? "Loading..." : "Create"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default CreateNewPurchaseInvoice;





