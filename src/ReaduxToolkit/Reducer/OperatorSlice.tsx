import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  operators: [],
  filterOperators: [],
  activeInActiveOperators: "All",
  branches: [],
  loading: false,
  error: null,
  id: null,
  value: "",
  noCountryFound: "",
  isConnected: true,
};

const OpearatorSlice = createSlice({
  name: "OpearatorSlice",
  initialState,
  reducers: {
    setOperatorsStart: (state) => {
      state.loading = true;
    },
    setOperators: (state, action) => {
      state.operators = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterOperators: (state, action) => {
      state.filterOperators = action.payload;
      state.error = null;
      state.loading = false;
    },
    setInActiveActiveUsers: (state, action) => {
      state.activeInActiveOperators = action.payload;
    },
    setOperatorsEnd: (state) => {
      state.loading = false;
    },
    setBranches: (state, action) => {
      state.branches = action.payload;

    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoCountryFound: (state, action) => {
      state.noCountryFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setOperators,
  setFilterOperators,
  setInActiveActiveUsers,
  setOperatorsStart,
  setOperatorsEnd,
  setBranches,
  setId,
  setValue,
  setNoCountryFound,
  setIsConnected
} = OpearatorSlice.actions;

export default OpearatorSlice.reducer;
