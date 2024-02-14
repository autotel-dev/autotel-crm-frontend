import { createSlice } from "@reduxjs/toolkit";
import { getAll } from "../../Api";

const initialState = {
  operators: [],
  filterOperators: [],
  loading: false,
  error: null,
  id: null,
  value: "",
  noCountryFound: "",
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
    setOperatorsEnd: (state) => {
      state.loading = false;
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
  },
});
export const {
  setOperators,
  setFilterOperators,
  setOperatorsStart,
  setOperatorsEnd,
  setId,
  setValue,
  setNoCountryFound,
} = OpearatorSlice.actions;

export default OpearatorSlice.reducer;
