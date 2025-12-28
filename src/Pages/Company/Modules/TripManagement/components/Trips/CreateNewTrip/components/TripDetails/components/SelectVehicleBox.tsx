import React, { useEffect, useState } from "react";
import { Select } from "antd";

interface SelectVehicleBoxProps {
  placeholder: string;
  setVehicle: (value: string) => void;
  vehicle: string;
  vehicles: any[];
  disabled?: boolean;
}

const SelectVehicleBox: React.FC<SelectVehicleBoxProps> = ({
  placeholder,
  setVehicle,
  vehicle,
  vehicles,
  disabled = false,
}) => {
  const [vehicleList, setVehicleList] = useState<any[]>([]);

  useEffect(() => {
    const tempList: any = [];
    vehicles?.forEach((item: any) => {
      // Vehicle data from GET_ALL_VEHICLES_DROPDOWN_FOR_ALERT has registrationNo
      tempList.push({
        value: `${item?._id}`,
        label: `${item?.registrationNo || item?.name || "N/A"}`,
      });
    });
    setVehicleList(tempList);
  }, [vehicles]);

  return (
    <Select
      showSearch
      value={vehicle !== "" ? vehicle : null}
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
        setVehicle(e);
      }}
      options={vehicleList}
      disabled={disabled}
    />
  );
};

export default SelectVehicleBox;
