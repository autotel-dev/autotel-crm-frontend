import { createSlice } from "@reduxjs/toolkit";
import { getAll } from "../../Api";

const initialState = {
  crmModules: [],
  filterCrmModules: [],
  loading: false,
  error: null,
  id: null,
  value: "",
  noModuleFound: "",
};

const CRMModulesSlice = createSlice({
  name: "CRMModulesSlice",
  initialState,
  reducers: {
    setCRMModulesStart: (state) => {
      state.loading = true;
    },
    setCRMModules: (state, action) => {
      state.crmModules = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterCRMModules: (state, action) => {
      state.filterCrmModules = action.payload;
      state.error = null;
      state.loading = false;
    },
    setCRMModulesEnd: (state) => {
      state.loading = false;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoModuleFound: (state, action) => {
      state.noModuleFound = action.payload;
    },
  },
});
export const {
  setCRMModules,
  setFilterCRMModules,
  setCRMModulesStart,
  setCRMModulesEnd,
  setId,
  setValue,
  setNoModuleFound,
} = CRMModulesSlice.actions;

export default CRMModulesSlice.reducer;
