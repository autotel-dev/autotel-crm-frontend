import { formatUnderscoredString } from "../../../../../../../../../Utilities/globals/globals";


export interface CustomersDataType {
    id: string;
    fullName: string;
    emailAddress: string;
    phoneNo: string;
    isActive: string;
    city: string;
    date: string;
}

export const supportColumns = [
    {
        name: "id",
        selector: (row: CustomersDataType) => row["id"],
        sortable: true,
        center: false,
        width: "250px", // Set the width for this column
    },
    {
        name: "Full Name",
        selector: (row: CustomersDataType) => row["fullName"],
        sortable: true,
        center: false,
        width: "150px", // Set the width for this column
    },
    {
        name: "Email",
        selector: (row: CustomersDataType) => row["emailAddress"],
        sortable: true,
        center: true,
        width: "200px",
    },
    {
        name: "Phone Number",
        selector: (row: CustomersDataType) => row["phoneNo"],
        sortable: true,
        center: true,
        width: "150px", // Set the width for this column
    },
    {
        name: "City",
        selector: (row: CustomersDataType) => row["city"],
        sortable: true,
        center: true,
        width: "100px", // Set the width for this column
    },
    {
        name: "IsActive",
        selector: (row: CustomersDataType) => row["isActive"],
        sortable: true,
        center: true,
        width: "150px", // Set the width for this column
    },
    // {
    //     name: "Status",
    //     selector: (row: CustomersDataType) => row["status"],
    //     sortable: true,
    //     center: true,
    //     width: "150px", // Set the width for this column
    //     cell: (row: CustomersDataType) => (
    //         <div
    //             style={{
    //                 width: "120px",
    //                 textAlign: "center",
    //                 padding: "5px",
    //                 borderRadius: "5px",
    //                 backgroundColor:
    //                     row.status === "NEW"
    //                         ? "rgba(0, 0, 255, 0.3)"
    //                         : row.status === "IN_PROGRESS"
    //                             ? "rgba(255, 165, 0, 0.3)"
    //                             : row.status === "PENDING"
    //                                 ? "rgba(255, 0, 0, 0.3)"
    //                                 : "rgba(0, 255, 0, 0.3)",
    //                 // color:
    //                 //   row.status === "NEW"
    //                 //     ? "blue"
    //                 //     : row.status === "IN_PROGRESS"
    //                 //     ? "orange"
    //                 //     : row.status === "PENDING"
    //                 //     ? "red"
    //                 //     : "green",
    //                 color: "black"
    //             }}
    //         >
    //             {formatUnderscoredString(row.status)}
    //         </div>
    //     ),
    // },
    // {
    //     name: "Priority",
    //     selector: (row: CustomersDataType) => row["priorty"],
    //     sortable: true,
    //     center: true,
    //     width: "100px", // Set the width for this column
    //     cell: (row: CustomersDataType) => (
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
        selector: (row: CustomersDataType) => row["date"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },
];