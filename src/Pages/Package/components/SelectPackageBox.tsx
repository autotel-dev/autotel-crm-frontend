import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setProvinceId } from "../../../ReaduxToolkit/Reducer/CitiesSlice";
import {
  setPackageDays,
  setPackageDuration,
} from "../../../ReaduxToolkit/Reducer/PackageSlice";
interface propTypes {
  placeholder: any;
}

const SelectPackageBox: React.FC<propTypes> = ({ placeholder }) => {
  const { allPackagesDuration, packageDays, packageDuration } = useSelector(
    (state: any) => state.packages
  );
  // console.log(allPackagesDuration);
  const [packageList, setPackageList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];

  useEffect(() => {
    allPackagesDuration?.packageDurationTypes?.map((item: any, index: any) => {
      tempList.push({
        value: `${item.days}`,
        label: `${item.title}`,
        title: `${item.value}`,
      });
    });
    setPackageList(tempList);
  }, []);

  return (
    <Select
      defaultValue={packageDuration !== null ? packageDuration : ""}
      showSearch
      style={{ width: 200, height: 36 }}
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
      onChange={(e, option) => {
        // console.log(e);
        // console.log(option);
        dispatch(setPackageDays(option.value));
        dispatch(setPackageDuration(option.title));
      }}
      options={packageList}
    />
  );
};

export default SelectPackageBox;
