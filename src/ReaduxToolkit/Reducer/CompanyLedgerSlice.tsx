import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companyLedgers: [],
  fromAccounts: [],
  companyLedger: null,
  loading: true,
  error: null,
  isConnected: true,
};

const CompanyLedgerSlice = createSlice({
  name: "CompanyLedgerSlice",
  initialState,
  reducers: {
    setCompanyLedgers: (state, action) => {
      state.companyLedgers = action.payload;
    },
    setFromAccounts: (state, action) => {
      state.fromAccounts = action.payload;
    },

    setCompanyLedger: (state, action) => {
      state.companyLedger = action.payload;
    },

    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setCompanyLedgers,
  setFromAccounts,
  setCompanyLedger,
  setIsConnected,
} = CompanyLedgerSlice.actions;

export default CompanyLedgerSlice.reducer;
