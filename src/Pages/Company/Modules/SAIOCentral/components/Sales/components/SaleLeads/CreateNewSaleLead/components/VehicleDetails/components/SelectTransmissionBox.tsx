import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  transmission: string;
  setTransmission: any;
  disabled: boolean;
}

const SelectTransmissionBox: React.FC<propTypes> = ({ placeholder, transmission, setTransmission,disabled }) => {
  const { transmissions } = useSelector(
    (state: any) => state.sales
  );

  const [transmissionsList, setTransmissionsList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    transmissions?.map((item: any, index: any) => {
      tempList.push({ value: `${item?.value}`, label: `${item?.label}` });
    });
    setTransmissionsList(tempList);
  }, [transmissions]);
  return (
    <Select
    value={transmission !== "" ? transmission : null}
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
        setTransmission(e)
      }}
      options={transmissionsList}
      disabled={disabled}
    />
  );
};

export default SelectTransmissionBox;
