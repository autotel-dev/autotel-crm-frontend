import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  operationStatisticsData: null,
  operationActivitiesData: null,
  inventoryStatisticsData: null,
  operationStatisticsLoading: true,
  operationActivitiesLoading: true,
  inventoryStatisticsLoading: false,
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

    setOperationsStatisticsLoading: (state, action) => {
      state.operationStatisticsLoading = action.payload;
    },
    setOperationsActivitiesLoading: (state, action) => {
      state.operationActivitiesLoading = action.payload;
    },
    setInventoryActivitiesLoading: (state, action) => {
      state.inventoryStatisticsLoading = action.payload;
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
  setOperationsStatisticsLoading,
  setOperationsActivitiesLoading,
  setInventoryActivitiesLoading,
} = SalesDashboardSlice.actions;

export default SalesDashboardSlice.reducer;
