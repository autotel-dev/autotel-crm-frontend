import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reports: [],
  reportsType: [],
  loading: false,
  error: null,
  isConnected: true,
  operatorsForReport: [],
  productsForReport: [],
  productTypesForReport: [],
  productBranchesForReport: [],
  productWarehousesForReport: [],
  vendorsForReports: [],
  customersFormReports: [],
};

const ReportsSlice = createSlice({
  name: "ReportsSlice",
  initialState,
  reducers: {
    setReportsStart: (state) => {
      state.loading = true;
    },
    setReports: (state, action) => {
      state.reports = action.payload;
      state.error = null;
      state.loading = false;
    },
    setReportstype: (state, action) => {
      state.reportsType = action.payload;
    },

    setReportsEnd: (state) => {
      state.loading = false;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setOperatorsForReport: (state, action) => {
      state.operatorsForReport = action.payload;
    },
    setProductsForReport: (state, action) => {
      state.productsForReport = action.payload;
    },
    setProductTypesForReport: (state, action) => {
      state.productTypesForReport = action.payload;
    },
    setBranchesForReport: (state, action) => {
      state.productBranchesForReport = action.payload;
    },
    setWarehousesForReport: (state, action) => {
      state.productWarehousesForReport = action.payload;
    },
    setVendorsForReport: (state, action) => {
      state.vendorsForReports = action.payload;
    },
    setCustomersForReport: (state, action) => {
      state.customersFormReports = action.payload;
    },
  },
});
export const {
  setReports,
  setReportsStart,
  setReportstype,
  setReportsEnd,
  setIsConnected,
  setOperatorsForReport,
  setProductsForReport,
  setProductTypesForReport,
  setBranchesForReport,
  setWarehousesForReport,
  setVendorsForReport,
  setCustomersForReport,
} = ReportsSlice.actions;

export default ReportsSlice.reducer;
