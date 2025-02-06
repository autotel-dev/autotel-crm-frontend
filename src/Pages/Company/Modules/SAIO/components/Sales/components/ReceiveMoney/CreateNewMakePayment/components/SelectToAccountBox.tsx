import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  setToAccount: any;
  toAccount: string;
  // disabled: any;
}

const SelectWarehouseBox: React.FC<propTypes> = ({
  placeholder,
  setToAccount,
  toAccount,
  // disabled,
}) => {
  const { toAccounts } = useSelector((state: any) => state.receiveMoneys);
  const [toAccountsList, setToAccountsList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    toAccounts?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setToAccountsList(tempList);
  }, [toAccounts]);
  return (
    <Select
      // disabled={disabled}
      value={toAccount !== "" ? toAccount : null}
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
        setToAccount(e);
      }}
      options={toAccountsList}
    />
  );
};

export default SelectWarehouseBox;
