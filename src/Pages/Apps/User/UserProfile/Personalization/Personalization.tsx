import {
  Button,
  Card,
  CardBody,
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
import { H4, H5 } from "../../../../../AbstractElements";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Dropzone from "react-dropzone-uploader";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Personalization = () => {
  const { userData } = useSelector((state: any) => state.user);
  //   console.log("Attachements", attachements);

  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    setAddModal(!addModal);
  };

  const [imageUrl, setImageUrl] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [index, setIndex] = useState(0);

  const handleMouseEnter = (index: any) => {
    setIsHovered(true);
    setIndex(index);
  };
  const handleMouseLeave = (index: any) => {
    setIsHovered(false);
    setIndex(index);
  };

  const [primaryColor, setprimaryColor] = useState<string>("");
  const [secondaryClor, setsecondaryClor] = useState<string>("");
  const [customColor1, setcustomColor1] = useState<string>("");
  const [customColor2, setcustomColor2] = useState<string>("");
  const [backgroundColor, setbackgroundColor] = useState<string>("");
  const [textColor, settextColor] = useState<string>("");
  const [logoImage, setlogoImage] = useState(null);
  const [backgroundImage, setbackgroundImage] = useState(null);
  const [loading, setLoading] = useState(false);

  interface type {
    file: any;
    meta: any;
    remove: any;
  }

  const handleLogoAdd = ({ file, meta, remove }: type, status: any) => {
    if (status === "done") {
      console.log("File uploaded successfully:", file);
      setlogoImage(file);
    } else if (status === "removed") {
      console.log("File removed:", file);

      setlogoImage(null);
    }
  };
  const handleBackgroundAdd = ({ file, meta, remove }: type, status: any) => {
    if (status === "done") {
      console.log("File uploaded successfully:", file);
      setbackgroundImage(file);
    } else if (status === "removed") {
      console.log("File removed:", file);

      setbackgroundImage(null);
    }
  };
  const subTitle = [
    {
      text: "",
      code: "",
    },
  ];

  return (
    <Col md={12}>
      <Form className="card" onSubmit={() => {}}>
        <Card>
          <CommonHeader title="Personalization" headClass="card-title mb-0 pb-0" />
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Primary Color</Label>
                  <Input
                    type="color"
                    placeholder="Enter Primary Color here"
                    defaultValue={primaryColor}
                    value={primaryColor}
                    onChange={(e) => setprimaryColor(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Secondary Color</Label>
                  <Input
                    type="color"
                    placeholder="Enter Secondary Color here"
                    defaultValue={secondaryClor}
                    value={secondaryClor}
                    onChange={(e) => setsecondaryClor(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Custom Color 1</Label>
                  <Input
                    type="color"
                    placeholder="Enter Custom Color 1"
                    defaultValue={customColor1}
                    value={customColor1}
                    onChange={(e) => setcustomColor1(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Custom Color 2</Label>
                  <Input
                    type="color"
                    placeholder="Enter Custom Color 2"
                    defaultValue={customColor2}
                    value={customColor2}
                    onChange={(e) => setcustomColor2(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Background Color</Label>
                  <Input
                    type="color"
                    placeholder="Enter Background COlor"
                    defaultValue={backgroundColor}
                    value={backgroundColor}
                    onChange={(e) => setbackgroundColor(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    placeholder="Enter Text Color"
                    defaultValue={textColor}
                    value={textColor}
                    onChange={(e) => settextColor(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <Card>
                  <CommonHeader
                    title="Logo Image"
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
                    title="Background Image"
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
            {/* <Row>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {attachements.map((data, imageIndex) =>
                checkFileTypeByExtension(data.url) == "pdf" ? (
                  <div
                    style={{
                      width: "300px",
                      marginRight: "20px",
                      marginBottom: "20px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => handleClick(e, data.blob)} // Add onClick event handler
                  >
                    {image && <img src={image} alt="First Page" />}
                    <div
                      style={{
                        height: "160px",
                        overflow: "hidden", // Changed from "scroll" to "hidden"
                        border: "1px solid lightgray",
                      }}
                    >
                      <Document
                        file={data.blob}
                        onLoadSuccess={() => onDocumentLoadSuccess(image)}
                      >
                        <Page pageNumber={1} width={300} />
                      </Document>
                    </div>
                    <div
                      style={{
                        padding: "8px 15px",
                        fontSize: "16px",
                        borderBottomLeftRadius: "5px",
                        borderBottomRightRadius: "5px",
                        overflow: "clip",
                      }}
                      className="btn-primary"
                    >
                      {data.key.toString().slice(0, 10)}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      position: "relative",
                      marginRight: "20px",
                      marginBottom: "20px",
                    }}
                    onMouseEnter={() => handleMouseEnter(imageIndex)}
                    onMouseLeave={() => handleMouseLeave(imageIndex)}
                    onClick={() => {
                      setImageUrl(data.blob);
                      addToggle();
                    }}
                  >
                    <img
                      src={data.blob}
                      alt=""
                      height={200}
                      width={300}
                      style={{
                        borderRadius: "10px",
                        border: "0.5px solid lightgray",
                      }}
                    />
                    {isHovered && index == imageIndex && (
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
                )
              )}
              <Modal isOpen={addModal} toggle={addToggle} size="lg" centered>
                <ModalBody>
                  <div>
                    <div className="modal-header"></div>
                    <img src={imageUrl} alt="" height={500} width="100%" />
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </Row> */}
          </CardBody>
        </Card>
      </Form>
    </Col>
  );
};

export default Personalization;
