import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
    placeholder: any;
    deviceId: string;
    setDeviceId: any;
    disabled: boolean;
}

const SelectDeviceIdBox: React.FC<propTypes> = ({ placeholder, deviceId, setDeviceId, disabled }) => {
    const { banks } = useSelector(
        (state: any) => state.sales
    );
    const [banksList, setBanksList] = useState([]);
    const dispatch = useDispatch();

    const tempList: any = [];
    useEffect(() => {
        banks?.map((item: any, index: any) => {
            tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
        });
        setBanksList(tempList);
    }, [banks]);
    return (
        <Select
            value={deviceId !== "" ? deviceId : null}
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
                setDeviceId(e)
            }}
            options={banksList}
            disabled={disabled}
        />
    );
};

export default SelectDeviceIdBox;
