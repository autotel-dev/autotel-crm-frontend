import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reports: [],
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

    setReportsEnd: (state) => {
      state.loading = false;
    },
  },
});
export const { setReports, setReportsStart, setReportsEnd } =
ReportsSlice.actions;

export default ReportsSlice.reducer;
