import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
// import { Type } from "./CountryTypes/CountryTypes";
import Swal from "sweetalert2";
import { H4, P } from "../../../../../../../../../AbstractElements";
import { CREATE_NEW_BANK_ACCOUNT, CREATE_NEW_EXPENSE_ACCOUNT, CREATE_NEW_TAX, GET_ALL_BANK_ACCOUNTS, GET_ALL_EXPENSE_ACCOUNTS, GET_ALL_TAXES } from "../../../../../../../../../Utilities/api/apiEndpoints";
import { create, getAll } from "../../../../../../../../../Utilities/api";
import { ERROR_MESSAGE } from "../../../../../../../../../Utilities/constants/constants";
import { setBankAccounts, setBankAccountsEnd, setBankAccountsStart } from "../../../../../../../../../ReaduxToolkit/Reducer/BankAccountSlice";
import { TaxTypes } from "../Type/Type";
import { setTaxEnd, setTaxes, setTaxStart } from "../../../../../../../../../ReaduxToolkit/Reducer/TaxSlice";


const CreateNewTax = () => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TaxTypes>();
    const [addModal, setAddModal] = useState(false);
    const addToggle = () => {
        if (!loading) {
            setAddModal(!addModal);
            reset({
                title: "",
                percentage: ""
            });
        }
    };


    const addTax: SubmitHandler<TaxTypes> = async (data: any) => {
        setLoading(true);
        if (data.title !== "" && data.percentage !== "") {
            const formData = {
                title: data.title,
                percentage: Number(data.percentage),

            };
            // console.log(city);
            try {
                await create(formData, { url: CREATE_NEW_TAX }).then(
                    (data: any) => {
                        if (data !== undefined) {
                            if (
                                !data.success &&
                                data.message === ERROR_MESSAGE
                            ) {
                                setLoading(false);
                                setAddModal(false);
                                reset({
                                    title: "",
                                    percentage: ""
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
                                    title: "",
                                    percentage: ""
                                });
                            }
                            if (data.success) {
                                // console.log(data);
                                setLoading(false);
                                setAddModal(false);
                                reset({
                                    title: "",
                                    percentage: ""
                                });
                                dispatch(setTaxStart());
                                getAll({ url: GET_ALL_TAXES }).then(
                                    (data: any) => {
                                        // console.log("api call --- >", data);
                                        if (data == undefined) {
                                            Swal.fire({
                                                text: "Failed to fetch due to connection refused",
                                                icon: "error",
                                                timer: 2000,
                                                showConfirmButton: false,
                                            });
                                            dispatch(setTaxes([]));
                                            return;
                                        }
                                        dispatch(setTaxEnd());
                                        if (data !== undefined) {
                                            if (data.success) {
                                                // console.log("hhg");
                                                dispatch(setTaxes(data.data));
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
                    title: "",
                    percentage: ""
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
                Create New Tax
            </button>
            <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
                <div className="modal-header">
                    <H4 className="modal-title">Create Tax</H4>
                    <Button
                        color="transprant"
                        className="btn-close"
                        onClick={addToggle}
                    ></Button>
                </div>
                <ModalBody>
                    <form
                        className="form-bookmark needs-validation"
                        onSubmit={handleSubmit(addTax)}
                    >
                        <Row>
                            <FormGroup className="col-md-12 create-group">
                                <P>Title</P>
                                <input
                                    className="form-control"
                                    type="text"
                                    {...register("title", { required: true })}
                                />
                                <span style={{ color: "red" }}>
                                    {errors.title && "Tax Title is required"}
                                </span>
                            </FormGroup>
                            <FormGroup className="col-md-12 create-group">
                                <P>Percentage (in %)</P>
                                <input
                                    className="form-control"
                                    type="text"
                                    {...register("percentage", { required: true })}
                                />
                                <span style={{ color: "red" }}>
                                    {errors.percentage && "Percentage is required"}
                                </span>
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

export default CreateNewTax;
