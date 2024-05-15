import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setPriorityStatus } from "../../../../../ReaduxToolkit/Reducer/SupportSlice";
interface PropTypes {
    priority: any,
    status: string,
    setStatus: any,
}


const SelectComplainStatusTypes: React.FC<PropTypes> = ({ priority, status, setStatus }) => {
    const { complainStatusTypes } = useSelector((state: any) => state.complainCenter);
    // console.log(priorityStatuses);
    const [complainStatusTypesList, setComplainStatusTypesList] = useState([]);
    const dispatch = useDispatch();

    const tempList: any = [];
    useEffect(() => {
        complainStatusTypes.map((item: any, index: any) => {
            tempList.push({ value: `${item.value}`, label: `${item.title}` });
        });
        setComplainStatusTypesList(tempList);
    }, []);
    return (
        <Select
            value={priority == "GENERAL" ? "RESOLVED" : "NEW"}
            disabled={true}
            showSearch
            style={{ width: "100%", height: 36 }}
            placeholder="Select Complain Status Type"
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
                (option?.label ?? "").includes(input)
            }
            filterSort={(optionA: any, optionB: any) =>
                (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            onChange={(e, options) => {
                setStatus(e);
            }}
            options={complainStatusTypesList}
        />
    );
};

export default SelectComplainStatusTypes;
