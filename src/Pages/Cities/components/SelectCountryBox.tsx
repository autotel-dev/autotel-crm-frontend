import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setCountryId,
  setProvinces,
} from "../../../ReaduxToolkit/Reducer/CitiesSlice";
import { getAll } from "../../../Api";
interface propTypes {
  placeholder: any;
}

const SelectCountryBox: React.FC<propTypes> = ({ placeholder }) => {
  const { countries } = useSelector((state: any) => state.cities);
  const { provinces } = useSelector((state: any) => state.cities);
  // console.log(countries);
  const [countryList, setCountryList] = useState([]);
  const dispatch = useDispatch();
  const provinceTempList: any = [];

  const tempList: any = [];
  useEffect(() => {
    // // console.log("provinces 22: ", provinces.length);
    // if (provinces.length <= 0) {
    //   // console.log("4323");
    //   getAll({ url: "province/get-all-active-provinces" }).then((data: any) => {
    //     // console.log("api call --- >", data);
    //     if (data !== undefined) {
    //       if (data.success) {
    //         // console.log("hhg");
    //         dispatch(setProvinces(data.data));
    //       }
    //     }
    //   });
    // }

    countries.map((item: any, index: any) => {
      tempList.push({ value: `${item._id}`, label: `${item.name}` });
    });
    setCountryList(tempList);
  }, [provinces]);
  return (
    <Select
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
        dispatch(setCountryId(e));
        // provinces.map((item: any, index: any) => {
        //   // console.log("item.country._id: ", item)
        //   if (item.country === e) {
        //     // console.log("788")
        //     provinceTempList.push({
        //       value: `${item._id}`,
        //       label: `${item.name}`,
        //     });
        //   }
        // });
        // // console.log("provinceTempList: ", provinceTempList);
        // dispatch(setProvinces(provinceTempList));
        // // console.log("provinces: ", provinces);
      }}
      options={countryList}
    />
  );
};

export default SelectCountryBox;
