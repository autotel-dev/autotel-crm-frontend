import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alertRules: [],
  filterAlertRules: [],
  activeInActiveAlertRules: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noAlertRuleFound: "",
  isConnected: true,
};

const AlertRuleSlice = createSlice({
  name: "AlertRuleSlice",
  initialState,
  reducers: {
    setAlertRuleStart: (state) => {
      state.loading = true;
    },
    setAlertRules: (state, action) => {
      state.alertRules = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterAlertRules: (state, action) => {
      state.filterAlertRules = action.payload;
      state.error = null;
      state.loading = false;
    },
    setInActiveActiveAlertRules: (state, action) => {
      state.activeInActiveAlertRules = action.payload;
    },
    setAlertRuleEnd: (state) => {
      state.loading = false;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoAlertRuleFound: (state, action) => {
      state.noAlertRuleFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const {
  setAlertRules,
  setFilterAlertRules,
  setInActiveActiveAlertRules,
  setAlertRuleStart,
  setAlertRuleEnd,
  setId,
  setValue,
  setNoAlertRuleFound,
  setIsConnected,
} = AlertRuleSlice.actions;

export default AlertRuleSlice.reducer;
