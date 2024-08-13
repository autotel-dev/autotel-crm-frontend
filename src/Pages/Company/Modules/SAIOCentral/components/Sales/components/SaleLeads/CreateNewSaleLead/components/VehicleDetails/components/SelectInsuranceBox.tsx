import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";

interface propTypes {
  placeholder: any;
  insurance: string;
  setInsurance: any;
  disabled: boolean;
}

const SelectInsuranceBox: React.FC<propTypes> = ({ placeholder, insurance, setInsurance ,disabled}) => {
  const { insurances } = useSelector(
    (state: any) => state.sales
  );

  const [insurancesList, setInsurancesList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    insurances?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setInsurancesList(tempList);
  }, [insurances]);
  return (
    <Select
    value={insurance !== "" ? insurance : null}
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
        setInsurance(e)
      }}
      options={insurancesList}
      disabled={disabled}
    />
  );
};

export default SelectInsuranceBox;
