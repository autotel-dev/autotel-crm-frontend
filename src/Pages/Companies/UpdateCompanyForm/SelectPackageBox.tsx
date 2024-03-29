import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCompany } from "../../../ReaduxToolkit/Reducer/CompanySlice";

interface propTypes {
  placeholder: any;
  defaultValue: any;
}

const SelectPackageBox: React.FC<propTypes> = ({
  placeholder,
  defaultValue,
}) => {
  const { packages, createCompany } = useSelector(
    (state: any) => state.companies
  );
  // console.log(packages);
  const [packageId, setPackageId] = useState("");
  const [packageList, setPackageList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    packages.map((item: any, index: any) => {
      tempList.push({ value: `${item._id}`, label: `${item.title}` });
    });
    setPackageList(tempList);
  }, [packages]);
  return (
    <Select
      showSearch
      defaultValue={
        packages &&
        packages.find((item: any) => item?._id === defaultValue)?.title
      }
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
        setPackageId(e);
        dispatch(
          setCreateCompany({
            ...createCompany,
            package: e,
          })
        );
        // dispatch(setCountryId(e));
      }}
      options={packageList}
    />
  );
};

export default SelectPackageBox;
