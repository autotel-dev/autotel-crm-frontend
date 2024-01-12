import { Card, CardBody, Col, Container, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { packageListHeading } from "../../utils/Constant";
import DataTable from "react-data-table-component";
import { packageTableColumns } from "./PackageData/PackageData";
import { useEffect, useState } from "react";
import UpdatePackage from "./UpdatePackage";
import deleteAlert from "../Alerts/DeleteAlert";
// import DeletePackage from "./DeletePackage";

const PackageList = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [list, setList] = useState([1, 2, 3, 4, 5]);
  const [packageList, setPackageList]: any = useState([]);
  useEffect(() => {
    setPackageList([]);
    list.map((item) => {
      const ele = {
        id: `${item}`,
        title: "Package 1",
        price: 300000,
        duration: "MONTHLY",
        isActive: "active",
        action: (
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
                // setIsDeleteModalOpen(true);
                var alertData = {
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this ",
                };
                // setIsDeleteModalOpen(true);
                // deleteAlert(alertData);
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
                console.log("345678");
                setIsUpdateModalOpen(true);
              }}
            >
              Edit
            </button>
          </div>
        ),
      };
      packageList.push(ele);
      setPackageList(packageList);
    });
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonHeader title={packageListHeading} />
              <CardBody>
                <div className="table-responsive product-table">
                  <DataTable
                    // data={citiesTableData}
                    data={packageList}
                    columns={packageTableColumns}
                    className="display dataTable no-footer"
                    dense={true}
                    noHeader
                    pagination
                    paginationServer
                  />
                </div>
                <UpdatePackage
                  isVisible={isUpdateModalOpen}
                  setIsVisible={setIsUpdateModalOpen}
                />
                {/* <DeletePackage
                  isVisible={isDeleteModalOpen}
                  setIsVisible={setIsDeleteModalOpen}
                /> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PackageList;
