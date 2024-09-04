import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
    placeholder: any;
    setBranch: any;
    branch: string;
}

const SelectBranchBox: React.FC<propTypes> = ({ placeholder, setBranch, branch }) => {
    const { branches } = useSelector(
        (state: any) => state.purchaseInvoice
    );
    const [bracnhesList, setBranchesList] = useState([]);
    const dispatch = useDispatch();

    const tempList: any = [];
    useEffect(() => {
        branches?.map((item: any, index: any) => {
            tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
        });
        setBranchesList(tempList);
    }, [branches]);
    return (
        <Select
            value={branch !== "" ? branch : null}
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
                setBranch(e);

            }}
            options={bracnhesList}

        />
    );
};

export default SelectBranchBox;
