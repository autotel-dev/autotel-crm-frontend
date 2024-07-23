import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Select } from "antd"; // Use your custom Select component
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { Cancel } from "../../../../../../../../../utils/Constant";
import { H3, H4, P } from "../../../../../../../../../AbstractElements";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, update } from "../../../../../../../../../Utilities/api";
import { Col } from "reactstrap";
import { setNoDataFound } from "../../../../../../../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import Swal from "sweetalert2";
import SelectAccountTypeBox from "./SelectAccountType";
import { GET_ALL_BANK_ACCOUNTS, UPDATE_BANK_ACCOUNT } from "../../../../../../../../../Utilities/api/apiEndpoints";
import { setBankAccounts, setBankAccountsStart } from "../../../../../../../../../ReaduxToolkit/Reducer/BankAccountSlice";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  selectedBankAccount: any;
}

const UpdateBankAccount: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible,
  selectedBankAccount,
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [accountType, setAccountType] = useState(selectedBankAccount.accountType)
  useEffect(() => {
    setAccountType(selectedBankAccount.accountType)
  }, [selectedBankAccount])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      name: selectedBankAccount.name,
      iban: selectedBankAccount.iban,
      accountType: selectedBankAccount.accountType
    },
  });

  useEffect(() => {
    reset({
      name: selectedBankAccount.name,
      iban: selectedBankAccount.iban,
      accountType: selectedBankAccount.accountType
    });
  }, [selectedBankAccount, reset]);

  const updateExpenseAccount: SubmitHandler<any> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const bankAccount = {
        name: data.name,
        iban: data.iban,
        accountType: accountType
      };
      try {
        const response: any = await update(bankAccount, {
          url: `${UPDATE_BANK_ACCOUNT}/${selectedBankAccount.id}`,
        });
        if (response.success) {
          Swal.fire({
            text: "Bank Account updated successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          dispatch(setBankAccountsStart());
          const bankAccounts: any = await getAll({ url: GET_ALL_BANK_ACCOUNTS });
          if (bankAccounts?.success) {
            dispatch(setBankAccounts(bankAccounts.data.bankAccounts));

          }
          setIsVisible(false);
        } else {
          Swal.fire({
            text: response.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setIsVisible(false);
        }
      } catch (error) {
        Swal.fire({
          text: "Failed to update Bank Account",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsVisible(false);
      } finally {
        setLoading(false);
      }
    }
  };



  return (
    <Col md={6}>
      <Modal
        isOpen={isVisible}
        toggle={() => setIsVisible(!isVisible)}
        size="lg"
        centered
      >
        <div className="modal-header">
          <H4 className="modal-title">Update Expense Account</H4>
          <Button
            color="transparent"
            className="btn-close"
            onClick={() => setIsVisible(!isVisible)}
          ></Button>
        </div>
        <ModalBody>
          <form onSubmit={handleSubmit(updateExpenseAccount)}>
            <Row>
              <FormGroup className="col-md-12 create-group">
                <P>Name</P>
                <input
                  className="form-control"
                  type="text"
                  {...register("name", { required: true })}
                />
                <span style={{ color: "red" }}>
                  {errors.name && "Expense Account name is required"}
                </span>
              </FormGroup>
              <FormGroup className="col-md-12 create-group">
                <P>IBAN Number</P>
                <input
                  className="form-control"
                  type="text"
                  {...register("iban", { required: true })}
                />
                <span style={{ color: "red" }}>
                  {errors.name && "IBAN Number is required"}
                </span>
              </FormGroup>

              <FormGroup className="col-md-12 create-group">
                <P>
                  Select Account Type
                  <span className="txt-danger">*</span>
                </P>
                <SelectAccountTypeBox placeholder="Select Account Type" setAccountType={setAccountType} accountType={accountType} />
              </FormGroup>


            </Row>

            <Button color="primary" className="me-1">
              {loading ? "Loading ..." : `Save`}
            </Button>
            &nbsp;&nbsp;
            <Button
              disabled={loading ? true : false}
              color="secondary"
              onClick={() => setIsVisible(false)}
            >
              Cancel
            </Button>

          </form>
        </ModalBody>
      </Modal>
    </Col >
  );
};

export default UpdateBankAccount;
