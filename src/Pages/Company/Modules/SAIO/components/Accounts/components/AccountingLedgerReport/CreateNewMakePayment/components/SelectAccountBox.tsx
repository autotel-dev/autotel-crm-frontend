import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  setAccountId: any;
  accountId: String;
  // disabled: any;
}

const SelectAccountBox: React.FC<propTypes> = ({
  placeholder,
  setAccountId,
  accountId,
  // disabled,
}) => {
  const { fromAccounts } = useSelector((state: any) => state.companyLedgers);
  const [accountsList, setAccountsList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    fromAccounts?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setAccountsList(tempList);
  }, [fromAccounts]);
  return (
    <Select
      // disabled={disabled}
      value={accountId !== "" ? accountId : null}
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
      onChange={(e, options) => {
        setAccountId(e);
      }}
      options={accountsList}
    />
  );
};

export default SelectAccountBox;
