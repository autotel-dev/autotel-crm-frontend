import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setVehicleMakeId } from "../../../../ReaduxToolkit/Reducer/VehicleModelSlice";
interface propTypes {
  placeholder: any;
}

const SelectVehicleMakeBox: React.FC<propTypes> = ({ placeholder }) => {
  const { vehicleMake, vehicleMakeName } = useSelector(
    (state: any) => state.vehicleModel
  );
  // console.log(countries);
  const [vehicleMakeList, setVehicleMakeList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    vehicleMake.map((item: any, index: any) => {
      tempList.push({ value: `${item._id}`, label: `${item.name}` });
    });
    setVehicleMakeList(tempList);
  }, []);
  return (
    <Select
      defaultValue={vehicleMakeName !== null ? vehicleMakeName : ""}
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
        dispatch(setVehicleMakeId(e));
      }}
      options={vehicleMakeList}
    />
  );
};

export default SelectVehicleMakeBox;
