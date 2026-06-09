import { Card, CardBody, Col, Container } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import { useEffect, useState } from "react";
import { getAll } from "../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import "../../../CssConstaints/Style.css";
import deleteAlert from "../../../Utilities/alerts/DeleteAlert";
import { setCustomers, setCustomer } from "../../../ReaduxToolkit/Reducer/SalesSlice";
import Swal from "sweetalert2";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import { GET_ALL_CUSTOMERS } from "../../../Utilities/api/apiEndpoints";
import { Modal, ModalBody } from "reactstrap";
import CreateNewCustomer from "../Modules/SAIO/components/Sales/components/Customer/CreateNewCustomer/CreateNewCustomer";
import H7 from "../../../CommonElements/Headings/H7Element";

const CustomersList = () => {
  const { customers } = useSelector((state: any) => state.sales);
  const { userPersonalizationData } = useSelector((state: any) => state.personalization);
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");

  function hexToRgb(hex: any) {
    if (!hex) return { r: 255, g: 255, b: 255 };
    hex = hex.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }
  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor);

  useEffect(() => {
    setLoading(true);
    getAll({ url: GET_ALL_CUSTOMERS }).then((data: any) => {
      setLoading(false);
      if (data && data.success) {
        dispatch(setCustomers(data.data));
      } else {
        dispatch(setCustomers([]));
      }
    });
  }, [dispatch]);

  const renderTableRows = () => {
    return customers?.map((row: any) => (
      <tr
        key={row._id}
        onMouseEnter={() => {
          setIsHovered(true);
          setIdd(row._id);
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor:
            isHovered && idd === row._id
              ? userPersonalizationData == null
                ? "#D6EEEE"
                : `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`
              : "transparent",
          transition: "background-color 0.3s",
        }}
      >
        <td>{row.fullName}</td>
        <td>{row.phoneNo}</td>
        <td>{row.cnic}</td>
        <td>{row.city?.name || "-"}</td>
        <td>
          <div>
            <button
              className="global-table-edit-btn"
              onClick={() => {
                dispatch(setCustomer(row));
                setIsUpdateModalOpen(true);
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
            <CommonHeader title="All Customers" />
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  <>
                    <Skeleton height="100px" width="100%" borderRadius="10px" />
                    <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                    <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                  </>
                ) : customers?.length > 0 ? (
                  <div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>CNIC</th>
                          <th>City</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>{renderTableRows()}</tbody>
                    </table>
                  </div>
                ) : (
                  <H7>No Customer Found</H7>
                )}
              </div>
              <Modal isOpen={isUpdateModalOpen} toggle={() => setIsUpdateModalOpen(false)} size="xl" centered>
                <div style={{ background: "#f8f9fa", padding: "15px", borderBottom: "1px solid #dee2e6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0 }}>Edit Customer</h4>
                  <button onClick={() => setIsUpdateModalOpen(false)} style={{ background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
                </div>
                <ModalBody style={{ padding: "10px", maxHeight: "80vh", overflowY: "auto", overflowX: "hidden" }}>
                  <CreateNewCustomer isModal={true} onClose={() => setIsUpdateModalOpen(false)} />
                </ModalBody>
              </Modal>
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default CustomersList;
