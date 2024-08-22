import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  setCity: any;
  city: string;
  disabled: boolean;
}

const SelectCitiesBox: React.FC<propTypes> = ({ placeholder, setCity, city, disabled }) => {
  const { cities } = useSelector(
    (state: any) => state.sales
  );
  // console.log(cities);
  const [cityId, setCityId] = useState("");
  const [cityList, setCityList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    cities?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setCityList(tempList);
  }, [cities]);
  return (
    <Select
      showSearch
      value={city !== "" ? city : null}
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
        setCity(e);

      }}
      options={cityList}
      disabled={disabled}
    />
  );
};

export default SelectCitiesBox;
