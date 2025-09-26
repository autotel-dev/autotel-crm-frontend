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
import { IMAGE_BASE_URL } from "../../../../../../Utilities/api/apiEndpoints";
import { useSelector } from "react-redux";

// Register local Helvetica fonts
Font.register({
  family: "Helvetica",
  fonts: [
    { src: require("../../../../../../assets/fonts/helvetica/Helvetica.ttf") }, // Regular
    {
      src: require("../../../../../../assets/fonts/helvetica/Helvetica-Bold.ttf"),
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
}

const ViewPDFModalForReports: React.FC<ViewPDFModalTypes> = ({
  modal,
  toggleModal,
  data,
  header,
  reportName,
}) => {
  const { userData } = useSelector((state: any) => state.user);

  // Function to calculate the max width of each column or distribute evenly
  const getColumnWidths = () => {
    const totalColumns = header?.length;
    if (data?.length === 0) {
      return Array(totalColumns).fill(100); // If no data, make each column equal width
    }
    const widths = header?.map((headerItem: any) => {
      let maxLength = headerItem.label.length; // Initialize with the label length
      // Check max length from data values for each column
      data?.forEach((item: any) => {
        const itemLength = String(item[headerItem.value] || "").length;
        if (itemLength > maxLength) {
          maxLength = itemLength;
        }
      });
      return maxLength * 7; // Multiply by a factor to ensure enough space for text (7px per character)
    });
    // If there is less data, distribute columns evenly across the page
    const totalWidth = widths?.reduce((sum: any, width: any) => sum + width, 0);
    if (totalWidth < 800) {
      return Array(totalColumns).fill(800 / totalColumns); // Distribute evenly if total width is too small
    }
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
      fontSize: 12,
      minWidth: "230px",
    },
    detailsRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingVertical: 3,
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

  const body = () => (
    <Document>
      <Page size={[842.89, 555.28]} style={styles2.page}>
        <View style={styles2.section}>
          <View style={styles2.header}>
            {/* <Image
              src={
                userPersonalizationData !== null &&
                userPersonalizationData?.loginPageLogo.url !== ""
                  ? `${IMAGE_BASE_URL}/${userPersonalizationData?.loginPageLogo.url}`
                  : BackgroundImage
              }
              style={styles2.image}
            /> */}
            {userPersonalizationData !== null &&
            userPersonalizationData?.loginPageLogo.url !== "" ? (
              <Image
                src={`${IMAGE_BASE_URL}/${userPersonalizationData?.loginPageLogo.url}`}
                style={styles2.image}
              />
            ) : (
              <View style={styles2.image}></View>
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
                <Text style={styles2.titleName}> Name: &nbsp;</Text>
                <Text style={styles2.titleName}>
                  {userData.fullName}
                  {userPersonalizationData?.user?.emailAddress}
                </Text>
              </View>
              <View style={styles2.detailsRow}>
                <Text style={styles2.titleName}> Email: &nbsp;</Text>
                <Text style={styles2.titleName}>
                  {userData.emailAddress}
                  {userPersonalizationData?.user?.emailAddress}
                </Text>
              </View>
              {/* <View style={styles2.detailsRow}>
                <Text style={styles2.titleName}> Address: &nbsp;</Text>
                <Text style={styles2.titleName}>
                  abc address
                  {userPersonalizationData?.user?.emailAddress}
                </Text>
              </View> */}
              <View style={styles2.detailsRow}>
                <Text style={styles2.titleName}> Phone: &nbsp;</Text>
                <Text style={styles2.titleName}>
                  {userData.phoneNo}
                  {userPersonalizationData?.user?.emailAddress}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles2.text}></Text>
          <br />

          <br />
          <View style={styles2.tableContainer}>
            {/* Table Header */}
            <View style={styles2.tableRowForHeader}>
              {header &&
                Array.isArray(header) &&
                header?.map((item: any, index: any) => (
                  <Text
                    style={[styles2.headerCell, { width: columnWidths[index] }]}
                    key={index}
                  >
                    {item.label}
                  </Text>
                ))}
            </View>

            {/* Table Data */}
            {data?.map((item: any, index: any) => (
              <View style={styles2.tableRow} key={index}>
                {header?.map((headerItem: any, headerIndex: number) => {
                  const value = item[headerItem.value];
                  return (
                    <Text
                      style={[
                        styles2.tableCell,
                        { width: columnWidths[headerIndex] },
                      ]}
                      key={headerIndex}
                    >
                      {value || "N/A"}
                    </Text>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

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
