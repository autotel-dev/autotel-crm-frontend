// SingleProductObject.tsx
import { ChangeEvent } from "react";
import { MdDelete } from "react-icons/md";
import { Button, Col, Form, Input, Row } from "reactstrap";
import SelectProductBox from "./SelectProductBox";

interface PropTypes {
    param: {
        product: any; // Changed to any for flexibility
        quantity: string;
        price: string;
        discount: string;
        amount: string;
        description: string;
    };
    onChange: (newParam: any) => void;
    onDelete: () => void;
}

const SingleProductObject: React.FC<PropTypes> = ({
    param,
    onChange,
    onDelete,
}) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        onChange({ ...param, [name]: value });
    };

    // Calculate amount based on quantity, price, and discount
    const calculateAmount = () => {
        const { quantity, price, discount } = param;
        const parsedQuantity = parseFloat(quantity);
        const parsedPrice = parseFloat(price);
        const parsedDiscount = parseFloat(discount);
        if (quantity && price && discount) {


            if (parsedDiscount > 0) {
                return ((parsedQuantity * parsedPrice) * ((100 - parsedDiscount) / 100)).toFixed(2);
            } else {
                return (parsedQuantity * parsedPrice).toFixed(2);
            }
        } else {
            return (parsedQuantity * parsedPrice).toString() == "NaN" ? 0 : parsedQuantity * parsedPrice;
        }
    };

    return (
        <table style={{ border: "1px solid lightgray", width: "100%" }}>
            <thead>
                <tr>
                    <th style={{ width: "23%", borderRight: "1px solid lightgray" }}>
                        Product
                    </th>
                    <th style={{ width: "17%", borderRight: "1px solid lightgray" }}>
                        Quantity
                    </th>
                    <th style={{ width: "17%", borderRight: "1px solid lightgray" }}>
                        Price
                    </th>
                    <th style={{ width: "17%", borderRight: "1px solid lightgray" }}>
                        Discount
                    </th>
                    <th style={{ width: "17%", borderRight: "1px solid lightgray" }}>
                        Amount
                    </th>
                    <th style={{ width: "10%", border: "0px" }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr style={{ backgroundColor: "#f6f6f6" }}>
                    <td style={{ width: "23%", textAlign: "start", borderRight: "1px solid lightgray" }}>
                        <Col xs={12}>
                            <div>
                            </div>
                            <SelectProductBox
                                placeholder="Select Product"
                                setProduct={(product: any) => onChange({ ...param, product })} // Update the product object in param
                                product={param.product}
                            />
                        </Col>
                        <br />
                        <Col xs={12} style={{ marginTop: "-10px" }}>
                            <Input
                                type="text"
                                placeholder="Enter Description"
                                value={param.description}
                                name="description"
                                onChange={handleInputChange}
                            />
                        </Col>
                    </td>
                    <td style={{ width: "17%", alignItems: "start", borderRight: "1px solid lightgray" }}>
                        <Col xs={12}>
                            <Input
                                type="text"
                                placeholder="Enter Quantity"
                                value={param.quantity}
                                name="quantity"
                                onChange={handleInputChange}
                            />
                        </Col>
                    </td>
                    <td style={{ width: "17%", alignItems: "start", borderRight: "1px solid lightgray" }}>
                        <Col xs={12}>
                            <Input
                                type="text"
                                placeholder="Enter Price"
                                value={param.price}
                                name="price"
                                onChange={handleInputChange}
                            />
                        </Col>
                    </td>
                    <td style={{ width: "17%", alignItems: "start", borderRight: "1px solid lightgray" }}>
                        <Col xs={12}>
                            <Input
                                type="text"
                                placeholder="Enter Discount in %"
                                value={param.discount}
                                name="discount"
                                onChange={handleInputChange}
                            />
                        </Col>
                    </td>
                    <td style={{ width: "17%", alignItems: "start", borderRight: "1px solid lightgray" }}>
                        <Col xs={12}>
                            <Input
                                type="text"
                                placeholder="Enter Amount"
                                value={calculateAmount()} // Calculate amount based on inputs
                                name="amount"
                                disabled // Disable onChange for amount
                            />
                        </Col>
                    </td>
                    <td style={{ width: "10%", border: "0px" }}>
                        <MdDelete size={28} color="red" style={{ cursor: "pointer" }} onClick={onDelete} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default SingleProductObject;
