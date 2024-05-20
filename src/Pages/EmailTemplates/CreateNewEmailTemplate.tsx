// import { PlusCircle } from "react-feather";
// import { Col } from "reactstrap";
// import { useState } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
// import { Cancel } from "../../utils/Constant";
// import { CheckCircle } from "react-feather";
// import { H3, H4, P } from "../../AbstractElements";
// import { create, getAll } from "../../Api";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setCountriesStart,
//   setCountriesEnd,
//   setCountries,
//   setFilterCountries,
//   setInActiveActiveCountries,
// } from "../../ReaduxToolkit/Reducer/CountrySlice";
// import Swal from "sweetalert2";
// import { Type } from "./EmailTemplatesTypes/EmailTemplatesTypes";

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
//     }
//   };

//   return (
//     <Col md={6}>
//       <div className="text-end">
// <button
//   className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""
//     }`}
//   style={{
//     color: "white",
//     backgroundColor: `${userPersonalizationData !== null &&
//       userPersonalizationData?.buttonsAndBarsColor
//       }`,
//   }}
//   onClick={addToggle}
// >
//   <PlusCircle />
//   Create New
// </button>
//         <Modal isOpen={addModal} toggle={addToggle} size="lg" centered>
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
//             // onSubmit={handleSubmit(addCountry)}
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
//                   <textarea
//                     className="form-control"
//                     rows={5} // Minimum number of visible lines
//                     style={{
//                       maxHeight: "500px", // Maximum height for 5 lines of text
//                       resize: "vertical", // Allow vertical resizing within the specified range
//                     }}
//                     {...register("templateContent", { required: true })}
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





import React, { useState } from 'react';
import { PlusCircle } from "react-feather";
import { Col, Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { H3, H4, P } from "../../AbstractElements";
import { create, getAll } from "../../Api";
import { Cancel } from "../../utils/Constant";

import { Type } from "./EmailTemplatesTypes/EmailTemplatesTypes";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './tableStyle.css'
import BorderBottom from '../BonusUi/CreativeCard/BorderBottom/BorderBottom';
import TurndownService from 'turndown';

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
        title: "",
        templateContent: ""
      });
      setEditorState('');
    }
  };

  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const [editorState, setEditorState] = useState('');
  const turndownService = new TurndownService();

  // const onEditorChange = (value: string) => {
  //   setEditorState(value);
  //   console.log("value", value);
  // };
  const onEditorChange = (value: string) => {
    setEditorState(value);
    const markdown = turndownService.turndown(value);
    console.log("Markdown", markdown);
  };

  const onSubmit = (data: any) => {
    // Extracting plain text or HTML content from the editorState
    const templateContent = editorState;
    const formData = {
      ...data,
      templateContent
    };
    // Handle the form submission
    console.log('Form Data:', formData);
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
        <Modal isOpen={addModal} toggle={addToggle} size="xl" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Email Template</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Row>
                <div className="col-md-12 create-group">
                  <P>Title</P>
                  <input
                    className="form-control"
                    type="text"
                    {...register("title", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.title && "Template Title is required"}
                  </span>
                </div>
                <div className="col-md-12 create-group">
                  <P>Content</P>
                  <ReactQuill
                    value={editorState}
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
                <div className="col-md-12 create-group">
                  <div style={{ padding: "10px 30px", marginBottom: "15px", backgroundColor: "lightblue", display: "flex", justifyContent: "space-between" }}>

                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{email}}`}</p>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>User Email</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{email}}`}</p>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>User Email</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{email}}`}</p>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>User Email</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{email}}`}</p>
                      <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>User Email</p>
                    </div>
                  </div>
                </div>
              </Row>
              <Button color="primary" className="me-1">
                {loading ? "Loading ..." : `Add`}
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
