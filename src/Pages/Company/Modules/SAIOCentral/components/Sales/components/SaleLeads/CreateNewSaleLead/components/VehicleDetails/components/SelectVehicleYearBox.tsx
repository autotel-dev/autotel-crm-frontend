import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";

interface propTypes {
  placeholder: any;
  vehicleYear: string;
  setVehicleYear: any;
}

const SelectVehicleYearBox: React.FC<propTypes> = ({ placeholder, vehicleYear, setVehicleYear }) => {
  const { vehicleYears } = useSelector(
    (state: any) => state.sales
  );

  const [vehicleYearsList, setVehicleYearsList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    vehicleYears?.map((item: any, index: any) => {
      tempList.push({ value: `${item?.value}`, label: `${item?.title}` });
    });
    setVehicleYearsList(tempList);
  }, []);
  return (
    <Select
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
        setVehicleYear(e)
      }}
      options={vehicleYearsList}
    />
  );
};

export default SelectVehicleYearBox;
