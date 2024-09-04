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
import { GET_ALL_BANK_ACCOUNTS, GET_ALL_STOCK_ADJUSTMENT_TYPES, GET_ALL_TAXES, UPDATE_BANK_ACCOUNT, UPDATE_STOCK_ADJUSTMENT_TYPE, UPDATE_TAX } from "../../../../../../../../../Utilities/api/apiEndpoints";
import { setBankAccounts, setBankAccountsStart } from "../../../../../../../../../ReaduxToolkit/Reducer/BankAccountSlice";
import { setTaxes, setTaxStart } from "../../../../../../../../../ReaduxToolkit/Reducer/TaxSlice";
import { setStockAdjustmentTypes } from "../../../../../../../../../ReaduxToolkit/Reducer/StockAdjustmentTypeSlice";

interface PropsTypes {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    selectedAdjustmentType: any;
}

const UpdateStockAdjustmentType: React.FC<PropsTypes> = ({
    isVisible,
    setIsVisible,
    selectedAdjustmentType,
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
            name: selectedAdjustmentType.name,
        },
    });

    useEffect(() => {
        reset({
            name: selectedAdjustmentType.name,
        });
    }, [selectedAdjustmentType, reset]);

    const updateStockAdjustmentType: SubmitHandler<any> = async (data) => {
        setLoading(true);
        if (data.name !== "") {
            const StockAdjustmentType = {
                name: data.name,
            };
            try {
                const response: any = await update(StockAdjustmentType, {
                    url: `${UPDATE_STOCK_ADJUSTMENT_TYPE}/${selectedAdjustmentType.id}`,
                });
                if (response.success) {
                    Swal.fire({
                        text: `${response.message}`,
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    const stockAdjustmentTypeData: any = await getAll({ url: GET_ALL_STOCK_ADJUSTMENT_TYPES });
                    if (stockAdjustmentTypeData?.success) {
                        dispatch(setStockAdjustmentTypes(stockAdjustmentTypeData.data));

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
                    text: "Failed to update Stock Adjustment Type",
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
                    <H4 className="modal-title">Update Adjustment Type</H4>
                    <Button
                        color="transparent"
                        className="btn-close"
                        onClick={() => setIsVisible(!isVisible)}
                    ></Button>
                </div>
                <ModalBody>
                    <form onSubmit={handleSubmit(updateStockAdjustmentType)}>
                        <Row>
                            <FormGroup className="col-md-12 create-group">
                                <P>Name</P>
                                <input
                                    className="form-control"
                                    type="text"
                                    {...register("name", { required: true })}
                                />
                                <span style={{ color: "red" }}>
                                    {errors.name && "Adjustment Type Name is required"}
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

export default UpdateStockAdjustmentType;
