import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    expenseAccounts: [],
    loading: false,
    error: null,
    isConnected: true,
};

const ExpenseAccountsSlice = createSlice({
    name: "ExpenseAccountsSlice",
    initialState,
    reducers: {

        setExpenseAccountsStart: (state) => {
            state.loading = true;
        },
        setExpenseAccounts: (state, action) => {
            state.expenseAccounts = action.payload;
            state.error = null;
            state.loading = false;
        },

        setExpenseAccountsEnd: (state) => {
            state.loading = false;
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {

    setExpenseAccounts,
    setExpenseAccountsStart,
    setExpenseAccountsEnd,
    setIsConnected,
} = ExpenseAccountsSlice.actions;

export default ExpenseAccountsSlice.reducer;
