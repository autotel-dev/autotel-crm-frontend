import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { CheckCircle } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
// import { Type } from "./CountryTypes/CountryTypes";
import Swal from "sweetalert2";
import { H4, P } from "../../../../../../../../../AbstractElements";
import { CREATE_NEW_BANK_ACCOUNT, CREATE_NEW_EXPENSE_ACCOUNT, GET_ALL_BANK_ACCOUNTS, GET_ALL_EXPENSE_ACCOUNTS } from "../../../../../../../../../Utilities/api/apiEndpoints";
import { create, getAll } from "../../../../../../../../../Utilities/api";
import { ERROR_MESSAGE } from "../../../../../../../../../Utilities/constants/constants";
import { setExpenseAccounts, setExpenseAccountsEnd, setExpenseAccountsStart } from "../../../../../../../../../ReaduxToolkit/Reducer/ExpenseAccountsSlice";
import { BankAccountType } from "./BankAccountType/BankAccountType";
import { setBankAccounts, setBankAccountsEnd, setBankAccountsStart } from "../../../../../../../../../ReaduxToolkit/Reducer/BankAccountSlice";
import SelectAccountTypeBox from "./SelectAccountType";



const CreateNewBankAccount = () => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const dispatch = useDispatch();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BankAccountType>();
    const [addModal, setAddModal] = useState(false);
    const addToggle = () => {
        if (!loading) {
            setAddModal(!addModal);
            reset({
                name: "",
                iban: ""
            });
        }
    };

    const [accountType, setAccountType] = useState("")

    const addBankAccount: SubmitHandler<BankAccountType> = async (data: any) => {
        setLoading(true);
        if (data.name !== "" && data.iban !== "" && accountType !== "") {
            const formData = {
                name: data.name,
                iban: data.iban,
                accountType: accountType
            };
            // console.log(city);
            try {
                await create(formData, { url: CREATE_NEW_BANK_ACCOUNT }).then(
                    (data: any) => {
                        if (data !== undefined) {
                            if (
                                !data.success &&
                                data.message === ERROR_MESSAGE
                            ) {
                                setLoading(false);
                                setAddModal(false);
                                reset({
                                    name: "",
                                    iban: ""
                                });
                            }
                            if (!data.success) {
                                Swal.fire({
                                    text: `${data.message}`,
                                    icon: "error",
                                    timer: 2000,
                                    showConfirmButton: false,
                                });
                                setLoading(false);
                                setAddModal(false);
                                reset({
                                    name: "",
                                    iban: ""
                                });
                            }
                            if (data.success) {
                                // console.log(data);
                                setLoading(false);
                                setAddModal(false);
                                reset({
                                    name: "",
                                    iban: ""
                                });
                                dispatch(setBankAccountsStart());
                                getAll({ url: GET_ALL_BANK_ACCOUNTS }).then(
                                    (data: any) => {
                                        // console.log("api call --- >", data);
                                        if (data == undefined) {
                                            Swal.fire({
                                                text: "Failed to fetch due to connection refused",
                                                icon: "error",
                                                timer: 2000,
                                                showConfirmButton: false,
                                            });
                                            dispatch(setBankAccounts([]));
                                            return;
                                        }
                                        dispatch(setBankAccountsEnd());
                                        if (data !== undefined) {
                                            if (data.success) {
                                                // console.log("hhg");
                                                dispatch(setBankAccounts(data.data.bankAccounts));
                                            }
                                        }
                                    }
                                );
                            }
                        }
                    }
                );
                // Handle successful post creation (e.g., show a success message, redirect, etc.)
            } catch (error: any) {
                // Handle error (e.g., show an error message)
                // console.error("Error creating post:", error);
                setLoading(false);
                setAddModal(false);
                reset({
                    name: "",
                    iban: ""
                });
            }
        } else {
            Swal.fire({
                text: "Please Select all the fields",
                icon: "info",
                timer: 2000,
                showCancelButton: false,
                showConfirmButton: true,
            });
            setLoading(false);
        }
    };

    return (
        <div className="text-end">
            <button
                className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""
                    }`}
                style={{
                    color: "white",
                    backgroundColor: `${userPersonalizationData !== null &&
                        userPersonalizationData?.buttonsAndBarsColor
                        }`,
                    display: "flex",
                    alignItems: "center",
                }}
                onClick={addToggle}
            >
                <PlusCircle size={18} style={{
                    marginRight: "5px"
                }} />
                Create New Bank Account
            </button>
            <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
                <div className="modal-header">
                    <H4 className="modal-title">Create Bank Account</H4>
                    <Button
                        color="transprant"
                        className="btn-close"
                        onClick={addToggle}
                    ></Button>
                </div>
                <ModalBody>
                    <form
                        className="form-bookmark needs-validation"
                        onSubmit={handleSubmit(addBankAccount)}
                    >
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
                            {loading ? "Loading ..." : `Create`}
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                            disabled={loading ? true : false}
                            color="secondary"
                            onClick={addToggle}
                        >
                            Cancel
                        </Button>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default CreateNewBankAccount;
