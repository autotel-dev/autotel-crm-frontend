import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setPriorityStatus } from "../../../../../ReaduxToolkit/Reducer/SupportSlice";
import { setNRReport } from "../../../../../ReaduxToolkit/Reducer/NRSlice";
interface propTypes {
    placeholder: any;
    hour: any;
    selectedHour: any;
}

const SelectFilterHoursTypes: React.FC<propTypes> = ({
    placeholder,
    hour,
    selectedHour,

}) => {
    const { report } = useSelector((state: any) => state.nrReport)
    const dispatch = useDispatch();
    return (
        <Select
            disabled={report.length > 0}
            value={hour !== "" ? hour : null}
            showSearch
            style={{ width: "50%", height: 36 }}
            placeholder={placeholder}
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
                (option?.label ?? "").includes(input)
            }
            onChange={(e) => {
                selectedHour(e)
            }}
            options={[
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
                { label: "6", value: "6" },
                { label: "7", value: "7" },
                { label: "8", value: "8" },
                { label: "9", value: "9" },
                { label: "10", value: "10" },
                { label: "11", value: "11" },
                { label: "12", value: "12" },
                { label: "13", value: "13" },
                { label: "14", value: "14" },
                { label: "15", value: "15" },
                { label: "16", value: "16" },
                { label: "17", value: "17" },
                { label: "18", value: "18" },
                { label: "19", value: "19" },
                { label: "20", value: "20" },
                { label: "21", value: "21" },
                { label: "22", value: "22" },
                { label: "23", value: "23" },
                { label: "24", value: "24" }
            ]
            }
        />
    );
};

export default SelectFilterHoursTypes;
