import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCompany } from "../../../ReaduxToolkit/Reducer/CompanySlice";
interface propTypes {
  placeholder: any;
}

const SelectTimeZoneBox: React.FC<propTypes> = ({ placeholder }) => {
  const { cities, createCompany, timezones } = useSelector(
    (state: any) => state.companies
  );
  console.log(cities);
  const [cityId, setCityId] = useState("");
  const [timeZoneList, setTimeZoneList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    timezones.map((item: any, index: any) => {
      tempList.push({ value: `${item}`, label: `${item}` });
    });
    setTimeZoneList(tempList);
  }, [timezones]);
  return (
    <Select
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
        console.log(e);
        dispatch(
          setCreateCompany({
            ...createCompany,
            timezone: e,
          })
        );
      }}
      options={timeZoneList}
    />
  );
};

export default SelectTimeZoneBox;
