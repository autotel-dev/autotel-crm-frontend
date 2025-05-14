import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  setVendor: any;
  vendor: string;
  setAccountId: any;
  accountId: string;
  // disabled: any;
}

const SelectVendorBox: React.FC<propTypes> = ({
  placeholder,
  setVendor,
  vendor,
  setAccountId,
  accountId,
  // disabled,
}) => {
  const { vendors, fromAccounts } = useSelector(
    (state: any) => state.vendorLedgers
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
        console.log("toAccounts", fromAccounts);

        const account = fromAccounts?.find(
          (item: any, index: any) => options.label == item?.name
        );
        setAccountId(account?._id);
        setVendor(e);

        console.log("account", account);
      }}
      options={vendorsList}
    />
  );
};

export default SelectVendorBox;
