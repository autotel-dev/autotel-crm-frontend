import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useSelector } from "react-redux";

interface propTypes {
  placeholder: any;
  setProduct: any;
  product: string;
}

const SelectProductBox: React.FC<propTypes> = ({ placeholder, setProduct, product }) => {
  const { products } = useSelector(
    (state: any) => state.purchaseInvoice
  );
  const [productsList, setProductsList] = useState([]);
  
  useEffect(() => {
    const tempList = products.map((item: any) => ({
      value: item._id,
      label: item.name,
      type: item.productType
    }));
    setProductsList(tempList);
  }, [products]);

  return (
    <Select
      value={product !== "" ? product : null}
      showSearch
      style={{ width: "100%", height: 36 }}
      placeholder={placeholder}
      optionFilterProp="children"
      filterOption={(input, option:any) => (option?.label ?? "").includes(input)}
      filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
      onChange={(value, option) => {
        setProduct(value, option.type); // Pass both value and type
      }}
      options={productsList}
    />
  );
};

export default SelectProductBox;
