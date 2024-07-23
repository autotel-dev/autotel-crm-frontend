import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vehicleModel: [],
  vehicleMake: [],
  filterVehiclesModel: [],
  activeInActiveVehiclesModel: "All",
  vehicleMakeId: null,
  loading: false,
  error: null,
  id: null,
  value: "",
  noVehicleModelFound: "",
  vehicleMakeName: "",
  isConnected: true,
};

const VehicleModelSlice = createSlice({
  name: "VehicleModelSlice",
  initialState,
  reducers: {
    setVehicleModelStart: (state) => {
      state.loading = true;
    },
    setVehicleModel: (state, action) => {
      state.vehicleModel = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterVehiclesModel: (state, action) => {
      state.filterVehiclesModel = action.payload;
      state.error = null;
      state.loading = false;
    },
    setInActiveActiveVehiclesModel: (state, action) => {
      state.activeInActiveVehiclesModel = action.payload;
    },
    setVehicleModelEnd: (state) => {
      state.loading = false;
    },
    setVehicleMake: (state, action) => {
      state.vehicleMake = action.payload;
      state.error = null;
      state.loading = false;
    },

    setVehicleMakeId: (state, action) => {
      state.vehicleMakeId = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoVehicleModelFound: (state, action) => {
      state.noVehicleModelFound = action.payload;
    },
    setVehicleMakeName: (state, action) => {
      state.vehicleMakeName = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setVehicleModelStart,
  setVehicleModel,
  setFilterVehiclesModel,
  setInActiveActiveVehiclesModel,
  setVehicleModelEnd,
  setVehicleMake,
  setVehicleMakeId,
  setNoVehicleModelFound,
  setId,
  setValue,
  setVehicleMakeName,
  setIsConnected
} = VehicleModelSlice.actions;

export default VehicleModelSlice.reducer;
