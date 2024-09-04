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
import { GET_ALL_BANK_ACCOUNTS, GET_ALL_TAXES, UPDATE_BANK_ACCOUNT, UPDATE_TAX } from "../../../../../../../../../Utilities/api/apiEndpoints";
import { setBankAccounts, setBankAccountsStart } from "../../../../../../../../../ReaduxToolkit/Reducer/BankAccountSlice";
import { setTaxes, setTaxStart } from "../../../../../../../../../ReaduxToolkit/Reducer/TaxSlice";

interface PropsTypes {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    selectedTax: any;
}

const UpdateTax: React.FC<PropsTypes> = ({
    isVisible,
    setIsVisible,
    selectedTax,
}) => {

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
            title: selectedTax.title,
            percentage: selectedTax.percentage,

        },
    });

    useEffect(() => {
        reset({
            title: selectedTax.title,
            percentage: selectedTax.percentage,

        });
    }, [selectedTax, reset]);

    const updateTaxAccount: SubmitHandler<any> = async (data) => {
        setLoading(true);
        if (data.name !== "") {
            const taxData = {
                title: data.title,
                percentage: data.percentage,
            };
            try {
                const response: any = await update(taxData, {
                    url: `${UPDATE_TAX}/${selectedTax.id}`,
                });
                if (response.success) {
                    Swal.fire({
                        text: `${response.message}`,
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    const taxAccounts: any = await getAll({ url: GET_ALL_TAXES });
                    if (taxAccounts?.success) {
                        dispatch(setTaxes(taxAccounts.data));

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
                    text: "Failed to update Tax",
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
                    <H4 className="modal-title">Update Tax</H4>
                    <Button
                        color="transparent"
                        className="btn-close"
                        onClick={() => setIsVisible(!isVisible)}
                    ></Button>
                </div>
                <ModalBody>
                    <form onSubmit={handleSubmit(updateTaxAccount)}>
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

export default UpdateTax;
