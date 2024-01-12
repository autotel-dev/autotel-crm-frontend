import { Card, CardBody, Col, Container, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import {
  productTableColumns,
  productTableData,
} from "../../Data/Apps/Ecommerce/ProductListData";
import { crmModuleListHeading } from "../../utils/Constant";
import DataTable from "react-data-table-component";
import {
  crmModuleTableColumns,
  crmModuleTableData,
} from "./CRMModuleData/CRmModuleData";

const CRMModuleList = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonHeader title={crmModuleListHeading} />
              <CardBody>
                <div className="table-responsive product-table">
                  <DataTable
                    data={crmModuleTableData}
                    columns={crmModuleTableColumns}
                    className="display dataTable no-footer"
                    dense={true}
                    noHeader
                    pagination
                    paginationServer
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CRMModuleList;
