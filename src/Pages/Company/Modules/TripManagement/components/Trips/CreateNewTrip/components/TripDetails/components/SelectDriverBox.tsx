import React, { useEffect, useState } from "react";
import { Select } from "antd";

interface SelectDriverBoxProps {
  placeholder: string;
  setDriver: (value: string) => void;
  driver: string;
  drivers: any[];
  disabled?: boolean;
}

const SelectDriverBox: React.FC<SelectDriverBoxProps> = ({
  placeholder,
  setDriver,
  driver,
  drivers,
  disabled = false,
}) => {
  const [driverList, setDriverList] = useState<any[]>([]);

  useEffect(() => {
    const tempList: any = [];
    drivers?.forEach((item: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setDriverList(tempList);
  }, [drivers]);

  return (
    <Select
      showSearch
      value={driver !== "" ? driver : null}
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
        setDriver(e);
      }}
      options={driverList}
      disabled={disabled}
    />
  );
};

export default SelectDriverBox;
