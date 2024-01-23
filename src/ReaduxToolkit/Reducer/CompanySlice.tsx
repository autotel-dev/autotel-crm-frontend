import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createCompany: {},
  companies: [],
  servers: [],
  crmModules: [],
  cities: [],
  packages: [],
  serversAddItemsList: [],
  filterCompanies: [],
  serverCredentials: [],
  allowedModules: [],
  server: {},
  loading: false,
  error: null,
  noDataFound: "",
  cnicFront: null,
  cnicBack: null,
  ntnFile: null,
  ptaCertificate: null,
  other: null,
  imageBackground: null,
  companyLogo: null,
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
    setCities: (state, action) => {
      state.cities = action.payload;
      state.error = null;
      state.loading = false;
    },

    setPackages: (state, action) => {
      state.packages = action.payload;
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
    setCNICFront: (state, action) => {
      state.cnicFront = action.payload;
    },

    setCNICBack: (state, action) => {
      state.cnicBack = action.payload;
    },
    setNTNFile: (state, action) => {
      state.ntnFile = action.payload;
    },
    setPTACertificate: (state, action) => {
      state.ptaCertificate = action.payload;
    },
    setOther: (state, action) => {
      state.other = action.payload;
    },
    setImageBackground: (state, action) => {
      state.imageBackground = action.payload;
    },
    setComapnyLogo: (state, action) => {
      state.companyLogo = action.payload;
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
  setCities,
  setPackages,
  setServersAddItemsList,
  setServer,
  setServerCredentials,
  setAllowedModules,
  setNoDataFound,
  setCNICFront,
  setCNICBack,
  setNTNFile,
  setPTACertificate,
  setOther,
  setImageBackground,
  setComapnyLogo,
} = CompanySlice.actions;

export default CompanySlice.reducer;
