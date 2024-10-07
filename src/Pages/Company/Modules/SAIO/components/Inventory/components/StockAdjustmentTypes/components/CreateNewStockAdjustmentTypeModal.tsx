import { PlusCircle } from "react-feather";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Input, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
// import { Type } from "./CountryTypes/CountryTypes";
import Swal from "sweetalert2";
import { H4, P } from "../../../../../../../../../AbstractElements";
import { create, getAll } from "../../../../../../../../../Utilities/api";
import { ERROR_MESSAGE } from "../../../../../../../../../Utilities/constants/constants";
import { setTaxEnd, setTaxes, setTaxStart } from "../../../../../../../../../ReaduxToolkit/Reducer/TaxSlice";
import { StockAdjustmentTypesDataType } from "../Type/Type";
import { CREATE_NEW_STOCK_ADJUSTMENT_TYPE, GET_ALL_STOCK_ADJUSTMENT_TYPES } from "../../../../../../../../../Utilities/api/apiEndpoints";
import { setStockAdjustmentTypes, setStockAdjustmentTypesEnd, setStockAdjustmentTypesStart } from "../../../../../../../../../ReaduxToolkit/Reducer/StockAdjustmentTypeSlice";


const CreateNewStockAdjustmentType = () => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<StockAdjustmentTypesDataType>();
    const [addModal, setAddModal] = useState(false);
    const addToggle = () => {
        if (!loading) {
            setAddModal(!addModal);
            reset({
                name: "",
            });
        }
    };


    const addStockAdjustmentType: SubmitHandler<StockAdjustmentTypesDataType> = async (data: any) => {
        setLoading(true);
        if (data.name !== "") {
            const formData = {
                name: data.name,
                availability:isActive
            };
            // console.log(city);
            try {
                await create(formData, { url: CREATE_NEW_STOCK_ADJUSTMENT_TYPE }).then(
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
                                });
                            }
                            if (data.success) {
                                // console.log(data);
                                setLoading(false);
                                setAddModal(false);
                                reset({
                                    name: "",

                                });
                                dispatch(setStockAdjustmentTypesStart());
                                getAll({ url: GET_ALL_STOCK_ADJUSTMENT_TYPES }).then(
                                    (data: any) => {
                                        // console.log("api call --- >", data);
                                        if (data == undefined) {
                                            Swal.fire({
                                                text: "Failed to fetch due to connection refused",
                                                icon: "error",
                                                timer: 2000,
                                                showConfirmButton: false,
                                            });
                                            dispatch(setStockAdjustmentTypes([]));
                                            return;
                                        }
                                        dispatch(setStockAdjustmentTypesEnd());
                                        if (data !== undefined) {
                                            if (data.success) {
                                                // console.log("hhg");
                                                dispatch(setStockAdjustmentTypes(data.data));
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
                Create New Stock Adjustment Type
            </button>
            <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
                <div className="modal-header">
                    <H4 className="modal-title">Create Adjustment Type</H4>
                    <Button
                        color="transprant"
                        className="btn-close"
                        onClick={addToggle}
                    ></Button>
                </div>
                <ModalBody>
                    <form
                        className="form-bookmark needs-validation"
                        onSubmit={handleSubmit(addStockAdjustmentType)}
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
                                    {errors.name && "Adjustment Type Name is required"}
                                </span>
                            </FormGroup>
                            <FormGroup className="col-md-12 create-group" style={{
                                marginTop:"-15px"
                            }}>
                                <P>Availability</P>
                                <div className="d-flex">
                                    <div
                                        className={`text-end flex-shrink-0 icon-state
                            }`}
                                    >
                                        <Label className="switch mb-0">
                                            <Input
                                                type="checkbox"
                                                defaultChecked={isActive}
                                                value={isActive ? "on" : "off"}
                                                onChange={(e) => {
                                                    setIsActive(!isActive);
                                                }}
                                            />
                                            <span
                                                className={`switch-state ${isActive ? "bg-primary" : "bg-secondary"
                                                    }`}
                                            />
                                        </Label>
                                    </div>
                                </div>
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

export default CreateNewStockAdjustmentType;
