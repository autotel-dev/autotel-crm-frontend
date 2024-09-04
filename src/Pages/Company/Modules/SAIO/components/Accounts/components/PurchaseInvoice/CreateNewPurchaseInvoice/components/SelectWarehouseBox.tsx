import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
    placeholder: any;
    setWarehouse: any;
    warehouse: string;
}

const SelectWarehouseBox: React.FC<propTypes> = ({ placeholder, setWarehouse, warehouse }) => {
    const { warehouses } = useSelector(
        (state: any) => state.purchaseInvoice
    );
    const [warehousesList, setWarehousesList] = useState([]);
    const dispatch = useDispatch();

    const tempList: any = [];
    useEffect(() => {
        warehouses?.map((item: any, index: any) => {
            tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
        });
        setWarehousesList(tempList);
    }, [warehouses]);
    return (
        <Select
            value={warehouse !== "" ? warehouse : null}
            showSearch
            style={{ width: "100%", height: 36 }}
            placeholder={placeholder}
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
                (option?.label ?? "").includes(input)
            }
            filterSort={(optionA: any, optionB: any) =>
                (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            onChange={(e) => {
                // console.log(e);
                setWarehouse(e);

            }}
            options={warehousesList}


        />
    );
};

export default SelectWarehouseBox;
