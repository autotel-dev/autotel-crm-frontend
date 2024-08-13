import React, { useCallback, useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { GET_ALL_INVENTORY_ITEMS, GET_ALL_SINGLE_INVENTORY_ITEM } from "../../../../../../../../../../../../Utilities/api/apiEndpoints";
import { getAll } from "../../../../../../../../../../../../Utilities/api";
import debounce from "lodash.debounce";


interface propTypes {
  placeholder: any;
  simNumber: any;
  setSimNumber: any;
  isAddedInventory: any;
  productId: string;
}

const SelectSimNoBox: React.FC<propTypes> = ({ placeholder, simNumber, setSimNumber, productId, isAddedInventory }) => {

  // console.log(cities);
  const [inventoryList, setInventoryList] = useState([]);

  const fetchInventoryitems = async (searchString: string) => {
    const allInventoryitemsData: any = await getAll({
      url: `${GET_ALL_INVENTORY_ITEMS}?serialNo=${searchString}&productId=${productId}`,
    });

    if (allInventoryitemsData?.success) {
      setInventoryList(
        allInventoryitemsData?.data?.inventoryItems.map((item: any) => ({
          value: item?._id,
          label: item?.serialNumber, // Use label for displaying the text in the dropdown
          id: item._id,
        }))
      );
    }
    else {
      setInventoryList(
        []
      );
    }
  };

  const debouncedFetchInventoryItems = useCallback(
    debounce((searchString: string) => {
      fetchInventoryitems(searchString);
    }, 300), // Debounce delay (300ms)
    []
  );
  return (
    <Select
      value={simNumber !== "" ? simNumber : null}
      showSearch
      onSearch={(value) => {
        debouncedFetchInventoryItems(value);
      }}
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
      onChange={async (e) => {
        const singleInventoryitemData: any = await getAll({
          url: `${GET_ALL_SINGLE_INVENTORY_ITEM}/${e}`,
        });

        if (singleInventoryitemData?.success) {
          setSimNumber(singleInventoryitemData?.data);
        }
      }}
      options={inventoryList}
      disabled={isAddedInventory}
    />
  );
};

export default SelectSimNoBox;
