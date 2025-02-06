import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { Button, Col, Form, Input, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { P } from "../../../../../../../../../AbstractElements";
import SelectVendorBox from "./components/SelectVendorBox";
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
  CREATE_MAKE_PAYMENT,
  MAKE_PAYMENT_STATUS_CHANGE,
} from "../../../../../../../../../Utilities/api/apiEndpoints";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import {
  setMakePayment,
  setMakePaymentLoading,
} from "../../../../../../../../../ReaduxToolkit/Reducer/MakePaymentSlice";
import DataTable from "react-data-table-component";
import { formatUnderscoredString } from "../../../../../../../../../Utilities/globals/globals";

const CreateNewMakePayment = ({}) => {
  const { makePayment, purchaseInvoices } = useSelector(
    (state: any) => state.makePayments
  );

  const dispatch = useDispatch();

  const [vendor, setVendor] = useState(
    makePayment !== null ? makePayment?.vendor?._id : ""
  );
  const [vendorBalance, setVendorBalnce] = useState("");
  const [vendorPayables, setVendorPayables] = useState("");
  const [fromAccount, setFromAccount] = useState(
    makePayment !== null ? makePayment?.creditAccount?._id : ""
  );
  const [toAccount, setToAccount] = useState(
    makePayment !== null ? makePayment?.debitAccount?._id : ""
  );
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const [makePaymentForm, setPurchaseInvoiceForm] = useState({
    paymentDate:
      makePayment !== null
        ? makePayment?.date?.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    reference: makePayment !== null ? makePayment?.reference : "",
    comments: makePayment !== null ? makePayment?.comments : "",
    amount: makePayment !== null ? makePayment?.amount : 0,
  });

  const { paymentDate, reference, comments, amount } = makePaymentForm;

  const getUserData = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    let name = event.target.name;
    let value = event.target.value;
    setPurchaseInvoiceForm({ ...makePaymentForm, [name]: value });
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
      const isSumGreaterThan2000 = totalPaymentZero > makePaymentForm.amount;
      console.log("isSumGreaterThan2000", isSumGreaterThan2000);

      sertIstotalAmountLess(isSumGreaterThan2000);
      // You can do something with this boolean value here, e.g., set some state or trigger an action

      return updatedData; // returning the updated data to setDataa
    });
  };

  const addAndUpdateMakePayment: SubmitHandler<any> = async (data) => {
    setLoading(true);
    const purchases = dataa
      .filter((item: any) => item.payment > 0)
      .map((item: any) => ({
        id: item._id, // or any unique identifier
        amount: item.payment,
      }));

    const totalPurchasesAmount = purchases.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    // Step 3: Calculate the overpayment balance
    const overPaymentBalance = Number(amount) - totalPurchasesAmount;
    if (
      paymentDate !== "" &&
      vendor !== "" &&
      amount > 0 &&
      fromAccount !== "" &&
      toAccount !== ""
      // &&
      // purchases.length > 0
    ) {
      const makePaymentData = {
        vendor: vendor,
        paymentDate: new Date(paymentDate),
        reference: reference,
        amount: Number(amount),
        comments: comments,
        fromAccount: fromAccount,
        toAccount: toAccount,
        purchaseInvoices: purchases.length > 0 ? purchases : [],
        overPaymentBalance:
          purchases.length > 0
            ? Number(vendorBalance) + overPaymentBalance
            : Number(vendorBalance) + Number(amount),
      };

      try {
        const response: any = await create(makePaymentData, {
          url: CREATE_MAKE_PAYMENT,
        });
        if (response.success) {
          dispatch(setMakePaymentLoading(true));
          dispatch(setMakePayment(response.data));
          setLoading(false);
          // navigate(
          //   `${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/make-payments`
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

  const approvedMakePayment: SubmitHandler<any> = async (data) => {
    setLoading(true);
    const receiveMoneyData = {
      makePaymentId: makePayment._id,
      status: "APPROVED",
    };

    try {
      const response: any = await update(receiveMoneyData, {
        url: MAKE_PAYMENT_STATUS_CHANGE,
      });
      if (response.success) {
        dispatch(setMakePaymentLoading(true));
        setLoading(false);
        navigate(
          `${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/make-payments`
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
      const formattedData = purchaseInvoices
        .filter((item: any) => item.vendor?._id === vendor)
        .filter(
          (item: any) => item.status !== "PAID" && item.status !== "DRAFT"
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
  }, [vendor]);

  const columns = [
    // {
    //   name: "Date",
    //   selector: (row: any) => row["invoiceDate"],
    //   sortable: true,
    //   width: "15%",
    // },
    {
      name: "Due Date",
      selector: (row: any) => row["invoiceDueDate"],
      sortable: true,
      center: true,
      width: "15%",
    },
    {
      name: "Invoice Id",
      selector: (row: any) => row["purchaseInvoiceId"],
      sortable: true,
      width: "12%",
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
      name: "Vendor",
      selector: (row: any) => row.vendor?.vendorName,
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
          disabled={row.status == "PAID" || makePayment !== null}
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
                      To Vendor
                      <span className="txt-danger">*</span>
                    </P>
                  </div>
                  <SelectVendorBox
                    placeholder="Select Vendor"
                    setVendor={setVendor}
                    vendor={vendor}
                    setToAccount={setToAccount}
                    toAccount={toAccount}
                    setVendorPayables={setVendorPayables}
                    setVendorBalance={setVendorBalnce}
                    // disabled={makePayment !== null}
                  />
                </Col>
                {makePayment == null && (
                  <Col lg={4} xs={12}>
                    <P>Vendor Payables</P>
                    <Input
                      type="text"
                      placeholder="0"
                      value={vendorPayables}
                      disabled={true}
                    />
                  </Col>
                )}
                {makePayment == null && (
                  <Col lg={4} xs={12}>
                    <P>Vendor Balance</P>
                    <Input
                      type="text"
                      placeholder="0"
                      value={vendorBalance}
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
                    // disabled={makePayment !== null}
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
                    // disabled={makePayment !== null}
                  />
                </Col>
                <Col lg={4} xs={12}>
                  <div>
                    <P>
                      Account
                      <span className="txt-danger">*</span>
                    </P>
                  </div>
                  <SelectFromAccountBox
                    placeholder="Select From"
                    setFromAccount={setFromAccount}
                    fromAccount={fromAccount}
                    // disabled={makePayment !== null}
                  />
                </Col>
                {/* <Col lg={4} xs={12}>
                  <div>
                    <P>
                      To Account
                      <span className="txt-danger">*</span>
                    </P>
                  </div>
                  <SelectToAccountBox
                    placeholder="Select To"
                    setToAccount={setToAccount}
                    toAccount={toAccount}
                    // disabled={makePayment !== null}
                  />
                </Col> */}

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
                      disabled={makePayment !== null}
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
                          // disabled={makePayment !== null}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {vendor !== "" && (
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
                    {makePaymentForm.amount}
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
                      dispatch(setMakePayment(null));
                      // setIscreateNewPurchaseInvoice(false);

                      navigate(
                        `${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/make-payments`
                      );
                    }}
                  >
                    Cancel
                  </Button>
                  {makePayment == null && (
                    <Button
                      disabled={loading || totalamountLess}
                      color="primary"
                      onClick={addAndUpdateMakePayment}
                    >
                      {loading ? "Loading..." : "Create"}
                    </Button>
                  )}
                  {makePayment !== null && makePayment?.status == "DRAFT" && (
                    <Button
                      disabled={loading}
                      color="primary"
                      onClick={approvedMakePayment}
                    >
                      {loading ? "Loading..." : "Approve"}
                    </Button>
                  )}
                  {makePayment !== null &&
                    makePayment?.status == "APPROVED" && (
                      <Button
                        disabled={true}
                        color="primary"
                        onClick={() => {}}
                      >
                        {loading ? "Loading..." : "Approved"}
                      </Button>
                    )}
                </Col>
              </Row>
            </div>
          </Form>
        </Row>
      </>
    </>
  );
};

export default CreateNewMakePayment;
