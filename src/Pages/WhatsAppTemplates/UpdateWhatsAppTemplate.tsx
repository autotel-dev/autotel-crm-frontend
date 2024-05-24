import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { Cancel } from "../../utils/Constant";
import { H3, H4, P } from "../../AbstractElements";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, update } from "../../Api";
import { Select } from "antd";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import './tableStyle.css'
import TurndownService from 'turndown';
import { getUserRole } from "../../Api/globals";
import { ROLES } from "../../constants/roles";
import Swal from "sweetalert2";
import { setFilterWhatsAppTemplates, setWhatsAppTemplates, setWhatsAppTemplatesEnd, setWhatsAppTemplatesStart } from '../../ReaduxToolkit/Reducer/WhatsAppTemplateSlice';
import { Type } from "./WhatsAppTemplatesTypes/WhatsAppTemplatesTypes";


interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  id: any;
  templateContent: any;
  type: any;
  shareOption: any;
  setType: any;
  setShareOption: any;
  setTemplateContent: any;
}

const UpdateWhatsAppTemplate: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => { },
  id,
  templateContent,
  type,
  shareOption,
  setType,
  setShareOption,
  setTemplateContent

  // setValue
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Type>({
    defaultValues: {
      // Set the initial value from props

      templateContent: templateContent
    },
  });
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
      // setTemplateContent(templateContent)
    }
  };
  // console.log("template", templateContent);


  const turndownService = new TurndownService();
  const updateEmailTemplate: SubmitHandler<Type> = async (data) => {
    setLoading(true);
    const markdown = turndownService.turndown(templateContent);

    // Convert markdown to plain text with some formatting for WhatsApp
    let plainText = markdown
      .replace(/\*\*(.*?)\*\*/g, '*$1*')   // Convert bold (**) to single asterisk (*)
      .replace(/__(.*?)__/g, '*$1*');      // Convert bold (__) to single asterisk (*)
    var emailTemplate = {
      content: plainText,
      type: type
    };

    console.log(emailTemplate);
    if (templateContent !== "" && type !== "") {
      try {
        await update(emailTemplate, { url: `template/whatsapp-template/update-template/${id}` }).then(
          (data: any) => {
            if (
              !data.success &&
              data.message === "ERROR_INTERNET_DISCONNECTED"
            ) {
              setLoading(false);
              setIsVisible(!isVisible);
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              setIsVisible(!isVisible);
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
              setIsVisible(!isVisible);
              // setId("null");

              dispatch(setWhatsAppTemplatesStart());
              getAll({ url: "template/whatsapp-template/get-all-templates" }).then(
                (data: any) => {
                  // console.log("api call --- >", data);
                  if (data == undefined) {
                    Swal.fire({
                      text: "Failed to fetch due to connection refused",
                      icon: "error",
                      timer: 2000,
                      showConfirmButton: false,
                    });
                    dispatch(setWhatsAppTemplates([]));
                    dispatch(setFilterWhatsAppTemplates([]));
                    dispatch(setWhatsAppTemplatesEnd());
                    return;
                  }
                  dispatch(setWhatsAppTemplatesEnd());
                  if (data !== undefined) {
                    if (data.success) {
                      // console.log("hhg");
                      dispatch(setWhatsAppTemplates(data.data));
                      dispatch(setFilterWhatsAppTemplates(data.data));
                    }
                  }
                }
              );
            }
          }
        );
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        setLoading(false);
        setIsVisible(!isVisible);
      }
    }
  };





  const modules = {
    toolbar: [
      // [{ 'font': [] }],
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'
        // , 'strike', 'blockquote'
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



  useEffect(() => {
    setValue("templateContent", templateContent);
  }, [templateContent, setValue]);

  const onEditorChange = (value: string) => {
    setTemplateContent(value);
    // console.log("Html", value);
  };

  // function markdownToHtml(text: any) {
  //   // Split the text by \n\n to handle paragraphs
  //   const paragraphs = text.split('\n\n');
  //   console.log(paragraphs);


  //   // Process each paragraph to replace markdown-like syntax with HTML tags
  //   const processedParagraphs = paragraphs.map((paragraph: any) => {
  //     return paragraph
  //       .replace(/\*\{\{(.*?)\}\}\*/g, '<strong>{{$1}}</strong>') // Replace *{{var}}* with <strong>{{var}}</strong>
  //       .replace(/\*\_(.*?)\_\*/g, '<strong><em>$1</em></strong>'); // Replace *_var_* with <strong><em>var</em></strong>
  //   });
  //   console.log(processedParagraphs);
  //   // Join the processed paragraphs with <p> tags
  //   const html = processedParagraphs.map((p: any) => `<p>${p}</p>`).join('');

  //   return html;
  // }




  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={
        addToggle
      }
      size="lg"
      onClosed={() => {
        setIsVisible(false);
      }}
    >
      <div className="modal-header">
        <H4 className="modal-title">Update WhatsApp Templates</H4>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
            // console.log(value);
          }}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(updateEmailTemplate)}
        >
          <Row>
            <div className="col-md-12 create-group">
              <P>Content</P>
              <ReactQuill
                value={templateContent}
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
                  defaultValue={type}
                  value={type}
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
                  <P>Is Shareable</P>
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
                        // onChange={(e) => {
                        //   console.log(e.target.checked);
                        //   setShareOption(e.target.checked)
                        // }}
                        checked={shareOption}
                        disabled
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
                  <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{currentDate}}`}</p>
                  {/* <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{currentDate}}`}</p> */}
                </div>
              </div>
            </div>
          </Row>
          <div style={{ marginLeft: "10px" }}>
            <Row>

            </Row>
          </div>
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Update`}
          </Button>
          &nbsp;&nbsp;
          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={() => {
              // setValue("")
              setIsVisible(!isVisible);
              // console.log(value);
            }}
          >
            {Cancel}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateWhatsAppTemplate;
