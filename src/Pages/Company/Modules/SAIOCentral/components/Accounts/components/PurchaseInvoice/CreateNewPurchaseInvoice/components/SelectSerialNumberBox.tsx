import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
    placeholder: any;
    setSerialNumber: any;
    serialNumber: string;
}

const SelectSerialNumberBox: React.FC<propTypes> = ({ placeholder, setSerialNumber, serialNumber }) => {
    const { serialNumbers } = useSelector(
        (state: any) => state.purchaseInvoice
    );
    const [serialNumberList, setSerialNumberList] = useState([]);
    const dispatch = useDispatch();

    const tempList: any = [];
    useEffect(() => {
        serialNumbers?.map((item: any, index: any) => {
            tempList.push({ value: `${item?._id}`, label: `${item?.value}` });
        });
        setSerialNumberList(tempList);
    }, [serialNumbers]);
    return (
        <Select
            value={serialNumber !== "" ? serialNumber : null}
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
                setSerialNumber(e);

            }}
            options={serialNumberList}
        />
    );
};

export default SelectSerialNumberBox;
