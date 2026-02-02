import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";

interface propTypes {
  placeholder: any;
  setPackage: any;
  packagee: string;
  disabled: boolean;
  packageData: any;
  setPackageData: any;
}

const SelectPackageBox: React.FC<propTypes> = ({
  placeholder,
  setPackage,
  packagee,
  disabled,
  packageData,
  setPackageData,
}) => {
  const { packages } = useSelector((state: any) => state.sales);

  const [packageList, setPackageList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    // console.log("pakcgaes", packages);

    packages?.map((item: any, index: any) => {
      tempList.push({
        value: `${item?._id}`,
        label: `${item?.title}`,
        price: `${item.price}`,
        duration: `${item.duration}`,
        days: `${item.days}`,
        services: `${JSON.stringify(item.services)}`,
      });
    });
    setPackageList(tempList);
  }, [packages]);
  return (
    <Select
      showSearch
      value={packagee !== "" ? packagee : null}
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
        // console.log("options", options);

        // // console.log(e);
        setPackage(e);
        setPackageData({
          price: options.price,
          days: options.days,
          duration: options.duration,
          services: options.services,
        });
      }}
      options={packageList}
      disabled={disabled}
    />
  );
};

export default SelectPackageBox;
