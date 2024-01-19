import { createSlice } from "@reduxjs/toolkit";
import { getAll } from "../../Api";

const initialState = {
  serverHealthStatistics: {},
  loading: false,
  error: null,
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
  },
});
export const {
  setServerManagementStart,
  setServerManagement,
  setServerManagementEnd,
} = ServerManagementSlice.actions;

export default ServerManagementSlice.reducer;
