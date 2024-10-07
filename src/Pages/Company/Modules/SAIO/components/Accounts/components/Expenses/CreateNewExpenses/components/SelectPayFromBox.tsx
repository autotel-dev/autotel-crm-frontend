import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  setBankAccount: any;
  bankAccount: string;
}

const SelectPayFromBox: React.FC<propTypes> = ({ placeholder, setBankAccount, bankAccount }) => {
  const { bankAccounts } = useSelector(
    (state: any) => state.expenses
  );
  const [bankAccountsList, setBankAccountsList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    bankAccounts?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setBankAccountsList(tempList);
  }, [bankAccounts]);
  return (
    <Select
      value={bankAccount !== "" ? bankAccount : null}
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
        // console.log(e);
        setBankAccount(e);

      }}
      options={bankAccountsList}
    />
  );
};

export default SelectPayFromBox;
