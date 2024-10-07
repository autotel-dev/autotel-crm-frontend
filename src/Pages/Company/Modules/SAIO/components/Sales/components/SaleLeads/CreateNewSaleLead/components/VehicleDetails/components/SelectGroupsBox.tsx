import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  group: string;
  setGroup: any;
  disabled: boolean;
}

const SelectGroupsBox: React.FC<propTypes> = ({ placeholder, group, setGroup,disabled }) => {
  const { groups } = useSelector(
    (state: any) => state.sales
  );

  const [groupsList, setGroupsList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    groups?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setGroupsList(tempList);
  }, [groups]);
  return (
    <Select
    value={group !== "" ? group : null}
      showSearch
      style={{ width: "100%", height: 36 }}
      placeholder={placeholder}
      optionFilterProp="children"
      filterOption={(input: any, option: any) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      filterSort={(optionA: any, optionB: any) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
      }
      onChange={(e) => {
        setGroup(e)
      }}
      options={groupsList}
      disabled={disabled}
    />
  );
};

export default SelectGroupsBox;
