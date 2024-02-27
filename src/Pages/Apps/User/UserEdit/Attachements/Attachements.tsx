import { Button, Card, CardBody, Col, Modal, ModalBody, Row } from "reactstrap";
import CommonHeader from "../../../../../Common/CommonHeader";
import { H4, H5 } from "../../../../../AbstractElements";
import { useSelector } from "react-redux";
import { useState } from "react";
interface propTypes {
  attachements: any[];
}

const Attachements = ({ attachements }: propTypes) => {
//   console.log("Attachements", attachements);

  const { serverPermissions } = useSelector((state: any) => state.user);
//   console.log("serverPermissions", serverPermissions);

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

  return (
    <Col md={12}>
      <Card>
        <CommonHeader title="Attachements" headClass="card-title mb-0 pb-0" />
        <CardBody>
          <Row>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {attachements.map((image, imageIndex) => (
                <div
                  style={{
                    position: "relative",
                    marginRight: "20px",
                    marginBottom: "20px",
                  }}
                  onMouseEnter={() => handleMouseEnter(imageIndex)}
                  onMouseLeave={() => handleMouseLeave(imageIndex)}
                  onClick={() => {
                    setImageUrl(image);
                    addToggle();
                  }}
                >
                  <img
                    src={image}
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
              ))}
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
