import React from "react";
import { Select } from "antd";
interface propTypes {
  countries: any;
  placeholder: any;
}

const SelectBox: React.FC<propTypes> = ({
  countries,
  placeholder,
}) => (
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
        value: "Pakistan",
        label: "Pakistan",
      },
      {
        value: "UAE",
        label: "UAE",
      },
    ]}
  />
);

export default SelectBox;
