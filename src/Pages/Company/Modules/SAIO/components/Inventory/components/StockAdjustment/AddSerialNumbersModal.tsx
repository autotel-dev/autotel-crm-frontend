import React, { useEffect, useState } from "react";
import { Col, Button, Modal, ModalBody, Input, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { MdDelete, MdEdit } from "react-icons/md";
import { create } from "../../../../../../../../Utilities/api";
import { VALIDATE_SERIALS } from "../../../../../../../../Utilities/api/apiEndpoints";
import { H4, P } from "../../../../../../../../AbstractElements";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: any;
  product: string;
  quantity: string;
  items: any;
  setItems: any;
  notAvailableSerialsOrSkus: any;
  setnotAvailableSerialsOrSkus: any;
  inventoryItems: any;
}

const AddSerialNumbersModel: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  product,
  quantity,
  items,
  setItems,
  notAvailableSerialsOrSkus,
  setnotAvailableSerialsOrSkus,
  inventoryItems,
}) => {
  const { products } = useSelector((state: any) => state.stockAdjustment);
  const [serialNumber, setSerialNumber] = useState("");
  const [sku, setSku] = useState("");
  const [bulkSerials, setBulkSerials] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editedIndex, setEditedIndex] = useState(0);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState("Single"); // Added state for selection
  const addToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == "Bulk") {
      setSerialNumber("");
      setSku("");
    } else {
      setBulkSerials("");
    }
    setSelection(e.target.value);
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const response: any = await create(
        { serials: [serialNumber] },
        { url: VALIDATE_SERIALS }
      );
      // console.log("response.data", response.data);

      if (response.success) {
        setLoading(false);
        setIsEdit(false);
        setEditedIndex(0);

        setItems([
          ...items.slice(0, editedIndex), // Take elements up to editedIndex (excluding it)
          ...response.data
            .filter((imei: any) => imei.isAvailable === false)
            .map((imei: any) => ({
              serialNo: imei.serial,
              sku: sku !== "" ? sku : null,
            })),
          ...items.slice(editedIndex + 1), // Take elements after the editedIndex (skipping it)
        ]);

        setnotAvailableSerialsOrSkus([
          ...notAvailableSerialsOrSkus,
          ...response.data
            .filter((imei: any) => imei.isAvailable === false)
            .map((imei: any) => ({ serialNo: imei.serial, sku: null })),
        ]);

        setSerialNumber("");
        setSku("");
        setBulkSerials("");
      } else {
        Swal.fire({
          text: response.message,
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
        setIsEdit(false);
        setEditedIndex(0);
      }
    } catch (error: any) {
      Swal.fire({
        text: error.message,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };

  const handleAddClick = async () => {
    // setLoading(true);
    const presentItems: any = [];
    const notPresentItems: any = [];

    if (selection === "Bulk") {
      const newImeis = bulkSerials
        .split("\n")
        .filter((serial) => serial.trim() !== "");

      // Iterate over the newImeis array
      newImeis.forEach((imei) => {
        // Check if the IMEI matches any inventory's serial number
        const matchedInventory = inventoryItems.find(
          (item: any) => item.serialNumber === imei
        );

        if (matchedInventory) {
          // If a match is found, push it to presentItems with serialNumber, sku, and id
          presentItems.push({
            serialNumber: matchedInventory.serialNumber,
            sku: matchedInventory.sku,
            id: matchedInventory._id,
          });
        } else {
          // If no match is found, push it to notPresentItems
          notPresentItems.push({
            serialNumber: imei,
            sku: null,
            id: null,
          });
        }
      });

      // console.log("Present Items:", presentItems);
      // console.log("Not Present Items:", notPresentItems);

      setItems([
        ...items,
        ...presentItems
          .slice(0, Number(quantity) - items.length)
          .map((imei: any) => ({ ...imei })),
      ]);
      setnotAvailableSerialsOrSkus([
        ...notAvailableSerialsOrSkus,
        ...notPresentItems.map((imei: any) => ({ ...imei })),
      ]);
      setBulkSerials("");
    } else {
      const matchedInventory = inventoryItems.find(
        (item: any) => item.serialNumber === serialNumber
      );
      if (matchedInventory) {
        // If a match is found, push it to presentItems with serialNumber, sku, and id
        presentItems.push({
          serialNumber: matchedInventory.serialNumber,
          sku: matchedInventory.sku,
          id: matchedInventory._id,
        });
      } else {
        // If no match is found, push it to notPresentItems
        notPresentItems.push({
          serialNumber: serialNumber,
          sku: null,
          id: null,
        });
      }

      setItems([
        ...items,
        ...presentItems
          .slice(0, Number(quantity) - items.length)
          .map((imei: any) => ({ ...imei })),
      ]);
      setnotAvailableSerialsOrSkus([
        ...notAvailableSerialsOrSkus,
        ...notPresentItems.map((imei: any) => ({ ...imei })),
      ]);
      setSerialNumber("");
      setSku("");
    }
  };

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">
              {
                products?.find((item: any, i: number) => item._id == product)
                  ?.name
              }{" "}
              -{" "}
              {products
                ?.find((item: any, i: number) => item._id == product)
                ?.productType.toLowerCase()}
            </H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody style={{ overflow: "hidden", height: "600px" }}>
            <div style={{ margin: "0px 8px" }}>
              {items.length < quantity && (
                <>
                  <Row>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <Input
                        type="radio"
                        name="selection"
                        value="Single"
                        checked={selection === "Single"}
                        onChange={handleSelectionChange}
                        style={{ display: "none" }}
                        id="single"
                      />
                      <label
                        htmlFor="single"
                        style={{
                          position: "relative",
                          paddingLeft: "25px",
                          marginRight: "20px",
                          cursor: "pointer",
                          fontSize: "16px",
                          color: "#333",
                        }}
                      >
                        Single
                        <span
                          style={{
                            content: "",
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "18px",
                            height: "18px",
                            border: "2px solid black",
                            borderRadius: "50%",
                            background: "white",
                          }}
                        />
                        {selection === "Single" && (
                          <span
                            style={{
                              content: "",
                              position: "absolute",
                              left: "5px",
                              top: "5px",
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "red",
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
                        style={{ display: "none" }}
                        id="bulk"
                      />
                      <label
                        htmlFor="bulk"
                        style={{
                          position: "relative",
                          paddingLeft: "25px",
                          marginRight: "20px",
                          cursor: "pointer",
                          fontSize: "16px",
                          color: "#333",
                        }}
                      >
                        Bulk
                        <span
                          style={{
                            content: "",
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "18px",
                            height: "18px",
                            border: "2px solid black",
                            borderRadius: "50%",
                            background: "white",
                          }}
                        />
                        {selection === "Bulk" && (
                          <span
                            style={{
                              content: "",
                              position: "absolute",
                              left: "5px",
                              top: "5px",
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "red",
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
                              {products?.find(
                                (item: any, i: number) => item._id == product
                              )?.productType == "DEVICES"
                                ? "IMEI"
                                : products?.find(
                                    (item: any, i: number) =>
                                      item._id == product
                                  )?.productType == "SIM"
                                ? "SIM"
                                : products?.find(
                                    (item: any, i: number) =>
                                      item._id == product
                                  )?.productType == "SENSORS" &&
                                  "Serial Number"}
                              <span className="txt-danger">*</span>
                            </P>
                          </div>
                          <Input
                            type="text"
                            placeholder={`Enter ${
                              products?.find(
                                (item: any, i: number) => item._id == product
                              )?.productType == "DEVICES"
                                ? "IMEI"
                                : products?.find(
                                    (item: any, i: number) =>
                                      item._id == product
                                  )?.productType == "SIM"
                                ? "SIM"
                                : products?.find(
                                    (item: any, i: number) =>
                                      item._id == product
                                  )?.productType == "SENSORS" && "Serial Number"
                            }
                        `}
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                          />
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <Row>
                      <Col xs={12}>
                        <div>
                          <P>
                            {products?.find(
                              (item: any, i: number) => item._id == product
                            )?.productType == "DEVICES"
                              ? "IMEI"
                              : products?.find(
                                  (item: any, i: number) => item._id == product
                                )?.productType == "SIM"
                              ? "SIM"
                              : products?.find(
                                  (item: any, i: number) => item._id == product
                                )?.productType == "SENSORS" &&
                                "Serial Number"}{" "}
                            Numbers
                            <span className="txt-danger">*</span>
                          </P>
                        </div>
                        <Input
                          type="textarea"
                          placeholder={`Enter ${
                            products?.find(
                              (item: any, i: number) => item._id == product
                            )?.productType == "DEVICES"
                              ? "IMEI"
                              : products?.find(
                                  (item: any, i: number) => item._id == product
                                )?.productType == "SIM"
                              ? "SIM"
                              : products?.find(
                                  (item: any, i: number) => item._id == product
                                )?.productType == "SENSORS" && "Serial Number"
                          } Numbers`}
                          style={{ height: "150px" }}
                          value={bulkSerials}
                          onChange={(e) => setBulkSerials(e.target.value)}
                        />
                      </Col>
                    </Row>
                  )}

                  {(items.length < quantity || isEdit) && (
                    <Row className="g-3" style={{ marginTop: "1px" }}>
                      <div style={{ display: "flex", justifyContent: "end" }}>
                        {isEdit && (
                          <Button
                            color="secondary"
                            style={{ marginRight: "10px" }}
                            onClick={() => {
                              setLoading(false);
                              setSerialNumber("");
                              setSku("");
                              setBulkSerials("");
                              setIsEdit(false);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          color="primary"
                          disabled={
                            serialNumber?.length == 0 &&
                            sku?.length == 0 &&
                            bulkSerials?.length == 0
                          }
                          onClick={isEdit ? handleEdit : handleAddClick}
                        >
                          {loading ? "Loading..." : isEdit ? "Edit" : "Add"}
                        </Button>
                      </div>
                    </Row>
                  )}
                </>
              )}

              <hr style={{ marginTop: "10px" }} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <P>
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Total: &nbsp;
                  </span>
                  <span
                    style={{
                      marginRight: "8px",
                    }}
                  >
                    {" "}
                    {quantity}
                  </span>
                </P>
                <P>
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Scan: &nbsp;
                  </span>
                  <span> {items.length}</span>
                </P>
              </div>
              {notAvailableSerialsOrSkus.length > 0 && (
                <>
                  <hr style={{ margin: "0px" }} />
                  <div style={{ overflowY: "auto", scrollbarWidth: "none" }}>
                    {" "}
                    {/* Wrap the table in a div with fixed height */}
                    <table style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th style={{ width: "50%", textAlign: "center" }}>
                            {products?.find(
                              (item: any, i: number) => item._id == product
                            )?.productType == "DEVICES"
                              ? "IMEI"
                              : products?.find(
                                  (item: any, i: number) => item._id == product
                                )?.productType == "SIM"
                              ? "SIM"
                              : products?.find(
                                  (item: any, i: number) => item._id == product
                                )?.productType == "SENSORS" && "Serial Number"}
                          </th>
                          {/* <th style={{ width: "30%" }}>{products?.find((item: any, i: number) => item._id == product)?.productType == "DEVICES" ? "ID" : products?.find((item: any, i: number) => item._id == product)?.productType == "SIM" ? "ICCID" : products?.find((item: any, i: number) => item._id == product)?.productType == "SENSORS" && "Sku"}</th> */}
                          <th style={{ width: "30%", textAlign: "center" }}>
                            Availability
                          </th>
                          <th style={{ width: "20%", textAlign: "center" }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {notAvailableSerialsOrSkus.map(
                          (item: any, i: number) => (
                            <tr key={i} style={{ lineHeight: "5px" }}>
                              <td style={{ width: "50%", textAlign: "center" }}>
                                {item?.serialNumber}
                              </td>
                              {/* <td style={{ width: "25%" }}>{item?.sku}</td> */}
                              <td
                                style={{
                                  width: "30%",
                                  color: "red",
                                  textAlign: "center",
                                }}
                              >
                                Not Available
                              </td>
                              <td style={{ width: "20%", textAlign: "center" }}>
                                <MdDelete
                                  size={18}
                                  color="red"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    setnotAvailableSerialsOrSkus([
                                      ...notAvailableSerialsOrSkus.filter(
                                        (e: any, i: number) =>
                                          e.serialNumber !== item.serialNumber
                                      ),
                                    ])
                                  }
                                />
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {notAvailableSerialsOrSkus.length > 0 && (
                <div
                  style={{
                    height: "30px",
                  }}
                ></div>
              )}
              <hr style={{ margin: "0px", padding: "0px" }} />
              <div
                style={{
                  height: "230px",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                {" "}
                {/* Wrap the table in a div with fixed height */}
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "50%", textAlign: "center" }}>
                        {products?.find(
                          (item: any, i: number) => item._id == product
                        )?.productType == "DEVICES"
                          ? "IMEI"
                          : products?.find(
                              (item: any, i: number) => item._id == product
                            )?.productType == "SIM"
                          ? "SIM"
                          : products?.find(
                              (item: any, i: number) => item._id == product
                            )?.productType == "SENSORS" && "Serial Number"}
                      </th>
                      {/* <th style={{ width: "30%" }}>{products?.find((item: any, i: number) => item._id == product)?.productType == "DEVICES" ? "ID" : products?.find((item: any, i: number) => item._id == product)?.productType == "SIM" ? "ICCID" : products?.find((item: any, i: number) => item._id == product)?.productType == "SENSORS" && "Sku"}</th> */}
                      <th style={{ width: "30%", textAlign: "center" }}>
                        Availability
                      </th>
                      <th style={{ width: "20%", textAlign: "center" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any, i: number) => (
                      <tr key={i} style={{ lineHeight: "5px" }}>
                        <td style={{ width: "50%", textAlign: "center" }}>
                          {item?.serialNumber}
                        </td>
                        {/* <td style={{ width: "30%" }}>{item?.sku}</td> */}
                        <td
                          style={{
                            width: "30%",
                            color: "green",
                            textAlign: "center",
                          }}
                        >
                          Available
                        </td>
                        <td style={{ width: "20%", textAlign: "center" }}>
                          <MdEdit
                            size={18}
                            color="green"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setEditedIndex(i);
                              setSerialNumber(item.serialNumber);
                              setSku(item.sku);
                              // setBulkSerials(item.serialNo)
                              setSelection("Single");
                              setIsEdit(true);
                            }}
                          />
                          <MdDelete
                            size={18}
                            color="red"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setItems([
                                ...items.filter(
                                  (e: any, i: number) =>
                                    e.serialNumber !== item.serialNumber
                                ),
                              ])
                            }
                          />
                        </td>
                      </tr>
                    ))}
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
