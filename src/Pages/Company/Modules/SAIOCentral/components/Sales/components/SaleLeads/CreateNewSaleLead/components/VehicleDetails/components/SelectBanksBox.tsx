import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
}

const SelectBanksBox: React.FC<propTypes> = ({ placeholder }) => {
  const { cities, createCompany } = useSelector(
    (state: any) => state.companies
  );
  // console.log(cities);
  const [cityId, setCityId] = useState("");
  const [cityList, setCityList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    cities?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setCityList(tempList);
  }, [cities]);
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
        // console.log(e);
        setCityId(e);
        // dispatch(
        //   setCreateCompany({
        //     ...createCompany,
        //     city: e,
        //   })
        // );
        // dispatch(setCountryId(e));
      }}
      options={cityList}
    />
  );
};

export default SelectBanksBox;
