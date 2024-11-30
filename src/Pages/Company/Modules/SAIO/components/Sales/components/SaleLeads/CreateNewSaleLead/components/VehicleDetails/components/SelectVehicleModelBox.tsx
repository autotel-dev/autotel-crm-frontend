import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";

interface propTypes {
  placeholder: any;
  vehicleModel: string;
  setVehicleModel: any;
  disabled: boolean;
  vehicleMake: any;
}

const SelectVehicleModelBox: React.FC<propTypes> = ({
  placeholder,
  vehicleModel,
  setVehicleModel,
  disabled,
  vehicleMake,
}) => {
  const { vehicleModels } = useSelector((state: any) => state.sales);
  // console.log("vehicleMake", vehicleMake);
  const [vehicleModelsList, setVehicleModelsList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    vehicleModels
      // ?.filter((item: any) => item?.vehicleMake?._id == vehicleMake)
      ?.map((item: any, index: any) => {
        tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
      });
    setVehicleModelsList(tempList);
  }, [vehicleModels, vehicleMake]);
  return (
    <Select
      value={vehicleModel !== "" ? vehicleModel : null}
      showSearch
      style={{ width: "100%", height: 36 }}
      placeholder={placeholder}
      optionFilterProp="children"
      filterOption={(input: any, option: any) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      filterSort={(optionA: any, optionB: any) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
      }
      onChange={(e) => {
        setVehicleModel(e);
      }}
      options={vehicleModelsList}
      disabled={disabled}
    />
  );
};

export default SelectVehicleModelBox;
