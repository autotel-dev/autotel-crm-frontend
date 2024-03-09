import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reports: [],
  reportsType: [],
  loading: false,
  error: null,
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
  },
});
export const { setReports, setReportsStart, setReportstype, setReportsEnd } =
  ReportsSlice.actions;

export default ReportsSlice.reducer;
