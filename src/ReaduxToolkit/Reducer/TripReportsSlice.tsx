import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reports: [],
  reportsType: [],
  tripsForReport: [],
  loading: false,
  error: null,
  isConnected: true,
};

const TripReportsSlice = createSlice({
  name: "TripReportsSlice",
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
    setTripsForReport: (state, action) => {
      state.tripsForReport = action.payload;
    },
  },
});
export const {
  setReports,
  setReportsStart,
  setReportstype,
  setReportsEnd,
  setIsConnected,
  setTripsForReport
} = TripReportsSlice.actions;

export default TripReportsSlice.reducer;
