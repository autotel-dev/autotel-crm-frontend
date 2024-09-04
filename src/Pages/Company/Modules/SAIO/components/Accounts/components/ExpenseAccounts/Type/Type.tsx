import { formatUnderscoredString } from "../../../../../../../../../Utilities/globals/globals";


export interface ExpenseAccountsDataType {
    id: string;
    name: string;
    isActive: string;
    user: string;
    date: string;
}

export const expenseAccountsColumns = [
    {
        name: "ID",
        selector: (row: ExpenseAccountsDataType) => row["id"],
        sortable: true,
        center: true,
        width: "350px", // Set the width for this column
    },
    {
        name: "Name",
        selector: (row: ExpenseAccountsDataType) => row["name"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },
    {
        name: "User",
        selector: (row: ExpenseAccountsDataType) => row["user"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },
    {
        name: "IsActive",
        selector: (row: ExpenseAccountsDataType) => row["isActive"],
        sortable: true,
        center: true,
        width: "200px", // Set the width for this column
    },
    {
        name: "Date",
        selector: (row: ExpenseAccountsDataType) => row["date"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },
];