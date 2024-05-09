import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setPriorityStatus } from "../../../../../ReaduxToolkit/Reducer/SupportSlice";
interface PropTypes {
    priority: string,
    setPriority: any
    type: string,
    setType: any
}


const SelectComplainTypesList: React.FC<PropTypes> = ({ priority, setPriority, type, setType }) => {
    const { complainTypesList } = useSelector((state: any) => state.complainCenter);
    // console.log(priorityStatuses);
    const [temporaryComplainTypesList, setTemporaryComplainTypesList] = useState([]);
    const dispatch = useDispatch();

    const tempList: any = [];
    useEffect(() => {
        complainTypesList.map((item: any, index: any) => {
            tempList.push({ value: `${item._id}`, label: `${item.title}`, priority: `${item.priorty}` });
        });
        setTemporaryComplainTypesList(tempList);
    }, []);
    return (
        <Select
            showSearch
            style={{ width: "100%", height: 36 }}
            placeholder="Select Complain Type"
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
                setPriority(options.priority);
                setType(e);
            }}
            options={temporaryComplainTypesList}
        />
    );
};

export default SelectComplainTypesList;
