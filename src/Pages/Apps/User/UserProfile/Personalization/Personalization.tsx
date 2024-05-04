import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import CommonHeader from "../../../../../Common/CommonHeader";
import { H4, H5, P } from "../../../../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Dropzone from "react-dropzone-uploader";
import Swal from "sweetalert2";
import {
  IMAGE_BASE_URL,
  createWithMultipart,
  getAll,
  updateWithMultipart,
} from "../../../../../Api";
import { getUserId, getUserRole } from "../../../../../Api/globals";
import { setUserPersonalizationData } from "../../../../../ReaduxToolkit/Reducer/PersonalizationSlice";
import { ROLES } from "../../../../../constants/roles";
import { Select } from "antd";

const Personalization = () => {
  const { userData } = useSelector((state: any) => state.user);
  //   // console.log("Attachements", attachements);

  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    setAddModal(!addModal);
  };

  const [imageUrl, setImageUrl] = useState("");
  const [isHoveredForAccountLogo, setIsHoveredForAccountLogo] = useState(false);
  const [isHoveredForLoginPageLogo, setIsHoveredForLoginPageLogo] =
    useState(false);

  const handleMouseEnterForAccountLogo = () => {
    setIsHoveredForAccountLogo(true);
  };
  const handleMouseLeaveForAccountLogo = () => {
    setIsHoveredForAccountLogo(false);
  };
  const handleMouseEnterForLoginPageLogo = () => {
    setIsHoveredForLoginPageLogo(true);
  };
  const handleMouseLeaveForLoginPageLogo = () => {
    setIsHoveredForLoginPageLogo(false);
  };
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  // console.log("userPersonalizationData", userPersonalizationData);

  const [headerText, setheaderText] = useState<string>(
    userPersonalizationData !== null ? userPersonalizationData.headerText : ""
  );
  const [subHeaderText, setsubHeaderText] = useState<string>(
    userPersonalizationData !== null
      ? userPersonalizationData.subHeaderText
      : ""
  );
  const [primaryColor, setprimaryColor] = useState<string>(
    userPersonalizationData !== null
      ? userPersonalizationData.primaryColor
      : "#000000"
  );
  const [secondaryClor, setsecondaryClor] = useState<string>(
    userPersonalizationData !== null
      ? userPersonalizationData.secondaryColor
      : "#000000"
  );
  const [customColor1, setcustomColor1] = useState<string>(
    userPersonalizationData !== null
      ? userPersonalizationData.customColor1
      : "#000000"
  );
  const [customColor2, setcustomColor2] = useState<string>(
    userPersonalizationData !== null
      ? userPersonalizationData.customColor2
      : "#000000"
  );
  const [backgroundColor, setbackgroundColor] = useState<string>(
    userPersonalizationData !== null
      ? userPersonalizationData.backgroundColor
      : "#000000"
  );
  const [textColor, settextColor] = useState<string>(
    userPersonalizationData !== null
      ? userPersonalizationData.textColor
      : "#000000"
  );
  const [logoImage, setlogoImage] = useState(
    userPersonalizationData !== null ? userPersonalizationData.logoImage : null
  );

  const [backgroundImage, setbackgroundImage] = useState(
    userPersonalizationData !== null
      ? userPersonalizationData.backgroundImage
      : null
  );

  const [editedLogoImage, setEditedlogoImage] = useState(null);
  const [editedbackgroundImage, setEditedbackgroundImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  interface type {
    file: any;
    meta: any;
    remove: any;
  }

  const handleLogoAdd = ({ file, meta, remove }: type, status: any) => {
    if (status === "done") {
      // console.log("File uploaded successfully:", file);
      if (isEdit) {
        setEditedlogoImage(file);
      } else {
        setlogoImage(file);
      }
    } else if (status === "removed") {
      // console.log("File removed:", file);
      if (isEdit) {
        setEditedlogoImage(null);
      } else {
        setlogoImage(null);
      }
    }
  };
  const handleBackgroundAdd = ({ file, meta, remove }: type, status: any) => {
    if (status === "done") {
      // console.log("File uploaded successfully:", file);

      if (isEdit) {
        setEditedbackgroundImage(file);
      } else {
        setbackgroundImage(file);
      }
    } else if (status === "removed") {
      // console.log("File removed:", file);
      if (isEdit) {
        setEditedbackgroundImage(null);
      } else {
        setbackgroundImage(null);
      }
    }
  };
  const subTitle = [
    {
      text: "",
      code: "",
    },
  ];

  const [isEdit, setIsEdit] = useState(false);
  // useEffect(() => {
  //   setIsEdit(userPersonalizationData !== null ? true : false);
  // }, [userPersonalizationData]);

  const createPersonalization = (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("headerText", headerText);
    formData.append("subHeaderText", subHeaderText);
    formData.append("primaryColor", primaryColor);
    formData.append("secondaryColor", secondaryClor);
    formData.append("customColor1", customColor1);
    formData.append("customColor2", customColor2);
    formData.append("backgroundColor", backgroundColor);
    formData.append("textColor", textColor);
    formData.append("type", "DEFAULT");

    if (isEdit) {
      if (editedLogoImage !== null) {
        formData.append("logoImage", editedLogoImage);
      }
      if (editedbackgroundImage !== null) {
        formData.append("backgroundImage", editedbackgroundImage);
      }
    } else {
      if (logoImage !== null) {
        formData.append("logoImage", logoImage);
      }
      if (backgroundImage !== null) {
        formData.append("backgroundImage", backgroundImage);
      }
    }
    if (isEdit && userPersonalizationData !== null) {
      updateWithMultipart(formData, {
        url: `personalization/update-personalization/${userPersonalizationData._id}`,
      })
        .then((data: any) => {
          // console.log("api call --- >", data);
          if (data == undefined) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            // setIsEdit(!isEdit);
          }
          if (data !== undefined) {
            if (
              !data.success &&
              data.message === "ERROR_INTERNET_DISCONNECTED"
            ) {
              setLoading(false);
              setIsEdit(!isEdit);
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              setIsEdit(!isEdit);
            }
            if (data.success) {
              setEditedlogoImage(null);
              setEditedbackgroundImage(null);
              getAll({
                url:
                  getUserRole() === ROLES.COMPANY
                    ? `company/get-personalization/${getUserId()}`
                    : "super-admin/get-personalization",
              }).then((parentData: any) => {
                // console.log("api call --- >", parentData);
                if (parentData == undefined) {
                  Swal.fire({
                    text: "Failed to Fetch",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  setLoading(false);
                  setIsEdit(false);
                  dispatch(setUserPersonalizationData(null));
                }

                if (parentData !== undefined) {
                  if (parentData.success) {
                    setIsEdit(false);
                    dispatch(setUserPersonalizationData(parentData.data));
                    setLoading(false);
                  }
                  if (!parentData.success) {
                    setIsEdit(false);
                    setLoading(false);
                    dispatch(setUserPersonalizationData(null));
                  }
                }
              });
            }
          }
        })
        .catch((err: any) => {
          // console.log("catch data", err);
          setLoading(false);
        });
    } else {
      createWithMultipart(formData, {
        url: `personalization/create-personalization`,
      })
        .then((data: any) => {
          // console.log("api call --- >", data);
          if (data == undefined) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            // setIsEdit(!isEdit);
          }
          if (data !== undefined) {
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              // setIsEdit(!isEdit);
            }
            if (data.success) {
              getAll({
                url:
                  getUserRole() === ROLES.COMPANY
                    ? `company/get-personalization/${getUserId()}`
                    : "super-admin/get-personalization",
              }).then((parentData: any) => {
                // console.log("api call --- >", parentData);
                if (parentData == undefined) {
                  Swal.fire({
                    text: "Failed to Fetch",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  setLoading(false);
                  dispatch(setUserPersonalizationData(null));
                }

                if (parentData !== undefined) {
                  if (parentData.success) {
                    dispatch(setUserPersonalizationData(parentData.data));
                    setLoading(false);
                  }
                  if (!parentData.success) {
                    setLoading(false);
                    dispatch(setUserPersonalizationData(null));
                  }
                }
              });
            }
          }
        })
        .catch((err: any) => {
          // console.log("catch data", err);
          setLoading(false);
        });
    }
  };

  const backgroundTypeList = [
    {
      label: "Solid",
      value: "Solid",
    },
    {
      label: "Gradient",
      value: "Gradient",
    },
  ];
  const [backgroundType, setBackgroundType] = useState("Solid");
  const gradientDirectionTypes = [
    {
      label: "Right",
      value: "right",
    },
    {
      label: "Left",
      value: "left",
    },
    {
      label: "Top",
      value: "top",
    },
  ];
  const [gradientDirection, setGradientDirection] = useState("");

  return (
    <Col md={12}>
      <Form className="card" onSubmit={createPersonalization}>
        <Card>
          <CardHeader className="pb-0">
            <H4>Personalization</H4>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={3}>
                <FormGroup>
                  <P>Primary Color</P>
                  <Input
                    type="color"
                    placeholder="Enter Primary Color here"
                    defaultValue={primaryColor}
                    value={primaryColor}
                    disabled={
                      userPersonalizationData !== null && !isEdit ? true : false
                    }
                    onChange={(e) => setprimaryColor(e.target.value)}
                    style={{ height: "50px" }}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <P>Secondary Color</P>
                  <Input
                    type="color"
                    placeholder="Enter Secondary Color here"
                    defaultValue={secondaryClor}
                    value={secondaryClor}
                    disabled={
                      userPersonalizationData !== null && !isEdit ? true : false
                    }
                    onChange={(e) => setsecondaryClor(e.target.value)}
                    style={{ height: "50px" }}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <P>Background Color</P>
                  <Input
                    type="color"
                    placeholder="Enter Custom Color 1"
                    defaultValue={customColor1}
                    value={customColor1}
                    disabled={
                      userPersonalizationData !== null && !isEdit ? true : false
                    }
                    onChange={(e) => setcustomColor1(e.target.value)}
                    style={{ height: "50px" }}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <P>Buttons and Bars Color</P>
                  <Input
                    type="color"
                    placeholder="Enter Custom Color 2"
                    defaultValue={customColor2}
                    value={customColor2}
                    disabled={
                      userPersonalizationData !== null && !isEdit ? true : false
                    }
                    onChange={(e) => setcustomColor2(e.target.value)}
                    style={{ height: "50px" }}
                  />
                </FormGroup>
              </Col>
              <CardHeader
                style={{
                  padding: "20px 12px",
                }}
              >
                <H4>Login Page Settings</H4>
              </CardHeader>
              <Col md={6}>
                <FormGroup>
                  <P>Header Text</P>
                  <Input
                    type="text"
                    placeholder="Enter Header Text here"
                    defaultValue={headerText}
                    value={headerText}
                    disabled={
                      userPersonalizationData !== null && !isEdit ? true : false
                    }
                    onChange={(e) => setheaderText(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <P>Sub Header Text</P>
                  <Input
                    type="text"
                    placeholder="Enter Sub Text here"
                    defaultValue={subHeaderText}
                    value={subHeaderText}
                    disabled={
                      userPersonalizationData !== null && !isEdit ? true : false
                    }
                    onChange={(e) => setsubHeaderText(e.target.value)}
                  />
                </FormGroup>
              </Col>

              <Col md={backgroundType == "Solid" ? 3 : 4}>
                <FormGroup>
                  <P>Background Type</P>
                  <Select
                    showSearch
                    style={{ width: "100%", height: 50 }}
                    placeholder="Select Type"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    onChange={(e) => {
                      console.log(e);
                      setBackgroundType(e);
                    }}
                    options={backgroundTypeList}
                  />
                </FormGroup>
              </Col>

              {backgroundType == "Solid" && (
                <Col md={backgroundType == "Solid" ? 3 : 4}>
                  <FormGroup>
                    <P>Background Color</P>
                    <Input
                      type="color"
                      placeholder="Enter Background COlor"
                      defaultValue={backgroundColor}
                      value={backgroundColor}
                      disabled={
                        userPersonalizationData !== null && !isEdit
                          ? true
                          : false
                      }
                      onChange={(e) => setbackgroundColor(e.target.value)}
                      style={{ height: "50px" }}
                    />
                  </FormGroup>
                </Col>
              )}
              <Col md={backgroundType == "Solid" ? 3 : 4}>
                <FormGroup>
                  <P>Text Color 1</P>
                  <Input
                    type="color"
                    placeholder="Enter Text Color"
                    defaultValue={textColor}
                    value={textColor}
                    disabled={
                      userPersonalizationData !== null && !isEdit ? true : false
                    }
                    onChange={(e) => settextColor(e.target.value)}
                    style={{ height: "50px" }}
                  />
                </FormGroup>
              </Col>
              <Col md={backgroundType == "Solid" ? 3 : 4}>
                <FormGroup>
                  <P>Text Color 2</P>
                  <Input
                    type="color"
                    placeholder="Enter Text Color"
                    defaultValue={textColor}
                    value={textColor}
                    disabled={
                      userPersonalizationData !== null && !isEdit ? true : false
                    }
                    onChange={(e) => settextColor(e.target.value)}
                    style={{ height: "50px" }}
                  />
                </FormGroup>
              </Col>

              {backgroundType == "Gradient" && (
                <>
                  <Col md={4}>
                    <FormGroup>
                      <P>Direction</P>
                      <Select
                        showSearch
                        style={{ width: "100%", height: 50 }}
                        placeholder="Select Direction"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.label ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        onChange={(e) => {
                          console.log(e);
                          setGradientDirection(e);
                        }}
                        options={gradientDirectionTypes}
                      />
                    </FormGroup>
                  </Col>

                  <Col md={4}>
                    <FormGroup>
                      <P>Color 1</P>
                      <Input
                        type="color"
                        placeholder="Enter Text Color"
                        defaultValue={textColor}
                        value={textColor}
                        disabled={
                          userPersonalizationData !== null && !isEdit
                            ? true
                            : false
                        }
                        onChange={(e) => settextColor(e.target.value)}
                        style={{ height: "50px" }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <P>Color 2</P>
                      <Input
                        type="color"
                        placeholder="Enter Text Color"
                        defaultValue={textColor}
                        value={textColor}
                        disabled={
                          userPersonalizationData !== null && !isEdit
                            ? true
                            : false
                        }
                        onChange={(e) => settextColor(e.target.value)}
                        style={{ height: "50px" }}
                      />
                    </FormGroup>
                  </Col>
                </>
              )}

              <CardHeader
                style={{
                  padding: "20px 12px",
                }}
              >
                <H4>Login Uploads</H4>
              </CardHeader>

              {userPersonalizationData == null ? (
                <Row>
                  <Col md={6}>
                    <Card>
                      <CommonHeader
                        title="Account Logo"
                        subTitle={subTitle}
                        headClass="pb-0"
                      />
                      <CardBody>
                        <Dropzone
                          onChangeStatus={handleLogoAdd}
                          // accept="image/*"
                          accept="image/*"
                          maxFiles={1}
                          inputContent="Drop files here or click to upload."
                        />
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <CommonHeader
                        title="Login Page Logo"
                        subTitle={subTitle}
                        headClass="pb-0"
                      />
                      <CardBody>
                        <Dropzone
                          onChangeStatus={handleBackgroundAdd}
                          // accept="image/*"
                          accept="image/*,application/pdf"
                          maxFiles={1}
                          inputContent="Drop files here or click to upload."
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              ) : isEdit && userPersonalizationData !== null ? (
                <Row>
                  <Col md={6}>
                    <Card>
                      <CommonHeader
                        title="Account Logo"
                        subTitle={subTitle}
                        headClass="pb-0"
                      />
                      <CardBody>
                        <Dropzone
                          onChangeStatus={handleLogoAdd}
                          // accept="image/*"
                          accept="image/*"
                          maxFiles={1}
                          inputContent="Drop files here or click to upload."
                        />
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <CommonHeader
                        title="Login Page Logo"
                        subTitle={subTitle}
                        headClass="pb-0"
                      />
                      <CardBody>
                        <Dropzone
                          onChangeStatus={handleBackgroundAdd}
                          // accept="image/*"
                          accept="image/*,application/pdf"
                          maxFiles={1}
                          inputContent="Drop files here or click to upload."
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <div>
                      <CardHeader
                        style={{
                          padding: "20px 12px",
                        }}
                      >
                        <H5>Account Logo</H5>
                      </CardHeader>
                      <div
                        style={{
                          position: "relative",
                          marginRight: "20px",
                          marginBottom: "20px",
                        }}
                        onMouseEnter={() => handleMouseEnterForAccountLogo()}
                        onMouseLeave={() => handleMouseLeaveForAccountLogo()}
                        onClick={() => {
                          setImageUrl(
                            `${IMAGE_BASE_URL}/${userPersonalizationData.logoImage.url}`
                          );
                          addToggle();
                        }}
                      >
                        <img
                          src={`${IMAGE_BASE_URL}/${userPersonalizationData.logoImage.url}`}
                          alt=""
                          height={230}
                          width={360}
                          style={{
                            borderRadius: "10px",
                            border: "0.5px solid lightgray",
                          }}
                        />
                        {isHoveredForAccountLogo && (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              background: "rgba(0, 0, 0, 0.7)", // Light black color with opacity
                              borderRadius: "10px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "20px",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              View Image
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <CardHeader
                        style={{
                          padding: "20px 12px",
                        }}
                      >
                        <H5>Login Page Logo</H5>
                      </CardHeader>
                      <div
                        style={{
                          position: "relative",
                          marginRight: "20px",
                          marginBottom: "20px",
                        }}
                        onMouseEnter={() => handleMouseEnterForLoginPageLogo()}
                        onMouseLeave={() => handleMouseLeaveForLoginPageLogo()}
                        onClick={() => {
                          setImageUrl(
                            `${IMAGE_BASE_URL}/${userPersonalizationData.backgroundImage.url}`
                          );
                          addToggle();
                        }}
                      >
                        <img
                          src={`${IMAGE_BASE_URL}/${userPersonalizationData.backgroundImage.url}`}
                          alt=""
                          height={230}
                          width={360}
                          style={{
                            borderRadius: "10px",
                            border: "0.5px solid lightgray",
                          }}
                        />
                        {isHoveredForLoginPageLogo && (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              background: "rgba(0, 0, 0, 0.7)", // Light black color with opacity
                              borderRadius: "10px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "20px",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              View Image
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Modal
                      isOpen={addModal}
                      toggle={addToggle}
                      size="lg"
                      centered
                    >
                      <ModalBody>
                        <div>
                          <div className="modal-header"></div>
                          <img
                            src={imageUrl}
                            alt=""
                            height={500}
                            width="100%"
                          />
                        </div>
                      </ModalBody>
                    </Modal>
                  </div>
                </Row>
              )}

              <CardFooter
                style={{
                  display: "flex",

                  justifyContent: "end",
                }}
              >
                {isEdit && (
                  <Button
                    color="primary"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEdit(!isEdit);
                    }}
                    style={{
                      marginRight: "10px",
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  color="primary"
                  type="submit"
                  disabled={loading}
                  onClick={(e) => {
                    if (isEdit === false && userPersonalizationData !== null) {
                      e.preventDefault();
                      setIsEdit(true);
                    }
                  }}
                >
                  {loading
                    ? "Loading..."
                    : userPersonalizationData == null
                    ? "Create"
                    : isEdit
                    ? "Save"
                    : "Edit"}
                </Button>
              </CardFooter>
            </Row>
          </CardBody>
        </Card>
      </Form>
    </Col>
  );
};

export default Personalization;
