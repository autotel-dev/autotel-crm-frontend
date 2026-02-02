import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import { citiesListHeading } from "../../../utils/Constant";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { getAll } from "../../../Utilities/api";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";

import Loader from "../../Utilities/Loader/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import H7 from "../../../CommonElements/Headings/H7Element";
import UpdateWhatsAppTemplate from "./UpdateWhatsAppTemplate";
import { formatUnderscoredString } from "../../../Utilities/globals/globals";
import {
  setFilterWhatsAppTemplates,
  setIsConnected,
  setWhatsAppTemplates,
  setWhatsAppTemplatesEnd,
  setWhatsAppTemplatesStart,
} from "../../../ReaduxToolkit/Reducer/WhatsAppTemplateSlice";
import { GET_WHATSAPP_TEMPLATES } from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

const EmailTemplatesList = () => {
  const { whatsAppTemplates, loading } = useSelector(
    (state: any) => state.whatsAppTemplate,
  );
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const navigate = useNavigate();

  function markdownToHtml(text: any) {
    // Split the text by two or more \n to handle paragraphs
    const paragraphs = text.split(/\n{2,}/);
    // console.log(paragraphs);

    // Process each paragraph to replace markdown-like syntax with HTML tags
    const processedParagraphs = paragraphs.map((paragraph: any) => {
      return paragraph
        .replace(/\*\{\{(.*?)\}\}\*/g, "<strong>{{$1}}</strong>") // Replace *{{var}}* with <strong><em>{{var}}</em></strong>
        .replace(/\*_(.*?)_\*/g, "<strong><em>$1</em></strong>"); // Replace *_var_* with <strong>{{var}}</strong>
    });
    // console.log(processedParagraphs);

    // Join the processed paragraphs with <p> tags
    const html = processedParagraphs
      .map((p: any, index: any) => {
        if (p.trim() === "") {
          return "<p><br></p>"; // Handle blank paragraphs
        }
        return `<p>${p.trim()}</p>`;
      })
      .join("");
    // console.log(html);
    return html;
  }
  useEffect(() => {
    dispatch(setWhatsAppTemplates([]));
    dispatch(setFilterWhatsAppTemplates([]));
    dispatch(setWhatsAppTemplatesStart());
    getAll({ url: GET_WHATSAPP_TEMPLATES }).then((data: any) => {
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
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setIsConnected(true));
        }
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          // console.log("hhg");
          dispatch(setWhatsAppTemplates(data.data));
          dispatch(setFilterWhatsAppTemplates(data.data));
        }
      }
    });
  }, []);

  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const [shareOption, setShareOption] = useState(false);
  const [subject, setSubject] = useState("");
  const [templateContent, setTemplateContent] = useState("");

  const renderTableRows = () => {
    return whatsAppTemplates?.map((row: any) => (
      <tr key={row.id}>
        <td>{row._id}</td>
        <td>{formatUnderscoredString(row.type)}</td>
        <td>
          <div>
            <button
              style={{
                width: 60,
                fontSize: 14,
                padding: 3,
                color: "white",
                backgroundColor: "green",
                borderRadius: "5px",
                border: "none",
              }}
              onClick={() => {
                setIsUpdateModalOpen(true);
                setId(row._id);
                setType(row.type);
                setShareOption(row.isShared);
                setTemplateContent(markdownToHtml(row.content));
              }}
            >
              Edit
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Container fluid>
        <Col sm="12">
          <Card>
            <CommonHeader title="All Templates" />
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  // <Loader />
                  <>
                    <Skeleton height="100px" width="100%" borderRadius="10px" />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </>
                ) : whatsAppTemplates?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Type</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>{renderTableRows()}</tbody>
                    </table>
                  </div>
                ) : (
                  // <div
                  //   style={{
                  //     textAlign: "center",
                  //     fontSize: "25px",
                  //     fontWeight: "bold",
                  //   }}
                  // >
                  // {activeInActiveCountries !== "All"
                  //   ? activeInActiveCountries
                  //   : "No Counties Found"}
                  // </div>
                  <H7>No Templates Found</H7>
                )}

                {/* )} */}
              </div>
              <UpdateWhatsAppTemplate
                isVisible={isUpdateModalOpen}
                setIsVisible={setIsUpdateModalOpen}
                id={id}
                templateContent={templateContent}
                type={type}
                shareOption={shareOption}
                setType={setType}
                setShareOption={setShareOption}
                setTemplateContent={setTemplateContent}

                // setValue={setCityName}
              />
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default EmailTemplatesList;
