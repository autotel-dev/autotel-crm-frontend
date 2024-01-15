import React, { useEffect } from "react";
import { Select } from "antd";
interface propTypes {
  list: any[];
  placeholder: any;
}

const SelectBox: React.FC<propTypes> = ({ list, placeholder }) => {
  console.log(list);

  return (
    <Select
      // showSearch
      style={{ width: 200 }}
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
      onChange={(e) => console.log(e)}
      options={[
        {
          value: "1",
          label: "Not Identified",
        },
        {
          value: "2",
          label: "Closed",
        },
        {
          value: "3",
          label: "Communicated",
        },
      ]}
    />
  );
};

export default SelectBox;
