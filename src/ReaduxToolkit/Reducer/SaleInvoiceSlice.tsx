import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    saleInvoices: [],
    saleInvoice: null,
    loading: true,
    error: null,
    isConnected: true,
};

const SaleInvoiceSlice = createSlice({
    name: "SaleInvoiceSlice",
    initialState,
    reducers: {

        setSaleInvoiceStart: (state) => {
            state.loading = true;
        },
        setSaleInvoices: (state, action) => {
            state.saleInvoices = action.payload;
            state.error = null;
            // state.loading = false;
        },

        setSaleInvoice: (state, action) => {
            state.saleInvoice = action.payload
        },
        setSaleInvoiceEnd: (state) => {
            state.loading = false;
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
        setSaleInvoiceLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
});
export const {
    setSaleInvoiceStart,
    setSaleInvoices,
    setSaleInvoice,
    setSaleInvoiceEnd,
    setIsConnected,
    setSaleInvoiceLoading
} = SaleInvoiceSlice.actions;

export default SaleInvoiceSlice.reducer;
