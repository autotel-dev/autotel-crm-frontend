import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
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
    const dispatch = useDispatch();

    const tempList: any = [];
    useEffect(() => {
        products?.map((item: any, index: any) => {
            tempList.push({ value: `${item?._id}`, label: `${item?.name}` });
        });
        setProductsList(tempList);
    }, [products]);
    return (
        <Select
            value={product !== "" ? product : null}
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
                setProduct(e);

            }}
            options={productsList}

        // onChange={(value) => {
        //     const selectedProduct = products.find((p: any) => p._id === value);
        //     setProduct(selectedProduct); // Set the whole selected product object
        //   }}
        //   options={productsList}
        />
    );
};

export default SelectProductBox;
