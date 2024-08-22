import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  warehouse: [],
  branches: [],
  filterWarehouses: [],
  userPermissions: [],
  activeInActiveWarehouses: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noWarehouseFound: "",
  isConnected: true,
};

const WarehouseSlice = createSlice({
  name: "WarehouseSlice",
  initialState,
  reducers: {
    setWarehouseStart: (state) => {
      state.loading = true;
    },
    setWarehouse: (state, action) => {
      state.warehouse = action.payload;
      state.error = null;
      state.loading = false;
    },
    setBranches: (state, action) => {
      state.branches = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterWarehouses: (state, action) => {
      state.filterWarehouses = action.payload;
      state.error = null;
      state.loading = false;
    },
    setInActiveActiveWarehouses: (state, action) => {
      state.activeInActiveWarehouses = action.payload;
    },
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload;
      state.error = null;
      state.loading = false;
    },
    setWarehouseEnd: (state) => {
      state.loading = false;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoWarehouseFound: (state, action) => {
      state.noWarehouseFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setWarehouse,
  setBranches,
  setFilterWarehouses,
  setInActiveActiveWarehouses,
  setWarehouseStart,
  setWarehouseEnd,
  setUserPermissions,
  setId,
  setValue,
  setNoWarehouseFound,
  setIsConnected
} = WarehouseSlice.actions;

export default WarehouseSlice.reducer;
