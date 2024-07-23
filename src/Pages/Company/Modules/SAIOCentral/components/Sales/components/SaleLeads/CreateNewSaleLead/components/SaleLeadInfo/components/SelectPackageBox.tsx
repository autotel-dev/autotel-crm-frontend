import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";

interface propTypes {
  placeholder: any;
  setPackage: any;
  packagee: string;
}

const SelectPackageBox: React.FC<propTypes> = ({ placeholder, setPackage, packagee }) => {
  const { packages } = useSelector(
    (state: any) => state.sales
  );

  const [packageList, setPackageList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    packages?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.title}` });
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
        (option?.label ?? "").includes(input)
      }
      filterSort={(optionA: any, optionB: any) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
      }
      onChange={(e) => {
        // console.log(e);
        setPackage(e);

      }}
      options={packageList}
    />
  );
};

export default SelectPackageBox;
