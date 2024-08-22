import React, { useEffect, useState } from "react";
import { Col, Button, Modal, ModalBody, Input, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H4, P } from "../../../../../../../../../../AbstractElements";
import Swal from "sweetalert2";
import { create } from "../../../../../../../../../../Utilities/api";
import { VALIDATE_SERIALS } from "../../../../../../../../../../Utilities/api/apiEndpoints";
import { MdDelete } from "react-icons/md";

interface PropsTypes {
    isVisible: boolean;
    setIsVisible: any;
    product: string;
    quantity: number;
    onChange: any;
    param: {
        product: any; // Changed to any for flexibility
        type: string;
        quantity: number;
        price: string;
        discount: number;
        totalAmount: string;
        description: string;
        serialsOrSkus: [];
    };
}

const AddSerialNumbersModel: React.FC<PropsTypes> = ({
    isVisible,
    setIsVisible = () => { },
    product,
    quantity,
    onChange,
    param
}) => {
    const { products, purchaseInvoice } = useSelector((state: any) => state.purchaseInvoice);
    const [serialNumber, setSerialNumber] = useState("");
    const [sku, setSku] = useState("");
    const [bulkSerials, setBulkSerials] = useState("");
    const [notAvailableSerialsOrSkus, setnotAvailableSerialsOrSkus]: any = useState([])

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [selection, setSelection] = useState("Single"); // Added state for selection
    const addToggle = () => {
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        onChange({
            ...param, serialsOrSkus: [
            ]
        })
    }, [])

    const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value == "Bulk") {
            setSerialNumber("");
            setSku("")
        }
        else {
            setBulkSerials("")
        }
        setSelection(e.target.value);
    };


    const handleAddClick = async () => {
        setLoading(true);
        console.log("serial Num", serialNumber);
        console.log("Sku", sku);
        console.log("Bulk Serials", bulkSerials);

        try {
            if (selection === "Bulk") {
                const newImeis = bulkSerials.split('\n').filter(serial => serial.trim() !== '');
                const response: any = await create({ serials: newImeis }, { url: VALIDATE_SERIALS });
                console.log("response.data", response.data);

                if (response.success) {
                    setLoading(false);
                    setBulkSerials("");
                    onChange({
                        ...param, serialsOrSkus: [
                            ...param.serialsOrSkus,
                            ...response.data.filter((imei: any) => imei.isAvailable === true).map((imei: any) => ({ serialNo: imei.serial, sku: null }))
                        ]
                    })
                    
                        setnotAvailableSerialsOrSkus([...notAvailableSerialsOrSkus, ...response.data.filter((imei: any) => imei.isAvailable === false).map((imei: any) => ({ serialNo: imei.serial, sku: null }))])
                    // setImeisAndSkus([
                    //     ...imeisAndSkus,
                    //     ...response.data.filter((imei: any) => imei.isAvailable === true).map((imei: any) => ({ serialNo: imei.serial, sku: null }))
                    // ]);

                    console.log("serialsOrSkus", param.serialsOrSkus);
                } else {
                    Swal.fire({
                        text: response.message,
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    setLoading(false);
                }
            } else {
                const response: any = await create({ serials: [serialNumber] }, { url: VALIDATE_SERIALS });
                console.log("response.data", response.data);

                if (response.success) {
                    setLoading(false);

                    onChange({
                        ...param, serialsOrSkus: [
                            ...param.serialsOrSkus,
                            ...response.data.filter((imei: any) => imei.isAvailable === true).map((imei: any) => ({ serialNo: imei.serial, sku: sku !== "" ? sku : null }))
                        ]
                    })
                    setnotAvailableSerialsOrSkus([...notAvailableSerialsOrSkus, ...response.data.filter((imei: any) => imei.isAvailable === false).map((imei: any) => ({ serialNo: imei.serial, sku: null }))])
                    // setImeisAndSkus([
                    //     ...imeisAndSkus,
                    //     ...response.data.filter((imei: any) => imei.isAvailable === true).map((imei: any) => ({ serialNo: imei.serial, sku: sku }))
                    // ]);
                    setSerialNumber("");
                    setSku("");
                    console.log("imeisAndSkus", param.serialsOrSkus);

                } else {
                    Swal.fire({
                        text: response.message,
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    setLoading(false);
                }
            }
        } catch (error: any) {
            Swal.fire({
                text: error.message || "Error creating vendor",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
            });
            setLoading(false);
        }


    };



    return (
        <Col md={6}>
            <div className="text-end">
                <Modal isOpen={isVisible} toggle={addToggle} size="md" centered>
                    <div className="modal-header">
                        <H4 className="modal-title">
                            {products?.find((item: any, i: number) => item._id == product)?.name} - {products?.find((item: any, i: number) => item._id == product)?.productType.toLowerCase()}
                        </H4>
                        <Button
                            color="transprant"
                            className="btn-close"
                            onClick={addToggle}
                        ></Button>
                    </div>
                    <ModalBody style={{ overflow: "hidden", height: "600px" }}>
                        <div style={{ margin: "0px 8px" }}>
                            <Row>
                                <div style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                                    <Input
                                        type="radio"
                                        name="selection"
                                        value="Single"
                                        checked={selection === "Single"}
                                        onChange={handleSelectionChange}
                                        style={{ display: 'none' }}
                                        id="single"
                                    />
                                    <label
                                        htmlFor="single"
                                        style={{
                                            position: 'relative',
                                            paddingLeft: '25px',
                                            marginRight: '20px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            color: '#333'
                                        }}
                                    >
                                        Single
                                        <span
                                            style={{
                                                content: '',
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                width: '18px',
                                                height: '18px',
                                                border: '2px solid black',
                                                borderRadius: '50%',
                                                background: 'white'
                                            }}
                                        />
                                        {selection === 'Single' && (
                                            <span
                                                style={{
                                                    content: '',
                                                    position: 'absolute',
                                                    left: '5px',
                                                    top: '5px',
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: 'red'
                                                }}
                                            />
                                        )}
                                    </label>
                                    <Input
                                        type="radio"
                                        name="selection"
                                        value="Bulk"
                                        checked={selection === "Bulk"}
                                        onChange={handleSelectionChange}
                                        style={{ display: 'none' }}
                                        id="bulk"
                                    />
                                    <label
                                        htmlFor="bulk"
                                        style={{
                                            position: 'relative',
                                            paddingLeft: '25px',
                                            marginRight: '20px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            color: '#333'
                                        }}
                                    >
                                        Bulk
                                        <span
                                            style={{
                                                content: '',
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                width: '18px',
                                                height: '18px',
                                                border: '2px solid black',
                                                borderRadius: '50%',
                                                background: 'white'
                                            }}
                                        />
                                        {selection === 'Bulk' && (
                                            <span
                                                style={{
                                                    content: '',
                                                    position: 'absolute',
                                                    left: '5px',
                                                    top: '5px',
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: 'red'
                                                }}
                                            />
                                        )}
                                    </label>
                                </div>
                            </Row>

                            <hr style={{ marginTop: "0px" }} />

                            {selection === "Single" ? (
                                <>
                                    <Row>
                                        <Col xs={12}>
                                            <div>
                                                <P>
                                                    {purchaseInvoice !== null ? (products?.find((item: any, i: number) => item._id == product)?.productType == "DEVICES" ? "IMEI" : products?.find((item: any, i: number) => item._id == product)?.productType == "SIM" ? "SIM" : products?.find((item: any, i: number) => item._id == product)?.productType == "SENSORS" && "Serial Number"
                                                    ) : (param.type == "DEVICES" ? "IMEI" : param.type == "SIM" ? "SIM" : param.type == "SENSORS" && "Serial Number")}
                                                    <span className="txt-danger">*</span>
                                                </P>
                                            </div>
                                            <Input
                                                type="text"
                                                placeholder={`Enter ${purchaseInvoice !== null ? (products?.find((item: any, i: number) => item._id == product)?.productType == "DEVICES" ? "IMEI" : products?.find((item: any, i: number) => item._id == product)?.productType == "SIM" ? "SIM" : products?.find((item: any, i: number) => item._id == product)?.productType == "SENSORS" && "Serial Number"
                                                ) : (param.type == "DEVICES" ? "IMEI" : param.type == "SIM" ? "SIM" : param.type == "SENSORS" && "Serial Number")}`}
                                                value={serialNumber}
                                                onChange={(e) => setSerialNumber(e.target.value)}
                                            />
                                        </Col>
                                        <Col xs={12} style={{ marginTop: "10px" }}>
                                            <div>
                                                <P>
                                                    {purchaseInvoice !== null ? (products?.find((item: any, i: number) => item._id == product)?.productType == "DEVICES" ? "ID" : products?.find((item: any, i: number) => item._id == product)?.productType == "SIM" ? "ICCID" : products?.find((item: any, i: number) => item._id == product)?.productType == "SENSORS" && "Sku"
                                                    ) : (param.type == "DEVICES" ? "ID" : param.type == "SIM" ? "ICCID" : param.type == "SENSORS" && "Sku")}
                                                    <span className="txt-danger">*</span>
                                                </P>
                                            </div>
                                            <Input
                                                type="text"
                                                placeholder={`Enter ${purchaseInvoice !== null ? (products?.find((item: any, i: number) => item._id == product)?.productType == "DEVICES" ? "ID" : products?.find((item: any, i: number) => item._id == product)?.productType == "SIM" ? "ICCID" : products?.find((item: any, i: number) => item._id == product)?.productType == "SENSORS" && "Sku"
                                                ) : (param.type == "DEVICES" ? "ID" : param.type == "SIM" ? "ICCID" : param.type == "SENSORS" && "Sku")}`}
                                                value={sku}
                                                onChange={(e) => setSku(e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                </>
                            ) : (
                                <Row>
                                    <Col xs={12}>
                                        <div>
                                            <P>
                                                Serial Numbers
                                                <span className="txt-danger">*</span>
                                            </P>
                                        </div>
                                        <Input
                                            type="textarea"
                                            placeholder="Enter Serial Numbers"
                                            style={{ height: "150px" }}
                                            value={bulkSerials}
                                            onChange={(e) => setBulkSerials(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            )}

                            <Row className="g-3" style={{ marginTop: "1px" }}>
                                <div style={{ display: "flex", justifyContent: "end" }}>
                                    <Button
                                        color="primary"
                                        disabled={serialNumber.length == 0 && sku.length == 0 && bulkSerials.length == 0}
                                        onClick={handleAddClick}
                                    >
                                        {loading ? "Loading..." : "Add"}
                                    </Button>
                                </div>
                            </Row>

                            <hr style={{ marginTop: "10px" }} />
                            <div style={{
                                display: "flex",
                                justifyContent: "end"
                            }}>
                                <P>
                                    <span style={{
                                        fontWeight: "bold"
                                    }}>Total: &nbsp;</span>
                                    <span style={{
                                        marginRight: "8px"
                                    }}> {quantity}</span>
                                </P>
                                <P>
                                    <span style={{
                                        fontWeight: "bold"
                                    }}>Scan: &nbsp;</span>
                                    <span> {param.serialsOrSkus.length}</span>
                                </P>
                            </div>
                            {notAvailableSerialsOrSkus.length > 0 && <>
                                <hr style={{ margin: "0px" }} />
                                <div style={{ overflowY: "auto", scrollbarWidth: 'none' }}> {/* Wrap the table in a div with fixed height */}
                                    <table style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "30%" }}>{purchaseInvoice !== null ? (products?.find((item: any, i: number) => item._id == product)?.productType == "DEVICES" ? "IMEI" : products?.find((item: any, i: number) => item._id == product)?.productType == "SIM" ? "SIM" : products?.find((item: any, i: number) => item._id == product)?.productType == "SENSORS" && "Serial Number"
                                                ) : (param.type == "DEVICES" ? "IMEI" : param.type == "SIM" ? "SIM" : param.type == "SENSORS" && "Serial Number")}</th>
                                                <th style={{ width: "30%" }}>{purchaseInvoice !== null ? (products?.find((item: any, i: number) => item._id == product)?.productType == "DEVICES" ? "ID" : products?.find((item: any, i: number) => item._id == product)?.productType == "SIM" ? "ICCID" : products?.find((item: any, i: number) => item._id == product)?.productType == "SENSORS" && "Sku"
                                                ) : (param.type == "DEVICES" ? "ID" : param.type == "SIM" ? "ICCID" : param.type == "SENSORS" && "Sku")}</th>
                                                <th style={{ width: "20%" }}>Availability</th>
                                                <th style={{ width: "20%" }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                notAvailableSerialsOrSkus.map((item: any, i: number) => (
                                                    <tr key={i} style={{ lineHeight: "5px" }}>
                                                        <td style={{ width: "30%" }}>{item.serialNo}</td>
                                                        <td style={{ width: "25%" }}>{item.sku}</td>
                                                        <td style={{ width: "25%", color: "red" }}>Not Available</td>
                                                        <td style={{ width: "10%" }}>
                                                            <MdDelete size={20} color="red" style={{ cursor: "pointer" }} onClick={() => onChange({ ...param, imeisAndSkus: param.serialsOrSkus.filter((e: any, i: number) => e.serialNo !== item.serialNo) })} />
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </>}
                            <hr style={{ margin: "0px" }} />
                            <div style={{ height: "230px", overflowY: "auto", scrollbarWidth: 'none' }}> {/* Wrap the table in a div with fixed height */}
                                <table style={{ width: "100%" }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "30%" }}>{purchaseInvoice !== null ? (products?.find((item: any, i: number) => item._id == product)?.productType == "DEVICES" ? "IMEI" : products?.find((item: any, i: number) => item._id == product)?.productType == "SIM" ? "SIM" : products?.find((item: any, i: number) => item._id == product)?.productType == "SENSORS" && "Serial Number"
                                            ) : (param.type == "DEVICES" ? "IMEI" : param.type == "SIM" ? "SIM" : param.type == "SENSORS" && "Serial Number")}</th>
                                            <th style={{ width: "30%" }}>{purchaseInvoice !== null ? (products?.find((item: any, i: number) => item._id == product)?.productType == "DEVICES" ? "ID" : products?.find((item: any, i: number) => item._id == product)?.productType == "SIM" ? "ICCID" : products?.find((item: any, i: number) => item._id == product)?.productType == "SENSORS" && "Sku"
                                            ) : (param.type == "DEVICES" ? "ID" : param.type == "SIM" ? "ICCID" : param.type == "SENSORS" && "Sku")}</th>
                                            <th style={{ width: "20%" }}>Availability</th>
                                            <th style={{ width: "20%" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            param.serialsOrSkus.map((item: any, i: number) => (
                                                <tr key={i} style={{ lineHeight: "5px" }}>
                                                    <td style={{ width: "30%" }}>{item.serialNo}</td>
                                                    <td style={{ width: "30%" }}>{item.sku}</td>
                                                    <td style={{ width: "20%", color: "green" }}>Available</td>
                                                    <td style={{ width: "10%" }}>
                                                        <MdDelete size={20} color="red" style={{ cursor: "pointer" }} onClick={() => onChange({ ...param, imeisAndSkus: param.serialsOrSkus.filter((e: any, i: number) => e.serialNo !== item.serialNo) })} />
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        </Col>
    );
};

export default AddSerialNumbersModel;
