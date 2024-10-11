import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  setExpenseAccount: any;
  expenseAccount: string;
}

const SelectExpenseAccountBox: React.FC<propTypes> = ({
  placeholder,
  setExpenseAccount,
  expenseAccount,
}) => {
  const { expenseAccounts } = useSelector((state: any) => state.expenses);
  const [expenseAccountsList, setExpenseAccounts] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    expenseAccounts?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
    });
    setExpenseAccounts(tempList);
  }, [expenseAccounts]);
  return (
    <Select
      value={expenseAccount !== "" ? expenseAccount : null}
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
      onChange={(e) => {
        // // console.log(e);
        setExpenseAccount(e);
      }}
      options={expenseAccountsList}

      // onChange={(value) => {
      //     const selectedProduct = products.find((p: any) => p._id === value);
      //     setProduct(selectedProduct); // Set the whole selected product object
      //   }}
      //   options={productsList}
    />
  );
};

export default SelectExpenseAccountBox;
