import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    stockMovements: [],
    products: [],
    branches: [],
    warehouses: [],
    stockMovement: null,
    loading: false,
    error: null,
    isConnected: true,
};

const StockMovementSlice = createSlice({
    name: "StockMovementSlice",
    initialState,
    reducers: {

        setStockMovementStart: (state) => {
            state.loading = true;
        },
        setStockMovements: (state, action) => {
            state.stockMovements = action.payload;
            state.error = null;
            // state.loading = false;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setBranches: (state, action) => {
            state.branches = action.payload;
        },
        setWarehouses: (state, action) => {
            state.warehouses = action.payload;
        },
        setStockMovement: (state, action) => {
            state.stockMovement = action.payload;
        },

        setStockMovementEnd: (state) => {
            state.loading = false;
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {
    setStockMovementStart,
    setStockMovements,
    setProducts,
    setBranches,
    setWarehouses,
    setStockMovementEnd,
    setStockMovement,
    setIsConnected,
} = StockMovementSlice.actions;

export default StockMovementSlice.reducer;
