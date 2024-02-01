import { Card, CardBody, Col, Container, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { citiesListHeading, provinceListHeading } from "../../utils/Constant";
import { useEffect, useState } from "react";
import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../Alerts/DeleteAlert";
import UpdateProvince from "./UpdateProvince";
import {
  setCountries,
  setId,
  setProvinces,
  setProvincesEnd,
  setProvincesStart,
  setFilterProvinces,
  setCountryName,
} from "../../ReaduxToolkit/Reducer/ProvinceSlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import Loader from "../Loader/Loader";

const ProvinceList = () => {
  const { provinces, loading, error, id, value } = useSelector(
    (state: any) => state.provinces
  );
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [provinceName, setProvinceName] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    dispatch(setProvincesStart());
    getAll({ url: "province/get-all-provinces" }).then((data: any) => {
      console.log("api call --- >", data);
      dispatch(setProvincesEnd());
      if (data !== undefined) {
        dispatch(setNoDataFound(data.message));
        if (data.success) {
          console.log("hhg");
          dispatch(setProvinces(data.data));
          dispatch(setFilterProvinces(data.data));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: "country/get-all-active-countries" }).then((data: any) => {
      console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          console.log("hhg");
          dispatch(setCountries(data.data));
        }
      }
    });
  }, []);
  const renderTableRows = () => {
    return provinces.map((row: any) => (
      <tr key={row._id}>
        <td>{row._id}</td>
        <td>{row.name}</td>
        <td>{row.country.name}</td>
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
                const type = "provinceType";
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
                setProvinceName(row.name);
                dispatch(setCountryName(row.country.name));
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
              <CommonHeader title={provinceListHeading} />
              <CardBody>
                <div className="table-responsive product-table">
                  {loading ? (
                    // <div
                    //   style={{
                    //     textAlign: "center",
                    //     fontSize: "25px",
                    //     fontWeight: "bold",
                    //   }}
                    // >
                    //   Loading....
                    // </div>
                    <Loader />
                  ) : // <Loader />
                  provinces?.length > 0 && loading === false ? (
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Country</th>
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
                        ? "No Provinces found"
                        : "Faild to Fetch"}
                    </div>
                  )}
                </div>
                <UpdateProvince
                  isVisible={isUpdateModalOpen}
                  setIsVisible={setIsUpdateModalOpen}
                  id={id}
                  value={provinceName}
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

export default ProvinceList;
