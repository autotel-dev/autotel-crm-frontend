
export interface TaxTypes {
    title?: string;
    percentage?: string;
    isActive?: string;
}


export interface TaxDataType {
    id: string;
    title: string;
    isActive: string;
    user: string;
    percentage: string;
    date: string;
}

export const taxColumns = [
    {
        name: "ID",
        selector: (row: TaxDataType) => row["id"],
        sortable: true,
        center: true,
        width: "300px", // Set the width for this column
    },
    {
        name: "Title",
        selector: (row: TaxDataType) => row["title"],
        sortable: true,
        center: true,
        width: "150px", // Set the width for this column
    },
    {
        name: "User",
        selector: (row: TaxDataType) => row["user"],
        sortable: true,
        center: true,
        width: "250px", // Set the width for this column
    },
    {
        name: "Percentage",
        selector: (row: TaxDataType) => row["percentage"],
        sortable: true,
        center: true,
        width: "200px", // Set the width for this column
    },

    {
        name: "IsActive",
        selector: (row: TaxDataType) => row["isActive"],
        sortable: true,
        center: true,
        width: "130px", // Set the width for this column
    },
    {
        name: "Date",
        selector: (row: TaxDataType) => row["date"],
        sortable: true,
        center: true,
        width: "200px", // Set the width for this column
    },
];