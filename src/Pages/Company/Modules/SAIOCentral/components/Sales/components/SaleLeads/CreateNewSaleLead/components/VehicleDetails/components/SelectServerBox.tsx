
import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
    placeholder: any;
    server: string;
    setServer: any;
    disabled: boolean;
}

const SelectServersBox: React.FC<propTypes> = ({ placeholder, server, setServer, disabled }) => {
    const { servers } = useSelector(
        (state: any) => state.sales
    );
    const [serversList, serServersList] = useState([]);
    const dispatch = useDispatch();

    const tempList: any = [];
    useEffect(() => {
        servers?.map((item: any, index: any) => {
            tempList.push({ value: `${item?.server?._id}`, label: `${item?.server?.companyName}` });
        });
        serServersList(tempList);
    }, [servers]);
    return (
        <Select
            value={server !== "" ? server : null}
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
                setServer(e)
            }}
            options={serversList}
            disabled={disabled}
        />
    );
};

export default SelectServersBox;

