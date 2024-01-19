import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createCompany: {},
  companies: [],
  servers: [],
  crmModules: [],
  serversAddItemsList: [],
  filterCompanies: [],
  serverCredentials: [],
  allowedModules: [],
  server: {},
  loading: false,
  error: null,
  noDataFound: "",
};

const CompanySlice = createSlice({
  name: "CompanySlice",
  initialState,
  reducers: {
    setCreateCompany: (state, action) => {
      state.createCompany = action.payload;
    },
    setCompaniesStart: (state) => {
      state.loading = true;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterCompanies: (state, action) => {
      state.filterCompanies = action.payload;
      state.error = null;
      state.loading = false;
    },
    setCompaniesEnd: (state) => {
      state.loading = false;
    },
    setServers: (state, action) => {
      state.servers = action.payload;
      state.error = null;
      state.loading = false;
    },

    setCRMModules: (state, action) => {
      state.crmModules = action.payload;
      state.error = null;
      state.loading = false;
    },
    setServersAddItemsList: (state, action) => {
      state.serversAddItemsList = action.payload;
      state.error = null;
      state.loading = false;
    },

    setServer: (state, action) => {
      state.server = action.payload;
    },
    setServerCredentials: (state, action) => {
      state.serverCredentials = action.payload;
      state.error = null;
      state.loading = false;
    },
    setAllowedModules: (state, action) => {
      state.allowedModules = action.payload;
      state.error = null;
      state.loading = false;
    },
    setNoDataFound: (state, action) => {
      state.noDataFound = action.payload;
    },
  },
});
export const {
  setCreateCompany,
  setCompaniesStart,
  setCompanies,
  setFilterCompanies,
  setCompaniesEnd,
  setServers,
  setCRMModules,
  setServersAddItemsList,
  setServer,
  setServerCredentials,
  setAllowedModules,
  setNoDataFound,
} = CompanySlice.actions;

export default CompanySlice.reducer;
