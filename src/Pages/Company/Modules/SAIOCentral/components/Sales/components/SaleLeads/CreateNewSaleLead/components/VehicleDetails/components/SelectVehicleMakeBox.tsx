import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  vehicleMake: string;
  setVehicleMake: any;
  disabled: boolean;
}

const SelectVehicleMakeBox: React.FC<propTypes> = ({ placeholder, vehicleMake, setVehicleMake,disabled }) => {
  const { vehicleMakes } = useSelector(
    (state: any) => state.sales
  );
  const [vehicleMakesList, setVehicleMakesList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    vehicleMakes?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setVehicleMakesList(tempList);
  }, [vehicleMakes]);
  return (
    <Select
    value={vehicleMake !== "" ? vehicleMake : null}
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
        setVehicleMake(e)
      }}
      options={vehicleMakesList}
      disabled={disabled}
    />
  );
};

export default SelectVehicleMakeBox;
