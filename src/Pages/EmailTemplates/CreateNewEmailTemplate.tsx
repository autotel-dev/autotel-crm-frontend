import React, { useState } from 'react';
import { PlusCircle } from "react-feather";
import { Col, Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { H3, H4, P } from "../../AbstractElements";
import { create, getAll } from "../../Api";
import { Cancel } from "../../utils/Constant";

import { Type } from "./EmailTemplatesTypes/EmailTemplatesTypes";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './tableStyle.css'
import TurndownService from 'turndown';
import Swal from 'sweetalert2';
import { setEmailTemplates, setEmailTemplatesEnd, setEmailTemplatesStart, setFilterEmailTemplates } from '../../ReaduxToolkit/Reducer/EmailTemplateSlice';
import { Select } from 'antd';
import { getUserRole } from '../../Api/globals';
import { ROLES } from '../../constants/roles';

const CreateNewEmailTemplate = () => {
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
    control,
    formState: { errors },
  } = useForm<Type>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        subject: "",
        templateContent: ""
      });
      setEditorState('');
    }
  };

  const modules = {
    toolbar: [
      // [{ 'font': [] }],
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline',
        // 'strike', 'blockquote'
      ],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }
        // , { 'indent': '-1' }, { 'indent': '+1' }
      ],
      // ['link', 'image', 'video'],
      // [{ 'align': [] }],
      // [{ 'color': [] }, { 'background': [] }],
      // ['clean']
    ],
  };

  const TEMPLATE_TYPES_ARRAY = [
    {
      label: "Account Created",
      value: "ACCOUNT_CREATED",
    },
    {
      label: "Password Updated",
      value: "PASSWORD_UPDATED",
    },
    {
      label: "Pre Package Expiration",
      value: "PRE_PACKAGE_EXPIRATION",
    },
    {
      label: "Post Package Expiration",
      value: "POST_PACKAGE_EXPIRATION",
    },
    {
      label: "Report",
      value: "REPORT",
    },
  ];

  const [type, setType] = useState("")
  const [shareOption, setShareOption] = useState(false)

  // const [editorState, setEditorState] = useState('<p>Hello <strong>Sandesh</strong></p><p>We have created an account for you on <strong><em><u>Autotel CRM</u></em></strong></p><p>Here are the account credentials:</p><ul><li>Email: <strong>sandesh@sandesh.com</strong></li><li>Password: <strong><u>123456789</u></strong></li></ul><p>Regards,</p><p><strong>Autotel CRM Team</strong></p>');
  const [editorState, setEditorState] = useState('');
  const turndownService = new TurndownService();


  const onEditorChange = (value: string) => {
    setEditorState(value);
    // const markdown = turndownService.turndown(value);
    // console.log("Markdown", markdown);
    console.log("Html", value);
    const markdown = turndownService.turndown(value);

    // Convert markdown to plain text with some formatting for WhatsApp
    let plainText = markdown
      .replace(/\*\*(.*?)\*\*/g, '*$1*')   // Convert bold (**) to single asterisk (*)
      .replace(/__(.*?)__/g, '*$1*');      // Convert bold (__) to single asterisk (*)



    console.log("Markdown", markdown);
    console.log("Plain text for WhatsApp", plainText);
    const valuee = plainText;
    console.log("value",valuee);
    

  }


  const addEmailTemplate: SubmitHandler<Type> = async (data: any) => {
    setLoading(true);
    const emailTemplate = {
      subject: data.subject,
      content: editorState,
      type: type,
      isShared: shareOption
    };
    // console.log(emailTemplate);
    if (data.subject !== "" && editorState !== "" && type !== "") {
      try {
        await create(emailTemplate, { url: "template/email-template/create-template" }).then(
          (data: any) => {
            if (data !== undefined) {
              if (
                !data.success &&
                data.message === "ERROR_INTERNET_DISCONNECTED"
              ) {
                setLoading(false);
                setAddModal(false);
                reset({
                  subject: "",
                  templateContent: ""
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
                  subject: "",
                  templateContent: ""
                });
              }
              if (data.success) {
                Swal.fire({
                  text: data.message,
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false,
                });
                // console.log(data);
                setLoading(false);
                setAddModal(false);
                reset({
                  subject: "",
                  templateContent: ""
                });
                dispatch(setEmailTemplatesStart());
                getAll({ url: "template/email-template/get-all-templates" }).then(
                  (data: any) => {
                    // console.log("api call --- >", data);
                    if (data == undefined) {
                      Swal.fire({
                        text: "Failed to fetch due to connection refused",
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                      dispatch(setEmailTemplates([]));
                      dispatch(setFilterEmailTemplates([]));
                      dispatch(setEmailTemplatesEnd());
                      return;
                    }
                    dispatch(setEmailTemplatesEnd());
                    if (data !== undefined) {
                      if (data.success) {
                        // console.log("hhg");
                        dispatch(setEmailTemplates(data.data));
                        dispatch(setFilterEmailTemplates(data.data));
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
          subject: "",
          templateContent: ""
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
        <button
          className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""}`}
          style={{
            color: "white",
            backgroundColor: `${userPersonalizationData !== null &&
              userPersonalizationData?.buttonsAndBarsColor
              }`,
          }}
          onClick={addToggle}
        >
          <PlusCircle />
          Create New
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H4 className="modal-title">Create Email Template</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addEmailTemplate)}
            >
              <Row>
                <div className="col-md-12 create-group">
                  <P>Subject</P>
                  <input
                    className="form-control"
                    type="text"
                    {...register("subject", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.subject && "Template Title is required"}
                  </span>
                </div>
                <div className="col-md-12 create-group">
                  <P>Content</P>
                  <ReactQuill
                    value={editorState}
                    defaultValue={editorState}
                    onChange={onEditorChange}
                    className="form-control custom-editor-container"
                    style={{
                      height: "180px",
                      marginBottom: "20px",
                      paddingBottom: "30px",
                      borderRadius: "10px",
                      paddingLeft: "0px",
                      paddingRight: "0px"

                    }}
                    modules={modules}
                  />
                  <span style={{ color: "red" }}>
                    {errors.templateContent && "Template Content is required"}
                  </span>
                </div>
                <Col md={6}>
                  <FormGroup>
                    <P>Template Type</P>
                    <Select
                      showSearch
                      style={{ width: "100%", height: 36 }}
                      placeholder="Select Template Type"
                      optionFilterProp="children"
                      filterOption={(input: any, option: any) =>
                        (option?.label ?? "").includes(input)
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare(
                            (optionB?.label ?? "").toLowerCase()
                          )
                      }

                      onChange={(e, options) => {
                        setType(e);
                      }}
                      options={TEMPLATE_TYPES_ARRAY}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}></Col>

                {getUserRole() == ROLES.SUPER_ADMIN && <Col md={6}>
                  <FormGroup>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <P>Share Option</P>
                      <span
                        style={{
                          fontSize: "16px",
                          margin: "5px 0px",
                        }}
                      >
                        <label
                          style={{
                            display: "inline-block",
                            position: "relative",
                            cursor: "pointer",
                            // marginRight: "25px",
                            fontSize: "16px",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            name="key"
                            value={shareOption ? "on" : "off"}
                            onChange={(e) => {
                              console.log(e.target.checked);
                              setShareOption(e.target.checked)
                            }}
                            checked={shareOption}
                            style={{ display: "none" }} // Hide the default checkbox
                          />
                          <span
                            onClick={(e) => e.stopPropagation()}
                            className="green"
                          ></span>
                        </label>

                      </span>
                    </div>
                  </FormGroup>
                </Col>}
                <div className="col-md-12 create-group">
                  <div style={{ padding: "10px 30px", marginBottom: "15px", backgroundColor: "lightblue", display: "flex", justifyContent: "space-between" }}>

                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{fullName}}`}</p>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{email}}`}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{password}}`}</p>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{phoneNo}}`}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{city}}`}</p>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{package}}`}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{accountLogo}}`}</p>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{currentDate}}`}</p>
                    </div>
                  </div>
                </div>
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
                {Cancel}
              </Button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default CreateNewEmailTemplate;























































// import React, { useState } from 'react';
// import { PlusCircle } from "react-feather";
// import { Col, Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
// import { Controller, useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { H3, H4, P } from "../../AbstractElements";
// import { create, getAll } from "../../Api";
// import { Cancel } from "../../utils/Constant";

// import { Type } from "./EmailTemplatesTypes/EmailTemplatesTypes";
// import RichTextEditor from 'react-rte';
// import './tableStyle.css'
// import BorderBottom from '../BonusUi/CreativeCard/BorderBottom/BorderBottom';

// const CreateNewEmailTemplate = () => {
//   const { userPersonalizationData } = useSelector(
//     (state: any) => state.personalization
//   );
//   const dispatch = useDispatch();
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     reset,
//     control,
//     formState: { errors },
//   } = useForm<Type>();
//   const [addModal, setAddModal] = useState(false);
//   const addToggle = () => {
//     if (!loading) {
//       setAddModal(!addModal);
//       reset({
//         title: "",
//         templateContent: ""
//       });
//       setEditorState(RichTextEditor.createEmptyValue());
//     }
//   };

//   const [editorState, setEditorState] = useState(RichTextEditor.createEmptyValue());

// const onEditorChange = (value: any) => {
//   setEditorState(value);
//   console.log("value", value);
//   console.log("markdown", value.toString('html'));
// };

//   const onSubmit = (data: any) => {
//     // Extracting plain text or HTML content from the editorState
//     const templateContent = editorState.toString('markdown');
//     const formData = {
//       ...data,
//       templateContent
//     };
//     // Handle the form submission
//   };

//   // 'BLOCK_TYPE_BUTTONS'



//   return (
//     <Col md={6}>
//       <div className="text-end">
//         <button
//           className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""}`}
//           style={{
//             color: "white",
//             backgroundColor: `${userPersonalizationData !== null &&
//               userPersonalizationData?.buttonsAndBarsColor
//               }`,
//           }}
//           onClick={addToggle}
//         >
//           <PlusCircle />
//           Create New
//         </button>
//         <Modal isOpen={addModal} toggle={addToggle} size="xl" centered>
//           <div className="modal-header">
//             <H4 className="modal-title">Add Email Template</H4>
//             <Button
//               color="transprant"
//               className="btn-close"
//               onClick={addToggle}
//             ></Button>
//           </div>
//           <ModalBody>
//             <form
//               className="form-bookmark needs-validation"
//             // onSubmit={handleSubmit(onSubmit)}
//             >
//               <Row>
//                 <div className="col-md-12 create-group">
//                   <P>Title</P>
//                   <input
//                     className="form-control"
//                     type="text"
//                     {...register("title", { required: true })}
//                   />
//                   <span style={{ color: "red" }}>
//                     {errors.title && "Template Title is required"}
//                   </span>
//                 </div>
//                 <div className="col-md-12 create-group">
//                   <P>Content</P>
//                   <RichTextEditor
//                     // toolbarConfig={toolbarConfig}
//                     value={editorState}
//                     onChange={onEditorChange}
//                     className="form-control custom-editor-container"

//                     editorClassName="custom-editor"
//                     toolbarClassName="custom-toolbar"
//                   />
//                   <span style={{ color: "red" }}>
//                     {errors.templateContent && "Template Content is required"}
//                   </span>
//                 </div>
//                 <div className="col-md-12 create-group">
//                   <div style={{ padding: "10px 30px", marginBottom: "15px", backgroundColor: "lightblue", display: "flex", justifyContent: "space-between" }}>

//                     <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
//                       <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{email}}`}</p>
//                       <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>User Email</p>
//                     </div>
//                     <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
//                       <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{email}}`}</p>
//                       <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>User Email</p>
//                     </div>
//                     <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
//                       <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{email}}`}</p>
//                       <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>User Email</p>
//                     </div>
//                     <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
//                       <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{email}}`}</p>
//                       <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>User Email</p>
//                     </div>
//                   </div>
//                 </div>
//               </Row>
//               <Button color="primary" className="me-1">
//                 {loading ? "Loading ..." : `Add`}
//               </Button>
//               &nbsp;&nbsp;
//               <Button
//                 disabled={loading ? true : false}
//                 color="secondary"
//                 onClick={addToggle}
//               >
//                 {Cancel}
//               </Button>
//             </form>
//           </ModalBody>
//         </Modal>
//       </div>
//     </Col>
//   );
// };

// export default CreateNewEmailTemplate;
