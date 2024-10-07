import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import CreateNewStockAdjustmentType from "./components/CreateNewStockAdjustmentTypeModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import deleteAlert from "../../../../../../../../Utilities/alerts/DeleteAlert";
import UpdateStockAdjustmentType from "./components/UpdateNewStockAdjustmentTypeModal";
import { formatUnderscoredString } from "../../../../../../../../Utilities/globals/globals";


const StockAdjustmentTypesTable = () => {
    // Function to transform supportData into allBugReports format
    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [toggleDelete, setToggleDelete] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedAdjustmentType, setSelectedAdjustmentType] = useState<any>(null);
    const { stockAdjustmentTypes } = useSelector((state: any) => state.stockAdjustmentTypes);

    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    function hexToRgb(hex: any) {
        // Remove the hash sign if present
        hex = hex?.replace(/^#/, '');
        // Parse the hex values to RGB
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    // Usage
    const hexColor = "#ff0000"; // Example hex color
    const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor); // Convert hex to RGB
    // console.log("support", support);
    const stockAdjustmentTypesData = () => {
        return stockAdjustmentTypes?.filter(
            (item: any) =>
                item?.name.toLowerCase().includes(searchValue)
        )
            .map((item: any, index: any) => ({
                index: index + 1,
                ...item,

            }));
    };



    useEffect(() => {
        setData(stockAdjustmentTypesData());
    }, [searchValue]);

    const handleSearch = (e: any) => {
        const searchKey = e.target.value.toLowerCase();
        setSearchValue(searchKey);
    };

    // console.log("allBugReports", supportData());
    useEffect(() => {
        setData(stockAdjustmentTypesData());
    }, [stockAdjustmentTypes]);

    const navigate = useNavigate();

    const [data, setData] = useState(stockAdjustmentTypesData());

    const handleRowSelected = useCallback((state: any) => {
        setSelectedRows(state.selectedRows);
    }, []);


    const handleRowClicked = (row: any) => {
        setSelectedAdjustmentType(row);
        setIsUpdateModalOpen(true);
    };
    return (
        <div className="table-responsive support-table" style={{ overflow: "auto", scrollbarWidth: "none" }}>

            <Row>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    paddingRight: "25px"
                }}>

                    <CreateNewStockAdjustmentType />

                </div>
            </Row>
            <Row style={{ display: "flex", alignItems: "center" }}>
                <Col
                    sm={12}
                    md={
                        12
                    }
                    lg={
                        12
                    }
                    xl={
                        12
                    }
                >
                    <input
                        className="global-search-field"
                        type="text"
                        placeholder="Type to Search.."
                        value={searchValue}
                        onChange={(e) => {
                            handleSearch(e);
                        }}

                    />
                </Col>

            </Row>
            <div>
                <DataTable
                    columns={
                        [
                            {
                                name: (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "start",
                                            paddingLeft: "0px ",
                                        }}
                                    >
                                        {selectedRows.length > 0 && (
                                            <FontAwesomeIcon
                                                icon={faTrashAlt}
                                                // onClick={handleDelete}
                                                onClick={() => {
                                                    // // console.log("345678");
                                                    // var alertData = {
                                                    //     title: "Are you sure?",
                                                    //     text: "Once deleted, you will not be able to recover this ",
                                                    // };
                                                    // const type = "vendorType";
                                                    // deleteAlert(
                                                    //     alertData,
                                                    //     selectedRows[0]._id,
                                                    //     type,
                                                    //     dispatch
                                                    // ).then(() => {
                                                    //     console.log("empty");

                                                    //     setSelectedRows([]);
                                                    // });
                                                }}
                                                style={{
                                                    cursor: "pointer",
                                                    color: "red",
                                                    marginRight: "20px",
                                                    paddingLeft: "0px",
                                                }}
                                            />
                                        )}
                                        S.No.
                                    </div>
                                ),
                                selector: (row: any) => row.index,
                                sortable: true,
                                width: "10%",
                                // center: true,
                                cell: (row: any) => (
                                    <div
                                        style={{
                                            // textAlign: "center",
                                            paddingLeft: "10px",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        {row.index}
                                    </div>
                                ),
                            },

                            {
                                name: "Date",
                                selector: (row: any) => "",
                                sortable: true,
                                width: "18%",
                                cell: (row: any) => (
                                    <div
                                    >
                                        {row?.createdAt.toString().slice(0, 10)}, {new Date(
                                            row?.createdAt
                                        )
                                            .toLocaleString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            })
                                            .toString()}
                                    </div>
                                )

                            },
                            {
                                name: "ID",
                                selector: (row: any) => row.index,
                                sortable: true,
                                width: "15%",
                                cell: (row: any) => (
                                    <div
                                        style={{

                                            borderRadius: "5px",
                                        }}
                                    >
                                        SAT - {row.index}
                                    </div>
                                )
                            },
                            {
                                name: "User",
                                selector: (row: any) => `${row?.user !== null ? row?.user?.fullName : "N/A"}`,
                                sortable: true,
                                // center: true,
                                width: "15%", // Set the width for this column

                            },
                            {
                                name: "Name",
                                selector: (row: any) => row.name,
                                sortable: true,
                                center: true
                            },
                            {
                                name: "Availability",
                                selector: (row: any) => `${row?.availability ? "Yes" : "No"}`,
                                sortable: true,
                                center: true
                            },

                        ]
                    }
                    data={data}
                    // striped={true}
                    pagination
                    selectableRows
                    onSelectedRowsChange={handleRowSelected}
                    onRowClicked={handleRowClicked} // Pass the event handler for row clicks
                    clearSelectedRows={toggleDelete}
                    style={{
                        cursor: "pointer",
                    }}
                    className="custom-data-table" // Add a class to your DataTable for styling
                    // You can add more props as needed
                    customStyles={{
                        rows: {
                            style: {
                                cursor: "pointer",
                                transition: "background-color 0.2s", // Smooth transition for background color change
                                "&:hover": { // Define hover style
                                    backgroundColor: `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`,
                                },
                            },
                        },
                        head: {
                            style: {
                                fontWeight: "bold",
                                fontSize: "13px",
                            },
                        },
                    }}
                />
                <style>
                    {`
       .custom-data-table thead th {
        text-align: center !important;
      }
      `}
                </style>
                {selectedRows.length > 0 &&
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                        // onClick={handleDelete}
                        onClick={() => {
                            // console.log("345678");
                            var alertData = {
                                title: "Are you sure?",
                                text: "Once deleted, you will not be able to recover this ",
                            };
                            const type = "bankAccountsType";
                            deleteAlert(
                                alertData,
                                selectedRows[0].id,
                                type,
                                dispatch
                            ).then((data) => {
                                console.log("data", data);
                                setSelectedRows([]);
                            }).catch((dataa) => {
                                console.log("data", dataa);
                            });
                        }}
                        style={{
                            cursor: "pointer",
                            color: "red",
                            position: "absolute",
                            left: "65px",
                            top: "140px"
                        }}
                    />
                }

            </div>


            {selectedAdjustmentType && (
                <UpdateStockAdjustmentType
                    isVisible={isUpdateModalOpen}
                    setIsVisible={setIsUpdateModalOpen}
                    selectedAdjustmentType={selectedAdjustmentType}
                />
            )}
        </div>
    );
};

export default StockAdjustmentTypesTable;
