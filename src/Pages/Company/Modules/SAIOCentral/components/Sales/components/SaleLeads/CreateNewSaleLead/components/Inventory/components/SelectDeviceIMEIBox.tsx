import React, { useState, useCallback } from "react";
import { Select } from "antd";
import { getAll } from "../../../../../../../../../../../../Utilities/api";
import { GET_ALL_INVENTORY_ITEMS, GET_ALL_SINGLE_INVENTORY_ITEM } from "../../../../../../../../../../../../Utilities/api/apiEndpoints";
import debounce from "lodash.debounce";

interface propTypes {
  placeholder: any;
  deviceIMEI: any;
  setDeviceIMEI: any;
  isAddedInventory: any;
  productId: string;
}

const SelectDeviceIMEIBox: React.FC<propTypes> = ({
  placeholder,
  deviceIMEI,
  setDeviceIMEI,
  productId,
  isAddedInventory
}) => {
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
    }, 200), // Debounce delay (300ms)
    []
  );

  return (
    <Select
      value={deviceIMEI !== "" ? deviceIMEI : null}
      showSearch
      onSearch={(value) => {
        debouncedFetchInventoryItems(value);
      }}
      style={{ width: "100%", height: 36 }}
      placeholder={placeholder}
      optionFilterProp="label"
      filterOption={(input: any, option: any) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      onChange={async (e) => {
        const singleInventoryitemData: any = await getAll({
          url: `${GET_ALL_SINGLE_INVENTORY_ITEM}/${e}`,
        });

        if (singleInventoryitemData?.success) {
          setDeviceIMEI(singleInventoryitemData?.data);
        }

      }}
      options={inventoryList}
      disabled={isAddedInventory}
    />
  );
};

export default SelectDeviceIMEIBox;
