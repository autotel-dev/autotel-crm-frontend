import { createSlice } from "@reduxjs/toolkit";
import { getAll } from "../../Api";

const initialState = {
  crmModules: [],
  filterCrmModules: [],
  loading: false,
  error: null,
  id: null,
  value: "",
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
  },
});
export const {
  setCRMModules,
  setFilterCRMModules,
  setCRMModulesStart,
  setCRMModulesEnd,
  setId,
  setValue,
} = CRMModulesSlice.actions;

export default CRMModulesSlice.reducer;
