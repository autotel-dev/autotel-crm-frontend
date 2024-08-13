import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  bank: string;
  setBank: any;
  disabled: boolean;
}

const SelectBanksBox: React.FC<propTypes> = ({ placeholder, bank, setBank, disabled }) => {
  const { banks } = useSelector(
    (state: any) => state.sales
  );
  // console.log(cities);
  const [cityId, setCityId] = useState("");
  const [banksList, setBanksList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    banks?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setBanksList(tempList);
  }, [banks]);
  return (
    <Select
      value={bank !== "" ? bank : null}
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
        setBank(e)
      }}
      options={banksList}
      disabled={disabled}
    />
  );
};

export default SelectBanksBox;
