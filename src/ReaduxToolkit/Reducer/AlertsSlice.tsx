import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  liveAlerts: [],
  loading: false,
  error: null,
  noCountryFound: "",
};

const AlertsSlice = createSlice({
  name: "CitiesSlice",
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
    setAlertsEnd: (state) => {
      state.loading = false;
    },
    setNoAlertsFound: (state, action) => {
      state.noCountryFound = action.payload;
    },
  },
});
export const { setLiveAlerts, setAlertsStart, setAlertsEnd, setNoAlertsFound } =
  AlertsSlice.actions;

export default AlertsSlice.reducer;
