import React, { useEffect, useState } from "react";
import { Col, Button, Modal, ModalBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import { H4 } from "../../../../../../../../../../../../AbstractElements";
import { getAll } from "../../../../../../../../../../../../Utilities/api";
import { GET_ALL_PRODUCTS_BY_TYPE, OLDEST_INVENTORY_ITEM } from "../../../../../../../../../../../../Utilities/api/apiEndpoints";

interface PropsTypes {
    isVisible: boolean;
    setIsVisible: any;
    type: string;
    deviceProduct?: any;
    setDeviceProduct?: any;
    simProduct?: any;
    setSimProduct?: any;
    sensorProduct?: any;
    setSensorProduct?: any;
    accessories?: any;
    setAccessories?: any;
    onAddSim?: any;
    onAddSensor?: any;
    onAddAccessory?: any

}

const SelectProductModel: React.FC<PropsTypes> = ({
    isVisible,
    setIsVisible = () => { },
    type,
    deviceProduct,
    setDeviceProduct,
    simProduct,
    setSimProduct,
    sensorProduct,
    setSensorProduct,
    accessories,
    setAccessories,
    onAddSim,
    onAddSensor,
    onAddAccessory

}) => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const { geofences, geofencesGroup } = useSelector(
        (state: any) => state.geofence
    );
    const [listProducts, setListProducts] = useState([]);

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const addToggle = () => {
        setIsVisible(!isVisible);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };


    const handleAddSim = (sim: any) => {
        onAddSim(sim);
        addToggle()
    };

    const handleAddSensor = (sensor: any) => {
        onAddSensor(sensor);
        addToggle()
    };

    const handleAddAccessory = (accessory: any) => {
        onAddAccessory(accessory);
        addToggle()
    };

    const fetchProductsByType = async (productType: string) => {

        const allProductsByTypeData: any = await getAll({
            url: `${GET_ALL_PRODUCTS_BY_TYPE}?productType=${productType}`,
        });

        if (allProductsByTypeData.success) {
            // console.log("allProductsByTypeData.data", allProductsByTypeData.data);
            const tempList: any = [];
            allProductsByTypeData.data.map((item: any, index: any) => {
                tempList.push({ value: `${item?._id}`, label: `${item?.name}`, productType: `${item.productType}`, });
            });
            setListProducts(tempList);
            setLoading(false);
        } else {
            setListProducts([]);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProductsByType(type);
    }, []);

    return (
        <Col md={6}>
            <div className="text-end">
                <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered >
                    <div className="modal-header">
                        <H4 className="modal-title">Select {type.toLowerCase()}</H4>
                        <Button
                            color="transprant"
                            className="btn-close"
                            onClick={addToggle}
                        ></Button>
                    </div>
                    <ModalBody style={{ overflow: "hidden", height: "450px" }}>

                        <div style={{ margin: "0px 10px" }}>
                            <p
                                style={{
                                    fontWeight: "bold",
                                    padding: "2px ",
                                    fontSize: "18px",
                                    margin: "0px",
                                }}
                            >
                                Search {type.toLowerCase()}
                            </p>
                            <Select
                                showSearch
                                style={{ width: "100%", height: 36, marginBottom: "10px" }}
                                placeholder={`Select ${type.toLowerCase()}`}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                onChange={async (value: any, options: any) => {
                                    if (type == "SIM") {
                                        handleAddSim({ id: value, simNumber: "", iccid: "", network: "" })
                                    }
                                    else if (type == "DEVICES") {
                                        console.log("value", value);

                                        setDeviceProduct({
                                            id: value,
                                            deviceIMEI: "",
                                            deviceType: "",
                                            deviceID: "",
                                            deviceId: "",
                                        })
                                        addToggle()
                                    } else if (type == "ACCESSORIES") {
                                        const singleInventoryitemData: any = await getAll({
                                            url: `${OLDEST_INVENTORY_ITEM}/${value}`,
                                        });

                                        if (singleInventoryitemData?.success) {
                                            console.log("OA ->", singleInventoryitemData?.data);
                                            handleAddAccessory({ id: singleInventoryitemData?.data._id, serialNumber: singleInventoryitemData?.data.serialNumber, sku: singleInventoryitemData?.data.sku })
                                            addToggle()
                                        }

                                    }
                                    else {
                                        handleAddSensor({ id: value, serialNumber: "", sku: "", type: "" })
                                    }
                                    // setDeviceProduct(value);
                                    // addToggle();
                                }}
                                options={listProducts}
                            // value={deviceProduct}
                            />
                        </div>


                    </ModalBody>
                </Modal>
            </div>

        </Col>
    );
};

export default SelectProductModel;
