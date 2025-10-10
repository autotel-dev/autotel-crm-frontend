import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  geofence: string;
  setGeofence: any;
  disabled: boolean;
}

const SelectGeofenceBox: React.FC<propTypes> = ({
  placeholder,
  geofence,
  setGeofence,
  disabled,
}) => {
  const { geofences } = useSelector((state: any) => state.sales);
  const [geofencesList, setGeofencesList] = useState([]);

  const tempList: any = [];
  useEffect(() => {
    geofences?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.title}` });
    });
    setGeofencesList(tempList);
  }, [geofences]);

  return (
    <Select
      value={geofence !== "" ? geofence : null}
      showSearch
      mode="multiple"
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
        setGeofence(e);
      }}
      options={geofencesList}
      disabled={disabled}
    />
  );
};

export default SelectGeofenceBox;
