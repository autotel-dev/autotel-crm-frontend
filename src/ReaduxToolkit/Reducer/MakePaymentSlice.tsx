import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  makePayments: [],
  purchaseInvoices: [],
  vendors: [],
  fromAccounts: [],
  toAccounts: [],
  makePayment: null,
  loading: true,
  error: null,
  isConnected: true,
};

const MakePaymentSlice = createSlice({
  name: "MakePaymentSlice",
  initialState,
  reducers: {
    setMakePaymentStart: (state) => {
      state.loading = true;
    },
    setMakePayments: (state, action) => {
      state.makePayments = action.payload;
      state.error = null;
    },
    setVendors: (state, action) => {
      state.vendors = action.payload;
    },
    setPurchaseInvoices: (state, action) => {
      state.purchaseInvoices = action.payload;
    },

    setFromAccounts: (state, action) => {
      state.fromAccounts = action.payload;
    },
    setToAccounts: (state, action) => {
      state.toAccounts = action.payload;
    },

    setMakePayment: (state, action) => {
      state.makePayment = action.payload;
    },
    setMakePaymentEnd: (state) => {
      state.loading = false;
    },

    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },

    setMakePaymentLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
export const {
  setMakePayments,
  setVendors,
  setPurchaseInvoices,
  setFromAccounts,
  setToAccounts,
  setMakePayment,
  setMakePaymentStart,
  setMakePaymentEnd,
  setIsConnected,
  setMakePaymentLoading,
} = MakePaymentSlice.actions;

export default MakePaymentSlice.reducer;
