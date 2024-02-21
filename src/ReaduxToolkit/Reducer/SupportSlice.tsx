import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bugReports: [],
  priorityStatuses: [],
  priorityStatus: null,
  supportStatistics: null,
  loading: false,
  error: null,
  value: "",
  noReportFound: "",
};

const SupportSlice = createSlice({
  name: "SupportSlice",
  initialState,
  reducers: {
    setReportsStart: (state) => {
      state.loading = true;
    },
    setBugReports: (state, action) => {
      state.bugReports = action.payload;
      state.error = null;
      state.loading = false;
    },

    setReportsEnd: (state) => {
      state.loading = false;
    },
    setPriorityStatus: (state, action) => {
      state.priorityStatus = action.payload;
    },
    setSupportStatistics: (state, action) => {
      state.supportStatistics = action.payload;
    },
    setPriorityStatuses: (state, action) => {
      state.priorityStatuses = action.payload;
      state.error = null;
      state.loading = false;
    },
    setNoReportsFound: (state, action) => {
      state.noReportFound = action.payload;
    },
  },
});
export const {
  setReportsStart,
  setBugReports,
  setReportsEnd,
  setPriorityStatus,
  setSupportStatistics,
  setPriorityStatuses,
  setNoReportsFound,
} = SupportSlice.actions;

export default SupportSlice.reducer;
