import { formatUnderscoredString } from "../../../../../../../../../Utilities/globals/globals";


export interface CustomersDataType {
    id: string;
    comments: string;
    vendor: string;
    reference: string;
    productsDetails: any[];
    shippingCharges: number,
    netAmount: number,
    purchaseInvoiceId: string,
    company: string,
    branch: string,
    warehouse: string,
    invoiceDate: string,
    invoiceDueDate: string,
    status: string,
}

export const supportColumns = [
    {
        name: "Invoice Id",
        selector: (row: CustomersDataType) => row["purchaseInvoiceId"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },
    {
        name: "Vendor",
        selector: (row: CustomersDataType) => row["vendor"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },
    {
        name: "User",
        selector: (row: CustomersDataType) => row["company"],
        sortable: true,
        center: true,
        width: "250px",
    },
    {
        name: "Amount",
        selector: (row: CustomersDataType) => row["netAmount"],
        sortable: true,
        center: true,
        width: "150px", // Set the width for this column
    },
    {
        name: "Status",
        selector: (row: CustomersDataType) => row["status"],
        sortable: true,
        center: false,
        width: "100px", // Set the width for this column
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
        selector: (row: CustomersDataType) => row["invoiceDate"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },

    {
        name: "Due Date",
        selector: (row: CustomersDataType) => row["invoiceDueDate"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },
];