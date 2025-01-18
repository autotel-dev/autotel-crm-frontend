import { PDFViewer } from "@react-pdf/renderer";
import React from "react";
import { IoClose } from "react-icons/io5";
import { Modal, ModalBody } from "reactstrap";

interface ViewPDFModalTypes {
  modal: boolean;
  toggleModal: any;
  body: any;
}

const ViewPDFModal: React.FC<ViewPDFModalTypes> = ({
  modal,
  toggleModal,
  body,
}) => {
  return (
    <div>
      <Modal
        isOpen={modal}
        toggle={toggleModal}
        centered
        size="lg"
        className="custom-modal"
      >
        <ModalBody style={{ margin: "-40px", scrollbarWidth: "none" }}>
          <button className="close-btn" onClick={toggleModal}>
            <IoClose />
          </button>
          <div className="footer-buttons"></div>

          <PDFViewer
            className="pdf-viewer"
            style={{ width: "100%", height: "100vh" }}
          >
            {body()}
          </PDFViewer>
        </ModalBody>
      </Modal>

      <style>{`
  .custom-modal .modal-dialog {
    max-width: 800px;
    margin: 30px auto;
  }
  .custom-modal .modal-content {
    background: #fff;
    border-radius: 0px;
    padding: 20px;
  }
  .modal-backdrop.show {
    opacity: 0.9;
    background-color: black;
    padding: 20px;
  }
  .close-btn {
    position: fixed;
    top: 3%;
    left: 8.5%;
    background: transparent;
    border: none;
    font-size: 2rem;
    color: white;
    cursor: pointer;
  }
  .footer-buttons {
    position: fixed;
    top: 4%;
    right: 3%;
    display: flex;
    gap: 10px;
  }
  .page {
    margin-bottom: 20px;
    page-break-after: always;
  }
  .page-divider {
    border-top: 6px solid black;
    margin: 30px -40px;
  }
    /* Hide scrollbar for WebKit browsers */
.pdf-viewer::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for Firefox */
.pdf-viewer {
  scrollbar-width: none; /* Firefox */
}

  
`}</style>
    </div>
  );
};

export default ViewPDFModal;
