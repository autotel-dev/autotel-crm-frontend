import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    taxes: [],
    loading: false,
    error: null,
    isConnected: true,
};

const TaxSlice = createSlice({
    name: "TaxSlice",
    initialState,
    reducers: {

        setTaxStart: (state) => {
            state.loading = true;
        },
        setTaxes: (state, action) => {
            state.taxes = action.payload;
            state.error = null;
            state.loading = false;
        },

        setTaxEnd: (state) => {
            state.loading = false;
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {

    setTaxes,
    setTaxStart,
    setTaxEnd,
    setIsConnected,
} = TaxSlice.actions;

export default TaxSlice.reducer;
