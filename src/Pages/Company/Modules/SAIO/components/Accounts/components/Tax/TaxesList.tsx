import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { taxColumns } from "./Type/Type";
import { PlusCircle } from "react-feather";
import { getAll } from "../../../../../../../../Utilities/api";
import { GET_ALL_ACCOUNT_TYPES } from "../../../../../../../../Utilities/api/apiEndpoints";
import { setAccountTypes } from "../../../../../../../../ReaduxToolkit/Reducer/BankAccountSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import deleteAlert from "../../../../../../../../Utilities/alerts/DeleteAlert";
import CreateNewTax from "./components/CreateTaxModal";
import UpdateTax from "./components/UpdateTaxModal";


const TaxTable = () => {
    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [toggleDelete, setToggleDelete] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTax, setSelectedTax] = useState<any>(null);
    // Function to transform supportData into allBugReports format
    const { taxes } = useSelector((state: any) => state.taxes);

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

    const taxesData = () => {
        console.log("taxes", taxes);

        return taxes?.filter(
            (item: any) =>
                item?._id.toLowerCase().includes(searchValue) ||
                item?.name.toLowerCase().includes(searchValue)
        )
            .map((item: any) => ({
                id: item?._id,
                user: item?.company.fullName,
                title: item?.title,
                percentage: item?.percentage,
                isActive: item?.isActive ? "true" : "false",
                date: `${item?.updatedAt.toString().slice(0, 10)},  ${new Date(
                    item?.updatedAt
                )
                    .toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })
                    .toString()}`,
            }));
    };


    useEffect(() => {
        setData(taxesData());
    }, [searchValue]);

    const handleSearch = (e: any) => {
        const searchKey = e.target.value.toLowerCase();
        setSearchValue(searchKey);
    };

    // console.log("allBugReports", supportData());
    useEffect(() => {
        setData(taxesData());
    }, [taxes]);

    const navigate = useNavigate();


    const [data, setData] = useState(taxesData());

    const handleRowSelected = (state: any) => {
        setSelectedRows(state.selectedRows);
        console.log(state.selectedRows);
    };

    //   const handleDelete = () => {
    //     if (
    //       window.confirm(
    //         `Are you sure you want to delete:\r ${selectedRows
    //           .map((r: any) => r.vendorName)
    //           .join(", ")}?`
    //       )
    //     ) {
    //       setToggleDelete(!toggleDelete);
    // setData(
    //   data.filter((item: any) =>
    //     selectedRows.filter((elem: any) => elem._id === item._id).length > 0
    //       ? false
    //       : true
    //   )
    // );
    // setSelectedRows([]);
    //     }
    //   };

    const handleRowClicked = (row: any) => {
        setSelectedTax(row);
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
                    <CreateNewTax />
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
                    columns={[...taxColumns]}
                    data={data}
                    // striped={true}
                    pagination
                    selectableRows={selectedRows.length >= 0}
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


            {selectedTax && (
                <UpdateTax
                    isVisible={isUpdateModalOpen}
                    setIsVisible={setIsUpdateModalOpen}
                    selectedTax={selectedTax}
                />
            )}
        </div>
    );
};

export default TaxTable;
