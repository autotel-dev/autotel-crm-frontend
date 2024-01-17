import { Card, CardBody, Col, Container, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { citiesListHeading } from "../../utils/Constant";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../Alerts/DeleteAlert";
import Loader from "../../Layout/Loader/Loader";

// import UpdateCountry from "./UpdateCountry";
import { log } from "console";
import {
  setCRMModules,
  setFilterCRMModules,
  setCRMModulesStart,
  setCRMModulesEnd,
  setId,
  setValue,
} from "../../ReaduxToolkit/Reducer/CRMModuleSlice";
import UpdateCRMModule from "./UpdateCRMModule";

const CRMModuleList = () => {
  const { crmModules, loading, error, id, value } = useSelector(
    (state: any) => state.crmModules
  );
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [iconClass, setIconClass] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    dispatch(setCRMModulesStart());
    getAll({ url: "crm-module/get-all-modules" }).then((data: any) => {
      console.log("api call --- >", data);
      dispatch(setCRMModulesEnd());
      if (data !== undefined) {
        if (data.success) {
          console.log("hhg");
          dispatch(setCRMModules(data.data));
          dispatch(setFilterCRMModules(data.data));
        }
      }
    });
    // .catch((error: any) => {
    //   console.log(error);
    // });
  }, []);
  const renderTableRows = () => {
    return crmModules?.map((row: any) => (
      <tr key={row.id}>
        <td>{row._id}</td>
        <td>{row.name}</td>
        <td>{row.icon}</td>
        <td>{row.route}</td>
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
                const type = "crmModuleType";
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
                setIsUpdateModalOpen(true);
                console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                dispatch(setId(row._id));
                setModuleName(row.name);
                setIconClass(row.icon);
                setIsActive(row.isActive);
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
        <Row>
          <Col sm="12">
            <Card>
              <CommonHeader title="All CRM Modules" />
              <CardBody>
                <div className="table-responsive product-table">
                  {loading ? (
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "25px",
                        fontWeight: "bold",
                      }}
                    >
                      Loading....
                    </div>
                  ) : // <Loader />
                  crmModules?.length > 0 && loading === false ? (
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Icon</th>
                            <th>Route</th>
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
                      No Modules Found
                    </div>
                  )}

                  {/* )} */}
                </div>
                <UpdateCRMModule
                  isVisible={isUpdateModalOpen}
                  setIsVisible={setIsUpdateModalOpen}
                  id={id}
                  value={moduleName}
                  icon={iconClass}
                  isActive={isActive}
                  setIsActive={setIsActive}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CRMModuleList;
