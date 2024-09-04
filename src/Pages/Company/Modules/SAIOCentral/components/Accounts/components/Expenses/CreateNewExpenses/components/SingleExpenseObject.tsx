// SingleProductObject.tsx
import { ChangeEvent } from "react";
import { MdDelete } from "react-icons/md";
import { Button, Col, Form, Input, Row } from "reactstrap";
import SelectProductBox from "./SelectExpenseAccountBox";
import SelectExpenseAccountBox from "./SelectExpenseAccountBox";

interface PropTypes {
    param: {
        expenseAccount: string
        amount: string;
        description: string;
    };
    onChange: (newParam: any) => void;
    onDelete: () => void;
}

const SingleExpenseObject: React.FC<PropTypes> = ({
    param,
    onChange,
    onDelete,
}) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        onChange({ ...param, [name]: value });
    };



    return (
        <table style={{ border: "1px solid lightgray", width: "100%" }}>
            <thead>
                <tr>
                    <th style={{ width: "30%", borderRight: "1px solid lightgray" }}>
                        Expense Account
                    </th>
                    <th style={{ width: "25%", borderRight: "1px solid lightgray" }}>
                        Description
                    </th>
                    <th style={{ width: "25%", borderRight: "1px solid lightgray" }}>
                        Amount
                    </th>
                    <th style={{ width: "20%", border: "0px" }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr style={{ backgroundColor: "#f6f6f6" }}>
                    <td style={{ width: "30%", textAlign: "start", borderRight: "1px solid lightgray" }}>
                        <Col xs={12}>
                            <SelectExpenseAccountBox
                                placeholder="Select Expense Account"
                                setExpenseAccount={(expenseAccount: any) => onChange({ ...param, expenseAccount })} // Update the product object in param
                                expenseAccount={param.expenseAccount}
                            />
                        </Col>

                    </td>

                    <td style={{ width: "25%", alignItems: "start", borderRight: "1px solid lightgray" }}>
                        <Col xs={12}>
                            <Input
                                type="text"
                                placeholder="Enter Description"
                                value={param.description}
                                name="description"
                                onChange={handleInputChange}
                            />
                        </Col>
                    </td>


                    <td style={{ width: "25%", alignItems: "start", borderRight: "1px solid lightgray" }}>
                        <Col xs={12}>
                            <Input
                                type="number"
                                placeholder="Enter Amount"
                                value={param.amount} // Calculate amount based on inputs
                                name="amount"
                                onChange={handleInputChange}
                            />
                        </Col>
                    </td>
                    <td style={{ width: "20%", border: "0px" }}>
                        <MdDelete size={28} color="red" style={{ cursor: "pointer" }} onClick={onDelete} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default SingleExpenseObject;
