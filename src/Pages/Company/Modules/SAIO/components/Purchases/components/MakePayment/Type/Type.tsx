import { formatUnderscoredString } from "../../../../../../../../../Utilities/globals/globals";


export interface SaleLeadsDataType {
    id: string;
    username: string;
    email: string;
    ticket_name: string;
    description: string;
    isActive: string;
    status: string;
    priorty: string;
    date: string;
}

export const supportColumns = [
    {
        name: "id",
        selector: (row: SaleLeadsDataType) => row["id"],
        sortable: true,
        center: false,
        width: "120px", // Set the width for this column
    },
    {
        name: "Username",
        selector: (row: SaleLeadsDataType) => row["username"],
        sortable: true,
        center: false,
        width: "150px", // Set the width for this column
    },
    {
        name: "Email",
        selector: (row: SaleLeadsDataType) => row["email"],
        sortable: true,
        center: true,
        width: "200px",
    },
    {
        name: "Ticket Name",
        selector: (row: SaleLeadsDataType) => row["ticket_name"],
        sortable: true,
        center: true,
        width: "200px", // Set the width for this column
    },
    {
        name: "Description",
        selector: (row: SaleLeadsDataType) => row["description"],
        sortable: true,
        center: true,
        width: "230px", // Set the width for this column
    },
    {
        name: "IsActive",
        selector: (row: SaleLeadsDataType) => row["isActive"],
        sortable: true,
        center: true,
        width: "100px", // Set the width for this column
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
                    backgroundColor:
                        row.status === "NEW"
                            ? "rgba(0, 0, 255, 0.3)"
                            : row.status === "IN_PROGRESS"
                                ? "rgba(255, 165, 0, 0.3)"
                                : row.status === "PENDING"
                                    ? "rgba(255, 0, 0, 0.3)"
                                    : "rgba(0, 255, 0, 0.3)",
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
            >
                {formatUnderscoredString(row.status)}
            </div>
        ),
    },
    {
        name: "Priority",
        selector: (row: SaleLeadsDataType) => row["priorty"],
        sortable: true,
        center: true,
        width: "100px", // Set the width for this column
        cell: (row: SaleLeadsDataType) => (
            <div
                style={{
                    width: "90px",
                    textAlign: "center",
                    padding: "5px",
                    borderRadius: "5px",
                    backgroundColor:
                        row.priorty === "LOW"
                            ? "rgba(0, 255, 0, 0.3)"
                            : row.priorty === "HIGH"
                                ? "rgba(255, 0, 0, 0.3)"
                                : "rgba(255, 200, 0, 0.3)",
                    // color:
                    //   row.priorty === "LOW"
                    //     ? "green"
                    //     : row.priorty === "HIGH"
                    //     ? "red"
                    //     : "orange",
                    color: "black"
                }}
            >
                {formatUnderscoredString(row.priorty)}
            </div>
        ),
    },
    {
        name: "Date",
        selector: (row: SaleLeadsDataType) => row["date"],
        sortable: true,
        center: true,
        width: "200px", // Set the width for this column
    },
];