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
import { SEND_TEST_EMAIL, SEND_TEST_WHATSAPP_MESSAGE } from "../../../../Utilities/api/apiEndpoints";

interface PropTypes {
    isVisible: boolean,
    setIsVisible: any
}

interface whatsAppMessageTypes {
    sendMessageToPhone: string,
}

const TestWhatsAppMessageModal: React.FC<PropTypes> = ({
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
    } = useForm<whatsAppMessageTypes>();
    const [addModal, setAddModal] = useState(false);
    const addToggle = () => {
        if (!loading) {
            setIsVisible(!isVisible)
            // reset({
            //     emailAddress: "",
            // });
        }
    };

    const sendWhatsApp: SubmitHandler<whatsAppMessageTypes> = async (data: any) => {

        setLoading(true);
        if (data.sendEmailTo !== "") {
            const whatsappData = {
                sendMessageToPhone: data.sendMessageToPhone,
            };
            // console.log(city);
            try {
                await create(whatsappData, { url: SEND_TEST_WHATSAPP_MESSAGE }).then(
                    (data: any) => {
                        if (data !== undefined) {
                            if (
                                !data.success &&
                                data.message === ERROR_MESSAGE
                            ) {
                                setLoading(false);
                                addToggle();
                                reset({
                                    sendMessageToPhone: "",
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
                                    sendMessageToPhone: "",
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
                                    sendMessageToPhone: "",
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
                    sendMessageToPhone: "",
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
                        <H3 className="modal-title">Test WhatsApp Message</H3>
                        <Button
                            color="transprant"
                            className="btn-close"
                            onClick={addToggle}
                        ></Button>
                    </div>
                    <ModalBody>
                        <form
                            className="form-bookmark needs-validation"
                            onSubmit={handleSubmit(sendWhatsApp)}
                        >
                            <Row>
                                <FormGroup className="col-md-12 create-group">
                                    <P>WhatsApp Number</P>
                                    <input
                                        className="form-control"
                                        type="text"
                                        {...register("sendMessageToPhone", { required: true })}
                                    />
                                    <span style={{ color: "red" }}>
                                        {errors.sendMessageToPhone && "WhatsApp Number is required"}
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

export default TestWhatsAppMessageModal;
