import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bugReports: [],
  priorityStatuses: [],
  priorityStatus: null,
  statuses: null,
  supportStatistics: null,
  tableRow: null,
  ticketDetails: null,
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
    setTableRow: (state, action) => {
      state.tableRow = action.payload;
    },
    setTicketDetails: (state, action) => {
      state.ticketDetails = action.payload;
    },
    setPriorityStatuses: (state, action) => {
      state.priorityStatuses = action.payload;
    },
    setStatuses: (state, action) => {
      state.statuses = action.payload;
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
  setTableRow,
  setTicketDetails,
  setPriorityStatuses,
  setStatuses,
  setNoReportsFound,
} = SupportSlice.actions;

export default SupportSlice.reducer;
