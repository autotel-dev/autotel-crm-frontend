import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import { SaleLeadsDataType, supportColumns } from "./Type/Type";
import { PlusCircle } from "react-feather";
import CreateNewSaleLead from "./CreateNewSaleLead/CreateNewSaleLead";
import Swal from "sweetalert2";
import { Select } from "antd";
import ReactDOM from "react-dom";
import { setCustomer, setSaleLead } from "../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";

interface SaleLeadsTableProps {
    iscreateNewSaleLead: boolean;
    setIscreateNewSaleLead: any
}

const SaleLeadsTable: React.FC<SaleLeadsTableProps> = ({
    iscreateNewSaleLead,
    setIscreateNewSaleLead,
}) => {
    const dispatch = useDispatch();

    const { customers, saleLeads } = useSelector((state: any) => state.sales);
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
    // console.log("support", support);
    const saleLeadsData = () => {
        return saleLeads?.filter(
            (item: any) =>
                item?._id.includes(searchValue) ||
                item?.user?.fullName.toLowerCase().includes(searchValue) ||
                item?.user?.emailAddress.toLowerCase().includes(searchValue)
        )
            .map((item: any) => ({
                id: item?._id,
                username: item?.user?.fullName,
                email: item?.user?.emailAddress,
                customer_name: item?.customerName,
                customer_contact_no: item?.customerContactNo,
                package: item?.package.title,
                status: item?.status,
                customer: item?.customer,
                vehicles: item?.vehicles,
                service_charges: item?.serviceCharges,
                openedBy: item?.openedBy,
                totalNoOfVehicles: item?.totalNoOfVehicles,
                discounted_service_charges: item?.discountedServiceCharges,
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

    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        setData(saleLeadsData());
    }, [searchValue]);

    const handleSearch = (e: any) => {
        const searchKey = e.target.value.toLowerCase();
        setSearchValue(searchKey);
    };

    // console.log("allBugReports", supportData());
    useEffect(() => {
        setData(saleLeadsData());
    }, [saleLeads]);

    const navigate = useNavigate();
    // const history = useHistory();
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleDelete, setToggleDelete] = useState(false);
    const [data, setData] = useState(saleLeadsData());


    // const handleRowSelected = useCallback((state: any) => {
    //     setSelectedRows(state.selectedRows);
    // }, []);

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
        console.log("row", row);

        dispatch(setSaleLead(row));
        dispatch(setCustomer(null))
        setIscreateNewSaleLead(true)
    };

    const [customerId, setCustomerId] = useState("");
    const [customerList, setCustomerList] = useState([]);
    // const dispatch = useDispatch();

    const tempList: any = [];
    useEffect(() => {
        customers?.map((item: any, index: any) => {
            tempList.push({ value: `${item?._id}`, label: `${item?.fullName}`, phoneNo: `${item?.phoneNo}` });
        });
        setCustomerList(tempList);
    }, [customers]);

    const handleSelectChange = (e: any) => {
        setCustomerId(e);
        dispatch(setCustomer(e))
        // setIscreateNewSaleLead(true);
    };


    const handleButtonClick = () => {
        Swal.fire({
            title: "Please Select Customer",
            showCancelButton: false,
            showCloseButton: true,
            showConfirmButton: true,
            confirmButtonText: "New",
            showDenyButton: true,
            denyButtonText: "Existing",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(setCustomer(null))
                dispatch(setSaleLead(null));
                setIscreateNewSaleLead(true);
            } else if (result.isDenied) {
                Swal.fire({
                    title: 'Select Customer',
                    html: `
                        <div id="select-customer" style="width: 100%; height: 36px; z-index: 9999;">
                            <div id="select-box"></div>
                        </div>`,
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    showCloseButton: true,
                    showDenyButton: true,
                    denyButtonText: "Cancel",
                    didOpen: () => {
                        const container = document.getElementById('select-box');
                        const selectElement = (
                            <Select
                                showSearch
                                style={{ width: "100%", height: 36 }}
                                dropdownStyle={{ zIndex: 9999 }} // Ensure the dropdown has a high z-index
                                placeholder="Select a customer"
                                optionFilterProp="children"
                                filterOption={(input: any, option: any) =>
                                    (option?.label.toLowerCase() ?? "").includes(input.toLowerCase()) || (option?.value.toLowerCase() ?? "").includes(input.toLowerCase()) || (option?.phoneNo ?? "").includes(input)
                                }
                                filterSort={(optionA: any, optionB: any) =>
                                    (optionA?.label ?? "")
                                        .toLowerCase()
                                        .localeCompare((optionB?.label ?? "").toLowerCase())
                                }
                                onChange={handleSelectChange}
                                options={customerList}
                            />
                        );
                        if (container) {
                            ReactDOM.render(selectElement, container);
                        }
                    },
                    customClass: {
                        popup: 'swal-custom-class' // Add a custom class to the popup
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        setIscreateNewSaleLead(true);
                        setCustomerId("")
                        dispatch(setSaleLead(null));
                    }
                    else if (result.isDenied) {
                        setIscreateNewSaleLead(false);
                        setCustomerId("")
                        dispatch(setSaleLead(null));
                    }
                });
            }
        });
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
                        onClick={handleButtonClick}
                    >
                        <PlusCircle size={18} style={{
                            marginRight: "5px"
                        }} />
                        Create New Lead
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
                // onSelectedRowsChange={handleRowSelected}
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

export default SaleLeadsTable;



