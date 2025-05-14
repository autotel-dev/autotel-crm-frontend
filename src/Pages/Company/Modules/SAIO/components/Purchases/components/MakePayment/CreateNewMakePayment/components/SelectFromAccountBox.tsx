import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  setFromAccount: any;
  fromAccount: string;
  // disabled: any;
}

const SelectBranchBox: React.FC<propTypes> = ({
  placeholder,
  setFromAccount,
  fromAccount,
  // disabled,
}) => {
  const { fromAccounts } = useSelector((state: any) => state.makePayments);
  const [fromAccountsList, setFromAccountsList] = useState([]);

  const tempList: any = [];
  useEffect(() => {
    fromAccounts?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setFromAccountsList(tempList);
  }, [fromAccounts]);
  return (
    <Select
      // disabled={disabled}
      value={fromAccount !== "" ? fromAccount : null}
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
        setFromAccount(e);
      }}
      options={fromAccountsList}
    />
  );
};

export default SelectBranchBox;
