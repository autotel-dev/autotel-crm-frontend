import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";

interface PropTypes {
    priority: string,
    setPriority: any
}


const SelectPriorityBox: React.FC<PropTypes> = ({
    priority,
    setPriority
}) => {
    const { setComplainTypePriorities } = useSelector(
        (state: any) => state.complainTypes
    );
    // console.log(countries);
    const [priorityList, setPriorityList] = useState([]);
    const dispatch = useDispatch();


    const tempList: any = [];
    useEffect(() => {
        setComplainTypePriorities.map((item: any, index: any) => {
            tempList.push({ value: `${item.value}`, label: `${item.title}` });
        });
        setPriorityList(tempList);
    }, []);
    return (
        <Select
            showSearch
            style={{ width: 200, height: 36 }}
            placeholder="Select Priority"
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
                setPriority(e);
            }}
            options={priorityList}
        />
    );
};

export default SelectPriorityBox;
