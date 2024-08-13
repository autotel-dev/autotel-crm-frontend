


export interface ExpensesDataType {
    id: string;
    expenseNumber: string;
    user: string;
    payFrom: string;
    totalAmount: string;
    reference: string;
    date: string;
    attachement: any,
    expenseItems: any,

}

export const expensesColumns = [
    {
        name: "id",
        selector: (row: ExpensesDataType) => row["id"],
        sortable: true,
        center: true,
        width: "200px", // Set the width for this column
    },
    {
        name: "Expense #",
        selector: (row: ExpensesDataType) => row["expenseNumber"],
        sortable: true,
        center: true,
        width: "150px", // Set the width for this column
    },
    {
        name: "User",
        selector: (row: ExpensesDataType) => row["user"],
        sortable: true,
        center: true,
        width: "250px",
    },
    {
        name: "Bank Account",
        selector: (row: ExpensesDataType) => row["payFrom"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },
    {
        name: "Total Amount",
        selector: (row: ExpensesDataType) => row["totalAmount"],
        sortable: true,
        center: true,
        width: "230px", // Set the width for this column
    },

    {
        name: "Date",
        selector: (row: ExpensesDataType) => row["date"],
        sortable: true,
        center: true,
        width: "200px", // Set the width for this column
    },
];