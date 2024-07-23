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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SelectPayFromBox from "./components/SelectPayFromBox";
import SelectExpesneNumberBox from "./components/SelectExpesneNumberBox";
import SingleExpenseObject from "./components/SingleExpenseObject";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface CreateNewExpensesProps {
  iscreateNewExpenses: boolean;
  setIscreateNewExpenses: any
}

const CreateNewExpenses: React.FC<CreateNewExpensesProps> = ({
  iscreateNewExpenses,
  setIscreateNewExpenses,
}) => {

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const dispatch = useDispatch();

  const [customerLoading, setCustomerLoading] = useState(false);

  const [expenseNumber, setExpenseNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [loading, setLoading] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    reference: "",
    comments: "",
    shippingCharges: "",
    netPkr: ""
  });

  const {
    date,
    reference,
    comments,
    shippingCharges,
    netPkr
  } = expenseForm;

  const getUserData = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    let name = event.target.name;
    let value = event.target.value;
    console.log(name, value);

    setExpenseForm({ ...expenseForm, [name]: value });
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

  const [expenseObjects, setExpenseObject] = useState<
    {
      expense: string
      description: string,
      amount: string,
    }[]
  >([]);

  // Function to add a new body parameter
  const addExpenseObject = () => {
    console.log("expenseObjects", expenseObjects);

    setExpenseObject([...expenseObjects, {
      expense: "",
      amount: "",
      description: "",
    }]);
  };

  // Function to delete a body parameter
  const deleteExpenseObject = (index: number) => {
    const updatedParams = expenseObjects.filter((_, i) => i !== index);
    setExpenseObject(updatedParams);
  };

  // Function to handle body parameter changes
  const handleExpenseObjectChange = (
    index: number,
    newParam: {
      expense: string
      amount: string,
      description: string,
    }
  ) => {
    console.log("expenseObjects", expenseObjects);

    const updatedExpenseObject = expenseObjects.map((param, i) =>
      i === index ? {
        ...newParam,
      } : param
    );
    setExpenseObject(updatedExpenseObject);
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
                  <Col md={3} xs={12}>
                    <div>
                      <P>
                        Pay From
                        <span className="txt-danger">*</span>
                      </P>
                    </div>
                    <SelectPayFromBox placeholder="Select Vendor" setBankAccount={setBankAccount} bankAccount={bankAccount} />
                  </Col>
                  <Col md={3} xs={12}>
                    <div>
                      <P>
                        Expense Number
                        <span className="txt-danger">*</span>
                      </P>
                    </div>
                    <SelectExpesneNumberBox placeholder="Select Number" setExpenseNumber={setExpenseNumber} expenseNumber={expenseNumber} />
                  </Col>
                  <Col md={3} xs={12}>
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

                  <Col md={3} xs={12}>
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
                            onClick={addExpenseObject}
                            style={{
                              color: "white",
                              backgroundColor: `${userPersonalizationData?.buttonsAndBarsColor
                                }`,
                            }}
                          >
                            Add Expense
                          </Button>
                        ) : (
                          <Button color="primary" onClick={addExpenseObject}>
                            Add Expense
                          </Button>
                        )
                      }
                    </div>

                    {expenseObjects.map((param, index) => (
                      <SingleExpenseObject
                        key={index}
                        param={param}
                        onChange={(newParam: any) =>
                          handleExpenseObjectChange(index, newParam)
                        }
                        onDelete={() => deleteExpenseObject(index)}
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
                    <Button color="primary" onClick={() => setIscreateNewExpenses(false)}>
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

export default CreateNewExpenses;





