import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  transmission: string;
  setTransmission: any;
}

const SelectTransmissionBox: React.FC<propTypes> = ({ placeholder, transmission, setTransmission }) => {
  const { transmissions } = useSelector(
    (state: any) => state.sales
  );

  const [transmissionsList, setTransmissionsList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    transmissions?.map((item: any, index: any) => {
      tempList.push({ value: `${item?.value}`, label: `${item?.title}` });
    });
    setTransmissionsList(tempList);
  }, [transmissions]);
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
        setTransmission(e)
      }}
      options={transmissionsList}
    />
  );
};

export default SelectTransmissionBox;
