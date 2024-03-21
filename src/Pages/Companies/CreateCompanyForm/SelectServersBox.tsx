import React, { useEffect, useState } from "react";
import { Select, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setCountryId } from "../../../ReaduxToolkit/Reducer/ProvinceSlice";
import {
  setServerCredentials,
  setServersAddItemsList,
} from "../../../ReaduxToolkit/Reducer/CompanySlice";
interface propTypes {
  placeholder: any;
}

const SelectServerBox: React.FC<propTypes> = ({ placeholder }) => {
  const { servers, serversAddItemsList, serverCredentials } = useSelector(
    (state: any) => state.companies
  );
  // console.log(servers);
  const [serverList, setServerList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    // console.log("Servers in useeffect -- >", servers);

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
  }, [servers]);

  const handleDeselect = (value: any, option: any) => {
    // Dispatch an action to remove the deselected item from the Redux state
    // console.log("value", value);
    // console.log("option", option);

    const updatedList = serversAddItemsList.filter(
      (item: any) => item.value !== value
    );
    dispatch(setServerCredentials(updatedList));
  };

  const handleSelectAll = (value: any) => {
    if (value && value.length > 0) {
      return [...value];
    }
    // console.log(value);

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
        // console.log(e);
        // console.log("options", option);

        dispatch(setServersAddItemsList(option));

        serverCredentials.map((item: any, index: any) => {
          const isMatch = e.some((id: any) => {
            // Implement your own logic to check if the JSON objects match
            // In this example, we're checking if both id and name match
            if (id === item.server) {
              // console.log("The element found");
            } else {
              // console.log("No match found.");
            }
          });
        });

        // console.log("reduxServerAdItemsList -- >", serversAddItemsList);
      }}
      options={serverList}
      onDeselect={handleDeselect}
    />
  );
};

export default SelectServerBox;
