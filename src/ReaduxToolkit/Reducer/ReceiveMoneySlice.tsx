import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  receiveMoneys: [],
  saleInvoices: [],
  customers: [],
  fromAccounts: [],
  toAccounts: [],
  receiveMoney: null,
  loading: true,
  error: null,
  isConnected: true,
};

const ReceiveMoneySlice = createSlice({
  name: "ReceiveMoneySlice",
  initialState,
  reducers: {
    setReceiveMoneyStart: (state) => {
      state.loading = true;
    },
    setReceiveMoneys: (state, action) => {
      state.receiveMoneys = action.payload;
      state.error = null;
    },
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    setSaleInvoices: (state, action) => {
      state.saleInvoices = action.payload;
      state.error = null;
    },
    setFromAccounts: (state, action) => {
      state.fromAccounts = action.payload;
    },
    setToAccounts: (state, action) => {
      state.toAccounts = action.payload;
    },

    setReceiveMoney: (state, action) => {
      state.receiveMoney = action.payload;
    },
    setReceiveMoneyEnd: (state) => {
      state.loading = false;
    },

    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },

    setReceiveMoneyLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
export const {
  setReceiveMoneys,
  setCustomers,
  setSaleInvoices,
  setFromAccounts,
  setToAccounts,
  setReceiveMoney,
  setReceiveMoneyStart,
  setReceiveMoneyEnd,
  setIsConnected,
  setReceiveMoneyLoading,
} = ReceiveMoneySlice.actions;

export default ReceiveMoneySlice.reducer;
