import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
interface propTypes {
  placeholder: any;
  setExpenseNumber: any;
  expenseNumber: string;
}

const SelectExpesneNumberBox: React.FC<propTypes> = ({
  placeholder,
  setExpenseNumber,
  expenseNumber,
}) => {
  const { expenseNumbers } = useSelector((state: any) => state.purchaseInvoice);
  const [expenseNumberList, setexpenseNumberList] = useState([]);
  const dispatch = useDispatch();

  const tempList: any = [];
  useEffect(() => {
    expenseNumbers?.map((item: any, index: any) => {
      tempList.push({ value: `${item?._id}`, label: `${item?.value}` });
    });
    setexpenseNumberList(tempList);
  }, [expenseNumbers]);
  return (
    <Select
      value={expenseNumber !== "" ? expenseNumber : null}
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
        setExpenseNumber(e);
      }}
      options={expenseNumberList}
    />
  );
};

export default SelectExpesneNumberBox;
