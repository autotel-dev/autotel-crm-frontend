import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  devices: [],
  serverDevices:[],
  noDevicesFound: "",
  loading: false,
  error: null,
};

const MonitoringSlice = createSlice({
  name: "CitiesSlice",
  initialState,
  reducers: {
    setDevicesStart: (state) => {
      state.loading = true;
    },
    setDevices: (state, action) => {
      state.devices = action.payload;
      state.error = null;
      state.loading = false;
    },

    setServerDevices:(state, action)=>{
      state.serverDevices = action.payload
      state.error = null;
      state.loading = false;
    },

    setDevicesEnd: (state) => {
      state.loading = false;
    },

    setNoDevicesFound: (state, action) => {
      state.noDevicesFound = action.payload;
    },
  },
});
export const { setDevices, setDevicesStart, setDevicesEnd, setNoDevicesFound, setServerDevices } =
  MonitoringSlice.actions;

export default MonitoringSlice.reducer;
