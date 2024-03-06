import { Button, Card, CardBody, Col, Modal, ModalBody, Row } from "reactstrap";
import CommonHeader from "../../../../../Common/CommonHeader";
import { H4, H5 } from "../../../../../AbstractElements";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface propTypes {
  attachements: any[];
}

const Attachements = ({ attachements }: propTypes) => {
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

  function checkFileTypeByExtension(fileName: any) {
    console.log("filename", fileName);

    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const pdfExtension = "pdf";

    const extension = fileName.split(".").pop().toLowerCase();

    if (imageExtensions.includes(extension)) {
      return "image";
    } else if (extension === pdfExtension) {
      return "pdf";
    } else {
      return "unknown";
    }
  }

  const [image, setImage] = useState<string | null>(null);
  const onDocumentLoadSuccess = async (file: any) => {
    try {
      const pdf = await pdfjs.getDocument(file).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) {
        throw new Error("Canvas context is null");
      }
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      const imgData = canvas.toDataURL();
      setImage(imgData);
    } catch (error) {
      console.error("Error rendering PDF:", error);
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    file: any
  ) => {
    event.preventDefault();
    window.open(file, "_blank");
  };

  return (
    <Col md={12}>
      <Card>
        <CommonHeader title="Attachements" headClass="card-title mb-0 pb-0" />
        <CardBody>
          <Row>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {attachements.map((data, imageIndex) =>
                checkFileTypeByExtension(data.url) == "pdf" ? (
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                      {data.key}
                    </div>
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
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                      {data.key}
                    </div>
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
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Attachements;
