import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  liveAlerts: [],
  assignedAlerts: [],
  completedAlerts: [],
  modalData: null,
  loading: false,
  error: null,
  noCountryFound: "",
};

const AlertsSlice = createSlice({
  name: "AlertsSlice",
  initialState,
  reducers: {
    setAlertsStart: (state) => {
      state.loading = true;
    },
    setLiveAlerts: (state, action) => {
      state.liveAlerts = action.payload;
      state.error = null;
      state.loading = false;
    },
    setAssignedAlerts: (state, action) => {
      state.assignedAlerts = action.payload;
      state.error = null;
      state.loading = false;
    },
    setCompletedAlerts: (state, action) => {
      state.completedAlerts = action.payload;
      state.error = null;
      state.loading = false;
    },
    setModalData: (state, action) => {
      state.modalData = action.payload;
      state.error = null;
      state.loading = false;
    },

    setAlertsEnd: (state) => {
      state.loading = false;
    },

    setNoAlertsFound: (state, action) => {
      state.noCountryFound = action.payload;
    },
  },
});
export const {
  setLiveAlerts,
  setAlertsStart,
  setAssignedAlerts,
  setCompletedAlerts,
  setModalData,
  setAlertsEnd,
  setNoAlertsFound,
} = AlertsSlice.actions;

export default AlertsSlice.reducer;
