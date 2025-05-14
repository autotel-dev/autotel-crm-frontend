import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  setVendor: any;
  vendor: string;
  setToAccount: any;
  toAccount: string;
  setVendorPayables: any;
  setVendorBalance: any;
  // disabled: any;
}

const SelectVendorBox: React.FC<propTypes> = ({
  placeholder,
  setVendor,
  vendor,
  setToAccount,
  toAccount,
  setVendorPayables,
  setVendorBalance,
  // disabled,
}) => {
  const { vendors, toAccounts } = useSelector(
    (state: any) => state.makePayments
  );
  const [vendorsList, setVendorsList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    vendors?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.vendorName}` });
    });
    setVendorsList(tempList);
  }, [vendors]);
  return (
    <Select
      // disabled={disabled}
      value={vendor !== "" ? vendor : null}
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
        console.log("toAccounts", toAccounts);

        const account = toAccounts?.find(
          (item: any, index: any) => options.label == item?.name
        );
        setToAccount(account?._id);
        setVendorBalance(account?.vendor?.overPaymentBalance);
        setVendorPayables(account?.vendor?.payables);
        setVendor(e);

        console.log("account", account);
      }}
      options={vendorsList}
    />
  );
};

export default SelectVendorBox;
