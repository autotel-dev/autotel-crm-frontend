import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { patch } from "../../../../../../../../../../../../Utilities/api";
import { ATTACH_INSTALLER_TO_VEHICLE } from "../../../../../../../../../../../../Utilities/api/apiEndpoints";

interface propTypes {
  placeholder: any;
  installer: string;
  setInstaller: any;
  isAddedInventory: any;
  vehicleId: string;
}

const SelectInstallerBox: React.FC<propTypes> = ({
  placeholder,
  installer,
  setInstaller,
  vehicleId,
  isAddedInventory,
}) => {
  const { installedUsers } = useSelector((state: any) => state.sales);

  const [installerUsersList, setInstallerUsersList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    installedUsers?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.fullName}` });
    });
    setInstallerUsersList(tempList);
  }, [installedUsers]);
  return (
    <Select
      value={installer !== "" ? installer : null}
      showSearch
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
      onChange={async (e) => {
        // // console.log(e);

        try {
          await patch(
            { installer: e },
            { url: `${ATTACH_INSTALLER_TO_VEHICLE}/${vehicleId}` }
          ).then((data: any) => {
            if (data !== undefined) {
              if (!data.success) {
                Swal.fire({
                  text: `${data.message}`,
                  icon: "error",
                  timer: 2000,
                  showConfirmButton: false,
                });
              }
              if (data.success) {
              }
            }
          });
          // Handle successful post creation (e.g., show a success message, redirect, etc.)
        } catch (error: any) {
          Swal.fire({
            text: `${error?.data?.response?.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          // Handle error (e.g., show an error message)
          // console.error("Error creating post:", error);
        }

        setInstaller(e);
      }}
      options={installerUsersList}
      disabled={isAddedInventory}
    />
  );
};

export default SelectInstallerBox;
