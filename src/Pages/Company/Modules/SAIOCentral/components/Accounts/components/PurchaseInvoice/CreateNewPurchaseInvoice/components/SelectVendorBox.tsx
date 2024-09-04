import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  setVendor: any;
  vendor: string;
}

const SelectVendorBox: React.FC<propTypes> = ({ placeholder, setVendor, vendor }) => {
  const { vendors } = useSelector(
    (state: any) => state.purchaseInvoice
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
      value={vendor !== "" ? vendor : null}
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
        // console.log(e);
        setVendor(e);

      }}
      options={vendorsList}
    />
  );
};

export default SelectVendorBox;
