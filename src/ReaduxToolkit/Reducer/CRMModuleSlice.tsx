import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  crmModules: [],
  crmActiveModules: [],
  filterCrmModules: [],
  activeInActiveModules: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noModuleFound: "",
  isConnected: true,
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
    setActiveCRMModules: (state, action) => {
      state.crmActiveModules = action.payload;
    },

    setFilterCRMModules: (state, action) => {
      state.filterCrmModules = action.payload;
      state.error = null;
      state.loading = false;
    },
    setInActiveActiveModules: (state, action) => {
      state.activeInActiveModules = action.payload;
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
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setCRMModules,
  setActiveCRMModules,
  setFilterCRMModules,
  setInActiveActiveModules,
  setCRMModulesStart,
  setCRMModulesEnd,
  setId,
  setValue,
  setNoModuleFound,
  setIsConnected
} = CRMModulesSlice.actions;

export default CRMModulesSlice.reducer;
