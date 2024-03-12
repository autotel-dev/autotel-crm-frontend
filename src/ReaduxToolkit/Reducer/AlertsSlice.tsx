import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  liveAlerts: [],
  liveAlertsData: null,
  assignedAlerts: [],
  completedAlerts: [],
  modalData: null,
  loading: false,
  error: null,
  noCountryFound: "",
  isConnected: true,
};

const AlertsSlice = createSlice({
  name: "AlertsSlice",
  initialState,
  reducers: {
    setAlertsStart: (state) => {
      state.loading = true;
    },
    setLiveAlertsData: (state, action) => {
      state.liveAlertsData = action.payload;
      state.error = null;
      state.loading = false;
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
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setLiveAlerts,
  setLiveAlertsData,
  setAlertsStart,
  setAssignedAlerts,
  setCompletedAlerts,
  setModalData,
  setAlertsEnd,
  setNoAlertsFound,
  setIsConnected
} = AlertsSlice.actions;

export default AlertsSlice.reducer;
