import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bankAccounts: [],
    accountTypes: [],
    loading: false,
    error: null,
    isConnected: true,
};

const BankAccountsSlice = createSlice({
    name: "BankAccountsSlice",
    initialState,
    reducers: {

        setBankAccountsStart: (state) => {
            state.loading = true;
        },
        setBankAccounts: (state, action) => {
            state.bankAccounts = action.payload;
            state.error = null;
            state.loading = false;
        },
        setAccountTypes: (state, action) => {
            state.accountTypes = action.payload;
        },

        setBankAccountsEnd: (state) => {
            state.loading = false;
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {

    setBankAccounts,
    setAccountTypes,
    setBankAccountsStart,
    setBankAccountsEnd,
    setIsConnected,
} = BankAccountsSlice.actions;

export default BankAccountsSlice.reducer;
