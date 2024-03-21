import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  devices: [],
  serverDevices: [],
  selectedDevices: [],
  devicesStatuses: [],
  noDevicesFound: "",
  loading: false,
  error: null,
  expandedDevice: null,
  isConnected: true,
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

    setServerDevices: (state, action) => {
      state.serverDevices = action.payload;
      state.error = null;
      state.loading = false;
    },
    setSelecetdDevices: (state, action) => {
      state.selectedDevices = action.payload;
      state.error = null;
      state.loading = false;
    },
    setDevicesStatuses: (state, action) => {
      state.devicesStatuses = action.payload;
      state.error = null;
      state.loading = false;
    },
    setExpandedDevice: (state, action) => {
      state.expandedDevice = action.payload;
    },

    setDevicesEnd: (state) => {
      state.loading = false;
    },

    setNoDevicesFound: (state, action) => {
      state.noDevicesFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setDevices,
  setDevicesStart,
  setDevicesEnd,
  setNoDevicesFound,
  setServerDevices,
  setSelecetdDevices,
  setDevicesStatuses,
  setExpandedDevice,
  setIsConnected
} = MonitoringSlice.actions;

export default MonitoringSlice.reducer;
