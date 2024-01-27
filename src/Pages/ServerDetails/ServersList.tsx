import { Card, CardBody, Col, Container, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { citiesListHeading } from "../../utils/Constant";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../Alerts/DeleteAlert";
import {
  setCreateServer,
  setServersStart,
  setServers,
  setServersEnd,
  setFilterServers,
  setServer,
  setId,
} from "../../ReaduxToolkit/Reducer/ServerDetailsSlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import CommonModal from "../../CommonElements/Ui-kits/CommonModal";
import ChangePasswordModal from "./components/ChangePasswordModal";

const ServersList = () => {
  const { servers, loading, error, id } = useSelector(
    (state: any) => state.serverDetails
  );
  const navigate = useNavigate();
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  const ModalData = {
    isOpen: modal,
    class: "modal-dialog-centered",
    toggler: toggle,
    bodyClass: "social-profile text-start",
  };

  useEffect(() => {
    dispatch(setServersStart());
    getAll({ url: "server-management/get-all-servers" }).then((data: any) => {
      console.log("api call --- >", data);
      dispatch(setServersEnd());
      if (data !== undefined) {
        dispatch(setNoDataFound(data.message));
        if (data.success) {
          console.log("hhg");
          dispatch(setServers(data.data.allServers));
          dispatch(setFilterServers(data.data.allServers));
        }
      }
    });
  }, []);
  const renderTableRows = () => {
    return servers?.map((row: any) => (
      <tr key={row._id}>
        <td>{row._id}</td>
        <td>{row.companyName}</td>
        <td>{row.serviceProvider}</td>
        <td>{row.ipAddress}</td>
        <td>{row.url}</td>
        <td>{row.isActive ? "Active" : "inActive"}</td>
        <td>
          <div>
            <button
              style={{
                width: 60,
                fontSize: 14,
                padding: 3,
                color: "white",
                backgroundColor: "red",
                borderRadius: "5px",
                marginRight: "5px",
                border: "none",
              }}
              onClick={() => {
                console.log("345678");
                var alertData = {
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this ",
                };
                const type = "serverType";
                deleteAlert(alertData, row._id, type, dispatch);
              }}
            >
              Delete
            </button>
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
                dispatch(setServer(row));
                navigate(
                  `${process.env.PUBLIC_URL}/setup/server_details/updareServer`
                );
              }}
            >
              Edit
            </button>
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
                dispatch(setId(row._id));
                toggle();
              }}
            >
              Change Password
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonHeader title="All Servers" />
              <CardBody>
                <div className="table-responsive product-table">
                  {loading ? (
                    <Loader />
                  ) : servers?.length > 0 && loading === false ? (
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Company Name</th>
                            <th>Service Provider</th>
                            <th>IP Address</th>
                            <th>URL</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>{renderTableRows()}</tbody>
                      </table>
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "25px",
                        fontWeight: "bold",
                      }}
                    >
                      {noDataFound !== ""
                        ? "No Servers found"
                        : "Faild to Fetch"}
                    </div>
                  )}
                </div>

                <CommonModal modalData={ModalData}>
                  <ChangePasswordModal toggle={toggle} />
                </CommonModal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ServersList;
