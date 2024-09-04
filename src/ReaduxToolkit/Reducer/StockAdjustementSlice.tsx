import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    stockAdjustments: [],
    products: [],
    stockAdjustmentTypes: [],
    loading: false,
    error: null,
    isConnected: true,
};

const StockAdjustementSlice = createSlice({
    name: "StockAdjustementSlice",
    initialState,
    reducers: {

        setStockAdjustmentStart: (state) => {
            state.loading = true;
        },
        setStockAdjustments: (state, action) => {
            state.stockAdjustments = action.payload;
            state.error = null;
            state.loading = false;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setStockAdjustmentTypes: (state, action) => {
            state.stockAdjustmentTypes = action.payload;
        },

        setStockAdjustmentEnd: (state) => {
            state.loading = false;
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {
    setStockAdjustmentStart,
    setStockAdjustments,
    setStockAdjustmentTypes,
    setProducts,
    setStockAdjustmentEnd,
    setIsConnected,
} = StockAdjustementSlice.actions;

export default StockAdjustementSlice.reducer;
