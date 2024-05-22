import React, { useState } from 'react';
import { PlusCircle } from "react-feather";
import { Col, Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { H3, H4, P } from "../../AbstractElements";
import { create, getAll } from "../../Api";
import { Cancel } from "../../utils/Constant";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './tableStyle.css'
import BorderBottom from '../BonusUi/CreativeCard/BorderBottom/BorderBottom';
import TurndownService from 'turndown';
import { Type } from './WhatsAppTemplatesTypes/WhatsAppTemplatesTypes';

const CreateNewWhatsAppTemplate = () => {
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
        templateContent: ""
      });
      setEditorState('');
    }
  };

  const modules = {
    toolbar: [
      // [{ 'font': [] }],
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      // ['clean']
    ],
  };

  // const [editorState, setEditorState] = useState('<p>Hello <strong>Sandesh</strong></p><p>We have created an account for you on <strong><em><u>Autotel CRM</u></em></strong></p><p>Here are the account credentials:</p><ul><li>Email: <strong>sandesh@sandesh.com</strong></li><li>Password: <strong><u>123456789</u></strong></li></ul><p>Regards,</p><p><strong>Autotel CRM Team</strong></p>');
  const [editorState, setEditorState] = useState('');
  const turndownService = new TurndownService();

  // const onEditorChange = (value: string) => {
  //   setEditorState(value);
  //   console.log("value", value);
  // };
  const onEditorChange = (value: string) => {
    setEditorState(value);
    const markdown = turndownService.turndown(value);
    // console.log("Markdown", markdown);
    // console.log("Html", value);
  };

  const onSubmit = (data: any) => {
    // Extracting plain text or HTML content from the editorState
    const templateContent = editorState;
    const formData = {
      ...data,
      templateContent
    };
    // Handle the form submission
    // console.log('Form Data:', formData);
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
            <H4 className="modal-title">Create WhatsApp Template</H4>
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

export default CreateNewWhatsAppTemplate;
