import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createCompany: {},
  companies: [],
  servers: [],
  crmModules: [],
  permissions: [],
  cities: [],
  packages: [],
  timezones: [],
  serversAddItemsList: [],
  filterCompanies: [],
  serverCredentials: [],
  allowedModules: [],
  server: {},
  company: {},
  loading: false,
  error: null,
  noCompanyFound: "",
  cnicFront: null,
  cnicBack: null,
  ntnFile: null,
  ptaCertificate: null,
  other: null,
  imageBackground: null,
  companyLogo: null,
  isConnected: true,
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
    setTimeZones: (state, action) => {
      state.timezones = action.payload;
      state.error = null;
      state.loading = false;
    },

    setCRMModules: (state, action) => {
      state.crmModules = action.payload;
      state.error = null;
      state.loading = false;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
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
    setCompany: (state, action) => {
      state.company = action.payload;
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
    setNoCompanyFound: (state, action) => {
      state.noCompanyFound = action.payload;
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
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
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
  setTimeZones,
  setCRMModules,
  setPermissions,
  setCities,
  setPackages,
  setServersAddItemsList,
  setServer,
  setCompany,
  setServerCredentials,
  setAllowedModules,
  setNoCompanyFound,
  setCNICFront,
  setCNICBack,
  setNTNFile,
  setPTACertificate,
  setOther,
  setImageBackground,
  setComapnyLogo,
  setIsConnected,
} = CompanySlice.actions;

export default CompanySlice.reducer;
