import { PopoverBody, PopoverHeader, UncontrolledPopover } from "reactstrap";
import { formatUnderscoredString } from "../../../../../../../../../Utilities/globals/globals";


export interface SaleLeadsDataType {
    id: string;
    username: string;
    email: string;
    customer_name: string;
    customer_contact_no: string;
    package: string;
    status: string;
    customer: any;
    vehicles: any;
    openedBy: any;
    totalNoOfVehicles: any;
    service_charges: number;
    discounted_service_charges: number;
    isActive: string;
    date: string;
}

export const supportColumns = [

    {
        name: "User",
        selector: (row: SaleLeadsDataType) => row["username"],
        sortable: true,
        center: false,
        width: "250px", // Set the width for this column
    },

    {
        name: "Customer Name",
        selector: (row: SaleLeadsDataType) => row["customer_name"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },
    {
        name: "Customer Contact No",
        selector: (row: SaleLeadsDataType) => row["customer_contact_no"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },
    {
        name: "Status",
        selector: (row: SaleLeadsDataType) => row["status"],
        sortable: true,
        center: true,
        width: "150px", // Set the width for this column
        cell: (row: SaleLeadsDataType) => (
            <div
                style={{
                    width: "120px",
                    textAlign: "center",
                    padding: "5px",
                    borderRadius: "5px",
                    // backgroundColor:
                    //     row.status === "NEW"
                    //         ? "rgba(0, 0, 255, 0.3)"
                    //         : row.status === "IN_PROGRESS"
                    //             ? "rgba(255, 165, 0, 0.3)"
                    //             : row.status === "PENDING"
                    //                 ? "rgba(255, 0, 0, 0.3)"
                    //                 : "rgba(0, 255, 0, 0.3)",
                    // color:
                    //   row.status === "NEW"
                    //     ? "blue"
                    //     : row.status === "IN_PROGRESS"
                    //     ? "orange"
                    //     : row.status === "PENDING"
                    //     ? "red"
                    //     : "green",
                    color: "black"

                }}
                id={`PopoverForSaleLead-${row.status == "IN_PROGRESS" ? row.openedBy?._id : ""}`} // Unique ID for each row
            >
                {formatUnderscoredString(row.status)}
                {
                    row.openedBy !== null && row.status == "IN_PROGRESS" ? (
                        <UncontrolledPopover
                            placement="top"
                            trigger="hover"
                            target={`PopoverForSaleLead-${row.openedBy?._id}`}
                        >
                            <PopoverHeader>Opened By</PopoverHeader>
                            <PopoverBody>{row.openedBy?.fullName}</PopoverBody>
                        </UncontrolledPopover>
                    ) : <></>
                }

            </div>


        ),
    },
    // {
    //     name: "Priority",
    //     selector: (row: SaleLeadsDataType) => row["priorty"],
    //     sortable: true,
    //     center: true,
    //     width: "100px", // Set the width for this column
    //     cell: (row: SaleLeadsDataType) => (
    //         <div
    //             style={{
    //                 width: "90px",
    //                 textAlign: "center",
    //                 padding: "5px",
    //                 borderRadius: "5px",
    //                 backgroundColor:
    //                     row.priorty === "LOW"
    //                         ? "rgba(0, 255, 0, 0.3)"
    //                         : row.priorty === "HIGH"
    //                             ? "rgba(255, 0, 0, 0.3)"
    //                             : "rgba(255, 200, 0, 0.3)",
    //                 // color:
    //                 //   row.priorty === "LOW"
    //                 //     ? "green"
    //                 //     : row.priorty === "HIGH"
    //                 //     ? "red"
    //                 //     : "orange",
    //                 color: "black"
    //             }}
    //         >
    //             {formatUnderscoredString(row.priorty)}
    //         </div>
    //     ),
    // },
    {
        name: "Date",
        selector: (row: SaleLeadsDataType) => row["date"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },
];