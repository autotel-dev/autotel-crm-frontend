import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendorLedgers: [],
  vendors: [],
  fromAccounts: [],
  customerLedger: null,
  loading: true,
  error: null,
  isConnected: true,
};

const VendorLedgerSlice = createSlice({
  name: "VendorLedgerSlice",
  initialState,
  reducers: {
    setVendorLedgers: (state, action) => {
      state.vendorLedgers = action.payload;
    },
    setVendors: (state, action) => {
      state.vendors = action.payload;
    },
    setFromAccounts: (state, action) => {
      state.fromAccounts = action.payload;
    },

    setVendorLedger: (state, action) => {
      state.customerLedger = action.payload;
    },

    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setVendorLedgers,
  setVendors,
  setFromAccounts,
  setVendorLedger,
  setIsConnected,
} = VendorLedgerSlice.actions;

export default VendorLedgerSlice.reducer;
