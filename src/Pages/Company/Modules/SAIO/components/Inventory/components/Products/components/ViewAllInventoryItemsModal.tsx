import { PlusCircle } from "react-feather";
import { Col, Table } from "reactstrap";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { CheckCircle } from "react-feather";
import { H3, H4, P } from "../../../../../../../../../AbstractElements";
import { Select } from "antd"; // Use your custom Select component
import { create, getAll } from "../../../../../../../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import { Cancel } from "../../../../../../../../../utils/Constant";
import {
    setProduct,
    setProductEnd,
    setProductStart,
    setFilterProduct,
    setInActiveActiveProduct
} from "../../../../../../../../../ReaduxToolkit/Reducer/InventoryProductSlice";
import Swal from "sweetalert2";
import {
    CREATE_PRODUCT,
    GET_ALL_INVENTORY_ITEMS_OF_SINGLE_PRODUCT,
    GET_ALL_PRODUCTS,
} from "../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../Utilities/constants/constants";
import { ProductType } from "../Type/ProductType";

interface ViewAllInventoryItemsModalProps {
    isVisible: boolean;
    setIsVisible: any;
    product: any
}

const ViewAllInventoryItemsModal: React.FC<ViewAllInventoryItemsModalProps> = ({
    isVisible,
    setIsVisible,
    product
}) => {


    const [loading, setLoading] = useState(true);
    const [inventories, setInventories] = useState([])

    const addToggle = () => {
        if (!loading) {
            setIsVisible(!isVisible);
        }
    };

    useEffect(() => {

        getAll({ url: `${GET_ALL_INVENTORY_ITEMS_OF_SINGLE_PRODUCT}/${product.id}` }).then((data: any) => {
            if (data !== undefined) {
                if (!data.success) {
                    Swal.fire({
                        text: `${data.message}`,
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    setLoading(false)
                }
                if (data.success) {

                    setInventories(data.data);
                    setLoading(false)
                }
            }
        });
    }, []);

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
                <Table className="display order-wrapper" id="recent-order">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>{product?.productType == "DEVICES" ?  "Imei Numbers" : product?.productType == "SIM" ? "Sim Numbers" : product?.productType == "SENSORS" ? "Serial Numbers": "ID"}</th>
                            <th>Sku</th>
                            <th>Available</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventories.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ fontSize: "25px" }}>
                                    {loading ? "Loading..." : "No inventories Found"}
                                </td>
                            </tr>
                        ) : (
                            inventories.map((data: any, index: any) => (
                                <tr style={{ cursor: "pointer" }} key={index}>
                                    <td>
                                        {index + 1}
                                    </td>
                                    <td>
                                        {data.serialNumber}
                                    </td>
                                    <td>
                                        {data.sku}
                                    </td>
                                    <td>
                                        {data.availability ? "Yes" : "No"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </ModalBody>
        </Modal>
    );
};

export default ViewAllInventoryItemsModal;
