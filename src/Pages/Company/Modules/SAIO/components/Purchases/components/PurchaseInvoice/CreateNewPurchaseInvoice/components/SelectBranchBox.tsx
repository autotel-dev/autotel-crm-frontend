import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  setBranch: any;
  branch: string;
  disabled: any;
}

const SelectBranchBox: React.FC<propTypes> = ({
  placeholder,
  setBranch,
  branch,
  disabled,
}) => {
  const { branches } = useSelector((state: any) => state.purchaseInvoice);
  const [bracnhesList, setBranchesList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    branches?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setBranchesList(tempList);
  }, [branches]);
  return (
    <Select
      disabled={disabled}
      value={branch !== "" ? branch : null}
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
        // // console.log(e);
        setBranch(e);
      }}
      options={bracnhesList}
    />
  );
};

export default SelectBranchBox;
