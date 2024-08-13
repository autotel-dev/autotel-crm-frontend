import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  fuelType: string;
  setFuelType: any;
  disabled: boolean;
}

const SelectFuelTypeBox: React.FC<propTypes> = ({ placeholder, fuelType, setFuelType, disabled }) => {
  const { fuelTypes } = useSelector(
    (state: any) => state.sales
  );

  const [fuelTypesList, setfuelTypesList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    fuelTypes?.map((item: any, index: any) => {
      tempList.push({ value: `${item?.value}`, label: `${item?.title}` });
    });
    setfuelTypesList(tempList);
  }, [fuelTypes]);
  return (
    <Select
      value={fuelType !== "" ? fuelType : null}
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
        setFuelType(e)
      }}
      options={fuelTypesList}
      disabled={disabled}
    />
  );
};

export default SelectFuelTypeBox;
