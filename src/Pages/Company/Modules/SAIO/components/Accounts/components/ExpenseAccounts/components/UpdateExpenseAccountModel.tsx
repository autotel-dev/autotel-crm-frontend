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
import {
  GET_ALL_EXPENSE_ACCOUNTS,
  UPDATE_EXPENSE_ACCOUNT,
} from "../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../Utilities/constants/constants";
import { PlusCircle } from "react-feather";
import { setExpenseAccounts, setExpenseAccountsStart } from "../../../../../../../../../ReaduxToolkit/Reducer/ExpenseAccountsSlice";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  selectedExpenseAccount: any;
}

const UpdateExpenseAccount: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible,
  selectedExpenseAccount,
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      name: selectedExpenseAccount.name,
    },
  });

  useEffect(() => {
    reset({
      name: selectedExpenseAccount.name,
    });
  }, [selectedExpenseAccount, reset]);

  const updateExpenseAccount: SubmitHandler<any> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const expenseAccount = {
        name: data.name,
      };
      try {
        const response: any = await update(expenseAccount, {
          url: `${UPDATE_EXPENSE_ACCOUNT}/${selectedExpenseAccount.id}`,
        });
        if (response.success) {
          Swal.fire({
            text: "Expense Account updated successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          dispatch(setExpenseAccountsStart());
          const expenseAccounts: any = await getAll({ url: GET_ALL_EXPENSE_ACCOUNTS });
          if (expenseAccounts?.success) {
            dispatch(setExpenseAccounts(expenseAccounts.data));

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
          text: "Failed to update Expense Account",
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

            <FormGroup>
              <P>Name</P>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Name Here..."
                {...register("name", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.name && "Expense Account Name is required"}
              </span>
            </FormGroup>

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
            {/* <div className="text-end">
              <button
                type="button"
                className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null
                  ? "btn-secondary"
                  : ""
                  }`}
                style={{
                  color: "white",
                  backgroundColor:
                    userPersonalizationData?.buttonsAndBarsColor || "",
                }}
                onClick={() => setIsVisible(false)}
              >
                {Cancel}
              </button>
              <button
                type="submit"
                className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null
                  ? "btn-primary"
                  : ""
                  }`}
                style={{
                  color: "white",
                  backgroundColor:
                    userPersonalizationData?.buttonsAndBarsColor || "",
                  marginLeft: "5px",
                }}
              >
                {loading ? "Loading..." : "Save"}
              </button>
            </div> */}
          </form>
        </ModalBody>
      </Modal>
    </Col >
  );
};

export default UpdateExpenseAccount;
