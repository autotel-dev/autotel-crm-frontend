import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    stockAdjustmentTypes: [],
    loading: false,
    error: null,
    isConnected: true,
};

const StockAdjustmentTypeSlice = createSlice({
    name: "StockAdjustmentTypeSlice",
    initialState,
    reducers: {

        setStockAdjustmentTypesStart: (state) => {
            state.loading = true;
        },
        setStockAdjustmentTypes: (state, action) => {
            state.stockAdjustmentTypes = action.payload;
            state.error = null;
            state.loading = false;
        },

        setStockAdjustmentTypesEnd: (state) => {
            state.loading = false;
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {

    setStockAdjustmentTypesEnd,
    setStockAdjustmentTypes,
    setStockAdjustmentTypesStart,
    setIsConnected,
} = StockAdjustmentTypeSlice.actions;

export default StockAdjustmentTypeSlice.reducer;
