import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    purchaseInvoices: [],
    vendors: [],
    products: [],
    serialNumbers: null,
    loading: false,
    error: null,
    isConnected: true,
};

const PurchaseInvoiceSlice = createSlice({
    name: "PurchaseInvoiceSlice",
    initialState,
    reducers: {

        setPurchaseInvoiceStart: (state) => {
            state.loading = true;
        },
        setPurchaseInvoices: (state, action) => {
            state.purchaseInvoices = action.payload;
            state.error = null;
            state.loading = false;
        },
        setVendors: (state, action) => {
            state.vendors = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        },

        setSerialNumbers: (state, action) => {
            state.serialNumbers = action.payload;
        },

        setPurchaseInvoiceEnd: (state) => {
            state.loading = false;
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {

    setPurchaseInvoices,
    setVendors,
    setProducts,
    setSerialNumbers,
    setPurchaseInvoiceStart,
    setPurchaseInvoiceEnd,
    setIsConnected,
} = PurchaseInvoiceSlice.actions;

export default PurchaseInvoiceSlice.reducer;
