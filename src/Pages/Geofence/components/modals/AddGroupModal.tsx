import React, { useState } from 'react';
import { PlusCircle } from "react-feather";
import { Col, Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { H4, P } from '../../../../AbstractElements';
import { Select } from 'antd';



interface PropsTypes {
    isVisible: boolean; // Change 'boolean' to the actual type of isVisible
    setIsVisible: any;

}

const AddGroupModal: React.FC<PropsTypes> = ({
    isVisible,
    setIsVisible = () => { },


    // setValue
}) => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const dispatch = useDispatch();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const geofencesList = [
        { label: "DHA", value: "DHA" },
        { label: "Korangi", value: "KORANGI" },
        { label: "Bahadurabad", value: "BAHADURABAD" }
    ]


    // const addEmailTemplate: SubmitHandler<Type> = async (data: any) => {
    //     setLoading(true);
    //     var emailTemplate;
    //     if (getUserRole() == ROLES.SUPER_ADMIN) {
    //         emailTemplate = {
    //             subject: data.subject,
    //             content: editorState,
    //             type: type,
    //             isShared: shareOption
    //         };
    //     }
    //     else {
    //         emailTemplate = {
    //             subject: data.subject,
    //             content: editorState,
    //             type: type
    //         };
    //     }
    //     // console.log(emailTemplate);
    //     if (data.subject !== "" && editorState !== "" && type !== "") {
    //         try {
    //             await create(emailTemplate, { url: "template/email-template/create-template" }).then(
    //                 (data: any) => {
    //                     if (data !== undefined) {
    //                         if (
    //                             !data.success &&
    //                             data.message === "ERROR_INTERNET_DISCONNECTED"
    //                         ) {
    //                             setLoading(false);
    //                             setAddModal(false);
    //                             reset({
    //                                 subject: "",
    //                                 templateContent: ""
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
    //                                 subject: "",
    //                                 templateContent: ""
    //                             });
    //                         }
    //                         if (data.success) {
    //                             Swal.fire({
    //                                 text: data.message,
    //                                 icon: "success",
    //                                 timer: 2000,
    //                                 showConfirmButton: false,
    //                             });
    //                             // console.log(data);
    //                             setLoading(false);
    //                             setAddModal(false);
    //                             reset({
    //                                 subject: "",
    //                                 templateContent: ""
    //                             });
    //                             dispatch(setEmailTemplatesStart());
    //                             getAll({ url: "template/email-template/get-all-templates" }).then(
    //                                 (data: any) => {
    //                                     // console.log("api call --- >", data);
    //                                     if (data == undefined) {
    //                                         Swal.fire({
    //                                             text: "Failed to fetch due to connection refused",
    //                                             icon: "error",
    //                                             timer: 2000,
    //                                             showConfirmButton: false,
    //                                         });
    //                                         dispatch(setEmailTemplates([]));
    //                                         dispatch(setFilterEmailTemplates([]));
    //                                         dispatch(setEmailTemplatesEnd());
    //                                         return;
    //                                     }
    //                                     dispatch(setEmailTemplatesEnd());
    //                                     if (data !== undefined) {
    //                                         if (data.success) {
    //                                             // console.log("hhg");
    //                                             dispatch(setEmailTemplates(data.data));
    //                                             dispatch(setFilterEmailTemplates(data.data));
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
    //                 subject: "",
    //                 templateContent: ""
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

    const addToggle = () => {
        if (!loading) {
            setIsVisible(!isVisible);
        }
    };
    const [formData, setFormData] = useState({
        title: "",

    });


    const onChangeHandler = (event: any) => {
        let name = event.target.name;
        let value = event.target.value;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <Col md={6}>
            <div className="text-end">

                <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
                    <div className="modal-header">
                        <H4 className="modal-title">Create Email Template</H4>
                        <Button
                            color="transprant"
                            className="btn-close"
                            onClick={addToggle}
                        ></Button>
                    </div>
                    <ModalBody>
                        <form>

                            <div style={
                                {
                                    // paddingBottom: "-10px",
                                    margin: "0px 10px",
                                }
                            }>
                                <P>Title</P>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter Title"
                                    name="title"
                                    onChange={onChangeHandler}
                                // {...register("name", { required: true })}
                                />
                                <span style={{ color: "red" }}>
                                    {/* {errors.name && "Country name is required"} */}
                                </span>


                            </div>
                            <div style={
                                {
                                    // marginBottom: "10px",
                                    margin: "0px 10px",
                                }
                            }>
                                <P>Ungrouped Geofences</P>
                                <Select
                                    showSearch
                                    style={{ width: "100%", height: 36, marginBottom: "15px", }}
                                    placeholder="Select type"
                                    optionFilterProp="children"
                                    filterOption={(input: any, option: any) =>
                                        (option?.label ?? "").includes(input)
                                    }
                                    filterSort={(optionA: any, optionB: any) =>
                                        (optionA?.label ?? "")
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? "").toLowerCase())
                                    }
                                    onChange={(e: any) => {
                                        // console.log(e);
                                        // dispatch(setType(e))
                                        // dispatch(setCountryId(e));
                                    }}
                                    options={geofencesList}
                                />
                            </div>


                            <div style={{ display: "flex" }}>
                                <button
                                    onClick={(e: any) => {
                                        e.preventDefault(); // Add this line
                                        e.stopPropagation();
                                        addToggle()
                                    }}
                                    style={{
                                        width: "50%",
                                        padding: "7px 10px",
                                        borderRadius: "8px",
                                        backgroundColor: "green",
                                        color: "white",
                                        margin: "8px",
                                        border: "0px",
                                        outline: "none",
                                        textAlign: "center",
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={(e: any) => {
                                        e.preventDefault(); // Add this line
                                        e.stopPropagation();
                                        addToggle()
                                    }}
                                    style={{
                                        width: "50%",
                                        padding: "7px 10px",
                                        borderRadius: "8px",
                                        backgroundColor: "green",
                                        color: "white",
                                        margin: "8px",
                                        border: "0px",
                                        outline: "none",
                                        textAlign: "center",
                                    }}
                                >
                                    Add
                                </button>

                            </div>
                        </form>
                    </ModalBody>
                </Modal>
            </div>
        </Col>
    );
};

export default AddGroupModal;




















































