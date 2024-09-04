import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    expenses: [],
    bankAccounts: [],
    expenseAccounts: [],
    expenseNumbers: [],
    expense: null,
    loading: false,
    error: null,
    isConnected: true,
};

const ExpenseSlice = createSlice({
    name: "ExpenseSlice",
    initialState,
    reducers: {

        setExpenseStart: (state) => {
            state.loading = true;
        },
        setExpenses: (state, action) => {
            state.expenses = action.payload;
            state.error = null;
            state.loading = false;
        },
        setBankAccounts: (state, action) => {
            state.bankAccounts = action.payload;
        },
        setExpenseAccounts: (state, action) => {
            state.expenseAccounts = action.payload;
        },

        setExpense: (state, action) => {
            state.expense = action.payload
        },
        setExpenseNumbers: (state, action) => {
            state.expenseNumbers = action.payload;
        },

        setExpenseEnd: (state) => {
            state.loading = false;
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {

    setExpenses,
    setBankAccounts,
    setExpenseAccounts,
    setExpense,
    setExpenseNumbers,
    setExpenseStart,
    setExpenseEnd,
    setIsConnected,
} = ExpenseSlice.actions;

export default ExpenseSlice.reducer;
