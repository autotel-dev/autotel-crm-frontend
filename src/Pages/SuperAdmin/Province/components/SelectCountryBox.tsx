import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setCountryId } from "../../../../ReaduxToolkit/Reducer/ProvinceSlice";
interface propTypes {
  placeholder: any;
}

const SelectCountryBox: React.FC<propTypes> = ({ placeholder }) => {
  const { countries, countryName } = useSelector(
    (state: any) => state.provinces
  );
  // console.log(countries);
  const [countryList, setCountryList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    countries.map((item: any, index: any) => {
      tempList.push({ value: `${item._id}`, label: `${item.name}` });
    });
    setCountryList(tempList);
  }, []);
  return (
    <Select
      defaultValue={countryName !== null ? countryName : ""}
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
      onChange={(e) => {
        // console.log(e);
        dispatch(setCountryId(e));
      }}
      options={countryList}
    />
  );
};

export default SelectCountryBox;
