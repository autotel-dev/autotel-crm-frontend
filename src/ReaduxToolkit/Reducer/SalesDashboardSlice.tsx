import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  statisticsData: null,
  activitiesData: [],
  loading: false,
  error: null,
  isConnected: true,
};

const SalesDashboardSlice = createSlice({
  name: "SalesDashboardSlice",
  initialState,
  reducers: {
    setStatisticsData: (state, action) => {
      state.statisticsData = action.payload;
    },
    setActivitiesData: (state, action) => {
      state.activitiesData = action.payload;
    },

    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const { setIsConnected, setStatisticsData, setActivitiesData } =
  SalesDashboardSlice.actions;

export default SalesDashboardSlice.reducer;
