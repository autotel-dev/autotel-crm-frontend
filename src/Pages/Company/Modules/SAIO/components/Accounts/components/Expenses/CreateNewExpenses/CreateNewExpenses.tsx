import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Container,
  Card,
  CardBody,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { P } from "../../../../../../../../../AbstractElements";
import jsPDF from "jspdf";
import "jspdf-autotable";
import SelectPayFromBox from "./components/SelectPayFromBox";
import SelectExpesneNumberBox from "./components/SelectExpesneNumberBox";
import SingleExpenseObject from "./components/SingleExpenseObject";
import Dropzone from "react-dropzone-uploader";
import { SubmitHandler } from "react-hook-form";
import {
  create,
  createWithMultipart,
  getAll,
  updateWithMultipart,
} from "../../../../../../../../../Utilities/api";
import {
  CREATE_NEW_EXPENSE,
  GET_ALL_EXPENSES,
  UPDATE_EXPENSES,
} from "../../../../../../../../../Utilities/api/apiEndpoints";
import {
  setExpense,
  setExpenses,
} from "../../../../../../../../../ReaduxToolkit/Reducer/ExpensesSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface CreateNewExpensesProps {
  // iscreateNewExpenses: boolean;
  // setIscreateNewExpenses: any
}

const CreateNewExpenses: React.FC<CreateNewExpensesProps> = (
  {
    // iscreateNewExpenses,
    // setIscreateNewExpenses,
  }
) => {
  const { expense } = useSelector((state: any) => state.expenses);
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bankAccount, setBankAccount] = useState(
    expense !== null ? expense.payFrom : ""
  );
  const [loading, setLoading] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
    date:
      expense !== null
        ? expense.date.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    reference: expense !== null ? expense.reference : "",
    totalAmount: expense !== null ? expense.totalAmount : "",
  });

  const { date, reference, totalAmount } = expenseForm;

  const getUserData = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    let name = event.target.name;
    let value = event.target.value;
    // console.log(name, value);
    setExpenseForm({ ...expenseForm, [name]: value });
  };

  const data = [
    { name: "John Doe", age: 30, position: "Developer" },
    { name: "Jane Smith", age: 25, position: "Designer" },
  ];

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Employee List", 14, 22);

    const columns = ["Name", "Age", "Position"];
    const rows = data.map((item) => [item.name, item.age, item.position]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("table.pdf");
  };

  const [expenseObjects, setExpenseObject] = useState<
    {
      expenseAccount: string;
      description: string;
      amount: string;
    }[]
  >(expense !== null ? expense.expenseItems : []);

  // Function to add a new body parameter
  const addExpenseObject = () => {
    // console.log("expenseObjects", expenseObjects);

    setExpenseObject([
      ...expenseObjects,
      {
        expenseAccount: "",
        amount: "",
        description: "",
      },
    ]);
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
      expenseAccount: string;
      amount: string;
      description: string;
    }
  ) => {
    // console.log("expenseObjects", expenseObjects);

    const updatedExpenseObject = expenseObjects.map((param, i) =>
      i === index
        ? {
            ...newParam,
          }
        : param
    );
    setExpenseObject(updatedExpenseObject);
    const totalAmount = updatedExpenseObject.reduce((sum, param) => {
      return sum + parseFloat(param.amount);
    }, 0);

    setExpenseForm({ ...expenseForm, totalAmount: totalAmount.toString() });
  };

  interface type {
    file: any;
    meta: any;
    remove: any;
  }
  const [isEdit, setIsEdit] = useState(false);
  const [attachementImage, setAttachementImage] = useState(null);
  const [editedAttachementImage, setEditedAttachementImage] = useState(null);

  const handleAttachementAdd = ({ file, meta, remove }: type, status: any) => {
    if (status === "done") {
      // // console.log("File uploaded successfully:", file);
      if (isEdit) {
        setEditedAttachementImage(file);
      } else {
        setAttachementImage(file);
      }
    } else if (status === "removed") {
      // // console.log("File removed:", file);
      if (isEdit) {
        setEditedAttachementImage(null);
      } else {
        setAttachementImage(null);
      }
    }
  };

  const addAndUpdateExpense: SubmitHandler<any> = async (data) => {
    setLoading(true);
    if (
      date !== "" &&
      totalAmount !== "" &&
      bankAccount !== "" &&
      expenseObjects.length > 0
    ) {
      const expenseData = {
        payFrom: bankAccount,
        reference: reference,
        date: date,
        totalAmount: Number(totalAmount),
        // expenseItems: expenseObjects.map((obj, i) => {
        //   return {
        //     ...obj,
        //     amount: Number(obj.amount)
        //   }
        // }),

        expenseItems: expenseObjects,
        attachement: attachementImage,
      };
      // console.log("new expense -> ", expenseData);

      // const formData = new FormData();
      // formData.append("payFrom", bankAccount);
      // formData.append("reference", reference);
      // formData.append("date", date);
      // formData.append("totalAmount", (Number(netPkr) + Number(shippingCharges)).toString());
      // formData.append("expenseItems", JSON.stringify(expenseObjects.map((obj, i) => ({
      //   ...obj,
      //   amount: Number(obj.amount)
      // }))));
      // // formData.append("shippingCharges", Number(shippingCharges).toString());
      // if (attachementImage !== null) {
      //   formData.append("attachement", attachementImage);
      // }

      // // console.log("new expense -> ", formData);

      try {
        const response: any =
          expense !== null
            ? await updateWithMultipart(expenseData, {
                url: `${UPDATE_EXPENSES}/${expense.id}`,
              })
            : await createWithMultipart(expenseData, {
                url: CREATE_NEW_EXPENSE,
              });
        if (response.success) {
          setLoading(false);
          dispatch(setExpense(null));
          const expensesResponse: any = await getAll({ url: GET_ALL_EXPENSES });
          if (expensesResponse.success) {
            dispatch(setExpenses(expensesResponse.data));
            // setIscreateNewExpenses(false)

            navigate(
              `${process.env.PUBLIC_URL}/company/modules/saio-central/accounts/expenses`
            );
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

  return (
    <>
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
              <SelectPayFromBox
                placeholder="Select Bank Account"
                setBankAccount={setBankAccount}
                bankAccount={bankAccount}
              />
            </Col>
            <Col md={3} xs={12}>
              <div>
                <P>
                  Expense Number
                  <span className="txt-danger">*</span>
                </P>
              </div>
              <Input
                type="text"
                placeholder="Enter Expense Number "
                value={expense !== null ? expense.expenseNumber : "EXP-000"}
                disabled
              />
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
              <div style={{ display: "flex", justifyContent: "end" }}>
                {userPersonalizationData !== null ? (
                  <Button
                    color=""
                    onClick={addExpenseObject}
                    style={{
                      color: "white",
                      backgroundColor: `${userPersonalizationData?.buttonsAndBarsColor}`,
                    }}
                  >
                    Add Expense
                  </Button>
                ) : (
                  <Button color="primary" onClick={addExpenseObject}>
                    Add Expense
                  </Button>
                )}
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
                <P>Attachement</P>
                <Dropzone
                  onChangeStatus={handleAttachementAdd}
                  // accept="image/*"
                  accept="image/*"
                  maxFiles={1}
                  inputContent="Drop files here or click to upload."
                />
              </Col>
              <Col lg={6} xs={12}>
                <Row className="g-3">
                  <Col lg={12} xs={12}>
                    {/* <P>
                            Shipping Charges
                            <span className="txt-danger">*</span>
                          </P>
                          <Input
                            type="text"
                            placeholder="Enter Shipping Charges"
                            value={shippingCharges}
                            name="shippingCharges"
                            onChange={getUserData}
                          /> */}
                  </Col>
                  <Col lg={12} xs={12} style={{ marginTop: "5px" }}>
                    <P>
                      Net (PKR)
                      <span className="txt-danger">*</span>
                    </P>
                    <Input
                      type="number"
                      placeholder="Enter Net Amount"
                      value={totalAmount}
                      name="totalAmount"
                      disabled
                      // onChange={getUserData}
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
                  // setIscreateNewExpenses(false);
                  navigate(
                    `${process.env.PUBLIC_URL}/company/modules/saio-central/accounts/expenses`
                  );
                }}
              >
                Cancel
              </Button>
              <Button color="primary" onClick={addAndUpdateExpense}>
                {loading ? "Loading..." : expense !== null ? "Save" : "Create"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </>
  );
};

export default CreateNewExpenses;
