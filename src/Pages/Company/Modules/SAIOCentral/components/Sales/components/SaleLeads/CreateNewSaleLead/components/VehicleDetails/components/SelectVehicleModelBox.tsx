import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";

interface propTypes {
  placeholder: any;
  vehicleModel: string;
  setVehicleModel: any;
}

const SelectVehicleModelBox: React.FC<propTypes> = ({ placeholder, vehicleModel, setVehicleModel }) => {
  const { vehicleModels } = useSelector(
    (state: any) => state.sales
  );
  // console.log(packages);
  const [packageId, setPackageId] = useState("");
  const [vehicleModelsList, setVehicleModelsList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    vehicleModels?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setVehicleModelsList(tempList);
  }, [vehicleModels]);
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
        setVehicleModel(e)
      }}
      options={vehicleModelsList}
    />
  );
};

export default SelectVehicleModelBox;
