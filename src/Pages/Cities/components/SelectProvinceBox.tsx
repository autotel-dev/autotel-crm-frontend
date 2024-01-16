import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setProvinceId } from "../../../ReaduxToolkit/Reducer/CitiesSlice";
interface propTypes {
  placeholder: any;
}

const SelectProvinceBox: React.FC<propTypes> = ({ placeholder }) => {
  const { provinces } = useSelector((state: any) => state.cities);
  console.log(provinces);
  const [provinceList, setProvinceList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    provinces.map((item: any, index: any) => {
      tempList.push({ value: `${item._id}`, label: `${item.name}` });
    });
    setProvinceList(tempList);
  }, []);

  return (
    <Select
      // showSearch
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
      onChange={(e) => {
        console.log(e);
        dispatch(setProvinceId(e));
      }}
      options={provinceList}
    />
  );
};

export default SelectProvinceBox;
