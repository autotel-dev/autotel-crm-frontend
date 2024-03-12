import { createSlice } from "@reduxjs/toolkit";
import { getAll } from "../../Api";

const initialState = {
  serverHealthStatistics: {},
  recentLogs: [],
  loading: false,
  error: null,
  getTime: "",
  isConnected: true,
};

const ServerManagementSlice = createSlice({
  name: "ServerManagementSlice",
  initialState,
  reducers: {
    setServerManagementStart: (state) => {
      state.loading = true;
    },
    setServerManagement: (state, action) => {
      state.serverHealthStatistics = action.payload;
      state.error = null;
      state.loading = false;
    },

    setServerManagementEnd: (state) => {
      state.loading = false;
    },
    setTime: (state, action) => {
      state.getTime = action.payload;
    },
    setRecentLogs: (state, action) => {
      state.recentLogs = action.payload;
      state.error = null;
      state.loading = false;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setServerManagementStart,
  setServerManagement,
  setServerManagementEnd,
  setTime,
  setRecentLogs,
  setIsConnected
} = ServerManagementSlice.actions;

export default ServerManagementSlice.reducer;
