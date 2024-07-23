import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { SaleLeadsDataType, supportColumns } from "./Type/Type";
import { PlusCircle } from "react-feather";

const ExpensesTable = () => {
    const dispatch = useDispatch();
    // Function to transform supportData into allBugReports format
    const { bugReports } = useSelector((state: any) => state.support);
    const { userPermissions } = useSelector(
        (state: any) => state.userPermissions
    );
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
    var support = userPermissions.find((item: any) => item.title === "Support");
    // console.log("support", support);
    const supportData = () => {
        return bugReports?.filter(
            (item: any) =>
                item?.ticketId.toLowerCase().split("-")[1].includes(searchValue) ||
                item?.name.toLowerCase().includes(searchValue) ||
                item?.user.emailAddress.toLowerCase().includes(searchValue)
        )
            .map((item: any) => ({
                ticket_id: item?._id,
                id: item?.ticketId,
                username: item?.user?.fullName,
                email: item?.user?.emailAddress,
                ticket_name: item?.name,
                description: item?.description,
                isActive: item?.isActive ? "true" : "false",
                status: item?.status,
                priorty: item?.priorty == null ? "N/A" : item?.priorty,
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
        setData(supportData());
    }, [searchValue]);

    const handleSearch = (e: any) => {
        const searchKey = e.target.value.toLowerCase();
        setSearchValue(searchKey);
    };

    // console.log("allBugReports", supportData());
    useEffect(() => {
        setData(supportData());
    }, [bugReports]);

    const navigate = useNavigate();
    // const history = useHistory();
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleDelete, setToggleDelete] = useState(false);
    const [data, setData] = useState(supportData());

    const handleRowSelected = useCallback((state: any) => {
        setSelectedRows(state.selectedRows);
    }, []);

    const handleDelete = () => {
        if (
            window.confirm(
                `Are you sure you want to delete:\r ${selectedRows.map(
                    (r: SaleLeadsDataType) => r.id
                )}?`
            )
        ) {
            setToggleDelete(!toggleDelete);
            setData(
                data.filter((item: any) =>
                    selectedRows.filter((elem: SaleLeadsDataType) => elem.id === item.id)
                        .length > 0
                        ? false
                        : true
                )
            );
            setSelectedRows([]);
        }
    };

    const handleRowClicked = (row: any) => {
        navigate(
            `${process.env.PUBLIC_URL}/support/ticketDetails/${row.ticket_id}`
        );
    };
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
                    // onClick={() => {
                    //     setComponent("New Lead")
                    // }}
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
                columns={supportColumns}
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
        </div>
    );
};

export default ExpensesTable;
