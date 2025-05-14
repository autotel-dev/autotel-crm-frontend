import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerLedgers: [],
  customers: [],
  fromAccounts: [],
  customerLedger: null,
  loading: true,
  error: null,
  isConnected: true,
};

const CustomerLedgerSlice = createSlice({
  name: "CustomerLedgerSlice",
  initialState,
  reducers: {
    setCustomerLedgers: (state, action) => {
      state.customerLedgers = action.payload;
    },
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    setFromAccounts: (state, action) => {
      state.fromAccounts = action.payload;
    },

    setCustomerLedger: (state, action) => {
      state.customerLedger = action.payload;
    },

    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setCustomerLedgers,
  setCustomers,
  setFromAccounts,
  setCustomerLedger,
  setIsConnected,
} = CustomerLedgerSlice.actions;

export default CustomerLedgerSlice.reducer;
