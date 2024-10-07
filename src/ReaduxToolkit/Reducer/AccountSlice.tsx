import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chartOfAccounts: [],
    // accountTypes: [],
    loading: false,
    error: null,
    isConnected: true,
};

const AccountSlice = createSlice({
    name: "AccountSlice",
    initialState,
    reducers: {

        setChartOfAccount: (state, action) => {
            state.chartOfAccounts = action.payload;
            state.error = null;
            state.loading = false;
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {

    setChartOfAccount,
    setIsConnected,
} = AccountSlice.actions;

export default AccountSlice.reducer;
