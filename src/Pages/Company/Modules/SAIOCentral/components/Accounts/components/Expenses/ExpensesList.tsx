import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { ExpensesDataType, expensesColumns } from "./Type/Type";
import { PlusCircle } from "react-feather";
import { getAll } from "../../../../../../../../Utilities/api";
import { GET_ALL_BANK_ACCOUNTS, GET_ALL_EXPENSE_ACCOUNTS } from "../../../../../../../../Utilities/api/apiEndpoints";
import { setBankAccounts, setExpense, setExpenseAccounts } from "../../../../../../../../ReaduxToolkit/Reducer/ExpensesSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import deleteAlert from "../../../../../../../../Utilities/alerts/DeleteAlert";

interface ExpensesTableProps {
    iscreateNewExpenses: boolean;
    setIscreateNewExpenses: any
}

const ExpensesTable: React.FC<ExpensesTableProps> = ({
    iscreateNewExpenses,
    setIscreateNewExpenses,
}) => {
    const dispatch = useDispatch();
    // Function to transform expensesData into allBugReports format
    const { expenses } = useSelector((state: any) => state.expenses);

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
    const expensesData = () => {
        return expenses?.filter(
            (item: any) =>
                item?.expenseNumber.toLowerCase().split("-")[1].includes(searchValue) ||
                item?.company.toLowerCase().includes(searchValue)
        )
            .map((item: any) => ({
                id: item?._id,
                expenseNumber: item?.expenseNumber,
                payFrom: item?.payFrom?.name,
                user: item?.company?.fullName,
                reference: item?.reference,
                totalAmount: item?.totalAmount,
                attachement: item?.attachement,
                expenseItems: item?.expenseItems,
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

    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        setData(expensesData());
    }, [searchValue]);

    const handleSearch = (e: any) => {
        const searchKey = e.target.value.toLowerCase();
        setSearchValue(searchKey);
    };

    // console.log("allBugReports", expensesData());
    useEffect(() => {
        setData(expensesData());
    }, [expenses]);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [toggleDelete, setToggleDelete] = useState(false);
    const [data, setData] = useState(expensesData());

    const handleRowSelected = (state: any) => {
        setSelectedRows(state.selectedRows);
        console.log(state.selectedRows);
    };

    // const handleDelete = () => {
    //     if (
    //         window.confirm(
    //             `Are you sure you want to delete:\r ${selectedRows.map(
    //                 (r: SaleLeadsDataType) => r.id
    //             )}?`
    //         )
    //     ) {
    //         setToggleDelete(!toggleDelete);
    //         setData(
    //             data.filter((item: any) =>
    //                 selectedRows.filter((elem: SaleLeadsDataType) => elem.id === item.id)
    //                     .length > 0
    //                     ? false
    //                     : true
    //             )
    //         );
    //         setSelectedRows([]);
    //     }
    // };

    const handleRowClicked = (row: any) => {
        dispatch(setExpense(row))
        setIscreateNewExpenses(true)

    };


    useEffect(() => {
        // Fetch countries and cities from API
        getAll({ url: GET_ALL_BANK_ACCOUNTS }).then((data: any) => {
            if (data?.success) {
                dispatch(setBankAccounts(data.data));
            }
        });

        getAll({ url: GET_ALL_EXPENSE_ACCOUNTS }).then((data: any) => {
            if (data?.success) {
                dispatch(setExpenseAccounts(data.data));
            }
        });
    }, []);


    return (
        <div className="table-responsive support-table" style={{ overflow: "auto", scrollbarWidth: "none" }}>

            <Row>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    paddingRight: "25px"
                }}>
                    <button
                        className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""
                            }`}
                        style={{
                            color: "white",
                            backgroundColor: `${userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor
                                }`,
                            display: "flex",
                            alignItems: "center",

                        }}
                        onClick={() => {
                            dispatch(setExpense(null))
                            setIscreateNewExpenses(true)
                        }}
                    >
                        <PlusCircle size={18} style={{
                            marginRight: "5px"
                        }} />
                        Create New Expense
                    </button>
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

            <DataTable
                columns={expensesColumns}
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
                        const type = "expensesType";
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
    );
};

export default ExpensesTable;
