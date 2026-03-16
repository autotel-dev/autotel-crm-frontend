import {
  Document,
  Page,
  PDFViewer,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import React from "react";
import { IoClose } from "react-icons/io5";
import { Modal, ModalBody } from "reactstrap";
import { Font } from "@react-pdf/renderer";
import { IMAGE_BASE_URL } from "../../../Utilities/api/apiEndpoints";
import { useSelector } from "react-redux";
import BackgroundImage from "../../../assets/Background Image.png";

// Register local Helvetica fonts
Font.register({
  family: "Helvetica",
  fonts: [
    { src: require("../../../assets/fonts/helvetica/Helvetica.ttf") }, // Regular
    {
      src: require("../../../assets/fonts/helvetica/Helvetica-Bold.ttf"),
      fontWeight: "bold",
    }, // Bold
  ],
});

interface ViewPDFModalTypes {
  modal: boolean;
  toggleModal: any;
  data: any;
  header: any;
  reportName: String;
  fromDate?: string;
  toDate?: string;
  registrationNo?: string;
}

const ViewPDFModalForReports: React.FC<ViewPDFModalTypes> = ({
  modal,
  toggleModal,
  data,
  header,
  reportName,
  fromDate,
  toDate,
  registrationNo,
}) => {
  const { userData } = useSelector((state: any) => state.user);

  // Function to calculate the max width of each column or distribute evenly
  const getColumnWidths = () => {
    const totalColumns = header?.length;
    if (!data || data.length === 0) {
      return Array(totalColumns || 0).fill(100);
    }
    // Optimization: Sample only up to first 200 rows for width calculation
    const sampledData = data.slice(0, 200);
    const widths = header.map((headerItem: any) => {
      let maxLength = headerItem.label.length;
      sampledData.forEach((item: any) => {
        const itemLength = String(item[headerItem.value] || "").length;
        if (itemLength > maxLength) maxLength = itemLength;
      });
      return Math.min(maxLength * 7, 300);
    });
    const totalWidth = widths.reduce((sum: any, w: any) => sum + w, 0);
    if (totalWidth < 800 && totalColumns) return Array(totalColumns).fill(800 / totalColumns);
    return widths;
  };

  const columnWidths = getColumnWidths(); // Get dynamic column widths

  const styles2 = StyleSheet.create({
    page: { padding: 20 },
    section: { marginBottom: 10 },
    text: {
      fontSize: 8,
    },
    reportName: {
      justifyContent: "center",
      alignItems: "center",
    },
    titleName: {
      fontSize: 12,
    },
    titleText: {
      fontSize: 16,
    },
    companyDetails: {
      fontSize: 8,
      maxWidth: "200px",
    },
    detailsRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingVertical: 1,
    },
    tableContainer: {
      width: "100%",
      height: "auto",
      border: "2px solid black",
    },
    tableRowForHeader: {
      flexDirection: "row",
      borderBottom: "2px solid black",
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: "1px solid black",
      borderColor: "gray",
    },
    tableCell: {
      paddingVertical: 7,
      paddingLeft: 7,
      fontSize: "7.5px",
      margin: -1,
      fontWeight: "extrabold",
    },
    headerCell: {
      paddingVertical: 10,
      paddingLeft: 7,
      margin: -1,
      fontFamily: "Helvetica-Bold",
      fontSize: "9.5px",
    },
    image: {
      minWidth: "150px",
      maxWidth: "160px",
      height: "80px",
    },
    header: {
      flexDirection: "row",
      marginBottom: 10,
      justifyContent: "space-between",
    },
  });

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const body = () => {
    const chunkSize = 200; // Optimization: Chunk data per page to avoid browser hang
    const chunks = [];
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
      }
    } else {
      chunks.push([]);
    }

    return (
      <Document title={reportName as string}>
        {chunks.map((chunk, chunkIndex) => (
          <Page key={chunkIndex} size={[842.89, 555.28]} style={styles2.page}>
            <View style={styles2.section}>
              {chunkIndex === 0 && (
                <View style={styles2.header}>
                  {userPersonalizationData !== null &&
                    userPersonalizationData?.loginPageLogo.url !== "" ? (
                    <Image
                      src={`${IMAGE_BASE_URL}/${userPersonalizationData?.loginPageLogo.url}`}
                      style={styles2.image}
                    />
                  ) : (
                    <Image src={BackgroundImage} style={styles2.image} />
                  )}
                  <View style={styles2.reportName}>
                    <View>
                      <Text style={styles2.titleName}>Report Name:</Text>
                    </View>
                    <View>
                      <Text style={styles2.titleText}>{reportName}</Text>
                    </View>
                  </View>
                  <View style={styles2.companyDetails}>
                    <View style={styles2.detailsRow}>
                      <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}> Name: &nbsp;</Text>
                      <Text style={{ fontSize: 8 }}>{userData?.fullName || "N/A"}</Text>
                    </View>
                    <View style={styles2.detailsRow}>
                      <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}> Generated On: &nbsp;</Text>
                      <Text style={{ fontSize: 8 }}>{new Date().toISOString().slice(0, 10)} {new Date().toLocaleTimeString()}</Text>
                    </View>
                    {registrationNo && (
                      <View style={styles2.detailsRow}>
                        <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}> Registration No: &nbsp;</Text>
                        <Text style={{ fontSize: 8 }}>{registrationNo}</Text>
                      </View>
                    )}
                    <View style={styles2.detailsRow}>
                      <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}> Email: &nbsp;</Text>
                      <Text style={{ fontSize: 8 }}>{userData?.emailAddress || "N/A"}</Text>
                    </View>
                    <View style={styles2.detailsRow}>
                      <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}> Phone: &nbsp;</Text>
                      <Text style={{ fontSize: 8 }}>{userData?.phoneNo || "N/A"}</Text>
                    </View>
                    <View style={{ marginTop: 5 }}>
                      <View style={styles2.detailsRow}>
                        <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>From: &nbsp;</Text>
                        <Text style={{ fontSize: 8 }}>{fromDate || "N/A"}</Text>
                      </View>
                      <View style={styles2.detailsRow}>
                        <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>To: &nbsp;</Text>
                        <Text style={{ fontSize: 8 }}>{toDate || "N/A"}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              <View style={styles2.tableContainer}>
                {/* Table Header */}
                <View style={styles2.tableRowForHeader} fixed>
                  {header?.map((item: any, hIndex: any) => (
                    <Text
                      style={[styles2.headerCell, { width: columnWidths[hIndex] }]}
                      key={hIndex}
                    >
                      {item.label}
                    </Text>
                  ))}
                </View>

                {/* Table Data */}
                {chunk.map((item: any, rIndex: any) => (
                  <View style={styles2.tableRow} key={rIndex}>
                    {header?.map((headerItem: any, headerIndex: number) => (
                      <Text
                        style={[
                          styles2.tableCell,
                          { width: columnWidths[headerIndex] },
                        ]}
                        key={headerIndex}
                      >
                        {item[headerItem.value] ?? "N/A"}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </Page>
        ))}
      </Document>
    );
  };

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
          <PDFViewer
            style={{ width: "100%", height: "750px" }}
            width="100%"
            height="100vh"
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
        .pdf-viewer::-webkit-scrollbar {
          display: none;
        }
        .pdf-viewer {
          scrollbar-width: none; 
        }
      `}</style>
    </div>
  );
};

export default ViewPDFModalForReports;
