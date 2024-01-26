import { Card, CardBody, Col, Container, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { citiesListHeading, provinceListHeading } from "../../utils/Constant";
import { useEffect, useState } from "react";
import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../Alerts/DeleteAlert";
import UpdatePackage from "./UpdatePackage";
import {
  setFilterPackages,
  setId,
  setPackages,
  setPackagesEnd,
  setPackagesStart,
  setAllPackagesDuration,
  setPackageDays,
  setPackageDuration,
  setPackage,
} from "../../ReaduxToolkit/Reducer/PackageSlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import Loader from "../Loader/Loader";

const PackageList = () => {
  const { packages, loading, error, id } = useSelector(
    (state: any) => state.packages
  );
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [packageTitle, setPackageTitle] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  // const [packageDuration, setPackageDuration] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    dispatch(setPackagesStart());
    getAll({ url: "package/get-all-packages" }).then((data: any) => {
      console.log("api call --- >", data);
      dispatch(setPackagesEnd());
      if (data !== undefined) {
        dispatch(setNoDataFound(data.message));
        if (data.success) {
          console.log("hhg");
          dispatch(setPackages(data.data));
          dispatch(setFilterPackages(data.data));
        } else {
          dispatch(setPackages([]));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: "package/get-package-duration-types" }).then((data: any) => {
      console.log("api call package duartion --- >", data);
      if (data !== undefined) {
        if (data.success) {
          console.log("hhg");
          dispatch(setAllPackagesDuration(data.data));
        }
      }
    });
  }, []);
  const renderTableRows = () => {
    return packages?.map((row: any) => (
      <tr key={row._id}>
        <td>{row._id}</td>
        <td>{row.title}</td>
        <td>{row.price}</td>
        <td>{row.days}</td>
        <td>{row.duration}</td>
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
                const type = "packageType";
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
                setPackageTitle(row.title);
                dispatch(setPackage(row));
                setPackagePrice(row.price);
                dispatch(setPackageDuration(row.duration));
                dispatch(setPackageDays(row.days));
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
              <CommonHeader title="All Packages" />
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
                  ) : packages?.length > 0 && loading === false ? (
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Days</th>
                            <th>Duration</th>
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
                      {noDataFound !== "" ? "No Packages Found" : "Faild to Fetch"}
                    </div>
                  )}
                </div>
                <UpdatePackage
                  isVisible={isUpdateModalOpen}
                  setIsVisible={setIsUpdateModalOpen}
                  id={id}
                  title={packageTitle}
                  price={packagePrice}
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

export default PackageList;
