import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { H3, P } from "../../../../AbstractElements";
import { create } from "../../../../Utilities/api";
import { ERROR_MESSAGE } from "../../../../Utilities/constants/constants";
import { SEND_TEST_EMAIL } from "../../../../Utilities/api/apiEndpoints";

interface PropTypes {
    isVisible: boolean,
    setIsVisible: any
}

interface emailTypes {
    sendEmailTo: string,
}

const TestEmailModal: React.FC<PropTypes> = ({
    isVisible,
    setIsVisible
}) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<emailTypes>();
    const [addModal, setAddModal] = useState(false);
    const addToggle = () => {
        if (!loading) {
            setIsVisible(!isVisible)
            // reset({
            //     emailAddress: "",
            // });
        }
    };

    const sendEmail: SubmitHandler<emailTypes> = async (data: any) => {

        setLoading(true);
        if (data.sendEmailTo !== "") {
            const emailData = {
                sendEmailTo: data.sendEmailTo,
            };
            // console.log(city);
            try {
                await create(emailData, { url: SEND_TEST_EMAIL }).then(
                    (data: any) => {
                        if (data !== undefined) {
                            if (
                                !data.success &&
                                data.message === ERROR_MESSAGE
                            ) {
                                setLoading(false);
                                addToggle();
                                reset({
                                    sendEmailTo: "",
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
                                addToggle();
                                reset({
                                    sendEmailTo: "",
                                });
                            }
                            if (data.success) {
                                Swal.fire({
                                    text: `${data.message}`,
                                    icon: "success",
                                    timer: 2000,
                                    showConfirmButton: false,
                                });
                                // console.log(data);
                                setLoading(false);
                                addToggle();
                                reset({
                                    sendEmailTo: "",
                                });

                            }
                        }
                    }
                );
                // Handle successful post creation (e.g., show a success message, redirect, etc.)
            } catch (error: any) {
                // Handle error (e.g., show an error message)
                // console.error("Error creating post:", error);
                setLoading(false);
                addToggle();
                reset({
                    sendEmailTo: "",
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
        <Col md={6}>
            <div className="text-end">
                <Modal isOpen={isVisible} toggle={addToggle} size="md" centered>
                    <div className="modal-header">
                        <H3 className="modal-title">Test Email</H3>
                        <Button
                            color="transprant"
                            className="btn-close"
                            onClick={addToggle}
                        ></Button>
                    </div>
                    <ModalBody>
                        <form
                            className="form-bookmark needs-validation"
                            onSubmit={handleSubmit(sendEmail)}
                        >
                            <Row>
                                <FormGroup className="col-md-12 create-group">
                                    <P>Email</P>
                                    <input
                                        className="form-control"
                                        type="text"
                                        {...register("sendEmailTo", { required: true })}
                                    />
                                    <span style={{ color: "red" }}>
                                        {errors.sendEmailTo && "Email is required"}
                                    </span>
                                </FormGroup>
                            </Row>
                            <Button color="primary" className="me-1" >
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

export default TestEmailModal;
