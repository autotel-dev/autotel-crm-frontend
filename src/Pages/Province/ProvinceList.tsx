import { Card, CardBody, Col, Container, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { provinceListHeading } from "../../utils/Constant";
import DataTable from "react-data-table-component";
import {
  provinceTableColumns,
  provinceTableData,
} from "./ProvinceData/ProvinceData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import GetData from "./GetList";
import UpdateProvince from "./UpdateProvince";

const ProvinceList = () => {
  const { provinces, loading, error } = useSelector(
    (state: any) => state.provinces
  );
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  var [provinceList, setProvinceList]: any = useState([]);

  useEffect(() => {
    GetData(
      provinces,
      dispatch,
      provinceList,
      setProvinceList,
      setIsUpdateModalOpen,
      isUpdateModalOpen
    );
  }, []);
  return (
    <>
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonHeader title={provinceListHeading} />
              <CardBody>
                <div className="table-responsive product-table">
                  <DataTable
                    data={provinces}
                    columns={provinceTableColumns}
                    className="display dataTable no-footer"
                    dense={true}
                    noHeader
                    pagination
                    paginationServer
                  />
                </div>
                <UpdateProvince
                  isVisible={isUpdateModalOpen}
                  setIsVisible={setIsUpdateModalOpen}
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
