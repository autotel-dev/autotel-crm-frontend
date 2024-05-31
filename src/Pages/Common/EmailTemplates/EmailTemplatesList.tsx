import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import { citiesListHeading } from "../../../utils/Constant";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { getAll } from "../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import "./tableStyle.css";

import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import UpdateEmailTemplate from "./UpdateEmailTemplate";
import Loader from "../../Utilities/Loader/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import H7 from "../../../CommonElements/Headings/H7Element";
import { setEmailTemplates, setEmailTemplatesEnd, setEmailTemplatesStart, setFilterEmailTemplates, setIsConnected } from '../../../ReaduxToolkit/Reducer/EmailTemplateSlice';
import { formatUnderscoredString } from "../../../Utilities/globals/globals";

const EmailTemplatesList = () => {
  const { emailTemplates, loading } = useSelector(
    (state: any) => state.emailTemplate
  );
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setEmailTemplates([]));
    dispatch(setFilterEmailTemplates([]));
    dispatch(setEmailTemplatesStart());
    getAll({ url: "template/email-template/get-all-templates" }).then(
      (data: any) => {
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
          if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
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
            dispatch(setEmailTemplates(data.data));
            dispatch(setFilterEmailTemplates(data.data));
          }
        }
      }
    );
  }, []);

  const [id, setId] = useState("");
  const [type, setType] = useState("")
  const [shareOption, setShareOption] = useState(false);
  const [subject, setSubject] = useState("");
  const [templateContent, setTemplateContent] = useState("");

  const renderTableRows = () => {
    return emailTemplates?.map((row: any) => (
      <tr key={row.id}>
        <td>{row._id}</td>
        <td>{row.subject}</td>
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
                setType(row.type)
                setShareOption(row.isShared)
                setSubject(row.subject);
                setTemplateContent(row.content);
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
                  <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                  <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                  <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                  <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                </>
                ) : emailTemplates?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Subject</th>
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
                  <H7>
                    No Templates Found

                  </H7>
                )}

                {/* )} */}
              </div>
              <UpdateEmailTemplate
                isVisible={isUpdateModalOpen}
                setIsVisible={setIsUpdateModalOpen}
                id={id}
                subject={subject}
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
