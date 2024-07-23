import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setPriorityStatus } from "../../../../../ReaduxToolkit/Reducer/SupportSlice";
import { getUserRole, getUserRoleID } from "../../../../../Api/globals";
import { ROLES } from "../../../../../constants/roles";
interface PropTypes {
    priority: any,
    role: string,
    setRole: any
}


const SelectComplainRole: React.FC<PropTypes> = ({ priority, role, setRole }) => {
    const { complainRoleSelection } = useSelector((state: any) => state.complainCenter);

    const [complainRoleList, setComplainRoleList] = useState([]);
    const dispatch = useDispatch();

    const tempList: any = [];
    useEffect(() => {
        complainRoleSelection.map((item: any, index: any) => {
            tempList.push({ value: `${item._id}`, label: `${item.name}` });
        });
        setComplainRoleList(tempList);
    }, []);
    return (
        <Select
            value={getUserRole() == ROLES.OPERATOR ? getUserRoleID() : role}
            disabled={getUserRole() == ROLES.OPERATOR}
            showSearch
            style={{ width: "100%", height: 36 }}
            placeholder="Select Role"
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
                setRole(e);
            }}
            options={complainRoleList}
        />
    );
};

export default SelectComplainRole;
