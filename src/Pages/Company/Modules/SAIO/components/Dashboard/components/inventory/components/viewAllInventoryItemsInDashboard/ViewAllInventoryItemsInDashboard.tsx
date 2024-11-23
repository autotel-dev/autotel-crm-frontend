import { Col, Row, Table } from "reactstrap";
import { useState, useEffect } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import Swal from "sweetalert2";
import { GET_ALL_INVENTORY_ITEMS_OF_SINGLE_PRODUCT } from "../../../../../../../../../../Utilities/api/apiEndpoints";
import { H4 } from "../../../../../../../../../../AbstractElements";
import { getAll } from "../../../../../../../../../../Utilities/api";
interface ViewAllInventoryItemsInDashboardModalProps {
  isVisible: boolean;
  setIsVisible: any;
  product: any;
}

const ViewAllInventoryItemsInDashboardModal: React.FC<
  ViewAllInventoryItemsInDashboardModalProps
> = ({ isVisible, setIsVisible, product }) => {
  const [loading, setLoading] = useState(true);
  const [inventories, setInventories]: any = useState([]);
  const [data, setData]: any = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
    }
  };

  useEffect(() => {
    getAll({
      url: `${GET_ALL_INVENTORY_ITEMS_OF_SINGLE_PRODUCT}/${product.productId}`,
    }).then((data: any) => {
      if (data !== undefined) {
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
        }
        if (data.success) {
          setInventories(data.data);
          setLoading(false);
        }
      }
    });
  }, []);

  const inventoryData = () => {
    return inventories
      ?.filter(
        (item: any) => item?.serialNumber.toLowerCase().includes(searchValue)
        //  ||
        //   item?.sku.toLowerCase().includes(searchValue)
      )
      .map((item: any) => {
        return { ...item }; // Ensure you're returning the item with spread operator
      });
  };

  useEffect(() => {
    setData(inventoryData());
  }, [inventories]);

  useEffect(() => {
    setData(inventoryData());
  }, [searchValue]);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  return (
    <Modal isOpen={isVisible} toggle={addToggle} size="xl" centered>
      <div className="modal-header">
        <H4 className="modal-title">{product?.name} Inventories</H4>
        <Button
          color="transparent"
          className="btn-close"
          onClick={addToggle}
        ></Button>
      </div>
      <ModalBody>
        <Row style={{ display: "flex", alignItems: "center" }}>
          <Col sm={12} md={12} lg={12} xl={12}>
            <input
              className="global-search-field"
              type="text"
              placeholder="Type to Search.."
              value={searchValue}
              onChange={(e) => {
                handleSearch(e);
              }}
            />
          </Col>
        </Row>
        <Table className="display order-wrapper" id="recent-order">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>
                {product?.productType == "DEVICES"
                  ? "Imei Numbers"
                  : product?.productType == "SIM"
                  ? "Sim Numbers"
                  : product?.productType == "SENSORS"
                  ? "Serial Numbers"
                  : "ID"}
              </th>
              <th>Sku</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ fontSize: "25px" }}>
                  {loading ? "Loading..." : "No inventories Found"}
                </td>
              </tr>
            ) : (
              data.map((data: any, index: any) => (
                <tr style={{ cursor: "pointer" }} key={index}>
                  <td>{index + 1}</td>
                  <td>{data.serialNumber}</td>
                  <td>{data.sku}</td>
                  <td>{data.availability ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
};

export default ViewAllInventoryItemsInDashboardModal;
