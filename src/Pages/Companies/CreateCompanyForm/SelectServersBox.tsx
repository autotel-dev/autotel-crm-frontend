import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setCountryId } from "../../../ReaduxToolkit/Reducer/ProvinceSlice";
import { setServersAddItemsList } from "../../../ReaduxToolkit/Reducer/CompanySlice";
interface propTypes {
  placeholder: any;
}

const SelectServerBox: React.FC<propTypes> = ({ placeholder }) => {
  const { servers, serversAddItemsList } = useSelector(
    (state: any) => state.companies
  );
  console.log(servers);
  const [serverList, setServerList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    console.log("Servers in useeffect -- >", servers);

    servers?.map((item: any, index: any) => {
      tempList.push({
        value: `${item._id}`,
        label: `${item.companyName}`,
        hostUrl: `${item.backendUrl}`,
        server: `${item._id}`,
        item: `${item}`,
      });
    });
    setServerList(tempList);
  }, []);

  const handleSelectAll = (value: any) => {
    if (value && value.length > 0) {
      return [...value];
    }
    console.log(value);

    return value;
  };
  return (
    <Select
      showSearch
      mode="multiple"
      
      style={{ width: 500, height: 36 }}
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
      onChange={(e, option) => {
        dispatch(setServersAddItemsList([]));
        console.log(e);
        console.log(option);
        // var temp: any = [];
        // option?.map((item: any, index: any) => {
        //   temp.push({
        //     hostUrl: `${item.backendUrl}`,
        //     server: `${item.value}`,
        //   });
        // });
        dispatch(setServersAddItemsList(option));
        console.log("reduxServerAdItemsList -- >", serversAddItemsList);
      }}
      options={serverList}
    />
  );
};

export default SelectServerBox;
