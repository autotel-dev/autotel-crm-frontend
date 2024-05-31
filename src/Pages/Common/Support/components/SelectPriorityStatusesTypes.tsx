import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setPriorityStatus } from "../../../../ReaduxToolkit/Reducer/SupportSlice";
interface propTypes {
  placeholder: any;
}

const SelectPriorityStatusesTypes: React.FC<propTypes> = ({ placeholder }) => {
  const { priorityStatuses } = useSelector((state: any) => state.support);
  // console.log(priorityStatuses);
  const [priorityStatusesList, setPriorityStatusesList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    priorityStatuses.map((item: any, index: any) => {
      tempList.push({ value: `${item.value}`, label: `${item.title}` });
    });
    setPriorityStatusesList(tempList);
  }, []);
  return (
    <Select
      showSearch
      style={{ width: 200, height: 36 }}
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
        dispatch(setPriorityStatus(e));
      }}
      options={priorityStatusesList}
    />
  );
};

export default SelectPriorityStatusesTypes;
