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
import { Cancel } from "../../../utils/Constant";
import { H3, H4, P } from "../../../AbstractElements";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, update } from "../../../Utilities/api";
import { Type } from "./EmailTemplatesTypes/EmailTemplatesTypes";
import { Select } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import './tableStyle.css'
import TurndownService from "turndown";
import { getUserRole } from "../../../Utilities/globals/globals";
import { ROLES } from "../../../constants/roles";
import Swal from "sweetalert2";
import {
  setEmailTemplates,
  setEmailTemplatesEnd,
  setEmailTemplatesStart,
  setFilterEmailTemplates,
} from "../../../ReaduxToolkit/Reducer/EmailTemplateSlice";
import {
  GET_EMAIL_TEMPLATES,
  UPDATE_EMAIL_TEMPLATE,
} from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  id: any;
  subject: any;
  templateContent: any;
  type: any;
  shareOption: any;
  setType: any;
  setShareOption: any;
  setTemplateContent: any;
}

const UpdateEmailTemplate: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  id,
  subject,
  templateContent,
  type,
  shareOption,
  setType,
  setShareOption,
  setTemplateContent,

  // setValue
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization,
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
      subject: subject,
      templateContent: templateContent,
    },
  });
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
    }
  };
  // console.log(id);
  // console.log(subject);
  // console.log(templateContent);

  const updateEmailTemplate: SubmitHandler<Type> = async (data) => {
    setLoading(true);
    var emailTemplate = {
      subject: data.subject,
      content: templateContent,
      type: type,
    };

    // console.log(emailTemplate);
    if (data.subject !== "" && templateContent !== "" && type !== "") {
      try {
        await update(emailTemplate, {
          url: `${UPDATE_EMAIL_TEMPLATE}/${id}`,
        }).then((data: any) => {
          if (!data.success && data.message === ERROR_MESSAGE) {
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
            // dispatch(setValue(""));
            dispatch(setEmailTemplatesStart());
            getAll({ url: GET_EMAIL_TEMPLATES }).then((data: any) => {
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
            });
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        setLoading(false);
        setIsVisible(!isVisible);
      }
    }
  };
  useEffect(() => {
    setValue("subject", subject);
  }, [subject, setValue]);

  useEffect(() => {
    setValue("templateContent", templateContent);
  }, [templateContent, setValue]);

  const modules = {
    toolbar: [
      // [{ 'font': [] }],
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
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

  // const [editorState, setEditorState] = useState('<p>Hello <strong>Sandesh</strong></p><p>We have created an account for you on <strong><em><u>Autotel CRM</u></em></strong></p><p>Here are the account credentials:</p><ul><li>Email: <strong>sandesh@sandesh.com</strong></li><li>Password: <strong><u>123456789</u></strong></li></ul><p>Regards,</p><p><strong>Autotel CRM Team</strong></p>');
  // const [editorState, setEditorState] = useState("");
  const turndownService = new TurndownService();

  const onEditorChange = (value: string) => {
    setTemplateContent(value);
    const markdown = turndownService.turndown(value);
    // console.log("Markdown", markdown);
    // console.log("Html", value);
  };

  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={
        addToggle
        //   () => {
        //   setIsVisible(!isVisible);
        // }
      }
      size="lg"
      onClosed={() => {
        // setValue("")
        setIsVisible(false);
        // console.log(value);
      }}
    >
      <div className="modal-header">
        <H4 className="modal-title">Update Email Templates</H4>
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
              <P>Subject</P>
              <input
                className="form-control"
                type="text"
                {...register("subject", { required: true })}
                // value={subject}
              />
              <span style={{ color: "red" }}>
                {errors.subject && "Template Title is required"}
              </span>
            </div>
            <div className="col-md-12 create-group">
              <P>Content</P>
              <ReactQuill
                value={templateContent}
                defaultValue={templateContent}
                onChange={onEditorChange}
                className="form-control custom-editor-container"
                style={{
                  height: "180px",
                  marginBottom: "20px",
                  paddingBottom: "30px",
                  borderRadius: "10px",
                  paddingLeft: "0px",
                  paddingRight: "0px",
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
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={(e, options) => {
                    setType(e);
                  }}
                  options={TEMPLATE_TYPES_ARRAY}
                />
              </FormGroup>
            </Col>
            <Col md={6}></Col>

            {getUserRole() == ROLES.SUPER_ADMIN && (
              <Col md={6}>
                <FormGroup>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                          // onChange={(e) => {
                          //   console.log(e.target.checked);
                          //   setShareOption(e.target.checked)
                          // }}
                          disabled
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
              </Col>
            )}
            <div className="col-md-12 create-group">
              <div
                style={{
                  padding: "10px 30px",
                  marginBottom: "15px",
                  backgroundColor: "lightblue",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                  }}
                >
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      marginBottom: "2px",
                    }}
                  >{`{{fullName}}`}</p>
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      marginBottom: "2px",
                    }}
                  >{`{{email}}`}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                  }}
                >
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      marginBottom: "2px",
                    }}
                  >{`{{password}}`}</p>
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      marginBottom: "2px",
                    }}
                  >{`{{phoneNo}}`}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                  }}
                >
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      marginBottom: "2px",
                    }}
                  >{`{{city}}`}</p>
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      marginBottom: "2px",
                    }}
                  >{`{{package}}`}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                  }}
                >
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      marginBottom: "2px",
                    }}
                  >{`{{currentDate}}`}</p>
                  {/* <p style={{ display: "flex", justifyContent: "start", marginBottom: "2px" }}>{`{{currentDate}}`}</p> */}
                </div>
              </div>
            </div>
          </Row>
          <div style={{ marginLeft: "10px" }}>
            <Row>
              {/* <FormGroup check switch inline className="col-md-12 create-group">
                <Input
                  type="checkbox"
                  role="switch"
                  defaultChecked={isActive}
                  value={isActive ? "on" : "off"}
                  onChange={(e) => {
                    setIsActive(!isActive);
                    // console.log(e.target.value);
                  }}
                />
              </FormGroup> */}
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

export default UpdateEmailTemplate;
