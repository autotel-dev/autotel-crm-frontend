import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
    placeholder: any;
    setAccountType: any;
    accountType: string;
}

const SelectAccountTypeBox: React.FC<propTypes> = ({ placeholder, setAccountType, accountType }) => {
    console.log("accountType", accountType);

    const { accountTypes } = useSelector(
        (state: any) => state.bankAccounts
    );
    const [accountTypesList, setAccountTypesList] = useState([]);
    const dispatch = useDispatch();

    const tempList: any = [];
    useEffect(() => {
        accountTypes?.map((item: any, index: any) => {
            tempList.push({ value: `${item?.value}`, label: `${item?.title}` });
        });
        setAccountTypesList(tempList);
    }, [accountTypes]);


    return (
        <Select
            value={accountType !== "" ? accountType : null}
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
                setAccountType(e);

            }}
            options={accountTypes}
        />
    );
};

export default SelectAccountTypeBox;
