import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { Button, Col, Form, Input, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { P } from "../../../../../../../../../AbstractElements";
import SelectCustomerBox from "./components/SelectCustomerBox";
import "jspdf-autotable";
import SelectFromAccountBox from "./components/SelectFromAccountBox";
import SelectToAccountBox from "./components/SelectToAccountBox";
import { SubmitHandler } from "react-hook-form";
import {
  create,
  getAll,
  update,
} from "../../../../../../../../../Utilities/api";
import {
  CREATE_RECEIVE_MONEY,
  RECEIVE_MONEY_STATUS_CHANGE,
} from "../../../../../../../../../Utilities/api/apiEndpoints";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import {
  setReceiveMoney,
  setReceiveMoneyLoading,
} from "../../../../../../../../../ReaduxToolkit/Reducer/ReceiveMoneySlice";
import { formatUnderscoredString } from "../../../../../../../../../Utilities/globals/globals";
import DataTable from "react-data-table-component";
import { setSaleInvoiceLoading } from "../../../../../../../../../ReaduxToolkit/Reducer/SaleInvoiceSlice";

const CreateNewReceiveMoney = ({}) => {
  const { receiveMoney, saleInvoices } = useSelector(
    (state: any) => state.receiveMoneys
  );

  const dispatch = useDispatch();

  const [customer, setCustomer] = useState(
    receiveMoney !== null ? receiveMoney?.customer?._id : ""
  );
  const [customerBalance, setCustomerBalance] = useState("");
  const [customerReceivables, setCustomerReceivables] = useState("");
  const [fromAccount, setFromAccount] = useState(
    receiveMoney !== null ? receiveMoney?.debitAccount?._id : ""
  );
  const [toAccount, setToAccount] = useState(
    receiveMoney !== null ? receiveMoney?.creditAccount?._id : ""
  );
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const [receiveMoneyForm, setReceiveMoneyForm] = useState({
    paymentDate:
      receiveMoney !== null
        ? receiveMoney?.date?.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    reference: receiveMoney !== null ? receiveMoney?.reference : "",
    comments: receiveMoney !== null ? receiveMoney?.comments : "",
    amount: receiveMoney !== null ? receiveMoney?.amount : 0,
  });

  const { paymentDate, reference, comments, amount } = receiveMoneyForm;

  const getUserData = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    let name = event.target.name;
    let value = event.target.value;
    setReceiveMoneyForm({ ...receiveMoneyForm, [name]: value });
    console.log("value", value);
  };

  // ---------------------------------------------------------------

  const pdfRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // --------------------------------------------------------------

  const [dataa, setDataa] = useState<any[]>([]); // Initial empty state

  const [totalamountLess, sertIstotalAmountLess] = useState(false);

  // Handling changes in payment input
  const handlePaymentChange = (invoiceId: string, payment: number) => {
    setDataa((prevData) => {
      // Step 1: Update the payment for the specific invoice
      const updatedData = prevData.map((row) =>
        row._id === invoiceId ? { ...row, payment: payment } : row
      );

      // Step 2: Filter out rows where payment > 0
      const rowsWithPaymentGreaterThanZero = updatedData.filter(
        (row) => row.payment > 0
      );

      // Step 3: Filter out rows where payment === 0
      const rowsWithPaymentZero = updatedData.filter(
        (row) => row.payment === 0
      );

      // Step 4: Calculate the sum of payments of rows where payment === 0
      const totalPaymentZero = rowsWithPaymentGreaterThanZero.reduce(
        (sum, row) => sum + row.payment,
        0
      );

      // Step 5: Return true or false based on the sum of payment === 0 rows
      const isSumGreaterThan2000 = totalPaymentZero > receiveMoneyForm.amount;
      console.log("isSumGreaterThan2000", isSumGreaterThan2000);

      sertIstotalAmountLess(isSumGreaterThan2000);
      // You can do something with this boolean value here, e.g., set some state or trigger an action

      return updatedData; // returning the updated data to setDataa
    });
  };

  const addReceiveMoney: SubmitHandler<any> = async (data) => {
    setLoading(true);
    const sales = dataa
      .filter((item: any) => item.payment > 0)
      .map((item: any) => ({
        id: item._id, // or any unique identifier
        amount: item.payment,
      }));

    const totalSalesAmount = sales.reduce((sum, item) => sum + item.amount, 0);

    // Step 3: Calculate the overpayment balance
    const overPaymentBalance = Number(amount) - totalSalesAmount;
    if (
      paymentDate !== "" &&
      customer !== "" &&
      amount > 0 &&
      fromAccount !== "" &&
      toAccount !== "" &&
      sales.length > 0
    ) {
      const receiveMoneyData = {
        customer: customer,
        paymentDate: new Date(paymentDate),
        reference: reference,
        amount: Number(amount),
        comments: comments,
        fromAccount: fromAccount,
        toAccount: toAccount,
        saleInvoices: sales.length > 0 ? sales : [],
        overPaymentBalance:
          sales.length > 0
            ? Number(customerBalance) + overPaymentBalance
            : Number(customerBalance) + Number(amount),
      };

      try {
        const response: any = await create(receiveMoneyData, {
          url: CREATE_RECEIVE_MONEY,
        });
        if (response.success) {
          dispatch(setSaleInvoiceLoading(true));
          dispatch(setReceiveMoneyLoading(true));
          dispatch(setReceiveMoney(response.data));
          setLoading(false);

          // navigate(
          //   `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/receive-money`
          // );
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

  const approvedReceiveMoney: SubmitHandler<any> = async (data) => {
    setLoading(true);
    const receiveMoneyData = {
      receiveMoneyId: receiveMoney._id,
      status: "APPROVED",
    };

    try {
      const response: any = await update(receiveMoneyData, {
        url: RECEIVE_MONEY_STATUS_CHANGE,
      });
      if (response.success) {
        dispatch(setReceiveMoneyLoading(true));
        setLoading(false);
        navigate(
          `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/receive-money`
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

  useEffect(() => {
    const fetchData = async () => {
      // Filter items based on the vendor ID and map over the filtered items to format them
      const formattedData = saleInvoices
        .filter((item: any) => item.customer === customer)
        .filter(
          (item: any) => item.status !== "PAID" && item.status !== "ISSUED"
        )
        .map((item: any) => ({
          ...item,
          adjustedAmount: item?.transactions.reduce(
            (sum: any, item: any) => sum + item.amount,
            0
          ),
          invoiceDate: `${item?.invoiceDate
            .toString()
            .slice(0, 10)},  ${new Date(item?.updatedAt)
            .toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .toString()}`,
          invoiceDueDate: `${item?.invoiceDueDate
            .toString()
            .slice(0, 10)},  ${new Date(item?.updatedAt)
            .toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .toString()}`,
          payment: 0, // Set initial value for payment
        }));

      setDataa(formattedData);
    };

    fetchData();
  }, [customer]);

  const columns = [
    {
      name: "Date",
      selector: (row: any) => row["invoiceDate"],
      sortable: true,
      width: "15%",
    },
    {
      name: "Due Date",
      selector: (row: any) => row["invoiceDueDate"],
      sortable: true,
      center: true,
      width: "15%",
    },

    {
      name: "Status",
      selector: (row: any) => row["status"],
      sortable: true,
      width: "10%",
      cell: (row: any) => (
        <div
          style={{
            width: "80%",
            textAlign: "center",
            padding: "5px",
            borderRadius: "5px",
            backgroundColor:
              row.status === "DRAFT"
                ? "rgba(0, 0, 255, 0.3)"
                : "rgba(0, 255, 0, 0.3)",
            color: "black",
          }}
        >
          {formatUnderscoredString(row.status)}
        </div>
      ),
    },
    {
      name: "Customer",
      selector: (row: any) => row.customerName,
      sortable: true,
      width: "12%",
    },
    {
      name: "Net Amount",
      selector: (row: any) => row["netAmount"],
      sortable: true,
      width: "10%",
    },
    {
      name: "Adjusted Amount",
      selector: (row: any) => row["adjustedAmount"],
      sortable: true,
      width: "8%",
    },
    {
      name: "Balance",
      selector: (row: any) => row["remainingBalance"],
      sortable: true,
      width: "8%",
    },
    {
      name: "Payment",
      selector: (row: any) => row["payment"],
      sortable: true,
      width: "15%",
      cell: (row: any) => (
        <Input
          type="number"
          value={row.payment || ""}
          name="paymentDate"
          onChange={(e) =>
            handlePaymentChange(row._id, parseFloat(e.target.value))
          }
          placeholder="Enter Payment"
          disabled={row.status == "PAID"}
        />
      ),
    },
  ];

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
                <Col lg={4} xs={12}>
                  <div>
                    <P>
                      From Customer
                      <span className="txt-danger">*</span>
                    </P>
                  </div>
                  <SelectCustomerBox
                    placeholder="Select Customer"
                    setCustomer={setCustomer}
                    customer={customer}
                    setFromAccount={setFromAccount}
                    fromAccount={fromAccount}
                    // disabled={receiveMoney !== null}  setVendorPayables={setVendorPayables}
                    setCustomerBalance={setCustomerBalance}
                    setCustomerReceivables={setCustomerReceivables}
                  />
                </Col>
                {receiveMoney == null && (
                  <Col lg={4} xs={12}>
                    <P>Customer Receivables</P>
                    <Input
                      type="text"
                      placeholder="0"
                      value={customerReceivables}
                      disabled={true}
                    />
                  </Col>
                )}
                {receiveMoney == null && (
                  <Col lg={4} xs={12}>
                    <P>Customer Balance</P>
                    <Input
                      type="text"
                      placeholder="0"
                      value={customerBalance}
                      disabled={true}
                    />
                  </Col>
                )}

                <Col lg={4} xs={12}>
                  <P>
                    Date
                    <span className="txt-danger">*</span>
                  </P>
                  <Input
                    type="date"
                    placeholder="Enter Date "
                    value={paymentDate}
                    name="paymentDate"
                    onChange={getUserData}
                    // disabled={receiveMoney !== null}
                  />
                </Col>

                <Col lg={4} xs={12}>
                  <P>Reference</P>
                  <Input
                    type="text"
                    placeholder="Enter Reference"
                    value={reference}
                    name="reference"
                    onChange={getUserData}
                    // disabled={receiveMoney !== null}
                  />
                </Col>
                {/* <Col lg={4} xs={12}>
                  <div>
                    <P>
                      From Account
                      <span className="txt-danger">*</span>
                    </P>
                  </div>
                  <SelectFromAccountBox
                    placeholder="Select From"
                    setFromAccount={setFromAccount}
                    fromAccount={fromAccount}
                  />
                </Col> */}
                <Col lg={4} xs={12}>
                  <div>
                    <P>
                      Account
                      <span className="txt-danger">*</span>
                    </P>
                  </div>
                  <SelectToAccountBox
                    placeholder="Select To"
                    setToAccount={setToAccount}
                    toAccount={toAccount}
                    // disabled={receiveMoney !== null}
                  />
                </Col>

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
                      // disabled={receiveMoney !== null}
                    />
                  </Col>
                  <Col lg={6} xs={12}>
                    <Row className="g-3">
                      <Col lg={12} xs={12}>
                        <P>
                          Amount
                          <span className="txt-danger">*</span>
                        </P>
                        <Input
                          type="number"
                          placeholder="Enter Amount"
                          value={amount}
                          name="amount"
                          onChange={getUserData}
                          // disabled={receiveMoney !== null}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {customer !== "" && (
                  <div>
                    <DataTable
                      columns={columns}
                      data={dataa}
                      pagination
                      customStyles={{
                        rows: {
                          style: {
                            cursor: "pointer",
                            transition: "background-color 0.2s",
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
                  </div>
                )}

                {totalamountLess && (
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    Your invoices amount is greater than Total &nbsp;
                    {receiveMoneyForm.amount}
                  </p>
                )}

                <Col
                  xs={12}
                  className="text-end d-flex justify-content-end gap-2 align-center"
                  style={{ marginTop: "20px" }}
                >
                  <Button
                    color="primary"
                    disabled={loading}
                    onClick={() => {
                      dispatch(setReceiveMoney(null));
                      // setIscreateNewPurchaseInvoice(false);

                      navigate(
                        `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/receive-money`
                      );
                    }}
                  >
                    Cancel
                  </Button>
                  {receiveMoney == null && (
                    <Button
                      disabled={loading || totalamountLess}
                      color="primary"
                      onClick={addReceiveMoney}
                    >
                      {loading ? "Loading..." : "Create"}
                    </Button>
                  )}
                  {receiveMoney !== null && receiveMoney?.status == "DRAFT" && (
                    <Button
                      disabled={loading}
                      color="primary"
                      onClick={approvedReceiveMoney}
                    >
                      {loading ? "Loading..." : "Approve"}
                    </Button>
                  )}
                  {receiveMoney !== null &&
                    receiveMoney?.status == "APPROVED" && (
                      <Button
                        disabled={true}
                        color="primary"
                        onClick={() => {}}
                      >
                        {loading ? "Loading..." : "Approved"}
                      </Button>
                    )}
                  {/* {receiveMoney !== null && (
                    <Button color="primary" onClick={toggleModal}>
                      View PDF
                    </Button>
                  )} */}
                </Col>
              </Row>
            </div>
          </Form>
        </Row>
      </>
    </>
  );
};

export default CreateNewReceiveMoney;
