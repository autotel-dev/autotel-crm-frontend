import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vehicleMake: [],
  filterVehiclesMake: [],
  activeInActiveVehiclesMake: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noVehicleMakeFound: "",
  isConnected: true,
};

const VehicleMakeSlice = createSlice({
  name: "VehicleMakeSlice",
  initialState,
  reducers: {
    setVehicleMakeStart: (state) => {
      state.loading = true;
    },
    setVehicleMake: (state, action) => {
      state.vehicleMake = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterVehiclesMake: (state, action) => {
      state.filterVehiclesMake = action.payload;
      state.error = null;
      state.loading = false;
    },

    setVehicleMakeEnd: (state) => {
      state.loading = false;
    },
    setInActiveActiveVehiclesMake: (state, action) => {
      state.activeInActiveVehiclesMake = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoVehicleMakeFound: (state, action) => {
      state.noVehicleMakeFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setVehicleMake,
  setFilterVehiclesMake,
  setVehicleMakeStart,
  setVehicleMakeEnd,
  setInActiveActiveVehiclesMake,
  setId,
  setValue,
  setNoVehicleMakeFound,
  setIsConnected
} = VehicleMakeSlice.actions;

export default VehicleMakeSlice.reducer;
