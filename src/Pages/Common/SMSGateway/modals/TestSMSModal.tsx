import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { H3, P } from "../../../../AbstractElements";

interface PropTypes {
    isVisible: boolean,
    setIsVisible: any
}

const TestSMSMessageModal: React.FC<PropTypes> = ({
    isVisible,
    setIsVisible
}) => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const dispatch = useDispatch();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    // const {
    //     register,
    //     handleSubmit,
    //     reset,
    //     formState: { errors },
    // } = useForm<PropTypes>();
    const [addModal, setAddModal] = useState(false);
    const addToggle = () => {
        if (!loading) {
            setIsVisible(!isVisible)
            // reset({
            //     emailAddress: "",
            // });
        }
    };

    // const addCountry: SubmitHandler<Type> = async (data: any) => {
    //     setLoading(true);
    //     if (data.name !== "") {
    //         const city = {
    //             name: data.name,
    //         };
    //         // console.log(city);
    //         try {
    //             await create(city, { url: "country/create-country" }).then(
    //                 (data: any) => {
    //                     if (data !== undefined) {
    //                         if (
    //                             !data.success &&
    //                             data.message === "ERROR_INTERNET_DISCONNECTED"
    //                         ) {
    //                             setLoading(false);
    //                             setAddModal(false);
    //                             reset({
    //                                 name: "",
    //                             });
    //                         }
    //                         if (!data.success) {
    //                             Swal.fire({
    //                                 text: `${data.message}`,
    //                                 icon: "error",
    //                                 timer: 2000,
    //                                 showConfirmButton: false,
    //                             });
    //                             setLoading(false);
    //                             setAddModal(false);
    //                             reset({
    //                                 name: "",
    //                             });
    //                         }
    //                         if (data.success) {
    //                             // console.log(data);
    //                             setLoading(false);
    //                             setAddModal(false);
    //                             reset({
    //                                 name: "",
    //                             });
    //                             dispatch(setCountriesStart());
    //                             getAll({ url: "country/get-all-countries" }).then(
    //                                 (data: any) => {
    //                                     // console.log("api call --- >", data);
    //                                     if (data == undefined) {
    //                                         Swal.fire({
    //                                             text: "Failed to fetch due to connection refused",
    //                                             icon: "error",
    //                                             timer: 2000,
    //                                             showConfirmButton: false,
    //                                         });
    //                                         dispatch(setInActiveActiveCountries("All"));
    //                                         dispatch(setCountries([]));
    //                                         dispatch(setFilterCountries([]));
    //                                         dispatch(setCountriesEnd());
    //                                         return;
    //                                     }
    //                                     dispatch(setCountriesEnd());
    //                                     if (data !== undefined) {
    //                                         if (data.success) {
    //                                             // console.log("hhg");
    //                                             dispatch(setCountries(data.data));
    //                                             dispatch(setFilterCountries(data.data));
    //                                         }
    //                                     }
    //                                 }
    //                             );
    //                         }
    //                     }
    //                 }
    //             );
    //             // Handle successful post creation (e.g., show a success message, redirect, etc.)
    //         } catch (error: any) {
    //             // Handle error (e.g., show an error message)
    //             // console.error("Error creating post:", error);
    //             setLoading(false);
    //             setAddModal(false);
    //             reset({
    //                 name: "",
    //             });
    //         }
    //     } else {
    //         Swal.fire({
    //             text: "Please Select all the fields",
    //             icon: "info",
    //             timer: 2000,
    //             showCancelButton: false,
    //             showConfirmButton: true,
    //         });
    //         setLoading(false);
    //     }
    // };

    return (
        <Col md={6}>
            <div className="text-end">
                <Modal isOpen={isVisible} toggle={addToggle} size="md" centered>
                    <div className="modal-header">
                        <H3 className="modal-title">Send Test SMS</H3>
                        <Button
                            color="transprant"
                            className="btn-close"
                            onClick={addToggle}
                        ></Button>
                    </div>
                    <ModalBody>
                        <form
                            className="form-bookmark needs-validation"
                        // onSubmit={handleSubmit(addCountry)}
                        >
                            <Row>
                                <FormGroup className="col-md-12 create-group">
                                    <P>Mobile Phone</P>
                                    <input
                                        className="form-control"
                                        type="text"
                                    // {...register("name", { required: true })}
                                    />
                                    {/* <span style={{ color: "red" }}>
                                        {errors.name && "Country name is required"}
                                    </span> */}
                                </FormGroup>
                            </Row>
                            <Row>
                                <FormGroup className="col-md-12 create-group">
                                    <P>Message</P>
                                    <textarea
                                        className="form-control"
                                        rows={2} // Minimum number of visible lines
                                        style={{
                                            maxHeight: "80px", // Maximum height for 5 lines of text
                                            resize: "vertical", // Allow vertical resizing within the specified range
                                            overflow: "auto"
                                        }}

                                    // {...register("response", { required: true })}
                                    />
                                </FormGroup>
                            </Row>
                            <Button color="primary" className="me-1">
                                {loading ? "Loading ..." : `Send`}
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
        </Col>
    );
};

export default TestSMSMessageModal;
