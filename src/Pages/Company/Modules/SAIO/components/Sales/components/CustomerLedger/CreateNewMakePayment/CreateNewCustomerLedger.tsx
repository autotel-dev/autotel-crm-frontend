import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H4, P } from "../../../../../../../../../AbstractElements";
import "jspdf-autotable";
import { SubmitHandler } from "react-hook-form";
import { create, getAll } from "../../../../../../../../../Utilities/api";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import { GET_ACCOUNT_STATEMENT } from "../../../../../../../../../Utilities/api/apiEndpoints";
import { setVendorLedgers } from "../../../../../../../../../ReaduxToolkit/Reducer/VendorLedgerSlice";
import { PlusCircle } from "react-feather";
import SelectCustomerBox from "./components/SelectCustomerBox";
import { setCustomerLedgers } from "../../../../../../../../../ReaduxToolkit/Reducer/CustomerLedgerSlice";

const CreateNewCustomerLedger = ({}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { customerLedgers } = useSelector(
    (state: any) => state.customerLedgers
  );
  const [addModal, setAddModal] = useState(false);
  const dispatch = useDispatch();

  const [customer, setCustomer] = useState("");
  const [accountId, setAccountId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  // ---------------------------------------------------------------

  const pdfRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const addToggle = () => {
    if (!loading) {
      setCustomer("");
      setAccountId("");
      setStartDate("");
      setEndDate("");
      setAddModal(!addModal);
    }
  };

  // --------------------------------------------------------------

  const addVendorLedger: SubmitHandler<any> = async (data) => {
    setLoading(true);
    if (accountId !== "" && startDate !== "" && endDate !== "") {
      try {
        const response: any = await getAll({
          url: `${GET_ACCOUNT_STATEMENT}?accountId=${accountId}&startDate=${startDate}&endDate=${endDate}`,
        });
        if (response.success) {
          console.log("data", response.data.statement);
          dispatch(
            setCustomerLedgers([
              ...customerLedgers,
              {
                title: `Statement ${customerLedgers.length + 1}`,
                from: startDate.slice(0, 10),
                to: endDate.slice(0, 10),
                statement: response.data.statement,
              },
            ])
          );
          setLoading(false);

          // navigate(
          //   `${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/vendor-ledger`
          // );
          addToggle();
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

  const toggleModal = () => setModal(!modal);

  return (
    <>
      <Col md={6}>
        <div className="text-end">
          <button
            className={`btn ${
              userPersonalizationData?.buttonsAndBarsColor == null
                ? "btn-primary"
                : ""
            }`}
            style={{
              color: "white",
              backgroundColor:
                userPersonalizationData?.buttonsAndBarsColor || "",
            }}
            onClick={addToggle}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              <PlusCircle size={18} style={{ marginRight: "5px" }} />
              Create New Customer Ledger
            </span>
          </button>
          <Modal isOpen={addModal} toggle={addToggle} size="lg" centered>
            <div className="modal-header">
              <H4 className="modal-title">Add Ledger </H4>
              <Button
                color="transparent"
                className="btn-close"
                onClick={addToggle}
              ></Button>
            </div>
            <ModalBody>
              <form
                onSubmit={(event) => event.preventDefault()}
                className="needs-validation"
                noValidate
              >
                <Row style={{ marginBottom: "-20px" }}>
                  <Col md={12}>
                    <FormGroup>
                      <div>
                        <P>
                          Select Customer
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
                  <Col md={12}>
                    <FormGroup>
                      <P>
                        From Date
                        <span className="txt-danger">*</span>
                      </P>
                      <Input
                        type="date"
                        placeholder="Enter Date "
                        value={startDate.slice(0, 10)}
                        name="startDate"
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={12}>
                    <FormGroup>
                      <P>
                        To Date
                        <span className="txt-danger">*</span>
                      </P>
                      <Input
                        type="date"
                        placeholder="Enter Date "
                        value={endDate.slice(0, 10)}
                        name="endDate"
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </FormGroup>
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
                      // navigate(
                      //   `${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/vendor-ledger`
                      // );
                      addToggle();
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    disabled={loading}
                    color="primary"
                    onClick={addVendorLedger}
                  >
                    {loading ? "Loading..." : "Create"}
                  </Button>
                </Col>
              </form>
            </ModalBody>
          </Modal>
        </div>
      </Col>
    </>
  );
};

export default CreateNewCustomerLedger;
