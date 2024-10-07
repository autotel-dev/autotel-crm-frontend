export interface StockAdjustmentTypesType {
    name?: string;
    isActive?: string;
}

export interface StockAdjustmentTypesDataType {
    id: string;
    name: string;
    isActive: string;
    availability: string;
    date: string;
}

export const stockAdjustmentTypesColumns = [
    {
        name: "ID",
        selector: (row: StockAdjustmentTypesDataType) => row["id"],
        sortable: true,
        center: true,
        // width: "120px", // Set the width for this column
    },
    {
        name: "Name",
        selector: (row: StockAdjustmentTypesDataType) => row["name"],
        sortable: true,
        center: true,
        // width: "150px", // Set the width for this column
    },

    {
        name: "IsActive",
        selector: (row: StockAdjustmentTypesDataType) => row["isActive"],
        sortable: true,
        center: true,
        // width: "100px", // Set the width for this column
    },
    {
        name: "Availability",
        selector: (row: StockAdjustmentTypesDataType) => row["availability"] ? "true" : "false",
        sortable: true,
        center: true,
        // width: "100px", // Set the width for this column
    },


    {
        name: "Date",
        selector: (row: StockAdjustmentTypesDataType) => row["date"],
        sortable: true,
        center: true,
        // width: "200px", // Set the width for this column
    },
];