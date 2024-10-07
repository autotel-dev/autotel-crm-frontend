import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { PlusCircle } from "react-feather";

import '../StickyBar/StickyBar.css'
import { formatUnderscoredString } from "../../../../../../../../Utilities/globals/globals";

const ChartOfAccountTable = () => {
    const dispatch = useDispatch();

    const { chartOfAccounts } = useSelector((state: any) => state.account);

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

    const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor); // Convert hex to RGB
    // console.log("support", support);
    const chartOfAccountsData = () => {
        return chartOfAccounts?.filter(
            (item: any) =>
                item?.accountType.includes(searchValue)
            // ||
            // item?.user?.fullName.toLowerCase().includes(searchValue) ||
            // item?.user?.emailAddress.toLowerCase().includes(searchValue)
        )
            .map((item: any) => ({
                ...item
            }));
    };

    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        setData(chartOfAccountsData());
    }, [searchValue]);

    const handleSearch = (e: any) => {
        const searchKey = e.target.value.toLowerCase();
        setSearchValue(searchKey);
    };

    // console.log("allBugReports", supportData());
    useEffect(() => {
        setData(chartOfAccountsData());
    }, [chartOfAccounts]);

    const navigate = useNavigate();

    const [toggleDelete, setToggleDelete] = useState(false);
    const [data, setData] = useState(chartOfAccountsData());


    const chartOfAccountsColumns = [

        {
            name: <h4 style={{ fontWeight: "bold" }}>Code</h4>,
            selector: (row: any) => formatUnderscoredString(row?.accountType),
            sortable: true,
            center: false,
            width: "18%", // Set the width for this column
            cell: (row: any) => (
                <div
                    style={{
                        width: "100%",
                        padding: "5px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column"
                    }}

                >
                    <span style={{ height: "30px" }}>
                        {formatUnderscoredString(row?.accountType)}
                    </span>
                    <span
                        style={{ borderBottom: "1px solid lightgray", marginRight: "-40px" }}
                    >
                    </span>
                    {
                        row?.subAccounts.map((subAccount: any, index: any) => (
                            <div>
                                <div style={{ borderBottom: "1px solid lightgray", height: "40px", display: "flex", alignItems: "center", paddingLeft: "20px", marginRight: "-40px" }}>
                                    {subAccount?.name}
                                </div>
                                {
                                    subAccount.generalAccounts.map((generalAccount: any, index: any) => (
                                        <div style={{ height: "35px", display: "flex", alignItems: "center", paddingLeft: "30px", fontWeight: "normal" }}>
                                            {index + 1}
                                        </div>

                                    ))
                                }
                            </div>
                        ))


                    }

                </div>

            ),
        },

        {
            name: <h4 style={{ fontWeight: "bold", paddingLeft: "30px" }}>Name</h4>,
            selector: (row: any) => "",
            sortable: true,
            center: false,
            width: "28%", // Set the width for this column
            cell: (row: any) => (
                <div
                    style={{
                        width: "100%",
                        padding: "5px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column"
                    }}

                >
                    <span style={{ height: "30px" }}>

                    </span>
                    <span style={{ borderBottom: "1px solid lightgray", marginRight: "-40px" }}>
                    </span>
                    {
                        row?.subAccounts.map((subAccount: any, index: any) => (
                            <div>
                                <div style={{ borderBottom: "1px solid lightgray", height: "40px", marginRight: "-40px" }}>

                                </div>
                                {
                                    subAccount.generalAccounts.map((generalAccount: any, index: any) => (

                                        <div style={{ height: "35px", display: "flex", alignItems: "center", paddingLeft: "30px", fontWeight: "normal" }}>
                                            {generalAccount?.name}
                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>

            ),
        },
        {
            name: <h4 style={{ fontWeight: "bold", paddingLeft: "30px" }}>System Name</h4>,
            selector: (row: any) => "",
            sortable: true,
            center: false,
            width: "25%", // Set the width for this column
            cell: (row: any) => (
                <div
                    style={{
                        width: "100%",
                        padding: "5px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column"
                    }}

                >
                    <span style={{ height: "30px" }}>

                    </span>
                    <span style={{ borderBottom: "1px solid lightgray", marginRight: "-40px" }}>
                    </span>
                    {
                        row?.subAccounts.map((subAccount: any, index: any) => (
                            <div>
                                <div style={{ borderBottom: "1px solid lightgray", height: "40px", marginRight: "-40px" }}>

                                </div>
                                {
                                    subAccount.generalAccounts.map((generalAccount: any, index: any) => (

                                        <div style={{ height: "35px", display: "flex", alignItems: "center", paddingLeft: "30px" }}>

                                        </div>

                                    ))
                                }
                            </div>
                        ))
                    }

                </div>

            ),
        },
        {
            name: <h4 style={{ fontWeight: "bold" }}>Balance</h4>,
            selector: (row: any) => "",
            sortable: true,
            center: true,
            width: "14%", // Set the width for this column
            cell: (row: any) => (
                <div
                    style={{
                        width: "100%",
                        padding: "5px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column",

                    }}

                >
                    <span style={{ height: "30px", textAlign: "center" }}>
                        {/* 1000 */}
                    </span>
                    <span style={{ borderBottom: "1px solid lightgray", marginRight: "-40px" }}>
                    </span>
                    {
                        row?.subAccounts.map((subAccount: any, index: any) => (
                            <div>
                                <div style={{ borderBottom: "1px solid lightgray", height: "40px", marginRight: "-40px" }}>

                                </div>
                                {
                                    subAccount.generalAccounts.map((generalAccount: any, index: any) => (

                                        <div style={{ height: "35px", display: "flex", alignItems: "center", paddingLeft: "30px" }}>

                                        </div>

                                    ))
                                }
                            </div>
                        ))
                    }

                </div >

            ),

        },

        {
            name: <h4 style={{ fontWeight: "bold" }}>Action</h4>,
            selector: (row: any) => "",
            sortable: true,
            center: true,
            width: "15%", // Set the width for this column
            cell: (row: any) => (
                <div
                    style={{
                        width: "100%",
                        padding: "5px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column"
                    }}

                >
                    <span style={{ height: "30px" }}>

                    </span>
                    <span style={{ borderBottom: "1px solid lightgray", marginRight: "-40px" }}>
                    </span>
                    {
                        row?.subAccounts.map((subAccount: any, index: any) => (
                            <div>
                                <div style={{ borderBottom: "1px solid lightgray", height: "40px", marginRight: "-40px" }}>

                                </div>
                                {
                                    subAccount.generalAccounts.map((generalAccount: any, index: any) => (

                                        <div style={{ height: "35px", display: "flex", alignItems: "center", paddingLeft: "30px" }}>

                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    }

                </div>

            ),
        },
    ];


    return (
        <div className="table-responsive support-table" style={{ overflow: "auto", scrollbarWidth: "none" }}>
            <Row>

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
                columns={chartOfAccountsColumns}
                data={data}
                pagination
                clearSelectedRows={toggleDelete}
                style={{
                    cursor: "pointer",
                }}
                className="custom-data-table"
                customStyles={{
                    rows: {
                        style: {
                            padding: '0px', // Remove padding from the rows
                            margin: '0px',  // Remove margins from rows
                        },
                    },
                    head: {
                        style: {
                            fontWeight: "bold",
                            fontSize: "13px",


                        },
                    },
                    cells: {
                        style: {
                            margin: '0px 0px !important',

                        },
                    },
                }}
            />
            <style>
                {`
        .custom-data-table thead th {
            text-align: center !important;
            color: red !important; /* Ensure red color applies */
        }
       
    `}
            </style>

        </div>

    );
};

export default ChartOfAccountTable;



