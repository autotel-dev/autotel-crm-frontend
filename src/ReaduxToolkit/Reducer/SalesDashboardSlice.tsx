import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  operationStatisticsData: null,
  operationActivitiesData: null,
  inventoryStatisticsData: null,
  topEntitesData: null,
  recentSalesData: null,
  salesSummaryData: null,
  recentPurchasesData: null,
  purchasesSummaryData: null,
  operationStatisticsLoading: true,
  operationActivitiesLoading: true,
  inventoryStatisticsLoading: true,
  topEntitesLoading: true,
  recentSalesLoading: true,
  salesSummaryLoading: true,
  recentPurchasesLoading: true,
  purchasesSummaryLoading: true,
  error: null,
  isConnected: true,
};

const SalesDashboardSlice = createSlice({
  name: "SalesDashboardSlice",
  initialState,
  reducers: {
    setOperationsStatisticsData: (state, action) => {
      state.operationStatisticsData = action.payload;
      state.operationStatisticsLoading = false;
    },
    setOperationsActivitiesData: (state, action) => {
      state.operationActivitiesData = action.payload;
      state.operationActivitiesLoading = false;
    },
    setInventoryActivitiesData: (state, action) => {
      state.inventoryStatisticsData = action.payload;
      state.inventoryStatisticsLoading = false;
    },
    setTopEntitesData: (state, action) => {
      state.topEntitesData = action.payload;
      state.topEntitesLoading = false;
    },
    setRecentSalesData: (state, action) => {
      state.recentSalesData = action.payload;
      state.recentSalesLoading = false;
    },
    setSalesSummaryData: (state, action) => {
      state.salesSummaryData = action.payload;
      state.salesSummaryLoading = false;
    },
    setRecentPurchasesData: (state, action) => {
      state.recentPurchasesData = action.payload;
      state.recentPurchasesLoading = false;
    },
    setPurchaseSummaryData: (state, action) => {
      state.purchasesSummaryData = action.payload;
      state.purchasesSummaryLoading = false;
    },
    setOperationsStatisticsLoading: (state, action) => {
      state.operationStatisticsLoading = action.payload;
    },
    setOperationsActivitiesLoading: (state, action) => {
      state.operationActivitiesLoading = action.payload;
    },
    setInventoryActivitiesLoading: (state, action) => {
      state.inventoryStatisticsLoading = action.payload;
    },
    setTopEntitiesLoading: (state, action) => {
      state.topEntitesLoading = action.payload;
    },
    setRecentSalesLoading: (state, action) => {
      state.recentSalesLoading = action.payload;
    },
    setSalesSummaryLoading: (state, action) => {
      state.salesSummaryLoading = action.payload;
    },
    setRecentPurchasesLoading: (state, action) => {
      state.recentPurchasesLoading = action.payload;
    },
    setPurchaseSummaryLoading: (state, action) => {
      state.purchasesSummaryLoading = action.payload;
    },

    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setIsConnected,
  setOperationsStatisticsData,
  setOperationsActivitiesData,
  setInventoryActivitiesData,
  setTopEntitesData,
  setRecentSalesData,
  setRecentPurchasesData,
  setSalesSummaryData,
  setPurchaseSummaryData,
  setOperationsStatisticsLoading,
  setOperationsActivitiesLoading,
  setInventoryActivitiesLoading,
  setTopEntitiesLoading,
  setRecentSalesLoading,
  setRecentPurchasesLoading,
  setSalesSummaryLoading,
  setPurchaseSummaryLoading,
} = SalesDashboardSlice.actions;

export default SalesDashboardSlice.reducer;
