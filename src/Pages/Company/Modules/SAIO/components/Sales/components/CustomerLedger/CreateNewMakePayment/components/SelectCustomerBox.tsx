import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  setCustomer: any;
  customer: string;
  setAccountId: any;
  accountId: String;
  // disabled: any;
}

const SelectCustomerBox: React.FC<propTypes> = ({
  placeholder,
  setCustomer,
  customer,
  setAccountId,
  accountId,
  // disabled,
}) => {
  const { customers, fromAccounts } = useSelector(
    (state: any) => state.customerLedgers
  );
  const [customersList, setCustomersList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    customers?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.fullName}` });
    });
    setCustomersList(tempList);
  }, [customers]);
  return (
    <Select
      // disabled={disabled}
      value={customer !== "" ? customer : null}
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
        const account = fromAccounts?.find(
          (item: any, index: any) => options.label == item?.name
        );
        setAccountId(account?._id);
        setCustomer(e);
      }}
      options={customersList}
    />
  );
};

export default SelectCustomerBox;
