import { ChangeEvent, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Button, Col, Input, InputGroup, InputGroupText } from "reactstrap";
import SelectProductBox from "./SelectProductBox";
import AddSerialNumbersModel from "./AddSerialNumbersModal";
import { useSelector } from "react-redux";

interface PropTypes {
    param: {
        product: any;
        type: string;
        quantity: number;
        price: string;
        discount: number;
        totalAmount: string;
        description: string;
        serialsOrSkus: [];
    };
    onChange: (newParam: any) => void;
    onDelete: () => void;
}

const SingleProductObject: React.FC<PropTypes> = ({
    param,
    onChange,
    onDelete,
}) => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const [product, setProduct] = useState("");
    const [type, setType] = useState("");
    const [quantity, setQuantity] = useState(Number(""));
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name == "discount" || name == "price" || name == "quantity" || name == "totalAmount") {
            onChange({ ...param, [name]: Number(value) });
        }
        else {
            onChange({ ...param, [name]: value });
        }

    };

    const handleProductChange = (productId: string, productType: string) => {
        onChange({ ...param, product: productId, type: productType });
    };

    const calculateAmount = () => {
        const { quantity, price, discount } = param;
        const parsedQuantity = quantity;
        const parsedPrice = parseFloat(price);
        const parsedDiscount = discount;
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
        <>
            <div style={{
                height: "10px"
            }}> </div>
            <tr style={{ backgroundColor: "#f6f6f6", borderTop: "1px solid lightgray" }}>
                <td style={{ width: "23%", textAlign: "start", borderRight: "1px solid lightgray" }}>
                    <Col xs={12}>
                        <div>
                        </div>
                        <SelectProductBox
                            placeholder="Select Product"
                            setProduct={handleProductChange} // Update the product and type
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
                        <InputGroup style={{}}>
                            <Input
                                type="text"
                                placeholder="Enter Quantity"
                                value={param.quantity}
                                name="quantity"
                                onChange={handleInputChange}
                            />
                            {
                                param.type !== "ACCESSORIES" && param.type !== "" && <InputGroupText style={{ padding: "0px" }}>
                                    <Button color={userPersonalizationData?.buttonsAndBarsColor !== "" ? "" : "primary"} style={{
                                        padding: "10px",
                                        height: "36px",
                                        display: "flex",
                                        alignItems: "center",
                                        color: "white",
                                        backgroundColor: `${userPersonalizationData?.buttonsAndBarsColor}`
                                    }} onClick={() => {
                                        setProduct(param.product)
                                        setQuantity(param.quantity);
                                        setIsModalOpen(true)
                                    }} >A</Button>
                                </InputGroupText>
                            }
                        </InputGroup>
                    </Col>
                </td>
                <td style={{ width: "17%", alignItems: "start", borderRight: "1px solid lightgray" }}>
                    <Col xs={12}>
                        <Input
                            type="number"
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
                            type="number"
                            placeholder="Enter Amount"
                            value={calculateAmount()}
                            name="totalAmount"
                            disabled
                            onChange={handleInputChange}
                        />
                    </Col>
                </td>
                <td style={{ width: "10%", borderRight: "1px solid lightgray" }}>
                    <MdDelete size={28} color="red" style={{ cursor: "pointer" }} onClick={onDelete} />
                </td>
            </tr>




            {
                isModalOpen &&
                <AddSerialNumbersModel
                    isVisible={isModalOpen}
                    setIsVisible={setIsModalOpen}
                    product={product}
                    quantity={quantity}
                    onChange={onChange}
                    param={param}
                />
            }
        </>
    );
};

export default SingleProductObject;
